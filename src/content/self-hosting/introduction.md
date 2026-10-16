## Meet your new home for media

TrackGeek brings your games, movies, series, anime, manga, and books together in one place. Self-hosting means running TrackGeek on a computer you control, instead of relying on someone else's server.

You get the TrackGeek web app and API, with a PostgreSQL database for your data and Redis for the services that need it. The installer takes care of bringing these parts together.

## What the installer handles

You do not need to set up each service by hand. The interactive installer guides you through the settings, then:

- Installs and starts Docker if it is missing.
- Downloads the TrackGeek web app and API from their `main` branches.
- Builds the applications and starts PostgreSQL and Redis.
- Prepares the database and adds reference data, including medals and missions.
- Installs the `tg` command so you can manage your instance from any directory.

Your new instance starts without demo accounts or a prefilled media catalogue. When setup finishes, open the web app and create your own account.

## A few things to know

TrackGeek supports **Linux, macOS, and Windows**. You will need an internet connection, room to build both applications, and keys for the services used for media lookup, image uploads, and email.

By default, your instance is available only on your own computer. You can choose access from other devices during setup. A public domain and HTTPS need extra setup that the installer does not provide.

## Make it yours

Start with [Before you begin](/requirements), then follow the [installation guide](/installation). Once TrackGeek is running, [everyday commands](/commands) cover starting, stopping, and checking your instance.

Everything in these guides is based on the [self-hosting README](https://github.com/TrackGeek/selfhost). The [source code](https://github.com/TrackGeek) is available on GitHub.
