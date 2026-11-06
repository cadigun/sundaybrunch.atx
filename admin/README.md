# Pasture admin page

Run from the repository root:

```sh
npm --prefix web run admin
```

Open <http://127.0.0.1:4174>. The header toggle switches between local data and production.

Wrangler runs a local-only admin Worker at `127.0.0.1:8790`. Local mode shares `server/landing/.wrangler/state` with the landing Worker. Challenge data uses the same preview namespace ID selected by `--preview`; waitlist data uses the local namespace for `PASTURE_LANDING_WAITLIST`. This lets the admin see data seeded or submitted by local Wrangler runs.

Production mode reads and writes the production challenge namespace, and reads the production waitlist namespace. It uses your Wrangler login. If authentication has expired, run `npx wrangler login` from `server/landing`.

The admin Worker is only started with `wrangler dev`; there is no deploy script or public admin route. The React app reaches it through Vite's localhost proxy. Creating an event writes to the selected namespace, and existing IDs are not overwritten.
