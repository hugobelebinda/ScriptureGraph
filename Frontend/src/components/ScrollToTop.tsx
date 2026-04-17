import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** Resets window scroll on client-side navigation (default browser behavior is preserved). */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
