---
name: qa_skill
description: "Complete reference for every agent, skill, prompt, code pattern, and CI workflow across crest (API), celium (UI), pixify (VD), and appium (Mobile) — start here for all automation tasks."
version: 1.6.13
repos: [unified-qa-framework, crest, celium, pixify, appium]
agents: [claude-code, cursor, copilot, windsurf]
frameworks: [RestAssured, Selenium, Playwright, Appium, Cucumber, TestNG, Gatling]
languages: [Java]
---

# Headout Unified QA Framework — Complete Reference

> One file. All agents. All skills. All prompts. All rules.

---

## Table of Contents

1. [Repository Map](#1-repository-map)
2. [Folder Structure](#2-folder-structure)
3. [Agents — What Each One Does](#3-agents--what-each-one-does)
4. [Skills — What Each One Covers](#4-skills--what-each-one-covers)
5. [qa-common.skill — Universal Entry Point](#5-qa-commonskill--universal-entry-point)
6. [How to Use with Claude — Single Layer](#6-how-to-use-with-claude--single-layer)
7. [How to Use with Claude — Multi-Layer E2E](#7-how-to-use-with-claude--multi-layer-e2e)
8. [Master Copy-Paste Prompt](#8-master-copy-paste-prompt)
9. [Input Type Examples](#9-input-type-examples)
10. [Key Code Patterns](#10-key-code-patterns)
11. [Inviolable Rules](#11-inviolable-rules)
12. [System Requirements](#12-system-requirements)
13. [Quick-Start Commands](#13-quick-start-commands)
14. [Scripts Reference](#14-scripts-reference)
15. [CI/CD Workflow Reference](#15-cicd-workflow-reference)
16. [New Test Authoring Checklist](#16-new-test-authoring-checklist)

---

## 1. Repository Map

| Repo | Layer | Primary Tool | UQF Version | Base Class |
|------|-------|-------------|-------------|-----------|
| `unified-qa-framework` | Core shared library | All layers | `1.6.13` | — |
| `crest` | API / Backend | RestAssured + Cucumber | `1.2` | `com.headout.base.be.BaseAutomation` |
| `celium` | Web UI (desktop + mobile web) | Selenium 4 / Playwright + Cucumber | `1.1-alpha` | `com.headout.base.fe.BaseAutomation` |
| `appium` | Native mobile (Android + iOS) | Appium 9 + Cucumber | `1.6-beta-3` | `com.headout.base.app.BaseAutomation` |

---

## 2. Folder Structure

```
qa/
├── qa.md                                    ← YOU ARE HERE — complete reference
├── skill.md                                 ← Skill index (entry point for AI agents)
│
├── common/
│   ├── agent/
│   │   ├── _PRAETORIAN_CONSTITUTION.md      ← Universal inviolable rules (include in EVERY prompt)
│   │   ├── locator_strategy.md              ← 8-tier web + 5-tier mobile locator priority
│   │   ├── architect_agent.md               ← Test design blueprint
│   │   ├── remediator_agent.md              ← Fix broken/flaky tests
│   │   └── qa_architect.md                  ← Cross-repo governance + layer hierarchy
│   └── skill/
│       ├── SKILL.md                         ← ★ UNIVERSAL ENTRY POINT — auto-routes to correct skill(s)
│       ├── test_case_creation.skill.md      ← All 17 scenario types + Gherkin rules
│       ├── step_reuse.skill.md              ← grep protocol before creating anything
│       ├── document_driven_test_generation.skill.md ← cURL/PR/Notion/GDoc → tests
│       └── test_execution_and_fix.skill.md  ← mvn compile test + parse errors + auto-fix loop
│
├── api/
│   ├── agent/
│   │   └── agent.md                ← crest API automation agent (end-to-end)
│   └── skill/
│       └── SKILL.md                         ← RestAssured + Cucumber patterns + schema + URLBuilders
│
├── ui/
│   ├── agent/
│   │   ├── ui_test_agent.md                 ← celium UI automation agent (end-to-end)
│   │   ├── locator_generate_agent.md        ← ByBuilder locator generator from HTML snippet
│   │   └── playwright_discovery_agent.md   ← live URL → MCP inspect → locators + PO + StepDef + Feature
│   └── skill/
│       └── SKILL.md                         ← ByBuilder + wait + genericMethod + PO patterns
│
├── vd/
│   ├── agent/
│   │   ├── vd_test_agent.md                 ← Visual Diff (pixify) agent
│   │   ├── locator_generate_agent.md        ← ByBuilder locator generator from HTML snippet
│   │   └── playwright_discovery_agent.md   ← live URL → MCP inspect → VD action JSON + assertions
│   └── skill/
│       └── SKILL.md                         ← pixify engine + 3 JSON config files + S3 baselines
│
└── app/
    ├── agent/
    │   ├── app_test_agent.md                ← appium mobile automation agent (end-to-end)
    │   └── locator_generate_agent.md        ← ByBuilder locator generator from Appium XML
    └── skill/
        └── SKILL.md                         ← dual-platform ByBuilder + wait.app() + AppPO patterns
```

---

## 3. Agents — What Each One Does

### `qa/common/agent/_PRAETORIAN_CONSTITUTION.md` — Universal Rules
Every agent obeys this without exception. Contains the 7 inviolable law sections covering base class usage, ThreadLocal patterns, forbidden anti-patterns (Thread.sleep, By.*, hardcoded values), step reuse protocol, and assertion requirements.

**Include in EVERY prompt to Claude.**

---

### `qa/api/agent/agent.md` — API Test Agent (crest)
Writes complete crest API test automation end-to-end.

Covers: ThreadLocal pattern (`request`, `response`, `requestMethod`), RequestBuilder chain, HTTP execution, `CrestDataHandler`, `Test_Runner.java` structure, `CommonStepDef` reuse.

**Use when**: Writing new API tests or updating existing ones in crest.

---

### `qa/ui/agent/ui_test_agent.md` — Web UI Test Agent (celium)
Writes complete celium UI test automation end-to-end.

Covers: `ByBuilder` instance fields in Page Objects (never `By.*`), `wait.waitForVisibilityOfElement()`, `genericMethod.click()`, `jsUtil`, shared component reuse, pre-task grep commands. celium step defs are **plain classes — NO base class extension**.

**Use when**: Writing new UI tests or Page Objects in celium.

---

### `qa/ui/agent/locator_generate_agent.md` — Locator Generator (UI / Selenium / Playwright)
Generates `ByBuilder` fields from raw HTML input for the celium UI layer.

Covers: 8-tier priority for web HTML (`data-qa-marker` first), parameterized `${id}` forms.

### `qa/app/agent/locator_generate_agent.md` — Locator Generator (Mobile / Appium)
Same agent, scoped to the appium layer — generates dual-platform `ByBuilder` fields from Appium XML.

Covers: 5-tier priority for Appium XML (`qaid-*` first), dual Android+iOS format, parameterized `${id}` forms.

### `qa/vd/agent/locator_generate_agent.md` — Locator Generator (VD / Playwright)
Same agent, scoped to the pixify (VD) layer — generates `ByBuilder` fields for Visual Diff page objects using Playwright/Selenium.

**Use when**: Paste HTML snippet — get `ByBuilder` fields for VD pre-capture action steps.

---

### `qa/ui/agent/playwright_discovery_agent.md` — Playwright Discovery Agent (UI)
Uses **Playwright MCP** to navigate a live URL, extract real DOM, discover all interactive and display elements, apply the locator strategy, and generate the complete test artifact set:
- `ByBuilder` locator fields
- Page Object class with action + assertion methods
- StepDef with `assertThat()` / `SoftAssertions` builder
- Cucumber Feature file (positive, negative, `@manual`, `@pending` scenarios)

**Use when**: You have a live URL (not an HTML snippet) and want the full test generated from the real page.

---

### `qa/vd/agent/playwright_discovery_agent.md` — Playwright Discovery Agent (VD)
Uses **Playwright MCP** to navigate a live URL, detect and dismiss blocking overlays (cookie banners, modals, app strips), extract locators for pre-capture actions, and generate all three VD config files plus assertion-based StepDef:
- `visual-diff-action.json` — ordered pre-capture action sequence
- `visual-diff-version-1.json` — page → S3 baseline URL mapping
- `upload-snapshot-{browser}-on-s3.json` — snapshot upload manifest
- `ByBuilder` locators for action steps
- `VisualDiffUtility` StepDef with `assertThat(diffPercent)` assertions
- Cucumber Feature file with `@visual-diff` scenarios

**Use when**: You have a live URL + pod name and need full VD coverage scaffolded from the real page.

---

### `qa/common/agent/locator_strategy.md` — Locator Priority Rules
Decision table for choosing which attribute to use as a locator.

Web priority order:
1. `data-qa-marker` → `ByBuilder.xpath("//*[@data-qa-marker='...']")`
2. `aria-label` → `ByBuilder.xpath("//*[@aria-label='...']")`
3. `data-testid` → `ByBuilder.xpath("//*[@data-testid='...']")`
4. stable `id` → `ByBuilder.id("...")`
5. CSS semantic → `ByBuilder.cssSelector("button.checkout-btn")`
6. `name` attribute → `ByBuilder.xpath("//*[@name='...']")`
7. `data-framer-name` → `ByBuilder.xpathWithDescription(...)`
8. attribute combination → `ByBuilder.xpathWithDescription(...)`

**Use when**: Generating or reviewing any locator.

---

### `qa/app/agent/app_test_agent.md` — Mobile App Test Agent (appium)
Writes complete appium mobile test automation end-to-end.

Covers: Dual-platform `ByBuilder` (Android `@resource-id='qaid-*'` / iOS `@name='qaid-*'`), `AppiumCommonDataHandler.getInstance()`, `wait.app().isDisplayed(locator, 35)` before every interaction. AppPO has **NO base class**; AppStepDef extends `base.be.BaseAutomation`.

**Use when**: Writing new mobile tests or Page Objects in appium.

---

### `qa/vd/agent/vd_test_agent.md` — Visual Diff Test Agent
Writes pixel comparison tests using the pixify engine in the pixify repo.

Covers: Pod concept (`platform` for MB sites vs `discovery` for headout.com), 3 JSON config files per pod, step-by-step new-MB workflow, baseline capture, S3 URL pattern, 10 inviolable VD rules.

**Use when**: Adding VD tests for new pages, new microbrands, or visual regressions.

---

### `qa/common/agent/architect_agent.md` — Test Architect
Takes a user story or requirement → produces a test design blueprint before any code is written.

Output includes: Feature file plan, step classification table (REUSE vs CREATE), Page Object / utility plan with locator tier specified, data setup plan, tag taxonomy, ordered implementation list.

**Use when**: Before writing any automation — design first, code second.

---

### `qa/common/agent/remediator_agent.md` — Test Fixer
Classifies and fixes broken/flaky tests with root-cause analysis.

Failure types: `LOCATOR` | `WAIT` | `ASSERTION` | `DATA_SETUP` | `COMPILE` | `MISSING_STEP` | `ENVIRONMENT` | `STALE_LOCATOR` | `FRAMEWORK_VERSION`

Output per fix: ROOT CAUSE, MINIMUM FIX (exact file:line change), VERIFICATION command, PREVENTION NOTE.

**Use when**: A test fails in CI or after a code change.

---

### `qa/common/agent/qa_architect.md` — QA Governance
Cross-repo strategy, base class hierarchy, data handler table, framework version lifecycle.

**Use when**: Onboarding, architecture reviews, layer decisions.

---

## 4. Skills — What Each One Covers

| Skill file | Purpose | Input |
|-----------|---------|-------|
| `api/skill/SKILL.md` | Create API test: schema, URLBuilder, Utility, StepDef, Feature | Endpoint spec / cURL |
| `ui/skill/SKILL.md` | Create UI test: Page Object, StepDef, Feature | Screen spec / HTML |
| `app/skill/SKILL.md` | Create mobile test: Screen PO, StepDef, Feature | Screen spec / Appium XML |
| `vd/skill/SKILL.md` | Create VD test: 3 JSON configs + Feature | URL + pod + page |
| `common/skill/SKILL.md` | Universal entry point — auto-detects layer and routes | Any input |
| `common/skill/step_reuse.skill.md` | Scan existing steps and POs before creating new ones | Keyword |
| `common/skill/test_case_creation.skill.md` | Design all scenario types in Gherkin | User story / AC |
| `common/skill/document_driven_test_generation.skill.md` | Generate tests from cURL, GitHub PR, Notion PRD, Google Doc | Document |
| `common/skill/test_execution_and_fix.skill.md` | Run `mvn compile test`, parse failures, auto-fix loop | Tag name |

### Scenario Types (test_case_creation.skill.md)

| Type | Tag | Description |
|------|-----|-------------|
| Positive | `@test` | Happy path, all valid inputs |
| Negative | `@test` | Invalid inputs, error responses |
| Edge/Boundary | `@test` | min/max values, empty/null, overflow |
| Schema | `@test` | Response field types and required fields |
| Manual | `@manual` | Visual checks, email verification, timing |
| Pending | `@pending` | Blocked by data/env — placeholder with reason |
| Revamp | `@revamp1` | Test needing rewrite (with tech debt note) |

---

## 5. qa-common.skill — Universal Entry Point

> **Start here for every QA task.** The common skill is a single prompt that accepts any input,
> automatically detects which layer(s) are needed, loads the correct individual skill(s),
> and generates all test files in one pass.
> Individual skills (`qa/api/skill/SKILL.md`, etc.) are still available if you know exactly which layer you need.

---

### 5a. The One Prompt to Rule Them All

Copy this. Paste it into Claude. Replace only the `[INPUT]` section. Done.

```
You are a senior QA automation engineer for Headout.

Load this common skill: qa/common/skill/SKILL.md
Follow without exception: qa/common/agent/_PRAETORIAN_CONSTITUTION.md

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INPUT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[PASTE ANY OF THESE — Claude auto-detects the layer(s)]

  • cURL command + sample response JSON
  • GitHub PR URL or description + changed files
  • Notion / Google Doc content (PRD, ERD, acceptance criteria)
  • User story in plain English (As a ... I want ... so that ...)
  • Screen description or raw HTML snippet
  • Appium page source / XML dump
  • VD request: URL + pod name + page + browser + language

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TARGET (optional — leave blank to auto-detect)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  [x] Auto-detect layers                ← default
  [ ] API only (crest)
  [ ] UI only (celium)
  [ ] Mobile only (appium)
  [ ] VD only (celium)
  [ ] API + UI
  [ ] API + UI + Mobile
  [ ] API + UI + VD
  [ ] All layers
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### 5b. Step-by-Step: How Claude Processes the Common Skill

When you send that prompt, Claude executes exactly these 6 steps in order:

```
STEP 1  READ & CLASSIFY INPUT
        ─────────────────────────────────────────────────
        Claude reads your input and identifies the type:

        Signal in input                     → Detected type
        ──────────────────────────────────────────────────
        curl -X  /  HTTP verb + URL + -d    → cURL
        PR Title: / github.com/*/pull/      → dev-pr
        Acceptance Criteria / AC-N / PRD    → prd-doc
        As a ... I want ... so that         → user-story
        <html / data-qa-marker= / aria-     → html-snippet
        <hierarchy / resource-id= / XCUI   → appium-xml
        microbrand: / slug: / pod: / VD     → vd-request

        ─────────────────────────────────────────────────
STEP 2  ASSIGN LAYER(S)
        ─────────────────────────────────────────────────
        Claude maps the detected type to layer(s):

        cURL + response                     → API
        HTML snippet                        → UI
        Appium XML                          → Mobile
        VD request                          → Visual Diff
        User story, no API contract         → UI + Mobile
        User story, with API contract       → API + UI + Mobile
        dev-pr, backend only                → API
        dev-pr, frontend only               → UI + Mobile
        dev-pr, full-stack                  → API + UI + Mobile
        PRD with API contract               → API + UI + Mobile
        PRD with API + design section       → API + UI + VD
        PRD with all sections               → API + UI + Mobile + VD

        ─────────────────────────────────────────────────
STEP 3  LOAD INDIVIDUAL SKILLS
        ─────────────────────────────────────────────────
        Layer assigned    Skill(s) loaded
        ─────────────────────────────────────────────────
        API               qa/api/skill/SKILL.md
                          + document_driven_test_generation.skill.md
        UI                qa/ui/skill/SKILL.md
                          + qa/ui/agent/locator_generate_agent.md
        Mobile            qa/app/skill/SKILL.md
                          + qa/app/agent/locator_generate_agent.md
        Visual Diff       qa/vd/skill/SKILL.md
                          + vd_test_agent.md
                          + qa/vd/agent/locator_generate_agent.md
        Always            test_case_creation.skill.md
                          + step_reuse.skill.md

        ─────────────────────────────────────────────────
STEP 4  SCAN EXISTING CODE (before writing anything)
        ─────────────────────────────────────────────────
        grep -rn "keyword" src/test/java/com/headout/stepdefinitions/
        grep -rn "keyword" src/test/java/com/headout/pageobjects/
        grep -rn "keyword" src/test/java/com/headout/features/

        Steps and POs already found → referenced, not rewritten.

        ─────────────────────────────────────────────────
STEP 5  BUILD TEST CASE MATRIX (before writing code)
        ─────────────────────────────────────────────────
        | # | Scenario | Type | Layer | Automatable | Tag |

        Types: Positive · Negative · Edge/Boundary ·
               Schema · Manual(@manual) · Pending(@pending)

        ─────────────────────────────────────────────────
STEP 6  GENERATE FILES in dependency order per layer
        ─────────────────────────────────────────────────
        API:    ResponseSchema JSON
                → URLBuilders entry (string key, no static constants)
                → Utility.java
                → StepDef.java  (extends base.be.BaseAutomation)
                → feature file

        UI:     Page Object  (ByBuilder fields, extends base.fe.BaseAutomation)
                → StepDef.java  (plain class, NO base extension)
                → feature file

        Mobile: Screen PO   (dual ByBuilder qaid-*, no base class)
                → StepDef.java  (extends base.be.BaseAutomation)
                → feature file

        VD:     upload-snapshot-chrome-on-s3.json  (MB_REQEUST-N)
                → upload-snapshot-firefox-on-s3.json
                → visual-diff-action.json  (STOP_ALL_PLAY + DOM_DELETE)
                → visual-diff-version-1.json  (placeholder)
                → feature file

        Then:   @manual scenarios with STEP N / EXPECTED comments
                @pending scenarios with blocking reason
                Generation report summary
```

---

### 5c. Common Skill vs Individual Skill — Decision Table

| Situation | Use |
|-----------|-----|
| You have a cURL and want just an API test | `qa/api/skill/SKILL.md` directly |
| You have HTML and want just UI locators + test | `qa/ui/skill/SKILL.md` directly |
| You have a live URL and want a full UI test generated | `qa/ui/agent/playwright_discovery_agent.md` |
| You have a live URL + pod and need VD coverage | `qa/vd/agent/playwright_discovery_agent.md` |
| You have a user story and are unsure which layers | **`qa_common.skill.md`** — auto-detects |
| You have a dev-PR touching backend + frontend | **`qa_common.skill.md`** — generates all layers |
| You have a Notion PRD | **`qa_common.skill.md`** — detects API + UI + VD automatically |
| You want to fix a broken test | `qa/common/skill/test_execution_and_fix.skill.md` directly |
| You only need locators from HTML (UI/VD) | `qa/ui/agent/locator_generate_agent.md` or `qa/vd/agent/locator_generate_agent.md` directly |
| You only need locators from Appium XML (Mobile) | `qa/app/agent/locator_generate_agent.md` directly |
| Feature spans 3+ layers and you want one response | **`qa_common.skill.md`** |

---

### 5d. End-to-End Walkthroughs

#### Walkthrough 1 — cURL → API Test

**You paste:**
```
Load: qa/common/skill/SKILL.md
Follow: qa/common/agent/_PRAETORIAN_CONSTITUTION.md

INPUT

curl -X GET 'https://api.test-headout.com/api/v2/experiences?cityCode=NYC&currency=USD&page=0&limit=10' \
  -H 'Authorization: Bearer TOKEN'

# Response:
{ "data": { "items": [{ "id": 101, "title": "Statue of Liberty Tour",
  "price": 29.99, "currency": "USD" }], "totalCount": 120, "page": 0, "limit": 10 } }
```

**Claude detects →** `cURL` → `API layer` → loads `qa/api/skill/SKILL.md`

**Claude produces:**
```
Step 1  SCAN  grep -rn "experiences" src/test/java/...stepdefinitions/
Step 2  MATRIX  6 scenarios (positive/negative/edge/schema/@manual/@pending)
Step 3  FILES
  src/test/resources/ResponseSchema/Experiences.json
  URLBuilders: endpointMap.put("experiences-list-v2", baseUrl + "/api/v2/experiences")
  ExperiencesUtility.java   — buildListRequest(), assertFields(), assertPagination()
  ExperiencesStepDef.java   — @Given / @When / @Then steps (extends BaseAutomation)
  experiences-list.feature  — Scenario Outline for 3 invalid city codes,
                              boundary (page=0/limit=1), schema, @manual, @pending
```

---

#### Walkthrough 2 — User Story → UI + Mobile

**You paste:**
```
Load: qa/common/skill/SKILL.md
Follow: qa/common/agent/_PRAETORIAN_CONSTITUTION.md

INPUT

As a traveller, I want to save an experience to my wishlist by tapping
the heart icon, so that I can revisit it later.
- Filled heart = saved, empty = not saved
- Guest users redirected to login
- Badge count updates on wishlist tab
```

**Claude detects →** `user-story`, no API contract → `UI + Mobile` → loads `qa/ui/skill/SKILL.md` + `qa/app/skill/SKILL.md`

**Claude produces (both layers):**
```
UI (celium):
  WishlistPO.java           — ByBuilder: wishlist-heart-btn, wishlist-tab-badge
                              methods: tapHeartIcon(), isWishlisted(), getBadgeCount()
  WishlistStepDef.java      — plain class, no base
  wishlist-ui.feature       — save/unsave/guest-redirect/badge-count + @manual (animation)

Mobile (appium):
  WishlistAppPO.java        — dual ByBuilder: qaid-wishlist-heart-btn (Android+iOS)
  WishlistAppStepDef.java   — extends base.be.BaseAutomation
  wishlist-app.feature      — Android save, iOS save, guest redirect + @manual
```

---

#### Walkthrough 3 — Notion PRD → API + UI + VD

**You paste:**
```
Load: qa/common/skill/SKILL.md
Follow: qa/common/agent/_PRAETORIAN_CONSTITUTION.md

INPUT

Feature: Top Picks section on homepage
AC-1: Shows up to 6 experience cards
AC-2: Cards show image, title, price, rating
AC-3: Hidden when API returns 204
API: GET /api/v2/discovery/top-picks → { items:[{id,title,price,rating,imageUrl}] }
Design: new card layout — needs visual regression. Pod: discovery
```

**Claude detects →** `prd-doc` with API contract + Design section → `API + UI + VD`

**Claude produces:**
```
Test Case Matrix (10 rows, AC references in scenario titles)

API (crest):
  TopPicksSchema.json
  URLBuilders entry
  TopPicksUtility.java + StepDef.java + top-picks-api.feature

UI (celium):
  TopPicksPO.java + StepDef.java + top-picks-ui.feature

VD (celium):
  upload-snapshot-chrome entry  (pod: discovery)
  visual-diff-action.json entry
  visual-diff-version-1.json placeholder
  homepage-top-picks-vd.feature
  baseline capture command: mvn compile test -Dtags="@snapshot-update-chrome"
```

---

#### Walkthrough 4 — HTML Snippet → Locators + UI Test

**You paste:**
```
Load: qa/common/skill/SKILL.md
Follow: qa/common/agent/_PRAETORIAN_CONSTITUTION.md

INPUT

<div class="checkout-summary">
  <input data-qa-marker="promo-input" type="text" />
  <button data-qa-marker="apply-promo-btn" aria-label="Apply promo">Apply</button>
  <span data-qa-marker="promo-success-msg">Promo applied!</span>
  <span data-qa-marker="promo-error-msg">Invalid code</span>
  <p data-qa-marker="discount-value">-$10.00</p>
</div>
```

**Claude detects →** `html-snippet` (data-qa-marker found) → `UI` → loads `qa/ui/skill/SKILL.md` + `qa/ui/agent/locator_generate_agent.md`

**Claude produces (locators using tier-1 data-qa-marker):**
```java
private final ByBuilder inputPromoCode  = ByBuilder.xpath("//*[@data-qa-marker='promo-input']");
private final ByBuilder btnApplyPromo   = ByBuilder.xpath("//*[@data-qa-marker='apply-promo-btn']");
private final ByBuilder txtSuccess      = ByBuilder.xpath("//*[@data-qa-marker='promo-success-msg']");
private final ByBuilder txtError        = ByBuilder.xpath("//*[@data-qa-marker='promo-error-msg']");
private final ByBuilder txtDiscount     = ByBuilder.xpath("//*[@data-qa-marker='discount-value']");
```
```
CheckoutPromoPO.java       — above locators + enterPromo(), applyPromo(),
                             getSuccessMsg(), getErrorMsg(), getDiscountValue()
CheckoutPromoStepDef.java  — @When / @Then referencing PO methods
checkout-promo-ui.feature  — positive + negative + edge + @manual (animation)
```

---

#### Walkthrough 5 — Full-Stack dev-PR → API + UI + Mobile

**You paste:**
```
Load: qa/common/skill/SKILL.md
Follow: qa/common/agent/_PRAETORIAN_CONSTITUTION.md

INPUT

PR Title: feat(booking): group booking support
Backend: POST /api/v2/booking/group-create
  Request: {variantId, quantity(5-50), contactName, contactEmail, currency}
  Response: {bookingId, groupCode, totalAmount, discountPercent}
  Errors: INVALID_QUANTITY | INVALID_EMAIL | NOT_GROUP_ELIGIBLE
Frontend (web): button data-qa-marker="group-booking-btn", qty selector, contact form
Mobile: button qaid-group-booking-btn, native contact form
```

**Claude detects →** `dev-pr`, backend + frontend + mobile → `API + UI + Mobile`

**Claude produces (all 3 layers in one response):**
```
API (crest):
  GroupBookingSchema.json
  URLBuilders: "group-booking-create-v2"
  GroupBookingUtility.java + GroupBookingStepDef.java
  group-booking-api.feature — qty 5/10/50 (pos), 4/51/0/-1 (neg),
                              INVALID_EMAIL, NOT_GROUP_ELIGIBLE, schema

UI (celium):
  GroupBookingPO.java       — btnGroupBooking, inputQty, inputName,
                              inputEmail, btnConfirm
  GroupBookingStepDef.java  — plain class
  group-booking-ui.feature  — open flow / fill form / submit / errors

Mobile (appium):
  GroupBookingAppPO.java    — qaid-group-booking-btn (Android+iOS dual ByBuilder)
  GroupBookingAppStepDef.java
  group-booking-app.feature — Android + iOS coverage
```

---

### 5e. Forcing a Specific Layer (Override Auto-Detect)

If you know the layer and don't want auto-detection, just tick the box:

```
TARGET:
  [x] API only (crest)       ← forces API only even if HTML is in the input
```

Or append directly in plain English after your input:

```
Generate API tests only. Skip UI and Mobile.
```

---

## 6. How to Use with Claude — Single Layer

### Which Prompt to Use

| Scenario | Layer |
|---------|-------|
| API test from a cURL | [API Only](#api-only) |
| UI test from a screen description | [UI Only](#ui-only) |
| VD test for a new microbrand or page | [VD Only](#vd-only) |
| Mobile test from a screen / page source | [Mobile Only](#mobile-only) |
| Design test cases before coding | [Design Blueprint](#design-blueprint) |
| Fix a failing or flaky test | [Fix Failing Test](#fix-failing-test) |

---

### API Only

```
You are a QA automation engineer for Headout (crest repo).

Read: qa/api/skill/SKILL.md
Follow: qa/common/agent/_PRAETORIAN_CONSTITUTION.md

INPUT TYPE: curl

[PASTE CURL COMMAND + SAMPLE RESPONSE]

TASKS:
1. Test Case Matrix (positive, negative, edge, schema, manual, pending)
2. ResponseSchema JSON → src/test/resources/ResponseSchema/<Name>.json
3. URLBuilders endpoint key (string key in endpointMap — no static constants)
4. <Name>Utility.java — request builder + assertion methods
5. <Name>StepDef.java — ThreadLocal pattern
6. <name>.feature — all automatable scenarios as Scenario Outline where applicable
7. @manual scenarios with full step instructions
8. @pending scenarios with blocking reason
```

---

### UI Only

```
You are a QA automation engineer for Headout (celium repo).

Read: qa/ui/skill/SKILL.md
Read: qa/ui/agent/locator_generate_agent.md
Read: qa/common/agent/locator_strategy.md
Follow: qa/common/agent/_PRAETORIAN_CONSTITUTION.md

INPUT TYPE: user-story

[DESCRIBE SCREEN OR PASTE HTML SNIPPET]

STEP 1 — Scan existing code first:
  grep -rn "keyword" src/test/java/com/headout/stepdefinitions/
  grep -rn "keyword" src/test/java/com/headout/pageobjects/

TASKS:
1. Test Case Matrix
2. <Name>PO.java — ByBuilder instance fields (data-qa-marker first priority)
3. <Name>StepDef.java — plain class, no base class extension
4. <name>.feature — all scenarios
5. @manual cases (visual checks, animations, responsive layout)
```

---

### Mobile Only

```
You are a QA automation engineer for Headout (appium repo).

Read: qa/app/skill/SKILL.md
Read: qa/app/agent/app_test_agent.md
Follow: qa/common/agent/_PRAETORIAN_CONSTITUTION.md

INPUT TYPE: user-story

[DESCRIBE SCREEN OR PASTE APPIUM XML / PAGE SOURCE]

STEP 1 — Scan existing code:
  grep -rn "keyword" src/test/java/com/headout/stepdefinitions/
  grep -rn "keyword" src/test/java/com/headout/pageobjects/

TASKS:
1. Test Case Matrix
2. <Name>AppPO.java — dual-platform ByBuilder (qaid-* locators, no base class)
3. <Name>AppStepDef.java — extends base.be.BaseAutomation
4. <name>-app.feature — Android + iOS coverage
5. @manual and @pending cases
```

---

### VD Only

```
You are a QA automation engineer for Headout (celium repo).

Read: qa/vd/skill/SKILL.md
Read: qa/vd/agent/vd_test_agent.md
Follow: qa/common/agent/_PRAETORIAN_CONSTITUTION.md

INPUT TYPE: vd

[PROVIDE: URL, pod name, page name, browser, language, mode]

Examples:
  Pod: platform (for MB sites) | discovery (for headout.com)
  Mode: D_WEB | M_WEB | both
  Browser: CHROME | FIREFOX | both
  Language: EN | FR | etc.

STEP 1 — Check existing indices:
  python3 -c "import json,sys; d=json.load(open('src/test/resources/vd/{pod}/upload-snapshot-chrome-on-s3.json'))
  [print(f'MB_REQEUST-{i}: {e[\"initialImageName\"]}') for i,e in enumerate(d)]"

TASKS:
1. upload-snapshot-chrome-on-s3.json entry (correct MB_REQEUST-N index)
2. upload-snapshot-firefox-on-s3.json entry (if Firefox required)
3. visual-diff-action.json entry (STOP_ALL_PLAY + DOM_DELETE + any custom actions)
4. visual-diff-version-1.json placeholder entry
5. <slug>-visual-diff.feature with comparison scenario
6. Snapshot feature file update (MB_REQEUST-N row)
7. Baseline capture command: mvn compile test -Dcucumber.filter.tags="@snapshot-update-chrome"
```

---

### Design Blueprint

```
You are a QA automation engineer for Headout.

Read: qa/common/agent/architect_agent.md
Read: qa/common/skill/test_case_creation.skill.md

[PASTE USER STORY OR ACCEPTANCE CRITERIA]

Produce a test design blueprint ONLY — no code yet:
1. Feature file plan with Scenario/Outline breakdown
2. Step classification table (REUSE vs CREATE)
3. Page Object / utility plan with locator tier specified
4. Data setup plan
5. Tag taxonomy
6. Ordered implementation sequence
```

---

### Fix Failing Test

```
You are a QA automation engineer for Headout.

Read: qa/common/agent/remediator_agent.md
Follow: qa/common/agent/_PRAETORIAN_CONSTITUTION.md

[PASTE FULL ERROR + STACK TRACE]

Classify failure type:
LOCATOR | WAIT | ASSERTION | DATA_SETUP | COMPILE | MISSING_STEP | ENVIRONMENT | STALE_LOCATOR | FRAMEWORK_VERSION

Output:
ROOT CAUSE: [what changed]
MINIMUM FIX: [file:line → exact code change]
VERIFICATION: [command to verify fix]
PREVENTION: [how to avoid recurrence]
```

---

## 7. How to Use with Claude — Multi-Layer E2E

### API + UI (Backend + Frontend Feature)

```
You are a QA automation engineer for Headout.
Generate tests for BOTH crest (API) AND celium (UI).

Read: qa/api/skill/SKILL.md
Read: qa/ui/skill/SKILL.md
Read: qa/common/skill/test_case_creation.skill.md
Read: qa/common/skill/step_reuse.skill.md
Follow: qa/common/agent/_PRAETORIAN_CONSTITUTION.md

INPUT TYPE: [curl | dev-pr | user-story | notion]

[PASTE INPUT — describe both backend API changes and frontend screen changes]

LAYERS:
[x] API (crest)
[x] Web UI (celium)

STEP 1 — Scan existing code in both repos before writing anything.

STEP 2 — One unified Test Case Matrix with a "Layer" column.

STEP 3 — API output (crest):
  ResponseSchema JSON → URLBuilders entry → Utility.java → StepDef.java → Feature file

STEP 4 — UI output (celium):
  Page Object (ByBuilder) → StepDef.java → Feature file

STEP 5 — E2E cross-layer scenario:
  Gherkin scenario using API setup → UI interaction → API assertion
```

---

### API + UI + Mobile (All Three Layers)

```
You are a QA automation engineer for Headout.
Generate tests across crest, celium, AND appium.

Read: qa/api/skill/SKILL.md
Read: qa/ui/skill/SKILL.md
Read: qa/app/skill/SKILL.md
Read: qa/common/skill/test_case_creation.skill.md
Read: qa/common/skill/step_reuse.skill.md
Follow: qa/common/agent/_PRAETORIAN_CONSTITUTION.md

INPUT TYPE: [dev-pr | user-story | notion]

[PASTE INPUT]

LAYERS:
[x] API (crest)
[x] Web UI (celium)
[x] Mobile App (appium)

Generate complete code for all three layers.
One unified Test Case Matrix with a "Layer" column.
```

---

### API + UI + Visual Diff (Feature + Visual Regression)

```
You are a QA automation engineer for Headout.
Generate API tests, UI tests, AND Visual Diff tests.

Read: qa/api/skill/SKILL.md
Read: qa/ui/skill/SKILL.md
Read: qa/vd/skill/SKILL.md
Read: qa/common/skill/test_case_creation.skill.md
Follow: qa/common/agent/_PRAETORIAN_CONSTITUTION.md

INPUT TYPE: [dev-pr | user-story]

[PASTE INPUT]

LAYERS:
[x] API (crest)
[x] Web UI (celium)
[x] Visual Diff (pixify (VD) — pod: discovery | platform)

Generate API and UI tests as normal.
For VD — add all 3 JSON config entries + feature scenario + show baseline capture command.
```

---

### Full E2E: API + UI + Mobile + VD (Complete Coverage)

```
You are a senior QA automation engineer for Headout.
Generate COMPLETE test coverage across all layers.

Read ALL skills:
  qa/common/skill/test_case_creation.skill.md
  qa/api/skill/SKILL.md
  qa/ui/skill/SKILL.md
  qa/app/skill/SKILL.md
  qa/vd/skill/SKILL.md
  qa/common/skill/step_reuse.skill.md
  qa/common/skill/document_driven_test_generation.skill.md
Follow: qa/common/agent/_PRAETORIAN_CONSTITUTION.md

INPUT TYPE: [curl | user-story | dev-pr | notion | google-doc | vd]

[PASTE YOUR INPUT HERE]

LAYERS:
[x] API (crest)
[x] Web UI (celium)
[x] Mobile App (appium)
[x] Visual Diff (pixify (VD))

OUTPUT ORDER:
1. Test Case Matrix (all layers, all types)
2. API: Schema JSON → URLBuilders → Utility.java → StepDef.java → Feature file
3. UI: Page Object (ByBuilder) → StepDef.java → Feature file
4. Mobile: Screen PO (dual ByBuilder) → StepDef.java → Feature file
5. VD: visual-diff-action.json → visual-diff-version-1.json → upload-snapshot.json → VD Feature
6. @manual scenarios with full step instructions
7. @pending scenarios with blocking reason
8. Generation summary
```

---

## 8. Master Copy-Paste Prompt

Use this single prompt for ANY input type and ANY combination of layers:

```
You are a QA automation engineer for Headout. Read the following input and
generate a complete, production-ready test suite.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INPUT TYPE: [curl | dev-pr | notion | google-doc | user-story | vd]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[INPUT]

<paste your cURL, PR URL/description, Notion/Google Doc content,
 user story, or plain English description here>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TARGET LAYERS (check all that apply):
  [ ] API (crest — RestAssured)
  [ ] Web UI (celium — Selenium/Playwright)
  [ ] Mobile App (appium — Android + iOS)
  [ ] Visual Diff (pixify — pixel comparison)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Follow these rules:

1. CONSTITUTION — obey all rules in qa/common/agent/_PRAETORIAN_CONSTITUTION.md without exception.

2. STEP REUSE — before writing any step definition or Page Object, scan existing code:
     grep -rn "<keyword>" src/test/java/com/headout/stepdefinitions/
   Reference qa/common/skill/step_reuse.skill.md for the full protocol.

3. TEST CASE MATRIX — produce a table with all test cases before writing any code:
     | # | Description | Test Type | Layer | Automatable | Tag |
   Categories: Positive | Negative | Edge/Boundary | Schema | Manual | Pending

4. OUTPUT ORDER — always produce files in this dependency order:
   a. Test Case Matrix
   b. ResponseSchema JSON file (API only — src/test/resources/ResponseSchema/)
   c. URLBuilders endpoint entry (API — string key in endpointMap, no static constants)
   d. Utility / Page Object / Screen PO Java file
   e. Step Definition Java file
   f. Feature file (Gherkin)
   g. Config JSON files (VD only — visual-diff-action.json + visual-diff-version-1.json)
   h. @manual scenarios (with full step instructions)
   i. @pending scenarios (with blocking reason)

5. LAYER RULES:

   API (crest):
   - Extend com.headout.base.be.BaseAutomation in all StepDef and Utility classes
   - endpoint key: endpointMap.put("key-v2", baseUrl + "/path") — string key, NO static constants
   - request.get().endpoint(...).queryParams(...).header(...).body(...).build()
   - response.set(requestMethod.get/post/put/delete/patch(request.get().build()))
   - softAssertionUtil.get().assertAll() MANDATORY at end of every @Then

   Web UI (celium):
   - Page Objects extend com.headout.base.fe.BaseAutomation
   - Step Defs: plain class (NO base class extension)
   - Locators: instance ByBuilder fields — priority: data-qa-marker > aria-label > data-testid > stable id > CSS
   - wait.waitForVisibilityOfElement() / wait.waitForElementToBeClickable() — NEVER Thread.sleep

   Mobile App (appium):
   - Page Objects extend com.headout.base.app.BaseAutomation
   - Step Defs extend com.headout.base.be.BaseAutomation
   - Locators: private final ByBuilder — dual-platform: @resource-id='qaid-...' or @name='qaid-...'
   - wait.app().isDisplayed(locator, 35) before every interaction

   Visual Diff (pixify (VD)):
   - Feature file: src/test/java/com/headout/features/platfrom/visual/mb/<mb>-visual-diff.feature
   - Always include: STOP_ALL_PLAY + SCROLL_DOWN_PAGE + DOM_DELETE before capture
   - Capture mode: FULL_PAGE_SCREENSHOT for most pages

6. GHERKIN RULES:
   - Scenario Outline + Examples when 2+ data rows share identical steps
   - Tags: @headout @<domain> @test @test-regression @test-sanity minimum
   - @manual must include # STEP N: and # EXPECTED: lines
   - @pending must include a comment explaining the blocking reason
   - NO hardcoded URLs, IDs, prices, or credentials in step text

7. LOGGING & CONFIG:
   - TestNGLogUtility.info() — NEVER System.out.println()
   - PropertyUtils.get(ConfigMap.*) — NEVER hardcode env config
   - YamlReader.getAppConfigValue("Users.<type>.<field>") — for credentials

Report format at end:
## Test Generation Report
### Source: [input type + summary]
### Layers: [which layers]
### Test Case Matrix: [table]
### Generated Files: [list with full paths]
### Manual Test Cases: [full @manual scenarios]
### Pending Cases: [list with blocking reason]
### Gaps / Clarifications: [anything ambiguous]
```

---

## 9. Input Type Examples

### cURL + Response → API Test

```
INPUT TYPE: curl

curl -X POST 'https://api.test-headout.com/api/v2/booking/create' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer TOKEN' \
  -d '{ "variantId": "12345", "currency": "USD" }'

# Response:
{ "data": { "bookingId": "BK-001", "status": "CONFIRMED" } }

TARGET LAYERS:
  [x] API (crest)
```

Generates: ResponseSchema JSON, URLBuilders entry, BookingUtility.java, BookingStepDef.java, booking-create.feature

---

### GitHub PR → API + UI + Mobile

```
INPUT TYPE: dev-pr

PR Title: feat(booking): add promo code support to booking create API
Changes:
  - New field promoCode in request
  - New field discountAmount in response
  - New error codes 400 "Invalid promo code" and "Promo code has expired"
  - New promo input field on checkout screen (web + mobile)

TARGET LAYERS:
  [x] API (crest)
  [x] Web UI (celium)
  [x] Mobile App (appium)
```

Generates: Updated schema, new scenarios for each changed field/error, UI step for promo input, App step for promo field

---

### Notion / Google Doc PRD → All Layers

```
INPUT TYPE: notion

Feature: Checkout Promo Code
Acceptance Criteria:
  AC-1: User can apply a valid promo code and see discount
  AC-2: Invalid promo shows "Invalid promo code" error
  AC-3: Expired promo shows "Promo code has expired" error

API Contract:
  POST /api/v2/booking/apply-promo
  Request: { bookingId: string, promoCode: string }
  Response 200: { discountAmount: number, finalAmount: number }
  Response 400: { message: string }

TARGET LAYERS:
  [x] API (crest)
  [x] Web UI (celium)
  [x] Mobile App (appium)
```

Generates: Test matrix with AC references, complete feature files for all three layers

---

### User Story → API Test

```
INPUT TYPE: user-story

As a Hub operator, I want to apply a partial refund to a booking.
Constraints:
- Only REFUND_LEADS role can approve refunds > 50%
- Booking must be in CONFIRMED or PARTIALLY_USED status
- Boundary: refund amounts of 0%, 50%, 50.1%, 100%, 100.1%

TARGET LAYERS:
  [x] API (crest)
```

Generates: Test case matrix covering role-based access, status constraints, boundary values

---

### VD → New Microbrand

```
INPUT TYPE: vd

New microbrand: seine-river-cruises
Slug: seinerivercruises
Pages: home, the-seine-river, menu-page
Languages: EN, FR
Browsers: Chrome, Firefox
Pod: platform

TARGET LAYERS:
  [x] Visual Diff (pixify)
```

Generates: seinerivercruises-visual-diff.feature, action config, version file entries (EN+FR × D_WEB × CHROME+FIREFOX), @manual scenarios for animations

---

## 10. Key Code Patterns

### API (crest) — Step Definition

```java
// Step definition extends BaseAutomation
public class BookingStepDef extends BaseAutomation {

    @Given("user creates a booking request for variantId {string}")
    public void createBookingRequest(String variantId) {
        request.get()
            .endpoint(urlBuilderClass.getUrl("booking-create-v2"))
            .header("Authorization", "Bearer " + PropertyUtils.get(ConfigMap.AUTH_TOKEN))
            .body(new BookingRequest(variantId))
            .build();
    }

    @When("user sends the POST booking request")
    public void sendPostRequest() {
        response.set(requestMethod.post(request.get().build()));
    }

    @Then("booking response status should be {string}")
    public void assertBookingStatus(String expectedStatus) {
        softAssertionUtil.get().assertEquals(
            response.get().jsonPath().getString("data.status"),
            expectedStatus, "Booking status mismatch");
        softAssertionUtil.get().assertAll(); // MANDATORY — never omit
    }
}
```

---

### UI (celium) — Page Object + Step Definition

```java
// Page Object extends BaseAutomation
public class CheckoutPO extends BaseAutomation {

    // ByBuilder instance fields — data-qa-marker is highest priority
    private final ByBuilder inputPromoCode =
        ByBuilder.xpath("//*[@data-qa-marker='promo-code-input']");
    private final ByBuilder btnApplyPromo =
        ByBuilder.xpath("//*[@data-qa-marker='apply-promo-btn']");
    private final ByBuilder txtDiscountDisplay =
        ByBuilder.xpath("//*[@data-qa-marker='discount-display']");

    public void applyPromoCode(String code) {
        wait.waitForVisibilityOfElement(inputPromoCode);
        genericMethod.sendKeys(inputPromoCode, code);
        wait.waitForElementToBeClickable(btnApplyPromo);
        genericMethod.click(btnApplyPromo);
    }

    public String getDiscountText() {
        wait.waitForVisibilityOfElement(txtDiscountDisplay);
        return genericMethod.getText(txtDiscountDisplay);
    }
}

// Step Definition — plain class, NO base class extension
public class CheckoutStepDef {
    private final CheckoutPO checkoutPO = new CheckoutPO();

    @When("user applies promo code {string}")
    public void applyPromo(String code) {
        checkoutPO.applyPromoCode(code);
    }

    @Then("discount amount should be displayed as {string}")
    public void assertDiscountDisplay(String expected) {
        Assert.assertEquals(checkoutPO.getDiscountText(), expected);
    }
}
```

---

### Mobile App (appium) — Dual-Platform Page Object

```java
// Page Object — dual-platform ByBuilder, NO base class
public class CheckoutAppPO {

    private final ByBuilder btnApplyPromo = ByBuilder.xpath(
        "//*[@resource-id='qaid-apply-promo-btn']",  // Android
        "//*[@name='qaid-apply-promo-btn']",          // iOS
        "Apply promo button Android",
        "Apply promo button iOS");

    private final ByBuilder inputPromoCode = ByBuilder.xpath(
        "//*[@resource-id='qaid-promo-code-input']",
        "//*[@name='qaid-promo-code-input']",
        "Promo code input Android",
        "Promo code input iOS");

    public void applyPromoCode(String code) {
        wait.app().isDisplayed(inputPromoCode, 35);
        genericMethod.app().tap(inputPromoCode);
        genericMethod.app().sendKeys(inputPromoCode, code);
        wait.app().isDisplayed(btnApplyPromo, 35);
        genericMethod.app().tap(btnApplyPromo);
    }
}

// Step Definition extends base.be.BaseAutomation
public class CheckoutAppStepDef extends BaseAutomation {
    private final CheckoutAppPO po = new CheckoutAppPO();

    @When("user enters promo code {string} on app checkout")
    public void enterPromoCode(String code) {
        po.applyPromoCode(code);
    }
}
```

---

### Visual Diff (pixify (VD)) — Feature File + Config

```gherkin
@visual-diff @mb-visual-diff-sanity @mb-visual-diff-regression @visual-diff-sanity @dweb
Scenario Outline: Validate no visual diff on <PAGE> page for <MB>
  Given User set basic vd data setup for pod "platform"
  When  User opens the application "<OPEN_KEY>" and "ui"
  And   User perform action "STOP_ALL_PLAY"   for element ""            on mb "<SNAPSHOT_NAME>"
  And   User perform action "SCROLL_DOWN_PAGE" for element ""           on mb "<SNAPSHOT_NAME>"
  And   User perform action "DOM_DELETE"       for element "DOM_ELEMENTS" on mb "<SNAPSHOT_NAME>"
  And   User capture snapshot "FULL_PAGE_SCREENSHOT" for page
  And   Get production snapshot based on snapshot name "<SNAPSHOT_NAME>", service type "<SERVICE_TYPE>", language "<LANGUAGE>", and mode type "<MODE_TYPE>"
  Then  User compare both image and failed if any visual diff

  Examples:
    | MB                | PAGE     | OPEN_KEY              | SNAPSHOT_NAME     | SERVICE_TYPE | LANGUAGE | MODE_TYPE |
    | seine-river-cruises | homepage | seinerivercruises_home | srb_homepage_en  | MB           | EN       | D_WEB     |
```

```json
// visual-diff-action.json entry
{
  "snapshotName": "srb_homepage_en",
  "actions": [
    { "action": "STOP_ALL_PLAY" },
    { "action": "SCROLL_DOWN_PAGE" },
    { "action": "DOM_DELETE", "element": ".cookie-banner, .chat-widget" }
  ]
}
```

---

### Run Tests

```bash
# Run single tag (development)
mvn compile test \
  -Dcucumber.filter.tags="@booking-create-001" \
  -DthreadCount=1 \
  2>&1 | tee /tmp/mvn-test-output.txt

# Run suite (CI)
mvn test -Dcucumber.filter.tags="@test-regression" -DthreadCount=5

# Run with browser choice (celium)
mvn test -Dcucumber.filter.tags="@test" -DBROWSER=chrome

# Run mobile (appium)
mvn test -Dcucumber.filter.tags="@test" -DDEVICE_TYPE=android

# Capture VD baseline
mvn compile test -Dcucumber.filter.tags="@snapshot-update-chrome"
```

---

## 11. Inviolable Rules

| # | Rule |
|---|------|
| 1 | **No `Thread.sleep()`** — use `wait.waitForVisibilityOfElement()` or VD `WAIT` action |
| 2 | **No hardcoded URLs, tokens, credentials** — use `PropertyUtils.get(ConfigMap.*)` or `GetSecretToken` |
| 3 | **No `By.*` locators** in celium or appium — use `ByBuilder` instance fields only |
| 4 | **No locators inside step definitions** — locators belong in Page Objects exclusively |
| 5 | **Always call `softAssertionUtil.get().assertAll()`** at end of every `@Then` in API/App tests |
| 6 | **Search before creating** — grep existing stepdefs and POs before writing new ones |
| 7 | **URLBuilders use string keys**: `endpointMap.put("key-v2", baseUrl + "/path")` — no `public static final String` constants |
| 8 | **Correct base class per layer**: BE → `base.be.BaseAutomation`, FE PO → `base.fe.BaseAutomation`, App PO → `base.app.BaseAutomation` |
| 9 | **celium StepDefs are plain classes** (no extension); **appium StepDefs extend `base.be.BaseAutomation`** |
| 10 | **VD: always `STOP_ALL_PLAY` + `DOM_DELETE`** (removes banners) before any capture |
| 11 | **Tag every scenario** — minimum: `@test` or `@live` plus one functional tag |
| 12 | **Feature files go under** `src/test/java/com/headout/features/<domain>/<service>/` |
| 13 | **Data setup belongs in `DataSetup` classes** and `@After` hooks — not in step definitions |
| 14 | **`TestNGLogUtility.info()`** — never `System.out.println()` |

---

## 12. System Requirements

### Required Tools

| Tool | Version | Notes |
|------|---------|-------|
| Java (JDK) | 21 | `brew install openjdk@21` on macOS |
| Maven | 3.9.x | `brew install maven` |
| Node.js | 16 | Required by some CI workflows |
| Android SDK + ADB | latest | appium only |
| Xcode / iOS toolchain | latest | appium iOS only |
| WireGuard | latest | crest test/live environments |
| Python | 3.9+ | Utility scripts |

### Python Script Dependencies

```
selenium==4.22.0
gherkin-official==28.0.0
requests==2.32.3
gitpython
```

Install: `pip install -r requirements.txt`

### Maven Authentication (`settings.xml`)

```xml
<servers>
  <server>
    <id>github</id>
    <username>YOUR_GITHUB_USERNAME</username>
    <password>YOUR_GITHUB_PAT</password>
  </server>
</servers>
```

---

## 13. Quick-Start Commands

### API Automation (crest)

```bash
git clone git@github.com:headout/crest.git && cd crest
mvn --global-settings settings.xml clean install -DskipTests=true
mvn test -Dcucumber.filter.tags="@test" -DthreadCount=5
```

### Web UI Automation (celium)

```bash
git clone git@github.com:headout/celium.git && cd celium
mvn --global-settings settings.xml clean install
mvn test -Dcucumber.filter.tags="@test" -DBROWSER=chrome
```

### Mobile App Automation (appium)

```bash
git clone git@github.com:headout/appium.git && cd appium
mvn --global-settings settings.xml clean install
./android-script/setup_android_emulators.sh
./android-script/create_avds.sh
mvn test -Dcucumber.filter.tags="@test" -DDEVICE_TYPE=android
```

### Reset Appium UiAutomator Between Runs

```bash
adb uninstall io.appium.uiautomator2.server
adb uninstall io.appium.uiautomator2.server.test
```

---

## 14. Scripts Reference

### `scripts/` (crest, celium, appium)

| Script | Purpose |
|--------|---------|
| `automation_tracker.py` | Parses feature files, counts `@pending`/`@manual`/`@revamp<N>` scenarios, posts coverage to Slack/QA portal |
| `count_scenarios_by_tags.py` | Counts BDD scenarios by tag across all feature files; supports Scenario Outlines |
| `jacoco/collect-jacoco-coverage.sh` | Collects JaCoCo `.exec` coverage from running services |
| `jacoco/process-jacoco-coverage.sh` | Generates HTML/XML coverage reports |

```bash
# Run coverage tracker
python scripts/automation_tracker.py --repo crest --env test
python scripts/count_scenarios_by_tags.py --target-tags test live ode-regression
```

### `android-script/` (appium only)

| Script | Purpose |
|--------|---------|
| `setup_android_emulators.sh` | Bootstrap Android SDK + emulator environment (macOS/Linux) |
| `create_avds.sh` | Create named AVD instances |
| `start-emulator.sh` | Start emulator; wait for boot |
| `stop-emulator.sh` | Gracefully stop running emulator |
| `delete-emulator.sh` | Delete an AVD from registry |
| `get-result.py` | Fetch and format CI test run results |

---

## 15. CI/CD Workflow Reference

### unified-qa-framework

| Workflow | Trigger | Action |
|----------|---------|--------|
| `maven-auto-release.yml` | Push to `main` (src/** / pom.xml) | Auto-version bump + publish JAR to GitHub Packages |
| `publish-release.yml` | Manual | Manual Maven registry publish |

### crest

| Workflow | Trigger | Action |
|----------|---------|--------|
| `get-automation-report.yml` | `workflow_dispatch` | Run API suite; post Slack report |
| `get-automation-count-details.yml` | Schedule / PR | Upload scenario counts |
| `vpn-setup.yml` | Called by others | WireGuard VPN for test/live |

### celium

| Workflow | Trigger | Action |
|----------|---------|--------|
| `get-automation-report.yml` | `workflow_dispatch` | Run UI suite; post Slack report |
| `visual-diff-ode.yml` | PR / manual | Visual regression vs ODE envs |
| `pr_review.yml` | PR | Automated PR checks |
| `stale-branch.yml` | Schedule | Clean stale branches |

### appium

| Workflow | Trigger | Action |
|----------|---------|--------|
| `automation-suite.yml` | `workflow_dispatch` | Full mobile test suite |
| `common-automation-suite.yml` | `workflow_dispatch` | Common Android + iOS suite |
| `get-e2e-automation-suite.yml` | `workflow_dispatch` | End-to-end journey suite |
| `pr-automation-trigger.yml` | PR | Smoke tests on PRs |
| `build-check.yml` | PR / push | Maven compile validation |
| `lint-check.yml` | PR / push | Code style checks |
| `performance-check.yml` | Schedule / manual | Gatling load tests |
| `feature-file-upload.yml` | Push to main | Upload feature files to QA portal |

---

## 16. New Test Authoring Checklist

- [ ] Feature file placed under `src/test/java/com/headout/features/<domain>/<service>/`
- [ ] All scenarios tagged with environment (`@test`/`@live`) and functional tags
- [ ] `Scenario Outline` + `Examples` used for data-driven cases (2+ rows)
- [ ] StepDef extends correct `BaseAutomation` for the layer (or plain class for celium UI)
- [ ] No hardcoded credentials — uses `PropertyUtils.get(ConfigMap.*)` or `GetSecretToken`
- [ ] `softAssertionUtil.get().assertAll()` called at end of every `@Then` (API + App)
- [ ] All locators are `ByBuilder` instance fields in Page Objects (no `By.*`)
- [ ] `wait.waitForVisibilityOfElement()` used before every UI interaction (no `Thread.sleep`)
- [ ] Existing step definitions checked before creating new ones (`grep -rn`)
- [ ] Data setup/teardown handled in dedicated `DataSetup` classes and `@After` hooks
- [ ] `@manual` scenarios include `# STEP N:` and `# EXPECTED:` comment lines
- [ ] `@pending` scenarios include a comment with the blocking reason
- [ ] CI workflow tag options updated if new tags introduced
- [ ] `count_scenarios_by_tags.py` target-tags list updated for new tags
