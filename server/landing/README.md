# Pasture landing API

Hono + Cloudflare Worker API for the landing-page signup list.

## Setup

1. Replace `REPLACE_WITH_KV_NAMESPACE_ID` in `wrangler.jsonc` with the KV namespace ID.
2. Run:

```sh
npm run launch
```

That installs dependencies, generates Cloudflare types, and deploys the Worker.

## Local development

```sh
npm install
npm run dev
```

## Endpoints

- `GET /health`
- `GET /api/health` for the public `pasture.place/api/` route
- `POST /v1/signup` with `{ "email": "...", "city": "..." }` for direct Worker/local access; `city` is optional
- `POST /api/v1/signup` with `{ "email": "...", "city": "..." }` for the public `pasture.place/api/` route; `city` is optional
