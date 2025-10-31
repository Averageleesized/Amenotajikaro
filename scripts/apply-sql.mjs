#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import process from "node:process";
import pg from "pg";

const { Client } = pg;

const trimOrNull = (value) => {
  if (!value) {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const usage = () => {
  console.error(
    "Usage: npm run apply-sql -- <connection-string> [sql-file]\n" +
      "  If no arguments are passed the script will look for SUPABASE_DB_URL\n" +
      "  and apply supabase/sql/create_fantasy_tennis_tables.sql by default.\n" +
      "  You can also provide SUPABASE_DB_PASSWORD if your connection string\n" +
      "  omits the password or contains characters that are hard to escape.\n",
  );
};

const resolveConnectionString = (argv) => {
  if (argv.length > 0 && argv[0] && !argv[0].startsWith("-")) {
    return argv[0];
  }
  return trimOrNull(process.env.SUPABASE_DB_URL);
};

const resolveSqlPath = (argv) => {
  if (argv.length > 1 && argv[1] && !argv[1].startsWith("-")) {
    return argv[1];
  }
  return "supabase/sql/create_fantasy_tennis_tables.sql";
};

const resolvePassword = () => {
  const explicit = trimOrNull(process.env.SUPABASE_DB_PASSWORD);
  if (explicit) {
    return explicit;
  }
  const alias = trimOrNull(process.env.SUPABASE_DB_PASS);
  if (alias) {
    return alias;
  }
  return undefined;
};

async function main() {
  const [, , ...args] = process.argv;
  const connectionString = resolveConnectionString(args);

  if (!connectionString) {
    usage();
    throw new Error(
      "Missing connection string. Pass SUPABASE_DB_URL or provide a positional argument.",
    );
  }

  const sqlPath = resolveSqlPath(args);
  const sql = await readFile(sqlPath, "utf8");

  if (!sql.trim()) {
    throw new Error(`SQL file at ${sqlPath} is empty.`);
  }

  const password = resolvePassword();
  const clientConfig = {
    connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
  };

  if (password !== undefined) {
    clientConfig.password = password;
  }

  const client = new Client(clientConfig);

  console.log(`Connecting to ${client.connectionParameters.database}...`);
  await client.connect();

  try {
    console.log(`Applying ${sqlPath}...`);
    await client.query("begin");
    await client.query(sql);
    await client.query("commit");
    console.log("SQL script applied successfully.");
  } catch (error) {
    console.error("Failed to apply SQL script, rolling back.");
    try {
      await client.query("rollback");
    } catch (rollbackError) {
      console.error("Rollback failed:", rollbackError);
    }
    throw error;
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
