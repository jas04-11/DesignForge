export default function EmptyState({ title = "Nothing here yet", subtitle, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center card p-8">
      <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-2xl mb-4">
        ◇
      </div>
      <p className="text-slate-700 font-medium mb-1">{title}</p>
      {subtitle && <p className="text-slate-400 text-sm mb-4">{subtitle}</p>}
      {action}
    </div>
  );
}
