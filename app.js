'use strict';

/* ---------- constants ---------- */

const KEY = 'ppl-overload-v1';
const DAYS = ['push', 'pull', 'legs'];
const DAY_LABEL = { push: 'Push', pull: 'Pull', legs: 'Legs' };
const DAY_FOCUS = { push: 'Chest, shoulders, triceps', pull: 'Back, rear delts, biceps', legs: 'Quads, hamstrings, calves' };
const UNIT = 'kg';
const DAY_MS = 864e5;

// [day, name, sets, reps, AMRAP target to move up, increment kg, rest s, kind, in default template, alternative to]
// kind: 'main' = recommended big lift, 'compound', 'iso'. Rest: 3 min for main lifts, 2–2.5 compounds, 1.5 isolation.
const CATALOGUE = [
  ['push', 'Barbell Bench Press', 3, 8, 12, 2.5, 180, 'main', 1],
  ['push', 'Overhead Press', 3, 8, 12, 2.5, 180, 'compound', 1],
  ['push', 'Incline Dumbbell Press', 3, 10, 15, 2, 150, 'compound', 1],
  ['push', 'Lateral Raise', 3, 12, 20, 1, 90, 'iso', 1],
  ['push', 'Triceps Pushdown (cable)', 3, 12, 18, 2.5, 90, 'iso', 1],
  ['push', 'Overhead Triceps Extension', 3, 12, 18, 2.5, 90, 'iso', 0, 'Triceps Pushdown (cable)'],
  ['push', 'Pec Deck', 3, 12, 18, 5, 90, 'iso', 1],
  ['push', 'Dumbbell Fly', 3, 12, 18, 2, 90, 'iso', 0, 'Pec Deck'],
  ['push', 'Machine Chest Press', 3, 10, 15, 5, 120, 'compound', 0],
  ['push', 'Dips (added weight)', 3, 8, 12, 2.5, 150, 'compound', 0],
  ['push', 'Dumbbell Bench Press', 3, 8, 12, 2, 150, 'compound', 0],
  ['push', 'Incline Barbell Bench Press', 3, 8, 12, 2.5, 150, 'compound', 0],
  ['push', 'Close-Grip Bench Press', 3, 8, 12, 2.5, 150, 'compound', 0],
  ['push', 'Seated Dumbbell Shoulder Press', 3, 10, 15, 2, 150, 'compound', 0],
  ['push', 'Machine Shoulder Press', 3, 10, 15, 5, 120, 'compound', 0],
  ['push', 'Cable Lateral Raise', 3, 12, 20, 1.25, 90, 'iso', 0],
  ['push', 'Cable Crossover', 3, 12, 18, 2.5, 90, 'iso', 0],
  ['push', 'Skull Crusher', 3, 10, 15, 2.5, 90, 'iso', 0],
  ['push', 'Triceps Rope Pushdown', 3, 12, 18, 2.5, 90, 'iso', 0],
  ['pull', 'Deadlift', 3, 5, 8, 5, 180, 'main', 1],
  ['pull', 'Lat Pulldown', 3, 10, 15, 2.5, 120, 'compound', 1],
  ['pull', 'Pull-up (added weight)', 3, 6, 10, 2.5, 150, 'compound', 0, 'Lat Pulldown'],
  ['pull', 'Seated Cable Row', 3, 10, 15, 2.5, 120, 'compound', 1],
  ['pull', 'Reverse Fly', 3, 15, 20, 2.5, 90, 'iso', 1],
  ['pull', 'Barbell Curl', 3, 10, 15, 2.5, 90, 'iso', 1],
  ['pull', 'Preacher Curl', 3, 10, 15, 2.5, 90, 'iso', 0, 'Barbell Curl'],
  ['pull', 'Barbell Row', 3, 8, 12, 2.5, 150, 'compound', 0],
  ['pull', 'Face Pull', 3, 15, 20, 2.5, 90, 'iso', 0],
  ['pull', 'Hammer Curl', 3, 10, 15, 2, 90, 'iso', 0],
  ['pull', 'Trap Bar Deadlift', 3, 5, 8, 5, 180, 'compound', 0, 'Deadlift'],
  ['pull', 'Chin-up (added weight)', 3, 6, 10, 2.5, 150, 'compound', 0],
  ['pull', 'One-Arm Dumbbell Row', 3, 10, 15, 2, 120, 'compound', 0],
  ['pull', 'Chest-Supported Row', 3, 10, 15, 2.5, 120, 'compound', 0],
  ['pull', 'T-Bar Row', 3, 8, 12, 2.5, 150, 'compound', 0],
  ['pull', 'Close-Grip Lat Pulldown', 3, 10, 15, 2.5, 120, 'compound', 0],
  ['pull', 'Straight-Arm Pulldown', 3, 12, 18, 2.5, 90, 'iso', 0],
  ['pull', 'Rear Delt Cable Fly', 3, 15, 20, 1.25, 90, 'iso', 0, 'Reverse Fly'],
  ['pull', 'Dumbbell Shrug', 3, 12, 18, 2, 90, 'iso', 0],
  ['pull', 'Incline Dumbbell Curl', 3, 10, 15, 1, 90, 'iso', 0],
  ['pull', 'Cable Curl', 3, 12, 18, 2.5, 90, 'iso', 0],
  ['legs', 'Back Squat', 3, 8, 12, 5, 180, 'main', 1],
  ['legs', 'Leg Press', 3, 10, 15, 10, 150, 'compound', 1],
  ['legs', 'Leg Curl', 3, 12, 16, 5, 90, 'iso', 1],
  ['legs', 'Leg Extension', 3, 12, 16, 5, 90, 'iso', 1],
  ['legs', 'Standing Calf Raise', 3, 12, 20, 5, 90, 'iso', 1],
  ['legs', 'Hip Adduction', 3, 12, 18, 5, 90, 'iso', 1],
  ['legs', 'Hip Abduction', 3, 12, 18, 5, 90, 'iso', 1],
  ['legs', 'Romanian Deadlift', 3, 8, 12, 5, 150, 'compound', 0],
  ['legs', 'Hack Squat', 3, 10, 15, 5, 150, 'compound', 0],
  ['legs', 'Bulgarian Split Squat', 3, 10, 15, 2, 120, 'compound', 0],
  ['legs', 'Front Squat', 3, 6, 10, 2.5, 180, 'compound', 0],
  ['legs', 'Goblet Squat', 3, 10, 15, 2, 120, 'compound', 0],
  ['legs', 'Smith Machine Squat', 3, 8, 12, 5, 150, 'compound', 0],
  ['legs', 'Hip Thrust', 3, 10, 15, 5, 120, 'compound', 0],
  ['legs', 'Walking Lunge', 3, 10, 15, 2, 120, 'compound', 0],
  ['legs', 'Stiff-Leg Deadlift', 3, 8, 12, 5, 150, 'compound', 0],
  ['legs', 'Seated Leg Curl', 3, 12, 16, 5, 90, 'iso', 0, 'Leg Curl'],
  ['legs', 'Seated Calf Raise', 3, 12, 20, 5, 90, 'iso', 0, 'Standing Calf Raise'],
  ['legs', 'Leg Press Calf Raise', 3, 15, 20, 10, 90, 'iso', 0, 'Standing Calf Raise'],
];

const MUSCLES = {
  chest: 'Chest', frontDelts: 'Front delts', sideDelts: 'Side delts', rearDelts: 'Rear delts', triceps: 'Triceps',
  biceps: 'Biceps', lats: 'Lats', upperBack: 'Upper back & traps', lowerBack: 'Lower back', quads: 'Quads',
  hamstrings: 'Hamstrings', glutes: 'Glutes', adductors: 'Adductors', abductors: 'Abductors', calves: 'Calves',
};

// Primary muscles count a full set, secondary ones half a set (the usual convention for weekly set counts).
const P = (p, s = []) => ({ p, s });
const PRESS = P(['chest'], ['frontDelts', 'triceps']);
const ROW = P(['upperBack', 'lats'], ['biceps', 'rearDelts']);
const PULLDOWN = P(['lats'], ['biceps', 'upperBack']);
const SQUAT = P(['quads', 'glutes'], ['adductors', 'lowerBack']);
const HINGE = P(['hamstrings', 'glutes'], ['lowerBack']);
const MUSCLE_MAP = {
  'Barbell Bench Press': PRESS, 'Incline Dumbbell Press': PRESS, 'Machine Chest Press': PRESS, 'Dumbbell Bench Press': PRESS,
  'Incline Barbell Bench Press': PRESS, 'Dips (added weight)': P(['chest', 'triceps'], ['frontDelts']),
  'Close-Grip Bench Press': P(['triceps', 'chest'], ['frontDelts']),
  'Overhead Press': P(['frontDelts'], ['sideDelts', 'triceps']), 'Seated Dumbbell Shoulder Press': P(['frontDelts'], ['sideDelts', 'triceps']),
  'Machine Shoulder Press': P(['frontDelts'], ['sideDelts', 'triceps']),
  'Lateral Raise': P(['sideDelts']), 'Cable Lateral Raise': P(['sideDelts']),
  'Triceps Pushdown (cable)': P(['triceps']), 'Overhead Triceps Extension': P(['triceps']), 'Skull Crusher': P(['triceps']), 'Triceps Rope Pushdown': P(['triceps']),
  'Pec Deck': P(['chest']), 'Dumbbell Fly': P(['chest']), 'Cable Crossover': P(['chest']),
  'Deadlift': P(['hamstrings', 'glutes', 'lowerBack'], ['quads', 'upperBack']), 'Trap Bar Deadlift': P(['quads', 'glutes'], ['hamstrings', 'lowerBack', 'upperBack']),
  'Lat Pulldown': PULLDOWN, 'Pull-up (added weight)': PULLDOWN, 'Close-Grip Lat Pulldown': PULLDOWN, 'Chin-up (added weight)': P(['lats', 'biceps'], ['upperBack']),
  'Straight-Arm Pulldown': P(['lats']),
  'Seated Cable Row': ROW, 'One-Arm Dumbbell Row': ROW, 'Chest-Supported Row': ROW, 'T-Bar Row': ROW, 'Barbell Row': P(['upperBack', 'lats'], ['biceps', 'rearDelts', 'lowerBack']),
  'Reverse Fly': P(['rearDelts'], ['upperBack']), 'Rear Delt Cable Fly': P(['rearDelts'], ['upperBack']), 'Face Pull': P(['rearDelts'], ['upperBack']),
  'Dumbbell Shrug': P(['upperBack']),
  'Barbell Curl': P(['biceps']), 'Preacher Curl': P(['biceps']), 'Hammer Curl': P(['biceps']), 'Incline Dumbbell Curl': P(['biceps']), 'Cable Curl': P(['biceps']),
  'Back Squat': SQUAT, 'Front Squat': SQUAT, 'Hack Squat': SQUAT, 'Smith Machine Squat': SQUAT, 'Goblet Squat': SQUAT,
  'Leg Press': P(['quads'], ['glutes', 'adductors']), 'Leg Extension': P(['quads']),
  'Bulgarian Split Squat': P(['quads', 'glutes'], ['adductors']), 'Walking Lunge': P(['quads', 'glutes'], ['adductors']),
  'Romanian Deadlift': HINGE, 'Stiff-Leg Deadlift': HINGE, 'Hip Thrust': P(['glutes'], ['hamstrings']),
  'Leg Curl': P(['hamstrings']), 'Seated Leg Curl': P(['hamstrings']),
  'Standing Calf Raise': P(['calves']), 'Seated Calf Raise': P(['calves']), 'Leg Press Calf Raise': P(['calves']),
  'Hip Adduction': P(['adductors']), 'Hip Abduction': P(['abductors']),
};

const fromCatalogue = ([day, name, sets, reps, target, inc, rest, kind, inPlan, alt]) =>
  newExercise({ day, name, sets, reps, target, inc, rest, kind, inPlan: !!inPlan, alt });

const ICON = {
  check: '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  up: '<svg viewBox="0 0 24 24"><path d="M12 19V5M6 11l6-6 6 6"/></svg>',
  down: '<svg viewBox="0 0 24 24"><path d="M12 5v14M6 13l6 6 6-6"/></svg>',
  hold: '<svg viewBox="0 0 24 24"><path d="M6 9h12M6 15h12"/></svg>',
  skip: '<svg viewBox="0 0 24 24"><path d="M7 12h10"/></svg>',
  chev: '<svg class="chev" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>',
  mvUp: '<svg viewBox="0 0 24 24"><path d="M6 15l6-6 6 6"/></svg>',
  mvDown: '<svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>',
  trophy: '<svg viewBox="0 0 24 24"><path d="M8 4h8v5a4 4 0 0 1-8 0V4zM8 6H5v1a3 3 0 0 0 3 3M16 6h3v1a3 3 0 0 1-3 3M12 13v4M8 20h8"/></svg>',
  more: '<svg viewBox="0 0 24 24"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg>',
};

/* ---------- helpers ---------- */

const $ = (s, r = document) => r.querySelector(s);
const uid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);
const r2 = n => Math.round(n * 100) / 100;
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = n => (Math.round(n * 100) / 100).toLocaleString(undefined, { maximumFractionDigits: 2 });
const kg = n => `${fmt(n || 0)} ${UNIT}`;
const dShort = d => new Date(d).toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
const dLong = d => new Date(d).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });
const mmss = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
const byId = id => state.exercises.find(e => e.id === id);
const epley = (w, reps) => w * (1 + reps / 30);

/* ---------- progression ----------
 * Rep-scaled (default), modelled on APRE (Mann et al. 2010): the AMRAP result sets next session's load.
 *   reps >= target       → up. New weight is the one Epley predicts you'd hit for the middle of the
 *                          reps..target range, rounded down to the increment, at least one increment.
 *   reps..target-1       → hold (counts towards the stall deload).
 *   fewer than reps      → too heavy. Drop to the weight Epley predicts for the prescribed reps.
 * Rep-max equations lose accuracy at high reps (Reynolds et al. 2006), so reps past the cap aren't counted;
 * the next test corrects any remaining gap.
 */
const EST_REP_CAP = 15;
const repCap = en => Math.max(EST_REP_CAP, en.target + 3);
const weightFor = (w, reps, n, cap) => w * (1 + Math.min(reps, cap) / 30) / (1 + n / 30);

function progression(en, reps) {
  const w = en.weight, step = en.inc || 0.5;
  const scaled = state.settings.progression !== 'fixed';
  if (reps >= en.target) {
    if (!scaled) return { status: 'up', to: r2(w + step) };
    const goal = Math.round((en.reps + en.target) / 2);
    const jump = Math.floor((weightFor(w, reps, goal, repCap(en)) - w) / step + 1e-9) * step;
    return { status: 'up', to: r2(w + Math.max(step, jump)) };
  }
  if (scaled && reps < en.reps) {
    const drop = Math.round((w - weightFor(w, reps, en.reps, repCap(en))) / step) * step;
    return { status: 'down', to: r2(Math.max(0, w - Math.max(step, drop))) };
  }
  return { status: 'hold', to: w };
}

// Rep counts at or above target grouped by the weight they lead to, e.g. 12–13 → 62.5, 14 → 65, 15+ → 67.5.
function ladder(en) {
  const out = [];
  for (let r = en.target; r <= repCap(en); r++) {
    const to = progression(en, r).to, last = out[out.length - 1];
    if (last && last.to === to) last.hi = r; else out.push({ lo: r, hi: r, to });
  }
  const trimmed = out.length > 4 ? [...out.slice(0, 3), out[out.length - 1]] : out;
  return trimmed.map((s, i) => `${i === trimmed.length - 1 ? `${s.lo}+` : s.lo === s.hi ? s.lo : `${s.lo}–${s.hi}`} → <b>${fmt(s.to)}</b>`).join(' · ');
}

function weekStart(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  x.setDate(x.getDate() - ((x.getDay() + 6) % 7));
  return x;
}

function relDays(d) {
  const a = new Date(); a.setHours(0, 0, 0, 0);
  const b = new Date(d); b.setHours(0, 0, 0, 0);
  const n = Math.round((a - b) / DAY_MS);
  return n <= 0 ? 'Today' : n === 1 ? 'Yesterday' : `${n} days ago`;
}

function sessionVolume(s) {
  return Math.round(s.entries.reduce((t, en) => t + en.sets.reduce((u, st) => u + (st.done ? (Number(st.reps) || 0) * en.weight : 0), 0), 0));
}

const musclesOf = (exId, name) => byId(exId)?.muscles || MUSCLE_MAP[byId(exId)?.name || name] || null;

// The most recent logged entry for an exercise, optionally only from sessions before `before`.
function lastEntry(exId, before = Infinity) {
  for (let i = state.sessions.length - 1; i >= 0; i--) {
    const s = state.sessions[i];
    if (new Date(s.date).getTime() >= before) continue;
    const en = s.entries.find(x => x.exId === exId && x.sets.some(st => st.done));
    if (en) return { date: s.date, en };
  }
  return null;
}

// Best estimated max, heaviest weight and most reps at each weight, from the given sessions.
function bestsFor(exId, sessions) {
  const b = { e1rm: 0, heavy: 0, heavyReps: 0, sets: [] };
  for (const s of sessions) {
    for (const en of s.entries) {
      if (en.exId !== exId) continue;
      for (const st of en.sets) {
        if (!st.done || !(st.reps > 0)) continue;
        if (st.reps <= 20) b.e1rm = Math.max(b.e1rm, epley(en.weight, st.reps));
        if (en.weight > b.heavy || (en.weight === b.heavy && st.reps > b.heavyReps)) { b.heavy = en.weight; b.heavyReps = st.reps; }
        b.sets.push({ w: en.weight, reps: st.reps });
      }
    }
  }
  return b;
}

// Records set in a session, compared with everything logged before it. A first-ever session sets the baseline, not a record.
function findPRs(session, earlier) {
  const prs = [];
  for (const en of session.entries) {
    const before = bestsFor(en.exId, earlier);
    if (!before.sets.length || !(en.weight > 0)) continue;
    const now = bestsFor(en.exId, [session]);
    if (!now.sets.length) continue;
    // Being told to lift a heavier weight isn't a record on its own; a better estimated max or more reps than ever at a weight is.
    const top = now.sets.reduce((a, x) => (epley(x.w, x.reps) > epley(a.w, a.reps) ? x : a));
    const bestReps = Math.max(...now.sets.map(x => x.reps));
    const atWeight = before.sets.filter(x => x.w >= en.weight);
    const prevReps = Math.max(0, ...atWeight.map(x => x.reps));
    let text = '';
    if (now.e1rm > before.e1rm * 1.005) text = `new best estimated max: ~${kg(Math.round(now.e1rm))} (${kg(top.w)} × ${top.reps})`;
    else if (atWeight.length && bestReps > prevReps) text = `most reps ever at ${kg(en.weight)} or more: ${bestReps}`;
    if (text) prs.push({ exId: en.exId, name: en.name, text });
  }
  return prs;
}

// Sets and sessions per muscle for the week starting `ws`.
function muscleWeek(ws) {
  const from = ws.getTime(), to = from + 7 * DAY_MS;
  const out = Object.fromEntries(Object.keys(MUSCLES).map(m => [m, { sets: 0, sessions: new Set() }]));
  for (const s of state.sessions) {
    const t = new Date(s.date).getTime();
    if (t < from || t >= to) continue;
    for (const en of s.entries) {
      const mm = musclesOf(en.exId, en.name), n = en.sets.filter(x => x.done).length;
      if (!mm || !n) continue;
      mm.p.forEach(m => { out[m].sets += n; out[m].sessions.add(s.id); });
      mm.s.forEach(m => { out[m].sets += n / 2; });
    }
  }
  return out;
}

/* ---------- state ---------- */

function fresh() {
  return {
    v: 3,
    setupDone: false,
    settings: { perWeek: 2, rest: 'auto', deloadAfter: 3, deloadPct: 10, progression: 'scaled', deloadEvery: 6 },
    exercises: CATALOGUE.map(fromCatalogue),
    sessions: [],
    active: null,
    body: [],        // bodyweight log: { d, w }
    deload: null,    // { start, end } while a deload week is running
    lastDeload: null,
    snooze: {},      // prompt → date it may show again
    lastBackup: null,
  };
}

function newExercise(o) {
  return {
    id: uid(), day: 'push', name: 'New exercise', sets: 3, reps: 10, target: 15, inc: 2.5, rest: 120, kind: 'compound',
    inPlan: true, weight: null, amrap: true, misses: 0, log: [], ...o,
  };
}

// Brings saved data (or an imported backup) up to the current shape.
function upgrade(s) {
  const d = fresh();
  s = { ...d, ...s, settings: { ...d.settings, ...(s.settings || {}) } };
  if ((s.v || 1) < 2) s.exercises = s.exercises.map(e => ({ rest: 120, kind: 'compound', inPlan: true, ...e }));
  if ((s.v || 1) < 3) {
    // New catalogue entries arrive unticked; anything already there (including your edits) is left alone.
    const have = new Set(s.exercises.map(e => e.name.toLowerCase()));
    s.exercises.push(...CATALOGUE.filter(c => !have.has(c[1].toLowerCase())).map(c => ({ ...fromCatalogue(c), inPlan: false })));
    s.v = 3;
  }
  return s;
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return upgrade(JSON.parse(raw));
  } catch (e) { /* fall through to a fresh state */ }
  return fresh();
}

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); }
  catch (e) { toast('Could not save. Storage may be full or blocked.'); }
}

let state = load();
const ui = { tab: 'today', day: null, test: null, progDay: 'push', exId: null };

function setWeight(ex, w, why, date = new Date()) {
  ex.weight = w;
  ex.log.push({ d: date.toISOString(), w, why });
}

/* ---------- program logic ---------- */

function nextDay() {
  const last = state.sessions[state.sessions.length - 1];
  return last ? DAYS[(DAYS.indexOf(last.day) + 1) % 3] : 'push';
}

function sessionsThisWeek() {
  const ws = weekStart(new Date()).getTime();
  return state.sessions.filter(s => new Date(s.date).getTime() >= ws);
}

// With 1 session per day per week every session is a test. With 2, the first one each week is.
function testDue(day) {
  if (state.settings.perWeek === 1) return true;
  return !sessionsThisWeek().some(s => s.day === day && s.test);
}

const restFor = e => state.settings.rest === 'auto' ? (e.rest || 120) : Number(state.settings.rest) || 0;
const inPlan = day => state.exercises.filter(e => e.day === day && e.inPlan);

// Rough session length in minutes: warm-up, ~3 s a rep plus set-up per set, and the rest after every set.
function estimateRaw(exs, test = true) {
  return exs.reduce((t, e) => {
    const warm = e.kind === 'main' ? 300 : e.kind === 'compound' ? 120 : 30;
    const work = e.sets * (20 + e.reps * 3) + (test && e.amrap ? (e.target - e.reps) * 3 : 0);
    return t + warm + work + e.sets * (restFor(e) || 60);
  }, 0) / 60;
}

// How long your recent sessions actually took against their estimate (median of the last 6), so the estimate learns your pace.
function paceFactor() {
  const r = state.sessions.filter(s => s.est > 0 && s.start).slice(-6)
    .map(s => (new Date(s.date) - s.start) / 60000 / s.est).filter(x => x > 0.3 && x < 3).sort((a, b) => a - b);
  return r.length < 2 ? 1 : Math.min(1.5, Math.max(0.7, r[Math.floor(r.length / 2)]));
}

const estimateMin = (exs, test) => Math.max(5, Math.round(estimateRaw(exs, test) * paceFactor() / 5) * 5);

/* ---------- deload weeks ----------
 * Coaches typically programme a lighter week of 5–7 days every 4–6 weeks, mostly by cutting volume and effort
 * (Bell et al. 2022). During one, sessions keep the same weights with half the sets and no AMRAP test.
 */
function inDeload() {
  if (state.deload && Date.now() >= state.deload.end) {
    state.lastDeload = state.deload.end;
    state.deload = null;
    save();
  }
  return !!state.deload;
}

function deloadDue() {
  const every = state.settings.deloadEvery;
  if (!every || inDeload() || !state.sessions.length) return false;
  if (state.snooze.deload && Date.now() < state.snooze.deload) return false;
  const since = Math.max(state.lastDeload || 0, new Date(state.sessions[0].date).getTime());
  return Date.now() - since >= every * 7 * DAY_MS;
}

function backupDue() {
  if (!state.sessions.length) return false;
  if (state.snooze.backup && Date.now() < state.snooze.backup) return false;
  const since = state.lastBackup || new Date(state.sessions[0].date).getTime();
  return Date.now() - since >= 30 * DAY_MS;
}

function makeEntry(e, test) {
  const amrap = test && e.amrap;
  const sets = inDeload() ? Math.max(1, Math.ceil(e.sets / 2)) : e.sets;
  return {
    exId: e.id, name: e.name, weight: Number(e.weight) || 0, reps: e.reps, target: e.target, inc: e.inc, amrap, rest: e.rest, kind: e.kind,
    sets: Array.from({ length: sets }, (_, i) => ({ reps: amrap && i === sets - 1 ? '' : e.reps, done: false })),
  };
}

function startWorkout(day, test, ids) {
  if (inDeload()) test = false;
  const exs = state.exercises.filter(e => ids.includes(e.id));
  state.active = {
    id: uid(), day, test, start: Date.now(), est: estimateRaw(exs, test) * (inDeload() ? 0.6 : 1),
    entries: exs.map(e => makeEntry(e, test)),
  };
  save();
  window.scrollTo(0, 0);
  render();
}

function finishWorkout() {
  const a = state.active;
  if (!a.entries.some(en => en.sets.some(s => s.done))) {
    if (confirm('No sets are ticked off. Discard this workout?')) discardWorkout();
    return;
  }
  const now = new Date();
  const { deloadAfter, deloadPct } = state.settings;
  const outcomes = [];

  for (const en of a.entries) {
    const ex = byId(en.exId);
    if (!ex || !en.amrap) continue;
    const last = en.sets[en.sets.length - 1];
    const reps = parseInt(last.reps, 10);
    const base = { exId: en.exId, name: en.name, from: en.weight, target: en.target, prescribed: en.reps };
    if (!last.done || isNaN(reps)) {
      outcomes.push({ ...base, status: 'skipped', to: ex.weight });
      continue;
    }
    const next = progression(en, reps);
    if (next.status !== 'hold') {
      setWeight(ex, next.to, next.status, now);
      ex.misses = 0;
      outcomes.push({ ...base, status: next.status, reps, to: next.to });
    } else {
      ex.misses = (ex.misses || 0) + 1;
      if (deloadAfter > 0 && ex.misses >= deloadAfter) {
        const step = ex.inc || 0.5;
        const to = Math.max(0, r2(Math.floor(en.weight * (1 - deloadPct / 100) / step + 1e-9) * step));
        setWeight(ex, to, 'deload', now);
        outcomes.push({ ...base, status: 'deload', reps, to, misses: ex.misses });
        ex.misses = 0;
      } else {
        // Keep the weight actually used, in case it was changed mid-session.
        if (en.weight !== ex.weight) setWeight(ex, en.weight, 'edit', now);
        outcomes.push({ ...base, status: 'hold', reps, to: en.weight, misses: ex.misses });
      }
    }
  }

  const session = {
    id: a.id, date: now.toISOString(), start: a.start, est: a.est, day: a.day, test: a.test,
    entries: a.entries.map(en => ({
      exId: en.exId, name: en.name, weight: en.weight, reps: en.reps, target: en.target, inc: en.inc, amrap: en.amrap,
      sets: en.sets.map(s => ({ reps: Number(s.reps) || 0, done: s.done })),
    })),
    outcomes,
  };
  session.prs = findPRs(session, state.sessions);
  state.sessions.push(session);
  state.active = null;
  ui.day = null; ui.test = null;
  stopRest();
  save();
  render();
  openSheet(summaryHtml(session));
}

function discardWorkout() {
  state.active = null;
  stopRest();
  save();
  render();
}

/* ---------- views ---------- */

function setTitle(t) { $('#title').textContent = t; }

function render() {
  document.querySelectorAll('.tabbar button').forEach(b => b.classList.toggle('on', b.dataset.tab === ui.tab));
  $('.tabbar').hidden = !state.setupDone;
  const v = $('#view');
  if (!state.setupDone) v.innerHTML = viewSetup();
  else if (ui.tab === 'today') v.innerHTML = state.active ? viewActive() : viewToday();
  else if (ui.tab === 'progress') { v.innerHTML = viewProgress(); drawCharts(); }
  else if (ui.tab === 'history') v.innerHTML = viewHistory();
  else v.innerHTML = viewProgram();
  tickElapsed();
  keepAwake();
}

function viewSetup() {
  setTitle('Welcome');
  const pw = state.settings.perWeek;
  return `
  <section class="card intro">
    <h2>Push, pull, legs. Add weight when you earn it.</h2>
    <p>On test days the last set of every exercise is an <b>AMRAP</b> set: as many reps as you can with good form.
    Hit the rep target and that exercise moves up next time, and the more reps you beat it by, the bigger the jump. Land in your rep range and you stay. Fall below it and the weight drops.</p>
  </section>
  <section class="card">
    <h3>How often do you train each day?</h3>
    <div class="seg">${[1, 2].map(n => `<button data-action="perWeek" data-n="${n}" class="${pw === n ? 'on' : ''}">${n === 1 ? '1× a week' : '2× a week'}</button>`).join('')}</div>
    <p class="hint">${pw === 2
      ? 'Six sessions a week. The first Push, Pull and Legs session each week is the AMRAP test; the second is a volume day at the same weights.'
      : 'Three sessions a week. Every session is an AMRAP test.'}</p>
  </section>
  ${DAYS.map(d => `
  <section class="card">
    <h3 class="dayh"><span class="dot ${d}"></span>${DAY_LABEL[d]} <small>${DAY_FOCUS[d]} · about ${estimateMin(inPlan(d))} min</small></h3>
    ${inPlan(d).map(e => `
    <label class="setup-row">
      <span><b>${esc(e.name)}</b><small>${e.sets} × ${e.reps} · move up at ${e.target} reps</small></span>
      <span class="wt-in"><input type="number" inputmode="decimal" step="0.5" min="0" placeholder="0"
        data-bind="setupW" data-id="${e.id}" value="${e.weight ?? ''}"><em>${UNIT}</em></span>
    </label>`).join('')}
  </section>`).join('')}
  <p class="hint pad">Start with a weight you could do for two or three more reps than the set asks for.
  Before each session you can swap in alternatives from the catalogue, like overhead triceps extensions, dumbbell flies, pull-ups or preacher curls. You'll be asked for their starting weight the first time you pick them.</p>
  <button class="btn primary block" data-action="finishSetup">Start training</button>`;
}

function viewToday() {
  setTitle('Today');
  const nd = nextDay();
  const day = ui.day || nd;
  const deload = inDeload();
  const test = !deload && (ui.test ?? testDue(day));
  const exs = inPlan(day);
  const week = sessionsThisWeek().length;
  const ups = state.exercises.reduce((n, e) => n + e.log.filter(l => l.why === 'up').length, 0);
  const last = state.sessions[state.sessions.length - 1];
  const weeks = Math.round((Date.now() - Math.max(state.lastDeload || 0, new Date(state.sessions[0]?.date || Date.now()).getTime())) / (7 * DAY_MS));
  const banners = [
    deloadDue() && `<section class="card prompt">
      <h3>Time for a deload week?</h3>
      <p class="hint">You've trained hard for ${weeks} weeks. A lighter week (half the sets, same weights, no AMRAP) lets fatigue clear so you keep progressing.</p>
      <div class="btnrow"><button class="btn small primary" data-action="deloadStart">Start deload week</button><button class="btn small" data-action="snooze" data-k="deload" data-days="7">Not now</button></div>
    </section>`,
    deload && `<section class="card prompt">
      <h3>Deload week</h3>
      <p class="hint">Until ${dLong(state.deload.end)}: half the sets, same weights, no AMRAP. Normal training resumes after.</p>
      <div class="btnrow"><button class="btn small" data-action="deloadEnd">End deload early</button></div>
    </section>`,
    backupDue() && `<section class="card prompt">
      <h3>Monthly backup</h3>
      <p class="hint">Your workouts live only on this phone. Save a backup to Files or iCloud Drive so they survive a lost or replaced phone.</p>
      <div class="btnrow"><button class="btn small primary" data-action="export">Back up now</button><button class="btn small" data-action="snooze" data-k="backup" data-days="3">Later</button></div>
    </section>`,
  ].filter(Boolean).join('');
  return `
  ${banners}
  <div class="seg days">${DAYS.map(d => `<button data-action="pickDay" data-day="${d}" class="${d === day ? 'on' : ''}">
    <span class="dot ${d}"></span>${DAY_LABEL[d]}${d === nd ? ' <small>next</small>' : ''}</button>`).join('')}</div>
  <section class="card">
    <div class="row between">
      <div><h2>${DAY_LABEL[day]} day</h2><p class="sub">${DAY_FOCUS[day]}</p></div>
      ${deload ? '<span class="pill static">Deload</span>'
        : `<button class="pill ${test ? 'on' : ''}" data-action="toggleTest" aria-pressed="${test}">${test ? 'AMRAP test' : 'Volume day'}</button>`}
    </div>
    <p class="hint">${deload ? 'Half the sets at your current weights.' : test
      ? 'The last set of each exercise is AMRAP. Hit the target and the weight goes up. Tap the badge to switch.'
      : 'Straight sets at your current weights. No progression check today. Tap the badge to switch.'}</p>
    <ul class="plan">${exs.map(e => `<li><span>${esc(e.name)}</span>
      <span class="muted">${deload ? Math.ceil(e.sets / 2) : e.sets} × ${e.reps}${test && e.amrap ? '+' : ''}</span><b>${kg(e.weight)}</b></li>`).join('')
      || '<li class="muted">Nothing picked yet. Choose exercises below.</li>'}</ul>
    <p class="hint">About <b>${Math.max(5, Math.round(estimateMin(exs, test) * (deload ? 0.6 : 1) / 5) * 5)} min</b> including warm-ups and rest${paceFactor() !== 1 ? ', adjusted to your pace' : ''}.</p>
    <button class="btn primary block" data-action="pick">Choose exercises &amp; start</button>
  </section>
  <section class="card stats3">
    <div><b>${week}/${3 * state.settings.perWeek}</b><small>this week</small></div>
    <div><b>${ups}</b><small>weight increases</small></div>
    <div><b>${last ? relDays(last.date) : '–'}</b><small>last workout</small></div>
  </section>`;
}

function viewActive() {
  const a = state.active;
  setTitle(DAY_LABEL[a.day]);
  const all = a.entries.flatMap(en => en.sets);
  return `
  <div class="active-head">
    <span class="pill static ${a.test ? 'on' : ''}">${a.test ? 'AMRAP test' : 'Volume day'}</span>
    <span class="muted"><span id="elapsed">0:00</span>${a.est ? ` of ~${Math.round(a.est * paceFactor() / 5) * 5} min` : ''} · ${all.filter(s => s.done).length}/${all.length} sets</span>
  </div>
  ${inDeload() ? '<p class="banner">Deload week: half the sets, same weights, no AMRAP.</p>' : ''}
  ${a.entries.map(entryCard).join('')}
  <button class="btn block small" data-action="addToWorkout">+ Add exercise</button>
  <button class="btn primary block" data-action="finish">Finish workout</button>
  <button class="btn ghost block danger-text" data-action="discard">Discard workout</button>`;
}

function lastDone(id) {
  for (let i = state.sessions.length - 1; i >= 0; i--) {
    if (state.sessions[i].entries.some(en => en.exId === id)) return state.sessions[i].date;
  }
  return null;
}

function pickerHtml(day, test) {
  const all = state.exercises.filter(e => e.day === day);
  const plan = all.filter(e => e.inPlan), others = all.filter(e => !e.inPlan);
  const group = (label, list) => list.length ? `<h3 class="pick-h">${label}</h3>${list.map(pickRow).join('')}` : '';
  return `
  <h2><span class="dot ${day}"></span> ${DAY_LABEL[day]}</h2>
  <p class="sub">${test ? 'AMRAP test' : 'Volume day'} · tick what you're doing today. Your picks are remembered for next time.</p>
  <div class="picklist">
    ${group('Your plan', plan)}
    ${group('Compound lifts', others.filter(e => e.kind !== 'iso'))}
    ${group('Isolation', others.filter(e => e.kind === 'iso'))}
  </div>
  <p class="hint" id="pickNote"></p>
  <button class="btn primary block" data-action="startPicked" data-day="${day}" id="pickGo">Start</button>`;
}

function pickRow(e) {
  const last = lastDone(e.id);
  return `
    <label class="pick-row">
      <input type="checkbox" data-bind="pickToggle" data-id="${e.id}" ${e.inPlan ? 'checked' : ''}>
      <span class="pk"><b>${esc(e.name)}${e.kind === 'main' ? ' <span class="tag good">Recommended</span>' : ''}</b>
        <small>${e.sets} × ${e.reps}, up from ${e.target} · rest ${restFor(e) ? mmss(restFor(e)) : 'off'}${e.alt ? ` · alt. to ${esc(e.alt)}` : ''}${last ? ` · last ${dShort(last)}` : ''}</small></span>
      ${e.weight == null
        ? `<span class="wt-in"><input type="number" inputmode="decimal" step="0.5" min="0" placeholder="kg" data-bind="pickW" data-id="${e.id}" aria-label="Starting weight"></span>`
        : `<span class="muted pkw">${kg(e.weight)}</span>`}
    </label>`;
}

function pickedIds() {
  return [...document.querySelectorAll('[data-bind="pickToggle"]')].filter(c => c.checked).map(c => c.dataset.id);
}

function updatePicker() {
  const day = $('#pickGo').dataset.day, test = ui.test ?? testDue(day);
  const ids = pickedIds(), exs = ids.map(byId);
  const go = $('#pickGo');
  go.disabled = !ids.length;
  go.textContent = ids.length ? `Start ${ids.length} exercise${ids.length > 1 ? 's' : ''} · about ${estimateMin(exs, test)} min` : 'Pick at least one exercise';
  const missing = state.exercises.filter(e => e.day === day && e.kind === 'main' && !ids.includes(e.id));
  $('#pickNote').innerHTML = missing.length
    ? `<b>${missing.map(e => esc(e.name)).join(', ')}</b> is recommended. Squats, deadlifts and flat bench are the big multi-joint lifts that drive most strength gains, so keep it in if you can.`
    : '';
  document.querySelectorAll('.pick-row').forEach(r => r.classList.toggle('on', $('input[type=checkbox]', r).checked));
}

function goalHtml(en) {
  if (state.settings.progression === 'fixed') {
    return `Last set: as many reps as you can. <b>${en.target}+</b> moves you to <b>${kg(r2(en.weight + en.inc))}</b>.`;
  }
  return `Last set: as many reps as you can. ${en.reps}–${en.target - 1} holds, under ${en.reps} goes lighter.<br>Move up: ${ladder(en)} ${UNIT}`;
}

function entryCard(en, i) {
  const last = en.sets[en.sets.length - 1];
  const amrapReps = parseInt(last.reps, 10);
  let result = '';
  if (en.amrap && last.done && !isNaN(amrapReps)) {
    const next = progression(en, amrapReps);
    result = {
      up: `<p class="result"><span class="ic good">${ICON.up}</span>${amrapReps} reps. +${fmt(r2(next.to - en.weight))} ${UNIT}, ${kg(next.to)} next time.</p>`,
      hold: `<p class="result"><span class="ic">${ICON.hold}</span>${amrapReps} of ${en.target} reps. Staying at ${kg(en.weight)}.</p>`,
      down: `<p class="result"><span class="ic warn">${ICON.down}</span>${amrapReps} reps, under ${en.reps}. ${kg(next.to)} next time.</p>`,
    }[next.status];
  }
  const a = state.active;
  const ssFirst = en.ss && a.entries[i + 1], ssSecond = a.entries[i - 1]?.ss;
  const prev = lastEntry(en.exId, a.start);
  const note = byId(en.exId)?.note;
  return `
  <section class="card ex ${en.sets.every(s => s.done) ? 'complete' : ''} ${ssFirst ? 'ss-a' : ''} ${ssSecond ? 'ss-b' : ''}" id="en-${i}">
    ${ssFirst ? '<span class="ss-tag">Superset · no rest until the next exercise</span>' : ''}
    <div class="ex-top">
      <h3>${esc(en.name)}</h3>
      <label class="wt-in"><input type="number" inputmode="decimal" step="0.5" min="0" value="${en.weight}"
        data-bind="enW" data-e="${i}" aria-label="Weight for ${esc(en.name)}"><em>${UNIT}</em></label>
      <button class="more" data-action="entryMenu" data-e="${i}" aria-label="Exercise options">${ICON.more}</button>
    </div>
    ${prev ? `<p class="last">Last time (${dShort(prev.date)}): ${kg(prev.en.weight)} × ${prev.en.sets.filter(s => s.done).map(s => s.reps).join(' · ')}</p>` : ''}
    ${note ? `<p class="note">${esc(note)}</p>` : ''}
    ${en.amrap ? `<p class="goal" id="goal-${i}">${goalHtml(en)}</p>` : ''}
    <div class="sets">${en.sets.map((s, j) => {
      const am = en.amrap && j === en.sets.length - 1;
      return `<div class="set ${s.done ? 'done' : ''} ${am ? 'amrap' : ''}">
        <span class="sn">${am ? 'AMRAP' : `Set ${j + 1}`}</span>
        <label class="reps"><input type="number" inputmode="numeric" min="0" placeholder="${am ? '?' : en.reps}" value="${s.reps}"
          data-bind="setR" data-e="${i}" data-s="${j}" aria-label="Reps"><em>reps</em></label>
        <button class="check" data-action="toggleSet" data-e="${i}" data-s="${j}" aria-pressed="${s.done}" aria-label="Set done">${ICON.check}</button>
      </div>`;
    }).join('')}</div>
    ${result}
  </section>`;
}

function entryMenuHtml(i) {
  const a = state.active, en = a.entries[i], ex = byId(en.exId);
  return `
  <h2>${esc(en.name)}</h2>
  <div class="menu">
    <button data-action="entryMove" data-e="${i}" data-dir="-1" ${i === 0 ? 'disabled' : ''}>Move up</button>
    <button data-action="entryMove" data-e="${i}" data-dir="1" ${i === a.entries.length - 1 ? 'disabled' : ''}>Move down</button>
    <button data-action="entrySuperset" data-e="${i}" ${i === a.entries.length - 1 ? 'disabled' : ''}>${en.ss ? 'Unlink superset' : `Superset with ${esc(a.entries[i + 1]?.name || 'next exercise')}`}</button>
    <button data-action="entrySet" data-e="${i}" data-dir="1">Add a set</button>
    <button data-action="entrySet" data-e="${i}" data-dir="-1" ${en.sets.length <= 1 ? 'disabled' : ''}>Remove last set</button>
    <button data-action="entryRemove" data-e="${i}" class="danger-text">Remove from today</button>
  </div>
  ${ex ? `<label class="field full" style="margin-top:16px">Note (seat height, grip, cues…)
    <textarea id="fNote" rows="2" placeholder="Shown every time you do this exercise">${esc(ex.note || '')}</textarea></label>
  <button class="btn primary block" data-action="saveNote" data-id="${ex.id}">Save note</button>` : ''}`;
}

function addToWorkoutHtml() {
  const a = state.active, inSession = new Set(a.entries.map(en => en.exId));
  const order = [a.day, ...DAYS.filter(d => d !== a.day)];
  return `
  <h2>Add exercise</h2>
  <p class="sub">Added for this workout only.</p>
  ${order.map(d => {
    const list = state.exercises.filter(e => e.day === d && !inSession.has(e.id));
    return list.length ? `<h3 class="pick-h">${DAY_LABEL[d]}</h3>${list.map(e => `
      <div class="add-row"><span><b>${esc(e.name)}</b><small>${e.sets} × ${e.reps}${e.weight != null ? ` · ${kg(e.weight)}` : ''}</small></span>
      ${e.weight == null ? `<span class="wt-in"><input type="number" inputmode="decimal" step="0.5" min="0" placeholder="kg" data-bind="pickW" data-id="${e.id}" aria-label="Starting weight"></span>` : ''}
      <button class="btn small" data-action="addEntry" data-id="${e.id}">Add</button></div>`).join('')}` : '';
  }).join('')}`;
}

function outcomeLi(o) {
  const n = state.settings.deloadAfter;
  const rows = {
    up: ['good', ICON.up, `${o.reps} reps (target ${o.target}). +${fmt(r2(o.to - o.from))} ${UNIT}, next time ${kg(o.to)}.`, '<span class="tag good">Up</span>'],
    down: ['warn', ICON.down, `${o.reps} reps, under the ${o.prescribed ?? ''} prescribed. Lighter next time: ${kg(o.to)}.`, '<span class="tag warn">Lighter</span>'],
    hold: ['', ICON.hold, `${o.reps} of ${o.target} reps. Stays at ${kg(o.to)}${n ? `, miss ${o.misses} of ${n}` : ''}.`, '<span class="tag">Hold</span>'],
    deload: ['warn', ICON.down, `${o.reps} of ${o.target} reps, ${o.misses} misses in a row. Reset to ${kg(o.to)}.`, '<span class="tag warn">Deload</span>'],
    skipped: ['', ICON.skip, 'AMRAP set not logged. Weight unchanged.', '<span class="tag">Skipped</span>'],
  }[o.status];
  return `<li><span class="ic ${rows[0]}">${rows[1]}</span><div><b>${esc(o.name)}</b><small>${rows[2]}</small></div>${rows[3]}</li>`;
}

function summaryHtml(s) {
  const mins = Math.max(1, Math.round((new Date(s.date) - s.start) / 60000));
  const ups = s.outcomes.filter(o => o.status === 'up').length;
  return `
  <h2>${DAY_LABEL[s.day]} done</h2>
  <p class="sub">${dLong(s.date)} · ${mins} min · ${fmt(sessionVolume(s))} ${UNIT} lifted</p>
  ${prsHtml(s)}
  ${s.test
    ? `<p class="hint">${ups ? `${ups} exercise${ups > 1 ? 's' : ''} moving up next time.` : 'No increases this time. Same weights, beat the reps.'}</p>
       <ul class="outcomes">${s.outcomes.map(outcomeLi).join('')}</ul>`
    : '<p class="hint">Volume day logged. Weights unchanged.</p>'}
  <button class="btn primary block" data-action="closeSheet">Done</button>`;
}

function prsHtml(s) {
  if (!s.prs?.length) return '';
  return `<div class="prs"><h3><span class="ic gold">${ICON.trophy}</span>${s.prs.length} personal record${s.prs.length > 1 ? 's' : ''}</h3>
    ${s.prs.map(p => `<p><b>${esc(p.name)}</b><small>${esc(p.text)}</small></p>`).join('')}</div>`;
}

function viewHistory() {
  setTitle('History');
  if (!state.sessions.length) return '<section class="card"><p class="empty">Finished workouts show up here.</p></section>';
  let month = '';
  return [...state.sessions].reverse().map(s => {
    const m = new Date(s.date).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
    const head = m !== month ? `<h3 class="month">${m}</h3>` : '';
    month = m;
    const ups = s.outcomes.filter(o => o.status === 'up').length;
    return `${head}<button class="hist" data-action="openSession" data-id="${s.id}">
      <span class="dot ${s.day}"></span>
      <div><b>${DAY_LABEL[s.day]} ${s.test ? '<span class="tag">AMRAP</span>' : ''}</b>
      <small>${dLong(s.date)} · ${fmt(sessionVolume(s))} ${UNIT}${ups ? ` · ${ups} up` : ''}</small></div>${ICON.chev}</button>`;
  }).join('');
}

function sessionDetailHtml(s) {
  return `
  <h2><span class="dot ${s.day}"></span> ${DAY_LABEL[s.day]}</h2>
  <p class="sub">${dLong(s.date)} · ${s.test ? 'AMRAP test' : 'Volume day'} · ${fmt(sessionVolume(s))} ${UNIT}</p>
  <div class="detail">${s.entries.map(en => `
    <div class="line"><div><b>${esc(en.name)}</b><small>${en.sets.filter(x => x.done).map(x => x.reps).join(' · ') || 'not done'}${en.amrap ? ' (last set AMRAP)' : ''}</small></div>
    <span>${kg(en.weight)}</span></div>`).join('')}
  </div>
  ${prsHtml(s)}
  ${s.outcomes.length ? `<ul class="outcomes">${s.outcomes.map(outcomeLi).join('')}</ul>` : ''}
  <button class="btn block" data-action="editSession" data-id="${s.id}">Edit workout</button>
  <button class="btn ghost block danger-text" data-action="deleteSession" data-id="${s.id}">Delete workout</button>`;
}

function editSessionHtml(s) {
  return `
  <h2>Edit ${DAY_LABEL[s.day]}</h2>
  <p class="sub">${dLong(s.date)} · leave a set blank if you didn't do it</p>
  ${s.entries.map((en, i) => `
    <div class="edit-en">
      <div class="ex-top"><b>${esc(en.name)}</b>
        <label class="wt-in"><input type="number" inputmode="decimal" step="0.5" min="0" value="${en.weight}" data-es="${i}" data-k="w" aria-label="Weight"><em>${UNIT}</em></label></div>
      <div class="edit-sets">${en.sets.map((st, j) => `
        <label class="reps"><input type="number" inputmode="numeric" min="0" value="${st.done ? st.reps : ''}" data-es="${i}" data-k="r" data-s="${j}"
          aria-label="Set ${j + 1} reps"><em>${en.amrap && j === en.sets.length - 1 ? 'AMRAP' : `set ${j + 1}`}</em></label>`).join('')}</div>
    </div>`).join('')}
  <button class="btn primary block" data-action="saveSession" data-id="${s.id}">Save changes</button>`;
}

// Applies edits to a finished workout. If it's still the latest workout for an exercise, its weight change is redone
// from the corrected AMRAP; if later workouts already built on it, only the log is corrected.
function saveSession(s) {
  document.querySelectorAll('[data-es]').forEach(inp => {
    const en = s.entries[inp.dataset.es];
    if (inp.dataset.k === 'w') en.weight = Number(inp.value) || 0;
    else {
      const st = en.sets[inp.dataset.s];
      st.done = inp.value !== '';
      st.reps = Number(inp.value) || 0;
    }
  });
  const t = new Date(s.date).getTime();
  let frozen = 0;
  s.outcomes = s.outcomes.map(o => {
    const en = s.entries.find(x => x.exId === o.exId), ex = byId(o.exId);
    if (!en || !ex) return o;
    const last = en.sets[en.sets.length - 1];
    const base = { ...o, from: en.weight };
    const later = state.sessions.some(x => new Date(x.date).getTime() > t && x.entries.some(y => y.exId === o.exId));
    const next = last.done
      ? progression({ weight: en.weight, reps: en.reps ?? o.prescribed ?? ex.reps, target: en.target, inc: en.inc ?? ex.inc }, last.reps)
      : { status: 'skipped', to: en.weight };
    if (later) { frozen++; return { ...base, status: next.status, reps: last.reps, to: next.to }; }
    while (ex.log.length > 1 && ex.log[ex.log.length - 1].d === s.date) ex.log.pop();
    ex.weight = ex.log[ex.log.length - 1]?.w ?? en.weight;
    if (next.status !== 'hold' && next.status !== 'skipped') setWeight(ex, next.to, next.status, new Date(s.date));
    else if (en.weight !== ex.weight) setWeight(ex, en.weight, 'edit', new Date(s.date));
    ex.misses = next.status === 'hold' ? Math.max(1, ex.misses || 0) : 0;
    return { ...base, status: next.status, reps: last.reps, to: ex.weight, misses: ex.misses };
  });
  s.prs = findPRs(s, state.sessions.filter(x => new Date(x.date).getTime() < t));
  save();
  toast(frozen ? 'Saved. Later workouts already set the current weights, so those stay as they are.' : 'Workout updated');
}

function viewProgram() {
  setTitle('Program');
  const d = ui.progDay;
  const exs = state.exercises.filter(e => e.day === d);
  const st = state.settings;
  const opt = (vals, cur, label) => vals.map(v => `<option value="${v}" ${v === cur ? 'selected' : ''}>${label(v)}</option>`).join('');
  return `
  <div class="seg">${DAYS.map(x => `<button data-action="progDay" data-day="${x}" class="${x === d ? 'on' : ''}"><span class="dot ${x}"></span>${DAY_LABEL[x]}</button>`).join('')}</div>
  <section class="card">
    <ul class="exlist">${exs.map((e, i) => `<li>
      <button class="open" data-action="editEx" data-id="${e.id}"><b>${esc(e.name)}${e.inPlan ? ' <span class="tag">In plan</span>' : ''}</b>
        <small>${e.weight == null ? 'No weight yet' : kg(e.weight)} · ${e.sets} × ${e.reps} · ${e.amrap ? `up from ${e.target} reps` : 'no AMRAP'} · rest ${mmss(e.rest || 120)}</small></button>
      <button class="mv" data-action="move" data-id="${e.id}" data-dir="-1" ${i === 0 ? 'disabled' : ''} aria-label="Move up">${ICON.mvUp}</button>
      <button class="mv" data-action="move" data-id="${e.id}" data-dir="1" ${i === exs.length - 1 ? 'disabled' : ''} aria-label="Move down">${ICON.mvDown}</button>
    </li>`).join('') || '<li><p class="empty">No exercises on this day.</p></li>'}</ul>
    <button class="btn block small" data-action="addEx">+ Add exercise</button>
  </section>

  <section class="card">
    <h3>Settings</h3>
    <div class="setting"><span><b>Sessions per week</b><small>Per day: ${st.perWeek === 2 ? 'first is the test, second is volume' : 'every session is a test'}</small></span>
      <div class="seg">${[1, 2].map(n => `<button data-action="perWeek" data-n="${n}" class="${st.perWeek === n ? 'on' : ''}">${n}×</button>`).join('')}</div></div>
    <div class="setting"><span><b>Progression</b><small>How the AMRAP set changes the weight · <a href="#" data-action="howProgress">How it works</a></small></span>
      <select class="pick" data-bind="progression">${opt(['scaled', 'fixed'], st.progression, v => v === 'scaled' ? 'Scaled by reps' : 'Fixed step')}</select></div>
    <div class="setting"><span><b>Rest timer</b><small>Starts when you tick a set. Auto is 3 min for main lifts, 2–2.5 for other compounds, 1.5 for isolation.</small></span>
      <select class="pick" data-bind="rest">${opt(['auto', 0, 90, 120, 150, 180], st.rest, v => v === 'auto' ? 'Auto' : v ? mmss(v) : 'Off')}</select></div>
    <div class="setting"><span><b>Keep screen on</b><small>During workouts, so the rest timer and beep keep working. iPhone web apps pause when the phone locks.</small></span>
      <select class="pick" data-bind="awake">${opt(['on', 'off'], st.awake === false ? 'off' : 'on', v => v === 'on' ? 'On' : 'Off')}</select></div>
    <div class="setting"><span><b>Suggest a deload week</b><small>A prompt on Today after this many weeks of training. You choose whether to take it.</small></span>
      <select class="pick" data-bind="deloadEvery">${opt([0, 4, 5, 6, 8], st.deloadEvery, v => v ? `Every ${v} weeks` : 'Never')}</select></div>
    <div class="setting"><span><b>Deload after</b><small>Missed AMRAP targets in a row</small></span>
      <select class="pick" data-bind="deloadAfter">${opt([0, 2, 3, 4, 5], st.deloadAfter, v => v ? `${v} misses` : 'Never')}</select></div>
    <div class="setting"><span><b>Deload by</b><small>Weight drop when it triggers</small></span>
      <select class="pick" data-bind="deloadPct">${opt([5, 10, 15, 20], st.deloadPct, v => `${v}%`)}</select></div>
  </section>

  <section class="card">
    <h3>Your data</h3>
    <p class="hint" style="margin-top:0">Everything is stored on this phone only. Export a backup now and then.</p>
    <div class="btnrow" style="margin-top:12px">
      <button class="btn small" data-action="export">Export backup</button>
      <button class="btn small" data-action="import">Import backup</button>
    </div>
    <button class="btn ghost block small danger-text" data-action="reset">Erase everything</button>
  </section>`;
}

function howHtml() {
  const ex = { weight: 60, reps: 8, target: 12, inc: 2.5 };
  const rows = [6, 7, 8, 10, 12, 13, 14, 15, 18].map(r => {
    const n = progression(ex, r);
    const label = { up: `+${fmt(r2(n.to - ex.weight))}`, hold: 'same', down: `−${fmt(r2(ex.weight - n.to))}` }[n.status];
    return `<tr><td>${r}</td><td>${kg(n.to)}</td><td class="${n.status === 'up' ? 'up-txt' : 'muted'}">${label}</td></tr>`;
  }).join('');
  return `
  <h2>How progression works</h2>
  <p class="hint">On test days your last set of each exercise is AMRAP. The reps you get decide next session's weight, and the further you are from the target, the bigger the change.</p>
  <ul class="how">
    <li><b>Target or more:</b> the weight goes up. The app estimates your max from the set and picks the weight you'd hit for the middle of your rep range. More reps means a bigger jump, and the minimum is one increment.</li>
    <li><b>Between prescribed reps and target:</b> same weight. Beat the reps next time.</li>
    <li><b>Fewer than prescribed:</b> too heavy, so it drops to a weight you can do for the prescribed reps.</li>
    <li><b>Stalled:</b> after ${state.settings.deloadAfter || 'several'} holds in a row it deloads ${state.settings.deloadPct}% so you can build back up.</li>
  </ul>
  <h3 style="margin-top:16px">Example: 60 kg, 3 × 8, target 12</h3>
  <table class="lifts" style="margin-top:8px"><thead><tr><th>AMRAP reps</th><th>Next time</th><th>Change</th></tr></thead><tbody>${rows}</tbody></table>
  <h3 style="margin-top:18px">Why this works</h3>
  <ul class="how">
    <li>This follows <b>APRE</b> (autoregulatory progressive resistance exercise), where the reps on a max-reps set set the next load in bands. In a 6-week study of college football players, APRE produced bigger bench and squat gains than linear periodization (Mann et al., 2010).</li>
    <li>Adjusting load to performance (autoregulation) has done as well as or better than fixed percentages in reviews (Zhang et al., 2021; Hickmott et al., 2022). In a 12-week squat study it beat fixed loading (Graham &amp; Cleather).</li>
    <li>Rest: with <b>Auto</b> the timer gives 3 min on squat, deadlift and bench, 2–2.5 min on other compounds and 1.5 min on isolation work. In trained men, 3 min rests built more strength and muscle than 1 min (Schoenfeld et al., 2016), and ACSM guidelines recommend 2–3 min for big multi-joint lifts.</li>
    <li>Max estimates from rep counts get less accurate past about 10 reps (Reynolds et al., 2006). Reps beyond ${EST_REP_CAP} (or 3 past a high target) aren't counted, and because the AMRAP comes after your other sets, the estimate errs low. If you're still underloaded, the next test moves you up again.</li>
  </ul>
  <button class="btn primary block" data-action="closeSheet">Got it</button>`;
}

function editExHtml(e) {
  return `
  <h2>${e.name === 'New exercise' && !e.log.length ? 'New exercise' : 'Edit exercise'}</h2>
  <div class="form">
    <label class="field full">Name<input id="fName" value="${esc(e.name)}" autocomplete="off"></label>
    <label class="field">Day<select id="fDay">${DAYS.map(d => `<option value="${d}" ${d === e.day ? 'selected' : ''}>${DAY_LABEL[d]}</option>`).join('')}</select></label>
    <label class="field">Current weight (${UNIT})<input id="fWeight" type="number" inputmode="decimal" step="0.5" min="0" value="${e.weight ?? ''}"></label>
    <label class="field">Sets<input id="fSets" type="number" inputmode="numeric" min="1" max="10" value="${e.sets}"></label>
    <label class="field">Reps per set<input id="fReps" type="number" inputmode="numeric" min="1" value="${e.reps}"></label>
    <label class="toggle"><span>AMRAP last set on test days<small>Turn off for exercises you don't want to progress automatically.</small></span><input id="fAmrap" type="checkbox" ${e.amrap ? 'checked' : ''}></label>
    <label class="field">Move up at (reps)<input id="fTarget" type="number" inputmode="numeric" min="1" value="${e.target}"></label>
    <label class="field">Increase by (${UNIT})<input id="fInc" type="number" inputmode="decimal" step="0.25" min="0" value="${e.inc}"></label>
    <label class="field">Rest between sets<select id="fRest">${[60, 90, 120, 150, 180, 240].map(v => `<option value="${v}" ${v === (e.rest || 120) ? 'selected' : ''}>${mmss(v)}</option>`).join('')}</select></label>
    <label class="toggle"><span>In plan<small>Ticked by default when you start a ${DAY_LABEL[e.day]} session.</small></span><input id="fPlan" type="checkbox" ${e.inPlan ? 'checked' : ''}></label>
    ${MUSCLE_MAP[e.name] && !e.muscles ? '' : `<label class="field full">Main muscle (for the body map)<select id="fMuscle">
      <option value="">None</option>${Object.entries(MUSCLES).map(([k, v]) => `<option value="${k}" ${e.muscles?.p[0] === k ? 'selected' : ''}>${v}</option>`).join('')}</select></label>`}
    <label class="field full">Note<textarea id="fNote" rows="2" placeholder="Seat height, grip, cues…">${esc(e.note || '')}</textarea></label>
  </div>
  <button class="btn primary block" data-action="saveEx" data-id="${e.id}">Save</button>
  <button class="btn ghost block danger-text" data-action="deleteEx" data-id="${e.id}">Delete exercise</button>`;
}

/* ---------- progress / analytics ---------- */

function exerciseSeries(ex) {
  const weight = ex.log.map(l => ({ x: new Date(l.d).getTime(), y: l.w, why: l.why }));
  if (weight.length && Date.now() - weight[weight.length - 1].x > DAY_MS / 2) {
    weight.push({ x: Date.now(), y: ex.weight, why: 'now' });
  }
  const amrap = [], e1rm = [];
  for (const s of state.sessions) {
    const en = s.entries.find(x => x.exId === ex.id);
    if (!en) continue;
    const t = new Date(s.date).getTime();
    const last = en.sets[en.sets.length - 1];
    if (en.amrap && last.done) amrap.push({ x: t, y: last.reps, target: en.target, w: en.weight });
    const best = en.sets.filter(x => x.done && x.reps > 0 && x.reps <= 20).reduce((m, x) => Math.max(m, epley(en.weight, x.reps)), 0);
    if (best > 0 && en.weight > 0) e1rm.push({ x: t, y: r2(best) });
  }
  return { weight, amrap, e1rm };
}

function weeklyVolume(weeks = 10) {
  const ws = weekStart(new Date()).getTime();
  const cols = Array.from({ length: weeks }, (_, i) => ({ x: ws - (weeks - 1 - i) * 7 * DAY_MS, push: 0, pull: 0, legs: 0 }));
  for (const s of state.sessions) {
    const t = weekStart(s.date).getTime();
    const c = cols.find(c => Math.abs(c.x - t) < DAY_MS);
    if (c) c[s.day] += sessionVolume(s);
  }
  return cols;
}

function viewProgress() {
  setTitle('Progress');
  // Only exercises you've actually set a weight for or trained.
  const tracked = state.exercises.filter(e => e.log.length);
  if (!ui.exId || !tracked.some(e => e.id === ui.exId)) {
    const withData = tracked.find(e => state.sessions.some(s => s.entries.some(en => en.exId === e.id)));
    ui.exId = (withData || tracked[0] || {}).id;
  }
  const ex = byId(ui.exId);
  const ups = state.exercises.reduce((n, e) => n + e.log.filter(l => l.why === 'up').length, 0);
  const tests = state.sessions.flatMap(s => s.outcomes.filter(o => o.status !== 'skipped'));
  const hitRate = tests.length ? Math.round(100 * tests.filter(o => o.status === 'up').length / tests.length) : null;
  const weekAgo = Date.now() - 7 * DAY_MS;
  const vol7 = state.sessions.filter(s => new Date(s.date).getTime() >= weekAgo).reduce((t, s) => t + sessionVolume(s), 0);

  const tiles = `
  <div class="tiles">
    <div class="tile"><small>Workouts</small><b>${state.sessions.length}</b></div>
    <div class="tile"><small>Weight increases</small><b>${ups}</b></div>
    <div class="tile"><small>AMRAP hit rate</small><b>${hitRate === null ? '–' : hitRate + '%'}</b></div>
    <div class="tile"><small>Lifted, last 7 days</small><b>${vol7 >= 10000 ? fmt(r2(vol7 / 1000)) + 't' : fmt(vol7) + ' kg'}</b></div>
  </div>`;
  if (!ex) return tiles + muscleCard() + bodyCard();

  const start = ex.log.length ? ex.log[0].w : ex.weight;
  const change = start > 0 ? Math.round(100 * (ex.weight - start) / start) : null;

  return `${tiles}
  ${muscleCard()}
  <div class="picker">
    <select class="pick" data-bind="pickEx" aria-label="Exercise">${DAYS.map(d => `<optgroup label="${DAY_LABEL[d]}">${
      tracked.filter(e => e.day === d).map(e => `<option value="${e.id}" ${e.id === ex.id ? 'selected' : ''}>${esc(e.name)}</option>`).join('')}</optgroup>`).join('')}</select>
  </div>
  <div class="headline"><b>${kg(ex.weight)}</b>
    <span>${change === null ? 'current working weight' : `from ${kg(start)}${change ? `, <span class="up-txt">${change > 0 ? '+' : ''}${change}%</span>` : ''}`}</span></div>

  <section class="card chart-card"><h3>Working weight</h3><p class="sub">Steps up each time you hit the AMRAP target</p><div class="chart" id="cWeight"></div></section>
  <section class="card chart-card"><h3>AMRAP reps</h3><p class="sub">Last-set reps on test days against the target</p><div class="chart" id="cAmrap"></div>
    <div class="legend"><span><i style="background:var(--${ex.day})"></i>Target hit</span><span><i style="background:var(--muted);opacity:.45"></i>Missed</span><span><i style="height:0;border-top:2px dashed var(--text-2);border-radius:0"></i>Target</span></div></section>
  <section class="card chart-card"><h3>Estimated 1-rep max</h3><p class="sub">Best set each session (Epley formula)</p><div class="chart" id="cE1rm"></div></section>
  <section class="card chart-card"><h3>Weekly volume</h3><p class="sub">Weight × reps across all exercises, last 10 weeks</p><div class="chart" id="cVol"></div>
    <div class="legend">${DAYS.map(d => `<span><i style="background:var(--${d})"></i>${DAY_LABEL[d]}</span>`).join('')}</div></section>

  <section class="card"><h3>All lifts</h3>
    <table class="lifts"><thead><tr><th>Exercise</th><th>Start</th><th>Now</th><th>Change</th></tr></thead><tbody>
    ${tracked.map(e => {
      const s0 = e.log[0].w;
      const diff = r2((e.weight || 0) - (s0 || 0));
      return `<tr class="${e.id === ex.id ? 'sel' : ''}" data-action="pickExRow" data-id="${e.id}"><td><span class="dot ${e.day}"></span>${esc(e.name)}</td>
        <td>${fmt(s0 || 0)}</td><td>${fmt(e.weight || 0)}</td><td class="${diff > 0 ? 'up-txt' : 'muted'}">${diff > 0 ? '+' : ''}${fmt(diff)}</td></tr>`;
    }).join('')}
    </tbody></table></section>
  ${recordsCard()}
  ${bodyCard()}`;
}

const latestBW = () => state.body.length ? state.body[state.body.length - 1].w : null;

function recordsCard() {
  const bw = latestBW();
  const rows = state.exercises.map(e => ({ e, b: bestsFor(e.id, state.sessions) })).filter(r => r.b.sets.length)
    .sort((a, b) => (b.e.kind === 'main') - (a.e.kind === 'main'));
  if (!rows.length) return '';
  return `<section class="card"><h3>Records</h3>
    <table class="lifts"><thead><tr><th>Exercise</th><th>Heaviest</th><th>Est. max</th>${bw ? '<th>× body</th>' : ''}</tr></thead><tbody>
    ${rows.map(({ e, b }) => `<tr><td><span class="dot ${e.day}"></span>${esc(e.name)}</td><td>${fmt(b.heavy)} × ${b.heavyReps}</td>
      <td>${fmt(Math.round(b.e1rm))}</td>${bw ? `<td>${e.kind === 'main' ? `${(b.e1rm / bw).toFixed(2)}×` : '–'}</td>` : ''}</tr>`).join('')}
    </tbody></table>
    ${bw ? '<p class="hint">× body is estimated max divided by your latest bodyweight, shown for squat, deadlift and bench.</p>' : ''}</section>`;
}

function bodyCard() {
  const bw = latestBW(), first = state.body[0]?.w;
  const today = new Date().toISOString().slice(0, 10);
  const loggedToday = state.body.some(x => x.d.slice(0, 10) === today);
  return `<section class="card chart-card"><h3>Bodyweight</h3>
    <p class="sub">${bw ? `${kg(bw)}${first && first !== bw ? `, ${bw > first ? '+' : ''}${fmt(r2(bw - first))} since ${dShort(state.body[0].d)}` : ''}` : 'Weigh in now and then, ideally in the morning'}</p>
    ${state.body.length ? '<div class="chart" id="cBody"></div>' : ''}
    <div class="row" style="margin-top:10px"><label class="wt-in"><input id="bwIn" type="number" inputmode="decimal" step="0.1" min="0" placeholder="${bw ?? 'kg'}"><em>${UNIT}</em></label>
      <button class="btn small" data-action="logBW">${loggedToday ? 'Update today' : 'Log weight'}</button></div></section>`;
}

// Front and back figure. Shading: none, hit in one session, hit in two or more sessions (primary muscle).
const BODY_SHAPES = [
  // front
  ['', '<circle cx="80" cy="20" r="13"/><rect x="74" y="32" width="12" height="9"/>'],
  ['sideDelts', '<ellipse cx="50" cy="58" rx="6" ry="11"/><ellipse cx="110" cy="58" rx="6" ry="11"/>'],
  ['frontDelts', '<ellipse cx="59" cy="53" rx="9" ry="9"/><ellipse cx="101" cy="53" rx="9" ry="9"/>'],
  ['chest', '<rect x="61" y="46" width="18" height="26" rx="6"/><rect x="81" y="46" width="18" height="26" rx="6"/>'],
  ['biceps', '<rect x="41" y="70" width="11" height="28" rx="5"/><rect x="108" y="70" width="11" height="28" rx="5"/>'],
  ['', '<rect x="37" y="101" width="11" height="32" rx="5"/><rect x="112" y="101" width="11" height="32" rx="5"/><rect x="64" y="75" width="32" height="44" rx="6"/>'],
  ['quads', '<rect x="57" y="122" width="15" height="64" rx="7"/><rect x="88" y="122" width="15" height="64" rx="7"/>'],
  ['adductors', '<rect x="73" y="124" width="6" height="46" rx="3"/><rect x="81" y="124" width="6" height="46" rx="3"/>'],
  ['', '<rect x="58" y="189" width="14" height="8" rx="4"/><rect x="88" y="189" width="14" height="8" rx="4"/><rect x="59" y="200" width="12" height="44" rx="5"/><rect x="89" y="200" width="12" height="44" rx="5"/>'],
  // back
  ['', '<circle cx="240" cy="20" r="13"/><rect x="234" y="32" width="12" height="9"/>'],
  ['upperBack', '<path d="M240 38 L218 52 L226 66 L240 90 L254 66 L262 52 Z"/>'],
  ['sideDelts', '<ellipse cx="210" cy="58" rx="6" ry="11"/><ellipse cx="270" cy="58" rx="6" ry="11"/>'],
  ['rearDelts', '<ellipse cx="219" cy="54" rx="9" ry="9"/><ellipse cx="261" cy="54" rx="9" ry="9"/>'],
  ['triceps', '<rect x="201" y="70" width="11" height="28" rx="5"/><rect x="268" y="70" width="11" height="28" rx="5"/>'],
  ['', '<rect x="197" y="101" width="11" height="32" rx="5"/><rect x="272" y="101" width="11" height="32" rx="5"/>'],
  ['lats', '<path d="M222 64 L236 92 L236 112 L226 110 L216 80 Z"/><path d="M258 64 L244 92 L244 112 L254 110 L264 80 Z"/>'],
  ['lowerBack', '<rect x="230" y="94" width="20" height="24" rx="5"/>'],
  ['abductors', '<ellipse cx="221" cy="123" rx="7" ry="7"/><ellipse cx="259" cy="123" rx="7" ry="7"/>'],
  ['glutes', '<rect x="223" y="122" width="16" height="28" rx="8"/><rect x="241" y="122" width="16" height="28" rx="8"/>'],
  ['hamstrings', '<rect x="221" y="153" width="16" height="38" rx="7"/><rect x="243" y="153" width="16" height="38" rx="7"/>'],
  ['', '<rect x="222" y="192" width="14" height="6" rx="3"/><rect x="244" y="192" width="14" height="6" rx="3"/>'],
  ['calves', '<rect x="222" y="200" width="14" height="40" rx="6"/><rect x="244" y="200" width="14" height="40" rx="6"/>'],
];

function muscleCard() {
  const ws = weekStart(new Date());
  if (ui.mWeek) ws.setDate(ws.getDate() - 7);
  const data = muscleWeek(ws);
  const lvl = m => Math.min(2, data[m].sessions.size);
  const svg = `<svg class="bodymap" viewBox="0 0 320 262" role="img" aria-label="Muscles trained this week">
    ${BODY_SHAPES.map(([m, shape]) => m
      ? `<g class="bm h${lvl(m)}" data-action="muscle" data-m="${m}"><title>${MUSCLES[m]}</title>${shape}</g>`
      : `<g class="bm-base">${shape}</g>`).join('')}
    <text x="80" y="258" text-anchor="middle" class="ax">Front</text><text x="240" y="258" text-anchor="middle" class="ax">Back</text></svg>`;
  const rows = Object.keys(MUSCLES).map(m => {
    const sets = data[m].sets;
    return `<tr data-action="muscle" data-m="${m}"><td>${MUSCLES[m]}</td><td>${data[m].sessions.size || '–'}</td><td>${sets ? fmt(r2(sets)) : '–'}</td>
      <td class="setbar"><span class="band"></span><span class="fill" style="width:${Math.min(100, sets / 25 * 100)}%"></span></td></tr>`;
  }).join('');
  return `<section class="card">
    <div class="row between"><h3>Muscles ${ui.mWeek ? 'last week' : 'this week'}</h3>
      <div class="seg mini">${['This week', 'Last week'].map((l, i) => `<button data-action="mWeek" data-w="${i}" class="${(ui.mWeek || 0) === i ? 'on' : ''}">${l}</button>`).join('')}</div></div>
    ${svg}
    <div class="legend"><span><i class="lg h0"></i>Not trained</span><span><i class="lg h1"></i>Once</span><span><i class="lg h2"></i>Twice or more</span></div>
    <p class="hint" id="mInfo">Tap a muscle for details.</p>
    <table class="lifts msets"><thead><tr><th>Muscle</th><th>Sessions</th><th>Sets</th><th>10–20 sets</th></tr></thead><tbody>${rows}</tbody></table>
    <p class="hint">Research on muscle growth points to roughly 10–20 hard sets per muscle per week (the shaded band). Main muscles count a full set, helping muscles half a set.</p>
  </section>`;
}

function drawCharts() {
  if ($('#cBody')) {
    lineChart($('#cBody'), {
      pts: state.body.map(b => ({ x: new Date(b.d).getTime(), y: b.w })), color: 'var(--accent)', label: 'Bodyweight',
      tip: p => `<b>${kg(p.y)}</b><br>${dShort(p.x)}`,
    });
  }
  const ex = byId(ui.exId);
  if (!ex) return;
  const color = `var(--${ex.day})`;
  const { weight, amrap, e1rm } = exerciseSeries(ex);
  const why = { start: 'Starting weight', up: 'Moved up', down: 'Too heavy, lowered', deload: 'Deload', edit: 'Edited', now: 'Today' };

  lineChart($('#cWeight'), {
    pts: weight, step: true, color, label: `${ex.name} working weight`,
    tip: p => `<b>${kg(p.y)}</b><br>${why[p.why] || ''} · ${dShort(p.x)}`,
  });
  barChart($('#cAmrap'), {
    bars: amrap.map(p => ({ ...p, color: p.y >= p.target ? color : 'var(--muted)', dim: p.y < p.target })),
    ref: ex.target, label: `${ex.name} AMRAP reps`,
    tip: p => `<b>${p.y} reps</b> @ ${kg(p.w)}<br>${p.y >= p.target ? 'Hit' : 'Missed'} target ${p.target} · ${dShort(p.x)}`,
  });
  lineChart($('#cE1rm'), {
    pts: e1rm, color, label: `${ex.name} estimated one-rep max`,
    tip: p => `<b>~${kg(Math.round(p.y))}</b><br>${dShort(p.x)}`,
  });
  stackChart($('#cVol'), weeklyVolume());
}

/* ---------- SVG charts ---------- */

function niceTicks(lo, hi, n = 4) {
  const raw = (hi - lo) / n || 1;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const norm = raw / mag;
  const step = (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10) * mag;
  const out = [];
  for (let v = Math.floor(lo / step) * step; v <= Math.ceil(hi / step) * step + step / 1e6; v += step) out.push(r2(v));
  return out;
}

const tickLabel = v => v >= 10000 ? `${r2(v / 1000)}k` : fmt(v);

function axisY(ticks, Y, m, W) {
  return ticks.map(v => `<line class="grid" x1="${m.l}" x2="${W - m.r}" y1="${Y(v)}" y2="${Y(v)}"/>
    <text class="ax" x="${m.l - 6}" y="${Y(v) + 4}" text-anchor="end">${tickLabel(v)}</text>`).join('');
}

function axisX(x0, x1, H, m, W, label = dShort) {
  return `<text class="ax" x="${m.l}" y="${H - 4}">${label(x0)}</text>
    <text class="ax" x="${W - m.r}" y="${H - 4}" text-anchor="end">${label(x1)}</text>`;
}

function hover(host, svg, anchors, W, html, focus) {
  const tip = document.createElement('div');
  tip.className = 'tip';
  host.appendChild(tip);
  const at = e => {
    const r = svg.getBoundingClientRect();
    const x = (e.clientX - r.left) * W / r.width;
    let bi = 0;
    anchors.forEach((a, i) => { if (Math.abs(a - x) < Math.abs(anchors[bi] - x)) bi = i; });
    tip.innerHTML = html(bi);
    tip.classList.add('on');
    const px = anchors[bi] * r.width / W, tw = tip.offsetWidth;
    tip.style.left = `${Math.max(0, Math.min(r.width - tw, px - tw / 2))}px`;
    focus(bi);
  };
  const off = () => { tip.classList.remove('on'); focus(-1); };
  svg.addEventListener('pointermove', at);
  svg.addEventListener('pointerdown', at);
  svg.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') off(); });
  host._off = off;
}

function lineChart(host, { pts, step, color, tip, label }) {
  if (!pts.length) { host.innerHTML = '<p class="empty">No data yet. Log a workout with this exercise.</p>'; return; }
  const W = Math.max(260, host.clientWidth), H = 180, m = { l: 40, r: 12, t: 40, b: 22 };
  let x0 = pts[0].x, x1 = pts[pts.length - 1].x;
  if (x1 - x0 < DAY_MS) { x0 -= 3 * DAY_MS; x1 += 3 * DAY_MS; }
  const ys = pts.map(p => p.y);
  let lo = Math.min(...ys), hi = Math.max(...ys);
  if (hi - lo < 1) { lo -= 2.5; hi += 2.5; }
  lo = Math.max(0, lo);
  const t = niceTicks(lo, hi), y0 = t[0], y1 = t[t.length - 1];
  const X = v => m.l + (v - x0) / (x1 - x0) * (W - m.l - m.r);
  const Y = v => m.t + (1 - (v - y0) / (y1 - y0)) * (H - m.t - m.b);
  const d = pts.map((p, i) => i === 0 ? `M${X(p.x)},${Y(p.y)}` : step ? `H${X(p.x)}V${Y(p.y)}` : `L${X(p.x)},${Y(p.y)}`).join('');
  const marks = pts.length <= 40 ? pts.map(p => `<circle class="mk" cx="${X(p.x)}" cy="${Y(p.y)}" r="4" fill="${color}"/>`).join('') : '';
  host.innerHTML = `<svg class="viz" viewBox="0 0 ${W} ${H}" width="100%" height="${H}" role="img" aria-label="${esc(label)}">
    ${axisY(t, Y, m, W)}${axisX(x0, x1, H, m, W)}
    <line class="xh" x1="-99" x2="-99" y1="${m.t - 6}" y2="${H - m.b}"/>
    <path d="${d}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
    ${marks}<circle class="hl" r="6" cx="-99" cy="-99" fill="${color}"/></svg>`;
  const svg = $('svg', host), xh = $('.xh', svg), hl = $('.hl', svg);
  hover(host, svg, pts.map(p => X(p.x)), W, i => tip(pts[i]), i => {
    const x = i < 0 ? -99 : X(pts[i].x);
    xh.setAttribute('x1', x); xh.setAttribute('x2', x);
    hl.setAttribute('cx', x); hl.setAttribute('cy', i < 0 ? -99 : Y(pts[i].y));
  });
}

// Bar path with 4px rounded top, flat on the baseline.
function barPath(x, y, w, base) {
  const h = base - y, r = Math.min(4, w / 2, h);
  if (h <= 0) return '';
  return `M${x},${base}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${base}Z`;
}

function barChart(host, { bars, ref, tip, label }) {
  bars = bars.slice(-16);
  if (!bars.length) { host.innerHTML = '<p class="empty">No AMRAP sets logged for this exercise yet.</p>'; return; }
  const W = Math.max(260, host.clientWidth), H = 180, m = { l: 32, r: 12, t: 40, b: 22 };
  const t = niceTicks(0, Math.max(ref || 0, ...bars.map(b => b.y)) * 1.05), y1 = t[t.length - 1];
  const Y = v => m.t + (1 - v / y1) * (H - m.t - m.b);
  const band = (W - m.l - m.r) / bars.length, bw = Math.min(26, band - 2);
  const cx = i => m.l + band * i + band / 2;
  const rects = bars.map((b, i) => `<path class="bar" d="${barPath(cx(i) - bw / 2, Y(b.y), bw, Y(0))}" fill="${b.color}" ${b.dim ? 'fill-opacity=".45"' : ''}/>`).join('');
  const refY = Y(ref);
  host.innerHTML = `<svg class="viz" viewBox="0 0 ${W} ${H}" width="100%" height="${H}" role="img" aria-label="${esc(label)}">
    ${axisY(t, Y, m, W)}${axisX(bars[0].x, bars[bars.length - 1].x, H, m, W)}
    ${rects}<line class="base" x1="${m.l}" x2="${W - m.r}" y1="${Y(0)}" y2="${Y(0)}"/>
    ${ref ? `<line class="ref" x1="${m.l}" x2="${W - m.r}" y1="${refY}" y2="${refY}"/>` : ''}</svg>`;
  const svg = $('svg', host), els = svg.querySelectorAll('.bar');
  hover(host, svg, bars.map((_, i) => cx(i)), W, i => tip(bars[i]), i => {
    svg.classList.toggle('focusing', i >= 0);
    els.forEach((el, j) => el.classList.toggle('f', j === i));
  });
}

function stackChart(host, cols) {
  if (!cols.some(c => c.push + c.pull + c.legs > 0)) { host.innerHTML = '<p class="empty">No workouts in the last 10 weeks.</p>'; return; }
  const W = Math.max(260, host.clientWidth), H = 190, m = { l: 40, r: 12, t: 40, b: 22 };
  const t = niceTicks(0, Math.max(...cols.map(c => c.push + c.pull + c.legs))), y1 = t[t.length - 1];
  const Y = v => m.t + (1 - v / y1) * (H - m.t - m.b);
  const band = (W - m.l - m.r) / cols.length, bw = Math.min(30, band - 4);
  const cx = i => m.l + band * i + band / 2;
  const GAP = 2;
  const segs = cols.map((c, i) => {
    let acc = 0, out = '';
    const top = DAYS.filter(d => c[d] > 0).pop();
    for (const d of DAYS) {
      if (!c[d]) continue;
      const yb = Y(acc), yt = Y(acc + c[d]);
      acc += c[d];
      const x = cx(i) - bw / 2, base = yb - (acc - c[d] > 0 ? GAP : 0);
      out += d === top
        ? `<path d="${barPath(x, yt, bw, base)}" fill="var(--${d})"/>`
        : `<rect x="${x}" y="${yt}" width="${bw}" height="${Math.max(0, base - yt)}" fill="var(--${d})"/>`;
    }
    return `<g class="bar">${out}</g>`;
  }).join('');
  host.innerHTML = `<svg class="viz" viewBox="0 0 ${W} ${H}" width="100%" height="${H}" role="img" aria-label="Weekly volume by day">
    ${axisY(t, Y, m, W)}${axisX(cols[0].x, cols[cols.length - 1].x, H, m, W, x => `wk ${dShort(x)}`)}
    ${segs}<line class="base" x1="${m.l}" x2="${W - m.r}" y1="${Y(0)}" y2="${Y(0)}"/></svg>`;
  const svg = $('svg', host), els = svg.querySelectorAll('.bar');
  hover(host, svg, cols.map((_, i) => cx(i)), W, i => {
    const c = cols[i], tot = c.push + c.pull + c.legs;
    return `<b>Week of ${dShort(c.x)}</b><br>${DAYS.filter(d => c[d]).map(d => `${DAY_LABEL[d]} ${fmt(c[d])}`).join(' · ') || 'Rest week'}${tot ? `<br>Total ${fmt(tot)} ${UNIT}` : ''}`;
  }, i => {
    svg.classList.toggle('focusing', i >= 0);
    els.forEach((el, j) => el.classList.toggle('f', j === i));
  });
}

/* ---------- sheet, toast, timers ---------- */

function openSheet(html) {
  $('#sheet .panel').innerHTML = `<button class="x" data-action="closeSheet" aria-label="Close">×</button>${html}`;
  $('#sheet').hidden = false;
}
function closeSheet() { $('#sheet').hidden = true; }

let toastT;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('on');
  clearTimeout(toastT);
  toastT = setTimeout(() => t.classList.remove('on'), 2400);
}

// Rest timer: counts down after each ticked set, beeps at zero, then counts up so you can see how far over you are.
// The end time is saved with the workout, so the timer is still right if iOS suspends or reloads the app.
const rest = { end: 0, iv: null, beeped: false };
function startRest(sec) {
  if (sec) runRest(Date.now() + sec * 1000);
}
function runRest(end) {
  rest.end = end;
  rest.beeped = end <= Date.now();
  if (state.active) { state.active.restEnd = end; save(); }
  clearInterval(rest.iv);
  rest.iv = setInterval(showRest, 250);
  showRest();
}
function showRest() {
  const left = Math.ceil((rest.end - Date.now()) / 1000);
  if (left < -600) return stopRest();
  $('#restBar').hidden = false;
  $('#restBar').classList.toggle('go', left <= 0);
  $('#restLabel').textContent = left > 0 ? 'Rest' : 'Next set';
  $('#restTime').textContent = left > 0 ? mmss(left) : `+${mmss(-left)}`;
  if (left <= 0 && !rest.beeped) {
    rest.beeped = true;
    if (left > -5) beep(); // don't beep late after the app was in the background
  }
}

// Keeps the screen on during a workout (Screen Wake Lock API, iOS 16.4+), since iOS pauses web apps when the phone locks.
let wakeLock = null;
async function keepAwake() {
  const want = !!state.active && state.settings.awake !== false && document.visibilityState === 'visible';
  try {
    if (want && !wakeLock && 'wakeLock' in navigator) {
      wakeLock = await navigator.wakeLock.request('screen');
      wakeLock.addEventListener('release', () => { wakeLock = null; });
    } else if (!want && wakeLock) {
      await wakeLock.release();
      wakeLock = null;
    }
  } catch (e) { /* not supported or denied */ }
}

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState !== 'visible') return;
  keepAwake();
  tickElapsed();
  if (state.active?.restEnd && !$('#restBar').hidden) showRest();
});

let actx;
function primeAudio() {
  try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); actx.resume(); } catch (e) { /* no audio */ }
}
function beep() {
  navigator.vibrate?.(300);
  if (!actx) return;
  [0, 0.3].forEach(t => {
    const o = actx.createOscillator(), g = actx.createGain(), at = actx.currentTime + t;
    o.frequency.value = 880;
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(0.35, at + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, at + 0.2);
    o.connect(g).connect(actx.destination);
    o.start(at); o.stop(at + 0.22);
  });
}
function stopRest() {
  clearInterval(rest.iv);
  $('#restBar').hidden = true;
  if (state.active?.restEnd) { delete state.active.restEnd; save(); }
}

function tickElapsed() {
  const el = $('#elapsed');
  if (el && state.active) el.textContent = mmss(Math.floor((Date.now() - state.active.start) / 1000));
}
setInterval(tickElapsed, 1000);

/* ---------- data import / export ---------- */

async function exportData() {
  const name = `ppl-backup-${new Date().toISOString().slice(0, 10)}.json`;
  const blob = new Blob([JSON.stringify(state)], { type: 'application/json' });
  try {
    const file = new File([blob], name, { type: 'application/json' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], title: 'PPL backup' });
      backedUp();
      return;
    }
  } catch (e) { if (e.name === 'AbortError') return; }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  backedUp();
}

function backedUp() {
  state.lastBackup = Date.now();
  save();
  if (ui.tab === 'today' && !state.active) render();
}

function importData(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const s = JSON.parse(reader.result);
      if (!Array.isArray(s.exercises) || !Array.isArray(s.sessions)) throw new Error('bad file');
      if (!confirm(`Replace everything on this phone with the backup (${s.sessions.length} workouts)?`)) return;
      state = upgrade(s);
      save(); render(); toast('Backup restored');
    } catch (e) { toast('That file is not a PPL backup'); }
  };
  reader.readAsText(file);
  $('#importFile').value = '';
}

/* ---------- events ---------- */

const actions = {
  tab: b => { ui.tab = b.dataset.tab; window.scrollTo(0, 0); render(); },
  perWeek: b => { state.settings.perWeek = +b.dataset.n; save(); render(); },
  finishSetup: () => {
    const now = new Date();
    state.exercises.filter(e => e.inPlan).forEach(e => { e.weight = Number(e.weight) || 0; e.log = [{ d: now.toISOString(), w: e.weight, why: 'start' }]; });
    state.setupDone = true;
    save();
    navigator.storage?.persist?.();
    render();
  },
  pickDay: b => { ui.day = b.dataset.day; ui.test = null; render(); },
  toggleTest: () => { const day = ui.day || nextDay(); ui.test = !(ui.test ?? testDue(day)); render(); },
  pick: () => {
    const day = ui.day || nextDay();
    openSheet(pickerHtml(day, ui.test ?? testDue(day)));
    updatePicker();
  },
  startPicked: b => {
    const day = b.dataset.day, ids = pickedIds();
    const noWeight = ids.map(byId).find(e => e.weight == null);
    if (noWeight) {
      toast(`Enter a starting weight for ${noWeight.name}`);
      $(`[data-bind="pickW"][data-id="${noWeight.id}"]`).focus();
      return;
    }
    const now = new Date().toISOString();
    state.exercises.filter(e => e.day === day).forEach(e => {
      e.inPlan = ids.includes(e.id);
      if (e.inPlan && !e.log.length) e.log.push({ d: now, w: e.weight, why: 'start' });
    });
    closeSheet();
    startWorkout(day, ui.test ?? testDue(day), ids);
  },
  toggleSet: b => {
    const en = state.active.entries[b.dataset.e], j = +b.dataset.s, s = en.sets[j];
    const am = en.amrap && j === en.sets.length - 1;
    if (!s.done && (s.reps === '' || s.reps === null)) {
      if (am) { toast('Enter how many reps you got first'); $(`[data-bind="setR"][data-e="${b.dataset.e}"][data-s="${j}"]`).focus(); return; }
      s.reps = en.reps;
    }
    s.done = !s.done;
    save();
    primeAudio();
    // In a superset the rest comes after the second exercise, so go straight to it.
    const i = +b.dataset.e, partner = state.active.entries[i + 1];
    if (s.done && en.ss && partner) { stopRest(); toast(`Now ${partner.name}`); }
    else if (s.done) startRest(restFor(en));
    render();
  },
  finish: () => finishWorkout(),
  entryMenu: b => openSheet(entryMenuHtml(+b.dataset.e)),
  entryMove: b => {
    const es = state.active.entries, i = +b.dataset.e, j = i + Number(b.dataset.dir);
    if (!es[j]) return;
    [es[i], es[j]] = [es[j], es[i]];
    es.forEach(en => { delete en.ss; }); // reordering breaks superset pairs
    save(); closeSheet(); render();
  },
  entrySuperset: b => {
    const es = state.active.entries, i = +b.dataset.e;
    if (es[i].ss) delete es[i].ss;
    else {
      if (es[i - 1]) delete es[i - 1].ss; // an exercise is in one pair at most
      delete es[i + 1]?.ss;
      es[i].ss = true;
    }
    save(); closeSheet(); render();
  },
  entrySet: b => {
    const en = state.active.entries[b.dataset.e];
    if (Number(b.dataset.dir) > 0) {
      const set = { reps: en.reps, done: false };
      // keep the AMRAP set last
      if (en.amrap) en.sets.splice(en.sets.length - 1, 0, set); else en.sets.push(set);
    } else if (en.sets.length > 1) {
      en.sets.splice(en.amrap ? en.sets.length - 2 : en.sets.length - 1, 1);
    }
    save(); closeSheet(); render();
  },
  entryRemove: b => {
    const es = state.active.entries, i = +b.dataset.e;
    if (es[i].sets.some(s => s.done) && !confirm(`Remove ${es[i].name} and its logged sets from today?`)) return;
    if (es[i - 1]) delete es[i - 1].ss;
    es.splice(i, 1);
    save(); closeSheet(); render();
  },
  saveNote: b => {
    byId(b.dataset.id).note = $('#fNote').value.trim();
    save(); closeSheet(); render();
  },
  addToWorkout: () => openSheet(addToWorkoutHtml()),
  addEntry: b => {
    const e = byId(b.dataset.id);
    if (e.weight == null) {
      toast(`Enter a starting weight for ${e.name}`);
      $(`[data-bind="pickW"][data-id="${e.id}"]`)?.focus();
      return;
    }
    if (!e.log.length) e.log.push({ d: new Date().toISOString(), w: e.weight, why: 'start' });
    state.active.entries.push(makeEntry(e, state.active.test));
    save(); closeSheet(); render();
    $(`#en-${state.active.entries.length - 1}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  },
  editSession: b => openSheet(editSessionHtml(state.sessions.find(s => s.id === b.dataset.id))),
  saveSession: b => {
    const s = state.sessions.find(x => x.id === b.dataset.id);
    saveSession(s);
    render();
    openSheet(sessionDetailHtml(s));
  },
  deloadStart: () => {
    state.deload = { start: Date.now(), end: Date.now() + 7 * DAY_MS };
    save(); render(); toast('Deload week started');
  },
  deloadEnd: () => {
    state.lastDeload = Date.now();
    state.deload = null;
    save(); render();
  },
  snooze: b => {
    state.snooze[b.dataset.k] = Date.now() + Number(b.dataset.days) * DAY_MS;
    save(); render();
  },
  mWeek: b => { ui.mWeek = +b.dataset.w; render(); },
  muscle: b => {
    const m = b.dataset.m, ws = weekStart(new Date());
    if (ui.mWeek) ws.setDate(ws.getDate() - 7);
    const d = muscleWeek(ws)[m];
    $('#mInfo').innerHTML = `<b>${MUSCLES[m]}</b>: ${d.sessions.size ? `trained in ${d.sessions.size} session${d.sessions.size > 1 ? 's' : ''}` : 'not trained'}, ${fmt(r2(d.sets))} sets ${ui.mWeek ? 'last week' : 'this week'}.`;
    document.querySelectorAll('.bodymap .bm').forEach(g => g.classList.toggle('sel', g.dataset.m === m));
  },
  logBW: () => {
    const w = Number($('#bwIn').value);
    if (!(w > 0)) { toast('Enter your bodyweight'); return; }
    const today = new Date().toISOString().slice(0, 10);
    state.body = state.body.filter(x => x.d.slice(0, 10) !== today);
    state.body.push({ d: new Date().toISOString(), w });
    save(); render(); toast('Bodyweight logged');
  },
  discard: () => { if (confirm('Discard this workout? Nothing will be saved.')) discardWorkout(); },
  restAdd: () => runRest(Math.max(rest.end, Date.now()) + 30000),
  restSkip: () => stopRest(),
  closeSheet: () => { closeSheet(); },
  openSession: b => openSheet(sessionDetailHtml(state.sessions.find(s => s.id === b.dataset.id))),
  deleteSession: b => {
    if (!confirm('Delete this workout from history? Current weights are not changed.')) return;
    state.sessions = state.sessions.filter(s => s.id !== b.dataset.id);
    save(); closeSheet(); render();
  },
  progDay: b => { ui.progDay = b.dataset.day; render(); },
  editEx: b => openSheet(editExHtml(byId(b.dataset.id))),
  addEx: () => {
    const e = newExercise({ day: ui.progDay });
    state.exercises.push(e);
    save(); render();
    openSheet(editExHtml(e));
    $('#fName').select();
  },
  saveEx: b => {
    const e = byId(b.dataset.id);
    const num = (id, min) => { const v = Number($(id).value); return isNaN(v) ? min : Math.max(min, v); };
    e.name = $('#fName').value.trim() || 'Exercise';
    e.day = $('#fDay').value;
    e.sets = Math.round(num('#fSets', 1));
    e.reps = Math.round(num('#fReps', 1));
    e.target = Math.round(num('#fTarget', 1));
    e.inc = num('#fInc', 0);
    e.amrap = $('#fAmrap').checked;
    e.rest = Number($('#fRest').value);
    e.inPlan = $('#fPlan').checked;
    e.note = $('#fNote').value.trim();
    if ($('#fMuscle')) e.muscles = $('#fMuscle').value ? P([$('#fMuscle').value]) : undefined;
    const w = $('#fWeight').value === '' ? null : num('#fWeight', 0);
    if (w !== null && !e.log.length) {
      e.weight = w;
      e.log.push({ d: new Date().toISOString(), w, why: 'start' });
    } else if (w !== null && w !== e.weight) {
      // Editing the weight of a brand-new exercise sets its starting point rather than logging a change.
      if (e.log.length === 1 && e.log[0].why === 'start' && !state.sessions.some(s => s.entries.some(en => en.exId === e.id))) {
        e.weight = w; e.log[0].w = w;
      } else setWeight(e, w, 'edit');
    }
    ui.progDay = e.day;
    save(); closeSheet(); render(); toast('Saved');
  },
  deleteEx: b => {
    const e = byId(b.dataset.id);
    if (!confirm(`Delete ${e.name}? Its past workouts stay in History.`)) return;
    state.exercises = state.exercises.filter(x => x.id !== e.id);
    save(); closeSheet(); render();
  },
  move: b => {
    const e = byId(b.dataset.id);
    const same = state.exercises.filter(x => x.day === e.day);
    const other = same[same.indexOf(e) + Number(b.dataset.dir)];
    if (!other) return;
    const ia = state.exercises.indexOf(e), ib = state.exercises.indexOf(other);
    [state.exercises[ia], state.exercises[ib]] = [state.exercises[ib], state.exercises[ia]];
    save(); render();
  },
  pickExRow: b => { ui.exId = b.dataset.id; render(); window.scrollTo({ top: 0, behavior: 'smooth' }); },
  howProgress: (b, e) => { e.preventDefault(); openSheet(howHtml()); },
  export: () => exportData(),
  import: () => $('#importFile').click(),
  reset: () => {
    if (!confirm('Erase all exercises, weights and workout history on this phone?')) return;
    if (!confirm('Really erase everything? This cannot be undone. Export a backup first if unsure.')) return;
    state = fresh(); save(); ui.tab = 'today'; render();
  },
};

document.addEventListener('click', e => {
  const b = e.target.closest('[data-action]');
  if (b && !b.disabled && actions[b.dataset.action]) actions[b.dataset.action](b, e);
  // Tapping outside a chart hides its tooltip on touch screens.
  document.querySelectorAll('.chart').forEach(c => { if (c._off && !c.contains(e.target)) c._off(); });
});

document.addEventListener('input', e => {
  const t = e.target, bind = t.dataset.bind;
  if (bind === 'setupW' || bind === 'pickW') { byId(t.dataset.id).weight = t.value === '' ? null : Number(t.value); save(); }
  else if (bind === 'enW') {
    const en = state.active.entries[t.dataset.e];
    en.weight = Number(t.value) || 0;
    const g = $(`#goal-${t.dataset.e}`);
    if (g) g.innerHTML = goalHtml(en);
    save();
  } else if (bind === 'setR') {
    state.active.entries[t.dataset.e].sets[t.dataset.s].reps = t.value === '' ? '' : Number(t.value);
    save();
  }
});

document.addEventListener('change', e => {
  const t = e.target, bind = t.dataset.bind;
  if (bind === 'setR' && state.active.entries[t.dataset.e].sets[t.dataset.s].done) render();
  else if (bind === 'pickEx') { ui.exId = t.value; render(); }
  else if (bind === 'rest') { state.settings.rest = t.value === 'auto' ? 'auto' : Number(t.value); save(); }
  else if (bind === 'deloadAfter' || bind === 'deloadPct' || bind === 'deloadEvery') { state.settings[bind] = Number(t.value); save(); }
  else if (bind === 'pickToggle') updatePicker();
  else if (bind === 'awake') { state.settings.awake = t.value === 'on'; save(); keepAwake(); }
  else if (bind === 'progression') { state.settings.progression = t.value; save(); }
  else if (bind === 'importFile') importData(t.files[0]);
});

let resizeT, lastW = window.innerWidth;
window.addEventListener('resize', () => {
  clearTimeout(resizeT);
  resizeT = setTimeout(() => {
    if (ui.tab === 'progress' && window.innerWidth !== lastW) drawCharts();
    lastW = window.innerWidth;
  }, 150);
});

// Pick the rest timer back up if the app was closed mid-rest.
if (state.active?.restEnd && Date.now() - state.active.restEnd < 600e3) runRest(state.active.restEnd);

if ('serviceWorker' in navigator && location.protocol === 'https:') {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}

render();
