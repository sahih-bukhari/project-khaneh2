import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Download, Plus, Smartphone } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { APK_PUBLIC_COLUMNS, formatBytes, safeFileName, type ApkApp } from "@/lib/apk";

async function fetchPublished() {
  const { data, error } = await supabase
    .from("apk_apps")
    .select(APK_PUBLIC_COLUMNS)
    .eq("status", "published")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  const apps = (data ?? []) as ApkApp[];
  const iconPaths = apps.map((a) => a.icon_path).filter((p): p is string => !!p);
  const icons: Record<string, string> = {};
  if (iconPaths.length) {
    const { data: signed } = await supabase.storage.from("app-icons").createSignedUrls(iconPaths, 3600);
    signed?.forEach((s) => s.path && s.signedUrl && (icons[s.path] = s.signedUrl));
  }
  return { apps, icons };
}

export function AppsList({ query = "" }: { query?: string }) {
  const q = useQuery({ queryKey: ["apk-published"], queryFn: fetchPublished });
  const term = query.trim().toLowerCase();
  const apps = (q.data?.apps ?? []).filter(
    (a) => !term || a.name.toLowerCase().includes(term) || a.description.toLowerCase().includes(term),
  );
  if (q.isLoading) return <p className="text-muted-foreground">در حال بارگذاری…</p>;
  if (q.isError)
    return <p role="alert" className="text-destructive">فهرست اپلیکیشن‌ها بارگذاری نشد. دوباره تلاش کنید.</p>;
  if (!apps.length)
    return (
      <div className="rounded-xl border border-dashed bg-card p-8 text-center">
        <Smartphone className="mx-auto mb-3 text-muted-foreground" />
        <h3 className="font-bold">{term ? "اپلیکیشنی با این نام پیدا نشد" : "هنوز اپلیکیشنی منتشر نشده"}</h3>
        <p className="mt-1 text-sm text-muted-foreground">اپلیکیشن‌ها پس از آپلود توسط مدیر اینجا نمایش داده می‌شوند.</p>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/admin/apps"><Plus /> افزودن اپلیکیشن (مدیر)</Link>
        </Button>
      </div>
    );
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {apps.map((a) => (
        <AppCard key={a.id} app={a} icon={a.icon_path ? q.data!.icons[a.icon_path] : undefined} />
      ))}
    </div>
  );
}

function AppCard({ app, icon }: { app: ApkApp; icon?: string | undefined }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function download() {
    setBusy(true);
    setError("");
    const { data, error } = await supabase.storage
      .from("apks")
      .createSignedUrl(app.file_path, 120, { download: safeFileName(`${app.name}-${app.version}.apk`) });
    setBusy(false);
    if (error || !data) return setError("لینک دانلود ساخته نشد. دوباره تلاش کنید.");
    window.location.href = data.signedUrl;
  }
  return (
    <article className="rounded-xl border bg-card p-5">
      <div className="flex items-center gap-3">
        {icon ? (
          <img src={icon} alt="" className="size-12 rounded-lg object-cover" loading="lazy" />
        ) : (
          <div className="grid size-12 place-items-center rounded-lg bg-muted"><Smartphone /></div>
        )}
        <div>
          <h3 className="font-bold">{app.name}</h3>
          <p className="text-sm text-muted-foreground">
            نسخهٔ <span dir="ltr">{app.version}</span> · {formatBytes(app.file_size)}
          </p>
        </div>
      </div>
      {app.description && <p className="mt-3 text-sm text-muted-foreground">{app.description}</p>}
      <Button className="mt-4 w-full" onClick={download} disabled={busy}>
        <Download /> {busy ? "در حال آماده‌سازی…" : "دانلود APK"}
      </Button>
      {error && <p role="alert" className="mt-2 text-sm text-destructive">{error}</p>}
    </article>
  );
}
