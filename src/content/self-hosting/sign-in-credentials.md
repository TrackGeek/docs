## Before you start

Sign-in providers are optional. Set up only the ones you want. Each provider gives you a **client ID** and a **client secret** after you register an application. These belong to your self-hosted instance, not to the TrackGeek documentation site.

Enter both values in the installer. Keep secrets private. If a provider limits an application to test users, add the people who will use your instance or complete its publishing requirements.

## Choose the right callback URL

A callback URL tells the provider where to send the browser after sign-in. Use your **API address**, followed by `/auth/callback/` and the provider name.

For example, a default local Google callback is `http://localhost:408/auth/callback/google`. With a public API at `https://api.example.com`, it becomes `https://api.example.com/auth/callback/google`.

Replace `https://api.example.com` with your own API address everywhere below. Do not use your frontend address or `docs.trackgeek.net`. The scheme, host, port, and path must match what your API uses. The installer saves the API address as `BETTER_AUTH_URL`.

Some providers require HTTPS or reject `localhost`. Follow the provider's rules; an example local address is not supported by every provider. Spotify has an additional note below.

## Google

1. Open [Google Cloud Console](https://console.cloud.google.com/), then create or select a project.
2. In **Google Auth Platform**, complete **Branding** and **Audience**. Add test users if the app is in testing mode.
3. Open **Clients**, choose **Create client**, and select **Web application**.
4. Add `https://api.example.com/auth/callback/google` under **Authorized redirect URIs**. If you add a JavaScript origin, use your web app's address without a path.
5. Copy **Client ID** into `GOOGLE_CLIENT_ID` and **Client secret** into `GOOGLE_CLIENT_SECRET`. Save the secret when it is created.

See [Google's web application setup](https://developers.google.com/identity/protocols/oauth2/web-server#creatingcred) for the current dashboard steps.

## Discord

1. Open the [Discord Developer Portal](https://discord.com/developers/applications) and create a **New Application**.
2. Open **OAuth2**. Copy **Client ID** into `DISCORD_CLIENT_ID` and generate or reset **Client Secret** for `DISCORD_CLIENT_SECRET`.
3. Add `https://api.example.com/auth/callback/discord` under **Redirects**, then save.

These are the sign-in credentials. A bot token is a different value; follow the [Discord bot guide](/discord-bot) if you need one. See [Discord's OAuth2 documentation](https://docs.discord.com/developers/topics/oauth2) for details.

## GitHub

1. In GitHub, open **Settings → Developer settings → OAuth Apps**, then choose **New OAuth App**. You can also open [OAuth Apps directly](https://github.com/settings/developers).
2. Give the app a name and set **Homepage URL** to your TrackGeek web address.
3. Set **Authorization callback URL** to `https://api.example.com/auth/callback/github`, then register the app.
4. Copy **Client ID** into `GITHUB_CLIENT_ID`. Generate a client secret and save it as `GITHUB_CLIENT_SECRET`.

Use an OAuth App for this setup. See [GitHub's OAuth App guide](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app).

## Twitch

1. Verify your Twitch email and enable two-factor authentication.
2. Open the [Twitch Developer Console](https://dev.twitch.tv/console/apps), then **Register Your Application**.
3. Choose a name and category, add `https://api.example.com/auth/callback/twitch` as an **OAuth Redirect URL**, and use a **Confidential** client if asked.
4. After creating the app, open **Manage**. Copy **Client ID** into `TWITCH_CLIENT_ID` and use **New Secret** for `TWITCH_CLIENT_SECRET`.

See [Twitch's app registration guide](https://dev.twitch.tv/docs/authentication/register-app/). IGDB credentials use Twitch's developer tools too, but belong in the [IGDB settings](/media-credentials#igdb), not automatically in these sign-in fields.

## Kick

1. Sign in to Kick and enable two-factor authentication in your account settings.
2. Open **Settings → Developer** in [Kick's developer settings](https://kick.com/settings/developer).
3. Create an app and register `https://api.example.com/auth/callback/kick` as its redirect URL.
4. Copy the generated **Client ID** into `KICK_CLIENT_ID` and **Client Secret** into `KICK_CLIENT_SECRET`.

See [Kick's official app setup guide](https://github.com/KickEngineering/KickDevDocs/blob/main/getting-started/kick-apps-setup.md).

## Twitter / X

1. Open the [X Developer Console](https://developer.x.com/), complete any access requirements, and create or select an app.
2. In the app's authentication settings, enable **OAuth 2.0** and choose **Web App**, a confidential client.
3. Set the callback URL to `https://api.example.com/auth/callback/twitter` and the website URL to your TrackGeek web address.
4. Save, then copy the **OAuth 2.0 Client ID** and **Client Secret** into `TWITTER_CLIENT_ID` and `TWITTER_CLIENT_SECRET`.

These are OAuth 2.0 credentials, not the OAuth 1.0 API Key and API Key Secret. TrackGeek keeps the provider name `twitter` even though the service is now called X. See [X's OAuth 2.0 setup](https://docs.x.com/fundamentals/authentication/oauth-2-0/authorization-code).

## Slack

1. Open [Slack's app dashboard](https://api.slack.com/apps), choose **Create New App → From scratch**, and select a workspace you manage.
2. Under **Basic Information → App Credentials**, copy **Client ID** into `SLACK_CLIENT_ID` and **Client Secret** into `SLACK_CLIENT_SECRET`.
3. Under **OAuth & Permissions → Redirect URLs**, add `https://api.example.com/auth/callback/slack` and save.
4. Configure **Sign in with Slack** with `openid`, `profile`, and `email`. TrackGeek requests these sign-in permissions; a bot token is not used for this login.

Follow [Slack's Sign in with Slack guide](https://docs.slack.dev/authentication/sign-in-with-slack/) for the app's setup and distribution requirements.

## Microsoft

1. Open the [Microsoft Entra admin center](https://entra.microsoft.com/) and go to **Entra ID → App registrations → New registration**.
2. Choose the account type that allows both organizational and personal Microsoft accounts. TrackGeek's current configuration uses the `common` tenant.
3. Under **Authentication**, add a **Web** redirect URI: `https://api.example.com/auth/callback/microsoft`.
4. Copy **Application (client) ID** from **Overview** into `MICROSOFT_CLIENT_ID`.
5. Open **Certificates & secrets → Client secrets → New client secret**. Save the secret's **Value**, not its Secret ID, as `MICROSOFT_CLIENT_SECRET`. Record its expiry so you can replace it before it stops working.

See Microsoft's guides to [registering an app](https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-register-app) and [creating a client secret](https://learn.microsoft.com/en-us/entra/identity-platform/how-to-add-credentials).

## Notion

1. Open the [Notion Developer Portal](https://www.notion.so/profile/integrations) and create a public OAuth connection or integration.
2. Complete the requested application information. Under **OAuth Domain & URIs** or the connection's OAuth configuration, register `https://api.example.com/auth/callback/notion`.
3. Enable the user-information capability that includes **email addresses**, which TrackGeek's authentication provider needs.
4. Copy **OAuth client ID** into `NOTION_CLIENT_ID` and **OAuth client secret** into `NOTION_CLIENT_SECRET`. An internal integration token is not a replacement for this pair.

See [Notion's authorization guide](https://developers.notion.com/guides/get-started/authorization) for public connection and review requirements.

## Spotify

1. Open the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) and create an app.
2. Enter an app name and description. Add `https://api.example.com/auth/callback/spotify` as the redirect URI and select **Web API** if asked.
3. Open the app's **Settings**. Copy **Client ID** into `SPOTIFY_CLIENT_ID` and use **View client secret** for `SPOTIFY_CLIENT_SECRET`.
4. Follow the dashboard's user-access settings for development mode. Spotify currently requires the app owner to have Premium, and development apps have an authorized-user limit.

Spotify rejects `localhost` redirect URIs. Use your public HTTPS API URL. For local development, Spotify accepts an explicit loopback address such as `http://127.0.0.1:408/auth/callback/spotify`, but your configured API URL must use the same address; changing only the Spotify dashboard is not enough. Rerun TrackGeek's installer when changing URLs.

See [Spotify's app setup](https://developer.spotify.com/documentation/web-api/tutorials/getting-started), [redirect URI rules](https://developer.spotify.com/documentation/web-api/concepts/redirect_uri), and [development-mode restrictions](https://developer.spotify.com/documentation/web-api/concepts/quota-modes).

## Apply your credentials

Rerun the installer and enter the values for each provider you enabled. Keep both fields empty for providers you are not using. Then try that provider from your own TrackGeek sign-in screen.

If a provider reports a redirect mismatch, compare its saved callback with your API URL, including `http` versus `https`, the port, and the `/auth/callback/` path. See [Configuration](/configuration) and [Network & public access](/network-access) for changing your instance settings.
