# Job Application Tracker

A polished dashboard and lightweight TypeScript API for organizing a job search.

## Stack

TypeScript · Node.js · Express · Vitest · HTML · CSS · JavaScript

## Features

- Add applications with company, role, stage, and application date
- View pipeline totals and filter by stage
- Responsive browser dashboard at `http://localhost:3000`
- JSON API for health checks and application data

## Run

```bash
npm install
npm run dev
```

The dashboard runs on `http://localhost:3000`. The API includes `GET /health`, `GET /applications`, and `POST /applications`.
