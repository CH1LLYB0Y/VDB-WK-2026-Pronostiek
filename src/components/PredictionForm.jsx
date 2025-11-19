import React, {useEffect, useState} from 'react'
import { supabase } from '../lib/supabaseClient'

export default function PredictionForm({participantId}) {
  const [matches, setMatches] = useState([])
  const [preds, setPreds] = useState({})

  useEffect(()=> {
    async function load(){
      const { data } = await supabase.from('matches').select('*').order('kickoff', {ascending:true})
      setMatches(data || [])
      const { data: pd } = await supabase.from('predictions').select('*').eq('participant_id', participantId)
      const map = {}
      (pd||[]).forEach(p => map[p.match_id] = p)
      setPreds(map)
    }
    if (participantId) load()
  }, [participantId])

  async function savePrediction(matchId) {
    const p = preds[matchId] || {}
    await supabase.from('predictions').upsert({
      participant_id: participantId,
      match_id: matchId,
      pred_a: p.pred_a ?? null,
      pred_b: p.pred_b ?? null
    }, { onConflict: ['participant_id','match_id'] })
    alert('Voorspelling opgeslagen')
  }

  function updateLocal(matchId, key, value) {
    setPreds(prev => ({...prev, [matchId]: {...(prev[matchId]||{}), [key]: value}}))
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-2">Vul je voorspellingen in</h3>
      <div className="space-y-3">
        {matches.map(m => (
          <div key={m.id} className="flex items-center justify-between">
            <div>
              <div className="font-medium">{m.team_a} vs {m.team_b}</div>
              <div className="text-sm text-gray-500">{new Date(m.kickoff).toLocaleString()}</div>
            </div>
            <div className="flex items-center gap-2">
              <input type="number" min="0" value={preds[m.id]?.pred_a ?? ''} onChange={e=> updateLocal(m.id,'pred_a', e.target.value)} className="w-16 p-1 border rounded" />
              <span>-</span>
              <input type="number" min="0" value={preds[m.id]?.pred_b ?? ''} onChange={e=> updateLocal(m.id,'pred_b', e.target.value)} className="w-16 p-1 border rounded" />
              <button onClick={()=> savePrediction(m.id)} className="ml-3 px-3 py-1 bg-blue-600 text-white rounded">Opslaan</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
