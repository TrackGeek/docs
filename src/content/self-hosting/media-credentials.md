## The services you need

The installer requires credentials for ImgBB, Hardcover, TMDB, and IGDB. These support image uploads and media lookup. Create your own accounts, then enter the values in the wizard.

## ImgBB

Variable: `IMGBB_API_KEY`.

1. Create an [ImgBB account](https://imgbb.com/) or sign in.
2. Open the [ImgBB API page](https://api.imgbb.com/) while signed in.
3. Request or display your API key using the account controls on that page.
4. Copy the key into `IMGBB_API_KEY` in the installer.

This is an upload API key. You do not need to create an OAuth app or callback URL for it. ImgBB's [API documentation](https://api.imgbb.com/) describes the key used for image uploads.

## Hardcover

Variable: `HARDCOVER_API_KEY`.

1. Create a [Hardcover account](https://hardcover.app/) or sign in.
2. Open **Settings → API**, also available at [your API settings](https://hardcover.app/account/api).
3. Obtain the API token shown by your account's API settings. Complete any access or token-creation steps shown there.
4. Copy the token into `HARDCOVER_API_KEY`.

If the displayed value includes a leading `Bearer `, remove that word and the following space. TrackGeek adds the `Bearer` prefix itself. Copy only the token, without surrounding quotes from an example header.

Hardcover's [API explorer](https://api.hardcover.app/) explains where to obtain an account token. TrackGeek's [Hardcover integration](https://github.com/TrackGeek/api/blob/main/src/shared/infra/integrations/hardcover.service.ts) uses it for book lookup.

## TMDB

Variable: `TMDB_API_KEY`.

1. Create a [TMDB account](https://www.themoviedb.org/) or sign in.
2. Open **Settings → API** at [TMDB API settings](https://www.themoviedb.org/settings/api).
3. Request API access and complete the application details and terms if you have not already done so.
4. Copy the **API Read Access Token** into `TMDB_API_KEY`.

Despite the variable's name, the current TrackGeek API expects the **Read Access Token**, not the shorter API Key (v3). It sends the value as a Bearer token. Save only the token; do not add `Bearer ` yourself.

See [TMDB's application authentication guide](https://developer.themoviedb.org/v4/docs/authentication-application). This token also works with TMDB's v3 endpoints.

## IGDB

Variables: `IGDB_CLIENT_ID` and `IGDB_CLIENT_SECRET`.

IGDB uses Twitch's developer platform, so you obtain these values from a Twitch application.

1. Create or sign in to a Twitch account, verify your email, and enable two-factor authentication.
2. Open the [Twitch Developer Console](https://dev.twitch.tv/console/apps) and register an application for your IGDB integration.
3. Choose **Confidential** as its client type. IGDB does not use the redirect URL; its [getting-started guide](https://api-docs.igdb.com/#getting-started) recommends `localhost` for that registration field.
4. Open **Manage**, copy the application's **Client ID**, and generate a **New Secret**.
5. Save them as `IGDB_CLIENT_ID` and `IGDB_CLIENT_SECRET`.

TrackGeek exchanges this pair for an access token automatically. Do not put a temporary access token into either field. These variables are separate from `TWITCH_CLIENT_ID` and `TWITCH_CLIENT_SECRET`, which configure Twitch sign-in.

## Apply the values

Enter the credentials during installation, or rerun the installer to change them later. Keep them in your private configuration. See [API keys & integrations](/api-keys) for the full list of required and optional services.
