import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getHealth } from "@/lib/api-client";

type ApiStatus = "checking" | "available" | "unavailable";

const statusLabel: Readonly<Record<ApiStatus, string>> = {
  checking: "Checking",
  available: "Available",
  unavailable: "Unavailable",
};

export function App() {
  const [status, setStatus] = useState<ApiStatus>("checking");

  const checkHealth = useCallback(async () => {
    setStatus("checking");

    try {
      await getHealth();
      setStatus("available");
    } catch {
      setStatus("unavailable");
    }
  }, []);

  useEffect(() => {
    void checkHealth();
  }, [checkHealth]);

  return (
    <main className="flex min-h-svh items-center justify-center bg-background p-6 text-foreground">
      <section className="w-full max-w-md space-y-6">
        <header className="space-y-1">
          <h1 className="font-heading text-2xl font-semibold tracking-tight">Web app template</h1>
          <p className="text-sm text-muted-foreground">
            React, Vite, Tailwind and shadcn/ui talking to a Hono API over a typed contract.
          </p>
        </header>

        <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card p-4 text-card-foreground">
          <div className="space-y-0.5">
            <p className="text-sm font-medium">API status</p>
            <p className="text-sm text-muted-foreground" aria-live="polite">
              {statusLabel[status]}
            </p>
          </div>
          <Button onClick={() => void checkHealth()} disabled={status === "checking"}>
            Check again
          </Button>
        </div>
      </section>
    </main>
  );
}
