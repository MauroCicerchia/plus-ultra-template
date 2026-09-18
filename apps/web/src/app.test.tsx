import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { App } from "./app";
import { getHealth } from "./lib/api-client";

vi.mock("./lib/api-client", () => ({
  getHealth: vi.fn(),
}));

const getHealthMock = vi.mocked(getHealth);

afterEach(() => {
  vi.clearAllMocks();
});

describe("App", () => {
  it("shows the checking state while health is pending", () => {
    getHealthMock.mockReturnValue(new Promise<never>(() => undefined));
    render(<App />);

    expect(screen.getByText("Checking")).toBeInTheDocument();
  });

  it("shows that the API is available", async () => {
    getHealthMock.mockResolvedValue({ status: "ok" });
    render(<App />);

    expect(await screen.findByText("Available")).toBeInTheDocument();
  });

  it("shows that the API is unavailable", async () => {
    getHealthMock.mockRejectedValue(new Error("offline"));
    render(<App />);

    expect(await screen.findByText("Unavailable")).toBeInTheDocument();
  });

  it("re-checks health from the button", async () => {
    getHealthMock.mockRejectedValue(new Error("offline"));
    render(<App />);
    expect(await screen.findByText("Unavailable")).toBeInTheDocument();

    getHealthMock.mockResolvedValue({ status: "ok" });
    await userEvent.click(screen.getByRole("button", { name: "Check again" }));

    expect(await screen.findByText("Available")).toBeInTheDocument();
  });
});
