import { useLocation, useNavigate, useParams, Link } from "react-router-dom";
import { useState } from "react";
import { useAsync } from "../hooks/useAsync";
import { getProblem, createAttempt, submitAttempt } from "../services/api";
import DifficultyBadge from "../components/DifficultyBadge";
import ClassEditor from "../components/ClassEditor";
import InterfaceEditor from "../components/InterfaceEditor";
import RelationshipEditor from "../components/RelationshipEditor";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";

export default function Practice() {
  const { id: problemId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { data: problem, loading, error, refetch } = useAsync(() => getProblem(problemId), [problemId]);

  const [attemptId, setAttemptId] = useState(location.state?.attemptId || null);
  const [classes, setClasses] = useState([{ name: "", responsibility: "", fields: [], methods: [] }]);
  const [interfaces, setInterfaces] = useState([]);
  const [relationships, setRelationships] = useState([]);
  const [explanation, setExplanation] = useState("");
  const [code, setCode] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [submitError, setSubmitError] = useState(null);

  async function ensureAttempt() {
    if (attemptId) return attemptId;
    const attempt = await createAttempt(problemId);
    setAttemptId(attempt._id);
    return attempt._id;
  }

  function validate() {
    const errors = [];
    const nonEmptyClasses = classes.filter((c) => c.name.trim());
    if (nonEmptyClasses.length === 0) errors.push("Add at least one class with a name.");
    if (!explanation.trim()) errors.push("Design explanation is required.");
    return errors;
  }

  async function handleSubmit() {
    const errors = validate();
    setValidationErrors(errors);
    if (errors.length > 0) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      const id = await ensureAttempt();
      const cleanedClasses = classes.filter((c) => c.name.trim());
      const cleanedInterfaces = interfaces.filter((i) => i.name.trim());
      const cleanedRelationships = relationships.filter((r) => r.source.trim() && r.target.trim());

      await submitAttempt(id, {
        classes: cleanedClasses,
        interfaces: cleanedInterfaces,
        relationships: cleanedRelationships,
        explanation,
        code,
      });

      navigate(`/feedback/${id}`);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <LoadingState message="Loading practice workspace..." />;
  if (error) return <ErrorState message={error.message} onRetry={refetch} />;
  if (!problem) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <aside className="lg:col-span-1 space-y-4">
        <Link to={`/problems/${problemId}`} className="text-sm text-brand-600 hover:underline">
          &larr; Back to problem
        </Link>
        <div className="card p-5 sticky top-20">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold text-slate-800">{problem.title}</h2>
            <DifficultyBadge difficulty={problem.difficulty} />
          </div>
          <p className="text-sm text-slate-500 mb-3">{problem.description}</p>
          <h3 className="text-xs font-semibold text-slate-500 uppercase mb-1">Requirements</h3>
          <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
            {(problem.requirements || []).map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      </aside>

      <section className="lg:col-span-2 space-y-8">
        <div className="card p-6">
          <h2 className="font-semibold text-slate-800 mb-4">Classes</h2>
          <ClassEditor classes={classes} onChange={setClasses} />
        </div>

        <div className="card p-6">
          <h2 className="font-semibold text-slate-800 mb-4">Interfaces</h2>
          <InterfaceEditor interfaces={interfaces} onChange={setInterfaces} />
        </div>

        <div className="card p-6">
          <h2 className="font-semibold text-slate-800 mb-4">Relationships</h2>
          <RelationshipEditor relationships={relationships} onChange={setRelationships} />
        </div>

        <div className="card p-6">
          <h2 className="font-semibold text-slate-800 mb-2">Design Explanation</h2>
          <p className="text-xs text-slate-500 mb-3">
            Explain why you created these classes, how responsibilities were assigned, how the design
            can be extended, and any important trade-offs.
          </p>
          <textarea
            className="textarea"
            rows={8}
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            placeholder="Describe your design decisions here..."
          />
        </div>

        <div className="card p-6">
          <h2 className="font-semibold text-slate-800 mb-2">Optional Code</h2>
          <p className="text-xs text-slate-500 mb-3">Pseudocode or real code is fine. It will not be compiled.</p>
          <textarea
            className="textarea font-mono text-sm"
            rows={8}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="class ParkingLot { ... }"
          />
        </div>

        {validationErrors.length > 0 && (
          <div className="card p-4 border-rose-200 bg-rose-50">
            <ul className="list-disc list-inside text-sm text-rose-700">
              {validationErrors.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </div>
        )}
        {submitError && <p className="text-sm text-rose-600">{submitError}</p>}

        <button className="btn-primary w-full sm:w-auto" onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Evaluating your design..." : "Submit Design"}
        </button>
      </section>
    </div>
  );
}
