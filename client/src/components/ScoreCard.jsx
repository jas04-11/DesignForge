function scoreColor(score) {
  if (score >= 80) return "text-emerald-600";
  if (score >= 60) return "text-amber-600";
  return "text-rose-600";
}

export default function ScoreCard({ score, label = "Overall Score" }) {
  return (
    <div className="card p-6 flex flex-col items-center justify-center text-center">
      <p className="text-sm font-medium text-slate-500 mb-2">{label}</p>
      <p className={`text-5xl font-bold ${scoreColor(score)}`}>{score}</p>
      <p className="text-sm text-slate-400 mt-1">out of 100</p>
    </div>
  );
}
