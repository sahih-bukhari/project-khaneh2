export type CategoryId = "code" | "web" | "mobile" | "ai" | "design" | "study";
export type Project = {
  id: string;
  title: string;
  description: string;
  category: CategoryId;
  tags: string[];
  technology: string;
  fileType: string;
  size: string;
  version: string;
  updated: string;
  featured: boolean;
  popular: boolean;
  artwork: "shop" | "dashboard" | "mobile" | "ai" | "design" | "code";
  requirements: string[];
  downloadUrl?: string;
};
export const categories: { id: CategoryId; title: string; description: string }[] = [
  { id: "code", title: "برنامه‌نویسی", description: "سورس‌کد و ابزارهای کاربردی برای ساختن" },
  { id: "web", title: "وب‌سایت", description: "قالب‌ها و پروژه‌های آماده برای وب" },
  { id: "mobile", title: "اپلیکیشن موبایل", description: "ایده‌های کاربردی برای اندروید و iOS" },
  { id: "ai", title: "هوش مصنوعی", description: "پروژه‌هایی برای یادگیری و تجربهٔ هوش مصنوعی" },
  { id: "design", title: "طراحی", description: "رابط‌های کاربری و منابع خلاقانه" },
  { id: "study", title: "پروژه‌های درسی", description: "منابع آموزشی برای تمرین و یادگیری" },
];
export const projects: Project[] = [
  {
    id: "shop",
    title: "قالب فروشگاه آنلاین مینیمال",
    description:
      "یک قالب فروشگاهی ساده و زیبا با صفحهٔ محصولات، سبد خرید و طراحی سازگار با موبایل؛ نقطهٔ شروعی برای تمرین ساخت فروشگاه.",
    category: "web",
    tags: ["React", "Tailwind CSS", "فروشگاه"],
    technology: "React + Tailwind CSS",
    fileType: "ZIP",
    size: "۴٫۲ مگابایت",
    version: "1.0.0",
    updated: "2026-10-12",
    featured: true,
    popular: true,
    artwork: "shop",
    requirements: [
      "Node.js نسخهٔ ۲۰ یا بالاتر",
      "آشنایی ابتدایی با React",
      "یک ویرایشگر کد مانند VS Code",
    ],
  },
  {
    id: "dashboard",
    title: "داشبورد مدیریت پروژه",
    description:
      "رابط مدیریت کارها با نمای آماری، فهرست پروژه‌ها و جدول فعالیت‌ها؛ مناسب برای تمرین ساخت پنل‌های مدیریتی.",
    category: "code",
    tags: ["Vue.js", "TypeScript", "داشبورد"],
    technology: "Vue.js + TypeScript",
    fileType: "ZIP",
    size: "۳٫۸ مگابایت",
    version: "1.2.0",
    updated: "2026-10-10",
    featured: true,
    popular: true,
    artwork: "dashboard",
    requirements: ["Node.js نسخهٔ ۲۰ یا بالاتر", "آشنایی با JavaScript و Vue.js"],
  },
  {
    id: "tasks",
    title: "اپلیکیشن مدیریت کارهای روزانه",
    description:
      "طرح یک اپلیکیشن سبک برای ثبت کارهای روزانه، دسته‌بندی فعالیت‌ها و پیگیری برنامه‌های شخصی.",
    category: "mobile",
    tags: ["Flutter", "Dart", "برنامه‌ریزی"],
    technology: "Flutter + Dart",
    fileType: "ZIP",
    size: "۶٫۱ مگابایت",
    version: "1.0.0",
    updated: "2026-10-08",
    featured: true,
    popular: false,
    artwork: "mobile",
    requirements: ["Flutter SDK نسخهٔ ۳ یا بالاتر", "Android Studio یا VS Code"],
  },
  {
    id: "assistant",
    title: "دستیار گفت‌وگوی هوشمند",
    description:
      "نمونهٔ آموزشی یک رابط گفت‌وگو برای آشنایی با ساخت اپلیکیشن‌های هوش مصنوعی و مدیریت پیام‌ها.",
    category: "ai",
    tags: ["Python", "هوش مصنوعی", "چت‌بات"],
    technology: "Python + Streamlit",
    fileType: "ZIP",
    size: "۱٫۵ مگابایت",
    version: "0.9.0",
    updated: "2026-10-14",
    featured: false,
    popular: true,
    artwork: "ai",
    requirements: [
      "Python نسخهٔ ۳٫۱۱ یا بالاتر",
      "محیط مجازی Python",
      "برای اتصال واقعی، کلید سرویس هوش مصنوعی لازم است",
    ],
  },
  {
    id: "design-kit",
    title: "کیت رابط کاربری سبزینه",
    description:
      "مجموعه‌ای از اجزای هماهنگ رابط کاربری شامل دکمه‌ها، فرم‌ها و کارت‌ها برای تمرین طراحی محصولات دیجیتال.",
    category: "design",
    tags: ["Figma", "UI Kit", "رابط کاربری"],
    technology: "Figma",
    fileType: "FIG",
    size: "۸٫۳ مگابایت",
    version: "1.1.0",
    updated: "2026-10-13",
    featured: false,
    popular: false,
    artwork: "design",
    requirements: ["حساب رایگان Figma", "آشنایی ابتدایی با طراحی رابط کاربری"],
  },
  {
    id: "library",
    title: "سیستم مدیریت کتابخانه",
    description:
      "پروژهٔ درسی برای یادگیری ساختار داده، ثبت کتاب و مدیریت امانت‌ها، همراه با توضیح مراحل پیاده‌سازی.",
    category: "study",
    tags: ["Python", "SQLite", "آموزشی"],
    technology: "Python + SQLite",
    fileType: "ZIP",
    size: "۲٫۱ مگابایت",
    version: "1.0.0",
    updated: "2026-10-06",
    featured: false,
    popular: true,
    artwork: "code",
    requirements: ["Python نسخهٔ ۳٫۱۰ یا بالاتر", "آشنایی ابتدایی با پایگاه داده"],
  },
  {
    id: "portfolio",
    title: "قالب وب‌سایت شخصی",
    description:
      "یک قالب مرتب برای معرفی مهارت‌ها، نمایش نمونه‌کارها و ساخت صفحهٔ شخصی؛ مناسب برای دانشجویان و توسعه‌دهندگان.",
    category: "web",
    tags: ["HTML", "CSS", "نمونه‌کار"],
    technology: "HTML + CSS",
    fileType: "ZIP",
    size: "۱٫۸ مگابایت",
    version: "1.0.0",
    updated: "2026-10-05",
    featured: false,
    popular: false,
    artwork: "design",
    requirements: ["مرورگر به‌روز", "آشنایی با HTML و CSS"],
  },
  {
    id: "expenses",
    title: "ابزار ثبت مصارف شخصی",
    description:
      "نمونهٔ یک ابزار ساده برای ثبت درآمد و مصارف روزانه و مرور دسته‌بندی‌های مالی؛ مناسب برای تمرین برنامه‌نویسی.",
    category: "code",
    tags: ["React", "TypeScript", "مالی"],
    technology: "React + TypeScript",
    fileType: "ZIP",
    size: "۲٫۷ مگابایت",
    version: "1.0.0",
    updated: "2026-10-03",
    featured: false,
    popular: false,
    artwork: "dashboard",
    requirements: ["Node.js نسخهٔ ۲۰ یا بالاتر", "آشنایی با React"],
  },
];
export function categoryTitle(id: CategoryId) {
  return categories.find((c) => c.id === id)?.title ?? "";
}
export function normalizeText(value: string) {
  return value
    .toLowerCase()
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[\u200c\u200d]/g, " ")
    .trim();
}
export function filterProjects(items: Project[], query = "", category = "", sort = "newest") {
  const term = normalizeText(query);
  return items
    .filter(
      (p) =>
        (!category || p.category === category) &&
        normalizeText([p.title, p.description, ...p.tags].join(" ")).includes(term),
    )
    .sort((a, b) =>
      sort === "title" ? a.title.localeCompare(b.title, "fa") : b.updated.localeCompare(a.updated),
    );
}
export function canDownload(project: Project) {
  return Boolean(project.downloadUrl && /^https:\/\//.test(project.downloadUrl));
}
export function formatDate(date: string) {
  return new Intl.DateTimeFormat("fa-AF", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(date + "T00:00:00Z"));
}
export function validateContact(name: string, email: string, message: string) {
  return {
    name: name.trim().length < 2 ? "نام خود را وارد کنید (حداقل ۲ حرف)." : "",
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ? "" : "یک ایمیل معتبر وارد کنید.",
    message: message.trim().length < 10 ? "پیام باید حداقل ۱۰ حرف داشته باشد." : "",
  };
}
export function parseFavorites(raw: string | null): string[] {
  try {
    const parsed: unknown = JSON.parse(raw ?? "[]");
    return Array.isArray(parsed)
      ? parsed.filter(
          (id): id is string => typeof id === "string" && projects.some((p) => p.id === id),
        )
      : [];
  } catch {
    return [];
  }
}
