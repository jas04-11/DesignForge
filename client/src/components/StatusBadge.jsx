const STYLES = {
  DRAFT: "bg-slate-100 text-slate-600",
  SUBMITTED: "bg-blue-100 text-blue-700",
  EVALUATING: "bg-amber-100 text-amber-700",
  COMPLETED: "bg-emerald-100 text-emerald-700",
  FAILED: "bg-rose-100 text-rose-700",
};

export default function StatusBadge({ status }) {
  return <span className={`badge ${STYLES[status] || "bg-slate-100 text-slate-600"}`}>{status}</span>;
}
