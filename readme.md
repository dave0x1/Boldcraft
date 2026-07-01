# Boldcraft

Artist portfolio monorepo.

## Projects

- [`/backend`](./backend) — REST API (Node.js, Express, Prisma 7, Cloudinary)
- [`/frontend`](./frontend) — Gallery UI (React, Vite, TypeScript)

## Getting started

Each project is independent. See the README in each folder for setup instructions.

```bash
# Backend
cd backend && npm install && npm run dev

# Frontend
cd frontend && npm install && npm run dev
```

## Structure

```
Boldcraft/
  backend/     # Express API — image upload, processing, auth
  frontend/    # React gallery — public view + owner dashboard
  .gitignore
  README.md
```