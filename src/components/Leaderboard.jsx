import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Leaderboard() {
  const [rows, setRows] = useState([]);

  useEffect(()=> {
    async function load() {
      const { data: users } = await supabase.from('users').select('*');
      const { data: scores } = await supabase.from('scores').select('*');
      const map = {};
      (scores||[]).forEach(s => map[s.user_id] = s.total_points);
      const out = (users||[]).map(u => ({ user: u, points: map[u.id] ?? 0 }));
      setRows(out.sort((a,b)=> b.points - a.points));
    }
    load();
  }, []);

  return (
    <div className="card p-3">
      <h3 className="font-semibold mb-2">Klassement</h3>
      <ol className="list-decimal pl-5">
        {rows.map(r=> <li key={r.user.id} className="py-1">{r.user.name} — {r.points} pt</li>)}
      </ol>
    </div>
  );
}
