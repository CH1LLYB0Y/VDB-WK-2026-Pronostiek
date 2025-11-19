import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function PronostiekForm({ match, settings }) {
  const [user, setUser] = useState(null);
  const [s1, setS1] = useState('');
  const [s2, setS2] = useState('');
  const [existing, setExisting] = useState(null);

  // Load local user
  useEffect(() => {
    const stored = localStorage.getItem('wk_user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  // Load existing prediction
  useEffect(() => {
    if (!user) {
      setExisting(null);
      return;
    }

    async function loadPrediction() {
      const { data, error } = await supabase
        .from('pronostieken')
        .select('*')
        .eq('user_id', user.id)
        .eq('match_id', match.id)
        .maybeSingle();   // <- FIX: catches missing row zonder crash

      if (error) {
        console.warn("Error loading prediction:", error);
        return;
      }

      if (data) {
        setExisting(data);
        setS1(data.team1_score ?? '');
        setS2(data.team2_score ?? '');
      }
    }

    loadPrediction();
  }, [user, match]);

  // Find or create user
  async function ensureUser(name) {
    const clean = name.trim();
    if (!clean) throw new Error("Vul je naam in.");

    // Try to find
    const { data: found, error: findErr } = await supabase
      .from('users')
      .select('*')
      .eq('name', clean)
      .maybeSingle();

    if (found) return found;

    // Create new user
    const { data: created, error: insertErr } = await supabase
      .from('users')
      .insert([{ name: clean }])
      .select()
      .single();

    if (insertErr) throw insertErr;

    return created;
  }

  // Create or load user
  async function onCreate(e) {
    e.preventDefault();
    const name = e.target.elements.name?.value || '';

    try {
      const u = await ensureUser(name);
      localStorage.setItem('wk_user', JSON.stringify(u));
      setUser(u);
      alert("Welkom " + u.name);
    } catch (err) {
      alert("Fout: " + err.message);
    }
  }

  const now = new Date();
  const matchTime = new Date(match.match_datetime);
  const canEdit =
    (settings?.predictions_open ?? true) &&
    now < m
