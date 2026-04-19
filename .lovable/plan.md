
## Issue

The build runner invokes `bun run build:dev` at the repo root. Currently:

- Root `build:dev` → `cd frontend && npm exec vite build -- --mode development`
- `npm exec` inside a Bun-driven environment has been unreliable here (hence the cascading `vite: command not found` and `MODULE_NOT_FOUND` errors).
- There's a circular dependency in `frontend/package.json`: `"choco-sphere-monorepo": "file:.."` — the frontend depends on the root, which contains the frontend. This can corrupt `node_modules` resolution and is almost certainly why `vite`'s bin symlink keeps disappearing/breaking.

## Plan

1. **Remove the circular self-dependency** in `frontend/package.json` (drop the `choco-sphere-monorepo` line). This is the root cause of Vite's bin not being reliably linked.
2. **Simplify root scripts** to use `npm --prefix` consistently (which works regardless of shell/bun quirks since it runs npm directly):
   ```json
   "build": "npm --prefix frontend run build",
   "build:dev": "npm --prefix frontend run build:dev",
   "build:frontend": "npm --prefix frontend run build",
   "dev:frontend": "npm --prefix frontend run dev"
   ```
3. **Keep `frontend/package.json` scripts standard** (`vite`, `vite build`, etc.) — they work fine once the circular dep is gone and `node_modules/.bin/vite` is properly linked.
4. **Reinstall** frontend dependencies so `node_modules/.bin/vite` is recreated cleanly.
5. **Run `npm run build:dev`** at the root to confirm the build completes with no script or Vite path errors.

## Why this fixes it

The repeated failures (`vite: command not found`, then `Cannot find module .../vite/bin/vite.js`) all point to `node_modules/vite` being incomplete or its bin symlink missing. The `file:..` self-reference makes npm try to install the entire root (including the frontend itself) inside `frontend/node_modules`, which breaks hoisting and bin-linking. Removing it and reinstalling restores a normal layout, after which the standard `vite` command resolves correctly.
