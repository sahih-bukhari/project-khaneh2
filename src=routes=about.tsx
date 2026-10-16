import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, FolderHeart, GraduationCap, Send, ShieldCheck } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { PageHeading } from "@/components/library/common";
import { validateContact } from "@/lib/catalog";
export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "دربارهٔ ما و تماس | پروژه‌خانه" },
      { name: "description", content: "با ایدهٔ پروژه‌خانه آشنا شوید و فرم تماس نمونه را ببینید." },
      { property: "og:title", content: "دربارهٔ ما و تماس | پروژه‌خانه" },
      {
        property: "og:description",
        content: "خانه‌ای برای یادگیری، ایده‌ها و منابع دیجیتال مفید.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});
function AboutPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({ name: "", email: "", message: "" });
  const [success, setSuccess] = useState(false);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = validateContact(name, email, message);
    setErrors(result);
    if (Object.values(result).every((value) => !value)) setSuccess(true);
  }
  return (
    <div className="site-container page-main">
      <PageHeading
        title="یک خانه برای ایده‌های تازه"
        subtitle="پروژه‌خانه؛ پروژه‌های مفید، یک‌جا."
      />
      <div className="about-layout">
        <section className="about-content">
          <h2>دربارهٔ پروژه‌خانه</h2>
          <p>
            گاهی برای شروع یک پروژه، فقط به یک ایدهٔ خوب و یک نمونهٔ روشن نیاز داریم. پروژه‌خانه با
            همین فکر شکل گرفته است: جایی ساده و منظم برای کشف منابع دیجیتال و یادگیری از پروژه‌ها.
          </p>
          <p>
            این نسخه، یک کتابخانهٔ نمونه برای دانشجویان، توسعه‌دهندگان و علاقه‌مندان طراحی است. همهٔ
            پروژه‌ها و مشخصات فایل‌ها نمونه‌اند؛ فایل واقعی هنوز برای دانلود اضافه نشده است.
          </p>
          <div className="about-point">
            <GraduationCap />
            <div>
              <h3>برای یادگیری و تجربه</h3>
              <p>منابعی برای الهام‌گرفتن و پیدا کردن مسیر پروژهٔ بعدی.</p>
            </div>
          </div>
          <div className="about-point">
            <FolderHeart />
            <div>
              <h3>انتخاب‌های شما، کنار هم</h3>
              <p>علاقه‌مندی‌ها فقط در مرورگر خودتان نگه داشته می‌شوند.</p>
            </div>
          </div>
          <div className="about-point">
            <ShieldCheck />
            <div>
              <h3>شفاف و بدون وعدهٔ نادرست</h3>
              <p>در این نسخه حساب کاربری، ارسال پیام و دانلود واقعی فعال نیست.</p>
            </div>
          </div>
        </section>
        <section aria-labelledby="contact-title">
          {success ? (
            <div className="success-feedback" role="status">
              <CheckCircle2 />
              <h2>فرم با موفقیت بررسی شد</h2>
              <p>
                تشکر، {name.trim()}! اطلاعات فرم معتبر است. این نسخه نمونه است؛ پیام شما ارسال یا
                ذخیره نشده و پاسخی از طریق ایمیل دریافت نخواهید کرد.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSuccess(false);
                  setName("");
                  setEmail("");
                  setMessage("");
                }}
              >
                نوشتن پیام تازه
              </Button>
            </div>
          ) : (
            <>
              <h2 id="contact-title" className="text-xl font-bold mb-3">
                با ما در تماس باشید
              </h2>
              <p className="form-notice mb-6">
                این فرم نمونه است. پیام در همین صفحه بررسی می‌شود و برای کسی ارسال نمی‌شود.
              </p>
              <form className="contact-form" noValidate onSubmit={submit}>
                <div className="form-field">
                  <label htmlFor="contact-name">
                    نام شما <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="contact-name"
                    className="form-input"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="نام و تخلص"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "name-error" : undefined}
                  />
                  {errors.name && (
                    <span id="name-error" className="field-error" role="alert">
                      {errors.name}
                    </span>
                  )}
                </div>
                <div className="form-field">
                  <label htmlFor="contact-email">
                    ایمیل <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="contact-email"
                    className="form-input"
                    type="email"
                    autoComplete="email"
                    required
                    dir="ltr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                  {errors.email && (
                    <span id="email-error" className="field-error" role="alert">
                      {errors.email}
                    </span>
                  )}
                </div>
                <div className="form-field">
                  <label htmlFor="contact-message">
                    پیام شما <span aria-hidden="true">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    className="form-input"
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="پیشنهاد یا نظر خود را بنویسید…"
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? "message-error" : undefined}
                  />
                  {errors.message && (
                    <span id="message-error" className="field-error" role="alert">
                      {errors.message}
                    </span>
                  )}
                </div>
                <Button type="submit" size="lg" className="justify-self-start">
                  <Send />
                  بررسی پیام (نمونه)
                </Button>
              </form>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
