import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { IncomeOutcomeChart } from "./income-outcome-chart";
import type { MonthlyDataPoint } from "@/lib/financial-types";

const sampleData: MonthlyDataPoint[] = [
  { month: "Jan 2024", income: 10000, outcome: 6000, profitPercent: 40 },
  { month: "Feb 2024", income: 12000, outcome: 7000, profitPercent: 41.7 },
];

describe("IncomeOutcomeChart", () => {
  it("renders chart title and description", () => {
    render(<IncomeOutcomeChart data={sampleData} />);

    expect(screen.getByText("Income vs. Outcome")).toBeInTheDocument();
    expect(
      screen.getByText("Monthly revenue and expenditure evolution"),
    ).toBeInTheDocument();
  });

  it("renders skeleton when loading", () => {
    const { container } = render(
      <IncomeOutcomeChart data={[]} loading />,
    );

    expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(0);
  });

  it("renders responsibly when data is empty", () => {
    render(<IncomeOutcomeChart data={[]} />);

    expect(screen.getByText("Income vs. Outcome")).toBeInTheDocument();
  });
});