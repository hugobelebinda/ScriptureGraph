import bezierSpline from "@turf/bezier-spline";
import { lineString } from "@turf/helpers";
import type { JourneyWaypoint } from "../data/journeysData";

/** How far each segment bulges sideways, as a fraction of the segment length. */
const ARC_CURVATURE = 0.16;
/** Segments shorter than this (in degrees) are skipped; revisited sites would otherwise self-intersect. */
const MIN_SEGMENT_DEGREES = 0.0006;
/**
 * Waypoints closer than this (in degrees, roughly 150m) share one marker.
 * Deliberately tight: Golgotha and the empty tomb are the same site and must merge,
 * while the temple and Gethsemane are ~400m apart and must stay separate.
 */
const GROUP_RADIUS_DEGREES = 0.0015;

export type WaypointVisit = {
  waypoint: JourneyWaypoint;
  index: number;
};

export type WaypointGroup = {
  key: string;
  lng: number;
  lat: number;
  visits: WaypointVisit[];
};

/**
 * Longitude degrees shrink towards the poles, so horizontal offsets are scaled by
 * cos(latitude) before rotating them. Without it, arcs look lopsided far from the equator.
 */
function lngScaleAt(lat: number): number {
  return Math.cos((lat * Math.PI) / 180) || 1;
}

export function segmentLengthDegrees(
  a: [number, number],
  b: [number, number],
): number {
  const scale = lngScaleAt((a[1] + b[1]) / 2);
  return Math.hypot((b[0] - a[0]) * scale, b[1] - a[1]);
}

/** Midpoint pushed sideways so a spline through the three points bows consistently to one side. */
export function bulgedMidpoint(
  a: [number, number],
  b: [number, number],
): [number, number] {
  const midLng = (a[0] + b[0]) / 2;
  const midLat = (a[1] + b[1]) / 2;
  const scale = lngScaleAt(midLat);
  const dx = (b[0] - a[0]) * scale;
  const dy = b[1] - a[1];
  const length = Math.hypot(dx, dy);
  if (length === 0) return [midLng, midLat];
  const bulge = length * ARC_CURVATURE;
  return [midLng + ((-dy / length) * bulge) / scale, midLat + (dx / length) * bulge];
}

/**
 * One arc per consecutive pair rather than a single spline through every waypoint:
 * journeys that double back (Abraham returning to Bethel, Paul returning to Antioch)
 * make a whole-path spline loop over itself.
 */
export function buildJourneyArcs(
  waypoints: JourneyWaypoint[],
): GeoJSON.FeatureCollection<GeoJSON.LineString> {
  const features: GeoJSON.Feature<GeoJSON.LineString>[] = [];
  for (let i = 0; i < waypoints.length - 1; i += 1) {
    const from: [number, number] = [waypoints[i].lng, waypoints[i].lat];
    const to: [number, number] = [waypoints[i + 1].lng, waypoints[i + 1].lat];
    if (segmentLengthDegrees(from, to) < MIN_SEGMENT_DEGREES) continue;
    const arc = bezierSpline(lineString([from, bulgedMidpoint(from, to), to]), {
      sharpness: 0.85,
    });
    features.push({
      type: "Feature",
      geometry: arc.geometry,
      properties: { segmentIndex: i },
    });
  }
  return { type: "FeatureCollection", features };
}

/**
 * Waypoints at (nearly) the same place become one marker, so revisited sites and
 * adjacent landmarks do not stack invisible markers on top of each other.
 */
export function groupWaypoints(waypoints: JourneyWaypoint[]): WaypointGroup[] {
  const groups: WaypointGroup[] = [];
  waypoints.forEach((waypoint, index) => {
    const existing = groups.find(
      (group) =>
        segmentLengthDegrees([group.lng, group.lat], [waypoint.lng, waypoint.lat]) <
        GROUP_RADIUS_DEGREES,
    );
    if (existing) {
      existing.visits.push({ waypoint, index });
      return;
    }
    groups.push({
      key: waypoint.id,
      lng: waypoint.lng,
      lat: waypoint.lat,
      visits: [{ waypoint, index }],
    });
  });
  return groups;
}
