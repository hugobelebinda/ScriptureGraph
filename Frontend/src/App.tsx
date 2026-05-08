import { Route, Routes, useLocation } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { Footer } from "./components/Footer";
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

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <div className="flex min-h-0 flex-1">
        <Sidebar />
        <main className={`min-w-0 flex-1 ${isFullBleed ? "" : "p-6"}`}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/graph" element={<GraphView />} />
            <Route path="/atlas" element={<AtlasView />} />
            <Route path="/compass" element={<CompassView />} />
            <Route path="/chronological" element={<ChronologicalView />} />
          </Routes>
        </main>
      </div>
      <Footer />
      <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 px-6 text-center lg:hidden">
        <div
          className="max-w-xl rounded-2xl px-5 py-4 shadow-2xl"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.62)" }}
        >
          <p className="text-sm leading-relaxed text-white sm:text-base">
            Pour une expérience optimale, veuillez consulter ViaScripture sur un ordinateur. Une version
            mobile sera bientôt disponible.
            <br />
            <br />
            For the best experience, please view ViaScripture on a desktop browser. Mobile-friendly
            version will be coming soon.
          </p>
        </div>
      </div>
      <Analytics />
    </div>
  );
}
