import { Link } from "react-router-dom";
import { useAsync } from "../hooks/useAsync";
import { getAttempts } from "../services/api";
import StatusBadge from "../components/StatusBadge";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";

export default function History() {
  const { data: attempts, loading, error, refetch } = useAsync(getAttempts, []);

  if (loading) return <LoadingState message="Loading history..." />;
  if (error) return <ErrorState message={error.message} onRetry={refetch} />;

  const grouped = groupByProblem(attempts || []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-1">Attempt History</h1>
      <p className="text-slate-500 mb-6">Track your progress across every problem you've attempted.</p>

      {(attempts || []).length === 0 && (
        <EmptyState
          title="No attempts yet"
          subtitle="Start practicing to build your history."
          action={
            <Link to="/problems" className="btn-primary">
              Browse Problems
            </Link>
          }
        />
      )}

      <div className="space-y-8">
        {Object.entries(grouped).map(([problemTitle, problemAttempts]) => (
          <div key={problemTitle} className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-800">{problemTitle}</h2>
              {problemAttempts.filter((a) => typeof a.score === "number").length > 1 && (
                <ScoreProgression attempts={problemAttempts} />
              )}
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-400 border-b border-slate-100">
                  <th className="py-2 font-medium">Attempt</th>
                  <th className="py-2 font-medium">Score</th>
                  <th className="py-2 font-medium">Status</th>
                  <th className="py-2 font-medium">Date</th>
                  <th className="py-2 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {problemAttempts.map((a) => (
                  <tr key={a._id} className="border-b border-slate-50 last:border-0">
                    <td className="py-3">#{a.attemptNumber}</td>
                    <td className="py-3 font-medium">{typeof a.score === "number" ? `${a.score}/100` : "-"}</td>
                    <td className="py-3">
                      <StatusBadge status={a.status} />
                    </td>
                    <td className="py-3 text-slate-500">{new Date(a.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 text-right space-x-3">
                      {a.status === "COMPLETED" && (
                        <Link to={`/feedback/${a._id}`} className="text-brand-600 hover:underline">
                          View Feedback
                        </Link>
                      )}
                      <Link to={`/practice/${a.problemId?._id || a.problemId}`} className="text-brand-600 hover:underline">
                        Try Again
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}

function groupByProblem(attempts) {
  const groups = {};
  for (const a of attempts) {
    const title = a.problemId?.title || "Unknown problem";
    if (!groups[title]) groups[title] = [];
    groups[title].push(a);
  }
  Object.values(groups).forEach((list) => list.sort((a, b) => a.attemptNumber - b.attemptNumber));
  return groups;
}

function ScoreProgression({ attempts }) {
  const scores = attempts.filter((a) => typeof a.score === "number").map((a) => a.score);
  return (
    <p className="text-xs text-slate-400">
      Progression: {scores.join(" → ")}
    </p>
  );
}
