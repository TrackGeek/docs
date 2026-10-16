## Find your way around

The self-hosting repository contains the installer, management CLI, and templates used to run TrackGeek. The web app and API live in their own repositories and are cloned during installation.

## Main files

| Location | Responsibility |
| --- | --- |
| `src/installer.ts` | Coordinates the interactive setup wizard. |
| `src/cli.ts` | Handles management commands. |
| `src/config/` | Reads and validates configuration. |
| `src/docker/` | Installs, starts, and works with Docker. |
| `src/management/` | Manages services, CLI registration, and automatic startup. |
| `src/system/` | Shared filesystem, process, and Git PATH helpers. |
| `tests/` | Validation tests. |
| `templates/` | Deployment templates. |
| `install.sh` | Linux and macOS bootstrap. |
| `install.ps1` | Native Windows bootstrap. |

The bootstrap scripts work with both local checkouts and remote downloads of this project layout.

## Local development

From a checkout of the **self-hosting repository**, run the wizard with:

```sh
bun run start
```

Run its tests:

```sh
bun test
```

Check its TypeScript types:

```sh
bun run types
```

## Related repositories

- [TrackGeek/selfhost](https://github.com/TrackGeek/selfhost) — the installer and management CLI.
- [TrackGeek/web](https://github.com/TrackGeek/web) — the web application.
- [TrackGeek/api](https://github.com/TrackGeek/api) — the API.

The installer uses the `main` branches of the web app and API. See [Updating TrackGeek](/updates) for how source updates are applied.
