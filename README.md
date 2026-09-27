# Jarvis-mobile

A small Express service that holds the mobile-side Jarvis state as plain JSON:
notes, tasks, and memory.

## What is here

| File | Purpose |
| --- | --- |
| `server.js` | The full service. Serves the notes, tasks, and memory endpoints and manages the JSON files on disk. |
| `server-simple.js` | A trimmed entrypoint. |
| `server-omniroute.js` | An entrypoint that fronts OmniRoute. |
| `data/*.json` | The state itself, checked in so the service starts with content. |

## Running

```sh
npm ci
node server.js
```

The service listens on port 8000.

State is read from and written to `data/`. The service creates any missing file
on startup, so a fresh clone works without extra setup.

## Note on this repository's history

`node_modules/` was previously committed here: 119,964 of the repository's
119,972 tracked files, which made every clone a 2.2 GB download. It also
published real credentials, because a vendored `node_modules/omniroute/.env`
was tracked and populated. Both are fixed at the current `HEAD`, but they remain
readable in the git history.

**Any credential that was present in that history should be treated as
compromised and rotated.** Untracking a file does not unpublish it.

## CI

`.github/workflows/ci.yml` is the shared workflow used across the `azhri1990`
ecosystem. It detects the stack after checkout rather than assuming one, so this
repository gets the Node job and the unconditional hygiene job. The hygiene job
is what keeps `node_modules` and `.env` out of the repository.
