## What to save

Before running `tg update` or applying new migrations, save a copy of your PostgreSQL database and configuration files. Keep backups private: they can contain account data, passwords, and API keys.

Your configuration includes the root `.env`, `api/.env`, `web/.env`, and `.trackgeek.json` inside your installation directory.

## Back up the database

Run this command **inside your installation directory**. It writes a database dump to `trackgeek.sql` in that directory. Choose a different filename when keeping multiple backups.

```sh
docker compose exec -T postgres pg_dump -U trackgeek -d trackgeek > trackgeek.sql
```

If the installer used administrator access on Linux, use `sudo docker` instead of `docker`.

On Windows PowerShell, use a binary-safe output method or run the backup command in a shell that preserves UTF-8 output. Incorrect output handling can damage the dump.

## Keep a private copy

Copy your database dump and configuration backup to a private location outside the installation directory. Protect access to both, and keep track of which application version each backup belongs to.

The installer does not provide automatic backup scheduling or an automatic database rollback. The README does not define a restore procedure; do not assume that rerunning setup restores a database dump.

## Know which commands keep data

| Action | Effect on data |
| --- | --- |
| `tg stop` | Stops the web app and API. Database services and volumes stay running. |
| `docker compose stop` | Stops the stack and keeps its data. |
| `docker compose down` | Removes containers but retains data volumes. |
| Rerun the installer | Retains existing secrets and data volumes. |

> **Warning:** Adding `--volumes` to `docker compose down` permanently deletes the data volumes. Do not use it to fix a routine startup issue.

## Update with care

An update can apply database migrations. Those migrations are not automatically rolled back if startup fails. Read [Updating TrackGeek](/updates) before proceeding.
