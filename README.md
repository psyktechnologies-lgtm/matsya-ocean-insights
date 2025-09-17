# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/df6215fc-a25d-409f-86bc-d6f2a4995a20

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/df6215fc-a25d-409f-86bc-d6f2a4995a20) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/df6215fc-a25d-409f-86bc-d6f2a4995a20) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

---

## Matsya Ocean Insights - Quickstart & Deploy

This repository includes a React + TypeScript frontend and a lightweight FastAPI backend (for local development). Lovable.ai is already connected for live editing and preview.

Local quickstart

1. Install dependencies

```powershell
npm install
python -m venv .venv; .\.venv\Scripts\Activate.ps1
pip install -r backend/requirements.txt
```

2. Run backend

```powershell
uvicorn backend.app.main:app --reload --port 8000
```

3. Run frontend

```powershell
npm run dev
```

Environment variables (important)

- `VITE_API_BASE` — default `http://localhost:8000/api`; points frontend to local backend.
- `VITE_USE_SUPABASE` — set to `true` to enable Supabase-backed species fetch and auth flows.
- `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` — Supabase project URL and anon key (set when using Supabase).
- `MAPBOX_TOKEN` — Mapbox token for map rendering.

GitHub push & connect to lovable.ai

1. Create a repository on GitHub and copy the remote URL.

2. Push local repo to GitHub:

```powershell
git init
git add .
git commit -m "Initial commit: Matsya Ocean Insights"
git branch -M main
git remote add origin <YOUR_GITHUB_REMOTE_URL>
git push -u origin main
```

3. In lovable.ai: create or open your project and connect the GitHub repo. Then configure environment variables in the lovable project settings (VITE_API_BASE will point to your backend API URL; for Supabase-enabled deployments, set the SUPABASE vars as well).

CI

A GitHub Actions workflow runs TypeScript, ESLint, and Vitest. See `.github/workflows/ci.yml`.

Notes

- The FastAPI backend under `backend/` is a mock for local development. Replace with persistent services for production.
- If you use Supabase in production, secure your keys in the lovable project settings (do not commit them to the repository).
