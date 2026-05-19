import { Route, Routes, useLocation } from "react-router-dom";
import { Footer } from "./components/Footer";
import { MobileNav } from "./components/MobileNav";
import { ScrollToTop } from "./components/ScrollToTop";
import { Sidebar } from "./components/Sidebar";
import { AtlasView } from "./pages/AtlasView";
import { ChronologicalView } from "./pages/ChronologicalView";
import { CompassView } from "./pages/CompassView";
import { GraphView } from "./pages/GraphView";
import { Home } from "./pages/Home";

export default function App() {
  const { pathname } = useLocation();
  const isFullBleed = pathname === "/" || pathname === "/graph";
  const isGraph = pathname === "/graph";

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <MobileNav />
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <Sidebar />
        <main
          className={`min-w-0 flex-1 ${isFullBleed ? "flex min-h-0 flex-col" : "p-4 lg:p-6"} ${isGraph ? "lg:min-h-0" : ""}`}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/graph" element={<GraphView />} />
            <Route path="/atlas" element={<AtlasView />} />
            <Route path="/compass" element={<CompassView />} />
            <Route path="/chronological" element={<ChronologicalView />} />
          </Routes>
        </main>
      </div>
      {!isGraph ? <Footer /> : null}
    </div>
  );
}
