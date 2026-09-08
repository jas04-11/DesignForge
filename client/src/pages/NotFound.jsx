import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="text-center py-20">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">404</h1>
      <p className="text-slate-500 mb-6">That page doesn't exist.</p>
      <Link to="/" className="btn-primary">
        Back to Dashboard
      </Link>
    </div>
  );
}
