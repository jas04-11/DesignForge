const RELATIONSHIP_TYPES = ["Association", "Aggregation", "Composition", "Inheritance", "Dependency"];

export default function RelationshipEditor({ relationships, onChange }) {
  function update(idx, field, value) {
    onChange(relationships.map((r, ix) => (ix === idx ? { ...r, [field]: value } : r)));
  }

  function add() {
    onChange([...relationships, { source: "", type: "Association", target: "" }]);
  }

  function remove(idx) {
    onChange(relationships.filter((_, i) => i !== idx));
  }

  return (
    <div className="space-y-3">
      {relationships.map((r, idx) => (
        <div key={idx} className="flex flex-wrap items-center gap-2 border border-slate-200 rounded-lg p-3 bg-slate-50">
          <input
            className="input flex-1 min-w-[120px]"
            placeholder="Source class"
            value={r.source}
            onChange={(e) => update(idx, "source", e.target.value)}
          />
          <select
            className="input flex-1 min-w-[140px]"
            value={r.type}
            onChange={(e) => update(idx, "type", e.target.value)}
          >
            {RELATIONSHIP_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <input
            className="input flex-1 min-w-[120px]"
            placeholder="Target class"
            value={r.target}
            onChange={(e) => update(idx, "target", e.target.value)}
          />
          <button type="button" onClick={() => remove(idx)} className="text-xs text-rose-500 hover:underline">
            Remove
          </button>
        </div>
      ))}
      <button type="button" onClick={add} className="btn-secondary">
        + Add Relationship
      </button>
    </div>
  );
}
