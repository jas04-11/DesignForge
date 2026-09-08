import { Link } from "react-router-dom";
import { useAsync } from "../hooks/useAsync";
import { getProblems, getAttempts } from "../services/api";
import DifficultyBadge from "../components/DifficultyBadge";
import StatusBadge from "../components/StatusBadge";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";

export default function Dashboard() {
  const { data: problems, loading: loadingProblems, error: problemsError, refetch: refetchProblems } = useAsync(
    getProblems,
    []
  );
  const { data: attempts, loading: loadingAttempts, error: attemptsError, refetch: refetchAttempts } = useAsync(
    getAttempts,
    []
  );

  const recentAttempts = (attempts || []).slice(0, 5);
  const completed = (attempts || []).filter((a) => a.status === "COMPLETED" && typeof a.score === "number");
  const averageScore = completed.length
    ? Math.round(completed.reduce((sum, a) => sum + a.score, 0) / completed.length)
    : null;
  const latestScore = completed.length ? completed[0].score : null;

  return (
    <div className="space-y-10">
      <section className="card p-8 bg-gradient-to-br from-brand-600 to-brand-700 text-white border-none">
        <h1 className="text-3xl font-bold mb-2">DesignForge</h1>
        <p className="text-brand-100 max-w-2xl">
          Practice Low-Level Design (LLD) the way you'll face it in interviews: design classes,
          responsibilities and relationships, then get structured, explainable feedback combining
          deterministic checks with AI-assisted review.
        </p>
        <Link to="/problems" className="btn bg-white text-brand-700 hover:bg-brand-50 mt-6 inline-flex">
          Quick Start &rarr;
        </Link>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-6 text-center">
          <p className="text-sm text-slate-500">Problems Available</p>
          <p className="text-3xl font-bold text-slate-800 mt-1">{problems ? problems.length : "-"}</p>
        </div>
        <div className="card p-6 text-center">
          <p className="text-sm text-slate-500">Average Score</p>
          <p className="text-3xl font-bold text-slate-800 mt-1">
            {averageScore !== null ? averageScore : "-"}
          </p>
        </div>
        <div className="card p-6 text-center">
          <p className="text-sm text-slate-500">Latest Score</p>
          <p className="text-3xl font-bold text-slate-800 mt-1">
            {latestScore !== null ? latestScore : "-"}
          </p>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-slate-800">Available Problems</h2>
          <Link to="/problems" className="text-sm text-brand-600 font-medium hover:underline">
            View all
          </Link>
        </div>
        {loadingProblems && <LoadingState message="Loading problems..." />}
        {problemsError && <ErrorState message={problemsError.message} onRetry={refetchProblems} />}
        {!loadingProblems && !problemsError && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(problems || []).map((p) => (
              <Link key={p._id} to={`/problems/${p._id}`} className="card p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-slate-800">{p.title}</h3>
                  <DifficultyBadge difficulty={p.difficulty} />
                </div>
                <p className="text-sm text-slate-500 line-clamp-2">{p.description}</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-slate-800">Recent Attempts</h2>
          <Link to="/history" className="text-sm text-brand-600 font-medium hover:underline">
            Full history
          </Link>
        </div>
        {loadingAttempts && <LoadingState message="Loading attempts..." />}
        {attemptsError && <ErrorState message={attemptsError.message} onRetry={refetchAttempts} />}
        {!loadingAttempts && !attemptsError && recentAttempts.length === 0 && (
          <EmptyState
            title="No attempts yet"
            subtitle="Start your first practice session to see it here."
            action={
              <Link to="/problems" className="btn-primary">
                Browse Problems
              </Link>
            }
          />
        )}
        {!loadingAttempts && !attemptsError && recentAttempts.length > 0 && (
          <div className="card divide-y divide-slate-100">
            {recentAttempts.map((a) => (
              <div key={a._id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-800">{a.problemId?.title || "Unknown problem"}</p>
                  <p className="text-xs text-slate-400">Attempt #{a.attemptNumber}</p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={a.status} />
                  {typeof a.score === "number" && (
                    <span className="font-semibold text-slate-700">{a.score}/100</span>
                  )}
                  {a.status === "COMPLETED" ? (
                    <Link to={`/feedback/${a._id}`} className="text-sm text-brand-600 hover:underline">
                      View
                    </Link>
                  ) : (
                    <Link to={`/practice/${a.problemId?._id}`} className="text-sm text-brand-600 hover:underline">
                      Continue
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
