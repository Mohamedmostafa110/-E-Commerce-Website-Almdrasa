import { Link } from "react-router-dom";

/** items: [{ label, to? }] — the last item is the current page. */
export default function Breadcrumb({ items, className = "" }) {
  return (
    <nav aria-label="Breadcrumb" className={`text-sm ${className}`}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-2">
              {last || !item.to ? (
                <span className={last ? "text-black" : "text-black/50"} aria-current={last ? "page" : undefined}>
                  {item.label}
                </span>
              ) : (
                <Link to={item.to} className="text-black/50 hover:text-black">
                  {item.label}
                </Link>
              )}
              {!last && <span className="text-black/40" aria-hidden="true">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
