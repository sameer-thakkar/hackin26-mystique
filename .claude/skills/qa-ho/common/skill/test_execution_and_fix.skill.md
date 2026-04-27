---
name: test_execution_and_fix
description: "Compile is MANDATORY and always runs automatically. Running tests is OPTIONAL — ask user Y/N/Skip after compile; if N, print manual run instructions. Commit + push + PR is AUTOMATIC after all tests pass (or after compile when user skips tests). Parse Surefire/Cucumber failures, classify and auto-fix errors (max 3 iterations)."
version: 1.1.0
testingTypes: [API, E2E, Mobile, VisualDiff]
repos: [crest, celium, pixify, appium]
dependsOn:
  - qa/common/agent/_PRAETORIAN_CONSTITUTION.md
  - qa/common/agent/remediator_agent.md
  - qa/common/agent/locator_strategy.md
---

# Test Execution and Auto-Fix Skill

---

## Phase 1 — Tag Assignment Before Running

When new test cases are created, assign a **unique feature tag** for isolated execution.

### Tag Format

```
@<domain>-<feature>-<sequence>

Examples:
  @booking-promo-001
  @checkout-calendar-002
  @hub-login-003
  @inventory-boundary-004
  @vd-thevaticantickets-001
```

### Rules

- Tag must be unique across the entire repo — scan before assigning:
  ```bash
  grep -rn "@booking-promo-001" src/test/java/com/headout/features/
  ```
- Every new `Scenario` or `Scenario Outline` gets the unique tag on the line above it.
- The unique tag is used ONLY for initial run and fix cycles.
  After stabilisation, remove it and keep only the permanent suite tags
  (`@test`, `@test-regression`, etc.).

---

## Phase 2 — Compile (Mandatory) → Run Tests (Optional) → Commit + PR (Optional)

### Step 2.1 — Compile Only (MANDATORY — always runs automatically, no prompt)

Compile runs immediately after code generation. Do NOT ask the user — just run it.

```bash
mvn compile -q 2>&1 | tee /tmp/mvn-compile-output.txt
echo "EXIT:$?"
```

Check result:

```bash
grep -c "ERROR\|COMPILATION ERROR\|cannot find symbol" /tmp/mvn-compile-output.txt || echo "0 errors"
```

Then show the compile result:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  COMPILE RESULT: ✓ SUCCESS
  Tag ready:  @<tagName>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

- If compile **FAILED** → show errors, fix them, re-run compile. Do NOT proceed to Step 2.2 until compile passes.
- If compile **PASSED** → show the result above, then proceed to Step 2.2.

### Step 2.2 — Run Tests Gate (OPTIONAL — ask user)

After a successful compile, output this prompt and wait for user input:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Do you want to run automation now?

  [Y] Yes  — run tests now, then auto-create PR
  [N] No   — skip tests, auto-create PR with compile-only gate
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

- If user answers **N** → print the **Manual Run Instructions** below, then proceed
  directly to commit + push + PR creation (Phase 8) automatically. Do NOT wait for
  further confirmation.
- If user answers **Y** → proceed to Step 2.3.

#### Manual Run Instructions (print when user answers N)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  MANUAL TEST RUN INSTRUCTIONS
  Run these commands after the PR is merged or when ready to validate:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  # 1. Run only the new scenarios (feature-specific tag)
  cd <repo-root>
  mvn test \
    -Dcucumber.filter.tags="@<tagName> and @test" \
    -DthreadCount=1 \
    -DTEST_ENVIRONMENT=test

  # 2. Run full sanity suite (regression guard)
  mvn test \
    -Dcucumber.filter.tags="@test-sanity and @test" \
    -DthreadCount=5 \
    -DTEST_ENVIRONMENT=test

  # 3. Run ODE regression (optional)
  mvn test \
    -Dcucumber.filter.tags="@ode-regression" \
    -DNAME_SPACE=<your-ode-namespace>

  # Repo-specific variants:
  #   crest:  add -DTEST_ENVIRONMENT=test
  #   celium: add -DBROWSER=chrome -DTEST_ENVIRONMENT=test
  #   appium: add -DDEVICE_TYPE=android -DTEST_ENVIRONMENT=test

  Compile already passed ✓ — code is safe to review and merge.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Step 2.3 — Run Tests (only after user confirms Y)

```bash
# Single thread — always use threadCount=1 for new test validation
mvn test \
  -Dcucumber.filter.tags="@<tagName>" \
  -DthreadCount=1 \
  -DskipTests=false \
  2>&1 | tee /tmp/mvn-test-output.txt
```

Add repo-specific env vars as needed:

```bash
# crest
mvn test -Dcucumber.filter.tags="@booking-promo-001" -DthreadCount=1 \
  -DTEST_ENVIRONMENT=test

# celium
mvn test -Dcucumber.filter.tags="@booking-promo-001" -DthreadCount=1 \
  -DBROWSER=chrome -DTEST_ENVIRONMENT=test

# appium
mvn test -Dcucumber.filter.tags="@booking-promo-001" -DthreadCount=1 \
  -DDEVICE_TYPE=android -DTEST_ENVIRONMENT=test
```

### What Gets Written After a Run

| File | Content |
|------|---------|
| `/tmp/mvn-test-output.txt` | Full Maven + Surefire stdout (captured by `tee`) |
| `rerun/failed_scenarios.txt` | `feature-file-path:line` for each failed scenario |
| `target/cucumber-reports/Cucumber.json` | Structured JSON: scenario name, steps, status, error message |
| `target/cucumber-reports/cucumber.html` | HTML report |

---

## Phase 3 — Parse the Output

### Step 3.1 — Check for Compilation Failure First

```bash
grep -n "COMPILATION ERROR\|BUILD FAILURE\|cannot find symbol\|error:" /tmp/mvn-test-output.txt | head -30
```

If compilation failed, no tests ran. Fix compilation before parsing test results.

### Step 3.2 — Check Failed Scenarios

```bash
# Number of failed scenarios
cat rerun/failed_scenarios.txt | wc -l

# List of failed feature files and lines
cat rerun/failed_scenarios.txt
```

### Step 3.3 — Extract Error Messages from Cucumber JSON

```bash
# All error messages from failed steps
python3 - << 'EOF'
import json, sys

with open("target/cucumber-reports/Cucumber.json") as f:
    data = json.load(f)

errors = []
for feature in data:
    for element in feature.get("elements", []):
        scenario = element.get("name", "")
        for step in element.get("steps", []):
            result = step.get("result", {})
            if result.get("status") in ("failed", "undefined"):
                errors.append({
                    "scenario": scenario,
                    "step": step.get("name", ""),
                    "status": result.get("status"),
                    "error": result.get("error_message", "")[:500]
                })

for e in errors:
    print(f"\nSCENARIO: {e['scenario']}")
    print(f"  STEP:    {e['step']}")
    print(f"  STATUS:  {e['status']}")
    print(f"  ERROR:   {e['error']}")
EOF
```

### Step 3.4 — Parse Maven Stdout for Compilation Errors

```bash
# Extract compilation error block
sed -n '/COMPILATION ERROR/,/BUILD/p' /tmp/mvn-test-output.txt | head -50
```

---

## Phase 4 — Error Classification

Read the errors and classify each one:

| Pattern in Error Message | Classification | Fix Agent |
|--------------------------|----------------|-----------|
| `COMPILATION ERROR` / `cannot find symbol` / `package does not exist` | **COMPILE** | Fix imports, method names, types |
| `You can implement missing steps` / `io.cucumber.junit.platform.engine.UndefinedStepException` | **MISSING STEP** | Add step definition |
| `NoSuchElementException` / `Unable to locate element` / `no such element` | **LOCATOR** | Re-derive locator (locator_strategy.md) |
| `TimeoutException` / `WebDriverTimeoutException` / `Expected condition failed` | **WAIT** | Fix wait strategy |
| `AssertionError` / `expected:<...> but was:<...>` / `java.lang.AssertionError` | **ASSERTION** | Fix expected value or JSON path |
| `NullPointerException` at DataHandler / setup method | **DATA SETUP** | Fix `@Before` hook or null guard |
| `Connection refused` / `UnknownHostException` / `SocketTimeoutException` | **ENVIRONMENT** | Not fixable — report to user |
| `StaleElementReferenceException` | **STALE LOCATOR** | Add explicit wait; re-derive locator |
| `Undefined step` | **MISSING STEP** | Add step definition |
| `java.lang.ClassNotFoundException` / `NoSuchMethodError` | **FRAMEWORK VERSION** | Check unified-qa-framework version |

---

## Phase 5 — Fix by Error Type

### COMPILE — cannot find symbol

```
SYMPTOM: error: cannot find symbol
           symbol: method getValueFromDate(String)

ROOT CAUSE: Wrong method name, wrong import, or missing utility class.

FIX STEPS:
  1. Read the file at the reported line number.
  2. Check the actual API: grep -rn "getValueFromDate\|getValueFrom" unified-qa-framework/src/
  3. Correct the method name / import.
  4. Re-run: mvn compile -q
```

### COMPILE — package does not exist

```
SYMPTOM: error: package com.headout.api.calipso does not exist

FIX STEPS:
  1. Check if the utility class exists: find . -name "*Utility.java" | grep calipso
  2. If missing: create the utility class first (see qa/api/skill/SKILL.md)
  3. If exists but wrong package: fix the import.
```

### MISSING STEP — Undefined step

```
SYMPTOM: Step undefined: "User applies promo code "SUMMER20""

FIX STEPS:
  1. Check if a similar step exists:
     grep -rn "applies promo\|promo code" src/test/java/com/headout/stepdefinitions/
  2. If a close match exists: adjust the feature file step text to match exactly.
  3. If no match: add the step definition to the appropriate StepDef class.
     - Pattern the step text to match how CommonStepDef patterns look.
     - Add @When / @Then with the exact text from the feature file.
```

### LOCATOR — NoSuchElementException (UI/App)

```
SYMPTOM: NoSuchElementException: Unable to locate element: {"method":"xpath","selector":"//button[@data-qa-marker='checkout-promo']"}

FIX STEPS:
  1. Ask the user: "Can you paste the current HTML of the element or an Appium XML dump?"
  2. Re-derive the locator using qa/common/agent/locator_strategy.md priority order:
     - Start at Tier 1 (data-qa-marker) and work down.
  3. Replace the old locator in the PO file.
  4. Add appropriate wait before the interaction.
```

### WAIT — TimeoutException

```
SYMPTOM: TimeoutException: Expected condition failed: waiting for visibility of element

FIX STEPS:
  1. Check if the element appears after a loader:
     → Add wait.waitForInvisibilityOfElement(20, 5, loaderLocator) before the assertion.
  2. Check default timeout (10s may be too short):
     → Change wait.waitForVisibilityOfElement(locator) to wait.waitForVisibilityOfElement(locator, 30)
  3. Check if the element is conditionally rendered:
     → Add a conditional check using genericMethod.isDisplayed(locator)
```

### ASSERTION — AssertionError

```
SYMPTOM: AssertionError: expected:<CONFIRMED> but was:<PENDING>

FIX STEPS:
  1. Is this a data drift issue?
     → The test booking is in a different state than expected.
     → Fix: update data setup to ensure booking is in CONFIRMED state.
  2. Is the JSON path wrong?
     → Verify: response.get().jsonPath().getString("data.status")
     → Log the full response: TestNGLogUtility.info(response.get().asString())
  3. Is softAssertionUtil.get().assertAll() missing?
     → Add at the end of the @Then method.
```

### DATA SETUP — NullPointerException

```
SYMPTOM: NullPointerException at CrestDataHandler.getValueFromDate("bookingId")

FIX STEPS:
  1. The data was set in a previous scenario (test dependency bug):
     → Move the data production to a @Before("<tag>") hook.
  2. The data setup API call failed:
     → Add null check + descriptive assertion:
        String bookingId = CrestDataHandler.getValueFromDate("bookingId");
        Assert.assertNotNull(bookingId, "Booking ID not set — data setup failed. Check @Before hook.");
```

### ENVIRONMENT — Connection refused

```
SYMPTOM: java.net.ConnectException: Connection refused (api.test-headout.com:443)

THIS CANNOT BE FIXED BY THE AGENT.

REPORT TO USER:
  "The test environment is unreachable. This is not an automation code issue.
   Please check:
   - VPN / WireGuard is connected
   - TEST_ENVIRONMENT config matches the running environment
   - The target service is deployed and healthy"
```

---

## Phase 6 — Fix Cycle Protocol

### Maximum Iterations: 3

```
Iteration 1:  Run → collect errors → classify → apply fix → present to user
Iteration 2:  Re-run after user approval → collect new errors → fix
Iteration 3:  Re-run → if same error persists → STOP, report as "unable to auto-fix"
```

**Never retry the same fix twice.** If iteration 2 produces the same error as iteration 1,
it means the fix was wrong — escalate to the user with a detailed explanation.

### User Interaction Points

After every fix cycle, present this summary before re-running:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RUN SUMMARY — Tag: @booking-promo-001
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Scenarios run:   3
Passed:          1
Failed:          2

ERRORS FOUND:
  [1] MISSING STEP — "User applies promo code "SUMMER20""
      File: src/test/java/com/headout/stepdefinitions/hub/CheckoutStepDef.java
      Fix:  Added @When step definition for promo code application

  [2] ASSERTION — expected:<CONFIRMED> but was:<PENDING>
      Scenario: "Verify booking status after promo applied"
      Fix:  Updated data setup @Before hook to ensure CONFIRMED booking
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Files modified:
  src/test/java/com/headout/stepdefinitions/hub/CheckoutStepDef.java
  src/test/java/com/headout/datasetup/CheckoutDataSetup.java

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Re-run tests? (OPTIONAL)

  [Y] Yes — re-run @booking-promo-001 now
  [N] No  — I'll review the changes first
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### If User Answers Y (re-run)

Execute the run command again, then return to Phase 3.

### If User Answers N (review first)

Stop. Show all modified files. Wait for the user to resume.

---

### After All Tests Pass — Commit + PR (AUTOMATIC)

When all scenarios pass (0 failures), **automatically** proceed to commit + push + PR
creation (Phase 8) without asking the user. Show only a status banner:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  All tests passed ✓  Creating PR automatically…
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Proceed immediately to Phase 8.

---

## Phase 7 — Post-Fix Verification Checklist

Before declaring a test as stable:

```
[ ] All scenarios in @<unique-tag> pass with 0 failures
[ ] No softAssertionUtil.get().assertAll() calls are missing
[ ] No Thread.sleep() was introduced during fixing
[ ] No hardcoded values were introduced during fixing
[ ] rerun/failed_scenarios.txt is empty after the final run
[ ] The unique tag (@booking-promo-001) is removed from the scenario
    and replaced with the permanent suite tags (@test @test-regression etc.)
```

---

## Phase 8 — Tag Cleanup After Stabilisation

After all iterations pass, remove the temporary unique tag and replace with
permanent suite tags:

```gherkin
# BEFORE (with temp tag)
@booking-promo-001 @headout @booking @test
Scenario Outline: Verify promo code application
  ...

# AFTER (temp tag removed)
@headout @booking @test @test-regression @test-sanity @ode-regression
Scenario Outline: Verify promo code application
  ...
```

Then update `count_scenarios_by_tags.py` and workflow tag options if a new
permanent tag was introduced.

---

## Complete Run-Fix Loop — Command Sequence

```bash
# ─────────────────────────────────────────────────────
# STEP 1 — COMPILE  (MANDATORY — runs automatically, no prompt)
# ─────────────────────────────────────────────────────
cd /path/to/repo
mvn compile -q 2>&1 | tee /tmp/mvn-compile-output.txt
# Show result: ✓ SUCCESS or ✗ FAILED
# If FAILED → fix errors, re-run compile. Do NOT proceed.

# ─────────────────────────────────────────────────────
# STEP 2 — RUN TESTS  (OPTIONAL — ask user Y/N)
# ─────────────────────────────────────────────────────
# → Ask: "Do you want to run automation now?
#         [Y] Yes — run tests now, then auto-create PR
#         [N] No  — skip tests, auto-create PR with compile-only gate"
#
# If [N]: print Manual Run Instructions, then go directly to STEP 3 (auto PR).
# If [Y]: run tests below, fix failures (max 3 iterations), then go to STEP 3.

mvn test \
  -Dcucumber.filter.tags="@booking-promo-001" \
  -DthreadCount=1 \
  -DTEST_ENVIRONMENT=test \
  2>&1 | tee /tmp/run-1.txt

# Check result
echo "=== BUILD STATUS ===" && grep "BUILD\|Tests run" /tmp/run-1.txt | tail -5
echo "=== FAILED SCENARIOS ===" && cat rerun/failed_scenarios.txt

# Fix failures → ask user: "Re-run tests? [Y] Yes  [N] No"
# Re-run max 3 iterations.

mvn test \
  -Dcucumber.filter.tags="@booking-promo-001" \
  -DthreadCount=1 \
  -DTEST_ENVIRONMENT=test \
  2>&1 | tee /tmp/run-2.txt

grep "BUILD SUCCESS\|Tests run:" /tmp/run-2.txt | tail -3
cat rerun/failed_scenarios.txt  # should be empty

# ─────────────────────────────────────────────────────
# STEP 3 — COMMIT + PUSH + PR  (AUTOMATIC — no Y/N prompt)
# ─────────────────────────────────────────────────────
# Triggered automatically when:
#   • All tests pass (0 failures)   — after Y path in Step 2
#   • User skips tests (N)          — after printing manual run instructions
# The agent commits, pushes, and raises the PR without further confirmation.
```

---

## Error Reference — Quick Lookup Table

| Error message contains | Type | Can auto-fix? | Action |
|------------------------|------|--------------|--------|
| `COMPILATION ERROR` | Compile | Yes | Fix imports/method names |
| `cannot find symbol` | Compile | Yes | Check API, fix method call |
| `package does not exist` | Compile | Yes | Create missing class or fix import |
| `You can implement missing steps` | Missing step | Yes | Add step def |
| `Undefined step` | Missing step | Yes | Add step def or fix step text |
| `NoSuchElementException` | Locator | Yes (needs HTML/XML) | Re-derive via locator_strategy.md |
| `StaleElementReferenceException` | Stale locator | Yes | Add wait + re-derive |
| `TimeoutException` | Wait | Yes | Increase timeout or fix wait type |
| `AssertionError: expected:<X> but was:<Y>` | Assertion | Partial | Fix expected value or JSON path |
| `NullPointerException` at DataHandler | Data setup | Yes | Fix @Before hook |
| `ClassNotFoundException` / `NoSuchMethodError` | Framework version | Partial | Check pom.xml version |
| `Connection refused` / `UnknownHostException` | Environment | **No** | Report to user |
| `SSLHandshakeException` | Environment | **No** | Report to user |
| `404 Not Found` on endpoint | Environment/config | Partial | Check endpoint key in URLBuilders |
