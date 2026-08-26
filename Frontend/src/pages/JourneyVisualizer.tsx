import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  JOURNEYS,
  JOURNEY_ERAS,
  type Journey,
  type JourneyEra,
  type JourneyWaypoint,
} from "../data/journeysData";
import { useIsBelowLg } from "../hooks/useMediaQuery";
import {
  buildJourneyArcs,
  groupWaypoints,
  type WaypointGroup,
} from "../lib/journeyGeometry";
import { applyMapPopupLayout, mapPopupLayout } from "../lib/mapPopup";
import { applyStarStyle, createStarMarkerElement } from "../lib/starMarker";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const PATH_SOURCE_ID = "journey-path";
const PATH_GLOW_ID = "journey-path-glow";
const PATH_LINE_ID = "journey-path-line";
const PATH_ARROWS_ID = "journey-path-arrows";
const ARROW_ICON_ID = "journey-arrow";

const PATH_COLOR = "#F59E0B";
const GLOBE_CENTER: [number, number] = [34, 32];
const GLOBE_ZOOM = 1.5;
const STAR_SIZE = { minSize: 16, maxSize: 24, minOpacity: 1 };

/**
 * Base map layers that paint modern land use, terrain or transport data.
 * Hiding them leaves landmasses, water and administrative borders only.
 */
const HIDDEN_LAYER_PATTERNS = [
  "landuse",
  "landcover",
  "national-park",
  "hillshade",
  "building",
  "road",
  "bridge",
  "tunnel",
  "aeroway",
  "ferry",
  "golf",
  "pitch",
  "sand",
  "poi-label",
  "transit-label",
  "airport",
];

type Lang = "en" | "fr";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function waypointName(waypoint: JourneyWaypoint, lang: Lang): string {
  return lang === "fr" ? waypoint.nameFr : waypoint.nameEn;
}

function journeyTitle(journey: Journey, lang: Lang): string {
  return lang === "fr" ? journey.titleFr : journey.titleEn;
}

/**
 * A white-haloed amber chevron. The halo keeps it legible where it sits directly
 * on top of the golden path.
 */
function createArrowImage(): ImageData | null {
  const size = 22;
  const pixelRatio = 2;
  const canvas = document.createElement("canvas");
  canvas.width = size * pixelRatio;
  canvas.height = size * pixelRatio;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.scale(pixelRatio, pixelRatio);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  const stroke = (width: number, color: string) => {
    ctx.beginPath();
    ctx.moveTo(7, 5.5);
    ctx.lineTo(15.5, 11);
    ctx.lineTo(7, 16.5);
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.stroke();
  };
  stroke(5, "#FFFBEB");
  stroke(2.4, "#B45309");
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function hideDecorativeLayers(map: mapboxgl.Map): void {
  const layers = map.getStyle()?.layers ?? [];
  layers.forEach((layer) => {
    if (!HIDDEN_LAYER_PATTERNS.some((pattern) => layer.id.includes(pattern))) return;
    try {
      map.setLayoutProperty(layer.id, "visibility", "none");
    } catch {
      // A style layer can disappear between reads; nothing to do.
    }
  });
}

/**
 * Renders where a stop's coordinates come from: the modern site, how strongly current
 * scholarship backs that identification, and how many rival sites have been proposed.
 */
function buildSourceHtml(
  waypoint: JourneyWaypoint,
  t: (key: string, options?: Record<string, unknown>) => string,
): string {
  const { source } = waypoint;
  if (!source) {
    return `<p class="text-[10px] italic text-sage-dark/55">${escapeHtml(t("journeys.sourceUnknown"))}</p>`;
  }

  const verdictKey =
    source.confidence >= 800
      ? "journeys.sourceAttested"
      : source.confidence >= 500
        ? "journeys.sourceProbable"
        : "journeys.sourceDisputed";
  const parts = [source.site, t(verdictKey)];
  if (source.candidates > 1) {
    parts.push(t("journeys.sourceCandidates", { count: source.candidates }));
  }

  return `<p class="text-[10px] italic leading-snug text-sage-dark/55">${escapeHtml(parts.join(" \u00b7 "))}</p>`;
}

function buildPopupHtml(
  group: WaypointGroup,
  totalStops: number,
  lang: Lang,
  t: (key: string, options?: Record<string, unknown>) => string,
  compact: boolean,
): string {
  const widthClass = compact ? "min-w-0 max-w-[13rem]" : "min-w-[10rem] max-w-[17rem]";
  const blocks = group.visits.map((visit) => {
    const stopLabel = t("journeys.stopOf", {
      current: visit.index + 1,
      total: totalStops,
    });
    const tags = visit.waypoint.refs
      .map((ref) => {
        const book = t(`books.${ref.usfm}`, { defaultValue: ref.usfm });
        return `<span class="rounded-md border border-amber-300/70 bg-amber-100/60 px-1.5 py-0.5 text-[10px] font-medium italic text-sage-dark/80">${escapeHtml(`${book} ${ref.ref}`)}</span>`;
      })
      .join("");
    const sourceNote = compact ? "" : buildSourceHtml(visit.waypoint, t);
    const description = compact
      ? ""
      : `<p class="text-xs leading-relaxed text-sage-dark/80">${escapeHtml(lang === "fr" ? visit.waypoint.descriptionFr : visit.waypoint.descriptionEn)}</p>`;
    return `
      <div class="space-y-1.5">
        <div class="flex items-baseline justify-between gap-2">
          <p class="${compact ? "text-xs" : "text-sm"} font-semibold text-sage-dark">${escapeHtml(waypointName(visit.waypoint, lang))}</p>
          <span class="shrink-0 text-[10px] font-medium uppercase tracking-wide text-sage-dark/55">${escapeHtml(stopLabel)}</span>
        </div>
        ${description}
        <div class="flex flex-wrap gap-1">${tags}</div>
        ${sourceNote}
      </div>`;
  });

  return `<div class="${widthClass} divide-y divide-amber-300/50 [&>div]:py-2 [&>div:first-child]:pt-0 [&>div:last-child]:pb-0">${blocks.join("")}</div>`;
}

export function JourneyVisualizer() {
  const { t, i18n } = useTranslation();
  const isMobile = useIsBelowLg();
  const lang: Lang = i18n.language === "fr" ? "fr" : "en";

  const [selectedJourneyId, setSelectedJourneyId] = useState(JOURNEYS[0].id);
  const [selectedGroupKey, setSelectedGroupKey] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const markerElementsByKeyRef = useRef<Map<string, HTMLButtonElement>>(new Map());
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  // Read inside the framing effect so a viewport resize never re-frames the camera.
  const isMobileRef = useRef(isMobile);
  isMobileRef.current = isMobile;
  const selectedGroupKeyRef = useRef(selectedGroupKey);
  selectedGroupKeyRef.current = selectedGroupKey;
  const compactPopupRef = useRef(false);

  const journey = useMemo(
    () => JOURNEYS.find((entry) => entry.id === selectedJourneyId) ?? JOURNEYS[0],
    [selectedJourneyId],
  );
  const groups = useMemo(() => groupWaypoints(journey.waypoints), [journey]);
  const journeysByEra = useMemo(() => {
    const byEra = new Map<JourneyEra, Journey[]>();
    for (const entry of JOURNEYS) {
      const list = byEra.get(entry.era) ?? [];
      list.push(entry);
      byEra.set(entry.era, list);
    }
    return byEra;
  }, []);

  const openGroupPopup = useCallback(
    (group: WaypointGroup) => {
      const map = mapRef.current;
      if (!map) return;
      const mobile = isMobileRef.current;
      const layout = mapPopupLayout(map.getZoom(), mobile);
      if (!popupRef.current) {
        popupRef.current = new mapboxgl.Popup({
          offset: mobile ? 12 : 18,
          // No fixed anchor: the map wrapper clips overflow, so Mapbox has to be free to
          // flip the popup below or beside a marker that sits near an edge.
          className: "journey-popup",
          maxWidth: layout.maxWidth,
          closeButton: true,
          closeOnClick: false,
        });
        popupRef.current.on("close", () => setSelectedGroupKey(null));
      }
      compactPopupRef.current = layout.compact;
      popupRef.current
        .setLngLat([group.lng, group.lat])
        .setHTML(buildPopupHtml(group, journey.waypoints.length, lang, t, layout.compact))
        .addTo(map);
      applyMapPopupLayout(popupRef.current, map.getZoom(), mobile);
      setSelectedGroupKey(group.key);
    },
    [journey.waypoints.length, lang, t],
  );

  const focusWaypoint = useCallback(
    (waypoint: JourneyWaypoint) => {
      const map = mapRef.current;
      const group = groups.find((entry) =>
        entry.visits.some((visit) => visit.waypoint.id === waypoint.id),
      );
      if (!map || !group) return;
      map.flyTo({
        center: [group.lng, group.lat],
        zoom: Math.max(map.getZoom(), 11),
        duration: 1400,
        essential: true,
      });
      openGroupPopup(group);
    },
    [groups, openGroupPopup],
  );

  useEffect(() => {
    if (!MAPBOX_TOKEN || !mapContainerRef.current || mapRef.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      projection: "globe",
      center: GLOBE_CENTER,
      zoom: GLOBE_ZOOM,
      minZoom: 1.2,
      // Deep enough to separate the Jerusalem clusters, where consecutive stops
      // (the temple and Gethsemane, the city of David and the temple) sit ~450m apart.
      maxZoom: 14,
      attributionControl: true,
    });
    mapRef.current = map;
    map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), "top-right");

    map.on("load", () => {
      map.resize();
      hideDecorativeLayers(map);
      map.setFog({
        color: "rgba(247, 239, 225, 0.85)",
        "high-color": "rgba(198, 214, 200, 0.6)",
        "horizon-blend": 0.06,
        "space-color": "#e8efe8",
        "star-intensity": 0,
      });
      const arrow = createArrowImage();
      if (arrow && !map.hasImage(ARROW_ICON_ID)) {
        map.addImage(ARROW_ICON_ID, arrow, { pixelRatio: 2 });
      }
      setMapReady(true);
    });

    return () => {
      popupRef.current?.remove();
      popupRef.current = null;
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      markerElementsByKeyRef.current.clear();
      map.remove();
      mapRef.current = null;
      setMapReady(false);
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;
    const journeyMap = map;

    popupRef.current?.remove();
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];
    markerElementsByKeyRef.current.clear();

    const arcs = buildJourneyArcs(journey.waypoints);
    const existing = journeyMap.getSource(PATH_SOURCE_ID) as
      | mapboxgl.GeoJSONSource
      | undefined;
    if (existing) {
      existing.setData(arcs);
    } else {
      journeyMap.addSource(PATH_SOURCE_ID, { type: "geojson", data: arcs });
      journeyMap.addLayer({
        id: PATH_GLOW_ID,
        type: "line",
        source: PATH_SOURCE_ID,
        layout: { "line-cap": "round", "line-join": "round" },
        paint: {
          "line-color": PATH_COLOR,
          "line-width": 7,
          "line-blur": 4,
          "line-opacity": 0.22,
        },
      });
      journeyMap.addLayer({
        id: PATH_LINE_ID,
        type: "line",
        source: PATH_SOURCE_ID,
        layout: { "line-cap": "round", "line-join": "round" },
        paint: {
          "line-color": PATH_COLOR,
          "line-width": 2.5,
          "line-opacity": 0.95,
        },
      });
      journeyMap.addLayer({
        id: PATH_ARROWS_ID,
        type: "symbol",
        source: PATH_SOURCE_ID,
        layout: {
          "symbol-placement": "line",
          "symbol-spacing": 90,
          "icon-image": ARROW_ICON_ID,
          "icon-rotation-alignment": "map",
          "icon-keep-upright": false,
          "icon-allow-overlap": true,
          "icon-ignore-placement": true,
          "icon-size": ["interpolate", ["linear"], ["zoom"], 2, 0.42, 6, 0.6],
        },
      });
    }

    groups.forEach((group) => {
      const el = createStarMarkerElement();
      el.title = group.visits
        .map((visit) => waypointName(visit.waypoint, lang))
        .join(" • ");
      el.addEventListener("click", (event) => {
        event.stopPropagation();
        openGroupPopup(group);
      });
      const marker = new mapboxgl.Marker({ element: el, anchor: "center" })
        .setLngLat([group.lng, group.lat])
        .addTo(journeyMap);
      markersRef.current.push(marker);
      markerElementsByKeyRef.current.set(group.key, el);
    });

    const refreshStars = () => {
      const zoom = journeyMap.getZoom();
      markerElementsByKeyRef.current.forEach((el) => {
        applyStarStyle(el, zoom, STAR_SIZE);
      });
      const popup = popupRef.current;
      const popupEl = popup?.getElement();
      if (!popup || !popupEl?.isConnected) return;
      const mobile = isMobileRef.current;
      const layout = mapPopupLayout(zoom, mobile);
      applyMapPopupLayout(popup, zoom, mobile);
      if (layout.compact === compactPopupRef.current) return;
      compactPopupRef.current = layout.compact;
      const group = groups.find((entry) => entry.key === selectedGroupKeyRef.current);
      if (!group) return;
      popup.setHTML(buildPopupHtml(group, journey.waypoints.length, lang, t, layout.compact));
    };
    refreshStars();
    journeyMap.on("zoom", refreshStars);

    return () => {
      journeyMap.off("zoom", refreshStars);
    };
  }, [groups, journey, lang, mapReady, openGroupPopup, t]);

  // Framing is keyed on the journey alone, so switching language rebuilds the
  // markers and popups without yanking the camera away from where the user left it.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;
    const bounds = journey.waypoints.reduce(
      (acc, waypoint) => acc.extend([waypoint.lng, waypoint.lat]),
      new mapboxgl.LngLatBounds(),
    );
    map.fitBounds(bounds, {
      // Desktop reserves room for the docked panel on the right. On a phone the map is
      // only ~320px wide, so generous side padding would squeeze the route to nothing.
      padding: isMobileRef.current
        ? { top: 44, bottom: 44, left: 24, right: 24 }
        : { top: 70, bottom: 70, left: 70, right: 380 },
      maxZoom: 7,
      duration: 2200,
    });
  }, [journey, mapReady]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;
    map.resize();
  }, [isMobile, mapReady]);

  useEffect(() => {
    markerElementsByKeyRef.current.forEach((el, key) => {
      if (key === selectedGroupKey) {
        el.style.outline = "2px solid rgba(180, 83, 9, 0.85)";
        el.style.outlineOffset = "2px";
        el.style.zIndex = "6";
      } else {
        el.style.outline = "none";
        el.style.outlineOffset = "0";
        el.style.zIndex = "5";
      }
    });
  }, [selectedGroupKey, groups]);

  if (!MAPBOX_TOKEN) {
    return (
      <div className="space-y-3 rounded-2xl border border-sage-primary/45 bg-white/80 p-5">
        <h2 className="text-2xl font-semibold text-sage-dark">{t("nav.journeys")}</h2>
        <p className="text-sm text-sage-dark/85">{t("journeys.missingToken")}</p>
      </div>
    );
  }

  const selectorPanel = (
    <div className="space-y-3">
      {JOURNEY_ERAS.map((era) => {
        const entries = journeysByEra.get(era) ?? [];
        if (!entries.length) return null;
        return (
          <div key={era} className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-sage-dark/60">
              {t(`journeys.eras.${era}`)}
            </p>
            {entries.map((entry) => (
              <button
                key={entry.id}
                type="button"
                onClick={() => setSelectedJourneyId(entry.id)}
                className={`block w-full rounded-lg px-2.5 py-1.5 text-left text-xs font-medium transition ${
                  entry.id === journey.id
                    ? "bg-sage-forest text-white"
                    : "text-sage-dark hover:bg-sage-primary/25"
                }`}
              >
                {journeyTitle(entry, lang)}
              </button>
            ))}
          </div>
        );
      })}
    </div>
  );

  const stopList = (
    <ol className="space-y-1">
      {journey.waypoints.map((waypoint, index) => {
        const isSelected = groups.some(
          (group) =>
            group.key === selectedGroupKey &&
            group.visits.some((visit) => visit.waypoint.id === waypoint.id),
        );
        return (
          <li key={waypoint.id}>
            <button
              type="button"
              onClick={() => focusWaypoint(waypoint)}
              className={`flex w-full items-baseline gap-2 rounded-md px-2 py-1 text-left text-xs transition ${
                isSelected
                  ? "bg-amber-100/70 text-sage-dark"
                  : "text-sage-dark/85 hover:bg-sage-primary/20"
              }`}
            >
              <span className="w-4 shrink-0 text-[10px] font-semibold text-sage-dark/50">
                {index + 1}
              </span>
              <span className="min-w-0">{waypointName(waypoint, lang)}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );

  return (
    <div className="space-y-4">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold text-sage-dark">{t("nav.journeys")}</h2>
        <p className="max-w-3xl text-sm leading-relaxed text-sage-dark/80">
          {t("journeys.intro")}
        </p>
      </header>

      <section className="rounded-2xl border border-sage-primary/35 bg-white/85 p-4 shadow-sm">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-sage-dark">
              {journeyTitle(journey, lang)}
            </p>
            <p className="text-xs text-sage-dark/70">
              {t("journeys.stopCount", { count: journey.waypoints.length })}
            </p>
          </div>
        </div>

        <div className="relative isolate overflow-hidden rounded-xl">
          <div
            ref={mapContainerRef}
            className={`relative z-0 rounded-xl ${
              isMobile ? "h-[42vh] min-h-[16rem]" : "h-[62vh] min-h-[26rem]"
            }`}
          />
          <div
            className="pointer-events-none absolute inset-0 z-10 rounded-xl bg-gradient-to-b from-[#f4e4c8]/20 via-transparent to-[#f3e2c2]/14"
            aria-hidden
          />

          <aside className="absolute right-0 top-0 z-30 hidden h-full w-[22rem] max-w-[92%] flex-col gap-3 overflow-y-auto border-l border-amber-200/70 bg-[#f7efe1]/95 p-4 shadow-xl lg:flex">
            <p className="text-sm font-semibold text-sage-dark">{t("journeys.panelTitle")}</p>
            {selectorPanel}
            <div className="border-t border-amber-300/50 pt-3">
              <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-sage-dark/60">
                {t("journeys.stopsLabel")}
              </p>
              {stopList}
            </div>
          </aside>
        </div>

        {isMobile ? (
          <div className="mt-4 rounded-xl border border-amber-200/70 bg-[#f7efe1]/90 p-4">
            <p className="mb-3 text-sm font-semibold text-sage-dark">{t("journeys.panelTitle")}</p>
            {selectorPanel}
            <div className="mt-3 border-t border-amber-300/50 pt-3">
              <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-sage-dark/60">
                {t("journeys.stopsLabel")}
              </p>
              {stopList}
            </div>
          </div>
        ) : null}

        <p className="mt-3 text-[11px] text-sage-dark/65">
          {t("journeys.locationNote")}{" "}
          <a
            href="https://www.openbible.info/geo/"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-amber-400/60 underline-offset-2 hover:text-amber-800"
          >
            {t("journeys.sourceCredit")}
          </a>
        </p>
      </section>
    </div>
  );
}
