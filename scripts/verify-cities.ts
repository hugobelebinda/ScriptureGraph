/**
 * Sanity check for the Cities page dataset.
 * Run with: npx tsx scripts/verify-cities.ts
 */
import {
  CITIES,
  CITY_PERIODS,
  CITY_REGIONS,
  EVENT_BUDGET,
  type CityPeriod,
  type CityRegion,
} from "../Frontend/src/data/citiesData";

let failures = 0;

function check(condition: boolean, message: string): void {
  if (!condition) {
    failures += 1;
    console.error(`  FAIL ${message}`);
  }
}

const seenCityIds = new Set<string>();
const seenEventIds = new Set<string>();
const validPeriods = new Set<CityPeriod>(CITY_PERIODS);
const validRegions = new Set<CityRegion>(CITY_REGIONS);

console.log(`${CITIES.length} cities`);

for (const city of CITIES) {
  console.log(`\n${city.nameEn}  [${city.tier} / ${city.region}]`);

  check(!seenCityIds.has(city.id), `duplicate city id ${city.id}`);
  seenCityIds.add(city.id);
  check(city.lat >= -90 && city.lat <= 90, `${city.id} latitude out of range`);
  check(city.lng >= -180 && city.lng <= 180, `${city.id} longitude out of range`);
  check(city.nameFr.length > 0, `${city.id} missing French name`);
  check(city.blurbEn.length > 0, `${city.id} missing English blurb`);
  check(city.blurbFr.length > 0, `${city.id} missing French blurb`);
  check(validRegions.has(city.region), `${city.id} unknown region ${city.region}`);

  const budget = EVENT_BUDGET[city.tier];
  check(
    city.events.length >= budget.min,
    `${city.id} has ${city.events.length} events, below ${city.tier} min ${budget.min}`,
  );
  check(
    city.events.length <= budget.max,
    `${city.id} has ${city.events.length} events, above ${city.tier} max ${budget.max}`,
  );
  check(
    city.events.length < budget.max || Boolean(city.curated),
    `${city.id} sits at its ${city.tier} cap without being marked curated`,
  );

  if (city.source) {
    check(city.source.slug.length > 0, `${city.id} source missing slug`);
    check(
      city.source.confidence >= 0 && city.source.confidence <= 1000,
      `${city.id} source confidence out of range`,
    );
  }

  let headlines = 0;
  for (const event of city.events) {
    check(!seenEventIds.has(event.id), `duplicate event id ${event.id}`);
    seenEventIds.add(event.id);
    check(event.id.startsWith(`${city.id}-`), `${event.id} does not start with ${city.id}-`);
    check(validPeriods.has(event.period), `${event.id} unknown period ${event.period}`);
    check(event.labelEn.length > 0, `${event.id} missing English label`);
    check(event.labelFr.length > 0, `${event.id} missing French label`);
    check(event.refs.length > 0, `${event.id} has no scripture references`);

    if (event.weight === "headline") {
      headlines += 1;
      check(Boolean(event.descriptionEn), `${event.id} headline missing English prose`);
      check(Boolean(event.descriptionFr), `${event.id} headline missing French prose`);
    } else {
      check(!event.descriptionEn && !event.descriptionFr, `${event.id} non-headline has prose`);
    }

    for (const ref of event.refs) {
      check(/^\d?[A-Z]{2,3}$/.test(ref.usfm), `${event.id} suspicious usfm "${ref.usfm}"`);
      check(
        /^\d+:\d+(-\d+(:\d+)?)?$/.test(ref.ref),
        `${event.id} suspicious range "${ref.ref}"`,
      );
    }
  }

  check(headlines > 0, `${city.id} has no headline events`);
  console.log(
    `  ${city.events.length} events, ${headlines} headline, curated=${Boolean(city.curated)}`,
  );
}

console.log(`\n${CITIES.length} cities, ${seenEventIds.size} events, ${failures} failure(s)`);
process.exit(failures === 0 ? 0 : 1);
