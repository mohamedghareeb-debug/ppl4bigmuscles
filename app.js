'use strict';

/* ---------- constants ---------- */

const KEY = 'ppl-overload-v1';
const DAYS = ['push', 'pull', 'legs'];
const DAY_LABEL = { push: 'Push', pull: 'Pull', legs: 'Legs' };
const DAY_FOCUS = { push: 'Chest, shoulders, triceps', pull: 'Back, rear delts, biceps', legs: 'Quads, hamstrings, calves' };
const UNIT = 'kg';
const DAY_MS = 864e5;

// [day, name, sets, reps, AMRAP target to move up, increment kg, rest s, kind, in default template, alternative to, progression]
// progression: weight (default), 'reps' for bodyweight moves, 'time' for holds (reps are then seconds).
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
  ['push', 'Dips', 3, 8, 12, 0, 120, 'compound', 0, null, 'reps'],
  ['push', 'Push-up', 3, 12, 16, 0, 90, 'compound', 0, null, 'reps'],
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
  ['pull', 'Dumbbell Curl', 3, 10, 15, 1, 90, 'iso', 0, 'Barbell Curl'],
  ['pull', 'Barbell Shrug', 3, 12, 18, 5, 90, 'iso', 0],
  ['pull', 'Pull-up', 3, 5, 8, 0, 150, 'compound', 0, 'Lat Pulldown', 'reps'],
  ['pull', 'Chin-up', 3, 6, 9, 0, 150, 'compound', 0, null, 'reps'],
  ['pull', 'Assisted Pull-up', 3, 8, 12, 5, 120, 'compound', 0, 'Pull-up', 'assist'],
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
  ['legs', 'Dumbbell Romanian Deadlift', 3, 10, 15, 2, 120, 'compound', 0, 'Romanian Deadlift'],
  ['legs', 'Plank', 3, 30, 45, 0, 60, 'iso', 0, null, 'time'],
  ['legs', 'Seated Leg Curl', 3, 12, 16, 5, 90, 'iso', 0, 'Leg Curl'],
  ['legs', 'Seated Calf Raise', 3, 12, 20, 5, 90, 'iso', 0, 'Standing Calf Raise'],
  ['legs', 'Leg Press Calf Raise', 3, 15, 20, 10, 90, 'iso', 0, 'Standing Calf Raise'],
];

const MUSCLES = {
  chest: 'Chest', frontDelts: 'Front delts', sideDelts: 'Side delts', rearDelts: 'Rear delts', triceps: 'Triceps',
  biceps: 'Biceps', lats: 'Lats', upperBack: 'Upper back & traps', lowerBack: 'Lower back', abs: 'Core & abs', quads: 'Quads',
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
  'Dumbbell Shrug': P(['upperBack']), 'Barbell Shrug': P(['upperBack']), 'Dumbbell Curl': P(['biceps']),
  'Dumbbell Romanian Deadlift': HINGE,
  'Dips': P(['chest', 'triceps'], ['frontDelts']), 'Push-up': PRESS, 'Pull-up': PULLDOWN,
  'Chin-up': P(['lats', 'biceps'], ['upperBack']), 'Plank': P(['abs']), 'Assisted Pull-up': PULLDOWN,
  'Barbell Curl': P(['biceps']), 'Preacher Curl': P(['biceps']), 'Hammer Curl': P(['biceps']), 'Incline Dumbbell Curl': P(['biceps']), 'Cable Curl': P(['biceps']),
  'Back Squat': SQUAT, 'Front Squat': SQUAT, 'Hack Squat': SQUAT, 'Smith Machine Squat': SQUAT, 'Goblet Squat': SQUAT,
  'Leg Press': P(['quads'], ['glutes', 'adductors']), 'Leg Extension': P(['quads']),
  'Bulgarian Split Squat': P(['quads', 'glutes'], ['adductors']), 'Walking Lunge': P(['quads', 'glutes'], ['adductors']),
  'Romanian Deadlift': HINGE, 'Stiff-Leg Deadlift': HINGE, 'Hip Thrust': P(['glutes'], ['hamstrings']),
  'Leg Curl': P(['hamstrings']), 'Seated Leg Curl': P(['hamstrings']),
  'Standing Calf Raise': P(['calves']), 'Seated Calf Raise': P(['calves']), 'Leg Press Calf Raise': P(['calves']),
  'Hip Adduction': P(['adductors']), 'Hip Abduction': P(['abductors']),
};

// Exercises done with a pair of dumbbells. They start as weight per dumbbell, the way gym dumbbells are labelled.
const DB_PAIR = new Set(['Incline Dumbbell Press', 'Dumbbell Fly', 'Dumbbell Bench Press', 'Seated Dumbbell Shoulder Press', 'Lateral Raise',
  'Hammer Curl', 'Incline Dumbbell Curl', 'Dumbbell Shrug', 'Bulgarian Split Squat', 'Walking Lunge', 'Dumbbell Curl',
  'Dumbbell Romanian Deadlift']);

// Two versions of one movement, shown as a single exercise with a switch. Only one version is visible at a time
// (the other is `hidden`), and each keeps its own weight and progression because they're different strengths.
// ratio (barbell/dumbbell pairs) = dumbbell load (all dumbbells, kg) ÷ barbell load, used to carry the weight over
// the first time you switch. Dumbbell bench 1RM is about 17% below barbell (Saeterbakken et al. 2011), so presses use
// 0.83; the rest are coaching rules of thumb. The first AMRAP on the new version corrects any error.
const VARIANTS = [
  ['Barbell Bench Press', 'Dumbbell Bench Press', 0.83],
  ['Incline Barbell Bench Press', 'Incline Dumbbell Press', 0.83],
  ['Overhead Press', 'Seated Dumbbell Shoulder Press', 0.83],
  ['Barbell Row', 'One-Arm Dumbbell Row', 0.5],
  ['Barbell Curl', 'Dumbbell Curl', 0.85],
  ['Romanian Deadlift', 'Dumbbell Romanian Deadlift', 0.8],
  ['Barbell Shrug', 'Dumbbell Shrug', 0.9],
  ['Dips', 'Dips (added weight)', null, ['Bodyweight', 'Weighted']],
  ['Pull-up', 'Pull-up (added weight)', null, ['Bodyweight', 'Weighted']],
  ['Chin-up', 'Chin-up (added weight)', null, ['Bodyweight', 'Weighted']],
];

const fromCatalogue = ([day, name, sets, reps, target, inc, rest, kind, inPlan, alt, prog]) => newExercise({
  day, name, sets, reps, target, inc, rest, kind, inPlan: !!inPlan, alt, load: DB_PAIR.has(name) ? 'each' : 'single',
  ...(prog ? { prog, gap: target - reps } : {}),
  ...(prog === 'reps' || prog === 'time' ? { weight: 0 } : {}),
});

// Shows one version of each pair: the one in your plan, else the one trained most recently, else the first listed.
function initVariants(exs) {
  const lastLog = e => e.log.length ? new Date(e.log[e.log.length - 1].d).getTime() : 0;
  for (const [a, b] of VARIANTS) {
    const ea = exs.find(e => e.name === a), eb = exs.find(e => e.name === b);
    if (!ea || !eb || ea.hidden || eb.hidden) continue;
    const showB = (eb.inPlan && !ea.inPlan) || (!ea.inPlan && !eb.inPlan && lastLog(eb) > lastLog(ea));
    const hide = showB ? ea : eb;
    hide.hidden = true;
    hide.inPlan = false;
  }
  return exs;
}

const ICON = {
  check: '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  up: '<svg viewBox="0 0 24 24"><path d="M12 19V5M6 11l6-6 6 6"/></svg>',
  down: '<svg viewBox="0 0 24 24"><path d="M12 5v14M6 13l6 6 6-6"/></svg>',
  hold: '<svg viewBox="0 0 24 24"><path d="M6 9h12M6 15h12"/></svg>',
  skip: '<svg viewBox="0 0 24 24"><path d="M7 12h10"/></svg>',
  chev: '<svg class="chev" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>',
  mvUp: '<svg viewBox="0 0 24 24"><path d="M6 15l6-6 6 6"/></svg>',
  mvDown: '<svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>',
  play: '<svg viewBox="0 0 24 24"><path d="M8 5.5v13l10.5-6.5z"/></svg>',
  flame: '<svg viewBox="0 0 24 24"><path d="M12 3c1 3.5 5 5.5 5 10.5a5 5 0 0 1-10 0c0-2 .8-3.3 2-4.5.3 1.6 1 2.4 2 3 .2-3-.5-6 1-9z"/></svg>',
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

/* ---------- units and dumbbell loads ----------
 * Each exercise stores weights in its own unit ('kg', or 'lb' for machines labelled in pounds) so progression
 * steps land exactly on what the machine has. Totals across exercises (volume, bodyweight ratios) convert to kg.
 * load: 'single' (barbell, machine, one dumbbell), 'each' (pair, weight per dumbbell) or 'total' (pair, both added up).
 * The increment is per dumbbell, so logging totals doubles the jump.
 */
const LB = 0.45359237;
const unitOf = x => (x?.unit === 'lb' ? 'lb' : 'kg');
const loadOf = x => x?.load || 'single';
const stepOf = e => (loadOf(e) === 'total' ? e.inc * 2 : e.inc);
const toKg = (x, w) => (unitOf(x) === 'lb' ? w * LB : w);
// Total load moved, for volume. Assisted moves count bodyweight minus the help, when bodyweight is logged.
const loadKg = (x, w) => (isAssist(x)
  ? Math.max(0, (state.body?.length ? state.body[state.body.length - 1].w : 0) - toKg(x, w))
  : toKg(x, w) * (loadOf(x) === 'each' ? 2 : 1));
const unitLabel = x => `${unitOf(x)}${isAssist(x) ? ' assist' : loadOf(x) === 'each' ? ' each' : loadOf(x) === 'total' ? ' total' : ''}`;
const signed = (x, d) => (d >= 0 ? `+${wt(x, d)}` : `−${wt(x, -d)}`);

/* ---------- bodyweight progression ----------
 * Bodyweight moves progress by reps (holds like the plank by seconds) instead of weight. The "level" is the reps
 * (or seconds) per set; the AMRAP target sits `gap` above it.
 */
const progOf = x => x?.prog || 'weight';
const isBW = x => progOf(x) === 'reps' || progOf(x) === 'time';
// Assisted moves (machine or band): the weight is the help you get, so progress means lowering it.
const isAssist = x => progOf(x) === 'assist';
const levelOf = ex => (isBW(ex) ? ex.reps : ex.weight);
const gapOf = ex => ex.gap ?? Math.max(1, (ex.target - ex.reps) || 4);
const repUnit = x => (progOf(x) === 'time' ? 's' : 'reps');
const rx = e => `${e.sets} × ${e.reps}${progOf(e) === 'time' ? ' s' : ''}`;
const wt = (x, w) => (isBW(x) ? `${fmt(w || 0)} ${repUnit(x)}` : `${fmt(w || 0)} ${unitLabel(x)}`);
// Unit info for a logged entry: the exercise's current settings, falling back to what the entry recorded.
const unitSrc = en => byId(en.exId) || en;

function setLevel(ex, v, why, date = new Date()) {
  if (isBW(ex)) { ex.reps = v; ex.target = v + gapOf(ex); } else ex.weight = v;
  ex.log.push({ d: date.toISOString(), w: v, why });
}

// The other version of an exercise (barbell ↔ dumbbell, bodyweight ↔ weighted), if it has one.
function variantOf(ex) {
  for (const [a, b, ratio, labels = ['Barbell', 'Dumbbells']] of VARIANTS) {
    if (ex?.name === a) return { name: b, toDb: true, ratio, labels, side: 0 };
    if (ex?.name === b) return { name: a, toDb: false, ratio, labels, side: 1 };
  }
  return null;
}

// Starting point on the other version: its own level if you've trained it before; otherwise your current weight
// carried over through the ratio (rounded down to that exercise's step), or the default reps / no added weight
// when switching between bodyweight and weighted.
function variantWeight(from, w, to, v) {
  if (to && to.log.length && levelOf(to) != null) return { w: levelOf(to), estimated: false };
  if (to && isBW(to)) return { w: to.reps, estimated: true };
  if (v.ratio == null) return { w: 0, estimated: true };
  const target = to || { unit: unitOf(from), load: DB_PAIR.has(v.name) ? 'each' : 'single', inc: 2.5 };
  const kgTotal = loadKg(from, w) * (v.toDb ? v.ratio : 1 / v.ratio);
  const raw = (unitOf(target) === 'lb' ? kgTotal / LB : kgTotal) / (loadOf(target) === 'each' ? 2 : 1);
  const step = stepOf(target) || 0.5;
  return { w: Math.max(0, r2(Math.floor(raw / step + 1e-9) * step)), estimated: true };
}

// Switches an exercise to its other version: shows that one in its place (same spot, same plan status) and gives it
// a starting level if it's new. `w` is the weight being used now, which may differ from the saved one mid-workout.
function switchVariant(ex, w = levelOf(ex)) {
  const v = variantOf(ex);
  let to = state.exercises.find(e => e.name === v.name);
  if (!to) {
    to = { ...fromCatalogue(CATALOGUE.find(c => c[1] === v.name)), day: ex.day };
    state.exercises.push(to);
  }
  const t = variantWeight(ex, w, to, v);
  if (t.estimated) {
    to.log = [];
    setLevel(to, t.w, 'start');
  }
  to.hidden = false;
  to.inPlan = ex.inPlan;
  ex.hidden = true;
  ex.inPlan = false;
  state.exercises.splice(state.exercises.indexOf(to), 1);
  state.exercises.splice(state.exercises.indexOf(ex), 0, to);
  return { to, ...t };
}

function variantToggle(ex, ctx, i) {
  const v = variantOf(ex);
  if (!v) return '';
  return `<span class="eq-seg" role="group" aria-label="Version">${v.labels.map((l, k) => k === v.side
    ? `<button class="on" aria-pressed="true">${l}</button>`
    : `<button data-action="variant" data-id="${ex.id}" data-ctx="${ctx}"${i != null ? ` data-e="${i}"` : ''}>${l}</button>`).join('')}</span>`;
}

// Changes the unit (kg ↔ lb) or dumbbell load (each ↔ total) of an exercise and converts its whole history to match.
function convertExercise(ex, { unit = unitOf(ex), load = loadOf(ex) }) {
  let f = 1;
  if (unit !== unitOf(ex)) f *= unit === 'lb' ? 1 / LB : LB;
  const pair = l => l === 'each' || l === 'total';
  if (pair(load) && pair(loadOf(ex)) && load !== loadOf(ex)) f *= load === 'total' ? 2 : 0.5;
  const q = unit === 'lb' ? 0.5 : 0.25;
  const c = w => (w == null ? w : Math.round(w * f / q) * q);
  if (unit !== unitOf(ex)) {
    // Remember the step used in each unit so switching back and forth returns to it.
    ex.incs = { ...ex.incs, [unitOf(ex)]: ex.inc };
    const toLb = { 1: 2.5, 1.25: 2.5, 2: 5, 2.5: 5, 5: 10, 10: 20 }, toKgInc = { 2.5: 1.25, 5: 2.5, 10: 5, 20: 10 };
    ex.inc = ex.incs[unit] ?? (unit === 'lb' ? (toLb[ex.inc] || Math.max(2.5, Math.round(ex.inc / LB / 2.5) * 2.5))
      : (toKgInc[ex.inc] || Math.max(0.5, Math.round(ex.inc * LB * 4) / 4)));
  }
  ex.weight = c(ex.weight);
  ex.log.forEach(l => { l.w = c(l.w); });
  ex.unit = unit;
  ex.load = load;
  const fix = en => { if (en.exId === ex.id) { en.weight = c(en.weight); en.unit = unit; en.load = load; en.inc = stepOf(ex); } };
  state.sessions.forEach(s => {
    s.entries.forEach(fix);
    s.outcomes.forEach(o => { if (o.exId === ex.id) { o.from = c(o.from); o.to = c(o.to); } });
  });
  state.active?.entries.forEach(fix);
}
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

// Assisted moves run the same rule on the load you actually lift (bodyweight minus assistance), then turn the
// result back into assistance. Without a logged bodyweight it assumes 75 kg; only the size of each step depends on it.
function assistProgression(en, reps) {
  const bw = (state.body.length ? state.body[state.body.length - 1].w : 75) / (unitOf(en) === 'lb' ? LB : 1);
  const step = en.inc || 0.5, eff = Math.max(step, bw - en.weight);
  const r = progression({ ...en, prog: 'weight', weight: eff }, reps);
  const to = Math.min(bw, Math.max(0, r2(Math.round((bw - r.to) / step) * step)));
  if (r.status === 'up') return { status: 'up', to: Math.max(0, Math.min(to, r2(en.weight - step))) };
  if (r.status === 'down') return { status: 'down', to: Math.max(to, r2(en.weight + step)) };
  return { status: 'hold', to: en.weight };
}

function progression(en, reps) {
  if (isAssist(en)) return assistProgression(en, reps);
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

/* Bodyweight: hit the target and next session's reps per set become about 75% of what you managed (at least +1),
 * which keeps working sets 2–3 reps short of failure, the effort range RIR-based training recommends (Helms et al. 2016).
 * Fall below the prescribed reps and it drops to about 85% of what you got. Holds work the same in 5 s steps.
 */
function repProgression(en, r) {
  const q = progOf(en) === 'time' ? 5 : 1;
  const round = v => Math.max(q, Math.round(v / q) * q);
  if (r >= en.target) return { status: 'up', to: Math.max(en.reps + q, round(r * 0.75)) };
  if (r < en.reps) return { status: 'down', to: Math.max(q, Math.min(en.reps - q, round(r * 0.85))) };
  return { status: 'hold', to: en.reps };
}

const progressFor = (en, r) => (isBW(en) ? repProgression(en, r) : progression(en, r));

// Rep counts at or above target grouped by the result they lead to, e.g. 12–13 → 62.5, 14 → 65, 15+ → 67.5.
function ladder(en) {
  const out = [];
  const q = progOf(en) === 'time' ? 5 : 1, top = isBW(en) ? en.target + 5 * q : repCap(en);
  for (let r = en.target; r <= top; r += q) {
    const to = progressFor(en, r).to, last = out[out.length - 1];
    if (last && last.to === to) last.hi = r; else out.push({ lo: r, hi: r, to });
  }
  // Bodyweight ladders are short and evenly stepped, so show them whole; weight ladders keep the first three and the top.
  const trimmed = out.length > 4 && !isBW(en) ? [...out.slice(0, 3), out[out.length - 1]] : out;
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
  return Math.round(s.entries.reduce((t, en) => t + en.sets.reduce((u, st) => u + (st.done ? (Number(st.reps) || 0) * loadKg(unitSrc(en), en.weight) : 0), 0), 0));
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
  const b = { e1rm: 0, heavy: 0, heavyReps: 0, maxReps: 0, sets: [] };
  for (const s of sessions) {
    for (const en of s.entries) {
      if (en.exId !== exId) continue;
      for (const st of en.sets) {
        if (!st.done || !(st.reps > 0)) continue;
        if (st.reps <= 20) b.e1rm = Math.max(b.e1rm, epley(en.weight, st.reps));
        if (en.weight > b.heavy || (en.weight === b.heavy && st.reps > b.heavyReps)) { b.heavy = en.weight; b.heavyReps = st.reps; }
        b.maxReps = Math.max(b.maxReps, st.reps);
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
    if (!before.sets.length) continue;
    const now = bestsFor(en.exId, [session]);
    if (!now.sets.length) continue;
    if (isBW(unitSrc(en))) {
      if (now.maxReps > before.maxReps) {
        prs.push({ exId: en.exId, name: en.name, text: progOf(unitSrc(en)) === 'time' ? `longest hold: ${now.maxReps} s` : `most reps in a set: ${now.maxReps}` });
      }
      continue;
    }
    if (isAssist(unitSrc(en))) {
      const lightest = Math.min(...now.sets.map(x => x.w)), prevLight = Math.min(...before.sets.map(x => x.w));
      if (lightest < prevLight) prs.push({ exId: en.exId, name: en.name, text: `least assistance yet: ${wt(unitSrc(en), lightest)}` });
      continue;
    }
    if (!(en.weight > 0)) continue;
    // Being told to lift a heavier weight isn't a record on its own; a better estimated max or more reps than ever at a weight is.
    const top = now.sets.reduce((a, x) => (epley(x.w, x.reps) > epley(a.w, a.reps) ? x : a));
    const bestReps = Math.max(...now.sets.map(x => x.reps));
    const atWeight = before.sets.filter(x => x.w >= en.weight);
    const prevReps = Math.max(0, ...atWeight.map(x => x.reps));
    let text = '';
    const X = unitSrc(en);
    if (now.e1rm > before.e1rm * 1.005) text = `new best estimated max: ~${wt(X, Math.round(now.e1rm))} (${wt(X, top.w)} × ${top.reps})`;
    else if (atWeight.length && bestReps > prevReps) text = `most reps ever at ${wt(X, en.weight)} or more: ${bestReps}`;
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
    v: 7,
    setupDone: false,
    settings: { perWeek: 2, rest: 'auto', deloadAfter: 3, deloadPct: 10, progression: 'scaled', deloadEvery: 6 },
    exercises: initVariants(CATALOGUE.map(fromCatalogue)),
    sessions: [],
    active: null,
    body: [],        // bodyweight log: { d, w }
    deload: null,    // { start, end } while a deload week is running
    lastDeload: null,
    snooze: {},      // prompt → date it may show again
    lastBackup: null,
    goals: [],       // { id, exId, start, target, by, created }
    extras: [],      // cardio and rest days: { id, d, type: 'cardio' | 'rest', kind, mins }
    seenIntro: false,
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
  if (s.v < 4) {
    s.exercises.forEach(e => { e.load = e.load || (DB_PAIR.has(e.name) ? 'each' : 'single'); });
    s.v = 4;
  }
  if (s.v < 5) {
    const have = new Set(s.exercises.map(e => e.name.toLowerCase()));
    s.exercises.push(...CATALOGUE.filter(c => !have.has(c[1].toLowerCase())).map(c => ({ ...fromCatalogue(c), inPlan: false })));
    s.v = 5;
  }
  if (s.v < 6) {
    // Bodyweight exercises arrive, and each barbell/dumbbell (or bodyweight/weighted) pair becomes one visible exercise.
    const have = new Set(s.exercises.map(e => e.name.toLowerCase()));
    s.exercises.push(...CATALOGUE.filter(c => !have.has(c[1].toLowerCase())).map(c => ({ ...fromCatalogue(c), inPlan: false })));
    initVariants(s.exercises);
    s.v = 6;
  }
  if (s.v < 7) {
    const have = new Set(s.exercises.map(e => e.name.toLowerCase()));
    s.exercises.push(...CATALOGUE.filter(c => !have.has(c[1].toLowerCase())).map(c => ({ ...fromCatalogue(c), inPlan: false })));
    s.v = 7;
  }
  if (s.setupDone) s.seenIntro = true; // the walkthrough is for first launch only
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

/* ---------- goals ----------
 * A goal is a target working weight (or reps per set, or assistance) for one exercise by a date. Pace is a straight
 * line from the progress made since the goal was set, so it needs a week of data and some movement to say anything.
 */
function goalInfo(g) {
  const ex = byId(g.exId);
  if (!ex) return null;
  const cur = levelOf(ex) ?? 0, lower = isAssist(ex);
  const span = lower ? g.start - g.target : g.target - g.start;
  const gained = lower ? g.start - cur : cur - g.start;
  const done = lower ? cur <= g.target : cur >= g.target;
  const pct = done ? 1 : span > 0 ? Math.max(0, Math.min(1, gained / span)) : 0;
  const days = (Date.now() - new Date(g.created).getTime()) / DAY_MS, by = new Date(g.by).getTime();
  const eta = !done && gained > 0 && days >= 7 ? Date.now() + (span - gained) / (gained / days) * DAY_MS : null;
  const status = done ? 'Reached' : Date.now() > by ? 'Past the date' : !eta ? 'Too early to tell' : eta <= by ? 'On pace' : 'Behind pace';
  return { ex, cur, pct, done, eta, by, status };
}

const goalFor = exId => state.goals.find(g => g.exId === exId);
// The goal shown on the home tile: the nearest deadline that isn't reached yet, else any.
function topGoal() {
  const live = state.goals.map(g => ({ g, i: goalInfo(g) })).filter(x => x.i).sort((a, b) => a.i.by - b.i.by);
  return live.find(x => !x.i.done) || live[0] || null;
}

function goalSheetHtml(exId) {
  const list = state.exercises.filter(e => e.log.length && !e.hidden);
  const ex = byId(exId) || list.find(e => e.kind === 'main') || list[0];
  if (!ex) return '<h2>Set a goal</h2><p class="empty">Set a starting weight for an exercise first.</p>';
  const g = goalFor(ex.id);
  const by = (g ? new Date(g.by) : new Date(Date.now() + 84 * DAY_MS)).toISOString().slice(0, 10);
  return `
  <h2>${g ? 'Edit goal' : 'Set a goal'}</h2>
  <p class="sub">A target for one exercise by a date. The app shows whether you're on pace.</p>
  <div class="form">
    <label class="field full">Exercise<select id="gEx" data-bind="goalEx">${DAYS.map(d => `<optgroup label="${DAY_LABEL[d]}">${
      list.filter(e => e.day === d).map(e => `<option value="${e.id}" ${e.id === ex.id ? 'selected' : ''}>${esc(e.name)}</option>`).join('')}</optgroup>`).join('')}</select></label>
    <label class="field">Target (${isBW(ex) ? `${repUnit(ex)} per set` : unitLabel(ex)})<input id="gTarget" type="number" inputmode="decimal" step="0.5" min="0" value="${g?.target ?? ''}" placeholder="now ${fmt(levelOf(ex) || 0)}"></label>
    <label class="field">By<input id="gBy" type="date" value="${by}"></label>
  </div>
  <button class="btn primary block" data-action="saveGoal">Save goal</button>
  ${g ? `<button class="btn ghost block danger-text" data-action="removeGoal" data-id="${g.id}">Remove goal</button>` : ''}`;
}

/* ---------- cardio and rest days ---------- */
const CARDIO = ['Run', 'Walk', 'Cycle', 'Swim', 'Row', 'Stairs', 'Sport', 'Other'];
const sameDay = (a, b) => new Date(a).toDateString() === new Date(b).toDateString();
function extrasThisWeek() {
  const ws = weekStart(new Date()).getTime();
  return state.extras.filter(x => new Date(x.d).getTime() >= ws);
}

function cardioSheetHtml() {
  return `
  <h2>Log cardio</h2>
  <div class="form">
    <label class="field">Type<select id="cKind">${CARDIO.map(k => `<option>${k}</option>`).join('')}</select></label>
    <label class="field">Minutes<input id="cMins" type="number" inputmode="numeric" min="1" placeholder="30"></label>
    <label class="field full">Day<input id="cDay" type="date" value="${new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10)}"></label>
  </div>
  <button class="btn primary block" data-action="saveCardio">Save</button>`;
}

function daySheetHtml(t) {
  const ss = state.sessions.filter(s => sameDay(s.date, t)), xs = state.extras.filter(x => sameDay(x.d, t));
  return `
  <h2>${dLong(t)}</h2>
  ${ss.map(s => `<button class="hist" style="margin-top:10px;background:var(--surface-2);box-shadow:none" data-action="openSession" data-id="${s.id}">
    <span class="dot ${s.day}"></span><div><b>${DAY_LABEL[s.day]}</b><small>${fmt(sessionVolume(s))} ${UNIT} lifted</small></div>${ICON.chev}</button>`).join('')}
  <div class="detail">${xs.map(x => `<div class="line"><div><b>${x.type === 'rest' ? 'Rest day' : esc(x.kind)}</b>${x.mins ? `<small>${x.mins} min</small>` : ''}</div>
    <button class="btn small" data-action="removeExtra" data-id="${x.id}">Remove</button></div>`).join('')}</div>`;
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
    const perRep = progOf(e) === 'time' ? 1 : 3; // holds are already in seconds
    const work = e.sets * (20 + e.reps * perRep) + (test && e.amrap ? (e.target - e.reps) * perRep : 0);
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
    exId: e.id, name: e.name, weight: Number(e.weight) || 0, reps: e.reps, target: e.target, inc: stepOf(e), amrap, rest: e.rest, kind: e.kind,
    unit: unitOf(e), load: loadOf(e), prog: progOf(e),
    sets: Array.from({ length: sets }, (_, i) => ({ reps: amrap && i === sets - 1 ? '' : e.reps, done: false })),
  };
}

function startWorkout(day, test, ids) {
  if (inDeload()) test = false;
  const exs = [...new Set(ids)].map(byId).filter(Boolean); // keeps the order given
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
  if (hold.iv) stopHold(true);
  snapshot(); // lets the summary offer "Undo finish", which also rolls back the weight changes
  const now = new Date();
  const { deloadAfter, deloadPct } = state.settings;
  const outcomes = [];

  for (const en of a.entries) {
    const ex = byId(en.exId);
    if (!ex || !en.amrap) continue;
    const last = en.sets[en.sets.length - 1];
    const reps = parseInt(last.reps, 10);
    const bw = isBW(en);
    const base = { exId: en.exId, name: en.name, from: bw ? en.reps : en.weight, target: en.target, prescribed: en.reps };
    if (!last.done || isNaN(reps)) {
      outcomes.push({ ...base, status: 'skipped', to: levelOf(ex) });
      continue;
    }
    const next = progressFor(en, reps);
    if (next.status !== 'hold') {
      setLevel(ex, next.to, next.status, now);
      ex.misses = 0;
      outcomes.push({ ...base, status: next.status, reps, to: next.to });
    } else {
      ex.misses = (ex.misses || 0) + 1;
      if (deloadAfter > 0 && ex.misses >= deloadAfter) {
        const q = bw ? (progOf(en) === 'time' ? 5 : 1) : (stepOf(ex) || 0.5);
        // Assisted moves deload by adding help rather than removing weight.
        const to = isAssist(en)
          ? r2(Math.ceil(base.from * (1 + deloadPct / 100) / q - 1e-9) * q) || q
          : Math.max(bw ? q : 0, r2(Math.floor(base.from * (1 - deloadPct / 100) / q + 1e-9) * q));
        setLevel(ex, to, 'deload', now);
        outcomes.push({ ...base, status: 'deload', reps, to, misses: ex.misses });
        ex.misses = 0;
      } else {
        // Keep the weight actually used, in case it was changed mid-session.
        if (!bw && en.weight !== ex.weight) setWeight(ex, en.weight, 'edit', now);
        outcomes.push({ ...base, status: 'hold', reps, to: base.from, misses: ex.misses });
      }
    }
  }

  const session = {
    id: a.id, date: now.toISOString(), start: a.start, est: a.est, day: a.day, test: a.test,
    ...(a.energy ? { energy: a.energy } : {}), ...(a.note ? { note: a.note } : {}),
    entries: a.entries.map(en => ({
      exId: en.exId, name: en.name, weight: en.weight, reps: en.reps, target: en.target, inc: en.inc, amrap: en.amrap, unit: en.unit, load: en.load, prog: en.prog,
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
  // Celebrate a new streak milestone once; otherwise note when this workout kept the streak going.
  const milestone = pendingMilestone();
  if (milestone) { state.celebrated = milestone[0]; save(); }
  const ws = weekStats();
  const extended = !milestone && ws.thisWeek === STREAK_MIN && ws.streak > 1 ? ws.streak : 0;
  openSheet(summaryHtml(session, milestone, extended));
  if (milestone || session.prs.length) confetti();
}

function discardWorkout() {
  if (hold.iv) { clearInterval(hold.iv); hold.iv = null; }
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
  applyTheme();
  // The Today tab takes on the day's colour (blue push, orange pull, green legs).
  document.body.dataset.day = state.setupDone && ui.tab === 'today' ? (state.active?.day || ui.day || nextDay()) : '';
  if (!state.setupDone) v.innerHTML = state.seenIntro ? viewSetup() : viewIntro();
  else if (ui.tab === 'today') v.innerHTML = state.active ? viewActive() : viewToday();
  else if (ui.tab === 'progress') { v.innerHTML = viewProgress(); drawCharts(); }
  else if (ui.tab === 'history') v.innerHTML = viewHistory();
  else v.innerHTML = viewProgram();
  ui.pop = null; // the tick animation plays once, on the render right after the tap
  tickElapsed();
  keepAwake();
}

// First-run walkthrough: [icon, title, text]
const INTRO = [
  ['<svg viewBox="0 0 24 24"><path d="M3 10v4M6.5 7v10M17.5 7v10M21 10v4M6.5 12h11"/></svg>', 'Push, pull, legs',
    'Three kinds of training day in rotation. Before each one you tick the exercises you\'re doing, and the app remembers your choices.'],
  [ICON.up, 'Your last set decides the weight',
    'On test days the last set of each exercise is an AMRAP: as many reps as you can. Beat the target and the weight goes up next time, by more the further you beat it. Fall short and it holds or drops.'],
  [ICON.check, 'Tick as you go',
    'Weights and reps are filled in for you. Tick each set and a rest timer starts. Switch between barbell and dumbbells, kg and lb, or swap an exercise if the machine is taken.'],
  ['<svg viewBox="0 0 24 24"><path d="M4 19h16M6 15l4-5 3 3 5-7"/></svg>', 'Watch it add up',
    'Charts, records, a muscle map, goals and a streak show your progress. Everything is stored on this phone, so export a backup now and then.'],
];

function viewIntro() {
  setTitle('Welcome');
  const k = Math.min(ui.intro || 0, INTRO.length - 1), s = INTRO[k], last = k === INTRO.length - 1;
  return `
  <section class="card intro-slide">
    <span class="ic big">${s[0]}</span>
    <h2>${s[1]}</h2>
    <p>${s[2]}</p>
    <div class="steps">${INTRO.map((_, i) => `<i class="${i === k ? 'on' : ''}"></i>`).join('')}</div>
  </section>
  <button class="btn primary block" data-action="${last ? 'introDone' : 'introNext'}">${last ? 'Set up my plan' : 'Next'}</button>
  ${last ? '' : '<button class="btn ghost block small" data-action="introDone">Skip</button>'}`;
}

// 'auto' follows the phone's light/dark setting; the others force a theme.
function applyTheme() {
  const t = state.settings.theme === 'black' ? 'focus' : state.settings.theme;
  if (t && t !== 'auto') document.documentElement.dataset.theme = t; else delete document.documentElement.dataset.theme;
}

// A short burst of confetti in the open sheet, for records and streak milestones.
function confetti() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const box = document.createElement('div');
  box.className = 'confetti';
  const cols = ['var(--push)', 'var(--pull)', 'var(--legs)', 'var(--warn)'];
  box.innerHTML = Array.from({ length: 28 }, (_, i) => `<i style="left:${Math.random() * 100}%;background:${cols[i % 4]};animation-delay:${Math.random() * 0.35}s;animation-duration:${1.1 + Math.random() * 0.9}s;transform:rotate(${Math.random() * 360}deg)"></i>`).join('');
  $('#sheet .panel').prepend(box);
  setTimeout(() => box.remove(), 2600);
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
        data-bind="setupW" data-id="${e.id}" value="${e.weight ?? ''}"><em>${unitLabel(e)}</em></span>
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
  const week = sessionsThisWeek().length, goal = 3 * state.settings.perWeek;
  const last = state.sessions[state.sessions.length - 1];
  const mins = Math.max(5, Math.round(estimateMin(exs, test) * (deload ? 0.6 : 1) / 5) * 5);
  const st = weekStats(), left = STREAK_MIN - st.thisWeek;
  // Featured lift: the day's main lift (whichever version is in use), else the first exercise in the plan.
  const main = state.exercises.find(e => e.day === day && e.kind === 'main');
  const lift = [main?.hidden ? state.exercises.find(x => x.name === variantOf(main)?.name) : main, exs[0]].find(e => e && e.log.length);
  const tg = topGoal();
  const mw = muscleWeek(weekStart(new Date()));
  const ms = Object.values(DAY_MUSCLES).flat().map(m => ({ m, sets: mw[m].sets }));
  const xw = extrasThisWeek(), cardioMin = xw.reduce((t, x) => t + (x.mins || 0), 0), restDays = xw.filter(x => x.type === 'rest').length;
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
  <div class="home">
    <section class="hero">
      <div class="row between">
        <div><h2>${DAY_LABEL[day]} day</h2><p>${exs.length} exercise${exs.length === 1 ? '' : 's'} · about ${mins} min${last ? ` · last workout ${relDays(last.date).toLowerCase()}` : ''}</p></div>
        ${deload ? '<span class="pill static">Deload</span>'
          : `<button class="pill" data-action="toggleTest" aria-pressed="${test}">${test ? 'AMRAP test' : 'Volume day'}</button>`}
      </div>
      <div class="btnrow">
        <button class="btn" data-action="pick">${ICON.play}Start</button>
        ${repeatIds(day).length ? `<button class="btn quiet" data-action="repeatLast" data-day="${day}">Repeat last</button>` : ''}
      </div>
    </section>

    <button class="tl" data-action="tab" data-tab="history" aria-label="${week} of ${goal} workouts this week">
      <svg class="ring" viewBox="0 0 72 72" aria-hidden="true"><circle cx="36" cy="36" r="29"/><circle class="fg" ${week ? '' : 'visibility="hidden"'} cx="36" cy="36" r="29" stroke-dasharray="${Math.min(1, week / goal) * 182.2} 182.2" transform="rotate(-90 36 36)"/></svg>
      <span><b>${week}/${goal}</b><small>this week</small></span>
    </button>
    <button class="tl" data-action="tab" data-tab="history">
      <span class="flame ${st.streak ? 'lit' : ''}">${ICON.flame}</span>
      <span><b>${st.streak} week${st.streak === 1 ? '' : 's'}</b><small>${left > 0 && state.sessions.length ? `${left} more ${st.streak ? 'keeps it' : 'starts one'}` : 'streak'}</small></span>
    </button>

    ${lift ? `<button class="tl col" data-action="goLift" data-id="${lift.id}">
      <small>${esc(lift.name)}</small><b>${isBW(lift) ? wt(lift, lift.reps) : wt(lift, lift.weight)}</b>${sparkline(lift)}
    </button>` : ''}
    ${tg ? `<button class="tl col" data-action="goalSheet" data-id="${tg.i.ex.id}">
      <small>Goal · ${esc(tg.i.ex.name)}</small><b>${wt(tg.i.ex, tg.g.target)}</b>
      <span class="bar"><i style="width:${Math.round(tg.i.pct * 100)}%"></i></span><small>${Math.round(tg.i.pct * 100)}% · ${tg.i.status.toLowerCase()}</small>
    </button>` : `<button class="tl col" data-action="goalSheet">
      <small>Goal</small><b>Set a goal</b><small>A target lift by a date, with pace tracking</small>
    </button>`}

    <button class="tl col wide" data-action="tab" data-tab="progress">
      <small>Sets per muscle this week · ${ms.filter(x => x.sets >= 10).length} of ${ms.length} at 10+</small>
      <span class="mbars">${ms.map(x => `<i class="${x.sets >= 10 ? 'ok' : x.sets > 0 ? 'low' : ''}" style="height:${Math.max(6, Math.min(100, x.sets / 20 * 100))}%" title="${MUSCLES[x.m]}: ${fmt(Math.round(x.sets))}"></i>`).join('')}</span>
    </button>

    <div class="tl wide between">
      <span><b>${cardioMin ? `${cardioMin} min cardio` : 'Cardio and rest'}</b><small>${restDays ? `${restDays} rest day${restDays > 1 ? 's' : ''} this week` : cardioMin ? 'this week' : 'Log what you do outside lifting'}</small></span>
      <span class="btnrow"><button class="btn small" data-action="cardioSheet">Cardio</button><button class="btn small" data-action="logRest">Rest day</button></span>
    </div>
  </div>`;
}

// Small step line of an exercise's working weight (or reps) for the home tile.
function sparkline(ex) {
  const pts = ex.log.map(l => l.w);
  if (pts.length < 2) return '<small>No changes yet</small>';
  const lo = Math.min(...pts), hi = Math.max(...pts), n = pts.length;
  const X = i => (i / n) * 100, Y = v => 24 - (hi === lo ? 0.5 : (v - lo) / (hi - lo)) * 20;
  const d = pts.map((v, i) => (i ? `H${X(i)}V${Y(v)}` : `M0,${Y(v)}`)).join('') + 'H100';
  return `<svg class="spark" viewBox="0 0 100 28" preserveAspectRatio="none" aria-hidden="true"><path d="${d}"/></svg>`;
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
  <section class="card notes">
    <h3>How did it go?</h3>
    <div class="energy">${ENERGY.map((l, k) => `<button data-action="energy" data-v="${k + 1}" class="${a.energy === k + 1 ? 'on' : ''}">${l}</button>`).join('')}</div>
    <textarea data-bind="sessNote" rows="2" placeholder="Optional note: sleep, how a lift felt, gym was busy…">${esc(a.note || '')}</textarea>
  </section>
  <button class="btn primary block" data-action="finish">Finish workout</button>
  <button class="btn ghost block danger-text" data-action="discard">Discard workout</button>`;
}

// Exercises from your last session of this day, in the same order. A version you've since switched away from is
// replaced by the one you now use.
function repeatIds(day) {
  const last = [...state.sessions].reverse().find(s => s.day === day);
  if (!last) return [];
  const ids = last.entries.map(en => {
    const e = byId(en.exId);
    if (!e) return null;
    return e.hidden ? state.exercises.find(x => x.name === variantOf(e)?.name && !x.hidden)?.id : e.id;
  });
  return [...new Set(ids.filter(Boolean))];
}

// "Machine taken": other exercises that hit the same muscles, best match first.
function swapOptions(en) {
  const mine = musclesOf(en.exId, en.name);
  if (!mine) return [];
  const inSession = new Set(state.active.entries.map(x => x.exId));
  return state.exercises.filter(e => !e.hidden && !inSession.has(e.id)).map(e => {
    const mm = musclesOf(e.id, e.name);
    if (!mm) return null;
    const both = (a, b) => a.filter(m => b.includes(m)).length;
    const score = 3 * both(mine.p, mm.p) + both(mine.p, mm.s) + both(mine.s, mm.p);
    return both(mine.p, mm.p) ? { e, score: score + (e.day === state.active.day ? 0.5 : 0) } : null;
  }).filter(Boolean).sort((a, b) => b.score - a.score).slice(0, 8).map(x => x.e);
}

function swapHtml(i) {
  const en = state.active.entries[i], opts = swapOptions(en);
  return `
  <h2>Swap ${esc(en.name)}</h2>
  <p class="sub">Machine taken? These work the same muscles. Swapped for today only; your plan stays the same.</p>
  ${opts.length ? opts.map(e => `
    <div class="add-row"><span><b>${esc(e.name)}</b><small>${rx(e)}${!needsStart(e) && !isBW(e) ? ` · ${wt(e, e.weight)}` : ''} · ${DAY_LABEL[e.day]}</small></span>
    ${needsStart(e) ? `<span class="wt-in"><input type="number" inputmode="decimal" step="0.5" min="0" placeholder="${unitOf(e)}" data-bind="pickW" data-id="${e.id}" aria-label="Starting weight"></span>` : ''}
    <button class="btn small" data-action="swapEntry" data-e="${i}" data-id="${e.id}">Swap</button></div>`).join('')
    : '<p class="empty">No close matches in the catalogue.</p>'}`;
}

function lastDone(id) {
  for (let i = state.sessions.length - 1; i >= 0; i--) {
    if (state.sessions[i].entries.some(en => en.exId === id)) return state.sessions[i].date;
  }
  return null;
}

function pickerHtml(day, test) {
  const all = state.exercises.filter(e => e.day === day && !e.hidden);
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
      ${muscleThumb(e.id, e.name) || '<span></span>'}
      <span class="pk"><b>${esc(e.name)}${e.kind === 'main' ? ' <span class="tag good">Recommended</span>' : ''}</b>
        <small>${rx(e)}, up from ${e.target}${isBW(e) ? ` ${repUnit(e)}` : ''} · rest ${restFor(e) ? mmss(restFor(e)) : 'off'}${e.alt ? ` · alt. to ${esc(e.alt)}` : ''}${last ? ` · last ${dShort(last)}` : ''}</small>
        ${variantToggle(e, 'pick')}</span>
      ${isBW(e)
        ? (e.log.length ? `<span class="muted pkw">${wt(e, e.reps)}/set</span>`
          : `<span class="wt-in"><input type="number" inputmode="numeric" min="1" value="${e.reps}" data-bind="pickReps" data-id="${e.id}" aria-label="Starting ${repUnit(e)} per set"><em>${repUnit(e)}</em></span>`)
        : e.weight == null
          ? `<span class="wt-in"><input type="number" inputmode="decimal" step="0.5" min="0" placeholder="${unitOf(e)}" data-bind="pickW" data-id="${e.id}" aria-label="Starting weight"></span>`
          : `<span class="muted pkw">${wt(e, e.weight)}</span>`}
    </label>`;
}

const needsStart = e => !isBW(e) && e.weight == null;

function pickedIds() {
  return [...document.querySelectorAll('[data-bind="pickToggle"]')].filter(c => c.checked).map(c => c.dataset.id);
}

function updatePicker() {
  const day = $('#pickGo').dataset.day, test = ui.test ?? testDue(day);
  const ids = pickedIds(), exs = ids.map(byId);
  const go = $('#pickGo');
  go.disabled = !ids.length;
  go.textContent = ids.length ? `Start ${ids.length} exercise${ids.length > 1 ? 's' : ''} · about ${estimateMin(exs, test)} min` : 'Pick at least one exercise';
  // A main lift counts as picked if its other version (e.g. dumbbell bench for barbell bench) is.
  const shown = e => (e.hidden ? state.exercises.find(x => x.name === variantOf(e)?.name) || e : e);
  const missing = state.exercises.filter(e => e.day === day && e.kind === 'main').map(shown).filter(e => !ids.includes(e.id));
  $('#pickNote').innerHTML = (missing.length
    ? `<b>${missing.map(e => esc(e.name)).join(', ')}</b> is recommended. Squats, deadlifts and flat bench are the big multi-joint lifts that drive most strength gains, so keep it in if you can.`
    : '') + volumeNudgeHtml(day, ids);
  document.querySelectorAll('.pick-row').forEach(r => r.classList.toggle('on', $('input[type=checkbox]', r).checked));
}

// The muscles each day is responsible for, for the weekly set check.
const DAY_MUSCLES = {
  push: ['chest', 'frontDelts', 'sideDelts', 'triceps'],
  pull: ['lats', 'upperBack', 'rearDelts', 'biceps'],
  legs: ['quads', 'hamstrings', 'glutes', 'calves'],
};

/* Weekly volume nudge: sets already done this week plus today's picks, repeated for the sessions of this day still
 * to come this week. Muscles heading for under 10 sets (the low end of the 10–20 range) get a suggestion. */
function volumeNudgeHtml(day, ids) {
  if (inDeload()) return '';
  const done = muscleWeek(weekStart(new Date()));
  const doneDay = sessionsThisWeek().filter(s => s.day === day).length;
  const remaining = Math.max(1, state.settings.perWeek - doneDay);
  const planned = {};
  ids.map(byId).forEach(e => {
    const mm = musclesOf(e.id, e.name);
    if (!mm) return;
    mm.p.forEach(m => { planned[m] = (planned[m] || 0) + e.sets; });
    mm.s.forEach(m => { planned[m] = (planned[m] || 0) + e.sets / 2; });
  });
  const low = DAY_MUSCLES[day].map(m => ({ m, end: done[m].sets + (planned[m] || 0) * remaining })).filter(x => x.end < 10);
  if (!low.length) return '';
  const rows = low.map(({ m, end }) => {
    const add = state.exercises.find(e => e.day === day && !e.hidden && !ids.includes(e.id) && musclesOf(e.id, e.name)?.p.includes(m));
    return `<span class="nudge"><b>${MUSCLES[m]}</b> ~${fmt(Math.round(end))} sets${add ? ` <button data-action="nudgeAdd" data-id="${add.id}">+ ${esc(add.name)}</button>` : ''}</span>`;
  }).join('');
  return `<span class="nudges"><span>Heading for under 10 sets this week:</span>${rows}</span>`;
}

function goalHtml(en) {
  if (isBW(en)) {
    const u = repUnit(en), q = progOf(en) === 'time' ? 5 : 1;
    return `Last set: ${progOf(en) === 'time' ? 'hold as long as you can' : 'as many reps as you can'}. ${en.reps}–${en.target - q} holds, under ${en.reps} drops.<br>Move up: ${ladder(en)} ${u} per set`;
  }
  if (state.settings.progression === 'fixed') {
    return `Last set: as many reps as you can. <b>${en.target}+</b> moves you to <b>${wt(en, r2(en.weight + en.inc))}</b>.`;
  }
  return `Last set: as many reps as you can. ${en.reps}–${en.target - 1} holds, under ${en.reps} goes lighter.<br>Move up: ${ladder(en)} ${unitLabel(en)}`;
}

function entryCard(en, i) {
  const last = en.sets[en.sets.length - 1];
  const amrapReps = parseInt(last.reps, 10);
  let result = '';
  if (en.amrap && last.done && !isNaN(amrapReps) && isBW(en)) {
    const next = repProgression(en, amrapReps), u = repUnit(en);
    result = {
      up: `<p class="result"><span class="ic good">${ICON.up}</span>${amrapReps} ${u}. Next time ${next.to} ${u} per set.</p>`,
      hold: `<p class="result"><span class="ic">${ICON.hold}</span>${amrapReps} of ${en.target} ${u}. Staying at ${en.reps} per set.</p>`,
      down: `<p class="result"><span class="ic warn">${ICON.down}</span>${amrapReps} ${u}, under ${en.reps}. ${next.to} per set next time.</p>`,
    }[next.status];
  } else if (en.amrap && last.done && !isNaN(amrapReps)) {
    const next = progression(en, amrapReps);
    result = {
      up: `<p class="result"><span class="ic good">${ICON.up}</span>${amrapReps} reps. ${signed(en, r2(next.to - en.weight))}, ${wt(en, next.to)} next time.</p>`,
      hold: `<p class="result"><span class="ic">${ICON.hold}</span>${amrapReps} of ${en.target} reps. Staying at ${wt(en, en.weight)}.</p>`,
      down: `<p class="result"><span class="ic warn">${ICON.down}</span>${amrapReps} reps, under ${en.reps}. ${wt(en, next.to)} next time.</p>`,
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
      ${muscleThumb(en.exId, en.name)}
      <h3>${esc(en.name)}</h3>
      ${isBW(en) ? (variantOf(byId(en.exId)) ? '' : `<span class="bw-tag">${progOf(en) === 'time' ? 'Hold' : 'Bodyweight'}</span>`) : `
      <input class="wt-box" type="number" inputmode="decimal" step="0.5" min="0" value="${en.weight}"
        data-bind="enW" data-e="${i}" aria-label="Weight for ${esc(en.name)}">
      <span class="toggles">
        <button class="unit-t" data-action="exUnit" data-id="${en.exId}" aria-label="Switch between kilograms and pounds">${unitOf(en)}</button>
        ${loadOf(en) !== 'single' ? `<button class="unit-t" data-action="exLoad" data-id="${en.exId}" aria-label="Switch between per dumbbell and total">${loadOf(en) === 'each' ? 'each' : 'total'}</button>` : ''}
      </span>`}
      <button class="more" data-action="entryMenu" data-e="${i}" aria-label="Exercise options">${ICON.more}</button>
    </div>
    ${variantOf(byId(en.exId)) ? `<div class="eq-line">${variantToggle(byId(en.exId), 'card', i)}</div>` : ''}
    ${unitOf(en) === 'lb' && !isBW(en) ? `<p class="last" id="conv-${i}">${convHtml(en)}</p>` : ''}
    ${isBar(byId(en.exId) || en) ? `<p class="last plates" id="plates-${i}">${platesHtml(en, en.weight)}</p>` : ''}
    ${prev ? `<p class="last">Last time (${dShort(prev.date)}): ${isBW(en) ? '' : `${wt(en, prev.en.weight)} × `}${prev.en.sets.filter(s => s.done).map(s => s.reps).join(' · ')}${isBW(en) ? ` ${repUnit(en)}` : ''}</p>` : ''}
    ${note ? `<p class="note">${esc(note)}</p>` : ''}
    ${en.amrap ? `<p class="goal" id="goal-${i}">${goalHtml(en)}</p>` : ''}
    <div class="sets">${en.sets.map((s, j) => {
      const am = en.amrap && j === en.sets.length - 1;
      const time = progOf(en) === 'time', running = hold.iv && hold.e === i && hold.s === j;
      return `<div class="set ${s.done ? 'done' : ''} ${am ? 'amrap' : ''} ${time ? 'timed' : ''} ${ui.pop === `${i}-${j}` ? 'pop' : ''}">
        <span class="sn">${am ? (time ? 'Max hold' : 'AMRAP') : `Set ${j + 1}`}</span>
        <label class="reps"><input type="number" inputmode="numeric" min="0" placeholder="${am ? '?' : en.reps}" value="${running ? Math.floor((Date.now() - hold.start) / 1000) : s.reps}"
          data-bind="setR" data-e="${i}" data-s="${j}" aria-label="${time ? 'Seconds' : 'Reps'}"><em>${time ? 'sec' : 'reps'}</em></label>
        ${time ? `<button class="hold-btn ${running ? 'on' : ''}" data-action="holdTimer" data-e="${i}" data-s="${j}" aria-label="${running ? 'Stop timer' : 'Start timer'}">${running ? '■' : '▶'}</button>` : ''}
        <button class="check" data-action="toggleSet" data-e="${i}" data-s="${j}" aria-pressed="${s.done}" aria-label="Set done">${ICON.check}</button>
      </div>`;
    }).join('')}</div>
    ${result}
  </section>`;
}

const convHtml = en => `${wt(en, en.weight)} = <b>${fmt(Math.round(toKg(en, en.weight) * 10) / 10)} kg</b>`;

// Plate calculator for barbell lifts: the heaviest plates first, per side, on your bar.
const BARBELL = new Set(['Barbell Bench Press', 'Overhead Press', 'Barbell Row', 'Barbell Curl', 'Back Squat', 'Deadlift',
  'Romanian Deadlift', 'Incline Barbell Bench Press', 'Close-Grip Bench Press', 'Front Squat', 'Stiff-Leg Deadlift',
  'Barbell Shrug', 'Hip Thrust']);
const isBar = e => !isBW(e) && !isAssist(e) && (e.bar ?? BARBELL.has(e.name));
function platesHtml(e, w) {
  const lb = unitOf(e) === 'lb', u = unitOf(e);
  const bar = lb ? 45 : (state.settings.bar ?? 20);
  const sizes = lb ? [45, 35, 25, 10, 5, 2.5] : [25, 20, 15, 10, 5, 2.5, 1.25];
  if (!(w > 0)) return '';
  if (w < bar) return `Lighter than the ${bar} ${u} bar`;
  let side = r2((w - bar) / 2);
  const out = [];
  for (const p of sizes) while (side >= p - 1e-9) { out.push(p); side = r2(side - p); }
  return `<b>${out.length ? `Each side: ${out.map(fmt).join(' + ')}` : 'Empty bar'}</b> on a ${bar} ${u} bar${side > 0.01 ? ` · ${fmt(r2(side * 2))} ${u} can't be loaded` : ''}`;
}

function entryMenuHtml(i) {
  const a = state.active, en = a.entries[i], ex = byId(en.exId);
  return `
  <h2>${esc(en.name)}</h2>
  <div class="menu">
    <button data-action="entrySwap" data-e="${i}">Machine taken? Swap exercise</button>
    <button data-action="entryMove" data-e="${i}" data-dir="-1" ${i === 0 ? 'disabled' : ''}>Move up</button>
    <button data-action="entryMove" data-e="${i}" data-dir="1" ${i === a.entries.length - 1 ? 'disabled' : ''}>Move down</button>
    <button data-action="entrySuperset" data-e="${i}" ${i === a.entries.length - 1 ? 'disabled' : ''}>${en.ss ? 'Unlink superset' : `Superset with ${esc(a.entries[i + 1]?.name || 'next exercise')}`}</button>
    <button data-action="entrySet" data-e="${i}" data-dir="1">Add a set</button>
    <button data-action="entrySet" data-e="${i}" data-dir="-1" ${en.sets.length <= 1 ? 'disabled' : ''}>Remove last set</button>
    ${ex && !isBW(ex) ? `<button data-action="exUnit" data-id="${ex.id}">Switch to ${unitOf(ex) === 'lb' ? 'kilograms (kg)' : 'pounds (lb)'} for this exercise</button>` : ''}
    ${ex && !isBW(ex) && loadOf(ex) !== 'single' ? `<button data-action="exLoad" data-id="${ex.id}">Log ${loadOf(ex) === 'each' ? 'total of both dumbbells' : 'weight per dumbbell'}</button>` : ''}
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
    const list = state.exercises.filter(e => e.day === d && !e.hidden && !inSession.has(e.id));
    return list.length ? `<h3 class="pick-h">${DAY_LABEL[d]}</h3>${list.map(e => `
      <div class="add-row"><span><b>${esc(e.name)}</b><small>${rx(e)}${!needsStart(e) && !isBW(e) ? ` · ${wt(e, e.weight)}` : ''}</small></span>
      ${needsStart(e) ? `<span class="wt-in"><input type="number" inputmode="decimal" step="0.5" min="0" placeholder="${unitOf(e)}" data-bind="pickW" data-id="${e.id}" aria-label="Starting weight"></span>` : ''}
      <button class="btn small" data-action="addEntry" data-id="${e.id}">Add</button></div>`).join('')}` : '';
  }).join('')}`;
}

function outcomeLi(o) {
  const n = state.settings.deloadAfter, X = unitSrc(o);
  const u = isBW(X) ? repUnit(X) : 'reps', ps = isBW(X) ? ' per set' : '';
  const rows = {
    up: ['good', ICON.up, isAssist(X) && o.to === 0
      ? `${o.reps} ${u} (target ${o.target}). No assistance needed any more: switch to bodyweight pull-ups.`
      : `${o.reps} ${u} (target ${o.target}). ${signed(X, r2(o.to - o.from))}, next time ${wt(X, o.to)}${ps}.`, '<span class="tag good">Up</span>'],
    down: ['warn', ICON.down, `${o.reps} ${u}, under the ${o.prescribed ?? ''} prescribed. ${isAssist(X) ? 'More help' : isBW(X) ? 'Easier' : 'Lighter'} next time: ${wt(X, o.to)}${ps}.`, `<span class="tag warn">${isBW(X) || isAssist(X) ? 'Easier' : 'Lighter'}</span>`],
    hold: ['', ICON.hold, `${o.reps} of ${o.target} ${u}. Stays at ${wt(X, o.to)}${ps}${n ? `, miss ${o.misses} of ${n}` : ''}.`, '<span class="tag">Hold</span>'],
    deload: ['warn', ICON.down, `${o.reps} of ${o.target} ${u}, ${o.misses} misses in a row. Reset to ${wt(X, o.to)}${ps}.`, '<span class="tag warn">Deload</span>'],
    skipped: ['', ICON.skip, `AMRAP set not logged. ${isBW(X) ? 'Reps' : 'Weight'} unchanged.`, '<span class="tag">Skipped</span>'],
  }[o.status];
  return `<li><span class="ic ${rows[0]}">${rows[1]}</span><div><b>${esc(o.name)}</b><small>${rows[2]}</small></div>${rows[3]}</li>`;
}

function summaryHtml(s, milestone, extended) {
  const mins = Math.max(1, Math.round((new Date(s.date) - s.start) / 60000));
  const ups = s.outcomes.filter(o => o.status === 'up').length;
  return `
  <h2>${DAY_LABEL[s.day]} done</h2>
  <p class="sub">${dLong(s.date)} · ${mins} min · ${fmt(sessionVolume(s))} ${UNIT} lifted</p>
  ${milestone ? celebrateHtml(milestone) : ''}
  ${extended ? `<p class="streak-note">That's ${STREAK_MIN} workouts this week. Your streak is now <b>${extended} weeks</b>.</p>` : ''}
  ${prsHtml(s)}
  ${s.test
    ? `<p class="hint">${ups ? `${ups} exercise${ups > 1 ? 's' : ''} moving up next time.` : 'No increases this time. Same weights, beat the reps.'}</p>
       <ul class="outcomes">${s.outcomes.map(outcomeLi).join('')}</ul>`
    : '<p class="hint">Volume day logged. Weights unchanged.</p>'}
  ${s.energy || s.note ? `<p class="hint">${s.energy ? `Energy: <b>${ENERGY[s.energy - 1]}</b>` : ''}${s.energy && s.note ? ' · ' : ''}${s.note ? esc(s.note) : ''}</p>` : ''}
  <button class="btn primary block" data-action="closeSheet">Done</button>
  <button class="btn block small" data-action="shareWorkout" data-id="${s.id}">Summary picture</button>
  ${undoSnap ? '<button class="btn ghost block small" data-action="undo">Undo finish (back to the workout)</button>' : ''}`;
}

const ENERGY = ['Drained', 'Low', 'OK', 'Good', 'Great'];

function prsHtml(s) {
  if (!s.prs?.length) return '';
  return `<div class="prs"><h3><span class="ic gold">${ICON.trophy}</span>${s.prs.length} personal record${s.prs.length > 1 ? 's' : ''}</h3>
    ${s.prs.map(p => `<p><b>${esc(p.name)}</b><small>${esc(p.text)}</small></p>`).join('')}</div>`;
}

function viewHistory() {
  setTitle('History');
  if (!state.sessions.length) return '<section class="card"><p class="empty">Finished workouts show up here.</p></section>';
  let month = '';
  return calendarHtml(ui.calOffset || 0) + [...state.sessions].reverse().map(s => {
    const m = new Date(s.date).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
    const head = m !== month ? `<h3 class="month">${m}</h3>` : '';
    month = m;
    const ups = s.outcomes.filter(o => o.status === 'up').length;
    return `${head}<button class="hist" data-action="openSession" data-id="${s.id}">
      <span class="dot ${s.day}"></span>
      <div><b>${DAY_LABEL[s.day]} ${s.test ? '<span class="tag">AMRAP</span>' : ''}</b>
      <small>${dLong(s.date)} · ${fmt(sessionVolume(s))} ${UNIT}${ups ? ` · ${ups} up` : ''}${s.energy ? ` · ${ENERGY[s.energy - 1]}` : ''}</small></div>${ICON.chev}</button>`;
  }).join('');
}

// Streak = weeks in a row with at least STREAK_MIN workouts, counting this week once it gets there.
// `goal` is still every planned session (3 or 6), shown as this week's target.
const STREAK_MIN = 3;
function weekStats() {
  const goal = 3 * state.settings.perWeek, counts = new Map();
  if (!state.sessions.length) return { goal, thisWeek: 0, streak: 0, avg: null };
  state.sessions.forEach(s => { const k = weekStart(s.date).getTime(); counts.set(k, (counts.get(k) || 0) + 1); });
  const ws = weekStart(new Date()), thisWeek = counts.get(ws.getTime()) || 0;
  let streak = thisWeek >= STREAK_MIN ? 1 : 0;
  const w = new Date(ws);
  w.setDate(w.getDate() - 7);
  while ((counts.get(w.getTime()) || 0) >= STREAK_MIN) { streak++; w.setDate(w.getDate() - 7); }
  const firstWeek = weekStart(state.sessions[0].date).getTime();
  let n = 0, total = 0;
  const v = new Date(ws);
  for (let k = 0; k < 8; k++) {
    v.setDate(v.getDate() - 7);
    if (v.getTime() < firstWeek) break;
    n++; total += counts.get(v.getTime()) || 0;
  }
  return { goal, thisWeek, streak, avg: n ? total / n : null };
}

// Streak milestones and their messages. Past a year, every 13 weeks (a quarter) gets one.
const MILESTONES = [
  [2, 'Two weeks in a row', 'Two straight weeks with 3+ workouts. That\'s how a habit starts.'],
  [4, 'A whole month!', 'You\'ve been on a streak for an entire month. Good job, keep it rolling.'],
  [8, 'Two months strong', 'Eight weeks in a row with 3+ workouts. This is where real progress shows up.'],
  [12, 'Three months straight', 'Twelve weeks of showing up. Most people never get this far. Great work.'],
  [26, 'Half a year!', 'Six months of consistent training. That\'s a lifestyle now, not a phase.'],
  [52, 'A full year!', 'Fifty-two weeks in a row. An incredible year of training. Be proud of this one.'],
];
function milestoneFor(weeks) {
  return MILESTONES.find(([w]) => w === weeks)
    || (weeks > 52 && weeks % 13 === 0 ? [weeks, `${weeks} weeks straight`, `${Math.round(weeks / 52 * 10) / 10} years of 3+ workouts every week. Outstanding consistency.`] : null);
}

// The milestone you've just reached and haven't been congratulated on yet. A broken streak starts the count again.
function pendingMilestone() {
  const { streak } = weekStats();
  if (streak < (state.celebrated || 0)) { state.celebrated = 0; save(); }
  const m = [...MILESTONES.map(x => x[0]), ...(streak > 52 && streak % 13 === 0 ? [streak] : [])]
    .filter(w => w <= streak).pop();
  return m && m > (state.celebrated || 0) ? milestoneFor(m) : null;
}

function celebrateHtml(m) {
  return `<div class="celebrate"><span class="ic gold">${ICON.trophy}</span><div><b>${m[1]}</b><small>${m[2]}</small></div></div>`;
}

function calendarHtml(off) {
  const now = new Date(), first = new Date(now.getFullYear(), now.getMonth() + off, 1);
  const y = first.getFullYear(), m = first.getMonth(), days = new Date(y, m + 1, 0).getDate(), lead = (first.getDay() + 6) % 7;
  const byDate = {};
  state.sessions.forEach(s => { const d = new Date(s.date); if (d.getFullYear() === y && d.getMonth() === m) (byDate[d.getDate()] ||= []).push(s); });
  const isToday = d => off === 0 && d === now.getDate();
  const cells = [...Array(lead).fill('<span></span>'), ...Array.from({ length: days }, (_, k) => {
    const d = k + 1, ss = byDate[d] || [];
    const xs = state.extras.filter(x => sameDay(x.d, new Date(y, m, d)));
    return ss.length || xs.length
      ? `<button class="cal-d ${ss.length ? 'has' : 'soft'} ${isToday(d) ? 'today' : ''}" data-action="openDay" data-t="${new Date(y, m, d, 12).getTime()}" aria-label="${d}: ${[...ss.map(s => DAY_LABEL[s.day]), ...xs.map(x => (x.type === 'rest' ? 'Rest day' : x.kind))].join(', ')}">${d}<span class="cal-dots">${ss.map(s => `<i class="dot ${s.day}"></i>`).join('')}${xs.map(x => `<i class="dot ${x.type}"></i>`).join('')}</span></button>`
      : `<span class="cal-d ${isToday(d) ? 'today' : ''}">${d}</span>`;
  })].join('');
  const st = weekStats();
  return `<section class="card">
    <div class="row between"><button class="mv" data-action="calMonth" data-dir="-1" aria-label="Previous month">${ICON.mvUp.replace('M6 15l6-6 6 6', 'M15 6l-6 6 6 6')}</button>
      <h3>${first.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</h3>
      <button class="mv" data-action="calMonth" data-dir="1" ${off >= 0 ? 'disabled' : ''} aria-label="Next month">${ICON.mvUp.replace('M6 15l6-6 6 6', 'M9 6l6 6-6 6')}</button></div>
    <div class="cal">${['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(d => `<span class="cal-h">${d}</span>`).join('')}${cells}</div>
    <div class="stats3 cal-stats">
      <div><b>${st.thisWeek}/${st.goal}</b><small>this week</small></div>
      <div><b>${st.streak}</b><small>week streak (${STREAK_MIN}+ a week)</small></div>
      <div><b>${st.avg == null ? '–' : fmt(Math.round(st.avg * 10) / 10)}</b><small>per week, last 8</small></div>
    </div>
    <div class="legend"><span><i class="dot cardio"></i>Cardio</span><span><i class="dot rest"></i>Rest day</span></div>
    <button class="btn block small" data-action="monthSummary">${first.toLocaleDateString(undefined, { month: 'long' })} summary</button>
  </section>`;
}

// A month in review: sessions, consistency, weight gains, records, muscle balance and energy.
function monthSummaryHtml(off) {
  const now = new Date(), from = new Date(now.getFullYear(), now.getMonth() + off, 1), to = new Date(from.getFullYear(), from.getMonth() + 1, 1);
  const inMonth = d => { const t = new Date(d).getTime(); return t >= from.getTime() && t < to.getTime(); };
  const ss = state.sessions.filter(s => inMonth(s.date));
  const title = from.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  if (!ss.length) return `<h2>${title}</h2><p class="empty">No workouts this month.</p>`;
  const weeks = Math.max(1, ((Math.min(to, now) - from) / DAY_MS) / 7);
  const byDay = DAYS.map(d => `${ss.filter(s => s.day === d).length} ${DAY_LABEL[d]}`).join(' · ');
  const vol = ss.reduce((t, s) => t + sessionVolume(s), 0);
  const mins = ss.filter(s => s.start).map(s => (new Date(s.date) - s.start) / 60000).filter(m => m > 1 && m < 300);
  const gains = state.exercises.map(e => {
    const inM = e.log.filter(l => inMonth(l.d));
    if (!inM.length) return null;
    const before = [...e.log].reverse().find(l => new Date(l.d) < from) || e.log[0];
    const end = inM[inM.length - 1].w, start = before.w;
    const better = isAssist(e) ? start - end : end - start;
    return better > 0 ? { e, start, end, pct: start ? Math.abs(end - start) / start : 0 } : null;
  }).filter(Boolean).sort((a, b) => b.pct - a.pct);
  const ups = state.exercises.reduce((n, e) => n + e.log.filter(l => l.why === 'up' && inMonth(l.d)).length, 0);
  const prs = ss.flatMap(s => s.prs || []);
  const sets = Object.keys(MUSCLES).map(m => ({ m, perWeek: 0 }));
  ss.forEach(s => s.entries.forEach(en => {
    const mm = musclesOf(en.exId, en.name), n = en.sets.filter(x => x.done).length;
    if (!mm) return;
    sets.forEach(x => { if (mm.p.includes(x.m)) x.perWeek += n / weeks; else if (mm.s.includes(x.m)) x.perWeek += n / 2 / weeks; });
  }));
  const trained = sets.filter(x => x.perWeek > 0).sort((a, b) => b.perWeek - a.perWeek);
  const under = sets.filter(x => Object.values(DAY_MUSCLES).flat().includes(x.m) && x.perWeek < 10).sort((a, b) => a.perWeek - b.perWeek);
  const en = ss.filter(s => s.energy);
  const avgE = en.length ? en.reduce((t, s) => t + s.energy, 0) / en.length : null;
  return `
  <h2>${title}</h2>
  <p class="sub">Your month in review</p>
  <div class="tiles" style="margin-top:12px">
    <div class="tile"><small>Workouts</small><b>${ss.length}</b></div>
    <div class="tile"><small>Per week</small><b>${fmt(Math.round(ss.length / weeks * 10) / 10)}</b></div>
    <div class="tile"><small>Weight increases</small><b>${ups}</b></div>
    <div class="tile"><small>Lifted</small><b>${vol >= 10000 ? `${fmt(r2(vol / 1000))}t` : `${fmt(vol)} kg`}</b></div>
  </div>
  <p class="hint">${byDay}${mins.length ? ` · about ${Math.round(mins.reduce((a, b) => a + b, 0) / mins.length)} min a session` : ''}</p>
  ${(() => {
    const xs = state.extras.filter(x => inMonth(x.d)), cm = xs.reduce((t, x) => t + (x.mins || 0), 0), rd = xs.filter(x => x.type === 'rest').length;
    return xs.length ? `<p class="hint" style="margin-top:4px">${[cm && `${cm} min of cardio`, rd && `${rd} rest day${rd > 1 ? 's' : ''} logged`].filter(Boolean).join(' · ')}</p>` : '';
  })()}
  ${gains.length ? `<h3 class="sum-h">Biggest gains</h3><div class="detail">${gains.slice(0, 5).map(g => `<div class="line"><div><b>${esc(g.e.name)}</b></div><span>${wt(g.e, g.start)} → ${wt(g.e, g.end)}${g.pct ? ` <span class="up-txt">${isAssist(g.e) ? '−' : '+'}${Math.round(g.pct * 100)}%</span>` : ''}</span></div>`).join('')}</div>` : ''}
  ${prs.length ? `<h3 class="sum-h">${prs.length} personal record${prs.length > 1 ? 's' : ''}</h3><div class="detail">${prs.slice(0, 8).map(p => `<div class="line"><div><b>${esc(p.name)}</b><small>${esc(p.text)}</small></div></div>`).join('')}</div>` : ''}
  <h3 class="sum-h">Muscle balance (sets a week)</h3>
  <p class="hint" style="margin-top:4px">Most: ${trained.slice(0, 3).map(x => `${MUSCLES[x.m]} ${fmt(Math.round(x.perWeek))}`).join(' · ') || '–'}</p>
  ${under.length ? `<p class="hint" style="margin-top:4px">Under 10: ${under.slice(0, 4).map(x => `${MUSCLES[x.m]} ${fmt(Math.round(x.perWeek))}`).join(' · ')}</p>` : '<p class="hint" style="margin-top:4px">Every main muscle averaged 10+ sets a week.</p>'}
  ${avgE ? `<h3 class="sum-h">Energy</h3><p class="hint" style="margin-top:4px">Average: <b>${ENERGY[Math.round(avgE) - 1]}</b> across ${en.length} rated session${en.length > 1 ? 's' : ''}.</p>` : ''}
  <button class="btn primary block" data-action="shareMonth">Summary picture</button>`;
}

function sessionDetailHtml(s) {
  return `
  <h2><span class="dot ${s.day}"></span> ${DAY_LABEL[s.day]}</h2>
  <p class="sub">${dLong(s.date)} · ${s.test ? 'AMRAP test' : 'Volume day'} · ${fmt(sessionVolume(s))} ${UNIT}</p>
  <div class="detail">${s.entries.map(en => `
    <div class="line"><div><b>${esc(en.name)}</b><small>${en.sets.filter(x => x.done).map(x => x.reps).join(' · ') || 'not done'}${isBW(unitSrc(en)) ? ` ${repUnit(unitSrc(en))}` : ''}${en.amrap ? ' (last set AMRAP)' : ''}</small></div>
    <span>${isBW(unitSrc(en)) ? 'Bodyweight' : wt(unitSrc(en), en.weight)}</span></div>`).join('')}
  </div>
  ${s.energy || s.note ? `<p class="hint">${s.energy ? `Energy: <b>${ENERGY[s.energy - 1]}</b>` : ''}${s.energy && s.note ? ' · ' : ''}${s.note ? esc(s.note) : ''}</p>` : ''}
  ${prsHtml(s)}
  ${s.outcomes.length ? `<ul class="outcomes">${s.outcomes.map(outcomeLi).join('')}</ul>` : ''}
  <button class="btn block" data-action="shareWorkout" data-id="${s.id}">Summary picture</button>
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
        ${isBW(unitSrc(en)) ? '' : `<label class="wt-in"><input type="number" inputmode="decimal" step="0.5" min="0" value="${en.weight}" data-es="${i}" data-k="w" aria-label="Weight"><em>${unitLabel(unitSrc(en))}</em></label>`}</div>
      <div class="edit-sets">${en.sets.map((st, j) => `
        <label class="reps"><input type="number" inputmode="numeric" min="0" value="${st.done ? st.reps : ''}" data-es="${i}" data-k="r" data-s="${j}"
          aria-label="Set ${j + 1} reps"><em>${en.amrap && j === en.sets.length - 1 ? 'AMRAP' : `set ${j + 1}`}</em></label>`).join('')}</div>
    </div>`).join('')}
  <div class="form">
    <label class="field">Energy<select id="fEnergy"><option value="">Not rated</option>${ENERGY.map((l, k) => `<option value="${k + 1}" ${s.energy === k + 1 ? 'selected' : ''}>${l}</option>`).join('')}</select></label>
    <label class="field full">Note<textarea id="fSessNote" rows="2">${esc(s.note || '')}</textarea></label>
  </div>
  <button class="btn primary block" data-action="saveSession" data-id="${s.id}">Save changes</button>`;
}

// Applies edits to a finished workout. If it's still the latest workout for an exercise, its weight change is redone
// from the corrected AMRAP; if later workouts already built on it, only the log is corrected.
function saveSession(s) {
  s.energy = Number($('#fEnergy')?.value) || undefined;
  s.note = $('#fSessNote')?.value.trim() || undefined;
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
    const bw = isBW(ex), prescribed = en.reps ?? o.prescribed ?? ex.reps;
    const base = { ...o, from: bw ? prescribed : en.weight };
    const later = state.sessions.some(x => new Date(x.date).getTime() > t && x.entries.some(y => y.exId === o.exId));
    const pe = { weight: en.weight, reps: prescribed, target: en.target, inc: stepOf(ex), prog: progOf(ex) };
    const next = last.done ? progressFor(pe, last.reps) : { status: 'skipped', to: base.from };
    if (later) { frozen++; return { ...base, status: next.status, reps: last.reps, to: next.to }; }
    // Undo what this workout changed, then apply the corrected result.
    while (ex.log.length > 1 && ex.log[ex.log.length - 1].d === s.date) ex.log.pop();
    const prev = ex.log[ex.log.length - 1]?.w ?? base.from;
    if (bw) { ex.reps = prev; ex.target = prev + gapOf(ex); } else ex.weight = prev;
    if (next.status !== 'hold' && next.status !== 'skipped') setLevel(ex, next.to, next.status, new Date(s.date));
    else if (!bw && en.weight !== ex.weight) setWeight(ex, en.weight, 'edit', new Date(s.date));
    ex.misses = next.status === 'hold' ? Math.max(1, ex.misses || 0) : 0;
    return { ...base, status: next.status, reps: last.reps, to: levelOf(ex), misses: ex.misses };
  });
  s.prs = findPRs(s, state.sessions.filter(x => new Date(x.date).getTime() < t));
  save();
  toast(frozen ? 'Saved. Later workouts already set the current weights, so those stay as they are.' : 'Workout updated');
}

function viewProgram() {
  setTitle('Program');
  const d = ui.progDay;
  const exs = state.exercises.filter(e => e.day === d && !e.hidden);
  const st = state.settings;
  const opt = (vals, cur, label) => vals.map(v => `<option value="${v}" ${v === cur ? 'selected' : ''}>${label(v)}</option>`).join('');
  return `
  <div class="seg">${DAYS.map(x => `<button data-action="progDay" data-day="${x}" class="${x === d ? 'on' : ''}"><span class="dot ${x}"></span>${DAY_LABEL[x]}</button>`).join('')}</div>
  <section class="card">
    <ul class="exlist">${exs.map((e, i) => `<li>
      <button class="open" data-action="editEx" data-id="${e.id}"><b>${esc(e.name)}${e.inPlan ? ' <span class="tag">In plan</span>' : ''}</b>
        <small>${isBW(e) ? (progOf(e) === 'time' ? 'Hold' : 'Bodyweight') : e.weight == null ? 'No weight yet' : wt(e, e.weight)} · ${rx(e)} · ${e.amrap ? `up from ${e.target} ${repUnit(e)}` : 'no AMRAP'} · rest ${mmss(e.rest || 120)}${variantOf(e) ? ` · ${variantOf(e).labels[variantOf(e).side].toLowerCase()} version` : ''}</small></button>
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
    <div class="setting"><span><b>Appearance</b><small>System follows your phone. Focus is true black and minimal, Vivid is bold with more colour, Soft is light and rounded.</small></span>
      <select class="pick" data-bind="theme">${opt(['auto', 'light', 'dark', 'focus', 'vivid', 'soft'], st.theme === 'black' ? 'focus' : st.theme || 'auto', v => ({ auto: 'System', light: 'Light', dark: 'Dark', focus: 'Focus', vivid: 'Vivid', soft: 'Soft' }[v]))}</select></div>
    <div class="setting"><span><b>Barbell weight</b><small>For the plate calculator (kg lifts). Pound lifts use a 45 lb bar.</small></span>
      <select class="pick" data-bind="bar">${opt([20, 15, 10], st.bar ?? 20, v => `${v} kg`)}</select></div>
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
    <button class="btn block small" data-action="csv">Export workouts as CSV (for spreadsheets)</button>
    <button class="btn block small" data-action="replayIntro">How the app works</button>
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
    <li><b>Bodyweight moves</b> (push-ups, dips, pull-ups, chin-ups) progress by reps, and planks by seconds. Hit the target and next time's reps per set become about 75% of your AMRAP (at least +1), which keeps working sets 2–3 reps short of failure. When the reps get high, switch the exercise to <b>Weighted</b> and it progresses by added weight instead.</li>
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
  ${variantOf(e) ? `<div class="eq-line">${variantToggle(e, 'edit')}</div>` : ''}
  <div class="form">
    <label class="field full">Name<input id="fName" value="${esc(e.name)}" autocomplete="off"></label>
    <label class="field">Day<select id="fDay">${DAYS.map(d => `<option value="${d}" ${d === e.day ? 'selected' : ''}>${DAY_LABEL[d]}</option>`).join('')}</select></label>
    <label class="field">Progresses by<select id="fProg">${[['weight', 'Weight'], ['reps', 'Reps (bodyweight)'], ['time', 'Hold time'], ['assist', 'Assistance (lower is better)']].map(([v, l]) => `<option value="${v}" ${progOf(e) === v ? 'selected' : ''}>${l}</option>`).join('')}</select></label>
    ${isBW(e) ? '' : `
    <label class="field">Units<select id="fUnit">${['kg', 'lb'].map(u => `<option value="${u}" ${unitOf(e) === u ? 'selected' : ''}>${u === 'kg' ? 'Kilograms (kg)' : 'Pounds (lb)'}</option>`).join('')}</select></label>
    <label class="field">Weight logged as<select id="fLoad">${[['single', 'One weight'], ['each', 'Per dumbbell'], ['total', 'Both dumbbells total']].map(([v, l]) => `<option value="${v}" ${loadOf(e) === v ? 'selected' : ''}>${l}</option>`).join('')}</select></label>
    <p class="hint full" style="margin:0">Changing units or per dumbbell/total converts this exercise's history too. Increases are per dumbbell, so logging totals doubles each jump.</p>
    <label class="field">Current weight (${unitLabel(e)})<input id="fWeight" type="number" inputmode="decimal" step="0.5" min="0" value="${e.weight ?? ''}"></label>`}
    <label class="field">Sets<input id="fSets" type="number" inputmode="numeric" min="1" max="10" value="${e.sets}"></label>
    <label class="field">${progOf(e) === 'time' ? 'Seconds' : 'Reps'} per set<input id="fReps" type="number" inputmode="numeric" min="1" value="${e.reps}"></label>
    <label class="toggle"><span>AMRAP last set on test days<small>Turn off for exercises you don't want to progress automatically.</small></span><input id="fAmrap" type="checkbox" ${e.amrap ? 'checked' : ''}></label>
    <label class="field">Move up at (${repUnit(e)})<input id="fTarget" type="number" inputmode="numeric" min="1" value="${e.target}"></label>
    ${isBW(e) ? '' : `<label class="field">Increase by (${unitOf(e)}${loadOf(e) === 'single' ? '' : ' per dumbbell'})<input id="fInc" type="number" inputmode="decimal" step="0.25" min="0" value="${e.inc}"></label>`}
    <label class="field">Rest between sets<select id="fRest">${[60, 90, 120, 150, 180, 240].map(v => `<option value="${v}" ${v === (e.rest || 120) ? 'selected' : ''}>${mmss(v)}</option>`).join('')}</select></label>
    <label class="toggle"><span>In plan<small>Ticked by default when you start a ${DAY_LABEL[e.day]} session.</small></span><input id="fPlan" type="checkbox" ${e.inPlan ? 'checked' : ''}></label>
    ${isBW(e) || isAssist(e) ? '' : `<label class="toggle"><span>Uses a barbell<small>Shows which plates to load on each side.</small></span><input id="fBar" type="checkbox" ${isBar(e) ? 'checked' : ''}></label>`}
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
    weight.push({ x: Date.now(), y: levelOf(ex), why: 'now' });
  }
  const amrap = [], e1rm = [];
  for (const s of state.sessions) {
    const en = s.entries.find(x => x.exId === ex.id);
    if (!en) continue;
    const t = new Date(s.date).getTime();
    const last = en.sets[en.sets.length - 1];
    if (en.amrap && last.done) amrap.push({ x: t, y: last.reps, target: en.target, w: en.weight });
    if (isBW(ex) || isAssist(ex)) {
      // Bodyweight and assisted: chart the best set instead of an estimated max.
      const top = Math.max(0, ...en.sets.filter(x => x.done).map(x => x.reps));
      if (top > 0) e1rm.push({ x: t, y: top });
      continue;
    }
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
  // Only exercises you've set a weight for or trained; a switched-away version only if you actually trained it.
  const trained = new Set(state.sessions.flatMap(s => s.entries.map(en => en.exId)));
  const tracked = state.exercises.filter(e => e.log.length && (!e.hidden || trained.has(e.id)));
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
  if (!ex) return tiles + muscleCard() + strengthCard() + bodyCard();

  const bw = isBW(ex), u = repUnit(ex);
  const start = ex.log.length ? ex.log[0].w : levelOf(ex);
  const change = start > 0 ? Math.round(100 * (levelOf(ex) - start) / start) : null;

  return `${tiles}
  ${muscleCard()}
  <div class="picker">
    <select class="pick" data-bind="pickEx" aria-label="Exercise">${DAYS.map(d => `<optgroup label="${DAY_LABEL[d]}">${
      tracked.filter(e => e.day === d).map(e => `<option value="${e.id}" ${e.id === ex.id ? 'selected' : ''}>${esc(e.name)}</option>`).join('')}</optgroup>`).join('')}</select>
  </div>
  <div class="headline"><b>${wt(ex, levelOf(ex))}${bw ? ' per set' : ''}</b>
    <span>${unitOf(ex) === 'lb' && !bw ? `(${fmt(Math.round(toKg(ex, ex.weight) * 10) / 10)} kg) ` : ''}${change === null ? `current working ${bw ? u : 'weight'}` : `from ${wt(ex, start)}${change ? `, <span class="up-txt">${change > 0 ? '+' : ''}${change}%</span>` : ''}`}</span></div>

  ${(() => {
    const g = goalFor(ex.id), i = g && goalInfo(g);
    return `<div class="goal-line"><span>${i ? `Goal: <b>${wt(ex, g.target)}</b> by ${dShort(g.by)} · ${i.status}${i.eta && !i.done ? ` (${dShort(i.eta)} at this rate)` : ''}` : 'No goal for this exercise'}</span>
      <button class="btn small" data-action="goalSheet" data-id="${ex.id}">${i ? 'Edit' : 'Set goal'}</button></div>`;
  })()}
  <section class="card chart-card"><h3>${bw ? (u === 's' ? 'Hold per set' : 'Reps per set') : isAssist(ex) ? 'Assistance' : 'Working weight'}</h3><p class="sub">${isAssist(ex) ? 'Steps down each time you hit the AMRAP target. Lower is better.' : 'Steps up each time you hit the AMRAP target'}</p><div class="chart" id="cWeight"></div></section>
  <section class="card chart-card"><h3>${u === 's' ? 'Max hold' : 'AMRAP reps'}</h3><p class="sub">Last set on test days against the target</p><div class="chart" id="cAmrap"></div>
    <div class="legend"><span><i style="background:var(--${ex.day})"></i>Target hit</span><span><i style="background:var(--muted);opacity:.45"></i>Missed</span><span><i style="height:0;border-top:2px dashed var(--text-2);border-radius:0"></i>Target</span></div></section>
  <section class="card chart-card"><h3>${bw || isAssist(ex) ? 'Best set' : 'Estimated 1-rep max'}</h3><p class="sub">${bw || isAssist(ex) ? `Most ${u === 's' ? 'seconds' : 'reps'} in one set each session` : 'Best set each session (Epley formula)'}</p><div class="chart" id="cE1rm"></div></section>
  <section class="card chart-card"><h3>Weekly volume</h3><p class="sub">Weight × reps across all exercises, last 10 weeks</p><div class="chart" id="cVol"></div>
    <div class="legend">${DAYS.map(d => `<span><i style="background:var(--${d})"></i>${DAY_LABEL[d]}</span>`).join('')}</div></section>

  <section class="card"><h3>All lifts</h3>
    <table class="lifts"><thead><tr><th>Exercise</th><th>Start</th><th>Now</th><th>Change</th></tr></thead><tbody>
    ${tracked.map(e => {
      const s0 = e.log[0].w;
      const diff = r2((levelOf(e) || 0) - (s0 || 0));
      const tag = isBW(e) ? repUnit(e) : unitOf(e) === 'lb' ? 'lb' : '';
      return `<tr class="${e.id === ex.id ? 'sel' : ''}" data-action="pickExRow" data-id="${e.id}"><td><span class="dot ${e.day}"></span>${esc(e.name)}${tag ? ` <small class="muted">${tag}</small>` : ''}</td>
        <td>${fmt(s0 || 0)}</td><td>${fmt(levelOf(e) || 0)}</td><td class="${diff > 0 ? 'up-txt' : 'muted'}">${diff > 0 ? '+' : ''}${fmt(diff)}</td></tr>`;
    }).join('')}
    </tbody></table></section>
  ${recordsCard()}
  ${strengthCard()}
  ${bodyCard()}`;
}

/* Strength levels: best estimated max ÷ bodyweight, against the bodyweight multiples used by common strength
 * standards (beginner to elite). A rough guide to where you stand, not a test result. */
const STANDARDS = {
  men: { 'Back Squat': [0.75, 1, 1.5, 2, 2.5], 'Barbell Bench Press': [0.5, 0.75, 1, 1.5, 2], 'Deadlift': [1, 1.25, 1.75, 2.5, 3], 'Overhead Press': [0.35, 0.55, 0.75, 1, 1.25] },
  women: { 'Back Squat': [0.5, 0.75, 1.25, 1.5, 2], 'Barbell Bench Press': [0.25, 0.5, 0.75, 1, 1.5], 'Deadlift': [0.5, 1, 1.25, 1.75, 2.5], 'Overhead Press': [0.2, 0.35, 0.5, 0.75, 1] },
};
const LEVELS = ['Beginner', 'Novice', 'Intermediate', 'Advanced', 'Elite'];

function strengthCard() {
  const bw = latestBW(), pick = state.settings.standards;
  const seg = `<div class="seg mini">${[['men', "Men's"], ['women', "Women's"]].map(([v, l]) => `<button data-action="standards" data-v="${v}" class="${pick === v ? 'on' : ''}">${l}</button>`).join('')}</div>`;
  let body;
  if (!bw) body = '<p class="hint">Log your bodyweight below to see where your squat, bench, deadlift and overhead press stand.</p>';
  else if (!pick) body = '<p class="hint">Choose which standards to compare against.</p>';
  else {
    const rows = Object.entries(STANDARDS[pick]).map(([name, th]) => {
      const ex = state.exercises.find(e => e.name === name);
      const best = ex && bestsFor(ex.id, state.sessions).e1rm;
      if (!best) return '';
      const ratio = toKg(ex, best) / bw;
      const lvl = th.filter(t => ratio >= t).length - 1;
      const next = th[lvl + 1];
      const lo = lvl >= 0 ? th[lvl] : 0, pct = next ? Math.min(100, (ratio - lo) / (next - lo) * 100) : 100;
      return `<div class="lvl"><div class="row between"><b>${esc(name)}</b><span>${ratio.toFixed(2)}× · <b>${lvl >= 0 ? LEVELS[lvl] : 'Below beginner'}</b></span></div>
        <div class="lvlbar"><span style="width:${pct}%"></span></div>
        <small>${next ? `${LEVELS[lvl + 1]} at ${next}× (about ${wt(ex, Math.round(next * bw / (unitOf(ex) === 'lb' ? LB : 1)))} estimated max)` : 'Top level reached'}</small></div>`;
    }).join('');
    body = rows || '<p class="hint">Do a test day with squat, bench, deadlift or overhead press to see your level.</p>';
  }
  return `<section class="card"><div class="row between"><h3>Strength level</h3>${seg}</div>${body}
    ${bw && pick ? '<p class="hint">Estimated max divided by your latest bodyweight, compared with the bodyweight multiples common strength standards use. A rough guide.</p>' : ''}</section>`;
}

const latestBW = () => state.body.length ? state.body[state.body.length - 1].w : null;

function recordsCard() {
  const bw = latestBW();
  const rows = state.exercises.map(e => ({ e, b: bestsFor(e.id, state.sessions) })).filter(r => r.b.sets.length)
    .sort((a, b) => (b.e.kind === 'main') - (a.e.kind === 'main'));
  if (!rows.length) return '';
  return `<section class="card"><h3>Records</h3>
    <table class="lifts"><thead><tr><th>Exercise</th><th>Heaviest</th><th>Est. max</th>${bw ? '<th>× body</th>' : ''}</tr></thead><tbody>
    ${rows.map(({ e, b }) => `<tr><td><span class="dot ${e.day}"></span>${esc(e.name)}${unitOf(e) === 'lb' && !isBW(e) ? ' <small class="muted">lb</small>' : ''}</td>
      ${isBW(e) ? `<td>${b.maxReps} ${repUnit(e)}</td><td>–</td>`
        : isAssist(e) ? `<td>${fmt(Math.min(...b.sets.map(x => x.w)))} assist</td><td>–</td>`
        : `<td>${fmt(b.heavy)} × ${b.heavyReps}</td><td>${fmt(Math.round(b.e1rm))}</td>`}
      ${bw ? `<td>${e.kind === 'main' && !isBW(e) ? `${(toKg(e, b.e1rm) / bw).toFixed(2)}×` : '–'}</td>` : ''}</tr>`).join('')}
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

// Front and back figure, drawn as the left half around x = 80 and mirrored. Shading: none, hit in one session,
// hit in two or more sessions (as a primary muscle). '' entries are anatomy detail that never shades.
const SILHOUETTE = 'M80 42 L73 42 C73 48 73 51 71 53 C64 56 57 57 52 60 C45 63 41 69 41 78 C39 92 38 108 37 126 '
  + 'C35 138 33 150 32 166 C30 174 30 182 33 189 C36 192 40 190 41 185 C42 178 42 172 43 166 C45 152 47 140 49 128 '
  + 'C50 116 52 102 55 90 C55 102 57 114 60 126 C57 136 54 146 54 156 C52 176 53 198 57 218 C54 232 54 248 59 266 '
  + 'C60 272 60 276 58 282 C55 287 56 291 62 291 L72 291 C74 286 72 280 70 274 C72 258 73 242 71 224 '
  + 'C73 204 76 184 79 164 L80 163 Z';
const FOREARM = 'M38 130 C36 142 34 154 34 164 L41 165 C43 152 46 141 48 131 C45 128 41 128 38 130 Z';
const SIDE_DELT = 'M52 59.5 C45 61 41 68 41 79 L44.5 80 C44.5 70 47 63 52 59.5 Z';
const BODY_FRONT = [
  ['upperBack', 'M72 50 C68 54 62 56 56 58 C62 59.5 68 59.5 73 58.5 Z'],
  ['sideDelts', SIDE_DELT],
  ['frontDelts', 'M53 60 C48 62 45 68 45 80 C49 78 53 75 57 70 C58 65 57 61 53 60 Z'],
  ['chest', 'M79 61 C71 59 62 61 58 66 C56 73 56 81 59 88 C65 93 73 94 79 91 Z'],
  ['biceps', 'M45 84 C43 94 42 106 43 118 C45 121 48 120 49 117 C51 106 52 96 53 88 C51 85 48 83 45 84 Z'],
  ['', FOREARM],
  ['', 'M60 96 C60 108 61 120 63 130 C65 137 68 142 71.5 145 L71.5 97 C67 95.5 63 95 60 96 Z'],
  ['abs', 'M73 96 H79 V105 H73 Z M73 107 H79 V116 H73 Z M73 118 H79 V127 H73 Z M73 129 H79 V147 C76 145 74 140 73 134 Z'],
  ['quads', 'M56 160 C54 178 55 198 59 214 C62 219 68 219 70 214 C73 198 75 180 75 164 C69 160 62 158 56 160 Z'],
  ['adductors', 'M76.5 165 C77.5 178 76.5 192 74 206 C77 200 78.8 188 79.3 176 L79.3 165 Z'],
  ['', 'M60 219 C60 225 62 229 65 229 C68 229 70 225 70 219 C67 221 63 221 60 219 Z'],
  ['calves', 'M58 234 C56 246 57 258 60 268 C63 268 66 266 67 262 C69 252 70 242 69 233 C65 231 61 231 58 234 Z'],
];
const BODY_BACK = [
  ['upperBack', 'M80 44 C77 50 70 55 58 59 C62 62 68 68 73 80 C76 90 78.5 100 80 108 Z'],
  ['sideDelts', SIDE_DELT],
  ['rearDelts', 'M53 60 C48 62 45 68 45 79 C49 77 54 73 58 69 C58 64 57 61 53 60 Z'],
  ['triceps', 'M44 83 C42 94 42 106 43 118 C46 121 49 120 50 117 C51 106 52 96 53 88 C50 84 47 82 44 83 Z'],
  ['', FOREARM],
  ['lats', 'M58 72 C62 78 68 88 72 100 C75 112 76 124 76 134 C70 132 64 126 61 116 C58 104 57 88 58 72 Z'],
  ['lowerBack', 'M75 114 C74 124 74 136 75.5 146 L79.3 148 L79.3 112 Z'],
  ['abductors', 'M57 142 C54 147 54 153 57 158 C62 156 67 151 70 145 C66 141 61 140 57 142 Z'],
  ['glutes', 'M58 154 C55 164 58 176 67 180 C74 181 78 178 79.3 174 L79.3 151 C72 149 64 150 58 154 Z'],
  ['hamstrings', 'M57 184 C56 196 58 208 61 216 C65 219 70 218 72 214 C75 202 76 192 76.5 183 C70 185 63 186 57 184 Z'],
  ['calves', 'M58 228 C55 238 56 250 60 260 C64 263 69 261 70 254 C72 246 72 236 70 227 C66 225 61 225 58 228 Z'],
];

const mirrored = d => `<path d="${d}"/><path d="${d}" transform="translate(160 0) scale(-1 1)"/>`;

// Small figure for an exercise: main muscles in the accent colour, helping muscles lighter. Shows the front or back,
// cropped to the upper or lower body, whichever holds the first main muscle.
const BACK_MUSCLES = new Set(['upperBack', 'rearDelts', 'triceps', 'lats', 'lowerBack', 'abductors', 'glutes', 'hamstrings']);
const LEG_MUSCLES = new Set(['quads', 'hamstrings', 'glutes', 'adductors', 'abductors', 'calves']);
function muscleThumb(exId, name) {
  const mm = musclesOf(exId, name);
  if (!mm) return '';
  const lead = mm.p[0], shapes = BACK_MUSCLES.has(lead) ? BODY_BACK : BODY_FRONT;
  const cls = m => (mm.p.includes(m) ? 'p' : mm.s.includes(m) ? 's' : '');
  return `<svg class="mthumb" viewBox="${LEG_MUSCLES.has(lead) ? '30 138 100 156' : '30 6 100 156'}" aria-hidden="true">
    <g class="sil"><ellipse cx="80" cy="26" rx="12.5" ry="16.5"/>${mirrored(SILHOUETTE)}</g>
    ${shapes.filter(([m]) => m && cls(m)).map(([m, d]) => `<g class="${cls(m)}">${mirrored(d)}</g>`).join('')}</svg>`;
}

function figure(shapes, x, lvl) {
  return `<g transform="translate(${x} 0)">
    <g class="sil"><ellipse cx="80" cy="26" rx="12.5" ry="16.5"/>${mirrored(SILHOUETTE)}</g>
    ${shapes.map(([m, d]) => m
      ? `<g class="bm h${lvl(m)}" data-action="muscle" data-m="${m}"><title>${MUSCLES[m]}</title>${mirrored(d)}</g>`
      : `<g class="bm-detail">${mirrored(d)}</g>`).join('')}
  </g>`;
}

function muscleCard() {
  const ws = weekStart(new Date());
  if (ui.mWeek) ws.setDate(ws.getDate() - 7);
  const data = muscleWeek(ws);
  const lvl = m => Math.min(2, data[m].sessions.size);
  const svg = `<svg class="bodymap" viewBox="14 4 292 304" role="img" aria-label="Muscles trained this week">
    ${figure(BODY_FRONT, 0, lvl)}${figure(BODY_BACK, 160, lvl)}
    <text x="80" y="305" text-anchor="middle">Front</text><text x="240" y="305" text-anchor="middle">Back</text></svg>`;
  const hit = Object.keys(MUSCLES).filter(m => data[m].sessions.size).length;
  const rows = Object.keys(MUSCLES).map(m => {
    const sets = data[m].sets;
    return `<tr data-action="muscle" data-m="${m}"><td>${MUSCLES[m]}</td><td>${data[m].sessions.size || '–'}</td><td>${sets ? fmt(r2(sets)) : '–'}</td>
      <td class="setbar"><span class="band"></span><span class="fill" style="width:${Math.min(100, sets / 25 * 100)}%"></span></td></tr>`;
  }).join('');
  return `<section class="card">
    <div class="row between"><h3>Muscles ${ui.mWeek ? 'last week' : 'this week'}</h3>
      <div class="seg mini">${['This week', 'Last week'].map((l, i) => `<button data-action="mWeek" data-w="${i}" class="${(ui.mWeek || 0) === i ? 'on' : ''}">${l}</button>`).join('')}</div></div>
    <div class="bodywrap">${svg}</div>
    <div class="legend center"><span><i class="lg h0"></i>Not trained</span><span><i class="lg h1"></i>Once</span><span><i class="lg h2"></i>Twice or more</span></div>
    <p class="minfo" id="mInfo"><b>${hit} of ${Object.keys(MUSCLES).length}</b> muscle groups trained. Tap a muscle for details.</p>
    <details class="more"><summary>Sets per muscle</summary>
      <table class="lifts msets"><thead><tr><th>Muscle</th><th>Sessions</th><th>Sets</th><th>10–20 sets</th></tr></thead><tbody>${rows}</tbody></table>
      <p class="hint">Research on muscle growth points to roughly 10–20 hard sets per muscle per week (the shaded band). Main muscles count a full set, helping muscles half a set.</p>
    </details>
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
  const why = { start: isBW(ex) ? 'Start' : 'Starting weight', up: 'Moved up', down: isBW(ex) ? 'Too hard, lowered' : 'Too heavy, lowered', deload: 'Deload', edit: 'Edited', now: 'Today' };

  lineChart($('#cWeight'), {
    pts: weight, step: true, color, label: `${ex.name} working weight`,
    ref: goalFor(ex.id) && { y: goalFor(ex.id).target, label: `Goal ${wt(ex, goalFor(ex.id).target)}` },
    tip: p => `<b>${wt(ex, p.y)}</b><br>${why[p.why] || ''} · ${dShort(p.x)}`,
  });
  barChart($('#cAmrap'), {
    bars: amrap.map(p => ({ ...p, color: p.y >= p.target ? color : 'var(--muted)', dim: p.y < p.target })),
    ref: ex.target, label: `${ex.name} AMRAP reps`,
    tip: p => `<b>${p.y} ${isBW(ex) ? repUnit(ex) : 'reps'}</b>${isBW(ex) ? '' : ` @ ${wt(ex, p.w)}`}<br>${p.y >= p.target ? 'Hit' : 'Missed'} target ${p.target} · ${dShort(p.x)}`,
  });
  lineChart($('#cE1rm'), {
    pts: e1rm, color, label: `${ex.name} estimated one-rep max`,
    tip: p => `<b>${isAssist(ex) ? `${p.y} reps` : `${isBW(ex) ? '' : '~'}${wt(ex, Math.round(p.y))}`}</b><br>${dShort(p.x)}`,
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

function lineChart(host, { pts, step, color, tip, label, ref }) {
  if (!pts.length) { host.innerHTML = '<p class="empty">No data yet. Log a workout with this exercise.</p>'; return; }
  const W = Math.max(260, host.clientWidth), H = 180, m = { l: 40, r: 12, t: 40, b: 22 };
  let x0 = pts[0].x, x1 = pts[pts.length - 1].x;
  if (x1 - x0 < DAY_MS) { x0 -= 3 * DAY_MS; x1 += 3 * DAY_MS; }
  const ys = pts.map(p => p.y);
  let lo = Math.min(...ys, ref?.y ?? Infinity), hi = Math.max(...ys, ref?.y ?? -Infinity);
  if (hi - lo < 1) { lo -= 2.5; hi += 2.5; }
  lo = Math.max(0, lo);
  const t = niceTicks(lo, hi), y0 = t[0], y1 = t[t.length - 1];
  const X = v => m.l + (v - x0) / (x1 - x0) * (W - m.l - m.r);
  const Y = v => m.t + (1 - (v - y0) / (y1 - y0)) * (H - m.t - m.b);
  const d = pts.map((p, i) => i === 0 ? `M${X(p.x)},${Y(p.y)}` : step ? `H${X(p.x)}V${Y(p.y)}` : `L${X(p.x)},${Y(p.y)}`).join('');
  const marks = pts.length <= 40 ? pts.map(p => `<circle class="mk" cx="${X(p.x)}" cy="${Y(p.y)}" r="4" fill="${color}"/>`).join('') : '';
  const base = H - m.b, area = pts.length > 1 ? `<path class="area" d="${d}V${base}H${X(pts[0].x)}Z" fill="${color}"/>` : '';
  const goal = ref ? `<line class="ref" x1="${m.l}" x2="${W - m.r}" y1="${Y(ref.y)}" y2="${Y(ref.y)}"/><text class="reflabel" x="${W - m.r}" y="${Y(ref.y) - 5}" text-anchor="end">${esc(ref.label)}</text>` : '';
  host.innerHTML = `<svg class="viz" viewBox="0 0 ${W} ${H}" width="100%" height="${H}" role="img" aria-label="${esc(label)}">
    ${axisY(t, Y, m, W)}${axisX(x0, x1, H, m, W)}${area}${goal}
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

// Undo: risky actions save a snapshot first and show a toast with an Undo button for a few seconds.
let undoSnap = null;
const snapshot = () => { undoSnap = JSON.stringify(state); };

let toastT;
function toast(msg, undo = false) {
  const t = $('#toast');
  t.innerHTML = esc(msg) + (undo ? ' <button data-action="undo">Undo</button>' : '');
  t.classList.toggle('has-btn', undo);
  clearTimeout(toastT);
  t.classList.add('on');
  toastT = setTimeout(() => t.classList.remove('on', 'has-btn'), undo ? 6000 : 2400);
}

/* Hold timer for timed sets (planks): tap ▶ to start, tap again to stop. The seconds go into the set, it's ticked,
 * and the rest timer starts. It beeps once you reach the set's goal. */
const hold = { e: null, s: null, start: 0, iv: null, beeped: false };
function tickHold() {
  const en = state.active?.entries[hold.e];
  if (!en) return stopHold(false);
  const secs = Math.floor((Date.now() - hold.start) / 1000);
  const inp = $(`[data-bind="setR"][data-e="${hold.e}"][data-s="${hold.s}"]`);
  if (inp) inp.value = secs;
  const goal = en.amrap && hold.s === en.sets.length - 1 ? en.target : en.reps;
  if (!hold.beeped && secs >= goal) { hold.beeped = true; beep(); }
}
function stopHold(record) {
  clearInterval(hold.iv);
  hold.iv = null;
  const en = state.active?.entries[hold.e];
  if (record && en) {
    const st = en.sets[hold.s];
    st.reps = Math.floor((Date.now() - hold.start) / 1000);
    st.done = true;
    save();
    startRest(restFor(en));
  }
  hold.e = hold.s = null;
  if (state.active) render();
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

// Hands a file to the iPhone share sheet (Save to Files, AirDrop…), or downloads it where sharing isn't available.
// Resolves false if the person cancelled.
async function shareFile(name, text, type, title) {
  const blob = text instanceof Blob ? text : new Blob([text], { type });
  try {
    const file = new File([blob], name, { type });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], title });
      return true;
    }
  } catch (e) { if (e.name === 'AbortError') return false; }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  return true;
}

async function exportData() {
  const ok = await shareFile(`ppl-backup-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(state), 'application/json', 'PPL backup');
  if (ok) backedUp();
}

/* Shareable image: draws a 1080 × 1080 card (title band in the day's colour, stat boxes, short lists) and hands it
 * to the share sheet as a PNG. c = { title, sub, color, stats: [[value, label]], sections: [{ h, items: [[left, right]] }], foot } */
function drawCard(cv, c, photo) {
  const W = 1080, H = 1080; // square, for Instagram
  cv.width = W; cv.height = H;
  const x = cv.getContext('2d');
  const font = (px, w = 700) => `${w} ${px}px -apple-system, "Segoe UI", Roboto, sans-serif`;
  const fit = (t, max) => {
    if (x.measureText(t).width <= max) return t;
    while (t.length > 1 && x.measureText(`${t}…`).width > max) t = t.slice(0, -1);
    return `${t}…`;
  };
  const box = (bx, by, bw, bh, r) => { x.beginPath(); if (x.roundRect) x.roundRect(bx, by, bw, bh, r); else x.rect(bx, by, bw, bh); x.fill(); };
  x.fillStyle = '#111214'; x.fillRect(0, 0, W, H);
  if (photo) {
    // Fill the square with the photo (cropped from the centre), then darken it so the text stays readable.
    const s = Math.max(W / photo.width, H / photo.height), pw = photo.width * s, ph = photo.height * s;
    x.drawImage(photo, (W - pw) / 2, (H - ph) / 2, pw, ph);
    const g = x.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, 'rgba(0,0,0,.62)'); g.addColorStop(0.45, 'rgba(0,0,0,.42)'); g.addColorStop(1, 'rgba(0,0,0,.78)');
    x.fillStyle = g; x.fillRect(0, 0, W, H);
  } else {
    // Default background: the day's colour in the top-left corner fading diagonally into near-black.
    x.fillStyle = c.color; x.fillRect(0, 0, W, H);
    const g = x.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, 'rgba(8,9,12,.05)'); g.addColorStop(0.5, 'rgba(8,9,12,.6)'); g.addColorStop(1, 'rgba(8,9,12,.95)');
    x.fillStyle = g; x.fillRect(0, 0, W, H);
  }
  photo = true; // both backgrounds use the same light-on-dark text styles below
  x.fillStyle = '#fff'; x.fillRect(80, 84, 120, 12);
  x.font = font(96, 800); x.fillText(fit(c.title, W - 160), 80, 200);
  x.globalAlpha = 0.92; x.font = font(40, 500); x.fillText(fit(c.sub, W - 160), 80, 262); x.globalAlpha = 1;
  const n = c.stats.length, gap = 22, bw = (W - 160 - gap * (n - 1)) / n, sy = 320;
  c.stats.forEach(([v, l], i) => {
    const bx = 80 + i * (bw + gap);
    x.fillStyle = 'rgba(0,0,0,.38)'; box(bx, sy, bw, 170, 26);
    x.fillStyle = '#f5f5f2'; x.font = font(n > 3 ? 46 : 62, 800); x.fillText(fit(String(v), bw - 48), bx + 26, sy + 82);
    x.fillStyle = photo ? '#d6d5cf' : '#a3a29b'; x.font = font(29, 500); x.fillText(fit(l, bw - 48), bx + 26, sy + 132);
  });
  let y = 580;
  for (const sec of c.sections) {
    if (!sec.items.length || y > H - 230) continue;
    x.fillStyle = photo ? '#fff' : c.color; x.font = font(32, 700); x.fillText(sec.h, 80, y);
    y += 18;
    for (const [left, right] of sec.items) {
      if (y > H - 190) break;
      y += 58;
      x.font = font(36, 700);
      const rw = right ? x.measureText(right).width : 0;
      if (right) { x.fillStyle = '#6fdb9c'; x.fillText(right, W - 80 - rw, y); }
      x.fillStyle = '#f5f5f2'; x.font = font(36, 500); x.fillText(fit(left, W - 200 - rw), 80, y);
    }
    y += 76;
  }
  x.fillStyle = photo ? '#d6d5cf' : '#a3a29b'; x.font = font(30, 600); x.fillText('PPL Overload', 80, H - 64);
  if (c.foot) { x.fillStyle = '#f5f5f2'; x.fillText(c.foot, W - 80 - x.measureText(c.foot).width, H - 64); }
}

// Picture sheet: a live preview with a colour background, or one of your own photos behind it, then save.
const share = { card: null, name: '', photo: null };
function openShare(card, name) {
  Object.assign(share, { card, name, photo: null });
  openSheet(`
  <h2>Summary picture</h2>
  <canvas id="shareCv" class="share-cv"></canvas>
  <button class="btn primary block" data-action="shareSend">Save picture</button>
  <div class="btnrow" style="margin-top:8px">
    <label class="btn small ghost" style="text-align:center">Use my own photo as the background<input type="file" accept="image/*" data-bind="sharePhoto" hidden></label>
    <button class="btn small ghost" data-action="sharePhotoClear" id="sharePhotoClear" hidden>Remove photo</button>
  </div>`);
  drawCard($('#shareCv'), card, null);
}

function setSharePhoto(file) {
  if (!file) return;
  const img = new Image(), url = URL.createObjectURL(file);
  img.onload = () => {
    share.photo = img;
    drawCard($('#shareCv'), share.card, img);
    $('#sharePhotoClear').hidden = false;
    URL.revokeObjectURL(url);
  };
  img.onerror = () => toast('That photo could not be opened');
  img.src = url;
}

const cssColor = v => getComputedStyle(document.documentElement).getPropertyValue(v).trim() || '#3987e5';
const streakFoot = () => { const s = weekStats().streak; return s > 1 ? `${s}-week streak` : ''; };
const bigKg = v => (v >= 10000 ? `${fmt(Math.round(v / 100) / 10)} t` : `${fmt(v)} kg`);

function workoutCard(s) {
  const mins = Math.max(1, Math.round((new Date(s.date) - s.start) / 60000));
  const sets = s.entries.reduce((n, en) => n + en.sets.filter(st => st.done).length, 0);
  return {
    title: `${DAY_LABEL[s.day]} day`, sub: `${dLong(s.date)} · ${s.entries.length} exercises`, color: cssColor(`--${s.day}`),
    stats: [[`${mins} min`, 'duration'], [bigKg(sessionVolume(s)), 'lifted'], [sets, 'sets']],
    sections: [
      { h: 'Personal records', items: (s.prs || []).slice(0, 4).map(p => [p.name, 'new best']) },
      { h: 'Moving up next time', items: s.outcomes.filter(o => o.status === 'up').slice(0, 6).map(o => [o.name, `${fmt(o.from)} → ${wt(unitSrc(o), o.to)}`]) },
      { h: 'Exercises', items: s.entries.slice(0, 8).map(en => [en.name, isBW(unitSrc(en)) ? `${en.sets.filter(st => st.done).length} sets` : wt(unitSrc(en), en.weight)]) },
    ],
    foot: streakFoot(),
  };
}

function monthCard(off) {
  const now = new Date(), from = new Date(now.getFullYear(), now.getMonth() + off, 1), to = new Date(from.getFullYear(), from.getMonth() + 1, 1);
  const inM = d => { const t = new Date(d).getTime(); return t >= from.getTime() && t < to.getTime(); };
  const ss = state.sessions.filter(s => inM(s.date));
  const weeks = Math.max(1, ((Math.min(to, now) - from) / DAY_MS) / 7);
  const gains = state.exercises.map(e => {
    const l = e.log.filter(x => inM(x.d));
    if (!l.length) return null;
    const start = ([...e.log].reverse().find(x => new Date(x.d) < from) || e.log[0]).w, end = l[l.length - 1].w;
    return (isAssist(e) ? start - end : end - start) > 0 ? { e, start, end, pct: start ? Math.abs(end - start) / start : 0 } : null;
  }).filter(Boolean).sort((a, b) => b.pct - a.pct);
  const ups = state.exercises.reduce((n, e) => n + e.log.filter(l => l.why === 'up' && inM(l.d)).length, 0);
  const prs = ss.flatMap(s => s.prs || []);
  return {
    title: from.toLocaleDateString(undefined, { month: 'long' }), sub: `${from.getFullYear()} · month in review`, color: cssColor('--push'),
    stats: [[ss.length, 'workouts'], [fmt(Math.round(ss.length / weeks * 10) / 10), 'a week'], [ups, 'increases'], [bigKg(ss.reduce((t, s) => t + sessionVolume(s), 0)), 'lifted']],
    sections: [
      { h: 'Biggest gains', items: gains.slice(0, 6).map(g => [g.e.name, `${fmt(g.start)} → ${wt(g.e, g.end)}`]) },
      { h: `${prs.length} personal record${prs.length === 1 ? '' : 's'}`, items: prs.slice(0, 4).map(p => [p.name, 'new best']) },
    ],
    foot: streakFoot(),
  };
}

// One row per set, for spreadsheets.
function exportCSV() {
  const q = v => (/[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : v);
  const rows = [['date', 'day', 'session', 'exercise', 'set', 'weight', 'unit', 'weight_logged_as', 'reps_or_seconds', 'amrap_set', 'done', 'energy', 'session_note']];
  for (const s of state.sessions) {
    for (const en of s.entries) {
      const X = unitSrc(en);
      en.sets.forEach((st, j) => rows.push([
        s.date.slice(0, 10), DAY_LABEL[s.day], s.test ? 'AMRAP test' : 'Volume', en.name, j + 1,
        isBW(X) ? '' : en.weight, isBW(X) ? repUnit(X) : unitOf(X), isBW(X) ? 'bodyweight' : isAssist(X) ? 'assistance' : loadOf(X),
        st.reps, en.amrap && j === en.sets.length - 1 ? 'yes' : '', st.done ? 'yes' : 'no', s.energy ?? '', s.note ?? '',
      ]));
    }
  }
  shareFile(`ppl-workouts-${new Date().toISOString().slice(0, 10)}.csv`, rows.map(r => r.map(q).join(',')).join('\n'), 'text/csv', 'PPL workouts');
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
    const noWeight = ids.map(byId).find(needsStart);
    if (noWeight) {
      toast(`Enter a starting weight for ${noWeight.name}`);
      $(`[data-bind="pickW"][data-id="${noWeight.id}"]`).focus();
      return;
    }
    const now = new Date().toISOString();
    state.exercises.filter(e => e.day === day && !e.hidden).forEach(e => {
      e.inPlan = ids.includes(e.id);
      if (e.inPlan && !e.log.length) e.log.push({ d: now, w: levelOf(e), why: 'start' });
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
    if (s.done) ui.pop = `${b.dataset.e}-${j}`;
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
  entrySwap: b => openSheet(swapHtml(+b.dataset.e)),
  swapEntry: b => {
    const a = state.active, i = +b.dataset.e, e = byId(b.dataset.id), old = a.entries[i];
    if (needsStart(e)) {
      toast(`Enter a starting weight for ${e.name}`);
      $(`[data-bind="pickW"][data-id="${e.id}"]`)?.focus();
      return;
    }
    snapshot();
    if (!e.log.length) e.log.push({ d: new Date().toISOString(), w: levelOf(e), why: 'start' });
    const ne = makeEntry(e, a.test);
    if (old.ss) ne.ss = true;
    a.entries[i] = ne;
    save(); closeSheet(); render();
    toast(`Swapped ${old.name} for ${e.name}`, true);
  },
  repeatLast: b => {
    const day = b.dataset.day;
    startWorkout(day, ui.test ?? testDue(day), repeatIds(day));
  },
  energy: b => {
    const v = +b.dataset.v;
    state.active.energy = state.active.energy === v ? undefined : v;
    save();
    document.querySelectorAll('.energy button').forEach(x => x.classList.toggle('on', +x.dataset.v === state.active.energy));
  },
  nudgeAdd: b => {
    const c = $(`[data-bind="pickToggle"][data-id="${b.dataset.id}"]`);
    if (c) { c.checked = true; updatePicker(); }
  },
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
    const es = state.active.entries, i = +b.dataset.e, name = es[i].name;
    snapshot();
    if (es[i - 1]) delete es[i - 1].ss;
    es.splice(i, 1);
    save(); closeSheet(); render();
    toast(`Removed ${name}`, true);
  },
  undo: () => {
    if (!undoSnap) return;
    state = JSON.parse(undoSnap);
    undoSnap = null;
    if (hold.iv) { clearInterval(hold.iv); hold.iv = null; }
    save(); closeSheet(); stopRest(); render();
    if (state.active?.restEnd && Date.now() - state.active.restEnd < 600e3) runRest(state.active.restEnd);
    toast('Undone');
  },
  holdTimer: b => {
    const i = +b.dataset.e, j = +b.dataset.s;
    if (hold.iv && hold.e === i && hold.s === j) return stopHold(true);
    if (hold.iv) stopHold(false);
    primeAudio();
    stopRest();
    Object.assign(hold, { e: i, s: j, start: Date.now(), beeped: false });
    hold.iv = setInterval(tickHold, 250);
    render();
  },
  saveNote: b => {
    byId(b.dataset.id).note = $('#fNote').value.trim();
    save(); closeSheet(); render();
  },
  addToWorkout: () => openSheet(addToWorkoutHtml()),
  addEntry: b => {
    const e = byId(b.dataset.id);
    if (needsStart(e)) {
      toast(`Enter a starting weight for ${e.name}`);
      $(`[data-bind="pickW"][data-id="${e.id}"]`)?.focus();
      return;
    }
    if (!e.log.length) e.log.push({ d: new Date().toISOString(), w: levelOf(e), why: 'start' });
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
  discard: () => { snapshot(); discardWorkout(); toast('Workout discarded', true); },
  restAdd: () => runRest(Math.max(rest.end, Date.now()) + 30000),
  restSkip: () => stopRest(),
  closeSheet: () => { closeSheet(); },
  openSession: b => openSheet(sessionDetailHtml(state.sessions.find(s => s.id === b.dataset.id))),
  deleteSession: b => {
    snapshot();
    state.sessions = state.sessions.filter(s => s.id !== b.dataset.id);
    save(); closeSheet(); render();
    toast('Workout deleted. Current weights unchanged.', true);
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
    const prog = $('#fProg').value, progChanged = prog !== progOf(e);
    const oldReps = e.reps;
    e.name = $('#fName').value.trim() || 'Exercise';
    e.day = $('#fDay').value;
    e.sets = Math.round(num('#fSets', 1));
    e.reps = Math.round(num('#fReps', 1));
    e.target = Math.round(num('#fTarget', 1));
    e.gap = Math.max(1, e.target - e.reps);
    if ($('#fInc')) e.inc = num('#fInc', 0);
    e.amrap = $('#fAmrap').checked;
    e.rest = Number($('#fRest').value);
    e.inPlan = $('#fPlan').checked;
    e.note = $('#fNote').value.trim();
    if ($('#fBar')) e.bar = $('#fBar').checked;
    if ($('#fMuscle')) e.muscles = $('#fMuscle').value ? P([$('#fMuscle').value]) : undefined;
    if (progChanged) {
      // A different kind of progression starts a fresh progress line from today's numbers.
      e.prog = prog === 'weight' ? undefined : prog;
      if (isBW(e)) e.weight = 0;
      e.log = [];
      setLevel(e, levelOf(e) ?? 0, 'start');
    } else if (isBW(e) && e.reps !== oldReps) {
      if (!e.log.length || (e.log.length === 1 && !state.sessions.some(s => s.entries.some(en => en.exId === e.id)))) e.log = [{ d: new Date().toISOString(), w: e.reps, why: 'start' }];
      else e.log.push({ d: new Date().toISOString(), w: e.reps, why: 'edit' });
    }
    const w = !$('#fWeight') || $('#fWeight').value === '' ? null : num('#fWeight', 0);
    if (w !== null && !e.log.length) {
      e.weight = w;
      e.log.push({ d: new Date().toISOString(), w, why: 'start' });
    } else if (w !== null && w !== e.weight) {
      // Editing the weight of a brand-new exercise sets its starting point rather than logging a change.
      if (e.log.length === 1 && e.log[0].why === 'start' && !state.sessions.some(s => s.entries.some(en => en.exId === e.id))) {
        e.weight = w; e.log[0].w = w;
      } else setWeight(e, w, 'edit');
    }
    const unit = $('#fUnit')?.value ?? unitOf(e), load = $('#fLoad')?.value ?? loadOf(e);
    const converted = !isBW(e) && (unit !== unitOf(e) || load !== loadOf(e));
    if (converted) convertExercise(e, { unit, load });
    ui.progDay = e.day;
    save(); closeSheet(); render();
    toast(converted ? `Saved. Now ${wt(e, e.weight)}, history converted.` : progChanged ? `Saved. ${e.name} now progresses by ${prog === 'weight' ? 'weight' : prog === 'time' ? 'hold time' : 'reps'}.` : 'Saved');
  },
  // Barbell ↔ dumbbell (or bodyweight ↔ weighted) switch, from a workout card, the picker or the exercise editor.
  variant: b => {
    const ex = byId(b.dataset.id), ctx = b.dataset.ctx, a = state.active;
    const en = ctx === 'card' ? a.entries[b.dataset.e] : null;
    if (en?.sets.some(s => s.done) && !confirm(`Switch to ${variantOf(ex).name}? The sets you've ticked for ${en.name} today will be removed.`)) return;
    const from = en ? (isBW(en) ? en.reps : en.weight) : levelOf(ex);
    if (ctx === 'card') ex.inPlan = true; // you're doing it today, so keep it in the plan
    const { to, w, estimated } = switchVariant(ex, from);
    if (ctx === 'card') {
      const ne = makeEntry(to, a.test);
      if (en.ss) ne.ss = true;
      a.entries[+b.dataset.e] = ne;
      render();
    } else if (ctx === 'pick') {
      // Swap just this row so other ticks in the picker are kept.
      const row = b.closest('.pick-row'), ticked = $('input[type=checkbox]', row).checked;
      row.outerHTML = pickRow(to);
      $(`[data-bind="pickToggle"][data-id="${to.id}"]`).checked = ticked;
      updatePicker();
    } else {
      render();
      openSheet(editExHtml(to));
    }
    save();
    toast(estimated && !isBW(to) && !isBW(ex) && variantOf(to).ratio
      ? `${to.name}: ${wt(to, w)}, estimated from ${wt(ex, from)}. Your first AMRAP fine-tunes it.`
      : `${to.name}: ${wt(to, w)}${isBW(to) ? ' per set' : ''}`);
  },
  exUnit: b => {
    const e = byId(b.dataset.id);
    convertExercise(e, { unit: unitOf(e) === 'lb' ? 'kg' : 'lb' });
    save(); closeSheet(); render();
    toast(`${e.name} now in ${unitOf(e)}: ${wt(e, e.weight)}`);
  },
  exLoad: b => {
    const e = byId(b.dataset.id);
    convertExercise(e, { load: loadOf(e) === 'each' ? 'total' : 'each' });
    save(); closeSheet(); render();
    toast(`${e.name}: ${wt(e, e.weight)}`);
  },
  deleteEx: b => {
    const e = byId(b.dataset.id);
    snapshot();
    state.exercises = state.exercises.filter(x => x.id !== e.id);
    save(); closeSheet(); render();
    toast(`Deleted ${e.name}. Past workouts stay in History.`, true);
  },
  move: b => {
    const e = byId(b.dataset.id);
    const same = state.exercises.filter(x => x.day === e.day && !x.hidden);
    const other = same[same.indexOf(e) + Number(b.dataset.dir)];
    if (!other) return;
    const ia = state.exercises.indexOf(e), ib = state.exercises.indexOf(other);
    [state.exercises[ia], state.exercises[ib]] = [state.exercises[ib], state.exercises[ia]];
    save(); render();
  },
  pickExRow: b => { ui.exId = b.dataset.id; render(); window.scrollTo({ top: 0, behavior: 'smooth' }); },
  howProgress: (b, e) => { e.preventDefault(); openSheet(howHtml()); },
  export: () => exportData(),
  csv: () => exportCSV(),
  shareWorkout: b => {
    const s = state.sessions.find(x => x.id === b.dataset.id);
    openShare(workoutCard(s), `ppl-${s.day}-${s.date.slice(0, 10)}.png`);
  },
  shareMonth: () => openShare(monthCard(ui.calOffset || 0), 'ppl-month.png'),
  sharePhotoClear: () => { share.photo = null; drawCard($('#shareCv'), share.card, null); $('#sharePhotoClear').hidden = true; },
  shareSend: async () => {
    const blob = await new Promise(res => $('#shareCv').toBlob(res, 'image/png'));
    shareFile(share.name, blob, 'image/png', share.card.title);
  },
  goalSheet: b => openSheet(goalSheetHtml(b.dataset.id)),
  saveGoal: () => {
    const ex = byId($('#gEx').value), target = Number($('#gTarget').value), by = $('#gBy').value;
    if (!(target > 0) || !by) { toast('Enter a target and a date'); return; }
    if (target === levelOf(ex)) { toast('That\'s where you are now. Pick a target beyond it.'); return; }
    state.goals = state.goals.filter(g => g.exId !== ex.id);
    state.goals.push({ id: uid(), exId: ex.id, start: levelOf(ex) ?? 0, target, by: new Date(`${by}T12:00`).toISOString(), created: new Date().toISOString() });
    save(); closeSheet(); render(); toast('Goal set');
  },
  removeGoal: b => {
    snapshot();
    state.goals = state.goals.filter(g => g.id !== b.dataset.id);
    save(); closeSheet(); render(); toast('Goal removed', true);
  },
  goLift: b => { ui.exId = b.dataset.id; ui.tab = 'progress'; window.scrollTo(0, 0); render(); },
  cardioSheet: () => openSheet(cardioSheetHtml()),
  saveCardio: () => {
    const mins = Math.round(Number($('#cMins').value));
    if (!(mins > 0)) { toast('Enter how many minutes'); return; }
    state.extras.push({ id: uid(), d: new Date(`${$('#cDay').value}T12:00`).toISOString(), type: 'cardio', kind: $('#cKind').value, mins });
    state.extras.sort((a, b) => new Date(a.d) - new Date(b.d));
    save(); closeSheet(); render(); toast(`${$('#cKind').value} logged`);
  },
  logRest: () => {
    if (state.extras.some(x => x.type === 'rest' && sameDay(x.d, Date.now()))) { toast('Today is already a rest day'); return; }
    snapshot();
    state.extras.push({ id: uid(), d: new Date().toISOString(), type: 'rest' });
    save(); render(); toast('Rest day logged', true);
  },
  removeExtra: b => {
    snapshot();
    state.extras = state.extras.filter(x => x.id !== b.dataset.id);
    save(); closeSheet(); render(); toast('Removed', true);
  },
  openDay: b => {
    const t = Number(b.dataset.t);
    const ss = state.sessions.filter(s => sameDay(s.date, t)), xs = state.extras.filter(x => sameDay(x.d, t));
    openSheet(ss.length === 1 && !xs.length ? sessionDetailHtml(ss[0]) : daySheetHtml(t));
  },
  introNext: () => { ui.intro = (ui.intro || 0) + 1; render(); window.scrollTo(0, 0); },
  introDone: () => { state.seenIntro = true; ui.intro = 0; save(); render(); window.scrollTo(0, 0); },
  replayIntro: () => openSheet(`<h2>How it works</h2>${INTRO.map(s => `<div class="intro-mini"><span class="ic">${s[0]}</span><div><b>${s[1]}</b><small>${s[2]}</small></div></div>`).join('')}`),
  standards: b => { state.settings.standards = b.dataset.v; save(); render(); },
  calMonth: b => { ui.calOffset = (ui.calOffset || 0) + Number(b.dataset.dir); render(); },
  monthSummary: () => openSheet(monthSummaryHtml(ui.calOffset || 0)),
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
  else if (bind === 'sessNote') { state.active.note = t.value.trim(); save(); }
  else if (bind === 'pickReps' && Number(t.value) > 0) {
    const e = byId(t.dataset.id);
    e.reps = Math.round(Number(t.value));
    e.target = e.reps + gapOf(e);
    save();
  }
  else if (bind === 'enW') {
    const en = state.active.entries[t.dataset.e];
    en.weight = Number(t.value) || 0;
    const g = $(`#goal-${t.dataset.e}`);
    if (g) g.innerHTML = goalHtml(en);
    const cv = $(`#conv-${t.dataset.e}`);
    if (cv) cv.innerHTML = convHtml(en);
    const pl = $(`#plates-${t.dataset.e}`);
    if (pl) pl.innerHTML = platesHtml(en, en.weight);
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
  else if (bind === 'deloadAfter' || bind === 'deloadPct' || bind === 'deloadEvery' || bind === 'bar') { state.settings[bind] = Number(t.value); save(); }
  else if (bind === 'pickToggle') updatePicker();
  else if (bind === 'goalEx') openSheet(goalSheetHtml(t.value));
  else if (bind === 'theme') { state.settings.theme = t.value; save(); applyTheme(); }
  else if (bind === 'awake') { state.settings.awake = t.value === 'on'; save(); keepAwake(); }
  else if (bind === 'progression') { state.settings.progression = t.value; save(); }
  else if (bind === 'importFile') importData(t.files[0]);
  else if (bind === 'sharePhoto') setSharePhoto(t.files[0]);
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
