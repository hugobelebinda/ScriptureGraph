import { useEffect, useState } from "react";

/** Matches Tailwind `lg` breakpoint (1024px). */
export function useIsBelowLg(): boolean {
  const query = "(max-width: 1023px)";
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false,
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    mql.addEventListener("change", onChange);
    setMatches(mql.matches);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return matches;
}
