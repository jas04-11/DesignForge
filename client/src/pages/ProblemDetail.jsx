import { useNavigate, useParams, Link } from "react-router-dom";
import { useState } from "react";
import { useAsync } from "../hooks/useAsync";
import { getProblem, createAttempt } from "../services/api";
import DifficultyBadge from "../components/DifficultyBadge";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";

export default function ProblemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: problem, loading, error, refetch } = useAsync(() => getProblem(id), [id]);
  const [starting, setStarting] = useState(false);
  const [startError, setStartError] = useState(null);

  async function handleStart() {
    setStarting(true);
    setStartError(null);
    try {
      const attempt = await createAttempt(id);
      navigate(`/practice/${id}`, { state: { attemptId: attempt._id } });
    } catch (err) {
      setStartError(err.message);
    } finally {
      setStarting(false);
    }
  }

  if (loading) return <LoadingState message="Loading problem..." />;
  if (error) return <ErrorState message={error.message} onRetry={refetch} />;
  if (!problem) return null;

  return (
    <div className="max-w-3xl">
      <Link to="/problems" className="text-sm text-brand-600 hover:underline">
        &larr; Back to problems
      </Link>

      <div className="card p-8 mt-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-slate-800">{problem.title}</h1>
          <DifficultyBadge difficulty={problem.difficulty} />
        </div>

        <p className="text-slate-600 mb-6">{problem.description}</p>

        <Section title="Requirements" items={problem.requirements} />
        <Section title="Constraints" items={problem.constraints} />
        <Section title="Expected Design Concepts" items={problem.expectedConcepts} pillStyle />

        {startError && <p className="text-sm text-rose-600 mb-3">{startError}</p>}

        <button className="btn-primary mt-4" onClick={handleStart} disabled={starting}>
          {starting ? "Starting..." : "Start Practice"}
        </button>
      </div>
    </div>
  );
}

function Section({ title, items, pillStyle }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="mb-6">
      <h2 className="font-semibold text-slate-700 mb-2">{title}</h2>
      {pillStyle ? (
        <div className="flex flex-wrap gap-2">
          {items.map((item, idx) => (
            <span key={idx} className="badge bg-brand-50 text-brand-700">
              {item}
            </span>
          ))}
        </div>
      ) : (
        <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
          {items.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
