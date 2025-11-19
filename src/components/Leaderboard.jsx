import React, {useEffect, useState} from 'react'
import { supabase } from '../lib/supabaseClient'
import { scoreForPrediction } from '../utils/score'

export default function Leaderboard() {
  const [rows, setRows] = useState([])

  useEffect(()=> {
    async function load(){
      const { data: participants } = await supabase.from('participants').select('*')
      const { data: matches } = await supabase.from('matches').select('*')
      const { data: predictions } = await supabase.from('predictions').select('*')
      const { data: config } = await supabase.from('config').select('*')
      const cfg = {}
      (config||[]).forEach(c=> cfg[c.key]=c.value)
      const matchMap = {}
      (matches||[]).forEach(m=> matchMap[m.id]=m)
      const scores = (participants||[]).map(p=>{
        const predsForP = (predictions||[]).filter(x=> x.participant_id === p.id)
        let total = 0, cs=0, cw=0
        predsForP.forEach(pr=>{
          const pts = scoreForPrediction(pr, matchMap[pr.match_id]||{}, cfg)
          total += pts
          if (pts >= Number(cfg.points_correct_score||3)) cs++
          else if (pts >= Number(cfg.points_correct_winner||1)) cw++
        })
        return { participant: p, total, cs, cw }
      })
      setRows(scores.sort((a,b)=> b.total - a.total))
    }
    load()
  }, [])

  return (
    <div className="card mt-4">
      <h3 className="text-lg font-semibold mb-2">Klassement</h3>
      <ol className="list-decimal pl-5">
        {rows.map(r=> (
          <li key={r.participant.id} className="py-1">{r.participant.display_name} — {r.total} pt ({r.cs} exact, {r.cw} winnaar)</li>
        ))}
      </ol>
    </div>
  )
}
