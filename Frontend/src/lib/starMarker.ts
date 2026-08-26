/**
 * The orange square star marker shared by the Atlas and Journey maps.
 *
 * Markers are plain DOM rather than React because Mapbox owns their positioning
 * and they are created/destroyed in bulk whenever the map data changes.
 */

export type StarStyleOptions = {
  minSize?: number;
  maxSize?: number;
  /** Floor for the zoom-based fade. Set to 1 where the markers are the main subject. */
  minOpacity?: number;
};

const DEFAULT_MIN_SIZE = 11;
const DEFAULT_MAX_SIZE = 14;
const DEFAULT_MIN_OPACITY = 0.58;

export function createStarMarkerElement(): HTMLButtonElement {
  const el = document.createElement("button");
  el.type = "button";
  // `star-marker` carries the touch hit-area rule in index.css.
  el.className =
    "star-marker flex items-center justify-center border border-amber-100/80 bg-[#f4a259]/90 text-white shadow-[0_0_0_1px_rgba(72,45,20,0.22)]";
  el.style.borderRadius = "4px";
  el.style.lineHeight = "1";
  el.style.pointerEvents = "auto";
  el.style.zIndex = "5";
  el.textContent = "★";
  return el;
}

export function applyStarStyle(
  el: HTMLButtonElement,
  zoom: number,
  options: StarStyleOptions = {},
): void {
  const minSize = options.minSize ?? DEFAULT_MIN_SIZE;
  const maxSize = options.maxSize ?? DEFAULT_MAX_SIZE;
  const minOpacity = options.minOpacity ?? DEFAULT_MIN_OPACITY;
  const size = Math.max(minSize, Math.min(maxSize, maxSize - (zoom - 3) * 0.45));
  const opacity = Math.max(minOpacity, Math.min(1, 1 - (zoom - 3) * 0.055));
  el.style.width = `${size}px`;
  el.style.height = `${size}px`;
  el.style.fontSize = `${Math.max(minSize - 1, size - 1)}px`;
  el.style.opacity = `${opacity}`;
}
