# Quick Start with Supabase

## 🎯 5-Minute Setup

### 1. Create Supabase Project
- Go to https://supabase.com → Sign up
- Create new project: `ev-charger-leads`
- Save your database password!

### 2. Get Connection String
- Project Settings → Database → Connection String (URI)
- Copy the full URI
- Replace `[YOUR-PASSWORD]` with your actual password

### 3. Configure Environment
Update `.env.local`:
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres"
OPENAI_API_KEY="sk-your-key-here"
```

### 4. Deploy Schema
```bash
npm run db:push
```

### 5. Load Data
```bash
# Download CSV from https://simplemaps.com/data/us-cities
# Save as: scripts/data/cache/uscities.csv

npm run collect:all
npm run seed
npm run generate:content  # Start with 100 cities
```

### 6. Test
```bash
npm run dev
```

Visit http://localhost:3000

---

**See [supabase-setup.md](file:///C:/Users/dhana/.gemini/antigravity/brain/9bac9d0b-ab6b-4b78-b15c-3bb1257f2eb8/supabase-setup.md) for detailed instructions.**
