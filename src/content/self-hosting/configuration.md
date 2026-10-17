## Settings in the wizard

The installer guides you through your installation directory, web and API ports, public browser URLs, network access, and service credentials.

New installations suggest web port **2026** and API port **408**. The ports must be different. Existing installations keep their saved settings. Changing a local port also changes its suggested localhost URL.

## Where settings are saved

Inside your installation directory, the wizard writes:

| File | Purpose |
| --- | --- |
| `.env` | Root configuration, including values passed into the web build. |
| `api/.env` | Configuration passed to the API when it runs. |
| `web/.env` | Web app environment settings. |
| `.trackgeek.json` | Saved installation settings. |

The wizard generates passwords and the authentication secret using cryptographically secure generation. Rerunning setup keeps your existing secrets and data volumes.

## Keep configuration private

These files contain passwords and API keys. Keep the installation directory private and do not commit configuration files to a public repository.

On Linux and macOS, configuration files use permissions `0600`, so only their owner can read and write them. Windows inherits filesystem permissions; restrict access to your own account.

## Required and optional services

Media lookup, image uploads, and email need credentials. The wizard rejects empty or whitespace-only required values. See [API keys & integrations](/api-keys) for each variable.

OAuth providers, a Discord bot, Stripe, and Dataxamas are optional. Leaving an optional integration empty makes its related features unavailable.

## Change settings later

The easiest way to change configuration is to rerun the installer. It applies your choices and rebuilds the applications.

Web settings are built into the frontend. Editing `web/.env` alone does not change the running web app; the root `.env` supplies its build arguments.

If you manually change **API-only** settings, run this inside the installation directory to recreate the API container:

```sh
docker compose up -d --force-recreate api
```

Keep [backups](/backups) of your configuration alongside your database backups.
