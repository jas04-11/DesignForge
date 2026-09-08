import { Link, useNavigate, useParams } from "react-router-dom";
import { useAsync } from "../hooks/useAsync";
import { getAttempt, getEvaluation } from "../services/api";
import ScoreCard from "../components/ScoreCard";
import ProgressBar from "../components/ProgressBar";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";

export default function Feedback() {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  const { data: attempt, loading: loadingAttempt, error: attemptError, refetch: refetchAttempt } = useAsync(
    () => getAttempt(attemptId),
    [attemptId]
  );
  const { data: evaluation, loading: loadingEval, error: evalError, refetch: refetchEval } = useAsync(
    () => getEvaluation(attemptId),
    [attemptId]
  );

  if (loadingAttempt || loadingEval) return <LoadingState message="Loading feedback..." />;
  if (attemptError) return <ErrorState message={attemptError.message} onRetry={refetchAttempt} />;

  if (attempt && attempt.status === "EVALUATING") {
    return <LoadingState message="Your design is being evaluated. This can take a few seconds..." />;
  }

  if (evalError) return <ErrorState message={evalError.message} onRetry={refetchEval} />;
  if (!evaluation) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Feedback: {attempt?.problemId?.title || "Your Design"}
        </h1>
        <p className="text-slate-500">Attempt #{attempt?.attemptNumber}</p>
      </div>

      {!evaluation.aiAvailable && (
        <div className="card p-4 bg-amber-50 border-amber-200 text-amber-800 text-sm">
          AI evaluation temporarily unavailable. Showing deterministic (rule-based) evaluation results.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <ScoreCard score={evaluation.overallScore} />
        <div className="sm:col-span-2 card p-6 space-y-4">
          {evaluation.categories.map((cat) => (
            <ProgressBar key={cat.name} label={cat.name} value={cat.score} max={cat.maxScore} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <FeedbackList title="Strengths" items={evaluation.strengths} tone="emerald" />
        <FeedbackList title="Weaknesses" items={evaluation.weaknesses} tone="rose" />
        <FeedbackList title="Suggestions" items={evaluation.suggestions} tone="amber" />
      </div>

      <div className="card p-6">
        <h2 className="font-semibold text-slate-800 mb-3">Category Details</h2>
        <div className="space-y-3">
          {evaluation.categories.map((cat) => (
            <div key={cat.name} className="text-sm">
              <p className="font-medium text-slate-700">
                {cat.name} — {cat.score}/{cat.maxScore}
              </p>
              <p className="text-slate-500">{cat.feedback}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          className="btn-primary"
          onClick={() => navigate(`/practice/${attempt.problemId?._id || attempt.problemId}`)}
        >
          Try Again
        </button>
        <Link to="/problems" className="btn-secondary">
          Back to Problems
        </Link>
        <Link to="/history" className="btn-secondary">
          View History
        </Link>
      </div>
    </div>
  );
}

const TONE_STYLES = {
  emerald: "text-emerald-700 bg-emerald-50 border-emerald-200",
  rose: "text-rose-700 bg-rose-50 border-rose-200",
  amber: "text-amber-700 bg-amber-50 border-amber-200",
};

function FeedbackList({ title, items, tone }) {
  return (
    <div className={`card p-5 border ${TONE_STYLES[tone]}`}>
      <h3 className="font-semibold mb-2">{title}</h3>
      {items && items.length > 0 ? (
        <ul className="list-disc list-inside text-sm space-y-1">
          {items.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="text-sm opacity-70">None noted.</p>
      )}
    </div>
  );
}
