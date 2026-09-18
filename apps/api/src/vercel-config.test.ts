import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

type VercelRoute = Readonly<{
  src?: string;
  dest?: string;
  handle?: string;
}>;

const readJson = <Value>(relativePath: string): Value =>
  JSON.parse(readFileSync(new URL(relativePath, import.meta.url), "utf8")) as Value;

describe("Vercel deployment topology", () => {
  it("routes API requests to the catch-all function before the SPA fallback", () => {
    const config = readJson<{ routes: VercelRoute[] }>("../../../vercel.json");

    expect(config.routes).toEqual([
      { src: "/api/(.*)", dest: "/api/[...path]" },
      { handle: "filesystem" },
      { src: "/(.*)", dest: "/index.html" },
    ]);
  });

  it("serves the Vite build output as the static site", () => {
    const config = readJson<{ buildCommand: string; outputDirectory: string }>(
      "../../../vercel.json",
    );

    expect(config.buildCommand).toBe("pnpm build");
    expect(config.outputDirectory).toBe("apps/web/dist");
  });

  it("exports compiled shared code to the Node function runtime", () => {
    const packageJson = readJson<{ exports: { ".": { import: string } } }>(
      "../../../packages/shared/package.json",
    );

    expect(packageJson.exports["."].import).toBe("./dist/index.js");
  });

  it("uses shared source exports during local API development", () => {
    const packageJson = readJson<{ scripts: { dev: string } }>("../package.json");

    expect(packageJson.scripts.dev).toContain("--conditions=development");
  });
});
