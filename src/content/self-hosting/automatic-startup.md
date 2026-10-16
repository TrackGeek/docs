## Enable automatic startup

Automatic startup is off by default. Enable it with:

```sh
tg autostartup on
```

This takes effect at the next boot or login. To start TrackGeek immediately as well, run:

```sh
tg start
```

Startup uses your existing images and configuration, waits for healthy services, and never runs an update. Running `on` again replaces the same registration instead of adding another.

## Linux

Linux startup runs at **boot**, without an interactive login. It needs systemd and a system Docker Engine service named `docker.service`. Docker Desktop and rootless-only installations are not supported by this boot integration.

Administrator access may be needed to create `/etc/systemd/system/trackgeek.service` and enable it alongside Docker. The service runs as the account that enabled startup, with Docker socket access, and retries failures every 30 seconds.

Check its logs with:

```sh
journalctl -u trackgeek.service
```

Your home and installation directories must be available at boot. Directories that need an interactive login to unlock cannot be relied on for this setup.

## macOS

Startup runs when your user **logs in**. It starts Docker Desktop if needed and retries failures every 30 seconds.

The registration is saved in `~/Library/LaunchAgents/com.trackgeek.startup.plist`. Logs are stored in `<install-dir>/.trackgeek/startup.log`.

## Windows

Startup runs when your user **logs in**, using a Task Scheduler task named `TrackGeekStartup-<user SID>`. It runs under your account without storing your password.

The task starts Docker Desktop if needed and retries failures up to three times, one minute apart. Use Task Scheduler to inspect execution results.

On macOS and Windows, Docker Desktop needs a user login and completed first-run setup. This integration does not start it before login.

## Disable automatic startup

```sh
tg autostartup off
```

This removes TrackGeek's startup registration. It does not stop services or disable Docker and other startup tasks.

Both `on` and `off` may start Docker to update existing TrackGeek containers to the `on-failure` restart policy. With this policy, crashed containers restart, but restarting Docker alone does not bring them back. This keeps automatic startup disabled after reboot when you choose `off`.

## Keep startup working

Startup uses absolute paths to Bun and the installed CLI. Keep Bun and your installation directory in place. The latest registration targets your current installation: system-wide on Linux, per user on macOS and Windows.
