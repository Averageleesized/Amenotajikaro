# Fantasy Tennis App Landing Page

This is a code bundle for Fantasy Tennis App Landing Page. The original project is available at https://www.figma.com/design/9uarW4brDhkHX06RKqMpTE/Fantasy-Tennis-App-Landing-Page.

## Running the code

Run `npm i` to install the dependencies.

Run `npm run dev` to start the development server.

## Supabase configuration

The edge function at `src/supabase/functions/server/index.tsx` expects two environment variables when deployed to Supabase Functions or executed locally with `supabase functions serve`:

- `SUPABASE_URL`: The base URL of your Supabase project (e.g. `https://owndpjdqkestwvtkieoh.supabase.co`).
- `SUPABASE_SERVICE_ROLE_KEY`: A service role key for the same project. Use the service role key rather than the anon/public API key so the migration helper can upsert relational data.

You do **not** need to provide a Supabase access token (`sbp_…`) for these steps—the code paths in this repository talk directly to your project using the URL and service role key (or the database connection string described below). An access token is only necessary when you want to authenticate the Supabase CLI against your account (for example, to run `supabase functions deploy`), and it is not read by the application itself.

After setting those variables, run the SQL migration found at `supabase/sql/create_fantasy_tennis_tables.sql` inside the Supabase SQL editor to create the relational tables used by the API routes.

### What you need before creating tables in Supabase

1. **A Supabase project** – Tables live inside a specific project’s Postgres instance. Create a project in the [Supabase dashboard](https://supabase.com/dashboard) first, or reuse an existing one.
2. **Database credentials with SQL access** – Either use the project’s SQL editor (which requires signing in with your Supabase account) or copy the Postgres connection string/service role key from **Project Settings → Database** so tooling such as `psql`, the Supabase CLI, or the included `npm run apply-sql` script can authenticate.
3. **The table definition SQL** – Provide the SQL statements that describe the schema you want to create. This repository includes a ready-to-run script at `supabase/sql/create_fantasy_tennis_tables.sql`, but you can author your own DDL statements for custom tables.

With those pieces in place you can open the SQL editor, paste the table creation statements, and run them (or execute the same statements through your CLI/tool of choice) to provision the tables.

If you prefer to apply the schema from the command line, supply the database connection string from **Project Settings → Database → Connection string** and either export it as `SUPABASE_DB_URL` or pass it as the first positional argument. When your database password contains shell-sensitive characters (such as the `&` or `#` in `knN6esuzB&EEcF#`), export it separately as `SUPABASE_DB_PASSWORD` so you do not have to URL-encode it:

```bash
# using environment variables (quotes prevent the shell from treating &/# specially)
export SUPABASE_DB_URL="postgresql://postgres@db.owndpjdqkestwvtkieoh.supabase.co:5432/postgres"
export SUPABASE_DB_PASSWORD='knN6esuzB&EEcF#'
npm run apply-sql

# or passing the connection string directly
npm run apply-sql -- "postgresql://postgres:knN6esuzB%26EEcF%23@db.owndpjdqkestwvtkieoh.supabase.co:5432/postgres"
```

By default the helper executes `supabase/sql/create_fantasy_tennis_tables.sql`. You can point it at another file by providing a second positional argument.

### Running the migration from VS Code

If you prefer to stay inside Visual Studio Code while applying the schema, open the integrated terminal (`Ctrl` + `` ` `` on Windows/Linux or `⌃` + `` ` `` on macOS) from the project workspace and run the same `npm run apply-sql` command there. VS Code terminals inherit the environment variables defined in your shell session, so export `SUPABASE_DB_URL`/`SUPABASE_DB_PASSWORD` in the terminal before launching VS Code or configure them via a `.env` file and the built-in "Terminal: Run Active File" command. Once the variables are set, execute:

```bash
npm run apply-sql
```

The helper prints each statement as it runs and reports success or rollback status directly in the terminal panel, giving you immediate feedback without leaving the editor.
