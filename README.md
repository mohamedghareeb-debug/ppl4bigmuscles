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

## Dumbbells and pounds

- **Dumbbell exercises** log the weight per dumbbell by default ("22 kg each"). Switch an exercise to **Both dumbbells total** ("44 kg total") in Program → the exercise, or from its ⋯ menu during a workout. The increase is set per dumbbell, so on totals each jump doubles (2 kg per hand = +4 kg total). Switching converts that exercise's history.
- **Machines in pounds:** set an exercise's units to **Pounds (lb)**. You then enter and progress it in lb (for example 10 lb jumps on a stack), and the workout shows the kg equivalent ("110 lb = 49.9 kg"). Volume and bodyweight ratios are always worked out in kg.

## Barbell | Dumbbells switch (and Bodyweight | Weighted)

Exercises with two versions appear once, with a switch on the workout card, in the pre-session picker and in the exercise editor. The pairs:
- **Barbell | Dumbbells:** bench press, incline press, overhead press (seated dumbbell press), row (one-arm dumbbell row), curl, Romanian deadlift and shrugs.
- **Bodyweight | Weighted:** dips, pull-ups and chin-ups.

How switching works:
- **First switch:** the weight is carried over. For presses, a pair of dumbbells ≈ 83% of the barbell weight, because dumbbell bench max is about 17% below barbell (Saeterbakken et al., 2011). The others use common rules of thumb. The result is rounded down to that exercise's step, and your first AMRAP on it fine-tunes it. Going from bodyweight to weighted starts at +0 kg.
- **After that:** each version keeps its own weight and progression (they're different strengths), so switching back returns you to exactly where you left off.
- **Your choice is remembered** for next time.

## Bodyweight exercises

Push-ups, dips, pull-ups and chin-ups progress by **reps**, and the plank by **seconds**. There's no weight to enter, so you just tick through the reps.
- **Hit the AMRAP target:** next time's reps per set become about 75% of what you managed (always at least +1). That keeps working sets 2–3 reps short of failure. For example, 15 dips against a target of 12 means 11 reps per set next time.
- **Between the prescribed reps and the target:** stay. **Below the prescribed reps:** drop to about 85% of what you got.
- **The first time you pick one,** the picker lets you set your starting reps per set.
- **Records** are your most reps in a set (or longest hold). Planks count towards a new **Core & abs** region on the muscle map.
- **When the reps get high,** flip dips, pull-ups or chin-ups to **Weighted** and they progress by added weight instead.

## During and after a workout

- **Pre-filled:** each exercise opens with its current weight and prescribed reps already filled in, so normal sets are just a tick. Under the name you see **last time's numbers** (for example "Last time (Oct 21): 60 kg × 8 · 8 · 13") and any **note** you've saved for it.
- **⋯ menu on each exercise:** move it up or down, **superset** it with the next one (no rest timer between the two, just after the pair), add or remove a set, remove it from today, or edit its note (seat height, grip and so on).
- **+ Add exercise** at the bottom adds anything from the catalogue to the current workout.
- **Personal records** show at the end of a workout: a new best estimated max, or more reps at a weight than ever before. A first session with an exercise sets the baseline and doesn't count.
- **Editing:** History → a workout → **Edit workout** fixes mistyped weights or reps. If it's still your latest workout for that exercise, the weight change is redone from the corrected AMRAP. If later workouts have already built on it, only the log is corrected.

## More workout tools

- **Repeat last session:** on Today, one tap starts exactly what you did last time on that day, skipping the picker.
- **Weekly volume nudge:** when you pick exercises, the app adds this week's sets to today's picks (repeated for any sessions of that day still to come this week). Any of the day's main muscles heading for under 10 sets gets flagged, with a one-tap "+ exercise" to add.
- **Machine taken? Swap exercise** (in the ⋯ menu): suggests catalogue exercises that hit the same muscles, best match first. The swap is for today only.
- **Plate calculator:** barbell lifts show the plates for each side ("Each side: 25 + 5 on a 20 kg bar"), and it updates as you change the weight. You can set the bar weight in Program, and turn it on for other exercises in the exercise editor.
- **Plank timer:** tap ▶ on a timed set to start and tap ■ to stop. The seconds fill in, the set is ticked and the rest timer starts. It beeps when you reach the goal.
- **Assisted pull-ups:** the weight is the assistance, so progress means lowering it. It uses the same AMRAP rule on bodyweight minus assistance. At 0 kg it tells you to move to bodyweight pull-ups.
- **Undo:** removing an exercise, swapping, discarding a workout, deleting a workout or exercise, and finishing a workout can all be undone. Finishing shows "Undo finish", which takes you back to the workout and reverses the weight changes.
- **How did it go?** Rate your energy (Drained to Great) and add a note at the end of each workout. Both can be edited later and appear in History, the monthly summary and the CSV.

## Prompts

- **Deload week:** after 6 weeks of training (you can change this, or turn it off), Today suggests a lighter week. It's only a prompt and you choose whether to take it. During a deload, sessions use half the sets at the same weights with no AMRAP, and normal training resumes after 7 days. This follows coaches' usual practice of a 5–7 day deload every 4–6 weeks (Bell et al., 2022).
- **Monthly backup:** if you haven't exported in 30 days, Today asks you to.

## Home screen, goals, cardio and themes

- **Home tiles (Today):** a coloured card for the next workout (Start, Repeat last, AMRAP/volume switch), then tiles for this week's workouts, your streak, the day's main lift, your goal, sets per muscle this week, and cardio and rest days. Tap a tile to open the matching screen.
- **Day colours:** the Today tab and the workout take the day's colour: blue for Push, orange for Pull, green for Legs.
- **Goals:** set a target for an exercise by a date, from the Goal tile or the exercise's chart in Progress. The app shows the percentage done, whether you're on pace (after a week of data), and a goal line on the chart.
- **Cardio and rest days:** log cardio (type and minutes) or a rest day from the home screen. They show on the calendar and in the monthly summary, and can be removed by tapping the day.
- **Walkthrough:** four short screens on first launch. You can reread them under Program → Your data → How the app works.
- **Appearance (Program → Settings):** System, Light, Dark, plus three named themes. Focus is true black and minimal, Vivid is dark with the day colour everywhere, Soft is light and rounded.
- **Muscle thumbnails:** each exercise in the workout and the picker has a small body figure showing its main muscles (solid) and helping muscles (lighter).
- **Summary picture:** the workout summary, any past workout in History and the monthly summary have a "Summary picture" button. It makes a square picture (duration, weight lifted, sets, records, weight increases, streak) on a gradient in the day's colour. You can use one of your own photos as the background instead. Save picture hands it to the iPhone's save and share sheet.
- **Small touches:** a tick animation on each set, confetti on records and streak milestones, and a soft fill under the chart lines.

## Tabs

- **Today:** suggests the next day in the rotation. Log reps, tick off sets (this starts the rest timer), then finish to see what moves up.
- **Progress:**
  - Stat tiles.
  - A **muscle map** (front and back) for this week or last. Muscles trained once are lightly shaded and muscles trained twice or more are dark. Tap a muscle for details.
  - **Weekly sets per muscle** against the 10–20 set range. Main muscles count a full set, helping muscles half a set.
  - Per-exercise charts for working weight, AMRAP reps against the target and estimated 1RM, plus weekly volume and a start-vs-now table. Tap a chart to see exact values.
  - **Records** for every lift.
  - **Strength level** for squat, bench, deadlift and overhead press: estimated max ÷ bodyweight against common strength standards (beginner to elite), with men's or women's standards. It's a rough guide.
  - A **bodyweight** log and chart, with squat, deadlift and bench shown as a multiple of bodyweight.
- **History:**
  - A **calendar** with each training day dotted Push/Pull/Legs, your sessions this week against your goal, your week streak, and average sessions per week.
  - **Streak:** weeks in a row with at least 3 workouts. Today shows how many more workouts this week keep it going. After the workout that reaches a milestone (2 weeks, a month, 2 months, 3 months, 6 months, a year, then every quarter), the summary shows a congratulations message. Other weeks it notes that your streak grew.
  - A **monthly summary**: workouts, consistency, biggest gains, records, muscle balance and energy, as a page you can screenshot.
  - Every workout below that. Tap one for details, to edit it or to delete it.
- **CSV export** (Program → Your data): every set as a spreadsheet row.
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
