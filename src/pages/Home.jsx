import PronostiekForm from '../components/PronostiekForm';

export default function Home() {
  const now = new Date();
  const deadline = new Date(import.meta.env.VITE_GAME_DEADLINE);
  const canEdit = now < deadline;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">WK 2026 Pronostiek</h1>
      {canEdit ? (
        <PronostiekForm />
      ) : (
        <p className="text-red-600">De voorspellingen zijn gesloten voor deze wedstrijd.</p>
      )}
    </div>
  );
}
