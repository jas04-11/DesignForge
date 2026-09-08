function splitList(value) {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function ClassEditor({ classes, onChange }) {
  function updateClass(idx, field, value) {
    const next = classes.map((c, i) => (i === idx ? { ...c, [field]: value } : c));
    onChange(next);
  }

  function addClass() {
    onChange([...classes, { name: "", responsibility: "", fields: [], methods: [] }]);
  }

  function removeClass(idx) {
    onChange(classes.filter((_, i) => i !== idx));
  }

  return (
    <div className="space-y-4">
      {classes.map((c, idx) => (
        <div key={idx} className="border border-slate-200 rounded-lg p-4 relative bg-slate-50">
          <button
            type="button"
            onClick={() => removeClass(idx)}
            className="absolute top-3 right-3 text-xs text-rose-500 hover:underline"
          >
            Remove
          </button>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-500">Class Name</label>
              <input
                className="input mt-1"
                placeholder="e.g. ParkingLot"
                value={c.name}
                onChange={(e) => updateClass(idx, "name", e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500">Responsibility</label>
              <input
                className="input mt-1"
                placeholder="e.g. Manages parking floors and operations"
                value={c.responsibility}
                onChange={(e) => updateClass(idx, "responsibility", e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500">Fields (comma-separated)</label>
              <input
                className="input mt-1"
                placeholder="e.g. floors, spots"
                value={(c.fields || []).join(", ")}
                onChange={(e) => updateClass(idx, "fields", splitList(e.target.value))}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500">Methods (comma-separated)</label>
              <input
                className="input mt-1"
                placeholder="e.g. parkVehicle(), exitVehicle()"
                value={(c.methods || []).join(", ")}
                onChange={(e) => updateClass(idx, "methods", splitList(e.target.value))}
              />
            </div>
          </div>
        </div>
      ))}
      <button type="button" onClick={addClass} className="btn-secondary">
        + Add Class
      </button>
    </div>
  );
}
