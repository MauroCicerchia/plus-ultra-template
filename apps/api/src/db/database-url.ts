type DatabaseEnvironment = Readonly<{
  DATABASE_URL?: string | undefined;
  DATABASE_URL_UNPOOLED?: string | undefined;
}>;

const postgresProtocols = new Set(["postgres:", "postgresql:"]);

const parsePostgresUrl = (value: string, variableName: string): URL => {
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(value);
  } catch {
    throw new Error(`${variableName} must be a valid PostgreSQL connection URL`);
  }

  if (!postgresProtocols.has(parsedUrl.protocol)) {
    throw new Error(`${variableName} must be a valid PostgreSQL connection URL`);
  }

  return parsedUrl;
};

const isPooledHost = (parsedUrl: URL): boolean =>
  parsedUrl.hostname.split(".")[0]?.endsWith("-pooler") ?? false;

/**
 * Migrations run over the direct connection: Neon's pooler cannot execute them.
 * There is deliberately no fallback to `DATABASE_URL`, because that variable
 * holds the pooled connection.
 */
export const resolveMigrationDatabaseUrl = (environment: DatabaseEnvironment): string => {
  const databaseUrl = environment.DATABASE_URL_UNPOOLED?.trim();

  if (!databaseUrl) {
    throw new Error("DATABASE_URL_UNPOOLED is required when running Drizzle migrations");
  }

  if (isPooledHost(parsePostgresUrl(databaseUrl, "DATABASE_URL_UNPOOLED"))) {
    throw new Error("DATABASE_URL_UNPOOLED must use a direct PostgreSQL connection");
  }

  return databaseUrl;
};

/** Runtime queries use the pooled connection. */
export const resolveRuntimeDatabaseUrl = (environment: DatabaseEnvironment): string => {
  const databaseUrl = environment.DATABASE_URL?.trim();

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required when the API queries the database");
  }

  parsePostgresUrl(databaseUrl, "DATABASE_URL");

  return databaseUrl;
};
