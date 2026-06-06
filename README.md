# Sports Pitch Booking System

A sports turf booking system with separate customer and admin interfaces, built as a monorepo with independent deployments.

## Repository Structure

This is a monorepo containing three independent projects:

| Path | Purpose | Port | Deployment URL |
|------|---------|------|---------------|
| `frontend/` | Customer booking site (React + Vite) | 3000 | Frontend Vercel URL |
| `admin/` | Admin panel (HTML/JS) | 3001 | Admin Vercel URL |
| `shared/` | Shared API backend (Express) | 3002 | API Vercel URL |

## Project Details

### Frontend (Customer Site)
- **Tech Stack**: React, Vite, Tailwind CSS
- **Purpose**: Customer-facing booking interface
- **Development**: `cd frontend && npm run dev`
- **Build**: `cd frontend && npm run build`

### Admin Panel
- **Tech Stack**: HTML, JavaScript, Tailwind CSS
- **Purpose**: Admin dashboard for managing bookings
- **Development**: `cd admin && npm run dev`
- **Build**: Static HTML (no build step needed)

### Shared API
- **Tech Stack**: Express.js, Node.js
- **Purpose**: Shared backend API for both frontend and admin
- **Development**: `cd shared && npm run dev`
- **Database**: JSON file storage in `shared/data/bookings.json`

## Development

To run all projects locally:

```bash
# Terminal 1 - Frontend
cd frontend
npm install
npm run dev

# Terminal 2 - Admin
cd admin
npm install
npm run dev

# Terminal 3 - Shared API
cd shared
npm install
npm run dev
```

## Deployment to Vercel

Each project should be deployed separately on Vercel:

### 1. Deploy Frontend
1. Go to Vercel → New Project
2. Import GitHub repository
3. Set **Root Directory** to `frontend`
4. Framework preset: Vite
5. Deploy

### 2. Deploy Admin
1. Go to Vercel → New Project
2. Import GitHub repository
3. Set **Root Directory** to `admin`
4. Framework preset: Other
5. Deploy

### 3. Deploy Shared API
1. Go to Vercel → New Project
2. Import GitHub repository
3. Set **Root Directory** to `shared`
4. Framework preset: Other
5. Deploy

## API Endpoints

The shared API provides the following endpoints:

- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings` - Update booking status
- `DELETE /api/bookings/:id` - Delete booking
- `GET /api/time-slots/check?datetime=...` - Check if time slot is locked
- `POST /api/time-slots/lock` - Lock a time slot
- `DELETE /api/time-slots/unlock` - Unlock a time slot

## GitHub Setup

From the project root:

```powershell
cd "c:\Users\Nathisooriya\Downloads\sports-pitch-main (5)\sports-pitch-main"

git init
git branch -M main

git add .
git status

git commit -m "Initial commit: Sports pitch booking monorepo"

git remote add origin https://github.com/Nathisooriya2005/nnnn.git
git push -u origin main
```

## Environment Configuration

After deployment, update the API URL in both frontend and admin projects to point to the deployed shared API URL.
