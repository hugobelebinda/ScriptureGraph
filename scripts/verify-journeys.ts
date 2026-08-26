/**
 * Sanity check for the Journey Visualizer data and geometry.
 * Run with: npx tsx scripts/verify-journeys.ts
 */
import { JOURNEYS } from "../Frontend/src/data/journeysData";
import {
  buildJourneyArcs,
  groupWaypoints,
  segmentLengthDegrees,
} from "../Frontend/src/lib/journeyGeometry";

let failures = 0;

function check(condition: boolean, message: string): void {
  if (!condition) {
    failures += 1;
    console.error(`  FAIL ${message}`);
  }
}

const seenJourneyIds = new Set<string>();
const seenWaypointIds = new Set<string>();

for (const journey of JOURNEYS) {
  console.log(`\n${journey.titleEn}  [${journey.era}]`);

  check(!seenJourneyIds.has(journey.id), `duplicate journey id ${journey.id}`);
  seenJourneyIds.add(journey.id);

  for (const waypoint of journey.waypoints) {
    check(
      !seenWaypointIds.has(waypoint.id),
      `duplicate waypoint id ${waypoint.id}`,
    );
    seenWaypointIds.add(waypoint.id);
    check(
      waypoint.lat >= -90 && waypoint.lat <= 90,
      `${waypoint.id} latitude out of range`,
    );
    check(
      waypoint.lng >= -180 && waypoint.lng <= 180,
      `${waypoint.id} longitude out of range`,
    );
    check(waypoint.nameFr.length > 0, `${waypoint.id} missing French name`);
    check(
      waypoint.descriptionFr.length > 0,
      `${waypoint.id} missing French description`,
    );
    check(waypoint.refs.length > 0, `${waypoint.id} has no scripture references`);
    for (const ref of waypoint.refs) {
      check(
        /^\d?[A-Z]{2,3}$/.test(ref.usfm),
        `${waypoint.id} suspicious usfm "${ref.usfm}"`,
      );
      check(
        /^\d+:\d+(-\d+(:\d+)?)?$/.test(ref.ref),
        `${waypoint.id} suspicious range "${ref.ref}"`,
      );
    }
  }

  const arcs = buildJourneyArcs(journey.waypoints);
  const groups = groupWaypoints(journey.waypoints);

  // Every arc must begin and end exactly on its waypoints.
  for (const feature of arcs.features) {
    const index = feature.properties?.segmentIndex as number;
    const coords = feature.geometry.coordinates;
    const from = journey.waypoints[index];
    const to = journey.waypoints[index + 1];
    const startGap = segmentLengthDegrees(
      [coords[0][0], coords[0][1]],
      [from.lng, from.lat],
    );
    const endGap = segmentLengthDegrees(
      [coords[coords.length - 1][0], coords[coords.length - 1][1]],
      [to.lng, to.lat],
    );
    check(startGap < 1e-6, `segment ${index} does not start on ${from.id} (${startGap})`);
    check(endGap < 1e-6, `segment ${index} does not end on ${to.id} (${endGap})`);
    check(coords.length > 20, `segment ${index} only has ${coords.length} points`);
    check(
      coords.every(([lng, lat]) => Number.isFinite(lng) && Number.isFinite(lat)),
      `segment ${index} contains non-finite coordinates`,
    );
  }

  const skipped = journey.waypoints.length - 1 - arcs.features.length;
  const merged = groups.filter((group) => group.visits.length > 1);

  console.log(
    `  ${journey.waypoints.length} stops, ${arcs.features.length} arcs (${skipped} skipped), ${groups.length} markers`,
  );
  for (const group of merged) {
    console.log(
      `  merged marker: ${group.visits.map((v) => `#${v.index + 1} ${v.waypoint.nameEn}`).join(" + ")}`,
    );
  }

  // Bounding box the camera will frame.
  const lngs = journey.waypoints.map((w) => w.lng);
  const lats = journey.waypoints.map((w) => w.lat);
  console.log(
    `  bbox lng ${Math.min(...lngs).toFixed(2)}..${Math.max(...lngs).toFixed(2)}  lat ${Math.min(...lats).toFixed(2)}..${Math.max(...lats).toFixed(2)}`,
  );

  // Closest pair of distinct markers, to spot clusters that will overlap on screen.
  let closest = { a: "", b: "", degrees: Infinity };
  for (let i = 0; i < groups.length; i += 1) {
    for (let j = i + 1; j < groups.length; j += 1) {
      const degrees = segmentLengthDegrees(
        [groups[i].lng, groups[i].lat],
        [groups[j].lng, groups[j].lat],
      );
      if (degrees < closest.degrees) {
        closest = {
          a: groups[i].visits[0].waypoint.nameEn,
          b: groups[j].visits[0].waypoint.nameEn,
          degrees,
        };
      }
    }
  }
  if (Number.isFinite(closest.degrees)) {
    console.log(
      `  closest markers: ${closest.a} <-> ${closest.b} = ${(closest.degrees * 111).toFixed(2)} km`,
    );
  }
}

console.log(
  `\n${JOURNEYS.length} journeys, ${seenWaypointIds.size} waypoints, ${failures} failure(s)`,
);
process.exit(failures === 0 ? 0 : 1);
