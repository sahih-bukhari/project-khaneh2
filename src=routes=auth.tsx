import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

// The database grants admin rights only to this confirmed email; this check just gives a friendly message.
const OWNER_EMAIL = "frdaws.samad@gmail.com";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "ورود مدیر | پروژه‌خانه" },
      { name: "description", content: "ورود مدیر پروژه‌خانه برای آپلود اپلیکیشن." },
      { property: "og:title", content: "ورود مدیر | پروژه‌خانه" },
      { property: "og:description", content: "ورود مدیر پروژه‌خانه." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

const input = "mt-1 w-full rounded-md border bg-background px-3 py-2";

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setInfo("");
    const mail = email.trim().toLowerCase();
    if (mail !== OWNER_EMAIL) return setError("این بخش فقط برای مدیر سایت است.");
    setBusy(true);
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email: mail, password });
      setBusy(false);
      if (error) return setError("ایمیل یا رمز عبور درست نیست، یا ایمیل هنوز تأیید نشده.");
      navigate({ to: "/admin/apps" });
    } else {
      if (password.length < 8) {
        setBusy(false);
        return setError("رمز باید حداقل ۸ حرف باشد.");
      }
      const { error } = await supabase.auth.signUp({
        email: mail,
        password,
        options: { emailRedirectTo: `${window.location.origin}/admin/apps` },
      });
      setBusy(false);
      if (error) return setError("ساخت رمز ناموفق بود. شاید قبلاً رمز ساخته‌اید؛ وارد شوید.");
      setInfo("ایمیلی برایتان فرستاده شد. روی لینک تأیید بزنید، سپس با همین رمز وارد شوید.");
      setMode("in");
    }
  }

  return (
    <div className="site-container page-main">
      <form onSubmit={submit} className="mx-auto max-w-sm space-y-4 rounded-xl border bg-card p-6">
        <h1 className="text-xl font-bold">{mode === "in" ? "ورود مدیر" : "ساخت رمز مدیر (بار اول)"}</h1>
        <p className="text-sm text-muted-foreground">آپلود اپلیکیشن فقط با ایمیل و رمز مدیر ممکن است.</p>
        <label className="block text-sm">
          ایمیل
          <input dir="ltr" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={input} />
        </label>
        <label className="block text-sm">
          رمز عبور
          <input dir="ltr" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className={input} />
        </label>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        {info && <p role="status" className="text-sm text-primary">{info}</p>}
        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? "لطفاً صبر کنید…" : mode === "in" ? "ورود" : "ساخت رمز"}
        </Button>
        <button type="button" className="w-full text-sm text-muted-foreground underline" onClick={() => setMode(mode === "in" ? "up" : "in")}>
          {mode === "in" ? "بار اول است؟ رمز بسازید" : "رمز دارید؟ وارد شوید"}
        </button>
      </form>
    </div>
  );
}
