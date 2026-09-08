function splitList(value) {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function InterfaceEditor({ interfaces, onChange }) {
  function update(idx, field, value) {
    onChange(interfaces.map((i, ix) => (ix === idx ? { ...i, [field]: value } : i)));
  }

  function add() {
    onChange([...interfaces, { name: "", methods: [] }]);
  }

  function remove(idx) {
    onChange(interfaces.filter((_, i) => i !== idx));
  }

  return (
    <div className="space-y-4">
      {interfaces.map((iface, idx) => (
        <div key={idx} className="border border-slate-200 rounded-lg p-4 relative bg-slate-50">
          <button
            type="button"
            onClick={() => remove(idx)}
            className="absolute top-3 right-3 text-xs text-rose-500 hover:underline"
          >
            Remove
          </button>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-500">Interface Name</label>
              <input
                className="input mt-1"
                placeholder="e.g. FeeStrategy"
                value={iface.name}
                onChange={(e) => update(idx, "name", e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500">Methods (comma-separated)</label>
              <input
                className="input mt-1"
                placeholder="e.g. calculateFee()"
                value={(iface.methods || []).join(", ")}
                onChange={(e) => update(idx, "methods", splitList(e.target.value))}
              />
            </div>
          </div>
        </div>
      ))}
      <button type="button" onClick={add} className="btn-secondary">
        + Add Interface
      </button>
    </div>
  );
}
