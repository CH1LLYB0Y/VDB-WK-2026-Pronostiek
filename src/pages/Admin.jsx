// src/pages/Admin.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Navbar from "../components/Navbar";

export default function Admin() {
  const [matches, setMatches] = useState([]);
  const [users, setUsers] = useState([]);
  const [newMatch, setNewMatch] = useState({ team1: "", team2: "", match_datetime: "" });

  useEffect(()=> { load(); }, []);

  async function load(){
    const { data: ms } = await supabase.from("matches").select("*").order("match_datetime", { ascending: true });
    setMatches(ms || []);
    const { data: us } = await supabase.from("users").select("*").order("name", { ascending: true });
    setUsers(us || []);
  }

  async function createMatch(){
    const { error } = await supabase.from("matches").insert([newMatch]);
    if (error) return alert(error.message);
    setNewMatch({ team1: "", team2: "", match_datetime: "" });
    load();
  }

  async function updateMatch(m){
    const { error } = await supabase.from("matches").update(m).eq("id", m.id);
    if (error) return alert(error.message);
    load();
  }

  async function deleteMatch(id){
    if (!confirm("Verwijder match?")) return;
    const { error } = await supabase.from("matches").delete().eq("id", id);
    if (error) return alert(error.message);
    load();
  }

  async function recomputeScores(){
    const { error } = await supabase.rpc("update_scores");
    if (error) return alert(error.message);
    alert("Scores geüpdatet");
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Admin — Beheer wedstrijden</h1>

        <div className="mb-4 p-3 border rounded">
          <h2 className="font-semibold">Nieuwe wedstrijd toevoegen</h2>
          <div className="flex gap-2 mt-2">
            <input className="border p-1" placeholder="Team 1" value={newMatch.team1} onChange={e=>setNewMatch({...newMatch, team1: e.target.value})} />
            <input className="border p-1" placeholder="Team 2" value={newMatch.team2} onChange={e=>setNewMatch({...newMatch, team2: e.target.value})} />
            <input type="datetime-local" className="border p-1" value={newMatch.match_datetime} onChange={e=>setNewMatch({...newMatch, match_datetime: e.target.value})}/>
            <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={createMatch}>Maak</button>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="font-semibold mb-2">Matches</h2>
          <div className="space-y-2">
            {matches.map(m => (
              <div key={m.id} className="p-2 border rounded flex items-center gap-2">
                <div className="w-64">{m.team1} vs {m.team2} <div className="text-xs text-gray-500">{new Date(m.match_datetime).toLocaleString()}</div></div>
                <input className="w-16 border p-1" defaultValue={m.score_a ?? ""} onChange={e=> m.score_a = e.target.value} />
                <input className="w-16 border p-1" defaultValue={m.score_b ?? ""} onChange={e=> m.score_b = e.target.value} />
                <button className="px-2 py-1 bg-blue-600 text-white rounded" onClick={()=> updateMatch(m)}>Update</button>
                <button className="px-2 py-1 bg-red-600 text-white rounded" onClick={()=> deleteMatch(m.id)}>Delete</button>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="font-semibold mb-2">Gebruikers</h2>
          <ul className="list-disc pl-5">
            {users.map(u => <li key={u.id}>{u.name} — {u.id}</li>)}
          </ul>
        </div>

        <div>
          <button className="bg-purple-600 text-white px-3 py-1 rounded" onClick={recomputeScores}>Recompute scores</button>
        </div>
      </div>
    </div>
  );
}
