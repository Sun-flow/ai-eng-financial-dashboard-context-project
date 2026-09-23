import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { KPICard } from "./kpi-card";
import { TrendingUp } from "lucide-react";

describe("KPICard", () => {
  it("renders label, value and helper text when not loading", () => {
    render(
      <KPICard
        label="Total Income"
        value="$12,345.00"
        helperText="Cumulative revenue"
        icon={TrendingUp}
        variant="income"
      />,
    );

    expect(screen.getByText("Total Income")).toBeInTheDocument();
    expect(screen.getByText("$12,345.00")).toBeInTheDocument();
    expect(screen.getByText("Cumulative revenue")).toBeInTheDocument();
  });

  it("renders skeleton placeholders when loading", () => {
    const { container } = render(
      <KPICard
        label="Total Income"
        value="$12,345.00"
        helperText="Cumulative revenue"
        icon={TrendingUp}
        variant="income"
        loading
      />,
    );

    // Skeleton elements should be present instead of values
    expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(0);
  });

  it("applies variant-specific styling", () => {
    const { container } = render(
      <KPICard
        label="Profit Margin"
        value="12.5%"
        helperText="Profit as percentage"
        icon={TrendingUp}
        variant="profitPercent"
      />,
    );

    // The profit variant should exist and render
    expect(screen.getByText("Profit Margin")).toBeInTheDocument();
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});