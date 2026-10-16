import { describe, expect, it } from "vitest";
import { hasZipSignature, validateApkFile, validateIconFile, MAX_APK_BYTES } from "@/lib/apk";

describe("apk validation", () => {
  it("rejects non-apk extensions", () => {
    expect(validateApkFile({ name: "app.zip", size: 10 })).not.toBe("");
  });
  it("rejects files over 200MB", () => {
    expect(validateApkFile({ name: "a.apk", size: MAX_APK_BYTES + 1 })).not.toBe("");
  });
  it("accepts a 200MB apk", () => {
    expect(validateApkFile({ name: "a.APK", size: MAX_APK_BYTES })).toBe("");
  });
  it("rejects icons over 2MB", () => {
    expect(validateIconFile({ type: "image/png", size: 2 * 1024 * 1024 + 1 })).not.toBe("");
  });
  it("detects zip signature", async () => {
    expect(await hasZipSignature(new Blob([new Uint8Array([0x50, 0x4b, 3, 4, 0])]))).toBe(true);
    expect(await hasZipSignature(new Blob(["hello"]))).toBe(false);
  });
});
