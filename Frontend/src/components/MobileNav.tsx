import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { HierarchicalSearch } from "./HierarchicalSearch";
import { LanguageToggle } from "./LanguageToggle";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `block rounded-lg px-3 py-2.5 text-sm font-medium transition ${
    isActive
      ? "bg-white/30 text-white"
      : "text-white hover:bg-white/20"
  }`;

export function MobileNav() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <header className="relative z-[80] grid h-14 shrink-0 grid-cols-[auto_1fr_auto] items-center border-b border-sage-primary/35 bg-sage-primary/15 px-4 backdrop-blur-md lg:hidden">
        <button
          type="button"
          onClick={() => (open ? setOpen(false) : setOpen(true))}
          className="min-w-[4.5rem] rounded-lg border border-sage-dark/30 bg-white/55 px-3 py-2 text-left text-sm font-medium text-sage-dark backdrop-blur-sm"
          aria-expanded={open}
          aria-controls="mobile-nav-drawer"
        >
          {open ? t("mobile.closeMenu") : t("mobile.openMenu")}
        </button>
        <h1 className="pointer-events-none text-center text-base font-bold tracking-tight text-sage-dark">
          {t("sidebar.title")}
        </h1>
        <span className="min-w-[4.5rem]" aria-hidden />
      </header>

      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-[60] bg-black/45 lg:hidden"
          aria-label={t("mobile.closeMenu")}
          onClick={() => setOpen(false)}
        />
      ) : null}

      <aside
        id="mobile-nav-drawer"
        className={`fixed inset-y-0 left-0 z-[70] flex w-[min(100vw-2.5rem,20rem)] flex-col gap-5 overflow-y-auto border-r border-sage-primary/35 bg-sage-primary/15 p-4 pt-[3.75rem] shadow-xl backdrop-blur-lg transition-transform duration-300 lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!open}
      >
        <nav className="flex flex-col gap-1" aria-label="Main">
          <NavLink to="/" end className={linkClass}>
            {t("nav.home")}
          </NavLink>
          <NavLink to="/chronological" className={linkClass}>
            {t("nav.chronological")}
          </NavLink>
          <NavLink to="/compass" className={linkClass}>
            {t("nav.compass")}
          </NavLink>
          <NavLink to="/atlas" className={linkClass}>
            {t("nav.atlas")}
          </NavLink>
          <NavLink to="/journeys" className={linkClass}>
            {t("nav.journeys")}
          </NavLink>
          <NavLink to="/cities" className={linkClass}>
            {t("nav.cities")}
          </NavLink>
          <NavLink to="/graph" className={linkClass}>
            {t("nav.graph")}
          </NavLink>
          <NavLink to="/interlinear" className={linkClass}>
            {t("nav.interlinear")}
          </NavLink>
        </nav>
        <LanguageToggle variant="drawer" />
        <HierarchicalSearch
          onSelectVerse={(uid) => {
            navigate(`/graph?verse=${encodeURIComponent(uid)}`);
            setOpen(false);
          }}
        />
      </aside>
    </>
  );
}
