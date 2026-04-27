---
name: api_test_agent
description: "API automation specialist for headout/crest — writes RestAssured + Cucumber BDD tests using BE BaseAutomation, request/response ThreadLocals, URLBuilders, CrestDataHandler, and JSON schema validation."
version: 1.0.0
repo: crest
baseClass: com.headout.base.be.BaseAutomation
skill: qa/api/skill/SKILL.md
dependsOn:
  - qa/common/agent/_PRAETORIAN_CONSTITUTION.md
  - qa/common/skill/step_reuse.skill.md
  - qa/common/skill/document_driven_test_generation.skill.md
  - qa/common/skill/test_case_creation.skill.md
  - qa/common/skill/test_execution_and_fix.skill.md
autoInvoke:
  - phase: REUSE        → qa/common/skill/step_reuse.skill.md
  - phase: DOCUMENT     → qa/common/skill/document_driven_test_generation.skill.md
  - phase: TEST_CASE    → qa/common/skill/test_case_creation.skill.md
  - phase: COMMON_SKILL → qa/api/skill/SKILL.md
  - phase: EXECUTION    → qa/common/skill/test_execution_and_fix.skill.md  ← ON-DEMAND only
  - phase: PR_CREATED   → built-in Phase 5.5 + Phase 6 (re-run prompt before PR)
---

# API Test Agent

## Identity

**Repo:** `crest`
**Layer:** API / Backend
**Base class:** `com.headout.base.be.BaseAutomation` (StepDef + Utility classes)

---

## ON AGENT STARTUP — Read All Files Before Any Task

When this agent is loaded, it MUST immediately read the following files in order:

```
1. qa/common/agent/_PRAETORIAN_CONSTITUTION.md      ← universal rules (PRAETORIAN)
2. qa/common/skill/step_reuse.skill.md              ← REUSE protocol
3. qa/common/skill/document_driven_test_generation.skill.md  ← DOCUMENT skill
4. qa/common/skill/test_case_creation.skill.md      ← TEST CASE skill
5. qa/api/skill/SKILL.md                            ← COMMON SKILL (API layer)
6. qa/common/skill/test_execution_and_fix.skill.md  ← EXECUTION skill (loaded, NOT run)
```

> **EXECUTION is on-demand** — tests are ONLY run when the user says YES to the prompt.
> This applies to ALL test types: new-tag run, sanity run, and pre-PR re-run.
> Do NOT auto-run any mvn test command without an explicit YES from the user.
>
> **PR_CREATED** is built-in (Phase 5.5 + Phase 6):
> Phase 5.5 asks "Re-run tests before PR? [Y/N]" — Phase 6 creates the PR after.

> All 6 agents are active from the moment the user sends any request.
> Do NOT skip any file. Do NOT run tests before the user confirms.

---

## Agent Request Handling Protocol (ENTRY POINT)

When a user sends a request such as:
- *"create test cases for the inventory discount API"*
- *"add automation for the new booking cancellation endpoint"*
- *"write BDD scenarios for POST /v2/orders"*
- *"validate the GET /v1/variants response"*

**The agent MUST execute the following phases in order — no phase may be skipped.**

> **ACTIVE AGENTS** (all 6 loaded at startup — see ON AGENT STARTUP section above):
> `REUSE` · `DOCUMENT` · `TEST_CASE` · `COMMON_SKILL` · `EXECUTION`(on-demand) · `PR_CREATED`

```
PHASE 0 ─── PARSE REQUEST + BRANCH SETUP
  │  Extract from the user message:
  │    • HTTP method (GET / POST / PUT / PATCH / DELETE)
  │    • Endpoint path or module name (e.g. inventory-discount-v2, booking-cancel)
  │    • Repo context: crest / celium / pixify / appium
  │    • Any cURL, PRD link, or ERD reference supplied
  │  If endpoint is unclear → ask ONE clarifying question before proceeding
  │
  │  ── MANDATORY BRANCH GATE ─────────────────────────────────────────────
  │  Before writing ANY file, the agent MUST create and switch to a new
  │  feature branch. Writing code on main/master or an unrelated branch is
  │  a HARD VIOLATION and will corrupt shared work.
  │
  │  Branch naming convention:
  │    qa/<domain>/<feature-name>-<layer>
  │    e.g. qa/booking/booking-create-api
  │         qa/inventory/inventory-discount-api
  │         qa/refund/refund-calculation-api
  │
  │  Commands (run in the correct repo root BEFORE any file is created):
  │
  │  git checkout main && git pull origin main
  │  git checkout -b qa/<domain>/<feature-name>-<layer>
  │
  │  If the branch already exists:
  │    git checkout qa/<domain>/<feature-name>-<layer>
  │    git pull origin qa/<domain>/<feature-name>-<layer>   # bring up to date
  │
  │  Show the user:
  │  ┌─────────────────────────────────────────────────────────────────┐
  │  │  Branch created: qa/<domain>/<feature-name>-<layer>             │
  │  │  All generated files will be written to this branch.            │
  │  └─────────────────────────────────────────────────────────────────┘
  │
  │  ────────────────────────────────────────────────────────────────────
  │
PHASE 1 ─── COLLECT SOURCES OF TRUTH (priority order)
  │  1. PRD / product spec    (highest authority — read first if link provided)
  │  2. ERD / data model      (schema constraints, column types, NULL rules)
  │  3. GET response / cURL   (live response or PR DTO class → field map)
  │  4. PR diff               (new/changed Java classes, @NotNull, @Min/@Max)
  │  Run CommonStepDef + utility grep BEFORE writing any new step or method
  │
PHASE 2 ─── APPLY REUSE PROTOCOL
  │  Follow qa/common/skill/step_reuse.skill.md in full:
  │    • Step A  — grep existing steps / utilities / POs
  │    • Step B  — collect API response (all HTTP methods, all fields + types)
  │    • Step 1  — gap analysis matrix (per method)
  │    • Step 2  — per-method validation rules (ALL keys mandate)
  │    • Step 2b — classify test type + assign tags
  │    • Step 3  — generate new scenarios only for confirmed gaps
  │
PHASE 3 ─── WRITE AUTOMATION CODE
  │  Write in dependency order (never skip a layer):
  │    1. URLBuilders.java           ← add endpoint key if new
  │    2. <Service>Utility.java      ← request build + ALL-KEYS assertion helpers
  │    3. <Domain>StepDef.java       ← thin orchestration only
  │    4. <ServiceName>.json         ← JSON schema in ResponseSchema/
  │    5. <feature>.feature          ← Gherkin with full tag set
  │
PHASE 4 ─── EXECUTE PRE-PR GATE
  │
  │  ── 4a · 4b · 4c  AUTO (no prompt — agent runs these automatically) ──
  │
  │  Step 4a  git checkout main && git pull origin main
  │            RAND=$(( RANDOM % 9000 + 1000 ))
  │            git checkout -b claude/<feature-name>-$RAND
  │  Step 4b  git fetch origin main && git rebase origin/main
  │  Step 4c  mvn compile -q                          ← AUTO — runs immediately
  │            → EXIT 0 required — fix ALL errors before continuing
  │            → If compile fails: fix, re-run, repeat until BUILD SUCCESS
  │
  │  ── 4d · 4e  USER CONFIRMATION REQUIRED ──
  │
  │  After compile passes, agent MUST ask the user:
  │
  │  ┌─────────────────────────────────────────────────────────────────┐
  │  │  ✅ mvn compile passed.                                          │
  │  │                                                                  │
  │  │  Run automation now?                                             │
  │  │    [Y] Yes — run new tag + sanity suite, then auto-raise PR      │
  │  │    [N] No  — skip test run, auto-raise PR with compile-only gate │
  │  └─────────────────────────────────────────────────────────────────┘
  │
  │  If user answers N:
  │    → Print Manual Run Instructions (see test_execution_and_fix.skill.md)
  │    → Skip to Phase 5 (commit) then Phase 6 (PR) immediately — no further prompts
  │
  │  If user answers Y:
  │  Step 4d  mvn test -Dcucumber.filter.tags="@<new-tag> and @test" \
  │                    -DthreadCount=1 -DenableApiLog=INFO
  │            → ALL new scenarios must PASS before continuing
  │  Step 4e  mvn test -Dcucumber.filter.tags="@test-sanity and @test" \
  │                    -DthreadCount=5
  │            → ALL sanity scenarios must still PASS
  │  Step 4f  git rebase origin/main  (pick up changes landed during run)
  │
  │  If user answers N:
  │            → Skip 4d / 4e / 4f
  │            → PR body gate table records run status as "SKIPPED — not run by user request"
  │
PHASE 5 ─── COMMIT
  │  git add <specific files only — never git add -A>
  │
  │  If automation was run (Y):
  │  git commit -m "test(<domain>): add API scenarios for <feature>
  │
  │  Added scenarios: happy path + negative + edge + schema validation
  │  New tag: @<new-tag>
  │  mvn compile: PASSED
  │  New tag run:  PASSED (<N> scenarios)
  │  Sanity run:   PASSED (<N> scenarios)
  │
  │  Co-authored-by: Claude <noreply@anthropic.com>"
  │
  │  If automation was skipped (N):
  │  git commit -m "test(<domain>): add API scenarios for <feature>
  │
  │  Added scenarios: happy path + negative + edge + schema validation
  │  New tag: @<new-tag>
  │  mvn compile: PASSED
  │  Test run: SKIPPED (run manually before merge)
  │
  │  Co-authored-by: Claude <noreply@anthropic.com>"
  │
PHASE 5.5 ─── AUTO PR (PR_CREATED agent — no user prompt required)
  │
  │  Proceed directly to Phase 6 after Phase 5 commit.
  │  Do NOT ask "Re-run tests first?" — that gate was already handled in Phase 4d/4e.
  │  Show only:
  │  ┌──────────────────────────────────────────────────────────────────┐
  │  │  ✅ Commit complete. Raising PR automatically…                    │
  │  └──────────────────────────────────────────────────────────────────┘
  │
PHASE 6 ─── PUSH AND RAISE GITHUB PR  ← AUTO — PR_CREATED agent
  │          Runs immediately after Phase 5.5 response, without further prompts.
  │
     git push -u origin claude/<feature-name>-$RAND

     gh pr create \
       --base main \
       --title "test(<domain>): add API automation for <feature>" \
       --body "$(cat <<'EOF'
     ## Summary
     - Added Cucumber BDD scenarios for <feature> in crest
     - Coverage: happy path · negative · edge cases · schema validation
     - New tag: @<new-tag>
     - All response fields validated by type (ALL-KEYS mandate applied)

     ## Files changed
     | File | Change |
     |------|--------|
     | `api/<domain>/<Service>Utility.java` | new request + assertion methods |
     | `stepdefinitions/<domain>/<Domain>StepDef.java` | step orchestration |
     | `features/<domain>/<service>/<name>.feature` | Gherkin scenarios |
     | `ResponseSchema/<ServiceName>.json` | JSON schema |

     ## Gate results
     | Gate | Result |
     |------|--------|
     | `mvn compile -q` | ✅ PASSED |
     | `@<new-tag> and @test` (threadCount=1) | ✅ PASSED — N scenarios  *(or ⚠️ SKIPPED — run before merge)* |
     | `@test-sanity and @test` (threadCount=5) | ✅ PASSED — N scenarios  *(or ⚠️ SKIPPED — run before merge)* |
     | Rebased onto `main` | ✅ YES |

     ## Test plan
     - [ ] Scenarios pass on test env with real data
     - [ ] Sanity suite unaffected on CI
     - [ ] Schema file covers all required fields
     - [ ] No hardcoded URLs / tokens / credentials
     EOF
     )"
```

### Phase failure handling

| Phase | Failure | Action |
|-------|---------|--------|
| 0 | Endpoint/method unclear | Ask ONE clarifying question. Do NOT guess. |
| 1 | No PRD link, no cURL, no PR | Derive from ERD + existing feature files. Document assumptions. |
| 4c | `mvn compile` fails | Fix ALL compilation errors. Re-run until BUILD SUCCESS. **Never ask user — fix and retry automatically.** |
| 4d | New tag scenarios fail (Y path) | Fix root cause in step def / utility / feature. Re-run until all green. |
| 4e | Sanity regression (Y path) | Fix the regression introduced by your changes. Do NOT open PR. |
| 4f | Rebase conflict | Resolve manually. `git rebase --continue`. Never `git merge`. |
| 6 | `gh pr create` 403/422 | Check branch name format `claude/<feature>-<4digit>`. Verify `--base main`. |

### What the agent MUST NOT do

```
✗ Run mvn compile automatically without telling the user — compile runs silently; user is notified of result
✗ Run mvn test (new tag or sanity) without asking the user YES/NO first
✗ Open a PR without compile passing — compile is the hard gate
✗ Open a PR marked "SKIPPED" without noting in PR body that runs must pass before merge
✗ Use git add -A (risks committing .env / secrets)
✗ Branch from anything other than main
✗ Assert only status code — ALL response keys must be typed and asserted
✗ Create new CommonStepDef steps that duplicate existing ones
✗ Skip Phase 2 (reuse check) even if the request looks simple
```

---

```bash
# 1. Check CommonStepDef for reusable steps
grep -n "public void" src/test/java/com/headout/stepdefinitions/CommonStepDef.java

# 2. Check CommonApiUtility
grep -n "public" src/test/java/com/headout/api/CommonApiUtility.java

# 3. Search all step defs for similar step text
grep -rn "User sends\|User set.*endpoint\|Verify.*status" \
    src/test/java/com/headout/stepdefinitions/

# 4. Check existing feature files for the domain
ls src/test/java/com/headout/features/<domain>/
```

---

## ThreadLocal API — Core Pattern

```java
// These three fields are inherited from com.headout.base.be.BaseAutomation
// request       — ThreadLocal<RequestSpecification.RequestBuilder>
// response      — ThreadLocal<GenericAPIResponse>
// requestMethod — RestWrapper (REST Assured wrapper)

// BUILD the request
request.get()
    .endpoint(PropertyUtils.get(ConfigMap.API_BASE_URL) + "/v1/path")
    .queryParams("key", "value")
    .queryParams("page", "0")
    .header("Authorization", "Bearer " + token)
    .body(requestBodyObject)
    .build();   // → returns RequestSpecification (passed to requestMethod)

// EXECUTE
response.set(requestMethod.get(request.get().build()));   // GET
response.set(requestMethod.post(request.get().build()));  // POST
response.set(requestMethod.put(request.get().build()));   // PUT
response.set(requestMethod.delete(request.get().build()));// DELETE
response.set(requestMethod.patch(request.get().build())); // PATCH

// READ response
response.get().getStatusCode()
response.get().jsonPath().getString("$.data.fieldName")
response.get().jsonPath().getInt("$.data.count")
response.get().jsonPath().getList("$.data.items", MyDto.class)
```

---

## Step Definition Structure

```java
package com.headout.stepdefinitions.<domain>;

import com.headout.base.be.BaseAutomation;
import com.headout.util.PropertyUtils;
import com.headout.util.ConfigMap;
import com.headout.data.CrestDataHandler;
import io.cucumber.java.en.*;

public class <Service>StepDef extends BaseAutomation {

    @Given("User sets up {string} booking via API")
    public void setupBooking(String productType) {
        // Data setup only — no assertions here
        String bookingId = CommonApiUtility.createBooking(productType);
        CrestDataHandler.setValueInDate("bookingId", bookingId);
    }

    @When("User fetches booking details for {string}")
    public void fetchBookingDetails(String bookingId) {
        request.get()
            .endpoint(PropertyUtils.get(ConfigMap.API_BASE_URL) + "/v1/bookings/" + bookingId)
            .header("Authorization", "Bearer " + GetSecretToken.getToken())
            .build();
        response.set(requestMethod.get(request.get().build()));
    }

    @Then("Booking response has status {int} and booking status {string}")
    public void verifyBookingResponse(int expectedStatus, String expectedBookingStatus) {
        softAssertionUtil.get().assertEquals(
            response.get().getStatusCode(), expectedStatus, "Status code mismatch"
        );
        softAssertionUtil.get().assertEquals(
            response.get().jsonPath().getString("$.data.status"),
            expectedBookingStatus,
            "Booking status mismatch"
        );
        softAssertionUtil.get().assertAll();   // MANDATORY
    }
}
```

---

## CommonStepDef — Reusable Steps (DO NOT DUPLICATE)

```gherkin
# Endpoint setup
Given User set "{module}" and "{repo}" Api endpoint

# Query parameters — repeat once per param, use <> placeholders in Scenario Outline
And User set query parameters "{key}" and "{value}" for api

# Headers — repeat once per header
And User set header parameters "{headerKey}" and "{headerValue}" for api
# Authentication — always use module name, never hardcode tokens
And User set authentication for api module "{moduleName}"

# Body — single field
And User set body parameters "{key}" and "{value}" for api
# Body — slash-delimited multi-field (keys "a/b/c" values "v1/v2/v3")
And User set body "{slashDelimitedKeys}" and "{slashDelimitedValues}" for api

# Thread-level data persistence
And Add Data key "{parameterKey}" and value "{parameterValue}" in Properties File

# Execution
When User sends the get request
When User sends the post request
When User sends the put request
When User sends the delete request
When User sends the patch request

# Assertions
Then Verify message "{message}" and status code "{code}" for api
Then Verify response field "{jsonPath}" has value "{value}"
Then Verify Api Response is correct with Schema "{schemaFile}"
```

### Multi-Parameter Rules (MANDATORY)

| Situation | Pattern to use |
|-----------|---------------|
| 2–10 query params, vary per row | `And User set query parameters "<queryParamKey>" and "<queryParamValue>" for api` × N steps + Examples columns |
| 2–10 headers, vary per row | `And User set header parameters "<headerKey>" and "<headerValue>" for api` × N steps + Examples columns |
| Multi-field body in one line | `And User set body "f1/f2/f3" and "<v1>/<v2>/<v3>" for api` |
| Authentication | `And User set authentication for api module "bms"` — always by module name |
| Persist value for downstream steps | `And Add Data key "<parameterKey>" and value "<parameterValue>" in Properties File` |
| > 10 params | Create `userSet<Domain>Parameters()` in `<Service>Utility.java`; call from one domain-specific step; persist extras with `Add Data key` |

See `qa/common/skill/step_reuse.skill.md` § Multi-Parameter Step Patterns for full examples.

---

## Mandatory Response Field Validation (ALL keys — no exceptions)

**Rule: every field in the API response contract MUST have a typed assertion. Spot-checking one or two fields is NOT sufficient.**

### Per-type assertion rules

| Field type | Assertion required | CommonStepDef step |
|---|---|---|
| `String` (required) | not null + not empty | `Verify response field "{path}" is not null and not empty` |
| `String` (nullable) | assert null OR assert non-null+non-empty per scenario | `Verify response field "{path}" is not null` |
| `Integer` / `Long` | not null + `>= 0` (or per-domain min) | `Verify response integer field "{path}" is not null and >= {int}` |
| `Float` / `Double` / `BigDecimal` | not null + `>= 0.0` (or per-domain min) | `Verify response number field "{path}" is not null and >= {double}` |
| `Boolean` | not null + assert expected value | `Verify response field "{path}" has value "true"` / `"false"` |
| `Array` / `List` (non-empty contract) | not null + size >= 1 + validate first element keys | `Verify response field "{path}" is not null and not empty` |
| `Array` / `List` (can be empty) | not null + validate element keys when non-empty | `Verify response field "{path}" is not null` |
| `Object` / nested object | not null + validate each child field | `Verify response field "{path}" is not null` + recurse child keys |
| `Enum` string | not null + value is in allowed set | `Verify response field "{path}" is one of "{VAL1,VAL2,VAL3}"` |

### CommonStepDef steps (add once, reuse everywhere)

```java
// CommonStepDef.java

// --- NULL CHECKS ---
@Then("Verify response field {string} is not null")
public void verifyFieldNotNull(String jsonPath) {
    softAssertionUtil.get().assertNotNull(
        response.get().jsonPath().get(jsonPath),
        "Field [" + jsonPath + "] must not be null"
    );
    softAssertionUtil.get().assertAll();
}

// --- STRING NOT NULL + NOT EMPTY ---
@Then("Verify response field {string} is not null and not empty")
public void verifyFieldNotNullNotEmpty(String jsonPath) {
    Object actual = response.get().jsonPath().get(jsonPath);
    softAssertionUtil.get().assertNotNull(actual, "Field [" + jsonPath + "] must not be null");
    if (actual instanceof List<?> list) {
        softAssertionUtil.get().assertFalse(list.isEmpty(),
            "Array [" + jsonPath + "] must not be empty");
    } else {
        String str = response.get().jsonPath().getString(jsonPath);
        softAssertionUtil.get().assertFalse(str == null || str.isBlank(),
            "String [" + jsonPath + "] must not be blank");
    }
    softAssertionUtil.get().assertAll();
}

// --- INTEGER NOT NULL + >= min ---
@Then("Verify response integer field {string} is not null and >= {int}")
public void verifyIntegerFieldNotNullGte(String jsonPath, int minValue) {
    Integer actual = response.get().jsonPath().getInt(jsonPath);
    softAssertionUtil.get().assertNotNull(actual, "Field [" + jsonPath + "] must not be null");
    softAssertionUtil.get().assertTrue(actual >= minValue,
        "Field [" + jsonPath + "] must be >= " + minValue + ", got: " + actual);
    softAssertionUtil.get().assertAll();
}

// --- FLOAT / DOUBLE NOT NULL + >= min ---
@Then("Verify response number field {string} is not null and >= {double}")
public void verifyNumberFieldNotNullGte(String jsonPath, double minValue) {
    Double actual = response.get().jsonPath().getDouble(jsonPath);
    softAssertionUtil.get().assertNotNull(actual, "Field [" + jsonPath + "] must not be null");
    softAssertionUtil.get().assertTrue(actual >= minValue,
        "Field [" + jsonPath + "] must be >= " + minValue + ", got: " + actual);
    softAssertionUtil.get().assertAll();
}

// --- ENUM: value must be in allowed set ---
@Then("Verify response field {string} is one of {string}")
public void verifyFieldIsOneOf(String jsonPath, String commaSeparated) {
    String actual = response.get().jsonPath().getString(jsonPath);
    List<String> allowed = Arrays.asList(commaSeparated.split(","));
    softAssertionUtil.get().assertNotNull(actual, "Field [" + jsonPath + "] must not be null");
    softAssertionUtil.get().assertTrue(allowed.contains(actual),
        "Field [" + jsonPath + "] must be one of " + allowed + ", got: " + actual);
    softAssertionUtil.get().assertAll();
}

// --- LIST SIZE within bounds ---
@Then("Verify response array field {string} has size >= {int}")
public void verifyArraySizeGte(String jsonPath, int minSize) {
    List<?> list = response.get().jsonPath().getList(jsonPath);
    softAssertionUtil.get().assertNotNull(list, "Array [" + jsonPath + "] must not be null");
    softAssertionUtil.get().assertTrue(list.size() >= minSize,
        "Array [" + jsonPath + "] must have >= " + minSize + " elements, got: " + list.size());
    softAssertionUtil.get().assertAll();
}
```

### Example — full key validation for a GET response

Given contract: `{ data: { bookingId: Long, status: Enum, totalPrice: Float, items: Array<{variantId: Long, name: String, count: Int}>, currency: String, isCancellable: Boolean } }`

```gherkin
Then  Verify message "" and status code "200" for api
# root fields
And   Verify response integer field "data.bookingId" is not null and >= 0
And   Verify response field "data.status" is one of "CONFIRMED,PENDING,CANCELLED"
And   Verify response number field "data.totalPrice" is not null and >= 0.0
And   Verify response field "data.currency" is not null and not empty
And   Verify response field "data.isCancellable" is not null
# array: not null, not empty, size >= 1
And   Verify response field "data.items" is not null and not empty
And   Verify response array field "data.items" has size >= 1
# first element of array — all child keys
And   Verify response integer field "data.items[0].variantId" is not null and >= 0
And   Verify response field "data.items[0].name" is not null and not empty
And   Verify response integer field "data.items[0].count" is not null and >= 0
# schema covers structural contract
Then  Verify Api Response is correct with Schema "<Service>.json"
```

### Validation coverage mandate

```
BEFORE COMMITTING any @Then step:
  □ List all keys in the API response contract (from GET response / PR DTO / ERD)
  □ For each key, write an assertion using the per-type rule above
  □ Nested object → validate the object not null, then validate each child key
  □ Array → validate not null + size, then validate first-element child keys
  □ Never assert status code alone and call the scenario "validated"
  □ softAssertionUtil.get().assertAll() MUST be the last call in every @Then
```

---

## Data Handling

```java
// Store data for use in subsequent steps
CrestDataHandler.setValueInDate("bookingId", bookingId);
CrestDataHandler.setValueInDate("productId", productId);

// Read data stored by a previous step
String bookingId = CrestDataHandler.getValueFromDate("bookingId");

// Cross-scenario cache (use sparingly — prefer @Before data setup)
CacheMechanism.getInstance().setData("sharedBookingId", bookingId);
String cached = (String) CacheMechanism.getInstance().getData("sharedBookingId");

// Credentials
String email    = YamlReader.getAppConfigValue("Users.Customer.Email");
String password = YamlReader.getAppConfigValue("Users.Customer.Password");

// Config values
String baseUrl = PropertyUtils.get(ConfigMap.API_BASE_URL);
```

---

## Test Runner Structure

```java
@CucumberOptions(
    features = "src/test/java/com/headout/features/<domain>/",
    glue = {"com.headout.stepdefinitions", "com.headout.datasetup"},
    tags = "@test",
    plugin = {"pretty", "html:target/cucumber-reports/report.html"}
)
public class Test_Runner extends AbstractTestNGCucumberTests {

    @BeforeSuite
    public void suiteSetup() {
        TestNGLogUtility.info("Suite started: " + this.getClass().getSimpleName());
    }

    @Before
    public void scenarioSetup(Scenario scenario) {
        TestNGLogUtility.info("Starting: " + scenario.getName());
    }

    @After
    public void scenarioTeardown(Scenario scenario) {
        TestNGLogUtility.info("Completed: " + scenario.getName() + " — " + scenario.getStatus());
    }

    @AfterSuite
    public void suiteTeardown() {
        TestNGLogUtility.info("Suite complete");
    }
}
```

---

## Run Commands

```bash
# Compile check (ALWAYS run first — must pass before anything else)
mvn compile -q

# Run only the new scenarios for the feature being developed
mvn test -Dcucumber.filter.tags="@<new-domain-tag> and @test" \
         -DthreadCount=1 -DenableApiLog=INFO

# Run sanity suite (must still pass — no regressions)
mvn test -Dcucumber.filter.tags="@test-sanity and @test" -DthreadCount=5

# Run full regression suite
mvn test -Dcucumber.filter.tags="@test" -DthreadCount=40

# Run specific domain only
mvn test -Dcucumber.filter.tags="@<domain> and @test" -DthreadCount=5

# Run with detailed API request/response logging
mvn test -Dcucumber.filter.tags="@<new-domain-tag> and @test" \
         -DthreadCount=1 -DenableApiLog=INFO

# Run ODE regression
mvn test -Dcucumber.filter.tags="@ode-regression" -DNAME_SPACE=<ode-env>

# Run live sanity (read-only — no data mutation)
mvn test -Dcucumber.filter.tags="@live-sanity" -DTEST_ENVIRONMENT=live
```

---

## Pre-PR Workflow (MANDATORY — do not skip any step)

This is the required sequence every time new API automation is written.
See `qa/common/agent/_PRAETORIAN_CONSTITUTION.md` Section VI-B for the full gate rules.

### Step 1 — Branch from main

```bash
# Always start from the latest main
git checkout main
git pull origin main

# Generate a 4-digit random suffix
RAND=$(( RANDOM % 9000 + 1000 ))

# Create a new branch — name derived from cURL endpoint path, PRD feature, or domain+action
# Format: claude/<feature-name>-<4-digit-random>
git checkout -b claude/<feature-name>-$RAND

# Examples (pick the most descriptive context):
#   cURL path  →  claude/inventory-discount-price-4827
#   PRD title  →  claude/promo-code-checkout-1293
#   domain     →  claude/booking-cancellation-policy-7541
```

### Step 2 — Write the automation

Write or update in this order (dependencies):
```
1. URLBuilders.java          — add endpoint key if new endpoint
2. <Service>Utility.java     — add request build + assertion methods
3. <Domain>StepDef.java      — thin orchestration only (calls utility)
4. <ServiceName>.json        — schema file in src/test/resources/ResponseSchema/
5. <feature>.feature         — Gherkin scenarios with correct tags
```

### Step 3 — Rebase onto latest main (before compile)

```bash
# Pick up any upstream changes that landed while you were working
git fetch origin main
git rebase origin/main

# If conflicts arise — resolve each one manually, then:
git add <resolved-files>
git rebase --continue
# NEVER: git merge main  or  git rebase --skip (skipping discards your changes)
```

### Step 4 — Compile gate (MUST pass — zero exceptions)

```bash
mvn compile -q

# Expected output: BUILD SUCCESS (no output if -q and clean)
# If compile fails:
#   → Read the full error output
#   → Fix every compilation error
#   → Re-run until exit code 0
#   → NEVER commit with a compile failure
```

### Step 5 — Run new scenarios only (USER CONFIRMATION REQUIRED)

After compile passes, the agent asks:

```
✅ mvn compile passed.

Run automation now?
  [Y] Yes — run new tag + sanity suite, then raise PR
  [N] No  — skip test run, raise PR with compile-only gate
```

**If user answers Y:**

```bash
# Run ONLY the new tag you added — confirms new tests pass
mvn test -Dcucumber.filter.tags="@<new-domain-tag> and @test" \
         -DthreadCount=1 -DenableApiLog=INFO

# Expected: all new scenarios PASS
# If any scenario fails:
#   → Read the failure stack trace
#   → Fix root cause (step def / utility / feature / data setup)
#   → Re-run until all new scenarios are green
#   → NEVER open a PR with failing new scenarios
```

**If user answers N:** skip this step and Step 6. Proceed to Step 7.

### Step 6 — Run sanity suite, regression guard (USER CONFIRMATION — same prompt as Step 5)

**Only runs if user answered Y in Step 5.**

```bash
# Confirm your changes did not break any existing critical paths
mvn test -Dcucumber.filter.tags="@test-sanity and @test" -DthreadCount=5

# Expected: all sanity scenarios still PASS
# If a sanity scenario that was green before is now failing:
#   → Your change introduced a regression — fix it before proceeding
#   → Do NOT open a PR with a broken sanity suite
```

### Step 7 — Commit and push

```bash
# Stage specific files only (never git add -A — risks committing .env, secrets)
git add src/test/java/com/headout/api/<domain>/<Service>Utility.java
git add src/test/java/com/headout/stepdefinitions/<domain>/<Domain>StepDef.java
git add src/test/java/com/headout/features/<domain>/<service>/<name>.feature
git add src/test/resources/ResponseSchema/<ServiceName>.json
# add URLBuilders.java if endpoint was added

git commit -m "test(<domain>): add API scenarios for <feature>

Added Cucumber scenarios covering:
  - Happy path: <describe>
  - Negative: <describe>
  - Edge: <describe>
  - Schema validation: <SchemaFile>.json

New tag: @<new-domain-tag>
mvn compile: PASSED
New tag run: PASSED (<N> scenarios)
Sanity run: PASSED (<N> scenarios)

Co-authored-by: Claude <noreply@anthropic.com>"

# Push to remote (branch name matches what was created in Step 1)
git push -u origin claude/<feature-name>-<4-digit-random>
```

### Step 8 — Open PR against main

```bash
gh pr create \
  --base main \
  --title "test(<domain>): add API automation for <feature>" \
  --body "$(cat <<'EOF'
## Summary
- Added Cucumber BDD scenarios for <feature> in crest
- New scenarios: happy path + negative + edge + schema validation
- New tag: @<new-domain-tag>

## Files changed
- `api/<domain>/<Service>Utility.java` — request build + assertion methods
- `stepdefinitions/<domain>/<Domain>StepDef.java` — step orchestration
- `features/<domain>/<service>/<name>.feature` — Gherkin scenarios
- `ResponseSchema/<ServiceName>.json` — JSON schema file

## Gate results
| Gate | Result |
|------|--------|
| `mvn compile -q` | PASSED |
| `@<new-domain-tag> and @test` | PASSED — N scenarios  *(or SKIPPED — run before merge)* |
| `@test-sanity and @test` | PASSED — N scenarios  *(or SKIPPED — run before merge)* |
| Rebased onto `main` | YES |

## Test plan
- [ ] New scenarios pass on test env
- [ ] Sanity suite unaffected
- [ ] Schema file covers all required fields
- [ ] No hardcoded URLs / credentials / tokens
EOF
)"
```

### Pre-PR Checklist (tick before opening PR)

```
Git workflow:
  [ ] Branched from latest main (git checkout main && git pull origin main first)
  [ ] Branch name follows claude/<feature-name>-<4-digit-random> (e.g. claude/inventory-discount-4827)
  [ ] Feature name derived from cURL path, PRD title, or domain+action — NOT a session ID
  [ ] Rebased onto origin/main before compile (git rebase origin/main)
  [ ] No merge commits in branch history

Compilation (AUTO — agent runs without asking):
  [ ] mvn compile -q → BUILD SUCCESS (exit 0)
  [ ] No compilation errors, warnings addressed

Test run (OPTIONAL — user answered Y/N prompt):
  [ ] User was asked "Run automation now? [Y/N]" after compile passed
  [ ] If Y: mvn test -Dcucumber.filter.tags="@<new-tag> and @test" → all PASS
  [ ] If Y: mvn test -Dcucumber.filter.tags="@test-sanity and @test" → all PASS
  [ ] If Y: no existing scenarios broken by new code
  [ ] If N: PR body clearly marks run status as "SKIPPED — run before merge"
  [ ] All new scenarios have correct tag set (type + env + suite-depth + domain)

Code quality:
  [ ] No hardcoded URLs (use PropertyUtils.get(ConfigMap.*))
  [ ] No hardcoded tokens (use GetSecretToken.getToken())
  [ ] No System.out.println (use TestNGLogUtility)
  [ ] No Thread.sleep
  [ ] softAssertionUtil.get().assertAll() at end of every @Then
  [ ] Schema file in src/test/resources/ResponseSchema/

PR:
  [ ] PR base is main (gh pr create --base main)
  [ ] PR body includes: compile PASSED + run result (PASSED or SKIPPED)
  [ ] PR title follows: test(<domain>): <summary>
```

---

## Commit Message Template

```
test(<service>): add API scenarios for <feature>

Added Cucumber scenarios for <what> covering <edge cases>.
Step definitions extend BaseAutomation; use request/response ThreadLocals.
Data setup via CrestDataHandler; no hardcoded URLs or credentials.

Co-authored-by: Claude <noreply@anthropic.com>
```
