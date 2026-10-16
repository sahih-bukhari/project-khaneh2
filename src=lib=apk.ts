export const MAX_APK_BYTES = 200 * 1024 * 1024;
export const MAX_ICON_BYTES = 2 * 1024 * 1024;
export const ICON_TYPES = ["image/png", "image/jpeg", "image/webp"];

export type ApkApp = {
  id: string;
  name: string;
  description: string;
  version: string;
  category: string;
  file_path: string;
  file_size: number;
  icon_path: string | null;
  status: "draft" | "published";
  updated_at: string;
};

/** Public listing columns only — never the file content. */
export const APK_PUBLIC_COLUMNS =
  "id,name,description,version,category,file_path,file_size,icon_path,status,updated_at";

export function validateApkFile(file: { name: string; size: number }): string {
  if (!/\.apk$/i.test(file.name)) return "فقط فایل با پسوند ‎.apk‎ پذیرفته می‌شود.";
  if (file.size <= 0) return "فایل انتخاب‌شده خالی است.";
  if (file.size > MAX_APK_BYTES) return "حجم فایل APK نباید بیشتر از ۲۰۰ مگابایت باشد.";
  return "";
}

export function validateIconFile(file: { type: string; size: number }): string {
  if (!ICON_TYPES.includes(file.type)) return "آیکون باید PNG، JPG یا WEBP باشد.";
  if (file.size > MAX_ICON_BYTES) return "حجم آیکون نباید بیشتر از ۲ مگابایت باشد.";
  return "";
}

export function validateApkMeta(name: string, version: string) {
  return {
    name: name.trim().length < 2 ? "نام برنامه را وارد کنید (حداقل ۲ حرف)." : "",
    version: /^[0-9A-Za-z.\-+]{1,40}$/.test(version.trim())
      ? ""
      : "نسخه را مانند 1.0.0 وارد کنید.",
  };
}

/** APK files are ZIP archives and must start with the "PK\x03\x04" signature. */
export async function hasZipSignature(file: Blob) {
  const b = new Uint8Array(await file.slice(0, 4).arrayBuffer());
  return b[0] === 0x50 && b[1] === 0x4b && b[2] === 0x03 && b[3] === 0x04;
}

export function formatBytes(bytes: number) {
  const mb = bytes / (1024 * 1024);
  return mb >= 1
    ? `${mb.toLocaleString("fa-AF", { maximumFractionDigits: 1 })} مگابایت`
    : `${(bytes / 1024).toLocaleString("fa-AF", { maximumFractionDigits: 0 })} کیلوبایت`;
}

export function safeFileName(name: string) {
  return name.replace(/[^A-Za-z0-9._-]/g, "_").slice(-80) || "app.apk";
}

/** Uploads straight to storage with progress; storage policies enforce admin access. */
export function uploadWithProgress(opts: {
  bucket: string;
  path: string;
  file: File;
  accessToken: string;
  onProgress: (pct: number) => void;
}): Promise<void> {
  const base = import.meta.env["VITE_SUPABASE_URL"] as string;
  const key = import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] as string;
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${base}/storage/v1/object/${opts.bucket}/${opts.path}`);
    xhr.setRequestHeader("Authorization", `Bearer ${opts.accessToken}`);
    xhr.setRequestHeader("apikey", key);
    xhr.setRequestHeader("x-upsert", "false");
    xhr.setRequestHeader("Content-Type", opts.file.type || "application/vnd.android.package-archive");
    xhr.upload.onprogress = (e) => e.lengthComputable && opts.onProgress(Math.round((e.loaded / e.total) * 100));
    xhr.onload = () =>
      xhr.status >= 200 && xhr.status < 300
        ? resolve()
        : reject(
            new Error(
              xhr.status === 403 || xhr.status === 401
                ? "اجازهٔ آپلود ندارید. فقط مدیر می‌تواند فایل اضافه کند."
                : xhr.status === 413
                  ? "حجم فایل بیش از حد مجاز است."
                  : "آپلود ناموفق بود. دوباره تلاش کنید.",
            ),
          );
    xhr.onerror = () => reject(new Error("اتصال اینترنت قطع شد؛ آپلود کامل نشد."));
    xhr.send(opts.file);
  });
}
