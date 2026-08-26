import type mapboxgl from "mapbox-gl";

/** Zoom-linked parchment popup size, shared by Journeys and Cities. */
export function mapPopupLayout(
  zoom: number,
  mobile: boolean,
): {
  scale: number;
  maxWidth: string;
  compact: boolean;
} {
  const t = Math.max(0, Math.min(1, (zoom - 2) / 6));
  const minScale = mobile ? 0.5 : 0.64;
  return {
    scale: minScale + t * (1 - minScale),
    maxWidth: mobile ? `${(9 + t * 4.5).toFixed(2)}rem` : `${(12 + t * 6).toFixed(2)}rem`,
    compact: zoom < 5.4,
  };
}

export function applyMapPopupLayout(popup: mapboxgl.Popup, zoom: number, mobile: boolean): void {
  const layout = mapPopupLayout(zoom, mobile);
  popup.setMaxWidth(layout.maxWidth);
  popup.getElement()?.style.setProperty("--popup-scale", String(layout.scale));
}
