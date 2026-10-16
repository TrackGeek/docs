## Install TrackGeek

Choose your operating system below. Run the command in an interactive terminal and keep it open until the installer finishes. The installer may request administrator access or open Docker Desktop setup.

## Follow the setup wizard

The wizard asks where to install TrackGeek, which ports and browser URLs to use, whether other devices can connect, and which API keys to save.

For a new local installation, press **Enter** to accept the suggested ports and URLs. Choose **No** when asked to confirm the settings if you want to customize them.

| Service | Default address |
| --- | --- |
| Web app | `http://localhost:2026` |
| API | `http://localhost:408` |

These addresses work on the computer running TrackGeek. See [Network & public access](/network-access) to connect from another device.

## Open your instance

Once the installer finishes and the services are healthy, open [http://localhost:2026](http://localhost:2026), or the web URL you chose in the wizard.

Create your account through the web interface. The installer adds reference data, but it does not create a demo user or a media catalogue.

Open a **new terminal** to make the `tg` command available, then see its help:

```sh
tg help
```

## Install from a local checkout

If you already have the self-hosting repository on your computer, open its directory and run the matching bootstrap script.

On Linux or macOS:

```sh
bash install.sh
```

On Windows PowerShell:

```powershell
.\install.ps1
```

## Run setup again

Rerunning the installer keeps existing secrets and data volumes. It reuses existing source checkouts without automatically updating or resetting them.

Use the installer again to change configuration, rebuild the apps, or refresh the management CLI and deployment templates. Use [tg update](/updates) to update the web app and API source.
