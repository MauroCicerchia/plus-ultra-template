type DatabaseEnvironment = Readonly<{
  DATABASE_URL?: string | undefined;
  DATABASE_URL_UNPOOLED?: string | undefined;
}>;

/**
 * Drizzle migrations must use the direct Neon connection: a pooler cannot run
 * them. Runtime queries use the pooled `DATABASE_URL` instead.
 */
export const resolveMigrationDatabaseUrl = (environment: DatabaseEnvironment): string => {
  const databaseUrl = environment.DATABASE_URL_UNPOOLED ?? environment.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL_UNPOOLED or DATABASE_URL is required only when running Drizzle commands",
    );
  }

  return databaseUrl;
};

/** Pooled connection used by API runtime queries. */
export const resolveRuntimeDatabaseUrl = (environment: DatabaseEnvironment): string => {
  const databaseUrl = environment.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required only when the API queries the database");
  }

  return databaseUrl;
};
