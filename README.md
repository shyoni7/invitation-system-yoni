# מערכת הזמנות לאירועים

מערכת לעסק אחד: יצירת דפי הזמנה דיגיטליים לאירועים, הפצת קישור אחד לכל אירוע, הרשמה עצמית של המוזמנים, מעקב ותזכורות.
האפיון המלא ותכנית העבודה נמצאים ב-[docs/work-plan.md](docs/work-plan.md).

## טכנולוגיה

- Next.js 16 (App Router, TypeScript), Tailwind CSS 4
- Supabase: Postgres, Auth, Storage
- next-intl: עברית (ברירת מחדל, RTL) ואנגלית. השפה נשמרת בעוגייה ולא בכתובת, כך שלכל אירוע יש קישור אחד.
- Vercel לאירוח

## הרצה מקומית

```bash
npm install
cp .env.example .env.local
# מלא את משתני Supabase בקובץ .env.local
npm run dev
```

האתר עולה ב-http://localhost:3000.

## Supabase

סכמת הדאטאבייס נמצאת ב-`supabase/migrations/`. להרצה על פרויקט Supabase:

1. צור פרויקט ב-https://supabase.com/dashboard
2. הרץ את קבצי ה-migration לפי הסדר ב-SQL Editor, או דרך Supabase CLI: `supabase db push`
3. העתק מ-Project Settings > API את ה-URL, ה-publishable key וה-secret key ל-`.env.local`

## משתני סביבה

ראה `.env.example`. המשתנים עם `NEXT_PUBLIC_` נחשפים לדפדפן. `SUPABASE_SECRET_KEY` הוא לשרת בלבד.

## מבנה הפרויקט

```
src/app/              נתיבים (App Router)
src/components/       קומפוננטות משותפות
src/i18n/             הגדרות שפה, קריאת locale מעוגייה
src/lib/supabase/     לקוחות Supabase: דפדפן, שרת, admin, proxy
src/proxy.ts          רענון session והגנה על /admin
messages/             קבצי תרגום he.json, en.json
supabase/migrations/  סכמת DB
docs/                 אפיון ותכנית עבודה
.claude/skills/       סקילים של עיצוב ו-React לסשנים של Claude Code
```

## פקודות

```bash
npm run dev     # פיתוח
npm run build   # בנייה
npm run start   # הרצת גרסת production
npm run lint    # ESLint
```
