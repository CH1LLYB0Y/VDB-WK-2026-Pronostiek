// src/components/DashboardHome.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function DashboardHome({ user }) {
  const [nextMatch, setNextMatch] = useState(null);
  const [myPreds, setMyPreds] = useState([]);
  const [top, setTop] = useState([]);

  useEffect(()=> {
    async function load(){
      const { data: m } = await supabase
        .from("matches")
        .select("*")
        .order("match_datetime", { ascending: true })
        .limit(1);
      setNextMatch(m?.[0] || null);

      const { data: p } = await supabase
        .from("pronostieken")
        .select("*")
        .eq("user_id", user.id)
        .order("submitted_at", { ascending: false })
        .limit(10);
      setMyPreds(p || []);

      const { data: s } = await supabase
        .from("scores")
        .select("user_id, total_points")
        .order("total_points", { ascending: false })
        .limit(5);
      // fetch user names
      const uids = s?.map(r=>r.user_id) || [];
      const { data: users } = await supabase.from("users").select("id,name").in("id", uids);
      const map = (users||[]).reduce((a,b)=> (a[b.id]=b.name, a), {});
      setTop((s||[]).map(r=> ({ name: map[r.user_id] || r.user_id, points: r.total_points })));
    }
    load();
  }, [user]);

  return (
    <div className="space-y-4">
      <div className="p-4 border rounded shadow">
        <h3 className="font-semibold mb-2">Volgende match</h3>
        {nextMatch ? (
          <>
            <div>{nextMatch.team1} - {nextMatch.team2}</div>
            <div className="text-sm text-gray-500">{new Date(nextMatch.match_datetime).toLocaleString()}</div>
          </>
        ) : <div>Geen match gevonden</div>}
      </div>

      <div className="p-4 border rounded shadow">
        <h3 className="font-semibold mb-2">Jouw laatste voorspellingen</h3>
        <ul className="list-disc pl-5">
          {myPreds.map(p=> <li key={p.id}>{p.match_id}: {p.team1_score ?? "-"} - {p.team2_score ?? "-"}</li>)}
        </ul>
      </div>

      <div className="p-4 border rounded shadow">
        <h3 className="font-semibold mb-2">Top 5</h3>
        <ol className="pl-5">
          {top.map((t,i)=> <li key={i}>{t.name} — {t.points} pt</li>)}
        </ol>
      </div>
    </div>
  );
}
