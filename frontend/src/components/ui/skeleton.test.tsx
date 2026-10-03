import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { Skeleton } from "./skeleton";

describe("Skeleton", () => {
  it("renders a skeleton placeholder div", () => {
    const { container } = render(<Skeleton />);
    expect(container.querySelector("div")).toBeInTheDocument();
  });

  it("has the correct data-slot attribute", () => {
    const { container } = render(<Skeleton />);
    const div = container.querySelector('[data-slot="skeleton"]');
    expect(div).toBeInTheDocument();
  });

  it("applies animate-pulse class for the loading animation", () => {
    const { container } = render(<Skeleton />);
    const div = container.querySelector('[data-slot="skeleton"]');
    expect(div).toHaveClass(/animate-pulse/);
  });

  it("applies rounded-md styling", () => {
    const { container } = render(<Skeleton />);
    const div = container.querySelector('[data-slot="skeleton"]');
    expect(div).toHaveClass(/rounded-md/);
  });

  it("accepts additional className", () => {
    const { container } = render(<Skeleton className="h-8 w-full" />);
    const div = container.querySelector('[data-slot="skeleton"]');
    expect(div).toHaveClass(/h-8/);
    expect(div).toHaveClass(/w-full/);
  });

  it("passes through extra HTML attributes", () => {
    const { container } = render(<Skeleton aria-label="loading" />);
    const div = container.querySelector('[data-slot="skeleton"]');
    expect(div).toHaveAttribute("aria-label", "loading");
  });
});