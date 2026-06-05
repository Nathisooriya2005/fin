# Playbook Pro

Sports turf booking app built with React, TanStack Start, Vite, and Nitro (Vercel-ready).

## Repository layout

| Path | Purpose |
|------|---------|
| `public/` | Static assets (PWA, icons, etc.) |
| `src/` | Application source (`routes/`, `components/`, `hooks/`, `lib/`, …) |
| `scripts/` | Optional tooling (e.g. `process:logo` for transparent PNG) |
| `package.json` / `package-lock.json` | Dependencies (use **npm**) |
| `vite.config.ts` | Vite + TanStack Start + Nitro |
| `tsconfig.json` | TypeScript |
| `vercel.json` | Vercel framework hint |

**Note:** `src/routeTree.gen.ts` is listed in `.gitignore` as `*.gen.ts`. It is **regenerated** when you run `npm run dev` or `npm run build`. After a fresh clone, run one of those once before relying on IDE typecheck.

## Development

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (often `http://localhost:3000`).

## Production build

```bash
npm install
npm run build
```

On Windows you may see a harmless Nitro **symlink** warning at the end; Vercel builds on Linux and does not hit this.

## Deploy to Vercel

1. Push the repository to GitHub (see commands below).
2. In [Vercel](https://vercel.com/new), import the GitHub repo.
3. Use default **Root directory** (repository root).
4. Vercel should detect **TanStack Start** (`vercel.json` sets `framework`).
5. Install: `npm install` · Build: `npm run build` (defaults match `vercel.json`).
6. Add any required **`VITE_*`** (or other) env vars in the Vercel project settings.
7. Deploy. Redeploy anytime with **Deployments → … → Redeploy** or by pushing to the connected branch.

## Optional: transparent logo PNG

If you replace `src/assets/logo-brand.png` and need the background removed again:

```bash
npm run process:logo
```

(Uses `sharp` in devDependencies.)

## GitHub: first-time upload

From the project root (this folder):

```powershell
cd "c:\Users\Nathisooriya\Downloads\playbook-pro-main (4)"

git init
git branch -M main

git add .
git status

git commit -m "Initial commit: Playbook Pro TanStack Start app"

git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

Replace `YOUR_USERNAME` and `YOUR_REPO` with your GitHub details.

## GitHub: later changes

```powershell
cd "c:\Users\Nathisooriya\Downloads\playbook-pro-main (4)"

git add .
git status
git commit -m "Describe your change in one short sentence."
git push origin main
```

## Vercel: redeploy after a push

If the project is already connected to GitHub, **`git push`** to the production branch triggers a new deployment automatically.

To redeploy **without** a new commit: Vercel dashboard → your project → **Deployments** → open the latest deployment → **⋯** → **Redeploy**.
