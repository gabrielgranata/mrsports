# T‑Shirt Order Management App

A minimal Next.js + Prisma app for placing and managing custom T‑shirt orders with a customer portal and a simple admin.

## Quickstart

1. Copy `.env` and set admin credentials.
2. Install deps and run migrations:

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

Open `http://localhost:3000`.

Admin pages are under `/admin` and use Basic Auth. Default: `admin` / `change-me`.

## Stack
- Next.js App Router
- Tailwind CSS
- Prisma ORM (SQLite)
- Zod for validation

## Notes
- Orders expose a public ID (8 chars) for customers to view progress and send messages.
- Admin can update status, set quotes, and message customers.
- This is intentionally simple to get you productive quickly.
