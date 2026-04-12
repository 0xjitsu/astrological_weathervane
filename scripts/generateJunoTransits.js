// scripts/generateJunoTransits.js
// Run with:  bun run generate:juno   OR   node scripts/generateJunoTransits.js

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { computeNatalChart } from "../src/utils/ephemeris.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const transitFile = path.join(__dirname, "../src/data/transitData.json");
const outputFile = transitFile;

// -----------------------------
// CONFIG
// -----------------------------
const START = new Date("2026-03-25T00:00:00Z");
const END = new Date("2026-06-24T00:00:00Z");
const bodies = [
  "Sun","Moon","Mercury","Venus","Mars",
  "Jupiter","Saturn","Uranus","Neptune","Pluto",
  "Chiron","Mean Lilith","North Node"
];
const aspects = [
  { name: "Conjunction", angle: 0 },
  { name: "Sextile",     angle: 60 },
  { name: "Square",      angle: 90 },
  { name: "Trine",       angle: 120 },
  { name: "Opposition",  angle: 180 },
];

// Utility: normalize degrees 0–360
function norm(d) { return ((d % 360) + 360) % 360; }

// Angular difference
function diff(a, b) {
  const d = Math.abs(norm(a - b));
  return d > 180 ? 360 - d : d;
}

// Compute longitudes for a given date using ephemeris.js
function getLongitudes(date) {
  const y = date.getUTCFullYear();
  const m = (date.getUTCMonth() + 1).toString().padStart(2,"0");
  const d = date.getUTCDate().toString().padStart(2,"0");

  const h = date.getUTCHours().toString().padStart(2,"0");
  const min = date.getUTCMinutes().toString().padStart(2,"0");

  const { planets } = computeNatalChart(`${y}-${m}-${d}`, `${h}:${min}`, 0);
  return planets;
}

console.log("\n🪐 Generating Juno transits...");
console.log("Date range:", START.toISOString(), "→", END.toISOString());

// -----------------------------
// 1. Read transitData.json
// -----------------------------
let raw = JSON.parse(fs.readFileSync(transitFile, "utf8"));

// -----------------------------
// 2. Replace True Node → North Node
// -----------------------------
raw.events.forEach(e => {
  if (e.body1 === "True Node") e.body1 = "North Node";
  if (e.body2 === "True Node") e.body2 = "North Node";
});

// -----------------------------
// 3. Generate South Node events
// -----------------------------
let southNodeEvents = [];

raw.events.forEach(e => {
  if (e.body2 === "North Node") {
    southNodeEvents.push({
      date: e.date,
      time: e.time || "",
      type: "Aspect",
      description: e.description.replace("North Node", "South Node")
                                 .replace("Conjunction", "Opposition"),
      body1: e.body1,
      body2: "South Node",
      aspect: "Opposition",
      orb: e.orb || "",
      highlight: false,
      glyph: e.glyph || "",
      position: e.position || "",
      sign: e.sign || ""
    });
  }
});

// -----------------------------
// 4. Compute Juno transits
// -----------------------------
let junoEvents = [];
let day = new Date(START);

while (day <= END) {
  const formatted = day.toISOString().split("T")[0];
  const lon = getLongitudes(day);

  const junoLon = lon["Juno"];   // from your ephemeris.js
  if (junoLon === undefined) {
    console.error("❌ Juno not computed. Check ephemeris.js junoLongitude().");
    process.exit(1);
  }

  for (const body of bodies) {
    const bodyLon = lon[body];
    if (bodyLon === undefined) continue;

    for (const asp of aspects) {
      const delta = diff(junoLon, bodyLon);
      const orb = Math.abs(delta - asp.angle);

      if (orb <= 1.0) {   // 1° orb
        junoEvents.push({
          date: formatted,
          time: "",
          type: "Aspect",
          description: `Juno ${asp.name} ${body}`,
          body1: "Juno",
          body2: body,
          aspect: asp.name,
          orb: orb.toFixed(2),
          highlight: false
        });
      }
    }
  }

  day.setUTCDate(day.getUTCDate() + 1);
}

console.log(`✓ Found ${junoEvents.length} Juno transit events.`);
console.log(`✓ Found ${southNodeEvents.length} South Node (mirrored) events.`);

// -----------------------------
// 5. Merge updates
// -----------------------------
raw.events = [
  ...raw.events,
  ...southNodeEvents,
  ...junoEvents
];

// -----------------------------
// 6. Write back to transitData.json
// -----------------------------
fs.writeFileSync(outputFile, JSON.stringify(raw, null, 2));
console.log(`\n✨ Done! transitData.json updated successfully.\n`);
