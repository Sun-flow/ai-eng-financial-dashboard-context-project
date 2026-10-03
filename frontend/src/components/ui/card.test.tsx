import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter } from "./card";

describe("Card", () => {
  it("renders children inside a card container", () => {
    render(
      <Card>
        <p>Card content</p>
      </Card>,
    );

    expect(screen.getByText("Card content")).toBeInTheDocument();
  });

  it("has the correct data-slot attribute", () => {
    const { container } = render(<Card />);
    const div = container.querySelector('[data-slot="card"]');
    expect(div).toBeInTheDocument();
  });

  it("applies base styling classes", () => {
    const { container } = render(<Card />);
    const div = container.querySelector('[data-slot="card"]');
    expect(div).toHaveClass(/rounded-xl/);
    expect(div).toHaveClass(/border/);
    expect(div).toHaveClass(/shadow-sm/);
  });

  it("accepts additional className", () => {
    const { container } = render(<Card className="my-custom-class" />);
    const div = container.querySelector('[data-slot="card"]');
    expect(div).toHaveClass(/my-custom-class/);
  });
});

describe("CardHeader", () => {
  it("renders with data-slot=card-header", () => {
    const { container } = render(<CardHeader>Header</CardHeader>);
    expect(container.querySelector('[data-slot="card-header"]')).toBeInTheDocument();
    expect(screen.getByText("Header")).toBeInTheDocument();
  });
});

describe("CardTitle", () => {
  it("renders with data-slot=card-title", () => {
    const { container } = render(<CardTitle>Title</CardTitle>);
    expect(container.querySelector('[data-slot="card-title"]')).toBeInTheDocument();
    expect(screen.getByText("Title")).toBeInTheDocument();
  });

  it("applies font-semibold styling", () => {
    const { container } = render(<CardTitle>Title</CardTitle>);
    expect(container.querySelector('[data-slot="card-title"]')).toHaveClass(/font-semibold/);
  });
});

describe("CardDescription", () => {
  it("renders with data-slot=card-description", () => {
    const { container } = render(<CardDescription>Desc</CardDescription>);
    expect(container.querySelector('[data-slot="card-description"]')).toBeInTheDocument();
    expect(screen.getByText("Desc")).toBeInTheDocument();
  });

  it("applies muted text styling", () => {
    const { container } = render(<CardDescription>Desc</CardDescription>);
    expect(container.querySelector('[data-slot="card-description"]')).toHaveClass(/text-muted-foreground/);
  });
});

describe("CardAction", () => {
  it("renders with data-slot=card-action", () => {
    const { container } = render(<CardAction>Action</CardAction>);
    expect(container.querySelector('[data-slot="card-action"]')).toBeInTheDocument();
    expect(screen.getByText("Action")).toBeInTheDocument();
  });
});

describe("CardContent", () => {
  it("renders with data-slot=card-content", () => {
    const { container } = render(<CardContent>Content</CardContent>);
    expect(container.querySelector('[data-slot="card-content"]')).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("applies horizontal padding", () => {
    const { container } = render(<CardContent>Content</CardContent>);
    expect(container.querySelector('[data-slot="card-content"]')).toHaveClass(/px-6/);
  });
});

describe("CardFooter", () => {
  it("renders with data-slot=card-footer", () => {
    const { container } = render(<CardFooter>Footer</CardFooter>);
    expect(container.querySelector('[data-slot="card-footer"]')).toBeInTheDocument();
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });
});