import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { categories } from "@/lib/catalog";
import {
  APK_PUBLIC_COLUMNS,
  formatBytes,
  hasZipSignature,
  safeFileName,
  uploadWithProgress,
  validateApkFile,
  validateApkMeta,
  validateIconFile,
  type ApkApp,
} from "@/lib/apk";

export const Route = createFileRoute("/_authenticated/admin/apps")({
  head: () => ({
    meta: [
      { title: "مدیریت برنامه‌ها | پروژه‌خانه" },
      { name: "description", content: "آپلود و انتشار فایل‌های APK برای مدیران." },
      { property: "og:title", content: "مدیریت برنامه‌ها | پروژه‌خانه" },
      { property: "og:description", content: "پنل مدیریت APK." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminApps,
});

const input = "mt-1 w-full rounded-md border bg-background px-3 py-2";

function AdminApps() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const role = useQuery({
    queryKey: ["is-admin"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      const { data } = await supabase.rpc("has_role", { _user_id: u.user!.id, _role: "admin" });
      return Boolean(data);
    },
  });
  const list = useQuery({
    queryKey: ["apk-admin"],
    enabled: role.data === true,
    queryFn: async () => {
      const { data, error } = await supabase.from("apk_apps").select(APK_PUBLIC_COLUMNS).order("updated_at", { ascending: false });
      if (error) throw error;
      return data as ApkApp[];
    },
  });
  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["apk-admin"] });
    qc.invalidateQueries({ queryKey: ["apk-published"] });
  };
  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  if (role.isLoading) return <div className="site-container page-main">در حال بررسی دسترسی…</div>;
  if (!role.data)
    return (
      <div className="site-container page-main space-y-3">
        <h1 className="text-xl font-bold">دسترسی ندارید</h1>
        <p className="text-muted-foreground">این بخش فقط برای مدیران است.</p>
        <Button variant="outline" onClick={signOut}>خروج</Button>
      </div>
    );

  return (
    <div className="site-container page-main space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">مدیریت برنامه‌های APK</h1>
        <Button variant="outline" onClick={signOut}>خروج</Button>
      </div>
      <UploadForm onDone={refresh} />
      <section className="space-y-3">
        <h2 className="text-lg font-bold">برنامه‌ها</h2>
        {list.isLoading && <p>در حال بارگذاری…</p>}
        {list.data?.length === 0 && <p className="text-muted-foreground">هنوز برنامه‌ای اضافه نشده.</p>}
        {list.data?.map((a) => <AdminRow key={a.id} app={a} onChange={refresh} />)}
      </section>
    </div>
  );
}

function UploadForm({ onDone }: { onDone: () => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [version, setVersion] = useState("1.0.0");
  const [category, setCategory] = useState("mobile");
  const [apk, setApk] = useState<File | null>(null);
  const [icon, setIcon] = useState<File | null>(null);
  const [publish, setPublish] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSuccess("");
    const meta = validateApkMeta(name, version);
    const errs = [meta.name, meta.version];
    if (!apk) errs.push("فایل APK را انتخاب کنید.");
    else {
      errs.push(validateApkFile(apk));
      if (!validateApkFile(apk) && !(await hasZipSignature(apk))) errs.push("این فایل یک APK معتبر نیست.");
    }
    if (icon) errs.push(validateIconFile(icon));
    const real = errs.filter(Boolean);
    setErrors(real);
    if (real.length || !apk) return;

    const { data: s } = await supabase.auth.getSession();
    const token = s.session?.access_token;
    if (!token) return setErrors(["نشست شما منقضی شده؛ دوباره وارد شوید."]);
    const id = crypto.randomUUID();
    const filePath = `${id}/${safeFileName(apk.name)}`;
    let iconPath: string | null = null;
    try {
      setProgress(0);
      if (icon) {
        iconPath = `${id}/icon-${safeFileName(icon.name)}`;
        const { error } = await supabase.storage.from("app-icons").upload(iconPath, icon, { contentType: icon.type });
        if (error) throw new Error("آپلود آیکون ناموفق بود.");
      }
      await uploadWithProgress({ bucket: "apks", path: filePath, file: apk, accessToken: token, onProgress: setProgress });
      const { error } = await supabase.from("apk_apps").insert({
        id,
        name: name.trim(),
        description: description.trim(),
        version: version.trim(),
        category,
        file_path: filePath,
        file_size: apk.size,
        icon_path: iconPath,
        status: publish ? "published" : "draft",
      });
      if (error) {
        await supabase.storage.from("apks").remove([filePath]);
        if (iconPath) await supabase.storage.from("app-icons").remove([iconPath]);
        throw new Error("ذخیرهٔ اطلاعات برنامه ناموفق بود.");
      }
      setSuccess(publish ? "برنامه منتشر شد." : "برنامه به‌صورت پیش‌نویس ذخیره شد.");
      setName("");
      setDescription("");
      setApk(null);
      setIcon(null);
      (e.target as HTMLFormElement).reset();
      onDone();
    } catch (err) {
      setErrors([err instanceof Error ? err.message : "خطای ناشناخته"]);
    } finally {
      setProgress(null);
    }
  }

  const busy = progress !== null;
  return (
    <form onSubmit={submit} className="grid gap-4 rounded-xl border bg-card p-5 md:grid-cols-2" noValidate>
      <h2 className="text-lg font-bold md:col-span-2">افزودن برنامهٔ جدید</h2>
      <label className="text-sm">نام برنامه<input className={input} value={name} onChange={(e) => setName(e.target.value)} maxLength={120} /></label>
      <label className="text-sm">نسخه<input dir="ltr" className={input} value={version} onChange={(e) => setVersion(e.target.value)} /></label>
      <label className="text-sm">دسته‌بندی
        <select className={input} value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
      </label>
      <label className="text-sm">فایل APK (حداکثر ۲۰۰ مگابایت)
        <input type="file" accept=".apk,application/vnd.android.package-archive" className={input} onChange={(e) => setApk(e.target.files?.[0] ?? null)} />
        {apk && <span className="text-xs text-muted-foreground">{formatBytes(apk.size)}</span>}
      </label>
      <label className="text-sm">آیکون (اختیاری، PNG/JPG/WEBP تا ۲ مگابایت)
        <input type="file" accept="image/png,image/jpeg,image/webp" className={input} onChange={(e) => setIcon(e.target.files?.[0] ?? null)} />
      </label>
      <label className="flex items-center gap-2 self-end text-sm">
        <input type="checkbox" checked={publish} onChange={(e) => setPublish(e.target.checked)} /> انتشار فوری (در غیر این صورت پیش‌نویس)
      </label>
      <label className="text-sm md:col-span-2">توضیحات<textarea className={input} rows={3} value={description} onChange={(e) => setDescription(e.target.value)} maxLength={4000} /></label>
      {busy && (
        <div className="md:col-span-2" aria-live="polite">
          <progress className="w-full" max={100} value={progress ?? 0} />
          <span className="text-sm">در حال آپلود… {progress}٪</span>
        </div>
      )}
      {errors.length > 0 && <ul role="alert" className="list-disc ps-5 text-sm text-destructive md:col-span-2">{errors.map((x) => <li key={x}>{x}</li>)}</ul>}
      {success && <p role="status" className="text-sm text-primary md:col-span-2">{success}</p>}
      <Button type="submit" disabled={busy} className="md:col-span-2">{busy ? "در حال آپلود…" : "ذخیره"}</Button>
    </form>
  );
}

function AdminRow({ app, onChange }: { app: ApkApp; onChange: () => void }) {
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState(app.name);
  const [version, setVersion] = useState(app.version);
  const [description, setDescription] = useState(app.description);
  const [error, setError] = useState("");
  async function update(patch: Partial<ApkApp>) {
    setError("");
    const { error } = await supabase.from("apk_apps").update(patch).eq("id", app.id);
    if (error) return setError("تغییر ذخیره نشد.");
    setEdit(false);
    onChange();
  }
  async function remove() {
    if (!confirm(`«${app.name}» حذف شود؟`)) return;
    const { error } = await supabase.from("apk_apps").delete().eq("id", app.id);
    if (error) return setError("حذف ناموفق بود.");
    await supabase.storage.from("apks").remove([app.file_path]);
    if (app.icon_path) await supabase.storage.from("app-icons").remove([app.icon_path]);
    onChange();
  }
  return (
    <div className="rounded-lg border bg-card p-4">
      {edit ? (
        <div className="grid gap-2 md:grid-cols-2">
          <input className={input} value={name} onChange={(e) => setName(e.target.value)} />
          <input dir="ltr" className={input} value={version} onChange={(e) => setVersion(e.target.value)} />
          <textarea className={`${input} md:col-span-2`} value={description} onChange={(e) => setDescription(e.target.value)} />
          <div className="flex gap-2">
            <Button size="sm" onClick={() => {
              const m = validateApkMeta(name, version);
              if (m.name || m.version) return setError(m.name || m.version);
              update({ name: name.trim(), version: version.trim(), description: description.trim() });
            }}>ذخیره</Button>
            <Button size="sm" variant="outline" onClick={() => setEdit(false)}>انصراف</Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <strong>{app.name}</strong> <span dir="ltr" className="text-sm">{app.version}</span>
            <span className="ms-2 rounded bg-muted px-2 py-0.5 text-xs">{app.status === "published" ? "منتشرشده" : "پیش‌نویس"}</span>
            <div className="text-xs text-muted-foreground">{formatBytes(app.file_size)}</div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={() => update({ status: app.status === "published" ? "draft" : "published" })}>
              {app.status === "published" ? "برگرداندن به پیش‌نویس" : "انتشار"}
            </Button>
            <Button size="sm" variant="outline" onClick={() => setEdit(true)}>ویرایش</Button>
            <Button size="sm" variant="destructive" onClick={remove}>حذف</Button>
          </div>
        </div>
      )}
      {error && <p role="alert" className="mt-2 text-sm text-destructive">{error}</p>}
    </div>
  );
}
