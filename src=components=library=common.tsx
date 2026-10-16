import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Bot,
  Code2,
  GraduationCap,
  Globe,
  LoaderCircle,
  Palette,
  Smartphone,
  SearchX,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CategoryId } from "@/lib/catalog";
export const categoryIcons: Record<CategoryId, LucideIcon> = {
  code: Code2,
  web: Globe,
  mobile: Smartphone,
  ai: Bot,
  design: Palette,
  study: GraduationCap,
};
export function PageHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="page-heading">
      <div className="breadcrumb">
        <Link to="/">خانه</Link>
        <span>/</span>
        <span>{title}</span>
      </div>
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>
  );
}
export function EmptyState({
  title,
  description,
  clear,
}: {
  title: string;
  description: string;
  clear?: () => void;
}) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <SearchX size={29} />
      </div>
      <h2>{title}</h2>
      <p>{description}</p>
      {clear ? (
        <Button onClick={clear} variant="outline">
          پاک‌کردن فیلترها
        </Button>
      ) : (
        <Button asChild>
          <Link to="/apps">
            کاوش پروژه‌ها <ArrowLeft />
          </Link>
        </Button>
      )}
    </div>
  );
}
export function LoadingState() {
  return (
    <div className="loading-state" role="status" aria-label="در حال بارگذاری">
      <LoaderCircle size={28} />
      <span className="sr-only">در حال بارگذاری…</span>
    </div>
  );
}
