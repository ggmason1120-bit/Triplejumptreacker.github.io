/* ============================================================
   plan.js — ALL training data lives here.
   Edit this file to change exercises, sets, notes or dates.
   Day keys: 1=Mon 2=Tue 3=Wed 4=Thu 5=Fri 6=Sat 0=Sun
   ============================================================ */

const GOAL_FEET = 43; // default goal. You can change it on the Progress tab, no code needed.
const WINTER_START = "2026-11-20";

const ex = (n, d) => ({ n, d });

const WARM =
  "Warm-up (8–10 min): light jog or bike, leg swings, hip circles, bodyweight squats, glute bridges, then 2 lighter ramp-up sets before your first heavy lift.";
const REST = {
  title: "Rest Day",
  tag: "rest",
  ex: [],
  note: "Rest. Light stretching or an easy jog is fine. Homework and sleep come first.",
};
const ACCEL = ex("Accelerations (before lifting)", "4 × 20m from a standing start, full rest");
const CORE45 = ex("Core Circuit", "Plank 45 sec, Side Plank 30 sec each side, 3 rounds");

const PHASES = {
  p1: {
    name: "Phase 1: Build the Base",
    season: "winter",
    blurb: "Weeks 0–4. Main lifts 3 × 8–10. Rest 90 sec between sets.",
  },
  p2: {
    name: "Phase 2: Max Strength",
    season: "winter",
    blurb: "Weeks 5–8. Main lifts 4 × 5. Rest 2–3 min between sets.",
  },
  p3: {
    name: "Phase 3: Power",
    season: "winter",
    blurb: "Weeks 9–12. Move the bar FAST. Lower volume, higher quality.",
  },
  p4: {
    name: "Phase 4: Learn the Rhythm",
    season: "spring",
    blurb: "Weeks 13–16. Technique and drills. Target ratio about 35% hop, 30% step, 35% jump (roughly {hop} / {step} / {jump} ft for {goal}).",
  },
  p5: {
    name: "Phase 5: Full Approach",
    season: "spring",
    blurb: "Weeks 17–20. Full approach, phase ratios, elastic pop. Check your marks every week.",
  },
  p6: {
    name: "Phase 6: Peak & Taper",
    season: "spring",
    blurb: "Weeks 21–22. Quality over volume. Stay fresh. Move this block to match your real championship date.",
  },
};

/* ---------- WINTER LIFTS ---------- */
const LIFTS = {
  p1: {
    A: [
      ex("Back Squat", "3 × 8"),
      ex("Romanian Deadlift", "3 × 8"),
      ex("Split Squat (DB)", "3 × 8 per leg"),
      ex("Standing Calf Raise", "3 × 12"),
    ],
    B: [
      ex("Bench Press", "3 × 8"),
      ex("Lat Pulldown or Pull-Ups", "3 × 8"),
      ex("DB Shoulder Press", "3 × 10"),
      ex("Row (seated or bent-over)", "3 × 10"),
      ex("Face Pulls or Band Pull-Aparts", "2 × 15"),
    ],
    C: [
      ex("Trap Bar or Conventional Deadlift", "3 × 6"),
      ex("Step-Ups (knee-height box)", "3 × 8 per leg"),
      ex("Hamstring Curl or Assisted Nordic Curl", "3 × 8"),
      ex("Single-Leg Calf Raise", "3 × 12 per leg"),
    ],
    D: [
      ex("Incline DB Press", "3 × 10"),
      ex("Chin-Ups or Cable Row", "3 × 8"),
      ex("Hip Thrust", "3 × 10"),
      ex("Lateral Band Walks", "2 × 15 steps each way"),
      CORE45,
    ],
  },
  p2: {
    A: [
      ex("Back Squat", "4 × 5"),
      ex("Romanian Deadlift", "3 × 6"),
      ex("Bulgarian Split Squat", "3 × 6 per leg"),
      ex("Single-Leg Calf Raise", "3 × 10 per leg"),
    ],
    B: [
      ex("Bench Press", "4 × 5"),
      ex("Pull-Ups (add weight if easy)", "4 × 5"),
      ex("Push Press (light, fast)", "3 × 5"),
      ex("Barbell or DB Row", "3 × 8"),
    ],
    C: [
      ex("Trap Bar Deadlift", "4 × 4"),
      ex("Walking Lunge (DB)", "3 × 8 per leg"),
      ex("Hamstring Curl", "3 × 8"),
      ex("Toe Raise (shin protection)", "2 × 15"),
    ],
    D: [
      ex("Incline DB Press", "3 × 8"),
      ex("Cable or Band Row", "3 × 10"),
      ex("Heavy Hip Thrust", "3 × 6"),
      ex("Pallof Press", "3 × 10 per side"),
      ex("Hanging Leg Raise", "3 × 10"),
    ],
  },
  p3: {
    A: [
      ex("Back Squat (heavy but fast)", "4 × 3"),
      ex("Jump Squat (bodyweight or light)", "3 × 4"),
      ex("Single-Leg RDL", "3 × 6 per leg"),
    ],
    B: [
      ex("Bench Press", "3 × 4"),
      ex("Pull-Ups", "3 × 6"),
      ex("Med Ball Chest Pass or Push-Up Jumps", "3 × 5"),
    ],
    C: [
      ex("Hang or Power Clean (only if a coach taught you)", "4 × 3"),
      ex("No cleans? Kettlebell Swings or Trap Bar Jumps instead", "4 × 8 swings or 4 × 3 jumps"),
      ex("Explosive Step-Ups", "3 × 5 per leg"),
      ex("Hamstring Curl", "2 × 8"),
    ],
    D: [
      ex("DB Bench or Push-Ups", "3 × 8"),
      ex("Cable Row", "3 × 10"),
      ex("Hip Thrust", "3 × 5"),
      ex("Side Plank with Hip Dips", "3 × 12 per side"),
    ],
  },
};

/* ---------- WINTER WEDNESDAY: SPEED & JUMP MAINTENANCE ---------- */
const MAINT = {
  p1: [
    ex("Accelerations", "4 × 30m"),
    ex("Ankle Hops (Pogo Jumps)", "3 × 15 sec"),
    ex("Alternate-Leg Bounds", "3 × 20m"),
    ex("Broad Jumps", "3 × 4"),
  ],
  p2: [
    ex("Fly 40s", "4 reps, full rest between"),
    ex("Ankle Hops (Pogo Jumps)", "3 × 20 sec"),
    ex("Alternate-Leg Bounds", "4 × 30m"),
    ex("Single-Leg Box Jumps", "3 × 4 per leg"),
  ],
  p3: [
    ex("Fly 40s", "4 reps, full rest between"),
    ex("Single-Leg Bounds", "3 × 20m per leg"),
    ex("Depth Drops (step off, land soft)", "3 × 4"),
    ex("Continuous Broad Jumps", "3 × 5"),
  ],
};

/* Winter: NO practice on Mondays. Practice + weight room Tue–Fri (4 days). */
function winterWeek(lifts, maint, extraNote) {
  const off = {
    ...REST,
    title: "No Practice (Rest)",
    note: "No practice on Mondays. Rest, catch up on homework and sleep. Easy stretching is fine.",
  };
  const active = { ...REST, title: "Active Rest" };
  return {
    1: off,
    2: {
      title: "Speed & Jumps, then Lift B: Upper Body",
      tag: "lift",
      note:
        "Do the speed and jump work FIRST while your legs are fresh (warm up 10 min: A-skips, leg swings, ankle mobility, keep it short and snappy), then lift. " +
        WARM +
        (extraNote ? " " + extraNote : ""),
      ex: [...maint.map((e) => ex("Track: " + e.n, e.d)), ...lifts.B],
    },
    3: { title: "Lift A: Lower Body (Squat)", tag: "lift", note: WARM, ex: lifts.A },
    4: { title: "Lift D: Upper, Hips & Core", tag: "lift", note: WARM + " Legs stay light today.", ex: [ACCEL, ...lifts.D] },
    5: {
      title: "Lift C: Lower Body (Hinge & Single-Leg)",
      tag: "lift",
      note: WARM + " Keep it moderate. If you have a meet Saturday, go light.",
      ex: lifts.C,
    },
    6: active,
    0: active,
  };
}

/* ---------- SPRING WEEKS ---------- */
const jumpDay = (extra) => ({
  title: "Meet / Jump Day",
  tag: "meet",
  note: "Meet day or light technique day.",
  ex: [
    ex("If you have a meet", "Warm up like you practiced, take 2–3 warm-up approaches, trust the training"),
    ex("If no meet: light technique", "4 approach runs + 3 short-approach jumps"),
    ...(extra || []),
  ],
});

const SPRING = {
  p4: {
    1: {
      title: "Technique Day 1: Approach & Takeoff",
      tag: "track",
      note: "Check your marks before you start.",
      ex: [
        ex("Warm-Up", "10–15 min: A-skips, leg swings, ankle mobility, 3 × 40m build-ups"),
        ex("Approach Runs (no jump)", "6 × full approach, hit the board. Focus on rhythm, tall posture, speed"),
        ex("Short Approach Hops", "6 × 4–6 step approach, hop and land on one foot in the pit"),
        ex("Board Takeoff Drill", "4 × 6-step approach, take off and pop UP (not forward), land on the same foot"),
      ],
    },
    2: {
      title: "Short Lift (about 40 min)",
      tag: "lift",
      note: WARM,
      ex: [
        ex("Back Squat", "3 × 5"),
        ex("Bench Press", "3 × 5"),
        ex("Romanian Deadlift", "3 × 6"),
        ex("Pull-Ups", "3 × 6"),
        ex("Core", "Plank 60 sec, Side Plank 45 sec each side"),
      ],
    },
    3: {
      title: "Speed & Plyo Drills",
      tag: "track",
      note: "Grass or turf when possible.",
      ex: [
        ex("Fly 30s", "4 reps, full rest"),
        ex("Ankle Hops (Pogo Jumps)", "3 × 20 sec"),
        ex("Alternate-Leg Bounds", "4 × 30m, focus on rhythm"),
        ex("Double-Left / Double-Right Bounds", "3 × 30m (L-L-R-R)"),
      ],
    },
    4: {
      title: "Technique Day 2: Phase Drills in the Pit",
      tag: "track",
      note: "Measure and log your jumps in the Progress tab.",
      ex: [
        ex("Hop-Step Drill", "6 × short approach, hop then step, land on a flat foot in the pit"),
        ex("Hop-Hop-Step Drill", "4 × 30m, build a strong landing from the hop"),
        ex("Single-Leg Bounding Over Cones", "3 × 20m per leg"),
        ex("Short-Approach Full Triple Jump", "6 × 8-stride approach (rhythm over distance)"),
      ],
    },
    5: {
      title: "Light Lift (about 30 min) or Rest",
      tag: "lift",
      note: "Keep it easy. Skip it if you feel run down.",
      ex: [
        ex("Step-Ups", "3 × 6 per leg"),
        ex("Hip Thrust", "3 × 8"),
        ex("Calf Raise", "3 × 12"),
        ex("Core Circuit", "2 rounds"),
      ],
    },
    6: jumpDay(),
    0: { ...REST },
  },
  p5: {
    1: {
      title: "Full Approach Technique",
      tag: "track",
      note: "Take full rest between jumps. Quality over quantity.",
      ex: [
        ex("Warm-Up", "15 min"),
        ex("Full Approach (hop and step only)", "6 reps, active landings"),
        ex("Full Triple Jumps", "6 reps, full approach, rest 2–3 min between jumps"),
        ex("Video 3 jumps", "Check: tall chest at takeoff, hop height, arm drive"),
      ],
    },
    2: {
      title: "Short Lift (maintain strength)",
      tag: "lift",
      note: WARM,
      ex: [
        ex("Back Squat (heavy but fast)", "3 × 3"),
        ex("Bench Press", "3 × 4"),
        ex("Trap Bar Jumps or Jump Squats", "3 × 4"),
        ex("Pull-Ups", "3 × 5"),
        ex("Plank with Shoulder Taps", "3 × 20 taps"),
      ],
    },
    3: {
      title: "Speed & Elastic Pop",
      tag: "track",
      note: "Grass or turf when possible.",
      ex: [
        ex("Fly 40s", "4 reps, full rest"),
        ex("Single-Leg Bounds", "3 × 20m per leg"),
        ex("Hop-Hop-Jump Drill", "3 × 30m"),
        ex("Depth Jumps", "3 × 4"),
      ],
    },
    4: {
      title: "Phase Ratio Day",
      tag: "track",
      note: "Log your hop / step / jump distances.",
      ex: [
        ex("Cone Markers", "Place cones near {hop} ft (hop landing) and {hopstep} ft (step landing)"),
        ex("Full Approach Jumps", "6 reps, try to hit your phase marks"),
        ex("Single-Leg Depth Drops", "3 × 4 per leg (soft landing, knee tracks over toes)"),
      ],
    },
    5: {
      title: "Light / Pre-Meet Day",
      tag: "track",
      note: "Stay fresh. Optional short lift: step-ups, hip thrust, core.",
      ex: [
        ex("Easy Warm-Up", "10 min"),
        ex("Build-Ups", "3 × 50m"),
        ex("Approach Runs", "A few, hit your marks"),
      ],
    },
    6: jumpDay(),
    0: { ...REST },
  },
  p6: {
    1: {
      title: "Sharp Approach",
      tag: "track",
      note: "Quality over volume.",
      ex: [
        ex("Warm-Up", "15 min"),
        ex("Full Approach Jumps", "4 reps, rest 3 min between"),
      ],
    },
    2: {
      title: "Very Light Lift or Rest",
      tag: "lift",
      note: "Skip if tired.",
      ex: [
        ex("Squat (light and fast)", "2 × 3"),
        ex("Bench Press", "2 × 4"),
        ex("Core", "2 rounds"),
      ],
    },
    3: {
      title: "Short Speed (30 min)",
      tag: "track",
      note: "Done in 30 minutes. Feel fast.",
      ex: [
        ex("Accelerations", "3 × 30m"),
        ex("Bounds", "3 × 20m"),
        ex("Ankle Hops", "2 × 15 sec"),
      ],
    },
    4: {
      title: "Open-Up Day",
      tag: "track",
      note: "Go home early. Rest.",
      ex: [
        ex("Approach Runs", "A few, hit your marks"),
        ex("Short Jumps", "2"),
      ],
    },
    5: { ...REST, title: "Rest Day" },
    6: {
      title: "Competition Day",
      tag: "meet",
      note: "Trust your training.",
      ex: [
        ex("Warm Up", "Same routine you practiced"),
        ex("Warm-Up Approaches", "2–3"),
        ex("Compete", "Log your best jump in the Progress tab"),
      ],
    },
    0: { ...REST },
  },
};

const DAYS = {
  p1: winterWeek(LIFTS.p1, MAINT.p1),
  p2: winterWeek(LIFTS.p2, MAINT.p2),
  p3: winterWeek(LIFTS.p3, MAINT.p3),
  p4: SPRING.p4,
  p5: SPRING.p5,
  p6: SPRING.p6,
};

/* ---------- WEEKS & DATES ---------- */
const addDays = (iso, n) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d + n);
};

const WEEKS = [];
// Week 0 is a short week: it starts on Friday, Nov 20 (season opener) and runs Fri–Sun.
// "order" = which weekdays it shows, "len" = number of calendar days.
WEEKS.push({
  id: "w0",
  label: "Week 0",
  short: "W0",
  phase: "p1",
  start: addDays("2026-11-20", 0),
  order: [5, 6, 0],
  len: 3,
});
for (let n = 1; n <= 22; n++) {
  const phase = n <= 4 ? "p1" : n <= 8 ? "p2" : n <= 12 ? "p3" : n <= 16 ? "p4" : n <= 20 ? "p5" : "p6";
  WEEKS.push({
    id: "w" + n,
    label: "Week " + n,
    short: "W" + n,
    phase,
    start: addDays("2026-11-23", 7 * (n - 1)),
  });
}

const WEEK_NOTES = {
  w0: "Season opener! Friday, Nov 20 is your first practice. Start light and learn the lifts. Week 1 starts Monday, Nov 23.",
  w1: "Winter schedule: practice and weight room Tuesday through Friday. Monday is off.",
  w5: "Holiday week. If you miss a day, skip it. Do not double up.",
  w6: "Holiday week. If you miss a day, skip it. Do not double up.",
  w12: "DELOAD WEEK: cut sets in half so you are fresh for your biggest meets.",
  w21: "Taper begins. Less volume, same sharpness.",
  w22: "Peak week. Prioritize sleep and trust your training.",
};

function dayFor(week, dow) {
  return DAYS[week.phase][dow];
}
