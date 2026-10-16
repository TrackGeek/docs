## Do you need a bot?

`DISCORD_BOT_TOKEN` is optional. It lets the API connect a Discord bot for presence tracking. Discord sign-in uses `DISCORD_CLIENT_ID` and `DISCORD_CLIENT_SECRET` instead; see [Sign-in providers](/sign-in-credentials#discord).

## Create the bot token

1. Sign in to the [Discord Developer Portal](https://discord.com/developers/applications).
2. Create a **New Application**, or select your existing TrackGeek Discord application.
3. Open **Bot**. Create a bot if prompted, then choose **Reset Token** to generate a token. Confirm any password or two-factor prompt.
4. Copy the token into `DISCORD_BOT_TOKEN` in the installer. This value is not the application ID, public key, or OAuth client secret.

See [Discord's getting-started guide](https://docs.discord.com/developers/quick-start/getting-started) for the portal's current bot and token setup.

## Enable the required intents

TrackGeek's current Discord client requests guild, guild-member, and presence events. In the bot's **Privileged Gateway Intents** settings, enable **Server Members Intent** and **Presence Intent**, then save. Message Content Intent is not requested by this integration.

Discord may require approval for privileged intents on verified or larger bots. See [Discord's Gateway intents guide](https://docs.discord.com/developers/events/gateway#privileged-intents).

## Understand the server requirement

The bot must belong to the Discord server it reads. Use the application's server installation settings to install it into a server you are allowed to manage. Do not grant Administrator just to obtain a bot token.

The current TrackGeek API targets the server defined by `TRACKGEEK_GUILD_ID` in its [Discord constants](https://github.com/TrackGeek/api/blob/main/src/modules/discord/constants/discord.ts). The installer does not offer a server-ID setting. Setting a token alone does not make presence tracking work for an arbitrary server; that also depends on the API's server configuration and bot membership. See the [Discord gateway implementation](https://github.com/TrackGeek/api/blob/main/src/modules/discord/service/discord-gateway.service.ts).

You can leave `DISCORD_BOT_TOKEN` empty while using the rest of TrackGeek, including separately configured Discord sign-in.

## Save and replace the token

Rerun the installer to apply the token. If you reset it later, the previous token stops working, so replace the saved value too.

Keep bot tokens private. If a token is exposed, reset it in the portal and update your instance; deleting the public message alone does not revoke it.
