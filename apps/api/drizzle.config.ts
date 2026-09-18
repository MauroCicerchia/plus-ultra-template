import { defineConfig } from "drizzle-kit";
import { resolveMigrationDatabaseUrl } from "./src/db/database-url.js";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    // A getter, so the connection string is demanded only by commands that
    // actually connect. `drizzle-kit generate` reads the schema off disk and
    // therefore keeps working offline.
    get url(): string {
      return resolveMigrationDatabaseUrl(process.env);
    },
  },
});
