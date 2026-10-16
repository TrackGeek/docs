## What you need

Resend sends TrackGeek's account emails. The installer requires `RESEND_API_KEY` and `RESEND_FROM`. You need a Resend account and access to the DNS settings of a domain you own.

## Verify your sending domain

1. Sign in to [Resend](https://resend.com/) and open [Domains](https://resend.com/domains).
2. Add the domain or subdomain you want to send from.
3. Copy the DNS records Resend displays into your domain provider's DNS settings.
4. Return to Resend and complete verification. Wait until the domain is marked as verified.

Use the records Resend generates for your domain rather than copying someone else's. See [Resend's domain guide](https://resend.com/docs/dashboard/domains/introduction).

## Get your API key

1. Open [API Keys](https://resend.com/api-keys) in the Resend dashboard.
2. Create a key with a name such as `TrackGeek` and permission to send email. If you restrict it to a domain, choose the verified domain you will send from.
3. Copy the generated value immediately and save it as `RESEND_API_KEY` in the installer. You cannot reveal the same value again later.

See [Resend's API key guide](https://resend.com/docs/dashboard/api-keys/introduction). The key belongs in the API configuration, not in a public frontend variable.

## Choose your sender address

`RESEND_FROM` is an email sender, not a second API key. Choose an address on your verified domain. For example, if you verified `example.com`, you could use:

```dotenv
RESEND_FROM='TrackGeek <noreply@example.com>'
```

Replace `example.com` with your own verified domain. A personal Gmail or Outlook address does not count as a verified domain you control. If you verified a subdomain, use that exact subdomain in the sender address.

## Apply and check

Enter both values in the installer, or rerun setup to change them. Try an account email action, such as requesting a password reset for your own registered account, and check Resend's email logs.

If sending fails, check domain verification, the key's sending permissions, and whether `RESEND_FROM` uses the correct domain. Keep keys and recipient details out of public issue reports.
