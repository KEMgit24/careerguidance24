# Ikigai Career-Matching Algorithm — Instruction Set

> **Honest framing first:** this procedure doesn't *prove* which career is "right" — no algorithm can. What it does is force a fuzzy, intuitive question ("what should I do with my life") into a structured scoring process, so the weak spot in your reasoning becomes visible instead of hidden. Treat the output as a strong, evidence-based *hypothesis to test*, not a verdict.

---

## STEP 0 — Define the four data sets

Build four lists. Each item is a `{tag, score}` pair, where `score` is 0.0–1.0.

```
A_aime   = []   // things you LOVE doing
B_doue   = []   // things you're SKILLED at
C_besoin = []   // things the WORLD NEEDS (market/social demand)
D_paye   = []   // things you can be PAID for
```

**Instruction 0.1** — For each of the four sets, generate 5–10 tags (skills, activities, topics, industries).
**Instruction 0.2** — Score each tag 0.0–1.0 using the calibration below. Do not eyeball it — use the anchors.

| Set | Elicitation questions | Score anchors |
|---|---|---|
| **A — Aime** | What makes you lose track of time? What would you do unpaid? What content do you consume voluntarily? | adore = 1.0 · like it = 0.7 · neutral = 0.4 · dislike = 0.1 |
| **B — Doué** | What do people ask you for help with? What skills have you built over 5 years? What are you better at than most? | expert = 1.0 · good = 0.7 · beginner = 0.4 · weak = 0.1 |
| **C — Besoin** | What problems around you frustrate you? Which sectors have high job demand? What cause would you volunteer for? | cross-reference with real labor-market data (job boards, O*NET/ROME, industry reports) |
| **D — Payé** | What's your minimum livable monthly income? Salaried, freelance, or entrepreneur? Are you willing to invest time retraining? | cross-reference with actual average salaries in the target sector |

**Instruction 0.3** — For C and D specifically, do not self-report the score alone — validate it against external data (real job postings, real salary bands). This is the step people skip, and it's the one that keeps the whole model honest.

---

## STEP 1 — Build the matching function

```
FUNCTION intersect(setX, setY):
    total = 0
    count = 0
    FOR each item_x IN setX:
        match = FIND item_y IN setY WHERE
                    item_y.tag == item_x.tag
                    OR is_synonym(item_x.tag, item_y.tag)
        IF match FOUND:
            total += (item_x.score + match.score) / 2
            count += 1
    RETURN count > 0 ? (total / count) : 0
```

**Instruction 1.1** — `is_synonym()` is the single highest-leverage function in this whole system. "Creativity" and "design" should match; "Excel" and "spreadsheets" should match. Build this as a domain dictionary, or delegate matching to an LLM prompt: *"Do these two skill/interest tags refer to the same underlying capability? Answer yes/no with a one-line justification."*
**Instruction 1.2** — Do not skip synonym matching and rely on exact string equality — this alone silently collapses most real overlaps to zero and will produce a false "no Ikigai" result.

---

## STEP 2 — Calculate the four intersections

```
passion    = intersect(A_aime, B_doue)      // Love × Skill
vocation   = intersect(A_aime, C_besoin)    // Love × World's Need
profession = intersect(B_doue, D_paye)      // Skill × Payment
mission    = intersect(C_besoin, D_paye)    // World's Need × Payment

global_score = (passion + vocation + profession + mission) / 4
```

**Instruction 2.1** — Interpret each intersection using its known failure mode, not in isolation:

| Intersection | Formula | Risk if the OTHER two circles are missing |
|---|---|---|
| **Passion** | A ∩ B | No C, D → sense of uselessness |
| **Vocation** | A ∩ C | No B, D → satisfaction but precarity |
| **Profession** | B ∩ D | No A, C → comfortable but empty |
| **Mission** | C ∩ D | No A, B → excitement but insecurity |

**Instruction 2.2** — Never optimize for a single intersection in isolation. A high "Profession" score with a near-zero "Vocation" score is a stability trap, not a win.

---

## STEP 3 — Career Compatibility Matching (lightweight anchors + reliability weighting)

This step is a deliberate middle ground between two designs: a purely abstract `intersect()` (flexible, but never actionable on its own) and a fully-specified career database with a weighted vector over every tag (actionable, but heavy to build and maintain). The synthesis: give each career only a **sparse set of anchor tags** (light to maintain), and let Step 2's self-coherence score act as a **reliability multiplier** on the result (so the two mechanisms do what each is naturally good at, instead of running as two disconnected outputs).

```
CAREER = {
    name: string,
    anchors_A: [{tag, weight}]   // 2–4 anchor tags max — not a full vector
    anchors_B: [{tag, weight}]   // 2–4 anchor tags max
    anchors_C: [{tag, weight}]   // 1–2 anchor tags max
    anchors_D: [{tag, weight}]   // 1 pay-tier anchor is usually enough
}

FUNCTION compatibility(userSet, anchors):
    total = 0
    total_weight = 0
    FOR each anchor IN anchors:
        match = FIND item IN userSet WHERE
                    item.tag == anchor.tag OR is_synonym(item.tag, anchor.tag)
        matched_score = match ? match.score : 0
        total += matched_score * anchor.weight
        total_weight += anchor.weight
    RETURN total_weight > 0 ? (total / total_weight) : 0
```

**Instruction 3.1** — Keep each career's anchor list deliberately short (2–4 tags per circle, not an exhaustive weighted profile). This is what keeps the database light: you're encoding "what matters most" for a career, not a complete map of it. `compatibility()` is `intersect()` generalized to a weighted reference set — same core mechanism, just pointed outward instead of at another circle of yourself.

**Instruction 3.2** — For each career, compute the four fits and combine exactly as in Step 2:

```
love_fit = compatibility(A_aime, career.anchors_A)   // and similarly for skill_fit, need_fit, pay_fit
passion_c = (love_fit+skill_fit)/2  ... global_c = average of the four
```

**Instruction 3.3** — Apply the self-coherence score from Step 2 as a reliability multiplier, rather than treating career-fit as independent of internal coherence:

```
reliability = 0.5 + 0.5 * global_score        // ranges 0.5 (never zero) to 1.0
adjusted_global_c = global_c * reliability
```

A career can score well on paper (`global_c` high) but still get discounted if your own A/B/C/D data doesn't cohere (`global_score` low) — the algorithm is saying "this looks promising, but your inputs aren't reliable enough yet to trust the ranking fully." This is the real bridge between the two ideas: self-coherence governs *how much to trust* the career ranking, rather than being a separate, disconnected step.

**Instruction 3.4** — Rank careers by `adjusted_global_c` descending, return the top N (8 is a good default). Tier the results:

| Tier | adjusted_global_c | Meaning |
|---|---|---|
| Aligned | ≥ 0.65 | Strong, reliable candidate — worth a real roadmap |
| Worth exploring | 0.50–0.65 | Plausible, but validate before committing |
| Stretch / mismatch | < 0.50 | Poor fit, or your inputs are too unreliable to tell yet |

**Instruction 3.5** — Treat anchor tags as a hypothesis, not ground truth — build them from real job postings, O*NET/ROME task lists, or salary bands where possible. But because the list is short, updating or correcting a career's anchors is cheap — this is the maintenance benefit of staying sparse.

**Instruction 3.6** — Run this step regardless of whether `global_score` cleared 0.65 in Step 2. A low `reliability` multiplier doesn't hide the ranking — it just tells you to treat it as provisional and prioritizes closing the Step 5 follow-up questions before committing to the top result.

---

## STEP 4 — Apply the decision threshold

```
FUNCTION route(scores):
    IF scores.global_score >= 0.65:
        RETURN generate_roadmap(scores)      // → full action plan
    ELSE:
        weak_zones = detect_gaps(scores)     // which of the 4 is lowest?
        RETURN ask_targeted_questions(weak_zones)
```

**Instruction 4.1** — 0.65 is a working threshold, not a law of nature. Treat it as a "confident enough to act" bar — raise it if you want more certainty before committing, lower it if you're in fast-iteration/exploration mode. The same 0.65 bar is reused on `adjusted_global_c` in Step 3.4 — keep them consistent unless you have a specific reason to diverge.
**Instruction 4.2** — If `global_score < 0.65`, identify the single lowest of the four intersection scores. That is your bottleneck — spend your next round of questions/data-gathering there, not evenly across all four.

---

## STEP 5 — If score < 0.65: targeted follow-up questions

**Instruction 5.1** — Re-run Step 0 elicitation questions, but *only* for the two circles feeding the weakest intersection.
**Instruction 5.2** — Re-score those tags with fresh, more specific data (new external validation for C/D; deeper self-reflection for A/B).
**Instruction 5.3** — Recompute Step 2, re-rank careers in Step 3, and re-check the threshold in Step 4. Repeat until either `global_score >= 0.65` or you've done 3 rounds — after 3 rounds with no improvement, the honest conclusion is that no single career currently satisfies all four circles, and you should consider a two-phase path (e.g., Profession now, transition toward Vocation later) rather than forcing a match. Even in this case, keep the Step 3 ranking — it tells you which real career is closest to becoming viable.

---

## STEP 6 — If score ≥ 0.65: generate the roadmap

**Instruction 6.1** — Take the top-ranked career by `adjusted_global_c` from Step 3 as `target_career`. Run a gap analysis: compare `B_doue` (your actual skills) against `target_career.anchors_B` (the skill anchors it requires, weighted by importance). List anything required but missing or low-scored — prioritize by weight, not just by presence.

```
gaps = weighted_missing(target_career.anchors_B, B_doue, score_threshold = 0.6)
```

**Instruction 6.2** — Produce a three-horizon plan:

| Horizon | Goal | Actions |
|---|---|---|
| **0–6 months — Explore** | Validate the Ikigai hypothesis | 5 informational interviews with people in the target role · launch a small side-project to test fit · identify 3 short courses covering the detected gaps · join 2 communities in the target sector |
| **6–18 months — Build** | Close the skill gaps | complete one certifying course in the gap area · ship 3 concrete portfolio projects · find a mentor in the sector · generate first income, even symbolic |
| **18–36 months — Consolidate** | Monetize and position | land the first real professional opportunity (job/contract) · build a 50+ contact network in the sector · define a clear personal positioning · re-measure the remaining gap and adjust |

**Instruction 6.3** — After each horizon, re-run Steps 0–3 with updated real-world scores (not aspirational ones) — including re-ranking careers, since a new skill or income data point can reorder the whole list. The roadmap is a loop, not a one-time output — treat the whole procedure as something you re-run every 6–12 months as your skills, the market, and your preferences shift.

---

## Master control flow (summary)

```
1. Score A, B, C, D (validate C, D against real market/salary data)
2. Compute passion, vocation, profession, mission via intersect()      → global_score (self-coherence)
3. Compute compatibility() against light career anchors (2-4 tags each) → global_c per career
   adjust: adjusted_global_c = global_c × (0.5 + 0.5 × global_score)    → ranked top-N (real-world fit, confidence-weighted)
4. IF global_score >= 0.65 → take top-ranked career (by adjusted_global_c) → gap analysis → 3-horizon roadmap → re-run periodically
   ELSE → find weakest intersection → targeted questions → re-score → go to 2
   (the Step 3 ranking runs either way; a low reliability multiplier flags it as provisional, not hidden)
```

---

### The one caveat worth repeating

This algorithm is good at telling you **where your reasoning is thin** (usually: unvalidated market/pay assumptions, or self-assessed skill with no external confirmation). It is not good at telling you the future, and it can't account for factors it has no tags for (risk tolerance, family constraints, timing, luck). Use it to sharpen the decision, not to outsource it.
