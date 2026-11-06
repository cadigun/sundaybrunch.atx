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
- `GET /v1/challenges/:eventId` and `/api/v1/challenges/:eventId` to validate an event and return its public status
- `POST /v1/challenges/:eventId/claim` and `/api/v1/challenges/:eventId/claim` to assign and persist one prompt per Instagram username
- `POST /v1/challenges/:eventId/complete` and `/api/v1/challenges/:eventId/complete` to record completion

## Challenge event KV values

Store each event under `event:{eventId}` in `PASTURE_LANDING_CHALLENGE`:

```json
{
  "name": "Sunday Table Preview",
  "active": true,
  "startTime": null,
  "endTime": null,
  "prompts": [
    "Take a picture with someone wearing blue.",
    {
      "template": "Take a picture with someone wearing {color}.",
      "options": {
        "color": ["red", "yellow", "white", "blue"]
      }
    },
    {
      "template": "Find someone who has visited {continent} and take a picture together.",
      "options": {
        "continent": ["Europe", "Asia", "Africa", "North America", "South America", "Oceania"]
      }
    }
  ]
}
```

`active: true` forces an event open, `active: false` forces it closed, and `active: null` uses `startTime` and `endTime` as the schedule. Prompts can be plain strings or templates with option lists. When a participant claims a challenge, the Worker chooses an option for each placeholder and saves the resolved prompt in their claim, so it remains unchanged if they return later. The frontend only receives the public event status; prompts are returned after a successful claim.

For local preview data, add a value to the local challenge namespace:

```sh
npx wrangler kv key put --local --binding PASTURE_LANDING_CHALLENGE \
  'event:7xK4mQ2p' \
  '{"name":"Sunday Table Preview","active":true,"startTime":null,"endTime":null,"prompts":["Take a picture with someone wearing blue.","Find someone who has visited another country and take a picture together.","Take a picture with someone you met for the first time tonight."]}'
```
