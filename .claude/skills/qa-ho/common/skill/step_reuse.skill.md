---
name: step_reuse
description: "Zero-duplication search protocol + complete test case validation for crest/celium/pixify/appium — grep stepdefinitions, pageobjects, and utilities before writing any new step, method, or PO; validate test assertions against PRD (highest authority), ERD, API GET response, and PR diff before finalising; classify test type (sanity/smoke/regression/edge/integration/service/modular/black-box/white-box/exploratory); validate all HTTP methods (GET/POST/PUT/PATCH/DELETE) from live, PR DTO, or ERD; build request bodies from PR annotations or ERD constraints; reuse first, create last. Multi-param rule: use userSetQueryParameters / userSetHeaderParameters / body-slash-path patterns; if > 10 key-value pairs create a utility method and persist via Add Data key step. Black-box: equivalence partitioning + decision tables using @black-box tag. White-box: branch/path/condition/exception coverage using @white-box tag. Exploratory: charter-based @manual scenarios with CHARTER/TARGET/DURATION header using @exploratory tag."
version: 4.2.0
testingTypes: [API, E2E, Mobile, VisualDiff, Integration, Edge, Modular, BlackBox, WhiteBox, Exploratory]
frameworks: [Cucumber, RestAssured, Selenium, Playwright, Appium]
languages: [Java]
agents: [claude-code, cursor, copilot, windsurf]
repos: [crest, celium, pixify, appium]
---

# Step Discovery and Reuse Skill

## Core Rule

**Before writing any new step, class, or method — SEARCH FIRST.**

A step that already exists must NEVER be duplicated.
A Page Object method that already exists must NEVER be reimplemented.
A utility method that already exists must NEVER be rewritten.

---

## Search Protocol — Run Before Writing Anything

### Step 1 — Scan All Existing Step Definitions

```bash
# Find all step def files in the repo
find src/test/java/com/headout/stepdefinitions -name "*.java"

# Search for a specific step text (use partial keywords)
grep -rn "User set.*Api endpoint\|User sends the.*request\|Verify.*status code" \
  src/test/java/com/headout/stepdefinitions/

# Search across all feature files for existing step usage
grep -rn "User create new booking\|Get all booking details\|User get login" \
  src/test/java/com/headout/features/
```

### Step 2 — Scan Shared/Common Files First

Every repo has a `CommonStepDef.java` and `CommonApiUtility.java` with broadly
reusable steps and utilities. CHECK THESE BEFORE ANYTHING ELSE:

| Repo | Shared Step File | Shared Utility | Shared PO |
|------|-----------------|----------------|-----------|
| crest | `stepdefinitions/CommonStepDef.java` | `api/CommonApiUtility.java` | — |
| celium | `stepdefinitions/CommonStepDef.java` | `utility/CommonApiUtility.java` | `pageobjects/ui/CommonPO.java` |
| appium | `stepdefinitions/CommonStepDef.java` | `utility/CommonApiUtility.java` | `pages/CommonPO.java` |

### Step 3 — Check Domain Utility / Page Object

Before creating a new `<Service>Utility` or `<Page>PO`:
```bash
# crest: check existing utilities
find src/test/java/com/headout/api -name "*.java"

# celium: check existing page objects
find src/test/java/com/headout/pageobjects -name "*.java"

# appium: check existing page objects
find src/test/java/com/headout/pages -name "*.java"
```

---

## CREST — API Step Reuse

### Already-Available Steps in `CommonStepDef.java`

```gherkin
# Endpoint and method setup
Given User set "{module}" and "{repo}" Api endpoint
When  User sends the get request
When  User sends the post request
When  User sends the put request
When  User sends the delete request
When  User sends the patch request

# Query parameters — single or repeated per parameter
And User set query parameters "{key}" and "{value}" for api

# Headers — single or repeated per header
And User set header parameters "{headerKey}" and "{headerValue}" for api
And User set authentication for api module "{moduleName}"
And Add Authorization Header for Aries Api
And User set request headers

# Body — single field
And User set body parameters "{key}" and "{value}" for api
# Body — slash-delimited multi-field: keys "a/b/c" and values "v1/v2/v3"
And User set body "{slashDelimitedKeys}" and "{slashDelimitedValues}" for api

# Thread-level data storage
And Add Data key "{parameterKey}" and value "{parameterValue}" in Properties File

# Response validation
Then Verify message "{msg}" and status code "{code}" for api
Then Verify Api Response is correct with Schema "{schemaFile}"
```

---

### Multi-Parameter Step Patterns (MANDATORY — read before writing feature files)

#### Rule: Parameterize via Scenario Outline Examples

**NEVER hardcode multiple individual steps with fixed values when params vary per test row.**
Use `<queryParamKey>` / `<queryParamValue>` placeholders from the Examples table instead.

#### A — Multiple Query Parameters

Use the single step `And User set query parameters "<queryParamKey>" and "<queryParamValue>" for api`
multiple times within a scenario, driven by Examples columns.

```gherkin

# CORRECT — parameterized, reusable across rows
@headout @bms @test @test-regression @ode-regression
Scenario Outline: Verify tour group inventory for "<tourGroupId>" in "<currency>"
Given User set "inventory-by-tgid" and "calipso" Api endpoint
And User set authentication for api module "bms"
And User set query parameters "tour-group-ids/currency/min-pax" and "<tourGroupId>/<currency>/<minPax>" for api
When User sends the get request
Then Verify message "" and status code "200" for api
Examples:
| tourGroupId | currency | minPax |
| 1234        | EUR      | 1      |
| 5678        | USD      | 2      |
   
# WRONG — hardcoded params that cannot vary per row
And User set query parameters "tour-group-ids" and "1234" for api
And User set query parameters "currency" and "EUR" for api
And User set query parameters "min-pax" and "1" for api
```

#### B — Multiple Header Parameters

Use `And User set header parameters "<headerKey>" and "<headerValue>" for api` per header.

```gherkin
# CORRECT — each header as a separate step, parameterized via Examples
And User set header parameters "X-Platform" and "<platform>" for api
And User set header parameters "Accept-Language" and "<locale>" for api
  Examples:
    | platform | locale |
    | chatbot  | en     |
    | web      | de     |
   
   or
   # CORRECT — each header as a separate step, parameterized via Examples
And User set header parameters "X-Platform/Accept-Language" and "<platform>/<locale>" for api
Examples:
| platform | locale |
| chatbot  | en     |
| web      | de     |
   
# For a static header not in Examples, use literal value
And User set header parameters "X-Platform" and "chatbot" for api
```

#### C — Body with Slash-Delimited Multi-Field Path

When the body has multiple related fields that change together per row, use the slash-path pattern:
`And User set body "{field1}/{field2}/{field3}" and "<v1>/<v2>/<v3>" for api`

```gherkin
# CORRECT — slash-delimited keys and values for a multi-field body
Scenario Outline: Verify refund creation for "<provider>"
  Given User set "refund-create-v1" and "aries" Api endpoint
  And User set authentication for api module "bms"
  And User set body "provider/bookingId/reason/amount/currencyCode" and "<provider>/<bookingId>/<reason>/<amount>/<currencyCode>" for api
  When User sends the post request
  Then Verify message "" and status code "200" for api
  Examples:
    | provider | bookingId | reason     | amount | currencyCode |
    | viator   | BK-001    | CANCELLED  | 50.00  | USD          |
    | bokun    | BK-002    | QUALITY    | 20.00  | EUR          |
```

The `CommonStepDef` implementation splits both keys and values on `/` and calls
`request.get().body(Map.of(keys[0], vals[0], keys[1], vals[1], ...))`.

#### D — Authentication

**Always** use the module-based auth step — never hardcode tokens:

```gherkin
# CORRECT
And User set authentication for api module "bms"
And User set authentication for api module "aries"
And User set authentication for api module "calipso"

# WRONG — hardcoded token
And User set header parameters "Authorization" and "Bearer eyJhbGci..." for api
```

#### E — Data Storage in Properties File

Use `And Add Data key "<parameterKey>" and value "<parameterValue>" in Properties File` to persist
values at thread level via `CrestDataHandler` for use in subsequent steps.

```gherkin
And Add Data key "bookingId" and value "<bookingId>" in Properties File
And Add Data key "variantId" and value "<variantId>" in Properties File
```

Java equivalent (called by the step):
```java
CrestDataHandler.setFieldValues(parameterKey, parameterValue);
```

#### F — >  Get Booking Id from backend api and use this for post booking flow ->

Use `Given Get publicItineraryId using booking id "<BookingID>"` to get booking id for any post booking flow and store 
values at thread level via `CrestDataHandler` for use in subsequent steps.

```gherkin
And Get publicItineraryId using booking id "BOOKING_ID"
And Get publicItineraryId using booking id "PENDING"
And Get publicItineraryId using booking id "COMPLETED"
And Get publicItineraryId using booking id "PAST_BOOKING"
```

#### G — Create new booking ID based on tour group id use below step

Use `Given User create new booking with "SINGLE_VARIANT_PRODUCT_TG_ID" from api"` to get booking id for any post booking flow and store
values at thread level via `CrestDataHandler` for use in subsequent steps.

```gherkin
Given User create new booking with "SINGLE_VARIANT_PRODUCT_TG_ID" from api"
Given User create new booking with "COMBO_SINGLE_VARIANT_PRODUCT_TG_ID" from api"
```



#### I — > 10 Parameters Rule → Utility Method

If a scenario needs **more than 10** query parameters, headers, or body fields:

**Do NOT write 10+ individual steps in the feature file.** Instead:

1. Create a dedicated method in `<Service>Utility.java`:

```java
// In BmsInventoryUtility.java
public void setInventoryRequestParams(String tourGroupId, String currency, ...) {
    request.get().queryParams("tour-group-ids", tourGroupId);
    request.get().queryParams("currency", currency);
    // ... all 10+ params
    // persist key values at thread level
    CrestDataHandler.setFieldValues("tourGroupId", tourGroupId);
    CrestDataHandler.setFieldValues("currency", currency);
    // ...
}
```

2. Call it from a single domain-specific step:

```gherkin
And User sets all BMS inventory parameters for tour group "<tourGroupId>"
```

3. In the Gherkin, use `And Add Data key "<parameterKey>" and value "<parameterValue>" in Properties File`
   for any additional values that downstream steps need to read.

```gherkin
# When > 10 params
And User sets all refund parameters for provider "<provider>" and booking "<bookingId>"
And Add Data key "refundReason" and value "<reason>" in Properties File
And Add Data key "refundAmount" and value "<amount>" in Properties File
```

#### G — Complete Example: Multiple Params + Auth + Data Storage

```gherkin
@headout @bms @test @test-regression @ode-regression
Scenario Outline: Verify refund calculation for booking "<bookingId>"
  Given User set "refund-calculate-v1" and "aries" Api endpoint
  And User set authentication for api module "bms"
  And User set header parameters "X-Platform" and "chatbot" for api
  And User set query parameters "tour-group-ids" and "<tourGroupId>" for api
  And User set query parameters "currency" and "<currency>" for api
  And User set query parameters "min-pax" and "1" for api
  And User set body "provider/bookingId/reason/amount/currencyCode" and "<provider>/<bookingId>/<reason>/<amount>/<currencyCode>" for api
  And Add Data key "bookingId" and value "<bookingId>" in Properties File
  When User sends the post request
  Then Verify message "" and status code "200" for api
  Examples:
    | tourGroupId | currency | provider | bookingId | reason    | amount | currencyCode |
    | 1234        | EUR      | viator   | BK-001    | CANCELLED | 50.00  | EUR          |
    | 5678        | USD      | bokun    | BK-002    | QUALITY   | 20.00  | USD          |
```

---

### Step Reuse — Adding New API Tests (crest)

```gherkin
# CORRECT: reuse common steps from CommonStepDef
@test @inventory
Scenario: Verify inventory API returns 200
  Given User set "inventory-v2" and "calipso" Api endpoint
  And User set authentication for api module "calipso"
  And User set query parameters "variantId" and "12345" for api
  Then Verify message "" and status code "200" for api

# WRONG: reimplementing what CommonStepDef already has
Given I call GET on "https://hardcoded-url/inventory"   # DON'T
```

### When to Create New Steps (crest)

Only create a new step in `<Domain>StepDef.java` when the operation is:
1. Domain-specific and not covered by `CommonStepDef.java`
2. Involves a `<Service>Utility` method that encapsulates business logic
3. Needs data from `CrestDataHandler` that is domain-specific

```java
// CORRECT: domain-specific step calling a utility
@Then("Verify inventory Details gets from inventories api")
public void verifyInventoryDetails() {
    TestNGLogUtility.info("Validating Response for inventories api");
    inventoryUtility.verifyInventoryDetails();
    softAssertionUtil.get().assertAll();
}

// WRONG: reimplementing what CommonStepDef.Verify message already does
@Then("Status code should be 200")
public void checkStatus() {
    Assert.assertEquals(response.get().getStatusCode(), 200); // already in CommonStepDef
}
```

---

## CELIUM — UI Step and Component Reuse

### Already-Available Steps in `CommonStepDef.java`

```gherkin
# Booking setup via API
When  User create new booking with product "{tourGroupId}" and currency "{currency}" from api
Then  User create new booking with product "{tourGroupId}" and currency "{currency}" and coupon "{coupon}" from api
Then  Get all booking details using booking id "{bookingIdType}"
Then  Get login token using secure id "{secureId}"
Then  User get login link from booking details "{secureId}"

# Navigation — from LoginStepDef
Given User opens the application "{repo}" and "{module}"
Then  User logins with "{user}"
And   verify "{user}" login sucessfully on hub

# Common UI actions — from CommonStepDef
When  User opens "{pageName}" page
```

### Shared Component Page Objects — Reuse Before Creating

```
celium/src/test/java/com/headout/pageobjects/
├── ui/
│   ├── CommonPO.java           # Product flow, checkout, booking common actions
│   ├── SharedAirportTransfersPO.java
│   └── mweb/SharedAirportTransfersMwebPO.java
├── mb/
│   ├── CommonComponentsPO.java  # Meta tags, h1/h2, canonical, FAQs, newsletter
│   └── MbLandingPageCommonPO.java
└── hub/
    ├── HomePO.java              # Hub home, sidebar, loader, experience status
    └── LoginPO.java             # Login, credentials, sidebar nav
```

### Reusing Common Components (celium)

```java
// CORRECT: reuse CommonComponentsPO for shared UI components
public class CategoryPageStepDef {

    CommonComponentsPO commonComponentsPO = new CommonComponentsPO();  // reuse
    CategoryPO categoryPO = new CategoryPO();

    @Then("Verify breadcrumbs are displayed")
    public void verifyBreadcrumbs() {
        categoryPO.verifyBreadcrumbs();
    }

    @Then("Verify newsletter subscription box heading is visible")
    public void verifyNewsletter() {
        commonComponentsPO.verifyNewsletterSection();  // already implemented
    }

    @Then("Verify page meta description is present")
    public void verifyMetaDescription() {
        commonComponentsPO.verifyMetaDescription();   // in CommonComponentsPO
    }
}
```

### DRY Rule — Shared Interactions in Common POs

When the SAME interaction appears in multiple Page Objects, extract it to
`CommonPO.java` or `CommonComponentsPO.java`:

```java
// WRONG: loader wait duplicated in every PO
public class ProductPO extends BaseAutomation {
    ByBuilder loader = ByBuilder.xpath("//div[@data-qa-marker='loader']");
    public void waitForLoader() { wait.waitForInvisibilityOfElement(35, 5, loader); }
}
public class BookingPO extends BaseAutomation {
    ByBuilder loader = ByBuilder.xpath("//div[@data-qa-marker='loader']");  // DUPLICATE
    public void waitForLoader() { wait.waitForInvisibilityOfElement(35, 5, loader); }  // DUPLICATE
}

// CORRECT: define once in HomePO/CommonPO, extend or compose
public class ProductPO extends BaseAutomation {
    HomePO homePO = new HomePO();  // or CommonPO
    public void doSomething() {
        homePO.waitForLoader();    // reuse from HomePO where headoutLoader is defined
        // ...
    }
}
```

### parameterizedLocator — Reuse Dynamic Locators

When multiple elements share a pattern (e.g., tabs, menu items, status buttons),
use ONE dynamic `ByBuilder` with `${id}` and `genericMethod.parameterizedLocator()`.

```java
// WRONG: separate locator per element
ByBuilder allTab      = ByBuilder.xpath("//div[@data-qa-marker='All experiences']");
ByBuilder activeTab   = ByBuilder.xpath("//div[@data-qa-marker='Active experiences']");
ByBuilder inactiveTab = ByBuilder.xpath("//div[@data-qa-marker='Inactive experiences']");

// CORRECT: one parameterized locator
ByBuilder experienceTab = ByBuilder.xpath("//div[@data-qa-marker='${id}']");

// Usage in method
public void clickExperienceTab(String tabName) {
    genericMethod.click(genericMethod.parameterizedLocator(experienceTab, tabName));
}
// Caller: clickExperienceTab("All experiences");
//         clickExperienceTab("Active experiences");
```

---

## APPIUM — Mobile Step and Page Object Reuse

### Already-Available Steps in `CommonStepDef.java`

```gherkin
# Booking setup via API
When  User create new booking with product "{tourGroupId}" and currency "{currency}" from api
Then  Get all booking details using booking id "{bookingIdType}"
Then  Get login token using secure id "{secureId}"
Then  User get login link from booking details "{secureId}"

# CommonPO interactions (navigation, UI common)
# Check CommonStepDef for all registered step texts
```

### Shared Mobile Page Objects — Reuse Before Creating

```
appium/src/test/java/com/headout/pages/
├── CommonPO.java          # App-wide interactions (keyboard, loading, alerts)
├── CalenderPO.java        # Date/time picker — fully reusable across all flows
├── VariantSelectionPO.java # PAX, variant, tour selection
├── UserFieldPO.java        # User input forms
├── DeepLinkingPO.java      # Deep link navigation
└── ConfirmationPO.java     # Booking confirmation screen
```

**CalenderPO** is fully reusable — it contains all calendar interactions with
parameterized date locators. Never re-implement date picking.

**DeepLinkingPO** provides direct navigation to any screen — use it in test
setup instead of navigating through the UI.

### DRY Rule — Reuse Dynamic Locators in Appium

```java
// WRONG: state-specific locators as separate fields
private final ByBuilder enabledDate  = ByBuilder.xpath("//*[contains(@resource-id,'qaid-calendar-date-label-') and not(contains(@resource-id,'-disabled'))]");
private final ByBuilder selectedDate = ByBuilder.xpath("//*[contains(@resource-id,'qaid-calendar-date-label-') and contains(@resource-id,'-selected')]");
private final ByBuilder specificDate = ByBuilder.xpath("//*[contains(@resource-id,'qaid-calendar-date-label-2024-06-01')]");  // hardcoded

// CORRECT: one base + parameterized
private final ByBuilder dateByKey = ByBuilder.xpath(
    "//*[contains(@resource-id,'qaid-calendar-date-label-${id}') or contains(@name,'qaid-calendar-date-label-${id}')]"
);

public void selectDate(String dateKey) {
    // dateKey = "2024-06-01", "2024-06-01-selected", etc.
    genericMethod.app().click(genericMethod.parameterizedLocator(dateByKey, dateKey));
}
```

---

## Decision Tree — Before Writing Any Code

```
Is the step/method needed?
  │
  ├─► CHECK CommonStepDef.java in the repo
  │     Found? → USE IT. Done.
  │
  ├─► GREP step definitions for similar text
  │     Found close match? → REUSE or EXTEND the existing step def.
  │
  ├─► CHECK domain utility / page object
  │     Method already exists? → CALL IT from step def.
  │
  ├─► CHECK CommonPO / CommonComponentsPO / CommonApiUtility
  │     Generic version exists? → EXTRACT to common, call from there.
  │
  └─► Nothing found?
        → CREATE new class/method following layer rules
          (API: utility class | UI: PO method | Mobile: PO method)
```

---

## Feature File Pre-Scan Protocol

Before writing a new `.feature` file, run this scan:

```bash
# 1. Find all existing steps that match your scenario keywords
grep -rn "User set.*endpoint\|User sends\|Verify.*status" \
  src/test/java/com/headout/stepdefinitions/

# 2. Check if a similar feature file already exists
find src/test/java/com/headout/features -name "*.feature" | \
  xargs grep -l "inventory\|booking\|checkout" 2>/dev/null

# 3. Check tag usage to find similar suites
grep -rn "@test.*@inventory\|@test.*@checkout" \
  src/test/java/com/headout/features/

# 4. For UI — find existing page objects for your target page
find src/test/java/com/headout/pageobjects -name "*${PageName}*"

# 5. For mobile — find existing page objects for your target screen
find src/test/java/com/headout/pages -name "*${ScreenName}*"
```

---

## Pre-PR Gate (MANDATORY — runs before Reuse Checklist)

Before running the reuse checklist, confirm the branch and compilation state.
Full gate rules and shell commands are in `qa/common/agent/_PRAETORIAN_CONSTITUTION.md` Section VI-B
and `qa/api/agent/agent.md` → Pre-PR Workflow.

```
GATE ORDER (must complete in sequence — no step skippable):

  1. git checkout main && git pull origin main
     → always start from or rebase onto latest main

  2. RAND=$(( RANDOM % 9000 + 1000 ))
     git checkout -b claude/<feature-name>-$RAND   OR   git rebase origin/main
     → branch name: claude/<feature-name>-<4-digit-random>
     → feature name from: cURL endpoint path / PRD title / domain+action
     → examples: claude/inventory-discount-4827  |  claude/promo-checkout-1293

  3. mvn compile -q
     → must exit 0 (BUILD SUCCESS) — fix ALL errors before proceeding

  4. mvn test -Dcucumber.filter.tags="@<new-tag> and @test" -DthreadCount=1
     → all NEW scenarios must PASS

  5. mvn test -Dcucumber.filter.tags="@test-sanity and @test" -DthreadCount=5
     → all existing SANITY scenarios must still PASS (no regressions)

  6. git rebase origin/main   (once more, to pick up any changes during step 4-5)

  7. git commit + git push + gh pr create --base main
```

**If any gate fails:**

| Failure | Action |
|---------|--------|
| `mvn compile` fails | Fix ALL compilation errors. Re-run until BUILD SUCCESS. Never commit. |
| New tag scenarios fail | Fix root cause (step def / utility / data / feature). Re-run until all green. |
| Sanity scenarios break | You introduced a regression. Fix before opening PR. |
| Rebase conflicts | Resolve manually. `git rebase --continue`. Never `git merge`. Never `--skip`. |

---

## Reuse Checklist (Complete Before PR)

- [ ] Searched `CommonStepDef.java` for all matching steps
- [ ] Searched all `*StepDef.java` files for step text using `grep -rn`
- [ ] Checked `CommonApiUtility.java` / `CommonPO.java` for reusable methods
- [ ] Used `parameterizedLocator()` for any repeated element pattern
- [ ] No locator defined more than once across PO files
- [ ] No step text duplicated across step definition files
- [ ] Component-level POs (`CommonComponentsPO`, `CommonPO`) used for shared UI elements
- [ ] Data setup via existing `DataSetup` classes, not new ad-hoc API calls
- [ ] `CacheMechanism.getInstance()` used for any data needed across multiple scenarios

**Pre-PR gate (must be ticked before opening PR):**
- [ ] Branched from / rebased onto latest `main`
- [ ] Branch name follows `claude/<feature-name>-<4-digit-random>` (NOT session ID, NOT `test/` prefix)
- [ ] `mvn compile -q` → BUILD SUCCESS
- [ ] `mvn test -Dcucumber.filter.tags="@<new-tag> and @test"` → all scenarios PASS
- [ ] `mvn test -Dcucumber.filter.tags="@test-sanity and @test"` → all sanity PASS
- [ ] `git rebase origin/main` done after run results confirmed
- [ ] PR opened with `--base main`; body includes compile + run results

---

## Complete Test Case Validation Protocol

> **Run this after reuse search, before generating or finalising any test case.**
> Applies to ALL layers: API (crest), UI (celium), Visual Diff (pixify), Mobile (appium).

A test case is only **complete** when its assertions are provably aligned with
all four sources of truth, evaluated in **priority order**:

| Priority | Source | What it proves | Conflict authority |
|----------|--------|----------------|-------------------|
| **1 — HIGHEST** | **PRD / Product Spec** | Intended product behaviour, acceptance criteria, business rules | PRD always wins |
| **2** | **ERD / Data Model** | Entity fields, types, constraints, relationships | Wins over GET response |
| **3** | **API GET Response** | What the endpoint actually returns today | Reflects current deploy state |
| **4 — LOWEST** | **PR / Dev Change** | What is being added / changed / removed in this PR | Subject to PRD authority |

If any source disagrees with the test assertions → the test has a **gap**.
A gap always results in a new or amended test case built from reuse steps.

---

## PRD Authority & Conflict Resolution

> **PRD is the single highest authority. It overrides PR, ERD, and GET response.**

### PRD > PR Conflict Rules

| Conflict situation | Rule | Test action |
|-------------------|------|-------------|
| PR implements X, PRD says it should be Y | PRD is correct — PR has a bug | Write test for Y; tag `@manual` until PR is fixed |
| PR adds a field, PRD does not mention it | Undocumented — ask PM to clarify | Create `@pending @manual` scenario |
| PRD specifies error message text, PR returns different text | PRD wins | Write test with PRD message; raise PR comment |
| PRD says endpoint is GET, PR implements POST | PRD wins | Write test for GET; tag `@manual`; raise to developer |
| PRD defines an enum value, ERD/PR omit it | PRD wins | Write test for missing value; tag `@pending` |
| PRD is silent, PR and ERD agree | PR + ERD sufficient | No conflict — proceed normally |

### `@manual` Tag — When and How to Use

Add `@manual` to any scenario that:
- Is derived from PRD but the implementation conflicts with it
- Cannot be automated yet (UI not built, endpoint not deployed, PRD gap)
- Requires human judgement (visual aesthetics, copy text review)
- Covers a PRD requirement that has no `data-qa-marker` / API hook yet

```gherkin
# PRD says: discount price shown when coupon applied
# PR returns: discountedPrice field missing from GET response
# Action: write PRD test with @manual until PR is fixed

@headout @checkout @test @manual @pending
Scenario: Verify discounted price is displayed when valid coupon is applied
  # PRD Ref: Checkout Spec v2.3 — Section 4.2 Coupon Discount Display
  # Conflict: PR GET /checkout response missing 'discountedPrice' field
  # Status: manual until fix is deployed
  Given User is on the checkout page with a valid booking
  When User applies a valid coupon code
  Then The discounted price should be visible in the order summary
  And The discount amount should be shown next to the original price
```

### PRD Conflict Decision Tree

```
PR assertion differs from PRD?
  │
  ├─► PRD has explicit requirement?
  │     YES → PRD wins
  │             Write test for PRD behaviour
  │             Tag @manual (implementation not yet correct)
  │             Add comment: # PRD Ref: <doc> <section>
  │             Raise PR comment / ticket to developer
  │
  │     NO  → PRD is silent?
  │             Ask PM / BA to clarify before writing test
  │             If urgent → write test for current PR behaviour
  │             Tag @pending until PRD is updated
  │
  ├─► ERD contradicts PR (PRD is silent)?
  │     ERD wins over PR
  │     Write test for ERD behaviour
  │     Raise discrepancy to developer
  │
  └─► GET response contradicts PR (PRD + ERD agree)?
        GET is the deployed state — it may be stale
        Write test for PRD + ERD behaviour; tag @pending
        until GET response is updated
```

---

## Test Type Classification

Every scenario must be classified by **test type** before tagging.
Test type determines scope, dependencies, and which tag set to apply.

### Test Type Definitions

| Type | Scope | Layer | Dependencies | Speed | Tag |
|------|-------|-------|-------------|-------|-----|
| **Modular** | Single method / class in isolation | API utility, PO method | None / mocked | Fastest | `@modular` |
| **Service** | Single service end-to-end (one API) | API (crest) | Own DB / mocks only | Fast | `@service` |
| **Integration** | Two or more services interact | API (crest) | Downstream real services | Medium | `@integration` |
| **Edge** | Boundary / abnormal inputs on any type | Any layer | Same as parent type | Varies | `@edge` |
| **Sanity** | Critical happy paths only | All layers | Full stack (test env) | <5 min | `@test-sanity` |
| **Smoke** | Broader functional coverage | All layers | Full stack (test env) | <15 min | `@smoke` |
| **Regression** | Full coverage, catch breakage | All layers | Full stack | <60 min | `@test-regression` |
| **E2E** | Complete user journey across services | UI + API | Full stack | Slow | `@test-headout-e2e-flow` |
| **Black Box** | External interface only — no internal knowledge; equivalence partitioning + decision tables | API/UI/App | Full stack | Fast | `@black-box` |
| **White Box** | Internal code paths — branch/path/condition/exception coverage | API (utility classes) | Unit / integration | Fast–Medium | `@white-box` |
| **Exploratory** | Charter-based unscripted testing; "what-if" chaining; session-based learning | API/UI/App | Full stack | Varies — always `@manual` | `@exploratory` |

### Modular Test — Single Utility / PO Method

Tests a single method in isolation. No network calls, no real driver.

```gherkin
# Type: Modular — tests InventoryUtility.buildInventoryRequest() in isolation
@headout @inventory @modular @test
Scenario: Verify inventory request is built correctly with valid variantId
  Given A variantId "12345" and currency "USD" are set in CrestDataHandler
  When The inventory request is built
  Then The endpoint should contain "inventory-v2"
  And The query param "variantId" should be "12345"
  And The query param "currency" should be "USD"
```

### Service-Level Test — Single Service

Tests one API service: request → response → assertions. Real call, own DB, no downstream.

```gherkin
# Type: Service — tests /v2/inventory as a standalone API
@headout @inventory @service @test @test-regression @ode-regression
Scenario Outline: Verify inventory service returns correct data for variant "<variantId>"
  Given User set "inventory-v2" and "calipso" Api endpoint
  And User set request headers
  And User set query parameters "variantId" and "<variantId>" for api
  When User sends the get request
  Then Verify message "" and status code "200" for api
  And Verify response field "items[0].id" is not null
  Then Verify Api Response is correct with Schema "InventoryByVariantId.json"
  Examples:
    | variantId |
    | 12345     |
    | 67890     |
```

### Integration Test — Cross-Service

Tests two or more real services communicating (e.g. booking creation → inventory deduction).

```gherkin
# Type: Integration — booking creation triggers inventory deduction
@headout @booking @integration @test @test-regression @ode-regression
Scenario: Verify booking creation reduces available inventory count
  # Step 1: capture inventory before
  Given User set "inventory-v2" and "calipso" Api endpoint
  And User set query parameters "variantId" and "12345" for api
  When User sends the get request
  Then Capture response field "items[0].remaining" as "inventoryBefore"
  # Step 2: create booking
  When User create new booking with product "12345" and currency "USD" from api
  And Get all booking details using booking id "bookingId"
  # Step 3: verify inventory reduced
  Given User set "inventory-v2" and "calipso" Api endpoint
  And User set query parameters "variantId" and "12345" for api
  When User sends the get request
  Then Verify response field "items[0].remaining" is less than "inventoryBefore"
```

### Edge Case Test — Boundary & Abnormal Inputs

Edge cases apply to ALL test types. Generate edge scenarios for:

| Edge category | Examples |
|--------------|---------|
| **Boundary values** | Min/max pax, price = 0, remaining = 0 |
| **Empty / null inputs** | Empty variantId, null currency, missing required fields |
| **Invalid formats** | Letters in numeric field, past dates, negative numbers |
| **Max length** | 255+ char strings, very large integers |
| **Enum exhaustion** | Test ALL enum values (AVAILABLE, SOLD_OUT, LIMITED) |
| **Auth boundary** | Invalid token, expired token, missing token, wrong scope |
| **Concurrent** | Double-booking, simultaneous coupon redemption |

```gherkin
# Type: Edge — boundary on pax count (min=1, max=10 per PRD)
@headout @booking @edge @test @test-regression @ode-regression @negative
Scenario Outline: Verify pax count boundary for booking creation — "<scenario>"
  Given User set "booking-create-v2" and "" Api endpoint
  And User set request headers
  And User set body parameters "variantId" and "12345" for api
  And User set body parameters "paxCount" and "<paxCount>" for api
  When User sends the post request
  Then Verify message "<expectedMessage>" and status code "<expectedCode>" for api
  Examples:
    | scenario           | paxCount | expectedMessage          | expectedCode |
    | below minimum (0)  | 0        | Minimum 1 pax required   | 400          |
    | minimum valid (1)  | 1        |                          | 200          |
    | maximum valid (10) | 10       |                          | 200          |
    | above maximum (11) | 11       | Maximum 10 pax allowed   | 400          |
    | negative value     | -1       | Invalid pax count        | 400          |
    | null value         |          | paxCount is required     | 400          |

# Type: Edge — enum exhaustion on availability
@headout @inventory @edge @test @test-regression
Scenario Outline: Verify inventory response handles all availability states — "<state>"
  Given User set "inventory-v2" and "calipso" Api endpoint
  And User set query parameters "variantId" and "<variantId>" for api
  When User sends the get request
  Then Verify message "" and status code "200" for api
  And Verify response field "items[0].availability" has value "<state>"
  Examples:
    | variantId | state      |
    | 11111     | AVAILABLE  |
    | 22222     | SOLD_OUT   |
    | 33333     | LIMITED    |
```

### Black Box Test — Equivalence Partitioning & Decision Tables

Tests the API/UI purely through its **external interface** with no knowledge of internal code.
Group inputs into equivalence classes (valid + invalid) and test one representative per class.

```gherkin
# Type: Black Box — equivalence partitioning on variantId and currency inputs
@headout @inventory @black-box @test @test-regression
Scenario Outline: Verify inventory API response for "<inputClass>" input class
  Given User set "inventory-v2" and "calipso" Api endpoint
  And User set authentication for api module "calipso"
  And User set query parameters "variantId" and "<variantId>" for api
  And User set query parameters "currency" and "<currency>" for api
  When User sends the get request
  Then Verify message "<expectedMessage>" and status code "<expectedCode>" for api
  # EQUIVALENCE CLASS: <inputClass>
  Examples:
    | inputClass                        | variantId | currency | expectedMessage | expectedCode |
    # ── VALID CLASSES ──
    | valid variant + valid currency    | 12345     | USD      |                 | 200          |
    | valid variant + non-default curr  | 12345     | EUR      |                 | 200          |
    # ── INVALID CLASSES ──
    | non-existent variant              | 99999999  | USD      | Not found       | 404          |
    | invalid currency (non-ISO)        | 12345     | XYZ      | Invalid currency| 400          |
    | zero variant ID                   | 0         | USD      | Invalid variant | 400          |
    | missing variant                   |           | USD      | Field required  | 400          |

# Type: Black Box — decision table for booking eligibility
@headout @booking @black-box @test @test-regression
Scenario Outline: Verify booking eligibility decision: auth="<auth>" + variant="<variantStatus>"
  Given User set "booking-create-v2" and "" Api endpoint
  And User set authentication token "<authToken>" for api
  And User set body parameters "variantId" and "<variantId>" for api
  When User sends the post request
  Then Verify message "<expectedMessage>" and status code "<expectedCode>" for api
  Examples:
    | auth             | variantStatus | authToken    | variantId | expectedMessage      | expectedCode |
    | valid auth       | active        | VALID_TOKEN  | 12345     |                      | 200          |
    | valid auth       | inactive      | VALID_TOKEN  | 99999     | Variant not bookable | 422          |
    | expired auth     | active        | EXPIRED_TOKEN| 12345     | Unauthorised         | 401          |
    | no auth          | active        |              | 12345     | Unauthorised         | 401          |
```

### White Box Test — Branch / Path / Condition Coverage

Tests internal code paths in utility classes and step definitions.
One scenario (or Examples row) per distinct code branch in the target method.

```gherkin
# Type: White Box — branch coverage for InventoryUtility.buildInventoryRequest()
@headout @inventory @white-box @test @test-regression
Scenario Outline: Verify InventoryUtility branch for "<branch>"
  Given User set "inventory-v2" and "calipso" Api endpoint
  And User set authentication for api module "calipso"
  And User set query parameters "variantId" and "<variantId>" for api
  And User set query parameters "currency" and "<currency>" for api
  When User sends the get request
  Then Verify message "<expectedMessage>" and status code "<expectedCode>" for api
  # BRANCH: <branch>
  Examples:
    | branch                              | variantId | currency | expectedMessage  | expectedCode |
    | valid input → happy path branch     | 12345     | USD      |                  | 200          |
    | null variantId → NPE guard branch   |           | USD      | Field required   | 400          |
    | null currency → default-USD branch  | 12345     |          |                  | 200          |
    | invalid currency → exception branch | 12345     | INVALID  | Invalid currency | 400          |

# Type: White Box — exception path (downstream service failure catch block)
@headout @inventory @white-box @test @test-regression
Scenario: Verify InventoryUtility handles downstream service 503 via exception catch block
  Given User set "inventory-v2" and "calipso" Api endpoint
  And User set authentication for api module "calipso"
  And Downstream calipso service is stubbed to return 503
  And User set query parameters "variantId" and "12345" for api
  When User sends the get request
  Then Verify message "Service temporarily unavailable" and status code "503" for api

# Type: White Box — @manual JaCoCo branch coverage verification
@manual @white-box @inventory
Scenario: Verify 100% branch coverage on InventoryUtility after regression run
  # PRE-CONDITION: JaCoCo enabled (mvn test -Pjacoco-report)
  # STEP 1: Run @test-regression suite for @inventory tag
  # STEP 2: Open target/site/jacoco/com.headout.api.inventory/InventoryUtility.html
  # EXPECTED: All branch markers in buildInventoryRequest() are green
  # EXPECTED: No yellow (partial) or red (missed) branch markers
```

### Exploratory Test — Charter-Based Session

All exploratory scenarios are **`@manual`** with a structured CHARTER header.
One scenario per exploration focus area. Use `what-if` chaining to discover unexpected defects.

```gherkin
# Type: Exploratory — API "what-if" chaining and parameter probing
@manual @exploratory @inventory
Scenario: Exploratory charter — inventory API boundary and "what-if" response chaining
  # CHARTER:  Explore inventory API using output-as-input chaining and unexpected param combinations
  # TARGET:   GET /inventory-v2 + downstream booking endpoints
  # DURATION: 30 minutes
  #
  # STEP 1: Call inventory API → capture items[0].variantId from response
  # STEP 2: Use captured variantId as input to booking-create API immediately
  # EXPECTED: Booking created successfully; no FK constraint errors
  #
  # STEP 3: Retrieve inventory again for same variantId
  # EXPECTED: Remaining count decreased; not stale; no caching anomaly
  #
  # STEP 4: Send inventory request with extra undocumented query params (e.g. "debug=true")
  # EXPECTED: Extra params ignored; no internal stack trace leaked in response
  #
  # STEP 5: Repeat inventory GET 50× rapidly for same variantId
  # EXPECTED: No 429 rate-limit errors; response time stays < 500 ms
  #
  # POST-CHECK: No phantom records in DB; audit log shows all calls

# Type: Exploratory — UI "what-if" chaining (celium)
@manual @exploratory @celium
Scenario: Exploratory charter — checkout flow unusual navigation and session edge cases
  # CHARTER:  Explore checkout UI with unexpected navigation, timing, and concurrent tab usage
  # TARGET:   Checkout pages (celium web UI)
  # DURATION: 45 minutes
  #
  # STEP 1: Start checkout in two browser tabs with same session simultaneously
  # EXPECTED: No duplicate cart entries; last-write-wins or conflict surfaced
  #
  # STEP 2: Start checkout → navigate back → forward → back using browser history rapidly
  # EXPECTED: Cart state preserved; no JS errors; back navigation does not re-submit forms
  #
  # STEP 3: Apply promo code → let session near-expire → try to complete booking
  # EXPECTED: Re-auth prompt shown; cart preserved after re-login
  #
  # POST-CHECK: No orphaned bookings; payment authorisations released if booking abandoned
```

---

## Environment & Test Level Taxonomy

Every scenario must carry **both** an environment tag and a test-level tag.
These two axes together determine when a scenario runs in CI/CD.

### Environment Tags

| Tag | Environment | Purpose |
|-----|-------------|---------|
| `@test` | Test / staging | Default for all new automated tests |
| `@live` | Production | Smoke/sanity only — no data mutation |
| `@ondemand` | ODE | Feature branch testing |
| `@ode-regression` | ODE regression | Full regression on ODE |

### Test Level Tags (Suite Depth)

| Tag | Suite | What it includes | Max run time | Trigger |
|-----|-------|-----------------|-------------|---------|
| `@test-sanity` / `@live-sanity` | **Sanity** | 1–3 critical happy-path scenarios per feature | < 5 min | Every deploy |
| `@test-smoke` / `@live-smoke` | **Smoke** | Sanity + main positive paths | < 15 min | Every release candidate |
| `@test-regression` / `@ode-regression` | **Regression** | Full suite: positive + negative + edge | < 60 min | Nightly / pre-release |
| `@test-headout-e2e-flow` / `@ode-headout-e2e-flow` | **E2E** | Full user journey across multiple services | < 30 min | Release only |

### Test Type → Recommended Tag Set

| Test type | Mandatory tags | Optional tags | Notes |
|-----------|---------------|---------------|-------|
| Modular | `@modular @test` | domain tag | No env dependency |
| Service | `@service @test @test-regression` | `@ode-regression` | Always in regression |
| Integration | `@integration @test @test-regression @ode-regression` | `@test-headout-e2e-flow` | Needs full stack |
| Edge | `@edge @test @test-regression` | `@negative @ode-regression` | Pair with parent type tag |
| Sanity | `@test-sanity` OR `@live-sanity` | domain tag | 1 scenario per feature max |
| Smoke | `@test-smoke` OR `@live-smoke` | domain tag | Includes all sanity scenarios |
| Regression | `@test-regression` OR `@ode-regression` | `@edge @negative` | Full suite |
| E2E | `@test-headout-e2e-flow` OR `@ode-headout-e2e-flow` | `@test` | Cross-service journeys |
| Manual / PRD gap | `@manual` | `@pending @test` | Not automated yet |

### Tag Selection Rules

```
1. EVERY scenario must have:
   - At least one environment tag  (@test | @live | @ondemand)
   - At least one suite-depth tag  (@test-sanity | @test-smoke | @test-regression | …)
   - Domain tag                    (@booking | @inventory | @checkout | …)
   - Repo tag                      (@headout)

2. Sanity:
   - Only the 1–3 scenarios whose failure means the feature is completely broken
   - Tag: @test-sanity (test env)  or  @live-sanity (live env)
   - DO NOT add @test-sanity to negative or edge scenarios

3. Smoke:
   - All sanity scenarios + main positive paths
   - Tag: @test-smoke (test env)  or  @live-smoke (live env)
   - DO NOT add @test-smoke to integration or long-running edge scenarios

4. Regression:
   - All smoke + negative + edge + integration scenarios
   - Tag: @test-regression (test env)  or  @ode-regression (ODE env)
   - Every new scenario gets @test-regression by default

5. Live environment tests:
   - Only @live-sanity and @live-smoke — NEVER @live-regression
   - Must NOT mutate data (no POST/PUT/DELETE creating real bookings/orders)
   - Read-only checks only

6. @manual:
   - Derived from PRD but implementation conflicts with it
   - Visual/copy validation requiring human judgement
   - Always paired with @pending if implementation not yet deployed
   - Remove @manual and automate once implementation is fixed

7. @pending:
   - Feature not yet deployed or implemented
   - Keep the scenario — it documents intent
   - Remove once feature is live

8. @negative:
   - Any scenario expecting an error response (4xx/5xx) or validation failure
   - Always combine with @test-regression

9. @edge:
   - Boundary values, null/empty inputs, enum exhaustion, concurrent access
   - Always combine with @test-regression and @negative where applicable

10. @modular / @service / @integration:
    - Classify the scope explicitly on every scenario
    - @modular: single method, no network call
    - @service: one API, own DB
    - @integration: two+ real services
```

### Complete Tag Example — Booking Creation Feature

```gherkin
Feature: Booking Creation API

  # SANITY — critical happy path, runs on every deploy
  @headout @booking @service @test @test-sanity @test-smoke @test-regression @ode-regression
  Scenario: Verify successful booking creation returns 200 and booking ID
    Given User set "booking-create-v2" and "" Api endpoint
    And User set request headers
    And User set body parameters "variantId" and "12345" for api
    When User sends the post request
    Then Verify message "" and status code "200" for api
    And Verify response field "data.bookingId" is not null

  # SMOKE — main positive paths
  @headout @booking @service @test @test-smoke @test-regression @ode-regression
  Scenario Outline: Verify booking creation for multiple variants "<variantId>"
    Given User set "booking-create-v2" and "" Api endpoint
    And User set request headers
    And User set body parameters "variantId" and "<variantId>" for api
    When User sends the post request
    Then Verify message "" and status code "200" for api
    And Verify response field "data.status" has value "CONFIRMED"
    Then Verify Api Response is correct with Schema "BookingCreate.json"
    Examples:
      | variantId |
      | 12345     |
      | 67890     |

  # REGRESSION — schema contract
  @headout @booking @service @test @test-regression @ode-regression
  Scenario: Validate booking creation response schema
    Given User set "booking-create-v2" and "" Api endpoint
    And User set request headers
    And User set body parameters "variantId" and "12345" for api
    When User sends the post request
    Then Verify Api Response is correct with Schema "BookingCreate.json"

  # EDGE — boundary on pax count
  @headout @booking @edge @test @test-regression @ode-regression @negative
  Scenario Outline: Verify pax count boundary "<scenario>"
    Given User set "booking-create-v2" and "" Api endpoint
    And User set request headers
    And User set body parameters "paxCount" and "<paxCount>" for api
    When User sends the post request
    Then Verify message "<expectedMessage>" and status code "<expectedCode>" for api
    Examples:
      | scenario   | paxCount | expectedMessage        | expectedCode |
      | below min  | 0        | Minimum 1 pax required | 400          |
      | above max  | 11       | Maximum 10 pax allowed | 400          |
      | null       |          | paxCount is required   | 400          |

  # INTEGRATION — booking reduces inventory
  @headout @booking @integration @test @test-regression @ode-regression @test-headout-e2e-flow
  Scenario: Verify booking creation reduces available inventory count
    Given User set "inventory-v2" and "calipso" Api endpoint
    And User set query parameters "variantId" and "12345" for api
    When User sends the get request
    Then Capture response field "items[0].remaining" as "inventoryBefore"
    When User create new booking with product "12345" and currency "USD" from api
    And Get all booking details using booking id "bookingId"
    Given User set "inventory-v2" and "calipso" Api endpoint
    And User set query parameters "variantId" and "12345" for api
    When User sends the get request
    Then Verify response field "items[0].remaining" is less than "inventoryBefore"

  # MANUAL — PRD conflict, automate after fix
  @headout @booking @test @manual @pending
  Scenario: Verify discounted price is shown when coupon applied at booking
    # PRD Ref: Checkout Spec v2.3 — Section 4.2 Coupon Discount Display
    # Conflict: PR GET /booking response missing 'discountedPrice' field
    # Action: automate and remove @manual @pending once PR fix is deployed
    Given User has a valid booking with a coupon applied
    Then The discounted price should be visible in the booking response
    And The discount amount should match the coupon value

  # LIVE — production sanity (read-only)
  @headout @booking @test @live-sanity @live-smoke
  Scenario: Verify booking API is reachable on live environment
    Given User set "booking-list-v2" and "" Api endpoint
    And User set request headers
    When User sends the get request
    Then Verify message "" and status code "200" for api
```

---

### Step 1 — Collect the Four Sources of Truth

#### A. PRD / Product Spec (Highest Authority — Read First)

Read the PRD, Notion doc, Google Doc, or Confluence spec for the feature.

```
Extract from PRD:
─────────────────────────────────────
ACCEPTANCE CRITERIA: [numbered list from PRD]
BUSINESS RULES:      [validation rules, constraints, enum values]
ERROR MESSAGES:      [exact text the PRD specifies]
REQUIRED FIELDS:     [fields PRD says must always be present]
ENUM VALUES:         [all allowed states per PRD]
EDGE CASES DEFINED:  [min/max, null handling, error scenarios in PRD]
```

#### B. API Response Collection — All HTTP Methods

Collect expected **request bodies** and **responses** for every HTTP method the
endpoint supports. If the endpoint is not yet live, extract from the PR or ERD.

---

##### B1. When to Use Each Source for Response Data

| Endpoint state | Primary source | Fallback source |
|----------------|---------------|----------------|
| Live on test env | Run actual request (cURL / CommonStepDef) | PR response DTO / ERD |
| PR merged, not deployed | PR response DTO class / serialised example in PR | ERD entity fields |
| PR open (not merged) | PR response DTO class + PR description | ERD entity fields |
| No PR, ERD only | Derive fields from ERD entity | PRD acceptance criteria |

---

##### B2. GET — Collecting the Response

```bash
# Option 1: live endpoint — run and capture
curl -s -H "Authorization: Bearer $TOKEN" \
  "https://api.test-headout.com/v2/inventory?variantId=12345" | python3 -m json.tool

# Option 2: CommonStepDef steps (adds to crest test output)
# Given User set "inventory-v2" and "calipso" Api endpoint
# And   User set request headers
# And   User set query parameters "variantId" and "12345" for api
# When  User sends the get request
# Then  Verify message "" and status code "200" for api
# → inspect TestNGLogUtility output for the full response JSON
```

GET Response Field Map — record every field, type, nullable flag:

```
METHOD: GET /v2/inventory
─────────────────────────────────────────────────────────
RESPONSE 200:
  items[].id              string    required
  items[].startDateTime   string    required
  items[].endDateTime     string    required
  items[].availability    string    required  [AVAILABLE, SOLD_OUT, LIMITED]
  items[].remaining       integer   required
  items[].pricing.persons array     required
    → .type               string    required
    → .price              number    required
    → .originalPrice      number    required
  nextUrl                 string|null
  prevUrl                 string|null
  total                   integer   required

RESPONSE 400: { "error": { "code": "INVALID_PARAM", "message": "..." } }
RESPONSE 404: { "error": { "code": "NOT_FOUND",    "message": "..." } }
RESPONSE 401: { "error": { "code": "UNAUTHORIZED", "message": "..." } }
```

**When live endpoint unavailable — extract GET response from PR:**

```java
// Look for the response DTO in the PR's Java code
// e.g. src/main/java/com/headout/dto/InventoryResponse.java
public class InventoryResponse {
    private List<InventoryItem> items;   // → items[] array
    private String nextUrl;              // → string|null
    private String prevUrl;              // → string|null
    private Integer total;               // → integer required
}
public class InventoryItem {
    private String id;                   // → string required
    private String startDateTime;        // → string required
    private String availability;         // → enum [AVAILABLE, SOLD_OUT, LIMITED]
    private Integer remaining;           // → integer required
    private Pricing pricing;             // → object
}
// Map every field: type annotation → JSON type, @NotNull → required, no annotation → nullable
```

**When no PR and no live endpoint — derive GET response from ERD:**

```
ERD Entity: inventory
  id            UUID        NOT NULL   → string  required
  variant_id    BIGINT      NOT NULL   → integer required  (camelCase: variantId)
  availability  ENUM        NOT NULL   → string  required  [AVAILABLE, SOLD_OUT, LIMITED]
  remaining     INT         NOT NULL   → integer required
  start_dt      TIMESTAMP   NOT NULL   → string  required  (ISO-8601)
  deleted_at    TIMESTAMP   NULLABLE   → string|null       (omit from response if null)
→ Build expected response shape from column names + types + nullability
→ Apply camelCase conversion: snake_case DB columns → camelCase JSON fields
```

---

##### B3. POST — Collecting Request Body and Response

```bash
# Live POST — capture request + response
curl -s -X POST "https://api.test-headout.com/v2/booking/create" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "variantId": "12345",
    "startDateTime": "2024-06-15T10:00:00",
    "personDetails": [{"type": "ADULT", "count": 2}],
    "currency": "USD"
  }' | python3 -m json.tool
```

POST Request/Response Map:

```
METHOD: POST /v2/booking/create
─────────────────────────────────────────────────────────
REQUEST BODY (required fields from PRD/ERD):
  variantId          string    required   (from ERD: variant_id BIGINT NOT NULL)
  startDateTime      string    required   (ISO-8601, from ERD: start_dt NOT NULL)
  personDetails[]    array     required
    → .type          string    required   [ADULT, CHILD, INFANT]  (from PRD enum)
    → .count         integer   required   min=1, max=10 (from PRD rule)
  currency           string    required   [USD, EUR, GBP, INR]   (from PRD)
  couponCode         string    optional   (nullable, from ERD: coupon_code VARCHAR NULLABLE)

RESPONSE 200 (created):
  data.bookingId     string    required
  data.status        string    required   [CONFIRMED, PENDING]
  data.totalAmount   number    required
  data.currency      string    required
  data.createdAt     string    required   (ISO-8601)

RESPONSE 400: { "error": { "code": "VALIDATION_ERROR", "message": "...", "fields": [...] } }
RESPONSE 409: { "error": { "code": "CONFLICT", "message": "Variant already booked" } }
RESPONSE 401: { "error": { "code": "UNAUTHORIZED" } }
```

**When live endpoint unavailable — extract POST body from PR:**

```java
// Look for the request DTO in the PR
// e.g. src/main/java/com/headout/dto/CreateBookingRequest.java
public class CreateBookingRequest {
    @NotNull
    private String variantId;              // required

    @NotNull
    private String startDateTime;          // required, ISO-8601

    @NotNull @Size(min=1)
    private List<PersonDetail> personDetails;  // required, non-empty

    @NotNull
    private String currency;               // required

    private String couponCode;             // OPTIONAL — no @NotNull
}
public class PersonDetail {
    @NotNull
    private PersonType type;               // enum: ADULT, CHILD, INFANT

    @Min(1) @Max(10)
    private Integer count;                 // required, boundary: 1–10
}
// @NotNull / @NotBlank → required field
// No annotation / @Nullable → optional field
// @Min / @Max → boundary values for edge tests
// Enum type → exhaustion test values
```

**When no PR — derive POST body from ERD:**

```
ERD Entity: booking
  variant_id    BIGINT      NOT NULL   → variantId    string required
  start_dt      TIMESTAMP   NOT NULL   → startDateTime string required
  currency      VARCHAR(3)  NOT NULL   → currency      string required
  coupon_id     BIGINT      NULLABLE   → couponCode    string optional
  pax_count     INT         NOT NULL   CHECK(pax_count >= 1 AND pax_count <= 10)
                                       → personDetails[].count  integer  min=1 max=10
→ Derive required/optional from NOT NULL / NULLABLE
→ Derive boundary values from CHECK constraints
→ Derive enum values from ENUM type or FK reference table
```

---

##### B4. PUT / PATCH — Collecting Request Body and Response

```bash
# PUT — full replacement
curl -s -X PUT "https://api.test-headout.com/v2/booking/BK-001/status" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "CANCELLED", "reason": "Customer request"}' | python3 -m json.tool

# PATCH — partial update
curl -s -X PATCH "https://api.test-headout.com/v2/booking/BK-001" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"couponCode": "SAVE10"}' | python3 -m json.tool
```

PUT / PATCH Request/Response Map:

```
METHOD: PATCH /v2/booking/{bookingId}
─────────────────────────────────────────────────────────
REQUEST BODY (all fields optional for PATCH — only send fields to update):
  couponCode       string    optional
  personDetails[]  array     optional   (if sent: same rules as POST)
  startDateTime    string    optional   (ISO-8601)

RESPONSE 200 (updated — returns full updated resource):
  data.bookingId   string    required
  data.status      string    required
  data.couponCode  string|null
  data.updatedAt   string    required

RESPONSE 400: validation error
RESPONSE 404: booking not found
RESPONSE 409: conflict (e.g. booking already confirmed — cannot patch)
RESPONSE 422: unprocessable entity (valid JSON, business rule violation)
```

**Derive PATCH body from PR — look for `@JsonProperty(required=false)` / `Optional<>` fields:**

```java
// src/main/java/com/headout/dto/PatchBookingRequest.java
public class PatchBookingRequest {
    private Optional<String> couponCode;       // optional — PATCH semantics
    private Optional<String> startDateTime;    // optional
    private Optional<List<PersonDetail>> personDetails; // optional

    // Any field that is Optional<> or nullable in the DTO = optional in PATCH body
    // Any field that is @NotNull in a PATCH DTO = always required even on PATCH
}
```

---

##### B5. DELETE — Collecting Response

```bash
curl -s -X DELETE "https://api.test-headout.com/v2/booking/BK-001" \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
```

DELETE Response Map:

```
METHOD: DELETE /v2/booking/{bookingId}
─────────────────────────────────────────────────────────
RESPONSE 200: { "data": { "bookingId": "BK-001", "status": "DELETED" } }
          OR: 204 No Content (empty body — check PRD for which pattern)
RESPONSE 404: { "error": { "code": "NOT_FOUND" } }
RESPONSE 409: { "error": { "code": "CONFLICT", "message": "Active booking — cancel first" } }
RESPONSE 401: { "error": { "code": "UNAUTHORIZED" } }

NOTE: After DELETE, follow-up GET must return 404 — add integration assertion
```

---

##### B6. Full API Contract Table (fill once per endpoint, before writing tests)

```
ENDPOINT: ______________________   SERVICE: ______________________

┌──────────┬─────────────────────────────┬──────────────────────────────────────────────┐
│ Method   │ Request Body / Params       │ Response (status → fields)                   │
├──────────┼─────────────────────────────┼──────────────────────────────────────────────┤
│ GET      │ query: variantId (required) │ 200: items[], total, nextUrl|null            │
│          │ query: currency (optional)  │ 400: error.code, error.message               │
│          │                             │ 401: error.code                              │
│          │                             │ 404: error.code                              │
├──────────┼─────────────────────────────┼──────────────────────────────────────────────┤
│ POST     │ body: variantId (required)  │ 200: data.bookingId, data.status             │
│          │ body: startDateTime (req)   │ 400: error.code, error.fields[]              │
│          │ body: personDetails (req)   │ 401: error.code                              │
│          │ body: currency (required)   │ 409: error.code, error.message               │
│          │ body: couponCode (optional) │                                              │
├──────────┼─────────────────────────────┼──────────────────────────────────────────────┤
│ PATCH    │ body: couponCode (optional) │ 200: data.bookingId, data.updatedAt          │
│          │ body: startDateTime (opt)   │ 400, 404, 409, 422                           │
├──────────┼─────────────────────────────┼──────────────────────────────────────────────┤
│ DELETE   │ path: bookingId (required)  │ 200/204, 404, 409, 401                       │
└──────────┴─────────────────────────────┴──────────────────────────────────────────────┘

SOURCE: [ ] Live endpoint  [ ] PR DTO class  [ ] ERD  [ ] PRD only
```

#### C. PR / Dev Change

Review the PR description, changed files, or Notion/Google Doc provided by the developer.

```
Extract from PR:
─────────────────────────────────────
NEW fields added:    [field names and types]
REMOVED fields:      [field names]
MODIFIED behaviour:  [status codes, validation rules, error messages]
RENAMED fields:      [old → new]
NEW endpoints:       [method + path]
NEW error codes:     [HTTP status + message]
```

#### D. ERD / Data Model

Review the entity definition (database schema, proto, TypeScript interface, or Swagger spec).

```
Extract from ERD:
─────────────────────────────────────
Entity: Inventory
  id            UUID        NOT NULL
  variantId     BIGINT      NOT NULL
  startDateTime TIMESTAMP   NOT NULL
  endDateTime   TIMESTAMP   NOT NULL
  availability  ENUM        NOT NULL  [AVAILABLE, SOLD_OUT, LIMITED]
  remaining     INT         NOT NULL
  createdAt     TIMESTAMP   NOT NULL
  deletedAt     TIMESTAMP   NULLABLE
```

---

### Step 2 — Gap Analysis (Mandatory Before Writing Test Code)

Compare your **planned test assertions** against all four sources.
For every assertion, ask: Is it present and correct in ALL applicable sources?
**PRD always wins on conflict — mark the PRD column first.**
**Run a separate gap matrix per HTTP method (GET / POST / PATCH / PUT / DELETE).**

#### Gap Matrix — GET Response Fields

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│  ASSERTION (GET response)  │  PRD   │ GET Response │ PR Change │ ERD / Model     │
├────────────────────────────┼────────┼──────────────┼───────────┼─────────────────┤
│  status 200 for valid req  │   ✓    │     ✓        │     ✓     │      —          │
│  items[].id present        │   ✓    │     ✓        │     ✓     │      ✓          │
│  items[].availability ∈    │   ✓    │     ✓        │     ✓     │      ✓          │
│  items[].remaining >= 0    │   ✓    │     ✓        │     —     │      ✓          │
│  items[].discountPrice     │   ✓    │  ✗ MISSING   │   ✓ NEW   │      ✓          │ ← GAP: @pending
│  items[].discountLabel     │   ✓    │  ✗ MISSING   │ ✗ MISSING │   ✗ MISSING     │ ← PRD only → @manual
│  400 for missing variantId │   ✓    │     ✓        │     —     │      —          │
│  401 for invalid token     │   ✓    │     ✓        │     —     │      —          │
│  404 for unknown id        │   ✓    │     ✓        │     —     │      —          │
└──────────────────────────────────────────────────────────────────────────────────┘
```

#### Gap Matrix — POST Request Body Fields

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│  ASSERTION (POST body/resp)│  PRD   │ POST Response│ PR DTO    │ ERD / Model     │
├────────────────────────────┼────────┼──────────────┼───────────┼─────────────────┤
│  variantId required        │   ✓    │     ✓        │     ✓     │      ✓ NOT NULL  │
│  startDateTime required    │   ✓    │     ✓        │     ✓     │      ✓ NOT NULL  │
│  personDetails required    │   ✓    │     ✓        │     ✓     │      ✓          │
│  couponCode optional       │   ✓    │     ✓        │     ✓     │      ✓ NULLABLE  │
│  paxCount min=1 max=10     │   ✓    │     —        │   ✓ @Min  │   ✓ CHECK       │
│  201 → data.bookingId      │   ✓    │     ✓        │     ✓     │      ✓          │
│  data.discountedPrice NEW  │   ✓    │  ✗ MISSING   │   ✓ NEW   │      ✓          │ ← GAP: @pending
│  400 missing variantId     │   ✓    │     ✓        │     ✓     │      —          │
│  409 duplicate booking     │   ✓    │     ✓        │     —     │      —          │
└──────────────────────────────────────────────────────────────────────────────────┘
```

#### Gap Matrix — PATCH / PUT / DELETE

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│  ASSERTION                 │  PRD   │ Live/PR Resp │ PR DTO    │ ERD / Model     │
├────────────────────────────┼────────┼──────────────┼───────────┼─────────────────┤
│  PATCH: couponCode updates │   ✓    │     ✓        │     ✓     │      ✓          │
│  PATCH: other fields kept  │   ✓    │     ✓        │     —     │      —          │
│  PATCH: 409 if CANCELLED   │   ✓    │     ✓        │     ✓     │      —          │
│  DELETE: 200 with summary  │   ✓    │     ✓        │     ✓     │      —          │
│  DELETE: follow-up 404     │   ✓    │     —        │     —     │      —          │ ← GAP: missing test
│  DELETE: 409 if CONFIRMED  │   ✓    │     ✓        │     ✓     │      —          │
└──────────────────────────────────────────────────────────────────────────────────┘
```

**Gap types:**

| Symbol | Meaning | Action |
|--------|---------|--------|
| ✓ | Present and matches | Include in test |
| ✗ MISSING | Absent from this source | See row rule below |
| ✓ NEW | Newly added in PR | Write new scenario; classify type; apply tag set |
| CHANGED | Behaviour changed (type, null, enum) | Update existing test + regression scenario |
| REMOVED | Removed per PR | Remove assertion; add `@negative` scenario |
| PRD only | PRD requires it, nothing else has it | Write test; tag `@manual @pending` |
| PRD > PR | PRD and PR disagree | Write test for PRD behaviour; tag `@manual`; raise PR comment |
| CONFLICT | PR says X, ERD says Y (PRD silent) | ERD wins; raise to developer |

---

### Step 2b — Per-Method Response Validation Rules

#### ALL-KEYS VALIDATION MANDATE (applies to every HTTP method)

**Every field in the API response contract MUST have a typed assertion. Asserting status code only is not sufficient.**

```
FIELD TYPE RULES (mandatory — no exceptions):

  String   (required)  → assertNotNull + assertFalse(blank)
  String   (nullable)  → assertNotNull when non-null scenario; assert null when null scenario
  Integer / Long       → assertNotNull + assertTrue(value >= 0)   ← unless domain allows negative
  Float / Double / BigDecimal → assertNotNull + assertTrue(value >= 0.0)
  Boolean              → assertNotNull + assertEquals(expected true/false)
  Enum string          → assertNotNull + assertTrue(allowed set contains value)
  Array / List
    non-empty contract → assertNotNull + assertFalse(list.isEmpty()) + validate items[0] all keys
    can-be-empty       → assertNotNull + (if non-empty in test data) validate items[0] all keys
  Object / nested      → assertNotNull at object level + validate every child key by its type
```

**CommonStepDef steps for typed assertions (add once — do NOT duplicate per domain):**

```gherkin
# String not null
Then Verify response field "{jsonPath}" is not null
# String not null + not blank  (also works for arrays — checks list.isEmpty())
Then Verify response field "{jsonPath}" is not null and not empty
# Integer / Long not null and >= min
Then Verify response integer field "{jsonPath}" is not null and >= {int}
# Float / Double / BigDecimal not null and >= min
Then Verify response number field "{jsonPath}" is not null and >= {double}
# Enum: value must be one of the comma-separated set
Then Verify response field "{jsonPath}" is one of "{VAL1,VAL2,VAL3}"
# Array size >= min (use after "not null and not empty" for exact min-bound)
Then Verify response array field "{jsonPath}" has size >= {int}
```

**Java implementations (add to CommonStepDef.java — see `qa/api/agent/agent.md` for full code).**

Before writing test assertions, apply the correct validation rules for each HTTP method.

#### GET — Validation Checklist

```
RESPONSE FIELDS (apply ALL-KEYS mandate — every key typed):
✓ Status code 200 for valid params
✓ Every required String field: not null + not blank
✓ Every Integer/Long field:    not null + >= 0 (or domain-specified min)
✓ Every Float/Double field:    not null + >= 0.0 (or domain-specified min)
✓ Every Boolean field:         not null + assertEquals(expected value)
✓ Every Enum string field:     not null + is one of "ALLOWED,VALUES,HERE"
✓ Every Array field (non-empty): not null + not empty + validate items[0] all child keys
✓ Every Array field (can-empty): not null + (validate items[0] keys when data present)
✓ Every nested Object field:   not null at object level + validate each child key by type
✓ Nullable fields: one scenario where field IS null, one where it is non-null
✓ Pagination (nextUrl, prevUrl, total): not null + total >= 0

SCHEMA:
✓ JSON schema validated: Verify Api Response is correct with Schema "<Service>.json"

NEGATIVE:
✗ Status 400 for each invalid/missing required query param
✗ Status 401 for missing/expired/invalid auth token
✗ Status 404 for non-existent resource ID
✗ Status 429 if rate limiting applies (per PRD)
```

Gherkin template — GET validation:
```gherkin
# Happy path
Given User set "<endpoint-key>" and "<repo>" Api endpoint
And   User set request headers
And   User set query parameters "<key>" and "<value>" for api
When  User sends the get request
Then  Verify message "" and status code "200" for api
And   Verify response field "<jsonPath>" is not null
And   Verify response field "<jsonPath>" has value "<expected>"
Then  Verify Api Response is correct with Schema "<Schema>.json"

# Negative — missing required param
Given User set "<endpoint-key>" and "<repo>" Api endpoint
And   User set request headers
When  User sends the get request
Then  Verify message "<errorMessage>" and status code "400" for api

# Negative — not found
Given User set "<endpoint-key>" and "<repo>" Api endpoint
And   User set request headers
And   User set query parameters "<key>" and "NONEXISTENT_ID" for api
When  User sends the get request
Then  Verify message "<errorMessage>" and status code "404" for api
```

#### POST — Validation Checklist

```
REQUEST BODY:
✓ All @NotNull / required fields included in happy-path body
✓ Optional fields tested both present and absent
✓ Enum fields in body: test ALL allowed values (one scenario per enum value)
✓ Integer/Long body fields: test min boundary (from @Min / ERD CHECK) + max boundary
✓ Array fields: test min size (per PRD/ERD), max size, empty array

RESPONSE (apply ALL-KEYS mandate — every key typed):
✓ Status 200/201 for valid body
✓ Every String field in response:  not null + not blank
✓ Every Integer/Long field:        not null + >= 0 (or domain min)
✓ Every Float/Double field:        not null + >= 0.0 (or domain min)
✓ Every Boolean field:             not null + assertEquals(expected value)
✓ Every Enum field in response:    not null + is one of allowed set
✓ Created resource ID (data.id / data.bookingId etc.):  not null + >= 0
✓ Resource status: not null + is one of "CONFIRMED,PENDING,..." (initial state per PRD)
✓ Every Array in response:  not null + (not empty if contract requires) + validate items[0] keys
✓ Every nested Object:      not null + validate each child key by type
✓ JSON schema validated: Verify Api Response is correct with Schema "<Service>.json"

NEGATIVE:
✗ Status 400 for each missing required body field (one scenario per required field)
✗ Status 400 for each invalid field value (wrong type, boundary violation)
✗ Status 400 for invalid enum value in body
✗ Status 401 for missing/invalid auth
✗ Status 409 for duplicate / conflict (if applicable per PRD)
✗ Status 422 for valid JSON but business rule violation
```

Gherkin template — POST validation:
```gherkin
# Happy path — full valid body
Given User set "<endpoint-key>" and "<repo>" Api endpoint
And   User set request headers
And   User set body parameters "variantId" and "12345" for api
And   User set body parameters "currency" and "USD" for api
And   User set body parameters "paxCount" and "2" for api
When  User sends the post request
Then  Verify message "" and status code "200" for api
And   Verify response field "data.bookingId" is not null
And   Verify response field "data.status" has value "CONFIRMED"
Then  Verify Api Response is correct with Schema "BookingCreate.json"

# Negative — missing required field (one scenario per required field)
Given User set "<endpoint-key>" and "<repo>" Api endpoint
And   User set request headers
And   User set body parameters "currency" and "USD" for api
# variantId intentionally omitted
When  User sends the post request
Then  Verify message "variantId is required" and status code "400" for api

# Negative — invalid enum value
Given User set "<endpoint-key>" and "<repo>" Api endpoint
And   User set request headers
And   User set body parameters "currency" and "INVALID_CURRENCY" for api
When  User sends the post request
Then  Verify message "Invalid currency" and status code "400" for api

# Negative — conflict
Given A booking already exists for variantId "12345" at "2024-06-15T10:00:00"
When  User creates another booking for the same variant and time
Then  Verify message "Variant already booked" and status code "409" for api
```

#### PUT — Validation Checklist

```
REQUEST BODY:
✓ All fields required for PUT (full replacement — every field must be sent)
✓ Idempotency: PUT same body twice → second response identical to first
✓ Integer/Long body fields: test min boundary + max boundary (from @Min/@Max / ERD CHECK)

RESPONSE (apply ALL-KEYS mandate — every key typed):
✓ Status 200 with full updated resource
✓ Every String field:   not null + not blank
✓ Every Integer/Long:   not null + >= 0
✓ Every Float/Double:   not null + >= 0.0
✓ Every Boolean field:  not null + assertEquals(expected value)
✓ Every Enum field:     not null + is one of allowed set
✓ Every Array:          not null + (if non-empty contract) not empty + validate items[0] keys
✓ Every Object:         not null + validate each child key by type
✓ All fields in response match what was sent in the PUT body
✓ updatedAt / modifiedAt timestamp advanced
✗ Status 400 for missing required body field
✗ Status 404 for non-existent resource
✗ Status 409 for state conflict (e.g. cannot PUT CANCELLED booking)
```

#### PATCH — Validation Checklist

```
REQUEST BODY:
✓ Partial body — only fields being changed
✓ Each optional field tested independently (send only that field)
✓ Empty body → 400 or 200 (verify per PRD)
✓ Idempotency: PATCH same value twice → second response identical
✓ Integer/Long fields: test boundary values when patching numeric fields

RESPONSE (apply ALL-KEYS mandate — every key typed):
✓ Status 200 with full updated resource
✓ Every String field in response:  not null + not blank
✓ Every Integer/Long field:        not null + >= 0
✓ Every Float/Double field:        not null + >= 0.0
✓ Every Boolean field:             not null + assertEquals(expected value)
✓ Every Enum field:                not null + is one of allowed set
✓ Every Array:                     not null + validate items[0] keys if non-empty
✓ Every Object:                    not null + validate each child key by type
✓ Changed field updated to new value — assertNotNull + assertEquals(newValue)
✓ Unchanged fields preserved — assert they still hold original values
✓ updatedAt timestamp advanced
✗ Status 400 for invalid field value
✗ Status 404 for non-existent resource
✗ Status 409 for state machine conflict (e.g. cannot patch CANCELLED booking)
✗ Status 422 for business rule violation (valid JSON, invalid business state)
```

Gherkin template — PATCH validation:
```gherkin
# Happy path — partial update (coupon only)
Given User set "booking-patch-v2" and "" Api endpoint
And   User set request headers
And   User set body parameters "couponCode" and "SAVE10" for api
When  User sends the patch request
Then  Verify message "" and status code "200" for api
And   Verify response field "data.couponCode" has value "SAVE10"
And   Verify response field "data.bookingId" is not null

# Verify untouched fields preserved
And   Verify response field "data.status" has value "CONFIRMED"
And   Verify response field "data.variantId" has value "12345"

# Negative — invalid state transition
Given A booking with status "CANCELLED" exists
When  User patches the booking with couponCode "SAVE10"
Then  Verify message "Cannot modify a cancelled booking" and status code "409" for api
```

#### DELETE — Validation Checklist

```
RESPONSE (apply ALL-KEYS mandate for 200 body — every key typed):
✓ Status 200 (with deleted resource summary) OR 204 No Content — verify per PRD
✓ If 200: every String field in body: not null + not blank
✓ If 200: every Integer/Long field:   not null + >= 0
✓ If 200: resource status field:      not null + equals "DELETED" (or PRD-defined final state)
✓ After DELETE: GET the same resource → must return 404
✓ After DELETE: GET list → resource must NOT appear in results (assertFalse contains)
✗ Status 404 for non-existent resource ID
✗ Status 409 for conflict (e.g. cannot delete an active/confirmed booking)
✗ Status 401 for missing/invalid auth
✗ Double DELETE: second DELETE returns 404 (idempotent)
```

Gherkin template — DELETE validation:
```gherkin
# Happy path
Given User set "booking-delete-v2" and "" Api endpoint
And   User set request headers
When  User sends the delete request
Then  Verify message "" and status code "200" for api
And   Verify response field "data.status" has value "DELETED"

# Follow-up GET must return 404
Given User set "booking-get-v2" and "" Api endpoint
And   User set request headers
When  User sends the get request
Then  Verify message "Booking not found" and status code "404" for api

# Negative — conflict
Given A booking with status "CONFIRMED" and upcoming date exists
When  User deletes the booking
Then  Verify message "Cannot delete an active booking" and status code "409" for api

# Negative — double delete (idempotency)
Given The booking "BK-001" has already been deleted
When  User attempts to delete booking "BK-001" again
Then  Verify message "Booking not found" and status code "404" for api
```

#### Response Error Body — Standard Validation

Every non-2xx response must validate the error structure. Add to every negative scenario:

```java
// CommonStepDef.java — add once
@Then("Verify error body has code {string} and message containing {string}")
public void verifyErrorBody(String expectedCode, String expectedMsgFragment) {
    softAssertionUtil.get().assertEquals(
        response.get().jsonPath().getString("error.code"),
        expectedCode,
        "Error code mismatch"
    );
    softAssertionUtil.get().assertTrue(
        response.get().jsonPath().getString("error.message").contains(expectedMsgFragment),
        "Error message does not contain: " + expectedMsgFragment
    );
    softAssertionUtil.get().assertAll();
}

@Then("Verify error field {string} is listed in validation errors")
public void verifyValidationErrorField(String fieldName) {
    List<String> fields = response.get().jsonPath().getList("error.fields");
    softAssertionUtil.get().assertTrue(
        fields != null && fields.contains(fieldName),
        "Expected field [" + fieldName + "] in error.fields but got: " + fields
    );
    softAssertionUtil.get().assertAll();
}
```

---

### Step 3 — Gap → New Test Case Generation

For every gap detected, generate a test case using **only existing reuse steps**.
Never create new step definitions for gaps that reuse steps can cover.

#### API Layer (crest) — Gap → Feature Scenario

```gherkin
# Gap: items[].discountPrice newly added per PR, not yet in existing test
# Resolution: new scenario using CommonStepDef reuse steps only

@headout @inventory @test @test-regression @ode-regression @pending
Scenario Outline: Verify discount price field is present in inventory response for variant "<variantId>"
  Given User set "inventory-v2" and "calipso" Api endpoint
  And User set request headers
  And User set query parameters "variantId" and "<variantId>" for api
  When User sends the get request
  Then Verify message "" and status code "200" for api
  And Verify response field "items[0].pricing.discountPrice" is not null
  And Verify response field "items[0].pricing.discountPrice" type is "number"
  Examples:
    | variantId |
    | 12345     |
    | 67890     |
```

If the generic assertion step does not yet exist in `CommonStepDef.java`,
add it once and reuse it across all gap scenarios:

```java
// CommonStepDef.java — add once, reuse everywhere
@Then("Verify response field {string} is not null")
public void verifyResponseFieldNotNull(String jsonPath) {
    softAssertionUtil.get().assertNotNull(
        response.get().jsonPath().getString(jsonPath),
        "Expected field [" + jsonPath + "] to be non-null but was null"
    );
    softAssertionUtil.get().assertAll();
}

@Then("Verify response field {string} has value {string}")
public void verifyResponseFieldValue(String jsonPath, String expectedValue) {
    softAssertionUtil.get().assertEquals(
        response.get().jsonPath().getString(jsonPath),
        expectedValue,
        "Field [" + jsonPath + "] value mismatch"
    );
    softAssertionUtil.get().assertAll();
}

@Then("Verify response field {string} type is {string}")
public void verifyResponseFieldType(String jsonPath, String expectedType) {
    Object actual = response.get().jsonPath().get(jsonPath);
    switch (expectedType.toLowerCase()) {
        case "string"  -> softAssertionUtil.get().assertTrue(actual instanceof String,  "Expected string at " + jsonPath);
        case "integer" -> softAssertionUtil.get().assertTrue(actual instanceof Integer, "Expected integer at " + jsonPath);
        case "number"  -> softAssertionUtil.get().assertTrue(actual instanceof Number,  "Expected number at " + jsonPath);
        case "boolean" -> softAssertionUtil.get().assertTrue(actual instanceof Boolean, "Expected boolean at " + jsonPath);
        case "array"   -> softAssertionUtil.get().assertTrue(actual instanceof List<?>, "Expected array at " + jsonPath);
        default        -> softAssertionUtil.get().fail("Unknown type: " + expectedType);
    }
    softAssertionUtil.get().assertAll();
}
```

#### UI Layer (celium) — Gap → Scenario

```gherkin
# Gap: PR adds discountPrice display on checkout page, no UI test covers it

@headout @checkout @test @test-regression @pending
Scenario: Verify discount price is displayed on checkout page
  Given User create new booking with product "12345" and currency "USD" from api
  And   User opens the application "celium" and "checkout"
  Then  Verify "discountPrice" label is visible on checkout summary
  And   Verify "discountPrice" value is not empty
```

New step added to `CheckoutStepDef.java` only if not in `CommonStepDef`,
calling `checkoutPO.verifyFieldVisible(field)` — no locator in the step def.

#### Visual Diff Layer (vd) — Gap → VD Test Entry

```json
{
  "testId": "checkout-discount-price-vd",
  "description": "Visual diff: discount price label on checkout summary",
  "url": "https://www.headout.com/checkout?bookingId={{bookingId}}",
  "captureType": "ELEMENT",
  "selector": "[data-qa-marker='checkout-discount-price']",
  "selectorType": "CSS",
  "baseline": "gap-new",
  "actions": [
    {
      "action": "WAIT_FOR_ELEMENT",
      "locator": "[data-qa-marker='checkout-discount-price']",
      "locatorType": "CSS"
    }
  ]
}
```

#### Mobile Layer (appium) — Gap → Scenario

```gherkin
# Gap: PR adds discountPrice to booking confirmation screen, not tested on mobile

@android @ios @test @pending
Scenario: Verify discount price on booking confirmation screen
  Given User create new booking with product "12345" and currency "USD" from api
  And   Get all booking details using booking id "bookingId"
  Then  Verify discount price label is visible on confirmation screen
  And   Verify discount price value matches booking total discount
```

---

### Step 4 — Cross-Layer Consistency Check

After generating gap scenarios, verify the same field/behaviour is tested
at every applicable layer. Use this matrix:

```
FIELD / BEHAVIOUR          │ API (crest) │ UI (celium) │ VD (pixify) │ App (appium)
───────────────────────────┼─────────────┼─────────────┼─────────┼─────────────
discountPrice — new field  │   ✓ gap     │   ✓ gap     │  ✓ gap  │   ✓ gap
status code 200            │   ✓         │    —        │   —     │    —
availability enum values   │   ✓         │   ✓         │  ✓      │   ✓
404 for unknown variant    │   ✓         │   ✓         │   —     │   ✓
```

- `✓ gap` = new test case must be created for that layer.
- `—` = layer is not responsible for that assertion.
- `✓` = coverage already exists — no new test needed.

**Rule:** If an API field affects visible UI output → cover at API + UI minimum.
If it renders a page section → add VD. If mobile app renders it → add appium.

---

### Step 5 — Validation Decision Tree

```
New or changed test case needed?
  │
  ├─► COLLECT sources of truth (priority order)
  │     [1] PRD / product spec  (Notion / Google Doc / Confluence)  ← read FIRST
  │     [2] ERD / data model    (schema / Swagger / proto)
  │     [3] GET response map    (cURL or CommonStepDef steps)
  │     [4] PR description/diff (changed files / PR description)
  │
  ├─► PRD CONFLICT CHECK (before gap analysis)
  │     PRD vs PR disagree?
  │       → PRD wins. Write test for PRD behaviour.
  │         Tag @manual. Add # PRD Ref comment. Raise PR comment.
  │     PRD silent, PR + ERD agree?
  │       → proceed with PR + ERD as authority
  │     PR + ERD conflict (PRD silent)?
  │       → ERD wins. Raise discrepancy to developer.
  │
  ├─► RUN gap analysis (all four sources)
  │     No gaps? → test is complete — proceed to Type + Tag Classification
  │
  ├─► GAP FOUND?
  │
  │     PRD requires it, nothing else has it?
  │       → @manual @pending scenario
  │         add # PRD Ref: <doc> <section> comment
  │
  │     Field missing from GET, present in PR or ERD?
  │       → @pending scenario — field not yet released
  │
  │     Field NEW per PR (now in GET + ERD)?
  │       → new scenario using CommonStepDef reuse steps
  │         add to CommonStepDef ONLY if step is generically reusable
  │
  │     Field CHANGED (type, null, enum)?
  │       → update assertion in existing scenario
  │         + @test-regression scenario for old vs new behaviour
  │
  │     Field REMOVED per PR?
  │       → remove assertion from existing scenario
  │         + @negative scenario verifying field is absent
  │
  ├─► TEST TYPE CLASSIFICATION (for every new scenario)
  │     Is it testing a single method/class in isolation?  → @modular
  │     Is it testing one API end-to-end?                  → @service
  │     Does it call two or more real services?            → @integration
  │     Does it test boundary / abnormal inputs?           → @edge
  │     Is it a cross-service user journey?                → @test-headout-e2e-flow
  │
  ├─► ENV + SUITE-DEPTH TAGGING (for every new scenario)
  │     Is it the single most critical happy path?         → add @test-sanity
  │     Is it a main positive path?                        → add @test-smoke
  │     Is it regression / negative / edge?                → add @test-regression
  │     Should it run on ODE?                              → add @ode-regression
  │     Should it run on live (read-only)?                 → use @live-sanity / @live-smoke
  │     Is it @manual or @pending?                         → do NOT add @test-sanity or @test-smoke
  │
  ├─► CROSS-LAYER CHECK
  │     Does the change affect UI / VD / App?
  │       YES → create gap scenario for each affected layer
  │             apply same type + tag classification per layer
  │       NO  → API test only is sufficient
  │
  └─► REUSE GATE (mandatory last step — see Reuse Checklist above)
        Every new step text searched in CommonStepDef + all *StepDef files first
```

---

### Gap Scenario Tagging Rules

| Situation | Required tags | Notes |
|-----------|---------------|-------|
| Gap: field released, happy path | `@test @test-smoke @test-regression @ode-regression` + domain tag + type tag | Add `@test-sanity` only if it is the single critical path |
| Gap: field NOT released | add `@pending` | Keep scenario — documents intent |
| Gap: PRD conflict | add `@manual @pending` | Add `# PRD Ref:` comment |
| Gap: regression / changed behaviour | add `@test-regression` | + old vs new behaviour scenario |
| Gap: removed field | add `@negative @test-regression` | Verify field no longer in response |
| Gap: edge / boundary | add `@edge @test-regression @negative` | Pair with parent type tag |
| Gap: integration (cross-service) | add `@integration @test-regression @ode-regression` | Needs full stack |
| Gap: cross-layer (UI) | domain tag + `@test @test-regression` | Celium: PO method call only |
| Gap: cross-layer (VD) | VD test entry with `WAIT_FOR_ELEMENT` action | No Gherkin needed |
| Gap: cross-layer (App) | domain tag + `@android @ios @test` | Appium reuse steps |
| Live environment | `@live-sanity` or `@live-smoke` | Read-only checks ONLY |

---

### Complete Validation Checklist (All Layers)

**Sources collected (in priority order):**
- [ ] PRD / product spec read — acceptance criteria, business rules, error messages, enums extracted
- [ ] API GET response field map documented (all fields, types, nullable)
- [ ] PR diff reviewed — new / changed / removed fields extracted
- [ ] ERD / data model reviewed — entity fields and constraints noted

**Conflict resolution done:**
- [ ] PRD ↔ PR conflicts identified and resolved — PRD wins; `@manual` tag applied; PR comment raised
- [ ] PR ↔ ERD conflicts (PRD silent) resolved — ERD wins; raised to developer
- [ ] PRD-only requirements documented as `@manual @pending` scenarios with `# PRD Ref:` comments

**Gap analysis complete:**
- [ ] Every planned assertion cross-checked against all 4 sources
- [ ] Gap matrix filled (PRD / GET / PR / ERD per field)
- [ ] Gap matrix cross-layer column filled (API / UI / VD / App per affected field)
- [ ] All gaps classified: NEW / CHANGED / REMOVED / PRD-ONLY / PRD>PR / CONFLICT / PENDING

**Test type classified (per scenario):**
- [ ] Every scenario carries one of: `@modular`, `@service`, `@integration`, `@edge`, or E2E flow tag
- [ ] `@modular` scenarios have no real network calls
- [ ] `@service` scenarios test exactly one API
- [ ] `@integration` scenarios call two or more real services
- [ ] `@edge` scenarios cover all boundary values, nulls, and enum exhaustion from PRD

**Environment + suite-depth tagged (per scenario):**
- [ ] Every scenario has at least one environment tag (`@test` / `@live` / `@ondemand`)
- [ ] Every scenario has at least one suite-depth tag (`@test-sanity` / `@test-smoke` / `@test-regression`)
- [ ] `@test-sanity` applied to 1–3 critical happy-path scenarios per feature only
- [ ] `@test-smoke` applied to all sanity + main positive paths
- [ ] `@test-regression` applied to all regression / negative / edge scenarios (default for new scenarios)
- [ ] `@live-sanity` / `@live-smoke` used for production checks (read-only only)
- [ ] `@negative` applied to all error-path scenarios
- [ ] `@pending` applied to any unreleased field scenario
- [ ] `@manual` applied to PRD-conflict scenarios; `# PRD Ref:` comment present

**API contract collected (per HTTP method — before writing any test):**
- [ ] Full API Contract Table filled (B6) — source marked: Live / PR DTO / ERD / PRD
- [ ] GET: response field map documented (all fields, types, nullable)
- [ ] POST: required/optional request body fields identified from PR `@NotNull` / ERD `NOT NULL`
- [ ] POST: all enum values in request body identified (from PR enum type or PRD)
- [ ] POST: boundary values identified from PR `@Min`/`@Max` or ERD `CHECK` constraints
- [ ] PUT: full body requirement confirmed (all fields required for replacement)
- [ ] PATCH: partial body fields identified (only Optional<> / nullable fields)
- [ ] DELETE: response shape confirmed (200 with body OR 204 No Content — per PRD)
- [ ] Error response structure documented for each method (error.code + error.message shape)

**ALL-KEYS validation applied (mandatory for every scenario):**
- [ ] Every response `String` field: `assertNotNull` + `assertFalse(blank)`
- [ ] Every response `Integer`/`Long` field: `assertNotNull` + `assertTrue(value >= 0)`
- [ ] Every response `Float`/`Double`/`BigDecimal` field: `assertNotNull` + `assertTrue(value >= 0.0)`
- [ ] Every response `Boolean` field: `assertNotNull` + `assertEquals(expected)`
- [ ] Every response `Enum` string field: `assertNotNull` + `is one of "ALLOWED,SET"`
- [ ] Every response `Array` (non-empty contract): `assertNotNull` + `assertFalse(empty)` + all items[0] child keys validated by type
- [ ] Every response `Array` (can-be-empty): `assertNotNull` + (validate items[0] when data has elements)
- [ ] Every response `Object`/nested: `assertNotNull` at object level + all child keys validated by type recursively
- [ ] No scenario asserts only status code — at least one typed field assertion required
- [ ] `softAssertionUtil.get().assertAll()` is the last call in every `@Then`

**Per-method scenarios generated (Step 2b rules applied):**
- [ ] GET: happy path (all keys validated by type) + schema validation + 400/401/404 negative scenarios
- [ ] POST: happy path (all response keys validated) + schema + 400 per required field + enum invalid + 409 conflict
- [ ] PUT: happy path (all keys validated) + idempotency check + 400/404/409
- [ ] PATCH: happy path each optional field (all keys validated) + preserved-field check + 409 state conflict
- [ ] DELETE: happy path + follow-up GET → 404 + double-DELETE → 404 + 409 conflict
- [ ] Every negative scenario tagged `@negative @test-regression`
- [ ] Every boundary/enum scenario tagged `@edge @test-regression`

**Gap test cases generated (per gap, per applicable layer):**
- [ ] API (crest): new scenario using CommonStepDef reuse steps
- [ ] UI (celium): new scenario calling existing PO methods
- [ ] VD (vd): new VD test entry if field is visible on page
- [ ] App (appium): new scenario if field rendered in mobile app
- [ ] No new step definitions added unless the step is generically reusable
- [ ] New generic steps added to `CommonStepDef.java` only, not domain step defs
