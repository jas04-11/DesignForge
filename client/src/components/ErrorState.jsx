export default function ErrorState({ message = "Something went wrong.", onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center card p-8">
      <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-2xl mb-4">
        !
      </div>
      <p className="text-slate-700 font-medium mb-1">{message}</p>
      <p className="text-slate-400 text-sm mb-4">Please try again, or come back later.</p>
      {onRetry && (
        <button className="btn-secondary" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}
