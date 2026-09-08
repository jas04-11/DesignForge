function barColor(ratio) {
  if (ratio >= 0.8) return "bg-emerald-500";
  if (ratio >= 0.6) return "bg-amber-500";
  return "bg-rose-500";
}

export default function ProgressBar({ value, max = 100, label }) {
  const ratio = max > 0 ? value / max : 0;
  return (
    <div>
      {label && (
        <div className="flex justify-between text-sm mb-1">
          <span className="font-medium text-slate-700">{label}</span>
          <span className="text-slate-500">
            {value}/{max}
          </span>
        </div>
      )}
      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${barColor(ratio)} transition-all duration-500`}
          style={{ width: `${Math.min(100, ratio * 100)}%` }}
        />
      </div>
    </div>
  );
}
