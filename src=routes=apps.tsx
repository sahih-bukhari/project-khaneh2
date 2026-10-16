import { createFileRoute } from "@tanstack/react-router";
import { AppsList } from "@/components/library/apps-list";

export const Route = createFileRoute("/apps")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "اپلیکیشن‌های اندروید | پروژه‌خانه" },
      { name: "description", content: "اپلیکیشن‌های APK منتشرشده در پروژه‌خانه را ببینید و دانلود کنید." },
      { property: "og:title", content: "اپلیکیشن‌های اندروید | پروژه‌خانه" },
      { property: "og:description", content: "دانلود اپلیکیشن‌های APK منتشرشده." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <div className="site-container page-main">
      <div className="page-heading">
        <h1>اپلیکیشن‌های اندروید</h1>
        <p>فایل‌های APK منتشرشده توسط مدیر پروژه‌خانه.</p>
      </div>
      <AppsList />
    </div>
  ),
});
