## Start with status and logs

Open a terminal in your installation directory. Check which services are running:

```sh
docker compose ps
```

Then watch the logs:

```sh
docker compose logs -f
```

Use `sudo docker` if the installer needed administrator access on Linux. Press `Ctrl+C` to stop watching logs without stopping the services.

## The tg command is not found

Open a new terminal after installation so it picks up changes to your PATH.

Linux and macOS launchers live in `${BUN_INSTALL:-~/.bun}/bin`. If `tg` is still unavailable, add the launcher directory to PATH using the command printed by the installer.

On Windows, the launcher is in `%LOCALAPPDATA%\TrackGeek\bin`, which the installer adds to your user PATH. Existing installations gain the command when you rerun the installer.

## Docker will not start

On Windows, check for WSL, virtualization, or restart requests. Restart if requested, then run the installation command again.

On macOS and Windows, complete Docker Desktop's setup dialogs. Automatic startup needs a user login; it does not run Docker Desktop before login.

On Linux, the boot integration requires systemd and `docker.service`. It does not support Docker Desktop or rootless-only installations.

## Another device cannot connect

The default setup allows access only from the server itself. Enable network access in the wizard and use web and API URLs that the other device can reach.

Check that you did not use `localhost` on another device. For public access, also check your DNS, reverse proxy, HTTPS, and firewall settings. See [Network & public access](/network-access).

## An update fails

Make sure both source repositories are on `main`, use the expected origin, and have no local changes, untracked files, or local commits.

A build failure leaves the previous services running, but source files may already be updated. Resolve the reported build error and run `tg update` again.

For migration or startup failures, inspect Compose logs. If new environment variables are required, rerun the setup wizard before retrying. Do not delete data volumes to resolve an update failure.

## Changed web settings do not appear

The web app's environment values are part of its build. Editing `web/.env` alone will not update the running frontend. Rerun the installer to apply configuration and rebuild.

## Stripe is not configured

`503 STRIPE_NOT_CONFIGURED` is expected when Stripe is disabled. The rest of the API starts normally. To enable payments, configure Stripe through the wizard; webhooks also need their own secret.

## Still need help?

Check the [self-hosting repository](https://github.com/TrackGeek/selfhost) and its [issues](https://github.com/TrackGeek/selfhost/issues). Include the command you ran and relevant error messages, but remove passwords, tokens, personal data, and API keys before sharing logs.
