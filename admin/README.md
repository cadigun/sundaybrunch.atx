# Pasture admin page

Run from the repository root:

```sh
npm --prefix web run admin
```

Open <http://127.0.0.1:4174>. The dashboard reads KV data when it loads; use **Refresh data** after new submissions arrive.

Wrangler runs a local-only admin Worker at `127.0.0.1:8790`. Its KV bindings connect directly to Cloudflare: challenge events/submissions use the preview namespace, and waitlist signups use the canonical waitlist namespace. It uses your Wrangler login. If authentication has expired, run `npx wrangler login` from `server/landing`.

The admin Worker is only started with `wrangler dev`; there is no deploy script or public admin route. The React app reaches it through Vite's localhost proxy. The dashboard reads data only and does not modify KV.
