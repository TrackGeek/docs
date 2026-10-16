## Before you update

Back up your database and configuration first. Review changes in the upstream [web](https://github.com/TrackGeek/web) and [API](https://github.com/TrackGeek/api) repositories before updating. Database migrations are not automatically rolled back.

If an update needs new configuration variables, rerun the setup wizard to supply them before retrying the update.

## Run the update

```sh
tg update
```

Updates happen only when you run this command. There is no background update scheduler.

## What happens during an update

The command checks both repositories, fetches their `main` branches, and brings the source code forward using fast-forward merges. It then builds new production images while the current services stay running.

Once the build succeeds, TrackGeek stops the API and web app, removes the completed initialization container, and starts the services again. Database migrations and the production seed run before the API starts.

Your data volumes and ignored configuration files, such as `.env`, are kept.

## Keep source checkouts clean

Both the web and API repositories must:

- Be on the `main` branch.
- Use the expected TrackGeek origin.
- Have no local changes, untracked files, or local commits.

Both repositories are checked before either checkout changes. If fetching or validation fails, the checkouts and running services stay unchanged.

## If something goes wrong

| Failure | What to expect |
| --- | --- |
| Fetch or repository check | Source checkouts and running services are unchanged. |
| Image build | Current services stay running with previous images. Source checkouts may already contain new commits. Fix the build issue and run `tg update` again. |
| Migration or startup | The command reports failure. Check Compose logs. Configuration and volumes remain intact, but migrations are not automatically rolled back. |

See [Troubleshooting](/troubleshooting) for log commands.

## Refresh the installer itself

`tg update` updates the API and web source using your installed Compose and Dockerfile templates. To refresh the management CLI and templates, rerun the installer.
