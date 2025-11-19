import { serve } from 'https://deno.land/std@0.204.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const url = Deno.env.get('SUPABASE_URL')!
  const key = Deno.env.get('SUPABASE_SERVICE_KEY')!
  const supabase = createClient(url, key)
  const { data: matches } = await supabase.from('matches').select('*')
  const { data: participants } = await supabase.from('participants').select('*')
  const { data: predictions } = await supabase.from('predictions').select('*')
  const { data: config } = await supabase.from('config').select('*')
  const cfg: any = {}
  (config||[]).forEach((c:any)=> cfg[c.key]=c.value)

  const matchMap:any = {}
  (matches||[]).forEach((m:any)=> matchMap[m.id] = m)

  const batch:any[] = []
  for (const p of (participants||[])) {
    const preds = (predictions||[]).filter((pr:any)=> pr.participant_id === p.id)
    let total = 0, cs = 0, cw = 0
    for (const pr of preds) {
      const m = matchMap[pr.match_id]
      if (!m || m.score_a === null) continue
      const pa = Number(pr.pred_a), pb = Number(pr.pred_b)
      const ma = m.score_a, mb = m.score_b
      if (pa === ma && pb === mb) { total += Number(cfg.points_correct_score||3); cs++ }
      else if (Math.sign(pa-pb) === Math.sign(ma-mb) && Math.sign(pa-pb)!==0) { total += Number(cfg.points_correct_winner||1); cw++ }
    }
    batch.push({ participant_id: p.id, points: total, correct_score: cs, correct_winner: cw })
  }

  await supabase.from('leaderboard').upsert(batch)
  return new Response(JSON.stringify({ ok: true }))
})
