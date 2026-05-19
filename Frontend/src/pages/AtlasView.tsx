import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useIsBelowLg } from "../hooks/useMediaQuery";
import {
  ATLAS_DEFAULT_YEAR,
  ATLAS_MAX_YEAR,
  ATLAS_MIN_YEAR,
  AUTHORSHIP_STARS,
  type AuthorshipStar,
} from "../data/atlasData";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
const HISTORICAL_SOURCE_ID = "historical-boundaries";
const HISTORICAL_FILL_ID = "historical-fills";
const HISTORICAL_LINE_ID = "historical-borders";
const HISTORICAL_GLOW_ID = "historical-glow";
const HISTORICAL_MOSAIC_FILE = "/atlas/historical-basemaps/biblical_mosaic.geojson";
const MAP_FOCUS_CENTER: [number, number] = [31.5, 33.0];
const MAP_FOCUS_ZOOM = 3.9;
type GeoJsonFeature = GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>;
type MosaicFeatureProperties = {
  NAME?: string;
  name?: string;
  name_en?: string;
  name_fr?: string;
  start_year: number;
  end_year: number;
  [k: string]: unknown;
};

function localizeRegionName(name: string, lang: "en" | "fr"): string {
  if (lang === "en") return name;
  const translations: Record<string, string> = {
    "Neo-Assyrian Empire": "Empire néo-assyrien",
    "Achaemenid Empire": "Empire achéménide",
    "Roman Empire": "Empire romain",
    "Neo-Babylonian Empire": "Empire néo-babylonien",
    Egypt: "Égypte",
    Judea: "Judée",
    Syria: "Syrie",
    Phoenicia: "Phénicie",
    Philistia: "Philistie",
  };
  return translations[name] ?? name;
}

function formatYear(year: number, lang: "en" | "fr"): string {
  if (year < 0) {
    return lang === "fr" ? `${Math.abs(year)} av. J.-C.` : `${Math.abs(year)} BC`;
  }
  if (year > 0) {
    return lang === "fr" ? `${year} apr. J.-C.` : `${year} AD`;
  }
  return lang === "fr" ? "0 (transition)" : "0 (transition)";
}

function applyStarStyle(el: HTMLButtonElement, zoom: number): void {
  const size = Math.max(11, Math.min(14, 14 - (zoom - 3) * 0.45));
  const opacity = Math.max(0.58, Math.min(1, 1 - (zoom - 3) * 0.055));
  el.style.width = `${size}px`;
  el.style.height = `${size}px`;
  el.style.fontSize = `${Math.max(10, size - 1)}px`;
  el.style.opacity = `${opacity}`;
}

export function AtlasView() {
  const { t, i18n } = useTranslation();
  const isMobile = useIsBelowLg();
  const lang = i18n.language === "fr" ? "fr" : "en";
  const [year, setYear] = useState<number>(ATLAS_DEFAULT_YEAR);
  const [selectedStar, setSelectedStar] = useState<AuthorshipStar | null>(null);
  const [selectedPlaceKey, setSelectedPlaceKey] = useState<string | null>(null);
  const [visibleRegionNames, setVisibleRegionNames] = useState<string[]>([]);
  const [mapReady, setMapReady] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const markerElementsRef = useRef<HTMLButtonElement[]>([]);
  const starMarkerRefs = useRef<{ marker: mapboxgl.Marker; star: AuthorshipStar }[]>([]);
  const featuresCacheRef = useRef<Map<string, GeoJsonFeature[]>>(new Map());
  const historicalFeaturesRef = useRef<GeoJsonFeature[]>([]);
  const hoverPopupRef = useRef<mapboxgl.Popup | null>(null);
  const starsByPlace = useMemo(() => {
    const map = new Map<string, AuthorshipStar[]>();
    for (const star of AUTHORSHIP_STARS) {
      const arr = map.get(star.placeKey) ?? [];
      arr.push(star);
      map.set(star.placeKey, arr);
    }
    return map;
  }, []);
  const selectedPlaceStars = selectedPlaceKey ? starsByPlace.get(selectedPlaceKey) ?? [] : [];
  const selectedBookFromPlace =
    selectedStar && selectedPlaceKey && selectedStar.placeKey === selectedPlaceKey
      ? selectedStar
      : selectedPlaceStars[0] ?? null;
  useEffect(() => {
    if (!MAPBOX_TOKEN || !mapContainerRef.current || mapRef.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: MAP_FOCUS_CENTER,
      zoom: MAP_FOCUS_ZOOM,
      minZoom: 3.0,
      maxZoom: 8.8,
      maxBounds: [
        [-10, 10],
        [60, 55],
      ],
      attributionControl: true,
    });
    mapRef.current = map;
    map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), "top-right");
    map.on("load", () => {
      // Ensure Mapbox computes size/center correctly after React layout settles.
      map.resize();
      map.jumpTo({ center: MAP_FOCUS_CENTER, zoom: MAP_FOCUS_ZOOM });
      setMapReady(true);
    });

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      markerElementsRef.current = [];
      starMarkerRefs.current = [];
      map.remove();
      mapRef.current = null;
      setMapReady(false);
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;
    const atlasMap = map;

    const markers = markersRef.current;
    markers.forEach((m) => m.remove());
    markersRef.current = [];
    markerElementsRef.current = [];
    starMarkerRefs.current = [];

    async function loadMosaicFeatures(): Promise<GeoJsonFeature[]> {
      const cached = featuresCacheRef.current.get(HISTORICAL_MOSAIC_FILE);
      if (cached) return cached;
      const resp = await fetch(HISTORICAL_MOSAIC_FILE);
      if (!resp.ok) {
        featuresCacheRef.current.set(HISTORICAL_MOSAIC_FILE, []);
        return [];
      }
      const json = (await resp.json()) as GeoJSON.FeatureCollection<
        GeoJSON.Polygon | GeoJSON.MultiPolygon
      >;
      const features = (json.features ?? []).filter(
        (feature) => feature.geometry?.type === "Polygon" || feature.geometry?.type === "MultiPolygon",
      );
      featuresCacheRef.current.set(HISTORICAL_MOSAIC_FILE, features);
      return features;
    }

    function ensureHistoricalLayers(): void {
      if (!atlasMap.getSource(HISTORICAL_SOURCE_ID)) {
        atlasMap.addSource(HISTORICAL_SOURCE_ID, {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [],
          },
        });
      }
      if (!atlasMap.getLayer(HISTORICAL_FILL_ID)) {
        atlasMap.addLayer({
          id: HISTORICAL_FILL_ID,
          type: "fill",
          source: HISTORICAL_SOURCE_ID,
          paint: {
            "fill-color": "#A3B18A",
            "fill-opacity": [
              "case",
              ["boolean", ["feature-state", "hover"], false],
              0.42,
              0.2,
            ],
            "fill-opacity-transition": { duration: 250, delay: 0 },
          },
        });
      }
      if (!atlasMap.getLayer(HISTORICAL_GLOW_ID)) {
        atlasMap.addLayer({
          id: HISTORICAL_GLOW_ID,
          type: "line",
          source: HISTORICAL_SOURCE_ID,
          paint: {
            "line-color": "#74c365",
            "line-width": 3,
            "line-blur": 1.5,
            "line-opacity": [
              "case",
              ["boolean", ["feature-state", "hover"], false],
              0.8,
              0,
            ],
            "line-opacity-transition": { duration: 350, delay: 0 },
          },
        });
      }
      if (!atlasMap.getLayer(HISTORICAL_LINE_ID)) {
        atlasMap.addLayer({
          id: HISTORICAL_LINE_ID,
          type: "line",
          source: HISTORICAL_SOURCE_ID,
          paint: {
            "line-color": "#4a5d4d",
            "line-width": 1.5,
            "line-opacity": 0.92,
            "line-opacity-transition": { duration: 350, delay: 0 },
          },
        });
      }
    }

    function applyYearFilter() {
      const filterExpr: mapboxgl.Expression = [
        "all",
        ["<=", ["get", "start_year"], year],
        [">=", ["get", "end_year"], year],
      ];
      atlasMap.setFilter(HISTORICAL_FILL_ID, filterExpr);
      atlasMap.setFilter(HISTORICAL_LINE_ID, filterExpr);
      atlasMap.setFilter(HISTORICAL_GLOW_ID, filterExpr);
    }

    ensureHistoricalLayers();
    let cancelled = false;
    loadMosaicFeatures().then((features) => {
      if (cancelled) return;
      historicalFeaturesRef.current = features;
      const source = atlasMap.getSource(HISTORICAL_SOURCE_ID) as mapboxgl.GeoJSONSource | undefined;
      source?.setData({
        type: "FeatureCollection",
        features,
      });
      applyYearFilter();
      const visibleNames = Array.from(
        new Set(
          features
            .filter((feature) => {
              const props = (feature.properties ?? {}) as MosaicFeatureProperties;
              const start = Number(props.start_year);
              const end = Number(props.end_year);
              return start <= year && end >= year;
            })
            .map((feature) => {
              const props = (feature.properties ?? {}) as MosaicFeatureProperties;
              const fr = String(props.name_fr ?? "").trim();
              const en = String(props.name_en ?? props.NAME ?? props.name ?? "").trim();
              if (lang === "fr") return fr || localizeRegionName(en, "fr");
              return en || fr;
            })
            .filter(Boolean),
        ),
      ).sort((a, b) => a.localeCompare(b));
      setVisibleRegionNames(visibleNames);
    });
    applyYearFilter();

    let hoveredFeatureId: string | number | null = null;
    const onEnter = () => {
      atlasMap.getCanvas().style.cursor = "pointer";
    };
    const onLeave = () => {
      atlasMap.getCanvas().style.cursor = "";
      if (hoveredFeatureId !== null) {
        atlasMap.setFeatureState(
          { source: HISTORICAL_SOURCE_ID, id: hoveredFeatureId },
          { hover: false },
        );
      }
      hoveredFeatureId = null;
      hoverPopupRef.current?.remove();
      hoverPopupRef.current = null;
    };
    const onMouseMove = (e: mapboxgl.MapLayerMouseEvent) => {
      const picked = e.features?.[0];
      if (!picked) return;
      const next = picked.id ?? null;
      if (next !== hoveredFeatureId) {
        if (hoveredFeatureId !== null) {
          atlasMap.setFeatureState(
            { source: HISTORICAL_SOURCE_ID, id: hoveredFeatureId },
            { hover: false },
          );
        }
        hoveredFeatureId = next;
        if (hoveredFeatureId !== null) {
          atlasMap.setFeatureState(
            { source: HISTORICAL_SOURCE_ID, id: hoveredFeatureId },
            { hover: true },
          );
        }
      }
      const props = (picked.properties ?? {}) as MosaicFeatureProperties;
      const fr = String(props.name_fr ?? "").trim();
      const en = String(props.name_en ?? props.NAME ?? props.name ?? "").trim();
      const display = lang === "fr" ? fr || localizeRegionName(en, "fr") : en;
      if (!display) return;
      if (!hoverPopupRef.current) {
        hoverPopupRef.current = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false,
          offset: 10,
          className: "atlas-hover-popup",
        }).addTo(atlasMap);
      }
      hoverPopupRef.current
        .setLngLat(e.lngLat)
        .setHTML(`<div style="font-size:11px;font-weight:600;color:#344E41">${display}</div>`);
    };
    atlasMap.on("mouseenter", HISTORICAL_FILL_ID, onEnter);
    atlasMap.on("mousemove", HISTORICAL_FILL_ID, onMouseMove);
    atlasMap.on("mouseleave", HISTORICAL_FILL_ID, onLeave);
    atlasMap.on("mouseenter", HISTORICAL_LINE_ID, onEnter);
    atlasMap.on("mousemove", HISTORICAL_LINE_ID, onMouseMove);
    atlasMap.on("mouseleave", HISTORICAL_LINE_ID, onLeave);

    const placeRepresentatives = new Map<string, AuthorshipStar>();
    AUTHORSHIP_STARS.forEach((star) => {
      if (!placeRepresentatives.has(star.placeKey)) {
        placeRepresentatives.set(star.placeKey, star);
      }
    });

    placeRepresentatives.forEach((star, placeKey) => {
      const booksAtPlace = starsByPlace.get(placeKey)?.length ?? 1;

      const el = document.createElement("button");
      el.type = "button";
      el.className =
        "flex items-center justify-center border border-amber-100/80 bg-[#f4a259]/90 text-white shadow-[0_0_0_1px_rgba(72,45,20,0.22)]";
      el.style.borderRadius = "4px";
      el.style.lineHeight = "1";
      el.style.pointerEvents = "auto";
      el.style.zIndex = "5";
      el.textContent = "★";
      el.title =
        booksAtPlace > 1
          ? `${t(star.placeKey)} • ${booksAtPlace} ${t("atlas.booksLabel", { defaultValue: "books" })}`
          : `${t(`books.${star.usfm}`, { defaultValue: star.usfm })} • ${formatYear(star.startYear, lang)}`;
      el.addEventListener("click", () => {
        hoverPopupRef.current?.remove();
        hoverPopupRef.current = null;
        setSelectedPlaceKey(placeKey);
        setSelectedStar(starsByPlace.get(placeKey)?.[0] ?? star);
      });

      const marker = new mapboxgl.Marker({ element: el, anchor: "center" })
        .setLngLat([star.lng, star.lat])
        .addTo(atlasMap);
      markersRef.current.push(marker);
      markerElementsRef.current.push(el);
      starMarkerRefs.current.push({ marker, star });
    });
    const refreshStars = () => {
      const zoom = atlasMap.getZoom();
      applyStarStyleBatch(markerElementsRef.current, zoom);
      starMarkerRefs.current.forEach((entry) => {
        entry.marker.setLngLat([entry.star.lng, entry.star.lat]);
      });
    };
    function applyStarStyleBatch(elements: HTMLButtonElement[], zoom: number): void {
      elements.forEach((el) => applyStarStyle(el, zoom));
    }
    refreshStars();
    atlasMap.on("zoom", refreshStars);

    return () => {
      cancelled = true;
      hoverPopupRef.current?.remove();
      hoverPopupRef.current = null;
      atlasMap.off("mouseenter", HISTORICAL_FILL_ID, onEnter);
      atlasMap.off("mousemove", HISTORICAL_FILL_ID, onMouseMove);
      atlasMap.off("mouseleave", HISTORICAL_FILL_ID, onLeave);
      atlasMap.off("mouseenter", HISTORICAL_LINE_ID, onEnter);
      atlasMap.off("mousemove", HISTORICAL_LINE_ID, onMouseMove);
      atlasMap.off("mouseleave", HISTORICAL_LINE_ID, onLeave);
      atlasMap.off("zoom", refreshStars);
    };
  }, [lang, mapReady, starsByPlace, t, year]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.resize();
    // Avoid snapping the camera whenever a star is selected.
    // Only gently recenter/ensure a minimum zoom when the side panel is closed.
    if (!selectedPlaceKey && !selectedStar && map.getZoom() < 3.2) {
      map.easeTo({ center: MAP_FOCUS_CENTER, zoom: 3.2, duration: 600 });
    }
  }, [selectedPlaceKey, selectedStar]);

  useEffect(() => {
    const hideStars = isMobile && Boolean(selectedPlaceKey);
    const map = mapRef.current;
    const zoom = map?.getZoom() ?? MAP_FOCUS_ZOOM;
    markerElementsRef.current.forEach((el) => {
      el.style.visibility = hideStars ? "hidden" : "visible";
      el.style.pointerEvents = hideStars ? "none" : "auto";
      if (!hideStars) applyStarStyle(el, zoom);
    });
  }, [isMobile, selectedPlaceKey]);

  if (!MAPBOX_TOKEN) {
    return (
      <div className="space-y-3 rounded-2xl border border-sage-primary/45 bg-white/80 p-5">
        <h2 className="text-2xl font-semibold text-sage-dark">{t("nav.atlas")}</h2>
        <p className="text-sm text-sage-dark/85">{t("atlas.missingToken")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold text-sage-dark">{t("nav.atlas")}</h2>
        <p className="max-w-3xl text-sm leading-relaxed text-sage-dark/80">
          {t("atlas.intro")}
        </p>
      </header>

      <section className="rounded-2xl border border-sage-primary/35 bg-white/85 p-4 shadow-sm">
        <div className="mb-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div>
            <label htmlFor="atlas-year" className="text-sm font-semibold text-sage-dark">
              {t("atlas.timelineLabel")}{" "}
              <span className="text-sage-forest">{formatYear(year, lang)}</span>
            </label>
            <input
              id="atlas-year"
              type="range"
              min={ATLAS_MIN_YEAR}
              max={ATLAS_MAX_YEAR}
              value={year}
              step={50}
              onChange={(e) => setYear(Number(e.target.value))}
              className="mt-2 w-full accent-sage-forest"
              aria-label={t("atlas.timelineAria")}
            />
            <div className="mt-1 flex justify-between text-xs text-sage-dark/65">
              <span>{formatYear(ATLAS_MIN_YEAR, lang)}</span>
              <span>{formatYear(ATLAS_MAX_YEAR, lang)}</span>
            </div>
          </div>

          <div className="rounded-xl border border-sage-primary/30 bg-sage-bg/60 px-3 py-2 lg:max-h-40">
            <p className="text-xs font-semibold uppercase tracking-wide text-sage-dark/75">
              {t("atlas.activeLayers")}
            </p>
            <ul className="mt-2 max-h-28 space-y-1 overflow-y-auto pr-1 text-xs text-sage-dark/85">
              {visibleRegionNames.length ? (
                visibleRegionNames.map((name) => <li key={name}>• {name}</li>)
              ) : (
                <li>{t("atlas.noLayer")}</li>
              )}
            </ul>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="relative isolate overflow-hidden rounded-xl">
            <div ref={mapContainerRef} className="relative z-0 h-[58vh] min-h-[24rem] rounded-xl" />
            <div
              className="pointer-events-none absolute inset-0 z-10 rounded-xl bg-gradient-to-b from-[#f4e4c8]/26 via-transparent to-[#f3e2c2]/18"
              aria-hidden
            />
            {isMobile && selectedPlaceKey ? (
              <button
                type="button"
                className="absolute inset-0 z-20 rounded-xl bg-black/25 lg:hidden"
                aria-label={t("atlas.closePanel")}
                onClick={() => {
                  setSelectedPlaceKey(null);
                  setSelectedStar(null);
                }}
              />
            ) : null}
            <aside
              className={`absolute z-30 border-amber-200/70 bg-[#f7efe1]/95 p-4 shadow-xl transition-transform duration-300
                right-0 top-0 h-full w-[22rem] max-w-[92%] border-l
                max-lg:inset-x-0 max-lg:bottom-0 max-lg:top-auto max-lg:h-auto max-lg:max-h-[75vh] max-lg:w-full max-lg:max-w-none max-lg:overflow-y-auto max-lg:rounded-t-2xl max-lg:border-l-0 max-lg:border-t
                ${
                  selectedPlaceKey
                    ? "translate-x-0 max-lg:translate-y-0"
                    : "translate-x-full max-lg:translate-x-0 max-lg:translate-y-full"
                }`}
            >
              {selectedPlaceKey ? (
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-sage-dark">
                      {t(selectedPlaceKey)}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPlaceKey(null);
                        setSelectedStar(null);
                      }}
                      className="rounded-md border border-sage-primary/40 px-2 py-1 text-[11px] text-sage-dark/80 hover:bg-white/70"
                    >
                      {t("atlas.closePanel")}
                    </button>
                  </div>
                  <p className="text-xs text-sage-dark/75">
                    {t("atlas.booksAtPlace", { defaultValue: "Books written here" })}
                  </p>
                  <div className="max-h-32 overflow-y-auto rounded-md border border-sage-primary/25 bg-white/70 p-1">
                    {selectedPlaceStars.map((book) => (
                      <button
                        key={book.usfm}
                        type="button"
                        onClick={() => setSelectedStar(book)}
                        className={`block w-full rounded px-2 py-1 text-left text-xs ${
                          selectedBookFromPlace?.usfm === book.usfm
                            ? "bg-sage-forest text-white"
                            : "text-sage-dark hover:bg-sage-primary/25"
                        }`}
                      >
                        {t(`books.${book.usfm}`, { defaultValue: book.usfm })}
                      </button>
                    ))}
                  </div>
                  {selectedBookFromPlace ? (
                    <>
                      <p className="text-xs text-sage-dark/75">
                        {t("atlas.authorLabel")}:{" "}
                        {lang === "fr" ? selectedBookFromPlace.authorFr : selectedBookFromPlace.authorEn}
                      </p>
                      <p className="text-xs text-sage-dark/75">
                        {t("atlas.dateRange")}: {formatYear(selectedBookFromPlace.startYear, lang)} -{" "}
                        {formatYear(selectedBookFromPlace.endYear, lang)}
                      </p>
                      <p className="text-xs text-sage-dark/75">
                        {t("atlas.placeLabel")}: {t(selectedBookFromPlace.placeKey)}
                      </p>
                      <p className="text-xs leading-relaxed text-sage-dark/80">
                        {lang === "fr" ? selectedBookFromPlace.contextFr : selectedBookFromPlace.contextEn}
                      </p>
                    </>
                  ) : null}
                </div>
              ) : null}
            </aside>
          </div>
        </div>
        <p className="mt-3 text-[11px] text-sage-dark/65">{t("atlas.dataAttribution")}</p>
        <p className="mt-1 text-[11px] text-sage-dark/60">{t("atlas.feedbackNote")}</p>
      </section>
    </div>
  );
}
