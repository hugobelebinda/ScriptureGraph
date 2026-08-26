import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useSearchParams } from "react-router-dom";
import {
  CITIES,
  CITY_PERIODS,
  CITY_REGIONS,
  type City,
  type CityEvent,
  type CityPeriod,
  type CityRegion,
  type CityTier,
} from "../data/citiesData";
import type { ScriptureRef } from "../data/journeysData";
import { useIsBelowLg } from "../hooks/useMediaQuery";
import {
  findVerseInChapter,
  parseUid,
  useBibleData,
  type ChapterPayload,
} from "../hooks/useBibleData";
import { applyMapPopupLayout, mapPopupLayout } from "../lib/mapPopup";
import { applyStarStyle, createStarMarkerElement, type StarStyleOptions } from "../lib/starMarker";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const GLOBE_CENTER: [number, number] = [35, 33];
const GLOBE_ZOOM = 1.6;

const TIER_STAR: Record<CityTier, StarStyleOptions> = {
  primary: { minSize: 18, maxSize: 26, minOpacity: 1 },
  major: { minSize: 15, maxSize: 21, minOpacity: 1 },
  notable: { minSize: 13, maxSize: 17, minOpacity: 1 },
  minor: { minSize: 11, maxSize: 14, minOpacity: 1 },
};

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

type VerseSpan = {
  chapter: number;
  start: number;
  end: number;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function cityName(city: City, lang: Lang): string {
  return lang === "fr" ? city.nameFr : city.nameEn;
}

function cityBlurb(city: City, lang: Lang): string {
  return lang === "fr" ? city.blurbFr : city.blurbEn;
}

function eventLabel(event: CityEvent, lang: Lang): string {
  return lang === "fr" ? event.labelFr : event.labelEn;
}

function eventDescription(event: CityEvent, lang: Lang): string | undefined {
  return lang === "fr" ? event.descriptionFr : event.descriptionEn;
}

function parseRefSpans(ref: string): VerseSpan[] {
  const match = ref.match(/^(\d+):(\d+)(?:-(\d+)(?::(\d+))?)?$/);
  if (!match) return [];
  const startChapter = Number(match[1]);
  const startVerse = Number(match[2]);
  if (!match[3]) {
    return [{ chapter: startChapter, start: startVerse, end: startVerse }];
  }
  if (match[4]) {
    const endChapter = Number(match[3]);
    const endVerse = Number(match[4]);
    const spans: VerseSpan[] = [];
    for (let chapter = startChapter; chapter <= endChapter; chapter += 1) {
      if (chapter === startChapter) {
        spans.push({ chapter, start: startVerse, end: Number.POSITIVE_INFINITY });
      } else if (chapter === endChapter) {
        spans.push({ chapter, start: 1, end: endVerse });
      } else {
        spans.push({ chapter, start: 1, end: Number.POSITIVE_INFINITY });
      }
    }
    return spans;
  }
  return [{ chapter: startChapter, start: startVerse, end: Number(match[3]) }];
}

function verseNumber(uid: string): number | null {
  return parseUid(uid)?.verse ?? null;
}

function verseText(chapter: ChapterPayload, lang: Lang, uid: string): string {
  const verse = findVerseInChapter(chapter, verseNumber(uid) ?? -1);
  if (!verse) return "";
  return lang === "fr" ? verse.text_fr || verse.text : verse.text_en || verse.text;
}

function firstVerseUid(ref: ScriptureRef): string | null {
  const span = parseRefSpans(ref.ref)[0];
  if (!span) return null;
  return `${ref.usfm}.${span.chapter}.${span.start}`;
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

function buildSourceHtml(
  city: City,
  t: (key: string, options?: Record<string, unknown>) => string,
): string {
  const { source } = city;
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
  city: City,
  lang: Lang,
  t: (key: string, options?: Record<string, unknown>) => string,
  compact: boolean,
): string {
  const widthClass = compact ? "min-w-0 max-w-[13rem]" : "min-w-[10rem] max-w-[17rem]";
  const blurb = compact
    ? ""
    : `<p class="text-xs leading-relaxed text-sage-dark/80">${escapeHtml(cityBlurb(city, lang))}</p>`;
  const sourceNote = compact ? "" : buildSourceHtml(city, t);
  return `
    <div class="${widthClass} space-y-1.5">
      <p class="${compact ? "text-xs" : "text-sm"} font-semibold text-sage-dark">${escapeHtml(cityName(city, lang))}</p>
      ${blurb}
      <p class="text-[10px] font-medium uppercase tracking-wide text-sage-dark/55">${escapeHtml(
        t("cities.eventCount", { count: city.events.length }),
      )}</p>
      ${sourceNote}
    </div>`;
}

function coverageNote(
  city: City,
  lang: Lang,
  t: (key: string) => string,
): string | null {
  if (!city.curated) return null;
  if (lang === "fr" && city.coverageNoteFr) return city.coverageNoteFr;
  if (lang !== "fr" && city.coverageNoteEn) return city.coverageNoteEn;
  if (city.tier === "primary" || city.tier === "major") {
    return t("cities.coverageNoteMany");
  }
  return t("cities.coverageNoteSome");
}

function groupEventsByPeriod(events: CityEvent[]): Map<CityPeriod, CityEvent[]> {
  const grouped = new Map<CityPeriod, CityEvent[]>();
  for (const period of CITY_PERIODS) grouped.set(period, []);
  for (const event of events) {
    grouped.get(event.period)?.push(event);
  }
  return grouped;
}

function VerseExcerpt({ refs }: { refs: ScriptureRef[] }) {
  const { t, i18n } = useTranslation();
  const lang: Lang = i18n.language === "fr" ? "fr" : "en";
  const { fetchChapter } = useBibleData();
  const [lines, setLines] = useState<string[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLines(null);
    setError(false);

    (async () => {
      try {
        const collected: string[] = [];
        for (const ref of refs) {
          const spans = parseRefSpans(ref.ref);
          for (const span of spans) {
            const chapter = await fetchChapter(ref.usfm, span.chapter);
            for (const verse of chapter.verses) {
              const number = verseNumber(verse.uid);
              if (number == null || number < span.start || number > span.end) continue;
              const text = verseText(chapter, lang, verse.uid);
              if (text) collected.push(text);
              if (collected.length >= 12) break;
            }
            if (collected.length >= 12) break;
          }
          if (collected.length >= 12) break;
        }
        if (!cancelled) setLines(collected);
      } catch {
        if (!cancelled) setError(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [fetchChapter, lang, refs]);

  if (error) {
    return <p className="text-xs italic text-sage-dark/60">{t("cities.verseUnavailable")}</p>;
  }
  if (!lines) {
    return <p className="text-xs italic text-sage-dark/55">{t("cities.verseLoading")}</p>;
  }
  if (lines.length === 0) {
    return <p className="text-xs italic text-sage-dark/60">{t("cities.verseUnavailable")}</p>;
  }

  const graphUid = firstVerseUid(refs[0]);
  return (
    <div className="space-y-2">
      <p className="text-xs leading-relaxed text-sage-dark/85">{lines.join(" ")}</p>
      {graphUid ? (
        <Link
          to={`/graph?verse=${encodeURIComponent(graphUid)}`}
          className="inline-block text-[11px] font-medium text-amber-800 underline decoration-amber-400/60 underline-offset-2 hover:text-amber-950"
        >
          {t("cities.openInGraph")}
        </Link>
      ) : null}
    </div>
  );
}

function EventRow({
  event,
  lang,
  t,
}: {
  event: CityEvent;
  lang: Lang;
  t: (key: string, options?: Record<string, unknown>) => string;
}) {
  const [open, setOpen] = useState(false);
  const tags = event.refs.map((ref) => {
    const book = t(`books.${ref.usfm}`, { defaultValue: ref.usfm });
    return `${book} ${ref.ref}`;
  });
  const description = eventDescription(event, lang);
  const canExpand = event.weight === "reference";

  return (
    <article className="rounded-lg px-2 py-1.5">
      {canExpand ? (
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="w-full text-left"
          aria-expanded={open}
        >
          <p className="text-xs font-medium leading-snug text-sage-dark">
            {eventLabel(event, lang)}
          </p>
        </button>
      ) : (
        <p className="text-xs font-medium leading-snug text-sage-dark">
          {eventLabel(event, lang)}
        </p>
      )}
      {description ? (
        <p className="mt-1 text-xs leading-relaxed text-sage-dark/80">{description}</p>
      ) : null}
      <div className="mt-1.5 flex flex-wrap gap-1">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md border border-amber-300/70 bg-amber-100/60 px-1.5 py-0.5 text-[10px] font-medium italic text-sage-dark/80"
          >
            {tag}
          </span>
        ))}
      </div>
      {canExpand && open ? (
        <div className="mt-2 border-t border-amber-200/70 pt-2">
          <VerseExcerpt refs={event.refs} />
        </div>
      ) : null}
    </article>
  );
}

export function CitiesView() {
  const { t, i18n } = useTranslation();
  const isMobile = useIsBelowLg();
  const lang: Lang = i18n.language === "fr" ? "fr" : "en";
  const [params, setParams] = useSearchParams();

  const selectedCityId = params.get("city");
  const selectedCity = useMemo(
    () => CITIES.find((city) => city.id === selectedCityId) ?? null,
    [selectedCityId],
  );

  const [query, setQuery] = useState("");
  const [mapReady, setMapReady] = useState(false);
  const [showAllEvents, setShowAllEvents] = useState(true);
  const [openPeriods, setOpenPeriods] = useState<Set<CityPeriod>>(new Set());

  const panelRef = useRef<HTMLElement | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const markerElementsByIdRef = useRef<Map<string, HTMLButtonElement>>(new Map());
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const isMobileRef = useRef(isMobile);
  isMobileRef.current = isMobile;
  const selectedCityIdRef = useRef(selectedCityId);
  selectedCityIdRef.current = selectedCityId;
  const compactPopupRef = useRef(false);
  const hasFramedRef = useRef(false);

  const filteredCities = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    if (!needle) return CITIES;
    return CITIES.filter((city) => {
      return (
        city.nameEn.toLocaleLowerCase().includes(needle) ||
        city.nameFr.toLocaleLowerCase().includes(needle)
      );
    });
  }, [query]);

  const citiesByRegion = useMemo(() => {
    const byRegion = new Map<CityRegion, City[]>();
    for (const region of CITY_REGIONS) byRegion.set(region, []);
    for (const city of filteredCities) {
      byRegion.get(city.region)?.push(city);
    }
    return byRegion;
  }, [filteredCities]);

  const headlineEvents = selectedCity?.events.filter((event) => event.weight === "headline") ?? [];
  const eventsByPeriod = useMemo(
    () => (selectedCity ? groupEventsByPeriod(selectedCity.events) : null),
    [selectedCity],
  );

  const setSelectedCityId = useCallback(
    (id: string | null) => {
      setParams(
        (previous) => {
          const next = new URLSearchParams(previous);
          if (id) next.set("city", id);
          else next.delete("city");
          return next;
        },
        { replace: true },
      );
    },
    [setParams],
  );

  const fitAllCities = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    const bounds = CITIES.reduce(
      (acc, city) => acc.extend([city.lng, city.lat]),
      new mapboxgl.LngLatBounds(),
    );
    map.fitBounds(bounds, {
      padding: isMobileRef.current
        ? { top: 36, bottom: 36, left: 32, right: 32 }
        : { top: 70, bottom: 70, left: 70, right: 380 },
      maxZoom: isMobileRef.current ? 3.1 : 4.8,
      duration: 1400,
    });
  }, []);

  const openCityPopup = useCallback(
    (city: City) => {
      const map = mapRef.current;
      if (!map) return;
      const mobile = isMobileRef.current;
      const layout = mapPopupLayout(map.getZoom(), mobile);
      if (!popupRef.current) {
        popupRef.current = new mapboxgl.Popup({
          offset: mobile ? 12 : 18,
          className: "journey-popup",
          maxWidth: layout.maxWidth,
          closeButton: true,
          closeOnClick: false,
          closeOnMove: false,
        });
      }
      compactPopupRef.current = layout.compact;
      popupRef.current
        .setLngLat([city.lng, city.lat])
        .setHTML(buildPopupHtml(city, lang, t, layout.compact))
        .addTo(map);
      applyMapPopupLayout(popupRef.current, map.getZoom(), mobile);
    },
    [lang, t],
  );
  const openCityPopupRef = useRef(openCityPopup);
  openCityPopupRef.current = openCityPopup;

  const focusCity = useCallback(
    (city: City) => {
      const map = mapRef.current;
      setSelectedCityId(city.id);
      if (!map) return;
      map.flyTo({
        center: [city.lng, city.lat],
        zoom: Math.max(map.getZoom(), city.tier === "primary" ? 8.5 : 7.5),
        duration: 1400,
        essential: true,
      });
      openCityPopup(city);
    },
    [openCityPopup, setSelectedCityId],
  );

  useEffect(() => {
    if (!selectedCity) {
      setShowAllEvents(true);
      setOpenPeriods(new Set());
      return;
    }
    setShowAllEvents(true);
    setOpenPeriods(
      new Set(CITY_PERIODS.filter((period) => selectedCity.events.some((event) => event.period === period))),
    );
  }, [selectedCity]);

  useEffect(() => {
    if (!selectedCityId || !isMobileRef.current) return;
    const node = document.getElementById("city-events");
    node?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [selectedCityId]);

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
      setMapReady(true);
    });

    return () => {
      popupRef.current?.remove();
      popupRef.current = null;
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      markerElementsByIdRef.current.clear();
      map.remove();
      mapRef.current = null;
      setMapReady(false);
      hasFramedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;
    const citiesMap = map;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];
    markerElementsByIdRef.current.clear();

    CITIES.forEach((city) => {
      const el = createStarMarkerElement();
      el.title = cityName(city, lang);
      el.dataset.tier = city.tier;
      el.addEventListener("click", (event) => {
        event.stopPropagation();
        focusCity(city);
      });
      const marker = new mapboxgl.Marker({ element: el, anchor: "center" })
        .setLngLat([city.lng, city.lat])
        .addTo(citiesMap);
      markersRef.current.push(marker);
      markerElementsByIdRef.current.set(city.id, el);
    });

    const refreshStars = () => {
      const zoom = citiesMap.getZoom();
      markerElementsByIdRef.current.forEach((el, id) => {
        const city = CITIES.find((entry) => entry.id === id);
        if (!city) return;
        applyStarStyle(el, zoom, TIER_STAR[city.tier]);
      });
      const popup = popupRef.current;
      const popupEl = popup?.getElement();
      if (!popup || !popupEl?.isConnected) return;
      const mobile = isMobileRef.current;
      const layout = mapPopupLayout(zoom, mobile);
      applyMapPopupLayout(popup, zoom, mobile);
      if (layout.compact === compactPopupRef.current) return;
      compactPopupRef.current = layout.compact;
      const city = CITIES.find((entry) => entry.id === selectedCityIdRef.current);
      if (!city) return;
      popup.setHTML(buildPopupHtml(city, lang, t, layout.compact));
    };
    refreshStars();
    citiesMap.on("zoom", refreshStars);

    return () => {
      citiesMap.off("zoom", refreshStars);
    };
  }, [focusCity, lang, mapReady, t]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;
    map.resize();
    if (selectedCity) {
      if (!hasFramedRef.current) {
        hasFramedRef.current = true;
        map.jumpTo({
          center: [selectedCity.lng, selectedCity.lat],
          zoom: selectedCity.tier === "primary" ? 8.5 : 7.5,
        });
        openCityPopupRef.current(selectedCity);
      }
      return;
    }
    hasFramedRef.current = true;
    fitAllCities();
  }, [fitAllCities, isMobile, mapReady, selectedCity]);

  useEffect(() => {
    if (!selectedCity || !mapReady) return;
    openCityPopup(selectedCity);
  }, [lang, mapReady, openCityPopup, selectedCity]);

  useEffect(() => {
    markerElementsByIdRef.current.forEach((el, id) => {
      if (id === selectedCityId) {
        el.style.outline = "2px solid rgba(180, 83, 9, 0.85)";
        el.style.outlineOffset = "2px";
        el.style.zIndex = "6";
      } else {
        el.style.outline = "none";
        el.style.outlineOffset = "0";
        el.style.zIndex = "5";
      }
    });
  }, [selectedCityId, mapReady]);

  if (!MAPBOX_TOKEN) {
    return (
      <div className="space-y-3 rounded-2xl border border-sage-primary/45 bg-white/80 p-5">
        <h2 className="text-2xl font-semibold text-sage-dark">{t("nav.cities")}</h2>
        <p className="text-sm text-sage-dark/85">{t("cities.missingToken")}</p>
      </div>
    );
  }

  const note = selectedCity ? coverageNote(selectedCity, lang, t) : null;

  const cityList = (
    <div className="space-y-3">
      <label className="block">
        <span className="sr-only">{t("cities.searchPlaceholder")}</span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t("cities.searchPlaceholder")}
          className="w-full rounded-lg border border-sage-primary/40 bg-white/80 px-2.5 py-1.5 text-xs text-sage-dark placeholder:text-sage-dark/45 focus:border-sage-forest focus:outline-none"
        />
      </label>
      <p className="text-[11px] leading-snug text-sage-dark/60">
        {t("cities.selectionNote")}
      </p>
      {filteredCities.length === 0 ? (
        <p className="text-xs italic text-sage-dark/60">{t("cities.noMatches")}</p>
      ) : (
        CITY_REGIONS.map((region) => {
          const entries = citiesByRegion.get(region) ?? [];
          if (!entries.length) return null;
          return (
            <div key={region} className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-sage-dark/60">
                {t(`cities.regions.${region}`)}
              </p>
              {entries.map((city) => (
                <button
                  key={city.id}
                  type="button"
                  onClick={() => focusCity(city)}
                  className={`flex w-full items-baseline justify-between rounded-lg px-2.5 py-1.5 text-left text-xs font-medium transition ${
                    city.id === selectedCityId
                      ? "bg-sage-forest text-white"
                      : "text-sage-dark hover:bg-sage-primary/25"
                  }`}
                >
                  <span>{cityName(city, lang)}</span>
                  <span
                    className={`ml-2 text-[10px] font-normal ${
                      city.id === selectedCityId ? "text-white/70" : "text-sage-dark/45"
                    }`}
                  >
                    {t("cities.eventCount", { count: city.events.length })}
                  </span>
                </button>
              ))}
            </div>
          );
        })
      )}
    </div>
  );

  const clearCity = () => {
    popupRef.current?.remove();
    setSelectedCityId(null);
  };

  const eventList = selectedCity ? (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-sage-dark">{cityName(selectedCity, lang)}</p>
          <p className="text-xs text-sage-dark/70">
            {t("cities.eventCount", { count: selectedCity.events.length })}
          </p>
        </div>
        <button
          type="button"
          onClick={clearCity}
          className="rounded-md border border-sage-primary/40 px-2 py-1 text-[11px] text-sage-dark/80 hover:bg-white/70"
        >
          {t("cities.backToList")}
        </button>
      </div>
      <p className="text-xs leading-relaxed text-sage-dark/80">{cityBlurb(selectedCity, lang)}</p>

      <p className="text-[11px] font-semibold uppercase tracking-wide text-sage-dark/60">
        {t("cities.eventsHeading")}
      </p>

      {selectedCity.events.length > headlineEvents.length ? (
        <button
          type="button"
          onClick={() => {
            setShowAllEvents((value) => {
              const next = !value;
              if (next && eventsByPeriod) {
                setOpenPeriods(
                  new Set(
                    CITY_PERIODS.filter((period) => (eventsByPeriod.get(period) ?? []).length > 0),
                  ),
                );
              }
              return next;
            });
          }}
          className="rounded-lg border border-sage-primary/40 px-3 py-1.5 text-xs font-medium text-sage-dark transition hover:bg-sage-primary/20"
        >
          {showAllEvents ? t("cities.showHeadlines") : t("cities.showAll")}
        </button>
      ) : null}

      {!showAllEvents ? (
        <div className="space-y-1">
          {headlineEvents.map((event) => (
            <EventRow key={event.id} event={event} lang={lang} t={t} />
          ))}
        </div>
      ) : null}

      {showAllEvents && eventsByPeriod
        ? CITY_PERIODS.map((period) => {
            const events = eventsByPeriod.get(period) ?? [];
            if (!events.length) return null;
            const open = openPeriods.has(period);
            return (
              <div key={period} className="rounded-lg border border-amber-200/70 bg-white/50">
                <button
                  type="button"
                  onClick={() => {
                    setOpenPeriods((current) => {
                      const next = new Set(current);
                      if (next.has(period)) next.delete(period);
                      else next.add(period);
                      return next;
                    });
                  }}
                  className="flex w-full items-center justify-between px-2.5 py-1.5 text-left"
                  aria-expanded={open}
                >
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-sage-dark/70">
                    {t(`cities.periods.${period}`)}
                  </span>
                  <span className="text-[10px] text-sage-dark/50">
                    {t("cities.eventCount", { count: events.length })}
                  </span>
                </button>
                {open ? (
                  <div className="space-y-1 border-t border-amber-200/70 px-1 pb-1">
                    {events.map((event) => (
                      <EventRow key={event.id} event={event} lang={lang} t={t} />
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })
        : null}

      {note ? <p className="text-[11px] italic leading-relaxed text-sage-dark/60">{note}</p> : null}
    </div>
  ) : null;

  return (
    <div className="space-y-4">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold text-sage-dark">{t("nav.cities")}</h2>
        <p className="max-w-3xl text-sm leading-relaxed text-sage-dark/80">{t("cities.intro")}</p>
      </header>

      <section className="rounded-2xl border border-sage-primary/35 bg-white/85 p-4 shadow-sm">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-sage-dark">
              {selectedCity ? cityName(selectedCity, lang) : t("cities.panelTitle")}
            </p>
            <p className="text-xs text-sage-dark/70">
              {selectedCity
                ? t("cities.headlineCount", { count: headlineEvents.length })
                : t("cities.cityCount", { count: CITIES.length })}
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

          <aside
            ref={panelRef}
            className="absolute right-0 top-0 z-30 hidden h-full w-[22rem] max-w-[92%] flex-col gap-3 overflow-y-auto border-l border-amber-200/70 bg-[#f7efe1]/95 p-4 shadow-xl lg:flex"
          >
            <p className="text-sm font-semibold text-sage-dark">
              {selectedCity ? cityName(selectedCity, lang) : t("cities.panelTitle")}
            </p>
            {selectedCity ? eventList : cityList}
          </aside>
        </div>

        {isMobile ? (
          <div
            id="city-events"
            className="mt-4 scroll-mt-16 rounded-xl border border-amber-200/70 bg-[#f7efe1]/90 p-4"
          >
            {selectedCity ? eventList : cityList}
          </div>
        ) : null}

        <p className="mt-3 text-[11px] text-sage-dark/65">
          {t("cities.locationNote")}{" "}
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
