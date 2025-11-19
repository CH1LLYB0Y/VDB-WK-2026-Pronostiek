import React, {useEffect, useState} from 'react'
import { supabase } from '../lib/supabaseClient'

export default function AdminPanel(){
  const [matches, setMatches] = useState([])
  const [config, setConfig] = useState({})

  useEffect(()=> {
    async function load(){
      const { data: ms } = await supabase.from('matches').select('*').order('kickoff', {ascending:true})
      setMatches(ms||[])
      const { data: cfg } = await supabase.from('config').select('*')
      const map = {}
      (cfg||[]).forEach(c=> map[c.key]=c.value)
      setConfig(map)
    }
    load()
  }, [])

  async function updateMatchResult(id,a,b){
    await supabase.from('matches').update({score_a: a === '' ? null : a, score_b: b === '' ? null : b}).eq('id', id)
    alert('Resultaat opgeslagen — run recompute function in Supabase of wait for trigger.')
  }

  async function updateConfig(key, value){
    await supabase.from('config').upsert({key, value})
    setConfig(prev=> ({...prev, [key]: value}))
  }

  return (
    <div className="card mt-4">
      <h3 className="text-lg font-semibold mb-2">Admin</h3>
      <div className="mb-3">
        <div className="flex gap-2 items-center">
          <label className="w-40">Punten voor exacte score</label>
          <input value={config.points_correct_score||3} onChange={e=> setConfig(prev=>({...prev, points_correct_score: e.target.value}))} className="p-1 border rounded" />
          <button onClick={()=> updateConfig('points_correct_score', config.points_correct_score)} className="ml-2 px-2 py-1 bg-green-600 text-white rounded">Opslaan</button>
        </div>
        <div className="flex gap-2 items-center mt-2">
          <label className="w-40">Punten juiste winnaar</label>
          <input value={config.points_correct_winner||1} onChange={e=> setConfig(prev=>({...prev, points_correct_winner: e.target.value}))} className="p-1 border rounded" />
          <button onClick={()=> updateConfig('points_correct_winner', config.points_correct_winner)} className="ml-2 px-2 py-1 bg-green-600 text-white rounded">Opslaan</button>
        </div>
      </div>
      <div>
        <h4 className="font-medium mb-2">Matches</h4>
        {matches.map(m=> (
          <div key={m.id} className="flex gap-2 items-center mb-2">
            <div className="w-64">{m.team_a} vs {m.team_b}</div>
            <input id={'ma-'+m.id} defaultValue={m.score_a ?? ''} className="w-16 p-1 border rounded" />
            <input id={'mb-'+m.id} defaultValue={m.score_b ?? ''} className="w-16 p-1 border rounded" />
            <button onClick={()=> updateMatchResult(m.id, document.getElementById('ma-'+m.id).value, document.getElementById('mb-'+m.id).value)} className="ml-2 px-2 py-1 bg-blue-600 text-white rounded">Update</button>
          </div>
        ))}
      </div>
    </div>
  )
}
