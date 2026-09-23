import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProfitPercentChart } from "./profit-percent-chart";
import type { MonthlyDataPoint } from "@/lib/financial-types";

const sampleData: MonthlyDataPoint[] = [
  { month: "Jan 2024", income: 10000, outcome: 6000, profitPercent: 40 },
  { month: "Feb 2024", income: 12000, outcome: 7000, profitPercent: 41.7 },
];

describe("ProfitPercentChart", () => {
  it("renders chart title and description", () => {
    render(<ProfitPercentChart data={sampleData} />);

    expect(screen.getByText("Profit Margin %")).toBeInTheDocument();
    expect(
      screen.getByText("Monthly profit as a percentage of total income"),
    ).toBeInTheDocument();
  });

  it("renders skeleton when loading", () => {
    const { container } = render(
      <ProfitPercentChart data={[]} loading />,
    );

    expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(0);
  });

  it("renders when data is empty", () => {
    render(<ProfitPercentChart data={[]} />);

    expect(screen.getByText("Profit Margin %")).toBeInTheDocument();
  });
});