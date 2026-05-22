# TaskFlow — Mini Task Management Dashboard

A full-stack task management web application built with **Next.js**, **Node.js API routes**, and **Supabase** (PostgreSQL).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), React 18, Tailwind CSS |
| Backend | Next.js API Routes (Node.js runtime) |
| Database | Supabase (PostgreSQL, free tier) |
| Hosting | Vercel (free tier) |

---

## Features

- ✅ Create, Read, Update, Delete tasks (full CRUD)
- ✅ Kanban board — To Do / In Progress / Completed columns
- ✅ Each task has: Title, Description, Status, Due Date
- ✅ Overdue task detection with visual indicator
- ✅ Filter tasks: All / Due Today / Overdue
- ✅ Live stats bar (total, by status, completion rate)
- ✅ Toast notifications for all actions
- ✅ Responsive design (mobile-friendly)
- ✅ Persisted in Supabase PostgreSQL database

---

## Local Setup (Step by Step)

### Step 1 — Create Supabase project

1. Go to [supabase.com](https://supabase.com) → Sign up (free)
2. Click **New Project** → give it a name → set a password → choose a region
3. Wait ~1 minute for the project to be ready
4. Go to **SQL Editor** (left sidebar) → click **New Query**
5. Paste and run this SQL:

```sql
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'completed')),
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

6. Go to **Settings → API** → copy:
   - **Project URL** (looks like `https://xxxx.supabase.co`)
   - **anon/public** key

---

### Step 2 — Configure environment

```bash
cp .env.local.example .env.local
```

Open `.env.local` and fill in your values:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

---

### Step 3 — Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tasks` | Fetch all tasks |
| POST | `/api/tasks` | Create a new task |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

### POST/PUT Request Body

```json
{
  "title": "Task title",
  "description": "Optional description",
  "status": "todo | in_progress | completed",
  "due_date": "2025-01-31"
}
```

---

## Deploy to Vercel (Free)

1. Push your code to a GitHub repository
2. Go to [vercel.com](https://vercel.com) → Import project
3. Add your environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy — done!

---

## Project Structure

```
task-dashboard/
├── app/
│   ├── api/
│   │   └── tasks/
│   │       ├── route.js          # GET, POST
│   │       └── [id]/route.js     # PUT, DELETE
│   ├── globals.css
│   ├── layout.js
│   └── page.js                   # Main dashboard
├── components/
│   ├── TaskBoard.js              # Kanban board (3 columns)
│   ├── TaskCard.js               # Individual task card
│   └── TaskForm.js               # Create/edit modal
├── lib/
│   └── supabase.js               # Supabase client
├── .env.local.example
├── next.config.js
├── tailwind.config.js
└── README.md
```
