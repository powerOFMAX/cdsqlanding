# Code Square Landing (Astro + Bun)

Simple landing page for Code Square LLC with a contact form endpoint and Vercel deployment setup.

## Stack

- Astro
- Bun (package manager and scripts)
- Vercel adapter for Astro
- Resend Email API (contact form)
- Prettier + prettier-plugin-astro

## Commands

```bash
# install dependencies
~/.bun/bin/bun install

# run locally
~/.bun/bin/bun run dev

# format code
~/.bun/bin/bun run format

# verify formatting
~/.bun/bin/bun run check:format

# production build
ASTRO_TELEMETRY_DISABLED=1 ~/.bun/bin/bun run build

# deploy preview to Vercel
~/.bun/bin/bun run deploy:preview

# deploy production to Vercel
~/.bun/bin/bun run deploy
```

## Contact Form (Email Delivery)

The form sends a `POST` request to `src/pages/api/contact.ts` and that endpoint sends the email through Resend.

### Local setup

1. Copy `.env.example` to `.env`.
2. Fill values:

- `RESEND_API_KEY`: your Resend API key.
- `CONTACT_TO_EMAIL`: where inquiries should arrive.
- `CONTACT_FROM_EMAIL`: sender address verified in Resend.

### Vercel setup

In your Vercel project, add the same environment variables:

- `RESEND_API_KEY`
- `CONTACT_TO_EMAIL`
- `CONTACT_FROM_EMAIL`

Then redeploy.

## Notes

- Main page is `src/pages/index.astro`.
- Color palette and structure follow the provided reference image.
- Contact API endpoint is `src/pages/api/contact.ts`.
