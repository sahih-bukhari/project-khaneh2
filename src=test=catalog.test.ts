import { describe, expect, it } from "vitest";
import {
  canDownload,
  filterProjects,
  parseFavorites,
  projects,
  validateContact,
} from "../lib/catalog";

describe("sample catalog rules", () => {
  it("searches titles", () => {
    expect(filterProjects(projects, "کتابخانه").map((p) => p.id)).toEqual(["library"]);
  });
  it("searches descriptions", () => {
    expect(filterProjects(projects, "امانت").map((p) => p.id)).toEqual(["library"]);
  });
  it("searches technology tags", () => {
    expect(filterProjects(projects, "Flutter").map((p) => p.id)).toEqual(["tasks"]);
  });
  it("filters categories", () => {
    expect(filterProjects(projects, "", "web").map((p) => p.id)).toEqual(["shop", "portfolio"]);
  });
  it("orders newest first", () => {
    expect(filterProjects(projects)[0]?.id).toBe("assistant");
  });
  it("orders by title", () => {
    const result = filterProjects(projects, "", "", "title");
    expect(result.map((p) => p.title)).toEqual(
      [...projects].map((p) => p.title).sort((a, b) => a.localeCompare(b, "fa")),
    );
    expect(result[0]?.id).not.toBe("assistant");
  });
  it("returns an empty result for unknown search", () => {
    expect(filterProjects(projects, "xyz-no-match")).toEqual([]);
  });
  it("never allows downloads for sample projects", () => {
    expect(projects.every((p) => !canDownload(p))).toBe(true);
    expect(
      canDownload({
        ...projects[0],
        id: "test",
        title: "test",
        description: "",
        category: "web",
        tags: [],
        technology: "",
        fileType: "",
        size: "",
        version: "",
        updated: "",
        featured: false,
        popular: false,
        artwork: "shop",
        requirements: [],
        downloadUrl: "https://example.com/file.zip",
      }),
    ).toBe(true);
  });
  it("restores only valid bookmark ids", () => {
    expect(parseFavorites('["shop", "unknown", 3]')).toEqual(["shop"]);
    expect(parseFavorites("broken")).toEqual([]);
  });
  it("rejects empty contact name", () => {
    expect(validateContact("", "user@example.com", "این یک پیام معتبر است").name).not.toBe("");
  });
  it("rejects invalid contact email", () => {
    expect(validateContact("احمد", "bad", "این یک پیام معتبر است").email).not.toBe("");
  });
  it("rejects short messages", () => {
    expect(validateContact("احمد", "user@example.com", "کوتاه").message).not.toBe("");
  });
  it("accepts valid contact information", () => {
    expect(validateContact("احمد", "user@example.com", "این یک پیام معتبر است")).toEqual({
      name: "",
      email: "",
      message: "",
    });
  });
});
