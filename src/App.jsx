import React, {useEffect, useState} from 'react'
import PredictionForm from './components/PredictionForm'
import Leaderboard from './components/Leaderboard'
import AdminPanel from './components/AdminPanel'
import { supabase } from './lib/supabaseClient'

export default function App(){
  const [participant, setParticipant] = useState(null)

  useEffect(()=> {
    const stored = localStorage.getItem('participant')
    if (stored) setParticipant(JSON.parse(stored))
  }, [])

  async function createParticipant(displayName, groupName){
    const { data } = await supabase.from('participants').insert([{display_name: displayName, group_name: groupName}]).select().single()
    setParticipant(data)
    localStorage.setItem('participant', JSON.stringify(data))
  }

  if (!participant) {
    return <Signup onCreate={createParticipant} />
  }

  return (
    <div className="container">
      <header className="header">
        <h1 className="text-2xl font-bold">WK2026 Pronostiek</h1>
        <div>
          <div className="text-sm">{participant.display_name} ({participant.group_name})</div>
        </div>
      </header>
      <main className="grid md:grid-cols-2 gap-6">
        <div>
          <PredictionForm participantId={participant.id} />
        </div>
        <div>
          <Leaderboard />
          <AdminPanel />
        </div>
      </main>
    </div>
  )
}

function Signup({onCreate}){
  const [name,setName] = useState('')
  const [group,setGroup] = useState('')
  return (
    <div className="container">
      <div className="card max-w-xl mx-auto">
        <h2 className="text-xl font-semibold mb-3">Welkom — maak je pronostiek</h2>
        <div className="flex gap-2">
          <input placeholder="Je naam" value={name} onChange={e=> setName(e.target.value)} className="p-2 border rounded flex-1" />
          <input placeholder="Groep (bv. Familie)" value={group} onChange={e=> setGroup(e.target.value)} className="p-2 border rounded w-56" />
          <button onClick={()=> onCreate(name, group)} className="px-3 py-2 bg-blue-600 text-white rounded">Start</button>
        </div>
        <p className="text-sm mt-2">Tip: deel de link met je familie nadat je bent aangemeld.</p>
      </div>
    </div>
  )
}
