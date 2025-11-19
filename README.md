# WK2026 Pronostiek — Complete Starter (deploy-ready)

Deze repo is een complete starter voor een open-source pronostiek-app voor WK 2026.
Het bevat:
- React + Vite frontend (Tailwind-ready)
- Supabase schema + seed
- Supabase Edge Function voor leaderboard recompute
- Vercel config voor eenvoudige deploy

## Quickstart

1. Unzip en open folder.
2. Maak een Supabase project (https://supabase.com) en voer `db/supabase_schema.sql` uit in SQL editor.
3. Zet environment variables in Vercel:
   - VITE_SUPABASE_URL = https://<project>.supabase.co
   - VITE_SUPABASE_ANON_KEY = <anon key>
4. (Optioneel) Deploy Supabase Edge Function `supabase/functions/recompute-leaderboard` using Supabase CLI.
5. Upload repo to GitHub and import project in Vercel. Deploy.

## Seed wedstrijden
`db/supabase_schema.sql` bevat een kleine seed. Voor het volledige toernooi kun je:
- handmatig toevoegen in Table Editor, of
- importeren via SQL seed file met alle wedstrijden.

## Notes
- Gebruik nooit `service_role` key in frontend.
- Voor automatische recompute: configureer DB trigger or call Edge Function after match updates.
