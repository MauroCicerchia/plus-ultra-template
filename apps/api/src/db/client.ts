import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { resolveRuntimeDatabaseUrl } from "./database-url.js";
import * as schema from "./schema.js";

/**
 * Builds a Drizzle client over Neon's serverless HTTP driver.
 *
 * This is a factory on purpose: nothing connects at import time, so tests and
 * builds run without a database. Call it from a request handler once a product
 * spec introduces persistence.
 */
export const createDatabase = (environment: NodeJS.ProcessEnv = process.env) =>
  drizzle({ client: neon(resolveRuntimeDatabaseUrl(environment)), schema });

export type Database = ReturnType<typeof createDatabase>;
