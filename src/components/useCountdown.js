import { useEffect, useState } from "react";
import { store } from "../lib/storage";

/** A looping countdown whose end time survives page reloads. */
export default function useCountdown(storageKey, durationMs) {
  const [end] = useState(() => {
    const saved = store.get(storageKey, 0);
    if (saved > Date.now()) return saved;
    const next = Date.now() + durationMs;
    store.set(storageKey, next);
    return next;
  });
  const compute = () => {
    const diff = end - Date.now();
    const left = diff > 0 ? diff : durationMs - ((-diff) % durationMs);
    const s = Math.floor(left / 1000);
    return { days: Math.floor(s / 86400), hours: Math.floor((s % 86400) / 3600), minutes: Math.floor((s % 3600) / 60), seconds: s % 60 };
  };
  const [time, setTime] = useState(compute);
  useEffect(() => {
    const id = setInterval(() => setTime(compute()), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [end, durationMs]);
  return time;
}

export const pad = (n) => String(n).padStart(2, "0");
