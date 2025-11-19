import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function PronostiekForm() {
  const [scoreHome, setScoreHome] = useState('');
  const [scoreAway, setScoreAway] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from('pronostieken')
      .insert([{ score_home: scoreHome, score_away: scoreAway }]);
    if (error) alert('Fout bij opslaan: ' + error.message);
    else alert('Voorspelling opgeslagen!');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 max-w-sm">
      <input
        type="number"
        placeholder="Score thuisteam"
        value={scoreHome}
        onChange={(e) => setScoreHome(e.target.value)}
        className="border p-2"
      />
      <input
        type="number"
        placeholder="Score uitteam"
        value={scoreAway}
        onChange={(e) => setScoreAway(e.target.value)}
        className="border p-2"
      />
      <button type="submit" className="bg-blue-600 text-white p-2 mt-2">Opslaan</button>
    </form>
  );
}
