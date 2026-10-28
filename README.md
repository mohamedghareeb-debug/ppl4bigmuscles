# PPL Overload

A push / pull / legs workout tracker built around AMRAP-based progressive overload. It's a web app you install on your iPhone's home screen. It runs full screen, works offline and keeps all data on the phone.

## How the program works

- Each exercise has sets × reps, a **move-up target** and an **increment**. For example, bench press is 3 × 8, moves up at 12 reps, in steps of 2.5 kg.
- On a **test day** the last set of every exercise is AMRAP (as many reps as possible), and the reps decide next session's weight (the default "Scaled by reps" mode):
  - **Target or more:** the weight goes up. The app estimates your 1RM from the set (Epley formula) and picks the weight you'd hit for the middle of your rep range, rounded down to the increment and at least one increment. The more reps you beat the target by, the bigger the jump. At 60 kg, 3 × 8, target 12: 12–13 reps → 62.5, 14 → 65, 15+ → 67.5.
  - **Between prescribed reps and target:** the weight stays the same. After 3 of these in a row (you can change this), it deloads 10%.
  - **Fewer than prescribed:** the weight was too heavy, so it drops to what the estimate says you can do for the prescribed reps.
  - Reps beyond 15 (or 3 past a high target) aren't counted, because rep-based max estimates get unreliable at high reps. The next test catches up the rest.
- If you want the old behaviour (+1 increment on a hit, nothing else), switch **Program → Progression** to **Fixed step**.
- Evidence: APRE (Mann et al., 2010, J Strength Cond Res), autoregulation reviews (Zhang et al., 2021, Front Physiol; Hickmott et al., 2022, Sports Med Open), Graham & Cleather (J Strength Cond Res), and 1RM prediction accuracy (Reynolds et al., 2006, J Strength Cond Res). There's a summary in the app under **Program → Progression → How it works**.
- **1× a week:** every session is a test. **2× a week:** the first Push, Pull and Legs session each week is the test and the second is a volume day at the same weights. You can switch any session between test and volume with the badge on the Today screen.
- **Default plan:** Push is bench press, overhead press, incline dumbbell press, lateral raise, triceps pushdown and pec deck. Pull is deadlift, lat pulldown, seated cable row, reverse fly and barbell curl. Legs is squat, leg press, leg curl, leg extension, calf raise, hip adduction and hip abduction.
- **Catalogue:** alternatives (overhead triceps extension, dumbbell fly, pull-ups, preacher curl) and extras (machine chest press, dips, barbell row, face pull, hammer curl, Romanian deadlift, hack squat, Bulgarian split squat). Each has its own sets, reps, move-up target and rest.
- **Before each session:** a quick picker lists the day's catalogue with your last picks already ticked. Squat, deadlift and flat bench are marked Recommended, and you get a note if you leave one out. The first time you pick a new exercise, it asks for a starting weight. The start button shows the estimated session length.
- **Rest timer:** starts when you tick a set. On Auto it gives 3 min for main lifts, 2–2.5 min for other compounds and 1.5 min for isolation (Schoenfeld et al., 2016; ACSM guidelines). It beeps at zero, then counts up. iPhones mute the beep when the silent switch is on. iOS pauses web apps when the phone locks, so **Keep screen on** (Program tab, on by default) holds the screen awake during a workout. If the app does get paused or closed, the timer reopens with the right time, because the end time is saved with the workout.
- **Weights are per exercise:** skipping an exercise, or swapping in an alternative, never changes its weight. It picks up where you left off the next time you choose it. The picker shows when you last did each one.
- **Time estimate:** warm-ups, about 3 seconds a rep, set-up and every rest. After two sessions it adjusts to how long yours actually take.
- You can rename, add, remove and reorder exercises, and change every number, in the **Program** tab.

## During and after a workout

- **Pre-filled:** each exercise opens with its current weight and prescribed reps already filled in, so normal sets are just a tick. Under the name you see **last time's numbers** (for example "Last time (Oct 21): 60 kg × 8 · 8 · 13") and any **note** you've saved for it.
- **⋯ menu on each exercise:** move it up or down, **superset** it with the next one (no rest timer between the two, just after the pair), add or remove a set, remove it from today, or edit its note (seat height, grip and so on).
- **+ Add exercise** at the bottom adds anything from the catalogue to the current workout.
- **Personal records** show at the end of a workout: a new best estimated max, or more reps at a weight than ever before. A first session with an exercise sets the baseline and doesn't count.
- **Editing:** History → a workout → **Edit workout** fixes mistyped weights or reps. If it's still your latest workout for that exercise, the weight change is redone from the corrected AMRAP. If later workouts have already built on it, only the log is corrected.

## Prompts

- **Deload week:** after 6 weeks of training (you can change this, or turn it off), Today suggests a lighter week. It's only a prompt and you choose whether to take it. During a deload, sessions use half the sets at the same weights with no AMRAP, and normal training resumes after 7 days. This follows coaches' usual practice of a 5–7 day deload every 4–6 weeks (Bell et al., 2022).
- **Monthly backup:** if you haven't exported in 30 days, Today asks you to.

## Tabs

- **Today:** suggests the next day in the rotation. Log reps, tick off sets (this starts the rest timer), then finish to see what moves up.
- **Progress:**
  - Stat tiles.
  - A **muscle map** (front and back) for this week or last. Muscles trained once are lightly shaded and muscles trained twice or more are dark. Tap a muscle for details.
  - **Weekly sets per muscle** against the 10–20 set range. Main muscles count a full set, helping muscles half a set.
  - Per-exercise charts for working weight, AMRAP reps against the target and estimated 1RM, plus weekly volume and a start-vs-now table. Tap a chart to see exact values.
  - **Records** for every lift.
  - A **bodyweight** log and chart, with squat, deadlift and bench shown as a multiple of bodyweight.
- **History:** every workout. Tap one for details or to delete it.
- **Program:** your exercises, settings, and data backup and restore.

## Putting it on your iPhone

The app has to be served over HTTPS. Two free options:

1. **Netlify Drop** (easiest, no git): go to https://app.netlify.com/drop and drag the `ppl-tracker` folder onto the page. You get a URL like `https://something.netlify.app`.
2. **GitHub Pages:** push this folder to a GitHub repo, then turn on Pages under Settings → Pages.

Then on the iPhone, open the URL in **Safari**, tap **Share → Add to Home Screen**, and from then on launch it from the icon.

Notes:
- The home-screen app keeps its data separately from Safari. Always use the icon.
- Use **Program → Export backup** now and then (save it to Files or iCloud Drive). If you delete the app or change phones, restore it with **Import backup**.
- After you change the code and redeploy, bump `VERSION` in `sw.js` so phones pick up the update. It takes effect the next time you open the app.

## Testing on this PC

```
powershell -ExecutionPolicy Bypass -File tools\serve.ps1
```
Then open http://localhost:8123. `tools\make-icons.ps1` regenerates the icons.
