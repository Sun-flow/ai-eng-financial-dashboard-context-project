import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { DashboardHeader } from "./dashboard-header";

describe("DashboardHeader", () => {
  it("renders title and description", () => {
    render(<DashboardHeader />);

    expect(screen.getByText("Financial Overview")).toBeInTheDocument();
    expect(
      screen.getByText("Executive metrics dashboard"),
    ).toBeInTheDocument();
  });

  it("renders the default period when none is provided", () => {
    render(<DashboardHeader />);

    expect(screen.getByText("Full Year")).toBeInTheDocument();
  });

  it("renders a custom period when provided", () => {
    render(<DashboardHeader period="2025 — Q1" />);

    expect(screen.getByText("2025 — Q1")).toBeInTheDocument();
  });
});