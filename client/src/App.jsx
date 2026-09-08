import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Problems from "./pages/Problems";
import ProblemDetail from "./pages/ProblemDetail";
import Practice from "./pages/Practice";
import Feedback from "./pages/Feedback";
import History from "./pages/History";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/problems" element={<Problems />} />
          <Route path="/problems/:id" element={<ProblemDetail />} />
          <Route path="/practice/:id" element={<Practice />} />
          <Route path="/feedback/:attemptId" element={<Feedback />} />
          <Route path="/history" element={<History />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="text-center text-xs text-slate-400 py-6">
        DesignForge &middot; Practice Low-Level Design, get structured feedback.
      </footer>
    </div>
  );
}
