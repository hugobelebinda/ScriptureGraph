import { useTranslation } from "react-i18next";
import { NavLink, useNavigate } from "react-router-dom";
import { HierarchicalSearch } from "./HierarchicalSearch";
import { LanguageToggle } from "./LanguageToggle";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `block rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive ? "bg-sage-forest text-white" : "text-sage-dark hover:bg-sage-primary/40"
  }`;

export function Sidebar() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <aside className="hidden w-64 shrink-0 flex-col gap-6 border-r border-sage-primary/40 bg-sage-primary/25 p-4 lg:flex">
      <div>
        <h1 className="text-lg font-bold text-sage-dark">{t("sidebar.title")}</h1>
      </div>
      <LanguageToggle />
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
        <NavLink to="/graph" className={linkClass}>
          {t("nav.graph")}
        </NavLink>
      </nav>
      <HierarchicalSearch
        onSelectVerse={(uid) => {
          navigate(`/graph?verse=${encodeURIComponent(uid)}`);
        }}
      />
    </aside>
  );
}
