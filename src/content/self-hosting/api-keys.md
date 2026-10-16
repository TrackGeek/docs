## Required credentials

TrackGeek uses external services to find media, upload images, and send email. Create the relevant service accounts yourself and enter your credentials in the wizard. The installer does not create external accounts for you.

| Service | Variable | Used for |
| --- | --- | --- |
| ImgBB | `IMGBB_API_KEY` | Image uploads. |
| Hardcover | `HARDCOVER_API_KEY` | Book lookup. |
| TMDB | `TMDB_API_KEY` | Movie and series lookup. |
| IGDB | `IGDB_CLIENT_ID` and `IGDB_CLIENT_SECRET` | Game lookup. |
| Resend | `RESEND_API_KEY` and `RESEND_FROM` | Sending email. |

All of these values are required. Empty values or values containing only spaces are rejected. Set `RESEND_FROM` to a sender that uses a **verified Resend domain**.

## How to get your credentials

Follow the guide for the service you are setting up. Each guide explains where to find the values, what to copy, and where to save them.

| Guide | Credentials covered |
| --- | --- |
| [Sign-in providers](/sign-in-credentials) | Google, Discord, GitHub, Twitch, Kick, Twitter / X, Slack, Microsoft, Notion, and Spotify client IDs and secrets. |
| [Discord bot](/discord-bot) | `DISCORD_BOT_TOKEN`. |
| [Media & image services](/media-credentials) | `IMGBB_API_KEY`, `HARDCOVER_API_KEY`, `TMDB_API_KEY`, `IGDB_CLIENT_ID`, and `IGDB_CLIENT_SECRET`. |
| [Email with Resend](/email-credentials) | `RESEND_API_KEY` and `RESEND_FROM`. |
| [Payments with Stripe](/stripe-credentials) | `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`. |

For `TMDB_API_KEY`, copy TMDB's **API Read Access Token**, which the current TrackGeek API uses as a Bearer token. The [TMDB guide](/media-credentials#tmdb) explains the difference from an API Key (v3).

## Optional sign-in and Discord

You can enter OAuth client IDs and secrets, and a `DISCORD_BOT_TOKEN`, individually in the wizard.

Leaving them empty makes the corresponding features unavailable. The wizard does not create OAuth applications for you.

## Optional payments with Stripe

Stripe is disabled by default for new installations. If you decline it, the wizard clears `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`.

Without a secret key, the API still starts normally. Prices and perks are empty, while checkout and webhook requests return `503 STRIPE_NOT_CONFIGURED`.

If you enable Stripe webhooks, you also need a webhook secret.

## Optional tracking with Dataxamas

Dataxamas is optional. Declining it leaves `VITE_DATAXAMAS_API_KEY` empty and disables browser and server tracking.

## Keep keys safe

Treat API keys like passwords. Keep them out of public issues, screenshots, and Git repositories. Store them only in your private configuration and backup copies.

To change integrations later, rerun the installer. See [Configuration](/configuration) for how those settings are applied.
