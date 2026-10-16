## Meet the tg command

The installer adds a `tg` command for your user. Open a new terminal after installation. You can then use `tg` from any directory to manage the instance selected in the wizard.

If you install TrackGeek in several directories, the most recent installation becomes the target of `tg`.

## Start TrackGeek

```sh
tg start
```

Starts Docker if needed, starts the Compose services, and waits for the API and web containers to become healthy. Linux may request administrator access.

## Stop the apps

```sh
tg stop
```

Stops the **API and web app only**. Docker, PostgreSQL, Redis, and their data volumes stay running. If Docker is already stopped, this command does not start or install it.

## Show help

```sh
tg help
```

You can also use `tg`, `tg --help`, or `tg -h`. Help works even before an installation has finished. Invalid commands and extra arguments return a nonzero exit code.

## Other management commands

| Command | What it does |
| --- | --- |
| `tg update` | Updates and rebuilds the web app and API. Read [Updating TrackGeek](/updates) first. |
| `tg autostartup on` | Enables startup at boot or login. See [Automatic startup](/automatic-startup). |
| `tg autostartup off` | Removes TrackGeek's automatic startup registration. |

## Check status and logs

Run these commands **inside your installation directory**. If the installer used administrator access on Linux, use `sudo docker` instead of `docker`.

Check your services:

```sh
docker compose ps
```

Watch the logs. Press `Ctrl+C` to stop watching; the services keep running.

```sh
docker compose logs -f
```

Stop the whole stack, including PostgreSQL and Redis:

```sh
docker compose stop
```

Start the stack and wait for healthy services:

```sh
docker compose up -d --wait
```
