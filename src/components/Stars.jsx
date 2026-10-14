import { Star } from "lucide-react";

export default function Stars({ rating = 0, size = 16, label }) {
  const pct = Math.max(0, Math.min(100, (rating / 5) * 100));
  const row = (cls) => (
    <span className={`flex ${cls}`} aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} size={size} strokeWidth={0} fill="currentColor" className="shrink-0" />
      ))}
    </span>
  );
  return (
    <span className="relative inline-flex" role="img" aria-label={label}>
      {row("text-black/25")}
      <span className="absolute inset-y-0 start-0 overflow-hidden" style={{ width: `${pct}%` }}>
        {row("text-star")}
      </span>
    </span>
  );
}
