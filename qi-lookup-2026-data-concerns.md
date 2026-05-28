# QI Lookup — 2026 Data Import: Concerns

**Date:** 2026-05-28
**Context:** The 2026 income spreadsheet was imported into the QI Lookup tool as provided, replacing last year's data. This document lists discrepancies found when comparing the new data against last year's. The first two groups are likely **errors in the source spreadsheet** and should be confirmed against the authoritative source before this goes live.

---

## 1. Low-income limits repeat impossibly across unrelated counties (high severity)

For household sizes 4–8, the same handful of low-income dollar figures appears across dozens of counties that otherwise have completely different limits:

| Value | Appears as a low-income limit in |
|---|---|
| $109,896 | 47 counties |
| $112,392 | 45 counties |
| $83,256 / $96,576 / $114,888 | 42 counties each |

A real per-county income table can't do this — each county's limits scale from its own area median. For example, **Alamosa, Weld, and La Plata all show $109,896 at household size 6**, even though their household-size-1 limits are $57,120 / $63,680 / $65,840 respectively.

The progression inside a single county also breaks. The rural baseline runs smoothly `57,120 → 65,280 → 73,440` (~$8k steps), then jumps `83,256 → 96,576 → 109,896` (~$13k steps), then collapses to ~$2,500 steps (`112,392`, `114,888`). Income limits don't behave that way.

**Likely cause:** a fill-down or formula error in the household-4-through-8 low-income column of the source sheet.
**To verify in the live tool:** look up almost any rural county at household size 6 — the low-income figure is $109,896 nearly every time.

## 2. El Paso and Elbert appear swapped (high severity)

In this sheet, **El Paso County (Colorado Springs metro) carries the _lower_ bracket** and rural **Elbert carries the _higher_ metro bracket**:

| County | This sheet (HH1 moderate ceiling) | Last year |
|---|---|---|
| El Paso | $122,250 | $151,200 |
| Elbert | $151,200 | $122,250 |

This is backwards — a major metro should not have lower limits than an adjacent rural county — and it's reversed from last year. The rows are also out of alphabetical order at this spot in the sheet, consistent with a sort/label mix-up.

## 3. Lake and La Plata appear swapped (medium severity)

Same signature: the two counties' brackets are transposed versus last year (moderate ceilings $120,450 ↔ $120,650), and the rows are out of alphabetical order. Please confirm which county gets which against the source.

## 4. Minor rounding shifts (informational — likely fine)

~150 other low-income values shifted by $10–$40 versus last year (e.g., $57,150 → $57,120). These look like routine recalculation/rounding. The moderate-income ceilings are otherwise unchanged from last year except for the swaps noted above.
