## Payments are optional

Stripe is disabled by default. Leave it disabled if you do not need payments. The rest of TrackGeek can run without `STRIPE_SECRET_KEY` or `STRIPE_WEBHOOK_SECRET`.

Start with a Stripe **sandbox** when setting this up. Sandbox credentials do not charge real payment methods. Use live credentials only when you intend to accept real payments.

## Get your secret API key

1. Sign in to the [Stripe Dashboard](https://dashboard.stripe.com/).
2. Select the sandbox you want to use, then open [API keys](https://dashboard.stripe.com/apikeys).
3. Reveal or create a **Secret key** and copy it into `STRIPE_SECRET_KEY` in the installer.

Sandbox secret keys start with `sk_test_`; live secret keys start with `sk_live_`. A publishable key beginning with `pk_` is not the server secret. Keep the value private and save it when Stripe displays it. See [Stripe's API key guide](https://docs.stripe.com/keys).

## Get your webhook signing secret

A webhook lets Stripe notify TrackGeek about payment changes. Its signing secret is different from the API key.

1. Open **Workbench → Webhooks** in the same account and mode. Create an event destination.
2. Choose **your account** and **snapshot events** for TrackGeek's handler.
3. Choose **Webhook endpoint**. Enter your HTTPS API address followed by `/stripe/webhook`, such as `https://api.example.com/stripe/webhook`.
4. Select the events below and save. Reveal **Signing secret** and copy its `whsec_` value into `STRIPE_WEBHOOK_SECRET`.

See [Stripe's webhook setup guide](https://docs.stripe.com/webhooks). Stripe cannot deliver a dashboard webhook directly to `localhost`.

The current [TrackGeek webhook handler](https://github.com/TrackGeek/api/blob/main/src/modules/payment/controller/stripe.controller.ts) handles these events:

```text
checkout.session.completed
invoice.payment_succeeded
invoice.payment_failed
customer.subscription.deleted
```

Use the same sandbox or live mode for your key and destination. Each destination has its own signing secret.

## Test a local instance

For local testing, install and sign in to the [Stripe CLI](https://docs.stripe.com/stripe-cli). Keep this running:

```sh
stripe listen --forward-to http://localhost:408/stripe/webhook
```

Save the **listener's** `whsec_` value for local forwarding, rather than a dashboard secret. Replace port `408` if needed. See [Stripe's local webhook guide](https://docs.stripe.com/webhooks#test-your-handler).

## Apply and verify

Rerun the installer, enable Stripe, and enter both values. In Stripe's webhook delivery logs, check that events reach your API successfully.

These steps obtain credentials and connect webhook delivery. They do not create a product catalogue or configure your pricing. Review your payment configuration before enabling real charges. Never share secret keys or webhook signing secrets in screenshots or issue reports.
