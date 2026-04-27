---
name: gtm-launch
description: Generate a complete B2B SaaS GTM launch pack — email, Slack announcement, in-app banner, product tour, and help article — from a repo spec doc, implementation plan, or PR summary
---

# GTM Launch Asset Generator

Generates all five GTM communication assets for B2B SaaS product/feature launches. Output is production-ready copy requiring only minor tweaks.

## When to Use

- "Create GTM assets for [feature]"
- "Write launch email / Slack announcement / in-app banner"
- "Generate all the launch content"
- "Turn this spec into GTM copy"
- "We're launching X, help me write the comms"
- "Create a product tour and help article for this release"

---

## Step 1 — Read Source Materials

Check repo for relevant files:

```bash
# Common locations to check
find . -name "*.md" | grep -iE "(spec|prd|plan|impl|requirement|changelog)" | head -20
ls docs/ design/ specs/ 2>/dev/null
git log --oneline -10          # Recent commits for context
git diff main --name-only      # Changed files
```

Extract silently:
- **What changed** — specific feature/product launched
- **Why it matters** — user problem solved or value delivered
- **How it works** — core mechanics, user actions, outcomes
- **Who benefits** — target persona/segment
- **Limitations** — beta flags, known issues

---

## Step 2 — Ask Clarifying Questions

Surface findings, then ask only what materials didn't answer. Present numbered questions; wait for answers before generating.

**Always ask first:**
0. **Assets to generate** — all five (email, Slack, in-app banner, product tour, help article) or specific ones?

Follow-up questions (adapt to gaps, keep to 4-6):
1. **Persona** — primary user of this feature?
2. **Tone** — exciting/bold, calm/professional, or warm/helpful?
3. **Launch scope** — full release, limited beta, or phased rollout?
4. **Launch date** — when do comms go out?
5. **Key message** — one thing users should take away?
6. **Internal context** — team-only info not for customers?
7. **Tour trigger** — where in product does tour start?
8. **Help article** — replacing existing or net-new? Related articles to link?

---

## Step 3 — Generate the GTM Pack

Read `templates/asset-guidelines.md` for format, length, and writing rules.
Read `templates/output-format.md` for exact output structure.

Generate **only requested assets** in a single response. Each should be production-ready, not rough draft.

### Quality Bar

- **Email**: Never open with "We're excited to announce." Start with customer problem or direct value. One CTA. 120-200 words.
- **Slack**: Use Slack formatting (`*bold*`, `•` bullets). Include internal context (rollout %, caveats, who to ping) not in external comms.
- **In-app banner**: Headline <=8 words. Body <=25 words. One specific CTA. "You can now do X" beats "Exciting new update available."
- **Product tour**: 3-6 steps. One thing per step. Tooltip headline first, then supporting text. No step repeats what's visible on-screen.
- **Help article**: Structured as real support doc — overview, numbered steps, FAQs anticipating follow-ups. 300-600 words typical.

---

## Reference Files

| File | Read when |
|------|-----------|
| `templates/asset-guidelines.md` | Before writing any asset — format specs and examples for all 5 types |
| `templates/output-format.md` | To get exact markdown structure for final GTM pack output |
