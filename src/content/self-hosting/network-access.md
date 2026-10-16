## Local access by default

New installations bind the web app and API to `127.0.0.1`. This means only the computer running TrackGeek can reach them.

The default web address is `http://localhost:2026`. The default API address is `http://localhost:408`.

PostgreSQL and Redis stay inside the Docker Compose network. They are not exposed for direct access from your network.

## Connect from another device

In the setup wizard, choose to customize the settings and enable network access. Set the web and API browser URLs to a hostname or IP address that the other device can reach.

`localhost` always means the device using the browser. A phone visiting `localhost` tries to connect to the phone itself, not your TrackGeek server.

The web app and API must use different ports. Make sure both chosen URLs are reachable from the devices you plan to use.

## Use your own domain

For public hosting, you need to configure the following yourself:

- **DNS** to point your domain at your server.
- A **reverse proxy** to send incoming requests to the right service.
- **TLS / HTTPS** to encrypt connections.
- A **firewall** to control which services can be reached.

The installer does not provision a domain or HTTPS. There is no automatic public-hosting configuration in the wizard.

## Passkeys need HTTPS

Passkeys require HTTPS, except when using localhost. If passkeys do not work when visiting your instance from another device, check that the browser is using HTTPS.

## Change your network settings

Rerun the installer to change URLs, ports, or network access. This also rebuilds the web app with its new settings. Editing the web environment file alone does not update the running frontend.
