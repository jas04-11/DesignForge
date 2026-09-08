const STYLES = {
  Easy: "bg-emerald-100 text-emerald-700",
  Medium: "bg-amber-100 text-amber-700",
  Hard: "bg-rose-100 text-rose-700",
};

export default function DifficultyBadge({ difficulty }) {
  return (
    <span className={`badge ${STYLES[difficulty] || "bg-slate-100 text-slate-700"}`}>
      {difficulty}
    </span>
  );
}
