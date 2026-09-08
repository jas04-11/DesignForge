import { Link } from "react-router-dom";
import { useAsync } from "../hooks/useAsync";
import { getProblems } from "../services/api";
import DifficultyBadge from "../components/DifficultyBadge";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";

export default function Problems() {
  const { data: problems, loading, error, refetch } = useAsync(getProblems, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-1">LLD Problems</h1>
      <p className="text-slate-500 mb-6">Pick a problem and start practicing your low-level design skills.</p>

      {loading && <LoadingState message="Loading problems..." />}
      {error && <ErrorState message={error.message} onRetry={refetch} />}
      {!loading && !error && (problems || []).length === 0 && (
        <EmptyState title="No problems available" subtitle="Run the seed script on the server to populate problems." />
      )}
      {!loading && !error && (problems || []).length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {problems.map((p) => (
            <div key={p._id} className="card p-6 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-lg text-slate-800">{p.title}</h2>
                <DifficultyBadge difficulty={p.difficulty} />
              </div>
              <p className="text-sm text-slate-500 mb-4 flex-1 line-clamp-3">{p.description}</p>
              <Link to={`/problems/${p._id}`} className="btn-primary w-full">
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
