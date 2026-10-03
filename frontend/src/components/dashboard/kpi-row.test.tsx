import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { KPIRow } from "./kpi-row";
import type { KPIMetrics } from "@/lib/financial-types";

const sampleMetrics: KPIMetrics = {
  totalIncome: 15000,
  totalOutcome: 3500,
  profit: 11500,
  profitPercent: 76.67,
};

describe("KPIRow", () => {
  it("renders all four KPI cards when metrics are provided", () => {
    render(<KPIRow metrics={sampleMetrics} />);

    expect(screen.getByText("Total Income")).toBeInTheDocument();
    expect(screen.getByText("Total Outcome")).toBeInTheDocument();
    expect(screen.getByText("Profit")).toBeInTheDocument();
    expect(screen.getByText("Profit Margin")).toBeInTheDocument();
  });

  it("displays formatted values", () => {
    render(<KPIRow metrics={sampleMetrics} />);

    expect(screen.getByText("$15,000")).toBeInTheDocument();
    expect(screen.getByText("$3,500")).toBeInTheDocument();
    expect(screen.getByText("$11,500")).toBeInTheDocument();
    expect(screen.getByText("76.7%")).toBeInTheDocument();
  });

  it("renders placeholder dashes when metrics is null", () => {
    render(<KPIRow metrics={null} />);

    expect(screen.getByText("Total Income")).toBeInTheDocument();
    // Each KPICard should show "—" for its value
    const dashes = screen.getAllByText("—");
    expect(dashes.length).toBeGreaterThanOrEqual(4);
  });

  it("renders skeleton indicators when loading", () => {
    const { container } = render(<KPIRow metrics={sampleMetrics} loading />);

    // Skeleton animation class should be present
    expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(0);
  });

  it("renders inside a grid container with responsive columns", () => {
    const { container } = render(<KPIRow metrics={sampleMetrics} />);

    const grid = container.querySelector(".grid");
    expect(grid).toBeInTheDocument();
    expect(grid).toHaveClass(/grid-cols-1/);
    expect(grid).toHaveClass(/sm:grid-cols-2/);
    expect(grid).toHaveClass(/xl:grid-cols-4/);
  });
});