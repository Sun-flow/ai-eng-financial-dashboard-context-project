import { describe, expect, it } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("merges class strings", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles conditional classes (falsy values are omitted)", () => {
    expect(cn("base", false && "hidden")).toBe("base");
  });

  it("handles conditional classes (truthy values are included)", () => {
    expect(cn("base", true && "active")).toBe("base active");
  });

  it("handles nested arrays", () => {
    expect(cn(["foo", "bar"], "baz")).toBe("foo bar baz");
  });

  it("handles object syntax for conditional inclusion", () => {
    expect(cn({ foo: true, bar: false })).toBe("foo");
  });

  it("resolves conflicting Tailwind utilities via twMerge (later wins)", () => {
    // twMerge gives precedence to the last conflicting utility
    expect(cn("px-4", "px-6")).toBe("px-6");
  });

  it("returns empty string when no inputs are provided", () => {
    expect(cn()).toBe("");
  });

  it("ignores falsy values", () => {
    expect(cn("foo", undefined, null, false, "", "bar")).toBe("foo bar");
  });
});