import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { FolderCode, Heart, Menu, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
export function Logo() {
  return (
    <Link to="/" className="logo" aria-label="پروژه‌خانه، صفحهٔ اصلی">
      <div className="logo-mark">
        <FolderCode size={25} strokeWidth={1.7} />
      </div>
      <div>
        <div className="logo-name">پروژه‌خانه</div>
        <div className="logo-caption">پروژه‌های مفید، یک‌جا</div>
      </div>
    </Link>
  );
}
export function Header() {
  const [open, setOpen] = useState(false);
  const navigation = (
    <>
      <Link
        to="/"
        activeOptions={{ exact: true }}
        className="nav-link"
        onClick={() => setOpen(false)}
      >
        خانه
      </Link>
      <Link to="/apps" className="nav-link" onClick={() => setOpen(false)}>
        اپلیکیشن‌ها
      </Link>
      <Link to="/about" className="nav-link" onClick={() => setOpen(false)}>
        دربارهٔ ما و تماس
      </Link>
    </>
  );
  return (
    <>
      <a href="#main-content" className="skip-link">
        رفتن به محتوای اصلی
      </a>
      <header className="site-header">
        <div className="site-container header-inner">
          <Logo />
          <nav className="desktop-nav" aria-label="منوی اصلی">
            {navigation}
          </nav>
          <div className="header-actions">
            <Button asChild size="sm">
              <Link to="/admin/apps">
                <Plus size={16} />
                افزودن اپلیکیشن
              </Link>
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="mobile-menu-button"
              aria-label={open ? "بستن منو" : "بازکردن منو"}
              aria-expanded={open}
              aria-controls="mobile-navigation"
              onClick={() => setOpen(!open)}
            >
              {open ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
        {open && (
          <nav id="mobile-navigation" className="mobile-nav" aria-label="منوی موبایل">
            {navigation}
          </nav>
        )}
      </header>
    </>
  );
}
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Logo />
            <p className="footer-copy">
              جایی برای پیدا کردن ایده‌ها، یادگیری چیزهای تازه و شروع پروژهٔ بعدی‌تان. منابع دیجیتال
              کاربردی، در یک خانه.
            </p>
          </div>
          <div>
            <h2 className="footer-heading">دسترسی سریع</h2>
            <div className="footer-links">
              <Link to="/apps">همهٔ اپلیکیشن‌ها</Link>
              <Link to="/admin/apps">افزودن اپلیکیشن (مدیر)</Link>
            </div>
          </div>
          <div>
            <h2 className="footer-heading">پروژه‌خانه</h2>
            <div className="footer-links">
              <Link to="/about">دربارهٔ ما</Link>
              <Link to="/about">تماس با ما</Link>
              <span>برای یادگیری و الهام‌گرفتن</span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© پروژه‌خانه</span>
          <span className="inline-flex items-center gap-1">
            ساخته‌شده با دقت، برای شما <Heart size={11} />
          </span>
        </div>
      </div>
    </footer>
  );
}
