import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Search, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppsList } from "@/components/library/apps-list";
import heroImage from "@/assets/library-hero.jpg";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "پروژه‌خانه | اپلیکیشن‌های مفید، یک‌جا" },
      { name: "description", content: "اپلیکیشن‌های اندروید منتشرشده در پروژه‌خانه را ببینید و دانلود کنید." },
      { property: "og:title", content: "پروژه‌خانه | اپلیکیشن‌های مفید، یک‌جا" },
      { property: "og:description", content: "دانلود مستقیم اپلیکیشن‌های اندروید." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [query, setQuery] = useState("");
  return (
    <>
      <section className="hero">
        <img className="hero-art" src={heroImage} alt="" width={1536} height={1024} fetchPriority="high" />
        <div className="site-container hero-inner">
          <div className="hero-content">
            <h1>
              پروژه‌خانه
              <br />
              <span>اپلیکیشن‌های مفید، یک‌جا</span>
            </h1>
            <p className="hero-copy">اپلیکیشن‌های اندروید را پیدا کنید و مستقیم دانلود کنید.</p>
            <form className="search-form hero-search" role="search" onSubmit={(e) => e.preventDefault()}>
              <Search className="search-icon" size={21} />
              <input
                aria-label="جست‌وجوی اپلیکیشن"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="دنبال چه اپلیکیشنی می‌گردید؟"
              />
            </form>
            <div className="mt-4">
              <Button asChild>
                <Link to="/admin/apps"><Plus /> افزودن اپلیکیشن</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      <section className="section site-container">
        <div className="section-heading">
          <h2 className="section-title">
            <Smartphone />
            اپلیکیشن‌ها
          </h2>
        </div>
        <AppsList query={query} />
      </section>
    </>
  );
}
