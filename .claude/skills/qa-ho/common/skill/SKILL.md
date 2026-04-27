---
name: qa_common
description: "Universal auto-routing entry point — paste any input (cURL, PR, user story, PRD, HTML, Appium XML, VD request) and this skill auto-detects required layer(s) and invokes the correct individual skill(s)."
version: 1.0.0
type: common-router
repos: [crest, celium, pixify, appium]
invokes:
  - qa/api/skill/SKILL.md
  - qa/ui/skill/SKILL.md
  - qa/app/skill/SKILL.md
  - qa/vd/skill/SKILL.md
  - qa/common/skill/test_case_creation.skill.md
  - qa/common/skill/step_reuse.skill.md
  - qa/common/skill/document_driven_test_generation.skill.md
  - qa/common/skill/test_execution_and_fix.skill.md
---

# QA Common Skill — Universal Auto-Routing Entry Point

## When to Use This vs Individual Skills

| Use this common skill when... | Use individual skill directly when... |
|-------------------------------|--------------------------------------|
| Input is any format and you want full coverage | You already know exactly which layer you need |
| You want Claude to decide the layers automatically | You are writing API-only, UI-only, or Mobile-only |
| Feature spans multiple layers (API + UI + VD etc.) | You want to fix a failing test only |
| You have a PRD / cURL / PR and want everything generated | You only need locators from HTML |

---

## Practical Usage — Real Examples

Each example below shows exactly what to type in Claude, what gets auto-detected, and what gets generated.

---

### Example 1 — cURL → API Test (Auto-detected: API)

**What you type in Claude:**

```
You are a senior QA automation engineer for Headout.
Load this common skill: qa/common/skill/SKILL.md
Follow without exception: qa/common/agent/_PRAETORIAN_CONSTITUTION.md

INPUT

curl -X GET 'https://api.test-headout.com/api/v2/experiences?cityCode=NYC&currency=USD&page=0&limit=10' \
  -H 'Authorization: Bearer TOKEN'

# Sample response:
{
  "data": {
    "items": [
      { "id": 101, "title": "Statue of Liberty Tour", "price": 29.99, "currency": "USD" }
    ],
    "totalCount": 120,
    "page": 0,
    "limit": 10
  }
}
```

**What Claude auto-detects:**
```
Input type  : cURL
Layer(s)    : API (crest)
Skill loaded: qa/api/skill/SKILL.md + document_driven_test_generation.skill.md
              + test_case_creation.skill.md + step_reuse.skill.md
```

**What gets generated:**
```
src/test/resources/ResponseSchema/Experiences.json
  └─ JSON Schema with: items[].id (integer), items[].title (string),
     items[].price (number), totalCount (integer), page (integer)

URLBuilders entry:
  endpointMap.put("experiences-list-v2", baseUrl + "/api/v2/experiences")

ExperiencesUtility.java
  └─ buildListRequest(cityCode, currency, page, limit)
     assertExperienceFields(id, title, price, currency)
     assertPagination(page, limit, totalCount)

ExperiencesStepDef.java
  └─ @Given user requests experiences for city {string} with currency {string}
     @When user sends GET experiences request
     @Then response should contain {int} items on page {int}
     @Then each item should have id title price and currency fields
     @Then schema should match ResponseSchema/Experiences.json

experiences-list.feature
  ├─ Scenario: Get experiences for valid city (positive)
  ├─ Scenario Outline: Invalid city codes return 404 (negative — 3 rows)
  ├─ Scenario: Page 0 returns first 10 items (boundary)
  ├─ Scenario: Limit=1 returns exactly 1 item (edge)
  ├─ Scenario: Response schema validation (schema)
  ├─ @manual: Verify items are sorted by relevance (manual)
  └─ @pending: Test with 0 results city — no test data (pending)
```

---

### Example 2 — User Story → UI + Mobile (Auto-detected: UI + Mobile)

**What you type in Claude:**

```
You are a senior QA automation engineer for Headout.
Load this common skill: qa/common/skill/SKILL.md
Follow without exception: qa/common/agent/_PRAETORIAN_CONSTITUTION.md

INPUT

As a traveller, I want to save an experience to my wishlist by tapping the
heart icon, so that I can revisit it later.

Rules:
- Heart icon appears on every experience card
- Filled heart = saved, empty heart = not saved
- Tapping toggles the saved state
- Guest users are redirected to the login screen
- Saved count shown on the wishlist tab badge
```

**What Claude auto-detects:**
```
Input type  : user-story (no API contract found)
Layer(s)    : UI (celium) + Mobile (appium)
Skill loaded: qa/ui/skill/SKILL.md + qa/ui/agent/locator_generate_agent.md
              + qa/app/skill/SKILL.md + qa/app/agent/locator_generate_agent.md
              + test_case_creation.skill.md + step_reuse.skill.md
```

**What gets generated:**

UI (celium):
```
WishlistPO.java
  └─ ByBuilder icnHeart     = ByBuilder.xpath("//*[@data-qa-marker='wishlist-heart-btn']")
     ByBuilder icnHeartFilled = ByBuilder.xpath("//*[@data-qa-marker='wishlist-heart-filled']")
     ByBuilder badgeWishlist = ByBuilder.xpath("//*[@data-qa-marker='wishlist-tab-badge']")
     void tapHeartIcon()
     boolean isWishlisted()
     String getWishlistBadgeCount()

WishlistStepDef.java (plain class, no base)
  └─ @When user taps heart icon on experience card
     @Then heart icon should be filled
     @Then wishlist badge count should be {string}

wishlist-ui.feature
  ├─ Scenario: Save experience → heart becomes filled (positive)
  ├─ Scenario: Unsave experience → heart becomes empty (positive)
  ├─ Scenario: Guest user taps heart → redirected to login (negative)
  ├─ Scenario: Badge count increments after save (positive)
  ├─ @manual: Heart animation plays on tap (manual)
  └─ @pending: Test wishlist persistence after app restart (pending)
```

Mobile (appium):
```
WishlistAppPO.java (no base class)
  └─ ByBuilder icnHeart = ByBuilder.xpath(
       "//*[@resource-id='qaid-wishlist-heart-btn']",
       "//*[@name='qaid-wishlist-heart-btn']",
       "Heart icon Android", "Heart icon iOS")
     void tapHeart()
     boolean isWishlisted()

WishlistAppStepDef.java (extends base.be.BaseAutomation)
  └─ @When user taps the heart icon on the app
     @Then the heart icon should appear filled on app

wishlist-app.feature
  ├─ Scenario: Save on Android → heart filled (positive)
  ├─ Scenario: Save on iOS → heart filled (positive)
  ├─ Scenario: Guest tap → login screen appears (negative)
  └─ @manual: Badge count animation on wishlist tab (manual)
```

---

### Example 3 — Notion PRD → API + UI + VD (Auto-detected: API + UI + VD)

**What you type in Claude:**

```
You are a senior QA automation engineer for Headout.
Load this common skill: qa/common/skill/SKILL.md
Follow without exception: qa/common/agent/_PRAETORIAN_CONSTITUTION.md

INPUT

== NOTION PRD ==
Feature: New "Top Picks" section on headout.com homepage
Owner: @pm-rakesh
Status: Dev-ready

Acceptance Criteria:
AC-1: Homepage shows a "Top Picks" section with up to 6 experience cards
AC-2: Cards show: image, title, price, rating
AC-3: Section only visible when GET /api/v2/discovery/top-picks returns results
AC-4: Empty response → section hidden, no error shown
AC-5: Clicking a card opens the experience detail page

API:
  GET /api/v2/discovery/top-picks?cityCode={cityCode}&currency={currency}
  Response 200: { items: [{ id, title, price, currency, rating, imageUrl }] }
  Response 204: (no content — section hidden)

Design:
  Figma shows new card layout — needs visual regression coverage
  Pod: discovery
  Pages: homepage (with top-picks section visible)
```

**What Claude auto-detects:**
```
Input type  : prd-doc (Acceptance Criteria + API contract + Design/visual section)
Layer(s)    : API (crest) + UI (celium) + Visual Diff (pixify (VD))
Skill loaded: qa/api/skill/SKILL.md + qa/ui/skill/SKILL.md
              + qa/vd/skill/SKILL.md + document_driven_test_generation.skill.md
              + test_case_creation.skill.md + step_reuse.skill.md
```

**Test Case Matrix Claude produces (before any code):**

| # | Scenario | Type | Layer | Auto | Tag |
|---|----------|------|-------|------|-----|
| 1 | Valid cityCode → 6 items returned | Positive | API | Yes | @test |
| 2 | cityCode with no picks → 204 | Negative | API | Yes | @test |
| 3 | Response schema: items[].id/title/price/rating/imageUrl | Schema | API | Yes | @test |
| 4 | AC-1: Top Picks section visible with ≤6 cards | Positive | UI | Yes | @test |
| 5 | AC-4: Section hidden when API returns empty | Negative | UI | Yes | @test |
| 6 | AC-5: Card click opens detail page | Positive | UI | Yes | @test |
| 7 | AC-2: Each card shows image, title, price, rating | Positive | UI | Yes | @test |
| 8 | Visual regression: homepage with top-picks section | Schema | VD | Yes | @visual-diff |
| 9 | Verify card image loads within 2s | Manual | UI | No | @manual |
| 10 | Geolocation-based city auto-detection | Pending | API | No | @pending |

**What gets generated (API + UI + VD code for all layers)**

---

### Example 4 — HTML Snippet → Locators + UI Test (Auto-detected: UI)

**What you type in Claude:**

```
You are a senior QA automation engineer for Headout.
Load this common skill: qa/common/skill/SKILL.md
Follow without exception: qa/common/agent/_PRAETORIAN_CONSTITUTION.md

INPUT

<div class="checkout-summary">
  <input data-qa-marker="promo-input" type="text" placeholder="Enter promo code" />
  <button data-qa-marker="apply-promo-btn" aria-label="Apply promo code">Apply</button>
  <span data-qa-marker="promo-success-msg" class="success">Promo applied!</span>
  <span data-qa-marker="promo-error-msg" class="error" style="display:none">Invalid code</span>
  <p data-qa-marker="discount-value">-$10.00</p>
</div>
```

**What Claude auto-detects:**
```
Input type  : html-snippet (data-qa-marker attributes found)
Layer(s)    : UI (celium)
Skill loaded: qa/ui/skill/SKILL.md + locator_generate_agent.md
              + test_case_creation.skill.md
```

**ByBuilder fields generated (data-qa-marker — tier 1 priority):**

```java
private final ByBuilder inputPromoCode =
    ByBuilder.xpath("//*[@data-qa-marker='promo-input']");

private final ByBuilder btnApplyPromo =
    ByBuilder.xpath("//*[@data-qa-marker='apply-promo-btn']");

private final ByBuilder txtPromoSuccess =
    ByBuilder.xpath("//*[@data-qa-marker='promo-success-msg']");

private final ByBuilder txtPromoError =
    ByBuilder.xpath("//*[@data-qa-marker='promo-error-msg']");

private final ByBuilder txtDiscountValue =
    ByBuilder.xpath("//*[@data-qa-marker='discount-value']");
```

**What gets generated:**
```
CheckoutPromoPO.java         — ByBuilder fields + enterPromoCode() + applyPromo()
                               + getSuccessMessage() + getErrorMessage() + getDiscountValue()
CheckoutPromoStepDef.java    — @When / @Then steps referencing the PO
checkout-promo-ui.feature    — positive + negative + edge + @manual (animation)
```

---

### Example 5 — Full E2E: dev-pr → API + UI + Mobile (Auto-detected: All 3)

**What you type in Claude:**

```
You are a senior QA automation engineer for Headout.
Load this common skill: qa/common/skill/SKILL.md
Follow without exception: qa/common/agent/_PRAETORIAN_CONSTITUTION.md

INPUT

PR Title: feat(booking): add group booking support
Changes:
  Backend (crest):
    - New endpoint POST /api/v2/booking/group-create
    - Request: { variantId, quantity (5-50), contactName, contactEmail, currency }
    - Response 200: { bookingId, groupCode, totalAmount, discountPercent }
    - Errors: INVALID_QUANTITY | INVALID_EMAIL | NOT_GROUP_ELIGIBLE
  Frontend (celium):
    - New "Group Booking" button on product page (data-qa-marker="group-booking-btn")
    - Quantity selector limited to 5-50 for group flow
    - Contact details form: name + email fields
  Mobile (appium):
    - Same flow, button has qaid-group-booking-btn
    - Native form for contact details
```

**What Claude auto-detects:**
```
Input type  : dev-pr (full-stack — backend + frontend + mobile changes detected)
Layer(s)    : API (crest) + UI (celium) + Mobile (appium)
Skill loaded: qa/api/skill/SKILL.md + qa/ui/skill/SKILL.md
              + qa/app/skill/SKILL.md + document_driven_test_generation.skill.md
              + test_case_creation.skill.md + step_reuse.skill.md
```

**What gets generated — all three layers in one response:**

API (crest):
```
GroupBookingSchema.json
URLBuilders: "group-booking-create-v2"
GroupBookingUtility.java  — buildGroupRequest(), assertGroupBookingResponse(), assertGroupError()
GroupBookingStepDef.java
group-booking-api.feature — quantity 5/10/50 (positive), 4/51/0/-1 (negative),
                            INVALID_EMAIL, NOT_GROUP_ELIGIBLE, schema validation
```

UI (celium):
```
GroupBookingPO.java       — btnGroupBooking, inputQuantity, inputContactName,
                            inputContactEmail, btnConfirmGroup
GroupBookingStepDef.java
group-booking-ui.feature  — open group flow, fill form, submit, error states
```

Mobile (appium):
```
GroupBookingAppPO.java    — dual-platform ByBuilder (qaid-group-booking-btn etc.)
GroupBookingAppStepDef.java
group-booking-app.feature — Android + iOS coverage
```

---

## How It Works

```
Any Input (cURL / PR / story / PRD / HTML / XML / VD request)
                        │
                        ▼
              ┌─────────────────────┐
              │  AUTO-DETECT PHASE  │
              │  classify input     │
              │  assign layer(s)    │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │     PLAN PHASE      │
              │  build test plan    │
              │  list files needed  │
              └──────────┬──────────┘
                         │
              ┌──────────┼──────────┐──────────┐
              ▼          ▼          ▼          ▼
        API skill   UI skill  Mobile skill  VD skill
        (crest)    (celium)   (appium)     (celium)
              └──────────┴──────────┘──────────┘
                              │
                              ▼
                       Generated Files
                       + Final Report
```

---

## The Common Prompt (Copy and Use This)

```
You are a senior QA automation engineer for Headout.

Load this common skill: qa/common/skill/SKILL.md
Follow without exception: qa/common/agent/_PRAETORIAN_CONSTITUTION.md

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INPUT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[PASTE ANY OF THE FOLLOWING — Claude auto-detects the rest]
  • cURL command + sample response
  • GitHub PR URL or description with changed files
  • Notion / Google Doc content (PRD, ERD, acceptance criteria)
  • User story in plain English
  • Screen description or raw HTML snippet
  • Appium page source / XML dump
  • VD request (URL + pod + page + browser + language)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TARGET (leave blank for full auto-detect)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  [x] Auto-detect layers from input     ← default
  [ ] API only (crest)
  [ ] UI only (celium)
  [ ] Mobile only (appium)
  [ ] VD only (celium)
  [ ] API + UI
  [ ] API + UI + Mobile
  [ ] API + UI + VD
  [ ] All layers (API + UI + Mobile + VD)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Auto-Detection Rules

### Step A — Classify Input Type

| Signal found in the input | Detected input type |
|--------------------------|-------------------|
| `curl -X` or HTTP method + URL + `-d '{...}'` | cURL |
| `github.com/.*/pull/` or `PR Title:` + `Changes:` | dev-pr |
| `Acceptance Criteria` / `AC-N:` / `Notion` / `PRD` / `ERD` | prd-doc |
| `As a ... I want ... so that` | user-story |
| `<html` / `data-qa-marker=` / `data-testid=` / `aria-label=` | html-snippet |
| `<hierarchy` / `resource-id=` / `XCUIElementType` | appium-xml |
| `microbrand:` / `slug:` / `pod:` / visual diff / VD | vd-request |

### Step B — Assign Layer(s) from Input Type

| Input type detected | Layers auto-assigned |
|--------------------|---------------------|
| cURL + response body | **API** |
| HTML snippet | **UI** |
| Appium XML | **Mobile** |
| VD request | **Visual Diff** |
| User story (no API contract) | **UI + Mobile** |
| User story (with API contract section) | **API + UI + Mobile** |
| dev-pr (backend diff only) | **API** |
| dev-pr (frontend diff only) | **UI + Mobile** |
| dev-pr (full-stack diff) | **API + UI + Mobile** |
| PRD doc with API contract | **API + UI + Mobile** |
| PRD doc with visual/design section | **API + UI + VD** |
| PRD doc with API + design + mobile | **API + UI + Mobile + VD** |

### Step C — Route to Skills

| Layer assigned | Input type | Individual skill(s) loaded |
|---------------|-----------|--------------------------|
| API | any | `qa/api/skill/SKILL.md` + `document_driven_test_generation.skill.md` |
| UI | HTML snippet | `qa/ui/skill/SKILL.md` + `qa/ui/agent/locator_generate_agent.md` |
| UI | live URL | `qa/ui/skill/SKILL.md` + `qa/ui/agent/playwright_discovery_agent.md` |
| Mobile | Appium XML | `qa/app/skill/SKILL.md` + `qa/app/agent/locator_generate_agent.md` |
| Visual Diff | HTML snippet | `qa/vd/skill/SKILL.md` + `qa/vd/agent/vd_test_agent.md` + `qa/vd/agent/locator_generate_agent.md` |
| Visual Diff | live URL + pod | `qa/vd/skill/SKILL.md` + `qa/vd/agent/playwright_discovery_agent.md` |
| Any combination | — | `test_case_creation.skill.md` + `step_reuse.skill.md` always loaded |

---

## Execution Protocol

### 0 — MANDATORY BRANCH GATE (Before ANY File is Written)

**CRITICAL:** Before creating any `.feature`, `.java`, `.json`, or config file, the agent
MUST create and switch to a dedicated feature branch. Writing directly to `main` or an
unrelated branch is a HARD VIOLATION.

```bash
# In the relevant repo root (crest / celium / appium / pixify)
git checkout main && git pull origin main

# Create the feature branch
git checkout -b qa/<domain>/<feature-name>-<layer>
# Examples:
#   qa/booking/booking-create-api
#   qa/inventory/inventory-discount-ui
#   qa/refund/refund-calculation-app

# If branch already exists — switch and pull:
# git checkout qa/<domain>/<feature-name>-<layer>
# git pull origin qa/<domain>/<feature-name>-<layer>
```

Show the user a confirmation before continuing:
```
✓ Branch: qa/<domain>/<feature-name>-<layer>
  All generated files will be written to this branch only.
```

**Only after branch confirmation** → proceed to Phase 1 scan.

---

### 1 — Pre-task Scan (Always — Before Any Code)

```bash
grep -rn "keyword" src/test/java/com/headout/stepdefinitions/
grep -rn "keyword" src/test/java/com/headout/pageobjects/
grep -rn "keyword" src/test/java/com/headout/features/
```

Reference `qa/common/skill/step_reuse.skill.md` for full reuse protocol.

---

### 2 — Test Case Matrix (Always — Before Any Code)

Build the full matrix before writing a single line of code.
**ALL 24 categories are MANDATORY for every feature — no category may be silently skipped.**

Anti-hallucination rule: if a category has 0 automatable scenarios →
write it as `@manual` or `@pending` with `# BLOCKED:` comment. Never omit it.

| # | Category | Type | Layer | Default Output | Tag |
|---|----------|------|-------|----------------|-----|
| 2.1 | Happy path — main success flow per user type | **Positive (Happy Path)** | API/UI/App | Automated | @test @test-sanity |
| 2.2 | Same flow with optional params / alt user roles | **Positive (Alt Paths)** | API/UI/App | Automated | @test |
| 2.3 | Invalid input → each distinct error code/message | **Negative** | API/UI/App | Automated | @test @test-regression |
| 2.4 | Required field empty/null; format wrong; wrong type | **Validation** | API/UI/App | Automated | @test @test-regression |
| 2.5 | null/empty/Unicode/whitespace/special chars | **Edge Cases** | API/UI/App | Automated | @test @test-regression |
| 2.6 | min, max, min-1, max+1 per numeric/length field | **Boundary Values** | API/UI/App | Automated | @test @test-regression |
| 2.7 | Multi-param combos (pairwise): param A × param B | **Combination/Pairwise** | API/UI/App | Automated | @test |
| 2.8 | Entity lifecycle: PENDING→CONFIRMED→CANCELLED | **State Transition** | API/UI/App | Automated | @test @test-regression |
| 2.9 | JSON schema matches ResponseSchema/*.json | **Schema/Contract** | API | Automated | @test @ode-regression |
| 2.10 | Unauthenticated, wrong role, IDOR, injection | **Security/Auth** | API/UI/App | Automated | @test @test-regression |
| 2.11 | GET/POST called twice — same result, no duplicate | **Idempotency** | API | Automated | @test |
| 2.12 | Flow spanning 2+ services (API→UI, crest→calipso) | **Cross-service** | API+UI | Automated | @test |
| 2.13 | Full user journey through 2+ features end-to-end | **E2E Journey** | API+UI+App | Automated | @test-headout-e2e-flow |
| 2.14 | Response time ≤ SLA on critical paths | **Performance Baseline** | API | @manual | @manual |
| 2.15 | Multi-currency, multi-language, locale, timezone | **Localisation/i18n** | API/UI/App | Automated | @test @test-regression |
| 2.16 | Parallel/simultaneous calls — race condition | **Concurrency** | API | @manual | @manual |
| 2.17 | PII masked, GDPR, sensitive data not exposed | **Data Sensitivity/PII** | API/UI | Automated | @test @test-regression |
| 2.18 | Old clients / prior API version still works | **Compatibility/Version** | API | Automated | @test @ode-regression |
| 2.19 | Design/animation/visual/timing/hardware | **Manual** | UI/App | @manual | @manual |
| 2.20 | Designed but blocked (WIP/no-locator/unreleased) | **Pending** | Any | @pending | @pending |
| 2.21 | Scenario under refactor / new API version | **Revamp** | Any | Automated | @revamp |
| 2.22 | Valid/invalid input classes; decision tables; use-case | **Black Box** | API/UI/App | Automated | @test @black-box @test-regression |
| 2.23 | Branch/path/condition coverage; internal state; exception paths | **White Box** | API | Automated + @manual JaCoCo check | @test @white-box @test-regression |
| 2.24 | Charter-based session testing; "what-if" chaining; unscripted flows | **Exploratory** | API/UI/App | @manual always | @manual @exploratory |

**Enforcement — after producing the matrix, verify:**
```
For each of the 24 rows above:
  IF automatable rows = 0 AND @manual rows = 0 AND @pending rows = 0
    → STOP. Add a @pending entry for this category before writing any code.
    → @pending Scenario: [2.X category] coverage — blocked
    → # BLOCKED: <reason>

Never proceed to Phase 3 (code generation) until all 24 rows are filled.
```

---

### 3 — File Generation Order Per Layer

#### API (crest)
```
1. ResponseSchema JSON    → src/test/resources/ResponseSchema/<Name>.json
2. URLBuilders entry      → endpointMap.put("feature-v2", baseUrl + "/path")
3. <Name>Utility.java     → request builder + assertion helpers
4. <Name>StepDef.java     → extends BaseAutomation, ThreadLocal pattern
5. <name>.feature         → all automatable scenarios
```

#### Web UI (celium)
```
1. <Name>PO.java          → extends BaseAutomation, ByBuilder instance fields
2. <Name>StepDef.java     → plain class, NO base class extension
3. <name>-ui.feature      → all UI scenarios
```

#### Mobile App (appium)
```
1. <Name>AppPO.java       → NO base class, dual-platform ByBuilder (qaid-*)
2. <Name>AppStepDef.java  → extends base.be.BaseAutomation
3. <name>-app.feature     → Android + iOS scenarios
```

#### Visual Diff (pixify (VD))
```
1. upload-snapshot-chrome-on-s3.json   → new MB_REQEUST-N entry
2. upload-snapshot-firefox-on-s3.json  → same, FIREFOX browserType
3. visual-diff-action.json             → STOP_ALL_PLAY + DOM_DELETE + custom
4. visual-diff-version-1.json          → S3 placeholder entry
5. <slug>-visual-diff.feature          → comparison scenario
6. Snapshot feature update             → new MB_REQEUST-N row
```

---

### 4 — Layer Rules (Enforced for All Generated Code)

**API (crest)**
- StepDef + Utility extend `com.headout.base.be.BaseAutomation`
- URLBuilders: `endpointMap.put("key-v2", baseUrl + "/path")` — no static constants
- Request: `request.get().endpoint().queryParams().header().body().build()`
- Execute: `response.set(requestMethod.post/get/put/delete(request.get().build()))`
- **MANDATORY**: `softAssertionUtil.get().assertAll()` at end of every `@Then`
- Logging: `TestNGLogUtility.info()` — never `System.out.println()`
- Config: `PropertyUtils.get(ConfigMap.*)` — never hardcode values

**Web UI (celium)**
- Page Objects extend `com.headout.base.fe.BaseAutomation`
- **StepDefs: plain class — no base class extension**
- Locators: `private final ByBuilder` instance fields — priority: `data-qa-marker` > `aria-label` > `data-testid` > stable `id` > CSS
- `wait.waitForVisibilityOfElement(locator)` before reads
- `wait.waitForElementToBeClickable(locator)` before clicks
- **Never `Thread.sleep()`**, never `By.*`, never locators in StepDef

**Mobile App (appium)**
- AppPO: no base class. AppStepDef: extends `base.be.BaseAutomation`
- Locators: dual-platform `ByBuilder.xpath(androidXpath, iOSXpath, desc1, desc2)`
  - Android: `//*[@resource-id='qaid-<name>']`
  - iOS: `//*[@name='qaid-<name>']`
- **MANDATORY**: `wait.app().isDisplayed(locator, 35)` before every interaction

**Visual Diff (pixify (VD))**
- Pod `platform` → MB microbrands; Pod `discovery` → headout.com pages
- **Always before capture**: `STOP_ALL_PLAY` → `SCROLL_DOWN_PAGE` → `DOM_DELETE`
- Default capture: `FULL_PAGE_SCREENSHOT`
- Tags: `@visual-diff @mb-visual-diff-sanity @mb-visual-diff-regression @dweb`

---

### 5 — Gherkin Rules (All Layers)

- `Scenario Outline` + `Examples` for 2+ scenarios with identical steps and different data
- Minimum tags: `@headout @<domain> @test @test-regression @test-sanity`
- `@manual` must include `# STEP N:` and `# EXPECTED:` comment lines
- `@pending` must include a comment with the blocking reason
- No hardcoded URLs, IDs, prices, or credentials in step text

---

### 6 — Generation Report (Produced Before Moving to Step 7)

```
## QA Generation Report

### Source
[input type] — [one-line summary]

### Auto-Detected Layers
[API | UI | Mobile | VD — which were auto-detected vs manually specified]

### Skills Invoked
[list of skill files used]

### Test Case Matrix
[full table from step 2 — every category row filled]

### Generated Files
[full path for every file produced, one per line]

### @manual Cases
[full Gherkin with # PRE-CONDITION, # STEP N:, # EXPECTED: comment lines]

### @pending Cases
[list with # BLOCKED: reason per case]

### Gaps / Clarifications Needed
[anything ambiguous or requiring dev/PM input before tests can pass]
```

---

### 7 — Test Execution and Auto-Fix (After Code Generation(Mandatory))

After all files are generated, **immediately** load and follow
`qa/common/skill/test_execution_and_fix.skill.md` to:

1. Compile the project:
   ```bash
   mvn --global-settings settings.xml clean compile -q
   ```
   Fix any compilation errors before proceeding.

2. Run only the newly generated scenarios using their unique tag:
   ```bash
   # API (crest)
   mvn test -Dcucumber.filter.tags="@<new-feature-tag>" -DthreadCount=3

   # UI (celium)
   mvn test -Dcucumber.filter.tags="@<new-feature-tag>" -DBROWSER=chrome

   # Mobile (appium)
   mvn test -Dcucumber.filter.tags="@<new-feature-tag>" -DDEVICE_TYPE=android
   ```

3. Parse the Surefire/Cucumber report for failures:
   ```bash
   cat target/surefire-reports/*.txt | grep -E "FAILED|ERROR|Tests run"
   ```

4. For each failure — classify and fix following `test_execution_and_fix.skill.md`:

   | Failure class | Fix |
   |--------------|-----|
   | `StepDefinitionAmbiguity` | Rename conflicting `@Given/@When/@Then` regex |
   | `UndefinedStep` | Implement missing step or reuse existing one |
   | `NoSuchElementException` | Correct `ByBuilder` locator / add explicit wait |
   | `AssertionError` | Fix assertion value or step definition logic |
   | `NullPointerException` | Add null guard in Utility / check ThreadLocal init |
   | Compilation error | Fix import, type mismatch, or missing class |

5. Re-run after each fix until **all generated scenarios pass**.

6. Update `@pending` scenarios: if a scenario passes, remove `@pending` and add correct env tag.

---

### 8 — Automatic PR Creation (After All Tests Pass)

Once Step 7 completes with zero failures, create a PR automatically:

#### 8.1 — Stage and Commit All Generated Files

```bash
git add src/test/java/com/headout/features/<domain>/
git add src/test/java/com/headout/stepdefinitions/
git add src/test/java/com/headout/pageobjects/       # UI / App
git add src/test/java/com/headout/utility/           # API
git add src/test/resources/ResponseSchema/            # API schemas
git add src/test/resources/vd/                        # VD configs (if VD layer)

git commit -m "$(cat <<'EOF'
test(<domain>): add <feature-name> automation — <layer(s)>

Generated by qa/common/skill/SKILL.md

Layers: <API | UI | Mobile | VD>
Input:  <input type — one-line summary>

Test case coverage:
  - Positive (happy path + alt paths): <N> scenarios
  - Negative: <N> scenarios
  - Validation: <N> scenarios
  - Boundary: <N> scenarios
  - Edge: <N> scenarios
  - Combination/Pairwise: <N> scenarios
  - State Transition: <N> scenarios
  - Schema/Contract: <N> scenarios
  - Security/Auth: <N> scenarios
  - Idempotency: <N> scenarios
  - Cross-service: <N> scenarios
  - E2E Journey: <N> scenarios
  - @manual: <N> scenarios
  - @pending: <N> scenarios (blocked — see comments)

Files added:
  <list every generated file path>
EOF
)"
```

#### 8.2 — Push and Create PR

```bash
# Push to a feature branch named after the domain/feature
git push origin HEAD:qa/<domain>/<feature-name>-automation
```

PR title format:
```
test(<domain>): <feature-name> — <layer(s)> automation [<N> scenarios]
```

PR body template:
```markdown
## QA Automation — <Feature Name>

**Input:** <input type + one-line summary>
**Layers:** <API | UI | Mobile | VD>
**Generated by:** `qa/common/skill/SKILL.md`

### Test Coverage

| Category | Count | Status |
|----------|-------|--------|
| Positive (Happy Path + Alt) | N | ✅ Pass |
| Negative | N | ✅ Pass |
| Validation | N | ✅ Pass |
| Boundary | N | ✅ Pass |
| Edge | N | ✅ Pass |
| Combination / Pairwise | N | ✅ Pass |
| State Transition | N | ✅ Pass |
| Schema / Contract | N | ✅ Pass |
| Security / Auth | N | ✅ Pass |
| Idempotency | N | ✅ Pass |
| Cross-service | N | ✅ Pass |
| E2E Journey | N | ✅ Pass |
| @manual | N | 🔵 Manual |
| @pending | N | 🟡 Blocked |
| **Total** | **N** | |

### Generated Files

```
<list all generated files with their paths>
```

### @manual Scenarios (for human tester)

<paste all @manual scenarios with STEP N / EXPECTED lines>

### @pending Blocking Reasons

<one line per @pending with the BLOCKED: reason>

### CI Tags Used

`@<new-feature-tag>` `@test-regression` `@<domain>`
```

#### 8.3 — PR Rules

- **One PR per feature** — do not mix multiple unrelated features in one PR
- **Title must start with `test(`** — not `feat(` or `fix(`
- **Never push directly to `main`** — always use a feature branch
- **PR description must include the Test Coverage table** from 8.2 above
- **Link PR to the source** (GitHub PR / Jira / Notion) in the PR body
- If any `@pending` scenarios exist, add the `blocked` label to the PR

---

## Quick Reference — Individual Skill Files

| Task | Direct skill to use |
|------|-------------------|
| API test from cURL | `qa/api/skill/SKILL.md` |
| UI test from screen | `qa/ui/skill/SKILL.md` |
| Mobile test | `qa/app/skill/SKILL.md` |
| VD test | `qa/vd/skill/SKILL.md` |
| Design test cases (no code yet) | `qa/common/skill/test_case_creation.skill.md` |
| Tests from PRD / Notion / Google Doc | `qa/common/skill/document_driven_test_generation.skill.md` |
| Check step / PO exists before creating | `qa/common/skill/step_reuse.skill.md` |
| Run tests and fix failures | `qa/common/skill/test_execution_and_fix.skill.md` |
| Generate ByBuilder locators from HTML snippet (UI) | `qa/ui/agent/locator_generate_agent.md` |
| Generate ByBuilder locators from Appium XML (App) | `qa/app/agent/locator_generate_agent.md` |
| Generate ByBuilder locators from HTML snippet (VD) | `qa/vd/agent/locator_generate_agent.md` |
| Live URL → full UI test (PO + StepDef + Feature) via Playwright MCP | `qa/ui/agent/playwright_discovery_agent.md` |
| Live URL + pod → VD config + assertions via Playwright MCP | `qa/vd/agent/playwright_discovery_agent.md` |
| Fix a broken or flaky test | `qa/common/agent/remediator_agent.md` |
| Design test structure from requirements | `qa/common/agent/architect_agent.md` |
