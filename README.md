# Sippins Cafe - Ordering & Management System

A professional Next.js 16 cafe ordering system with table-based ordering, menu management, and sales analytics.

## ✨ Features

- **Table Selection**: Visual grid for tables 1-20
- **Digital Menu**: 13 categories with 100+ items
- **Smart Cart**: Persistent cart with Zustand
- **Admin Dashboard**: Menu editor and sales analytics
- **Next.js 16 Ready**: All async params compliant
- **Production Ready**: PostgreSQL/Supabase support

## 🚀 Quick Start

### Local Development (SQLite)
```bash
npm install
npx prisma generate
npx prisma migrate dev
npx tsx prisma/seed.ts
npm run dev
```

### Production (Supabase/PostgreSQL)
See [SUPABASE_MIGRATION.md](./SUPABASE_MIGRATION.md) for complete setup guide.

## 📱 Usage

- **Customer**: http://localhost:3000 - Select table, browse menu, order
- **Admin**: http://localhost:3000/admin/menu - Manage menu and view sales

## 🔧 Tech Stack

Next.js 16 • React 19 • TypeScript • Prisma • Tailwind CSS v4 • Zustand

## 📚 Documentation

- [Supabase Migration Guide](./SUPABASE_MIGRATION.md) - PostgreSQL setup
- [Project Walkthrough](C:\Users\24dad\.gemini\antigravity\brain\b3c7565f-145e-4f27-a2b9-1c6d74efdb20\walkthrough.md) - Complete feature overview

## 🚀 Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Set `DATABASE_URL` environment variable to your Supabase connection string.

---

Built for **Sippin's Cafe** ☕
