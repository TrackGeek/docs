## A supported computer

You can install TrackGeek on Linux, macOS, or Windows. The installer runs in an interactive terminal, so keep the terminal open and respond to its questions.

Your computer needs an internet connection and enough free disk space and memory to build the web app and API. The project does not specify a fixed minimum amount of RAM or disk space.

## Docker and other tools

Docker runs the services that make up your TrackGeek instance. The installer checks for Docker, installs it when needed, starts it, and waits until it is ready.

| Tool | What to expect |
| --- | --- |
| Docker | Installed automatically if missing. Linux uses Docker Engine; macOS and Windows use Docker Desktop. |
| Docker Compose | Version 2.30 or newer is required and checked automatically. |
| Bun | Installed by the bootstrap if missing. It also powers the management command. |
| Git | Installed through supported system package managers if missing. |
| Linux tools | Make sure `curl` and `unzip` are available before starting. |

Docker must use Linux containers. You may see administrator password prompts or Docker Desktop setup windows. The Docker Desktop installer accepts its subscription agreement using the official installation flag.

## Windows preparation

Use **PowerShell** for a native Windows installation. Do not run `install.sh` in native Windows.

Docker Desktop may need WSL, virtualization support, or a restart. If setup asks you to restart, do so and run the same installation command again. Complete Docker Desktop's first-run setup before relying on automatic startup.

## Gather your API keys

The wizard requires keys for **ImgBB, Hardcover, TMDB, IGDB, and Resend**, plus your verified Resend sender. Have these ready before running the installer. See [API keys & integrations](/api-keys) for the full list.

Optional services such as OAuth, Discord, Stripe, and Dataxamas can stay unconfigured.

## Check platform support

For Docker's supported operating system versions and platform requirements, see its official [Linux](https://docs.docker.com/engine/install/), [macOS](https://docs.docker.com/desktop/setup/install/mac-install/), or [Windows](https://docs.docker.com/desktop/setup/install/windows-install/) installation guide.

Ready? Continue to [Installation](/installation).
