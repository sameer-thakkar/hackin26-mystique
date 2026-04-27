---
name: test_case_creation
description: "Gherkin BDD authoring skill covering ALL 24 mandatory scenario categories for crest/celium/pixify/appium. ALL 24 must be addressed for every feature — no category may be skipped. If a category cannot be automated, it MUST appear as @pending (with BLOCKED reason) or @manual. Skipping any category is a hallucination violation. New categories: 2.22 Black Box (equivalence partitioning, decision tables), 2.23 White Box (branch/path/condition coverage, internal state), 2.24 Exploratory (charter-based session testing — always @manual)."
version: 3.0.0
testingTypes: [API, E2E, Mobile, Integration, Security, Performance, VisualDiff, BlackBox, WhiteBox, Exploratory]
frameworks: [Cucumber, TestNG, Gatling]
languages: [Java, Gherkin]
repos: [crest, celium, pixify, appium]
mandatoryCategories: 24
hallucinationGuard: "Every category MUST produce ≥1 scenario. No silent skips allowed."
---

# Test Case Creation and Gherkin Authoring Skill

---

## Phase 0 — MANDATORY BRANCH GATE (Before Any Test Case or File is Written)

**CRITICAL:** The agent MUST create and switch to a dedicated feature branch before
writing any Gherkin scenario, Java step, or JSON schema file.
Writing to `main` or an unrelated branch is a HARD VIOLATION.

```bash
# In the correct repo root (crest / celium / appium / pixify)
git checkout main && git pull origin main
git checkout -b qa/<domain>/<feature-name>-<layer>
# Examples:
#   qa/booking/booking-create-api
#   qa/wishlist/wishlist-ui
#   qa/refund/refund-app

# If branch already exists:
# git checkout qa/<domain>/<feature-name>-<layer>
# git pull origin qa/<domain>/<feature-name>-<layer>
```

Show the user before writing any file:
```
✓ Branch ready: qa/<domain>/<feature-name>-<layer>
  All scenarios and code will be written to this branch only.
```

Only after confirming the branch → continue to Phase 1.

---

## Phase 1 — Requirement Analysis (Before Writing a Single Scenario)

### 1.1 Input Classification

Before writing any Gherkin, answer these five questions:

```
1. WHAT is being tested?
   → Identify the feature / endpoint / screen / user journey.

2. WHO is the user?
   → Customer, Distribution Partner, Hub operator, Guest (unauthenticated)?

3. WHICH layer does this test live on?
   → API (crest) | Web UI (celium) | Mobile App (appium) | Cross-layer?

4. WHAT are the acceptance criteria?
   → List them explicitly before writing scenarios.

5. WHAT can go wrong?
   → Invalid inputs, missing data, permission errors, boundary values, race conditions.
```

### 1.2 Acceptance Criteria → Test Case Matrix

For every acceptance criterion, generate a row in this matrix:

| # | Criterion | Test Type | Automatable? | Tag |
|---|-----------|-----------|--------------|-----|
| 1 | Login succeeds with valid credentials | Positive | Yes | `@test` |
| 2 | Login succeeds for Distribution Partner | Positive (alt path) | Yes | `@test` |
| 3 | Login fails with wrong password | Negative | Yes | `@test` |
| 4 | Login fails with empty email | Validation | Yes | `@test` |
| 5 | Login fails with malformed email format | Validation | Yes | `@test` |
| 6 | Login fails with empty email field | Boundary | Yes | `@test` |
| 7 | Login with exactly 255-char password (max) | Boundary | Yes | `@test` |
| 8 | All credential combinations (role × env) | Combination | Yes | `@test` |
| 9 | Calling login twice returns same session | Idempotency | Yes | `@test` |
| 10 | Login without token fails 401 | Security / Auth | Yes | `@test` |
| 11 | Rate-limited after 10 rapid failures | Edge / Timing | No | `@manual` |
| 12 | UI renders correctly on mobile viewport | UI / Visual | Yes | `@mb` |
| 13 | Login → Checkout end-to-end journey | E2E | Yes | `@test-headout-e2e-flow` |

**Automatable if:** deterministic, fast to set up, does not require visual judgement,
does not depend on third-party services, does not depend on exact timing.

### 1.3 Full Category Checklist — ALL 24 MANDATORY

**CRITICAL RULE — Anti-Hallucination Enforcement:**
Every category below MUST produce at least 1 scenario for every feature.
- If it CAN be automated → write the scenario and tag it `@test`
- If it CANNOT be automated → write it as `@manual` with `# STEP N:` / `# EXPECTED:` lines
- If it is BLOCKED / WIP → write it as `@pending` with a `# BLOCKED:` comment

**Silently skipping ANY category is a hallucination violation.** If the agent does not
produce a scenario for a category, it MUST explicitly state why and provide a @pending entry.

```
MANDATORY — must appear in every feature's test matrix and feature file:

[ ] 2.1  Positive — Happy Path            (main success flow per user type)
[ ] 2.2  Positive — Alternative Paths     (optional params, different roles, alt flows)
[ ] 2.3  Negative — Error Paths           (each distinct error code / message)
[ ] 2.4  Validation — Field Level         (required, format, type, length per field)
[ ] 2.5  Edge Cases                       (null, empty, Unicode, special chars, whitespace)
[ ] 2.6  Boundary Values                  (min, max, min-1, max+1 for every numeric/length field)
[ ] 2.7  Combination / Pairwise           (multi-param interaction; at least pairwise coverage)
[ ] 2.8  State Transition                 (entity lifecycle: PENDING→CONFIRMED→CANCELLED etc.)
[ ] 2.9  Schema / Contract                (JSON schema validation on all GET entity responses)
[ ] 2.10 Security / Authorization         (unauthenticated, wrong role, IDOR, injection)
[ ] 2.11 Idempotency                      (GET/POST/PUT repeated call — same result, no duplicate)
[ ] 2.12 Cross-service / Integration      (calls spanning multiple services / repos)
[ ] 2.13 E2E Journey                      (multi-step user journey through 2+ features)
[ ] 2.14 Performance Baseline             (response time SLA on critical paths — @manual)
[ ] 2.15 Localisation / i18n              (multi-currency, multi-language, locale, timezone)
[ ] 2.16 Concurrency / Race Condition     (parallel/simultaneous calls — @manual or @pending)
[ ] 2.17 Data Sensitivity / PII           (masked fields, GDPR, sensitive data not exposed)
[ ] 2.18 Compatibility / Version          (backward-compat: old clients, prior API versions)
[ ] 2.19 Manual                           (visual, animation, hardware — non-exploratory)
[ ] 2.20 Pending                          (designed but blocked: WIP, no locator, unreleased)
[ ] 2.21 Revamp                           (existing scenario under refactor / new API version)
[ ] 2.22 Black Box                        (equivalence partitioning, decision tables, use-case — no internal knowledge)
[ ] 2.23 White Box                        (branch/path/condition coverage, internal state, exception paths)
[ ] 2.24 Exploratory                      (charter-based session testing, "what-if" chaining — always @manual)

If a category produces 0 automatable scenarios, the agent MUST still add:
  @pending Scenario: <category name> coverage — <reason why blocked>
  # BLOCKED: <reason>
```

---

## Phase 2 — Test Case Categories

### 2.1 Positive (Happy Path)

Tests the system with **valid, expected inputs** — verifies the success flow.

Rules:
- One scenario per distinct user journey (not per API field combination)
- Use `Scenario Outline` + `Examples` when the same flow repeats with different valid data
- Cover the most common real user paths first

```gherkin
@headout @calipso @test @test-regression @test-sanity
Scenario Outline: Verify successful login with valid credentials for "<profile_type>"
  Given User set "account-login-email-v2" and "" Api endpoint
  When User set request headers
  And User set body parameters "email&password" and "<credentials>" for api
  And User sends the post request
  Then User validate response for account-login-email-v2 api and profile type "<profile_type>"
  Examples:
    | credentials                | profile_type         |
    | DIST_EMAIL&DIST_PASSWORD   | DISTRIBUTION_PARTNER |
    | CUST_EMAIL&CUST_PASSWORD   | CUSTOMER             |
```

### 2.2 Negative (Error Paths)

Tests the system with **invalid, missing, or unauthorised inputs** — verifies error handling.

Rules:
- Cover each distinct error code / error message the API or UI can return
- Use `Scenario Outline` to group related negative cases under one outline
- Assert both error message content AND HTTP status code (API) or UI error label (UI/App)

```gherkin
@headout @calipso @test @test-regression @ode-regression
Scenario Outline: Verify error response when login fails with invalid "<scenario>"
  Given User set "account-login-email-v2" and "" Api endpoint
  When User set request headers
  And User set body parameters "<bodyKey>" and "<bodyValue>" for api
  And User sends the post request
  Then Verify Error Message "<expectedMessage>" and Status "<expectedCode>" code for api
  Examples:
    | scenario                    | bodyKey        | bodyValue           | expectedMessage                      | expectedCode |
    | wrong password              | email&password | VALID@example.com&wrongpass | Invalid credentials               | 401          |
    | non-existent email          | email&password | nouser@example.com&pass     | Account not found                 | 404          |
    | empty password              | email&password | VALID@example.com&          | Password cannot be empty          | 400          |
    | malformed email             | email&password | not-an-email&pass           | Invalid email format              | 400          |
    | missing auth header         | email          | VALID@example.com           | Unauthorised                      | 401          |
    | invalid content-type header | email&password | VALID@example.com&pass      |                                   | 406          |
```

### 2.3 Edge Cases

Tests **boundary conditions, extreme values, and unusual-but-valid inputs**.

Rules:
- Think about: empty strings, null values, maximum length inputs, special characters,
  Unicode, very large numbers, minimum/maximum allowed values, time zone boundaries
- Mark with the domain tag + `@test` or `@live` as appropriate
- Edge cases for timing/rate-limiting → usually `@manual`

```gherkin
@headout @calipso @test @test-regression
Scenario Outline: Verify API response for edge case query parameter "<scenario>"
  Given User set "account-get-customer-details-v2" and "" Api endpoint
  When User add cookies in header for account api
  And User set query parameters "<paramKey>" and "<paramValue>" for api
  Then User sends the get request
  And Verify Error Message "<expectedMessage>" and Status "<expectedCode>" code for api
  Examples:
    | scenario                   | paramKey      | paramValue          | expectedMessage             | expectedCode |
    | unknown currency code      | base-currency | XXX                 | Invalid currency code       | 400          |
    | max-length currency string | base-currency | USDDDDDDDDDDDDDDDDD | Invalid currency code       | 400          |
    | numeric currency code      | base-currency | 12354               | An unknown error has occurred. | 500       |
    | empty currency value       | base-currency |                     | An unknown error has occurred. | 500       |
    | no query params at all     |               |                     | An unknown error has occurred. | 500       |
```

### 2.4 Boundary Value Cases

Tests the exact **minimum, maximum, and just-outside-boundary** values.

```gherkin
@headout @booking @test @test-regression
Scenario Outline: Verify pax count boundary validation for booking creation
  Given User creates a booking with product "<productId>" and pax count "<paxCount>"
  Then Verify Error Message "<expectedMessage>" and Status "<expectedCode>" code for api
  Examples:
    | productId | paxCount | expectedMessage             | expectedCode |
    | PROD_001  | 0        | Minimum 1 pax required      | 400          |
    | PROD_001  | 1        |                             | 200          |
    | PROD_001  | 10       |                             | 200          |
    | PROD_001  | 11       | Maximum 10 pax allowed      | 400          |
    | PROD_001  | -1       | Invalid pax count           | 400          |
    | PROD_001  | 999999   | Maximum 10 pax allowed      | 400          |
```

### 2.5 Schema / Contract Tests (API only)

Verify that the response structure matches the agreed JSON schema:

```gherkin
@headout @arceus @test @test-regression @ode-regression @test-sanity
Scenario Outline: Verify schema for collection-pages API for uid "<uid>"
  Given User set "collection-pages" and "arceus" Api endpoint
  And User set request headers for arceus
  And User set base path "<uid>" for api
  And User set query parameters "locale" and "en" for api
  And User sends the get request
  Then Verify Api Response is correct with Schema "arceus-collection-pages.json"
  Examples:
    | uid                                |
    | www.kennedyspacecenter-tickets.com |
    | www.dubai-tickets.co               |
```

### 2.15 Localisation / i18n

Tests the feature across **multiple currencies, languages, locales, and timezones**.

Rules:
- Cover at least 2 currency codes (e.g. USD, EUR, INR, GBP)
- Cover at least 2 locales/languages where the API supports them (e.g. `en`, `es`, `de`)
- If endpoint does not support i18n → add `@pending` with `# BLOCKED: no i18n support confirmed`

```gherkin
@headout @<domain> @test @test-regression @ode-regression
Scenario Outline: Verify response for currency "<currency>" and locale "<locale>"
  Given User set "<endpointKey>" and "<repo>" Api endpoint
  And User set request headers
  And User set query parameters "currency&locale" and "<currency>&<locale>" for api
  And User sends the get request
  Then Verify message "" and status code "200" for api
  And Verify response currency field matches "<currency>"
  Examples:
    | currency | locale |
    | USD      | en     |
    | EUR      | de     |
    | INR      | en     |
    | GBP      | en     |
```

### 2.16 Concurrency / Race Condition

Tests behavior when the **same resource is accessed or modified simultaneously**.

Rules:
- If testable automatically → simulate parallel requests in StepDef using threads
- If not deterministically testable → mark `@manual` with steps for human tester
- Always include at least 1 scenario here — use `@manual` or `@pending` if blocked

```gherkin
@manual @<domain>
Scenario: Verify no duplicate booking created when same request sent simultaneously
  # PRE-CONDITION: Valid booking data ready, system in clean state
  # STEP 1: Send 2 identical POST /api/v2/booking/create requests at the exact same time
  # STEP 2: Record both response bookingIds
  # EXPECTED: Only 1 booking is created (idempotency key prevents duplicate)
  # EXPECTED: Second request returns 409 Conflict or the same bookingId
```

### 2.17 Data Sensitivity / PII

Tests that **sensitive and personal data is handled correctly** — not leaked, masked, or exposed.

Rules:
- Check that PII fields (email, phone, name, payment info) are masked in logs and responses
- Check that unauthenticated requests cannot access other users' data (IDOR)
- Check that internal fields (vendorId, internalCost) are not exposed to public endpoints

```gherkin
@headout @<domain> @test @test-regression
Scenario Outline: Verify PII field "<field>" is masked in response for user role "<role>"
  Given User set "<endpointKey>" and "" Api endpoint
  And User set auth token for role "<role>"
  And User sends the get request
  Then Verify message "" and status code "200" for api
  And Verify field "<field>" is masked or absent in response
  Examples:
    | role        | field          |
    | CUSTOMER    | vendorId       |
    | CUSTOMER    | internalCost   |
    | GUEST       | userEmail      |

@headout @<domain> @test @test-regression
Scenario: Verify user cannot access another user's data (IDOR)
  Given User set "<endpointKey>" and "" Api endpoint
  And User authenticates as user A
  And User sets path param to resource owned by user B
  And User sends the get request
  Then Verify message "Forbidden" and status code "403" for api
```

### 2.18 Compatibility / Version

Tests that **existing clients and prior API versions still work** after the change.

Rules:
- If a v6 or earlier endpoint exists → include a scenario that calls it and asserts backward compat
- If breaking change introduced → document it as `@pending` + link to deprecation ticket
- Always include at least 1 scenario → use `@manual` or `@pending` if no prior version exists

```gherkin
@headout @<domain> @test @test-regression @ode-regression
Scenario: Verify v6 endpoint still returns valid response after v7 introduced
  Given User set "tour-groups-v6" and "" Api endpoint
  And User set request headers
  And User set query parameters "tourGroupId" and "1001" for api
  And User sends the get request
  Then Verify message "" and status code "200" for api
  And Verify Api Response is correct with Schema "tour-groups-v6.json"

@headout @<domain> @pending
Scenario: Verify v5 deprecation returns 410 Gone after sunset date
  # BLOCKED: v5 endpoint sunset date not confirmed — track in JIRA-1234
```

### 2.22 Black Box Testing

Tests the feature **purely through its external interface** — no knowledge of internal
implementation. Techniques: equivalence partitioning (group inputs into valid/invalid classes),
decision tables, use-case based testing, specification-based testing.

**When to apply:**
- For every exposed API endpoint or UI form field
- Identify valid input equivalence classes and invalid input equivalence classes
- Each class needs exactly 1 representative scenario (not one per value)
- Tag: `@black-box`

```gherkin
# EQUIVALENCE PARTITIONING — valid and invalid classes
@headout @booking @black-box @test @test-regression
Scenario Outline: Verify booking creation for "<inputClass>" input class
  Given User set "booking-create" and "" Api endpoint
  And User set authentication for api module "bms"
  And User set body parameters "<bodyKey>" and "<bodyValue>" for api
  When User sends the post request
  Then Verify message "<expectedMessage>" and status code "<expectedCode>" for api
  Examples:
    | inputClass                         | bodyKey   | bodyValue      | expectedMessage | expectedCode |
    # ── VALID EQUIVALENCE CLASSES ──
    | valid variantId (positive integer) | variantId | 12345          |                 | 200          |
    | valid currency (ISO 4217 code)     | currency  | USD            |                 | 200          |
    | valid paxCount (1–10 range)        | paxCount  | 5              |                 | 200          |
    # ── INVALID EQUIVALENCE CLASSES ──
    | invalid variantId (zero)           | variantId | 0              | Invalid variant | 400          |
    | invalid currency (non-ISO)         | currency  | INVALID        | Invalid currency| 400          |
    | invalid paxCount (negative)        | paxCount  | -1             | Invalid pax     | 400          |
    | missing required field             |           |                | Field required  | 400          |

# DECISION TABLE — combinations of conditions → expected outcomes
@headout @booking @black-box @test @test-regression
Scenario Outline: Verify booking eligibility decision for auth="<auth>" + variant="<variantStatus>"
  Given User set "booking-create" and "" Api endpoint
  And User set authentication token "<auth>" for api
  And User set body parameters "variantId" and "<variantId>" for api
  When User sends the post request
  Then Verify message "<expectedMessage>" and status code "<expectedCode>" for api
  Examples:
    | auth    | variantStatus   | variantId | expectedMessage      | expectedCode |
    | valid   | active          | 12345     |                      | 200          |
    | valid   | inactive        | 99999     | Variant not bookable | 422          |
    | expired | active          | 12345     | Unauthorised         | 401          |
    | missing | active          | 12345     | Unauthorised         | 401          |
```

### 2.23 White Box Testing

Tests the feature **with knowledge of internal implementation** — branch coverage, path
coverage, condition coverage, exception path coverage, and internal state transitions.

**When to apply:**
- When you know the utility method has conditional branches (if/else, switch, try/catch)
- When testing `CrestDataHandler` thread-local state management
- When testing exception paths that only trigger with specific internal conditions
- When verifying all code branches in utility methods are exercised
- Tag: `@white-box`

```gherkin
# BRANCH COVERAGE — each conditional branch in the utility method
@headout @booking @white-box @test @test-regression
Scenario Outline: Verify booking utility branch for "<branch>"
  Given User set "booking-create" and "" Api endpoint
  And User set authentication for api module "bms"
  And User set body "variantId/paxCount/currency" and "<variantId>/<paxCount>/<currency>" for api
  When User sends the post request
  Then Verify message "<expectedMessage>" and status code "<expectedCode>" for api
  # BRANCH COVERED: <branch>
  Examples:
    | branch                                  | variantId | paxCount | currency | expectedMessage       | expectedCode |
    | branch: variantId valid → proceed       | 12345     | 2        | USD      |                       | 200          |
    | branch: variantId null → throw NPE path |           | 2        | USD      | variantId is required | 400          |
    | branch: currency null → default path    | 12345     | 2        |          | currency is required  | 400          |
    | branch: paxCount > max → exception path | 12345     | 99       | USD      | Maximum pax exceeded  | 400          |

# EXCEPTION PATH — internal catch blocks
@headout @booking @white-box @test @test-regression
Scenario: Verify internal exception handling when downstream service is unavailable
  Given User set "booking-create" and "" Api endpoint
  And User set authentication for api module "bms"
  And User set body parameters "variantId" and "12345" for api
  And Downstream inventory service is stubbed to return 503
  When User sends the post request
  Then Verify message "Service temporarily unavailable" and status code "503" for api

# THREAD-LOCAL STATE — CrestDataHandler isolation between scenarios
@headout @booking @white-box @test @test-regression
Scenario: Verify CrestDataHandler thread-local state does not leak between concurrent requests
  Given Two concurrent booking requests are initiated with different variantIds "12345" and "67890"
  When Both requests complete
  Then Each response contains only its own variantId
  And No cross-thread data contamination is detected

# CODE PATH COVERAGE — @manual when path requires instrumented test environment
@manual @white-box @booking
Scenario: Verify all branches in BookingUtility.buildRequest() are exercised
  # PRE-CONDITION: Code coverage tooling (JaCoCo) enabled on the test run
  # STEP 1: Run full booking regression suite with @test tag
  # STEP 2: Open JaCoCo report at target/site/jacoco/
  # STEP 3: Navigate to BookingUtility.buildRequest() method
  # EXPECTED: All branch indicators show green (100% branch coverage)
  # EXPECTED: No red/yellow branch indicators remain
```

### 2.24 Exploratory Testing

**Charter-based, session-based testing** where tester simultaneously designs, executes, and learns.
No predefined steps — the goal is to find defects not covered by scripted test cases.

**Always `@manual`** — exploratory testing cannot be scripted by definition.

**Charter format:**
```
CHARTER:  Explore <area/feature> using <technique/approach>
TARGET:   <specific area of the system>
DURATION: <time-box, e.g. 30 min>
NOTES:    <what to watch out for>
```

Rules:
- One charter per exploratory scenario
- Cover areas known to be risky or recently changed
- Focus on "what-if" chains: use output of one call as unexpected input to another
- Cover unusual sequences not covered by scripted tests
- Tag: `@exploratory @manual`

```gherkin
# CHARTER-BASED SESSION — API layer
@manual @exploratory @booking
Scenario: Exploratory charter — booking creation edge flows and "what-if" chaining
  # CHARTER:  Explore booking-create API using boundary combinations and response chaining
  # TARGET:   POST /api/v2/booking/create
  # DURATION: 45 minutes
  #
  # WHAT-IF chains to explore:
  # STEP 1: Create a booking → capture bookingId from response
  # STEP 2: Attempt to create a second booking with the same variantId+paxCount immediately
  # EXPECTED: Either idempotency key prevents duplicate, or second booking succeeds independently
  #
  # STEP 3: Cancel the first booking (use bookingId from Step 1)
  # STEP 4: Attempt to create a new booking for the same slot
  # EXPECTED: Slot is available again — no ghost reservation
  #
  # STEP 5: Attempt booking with currency mismatch (query param EUR, body currency USD)
  # EXPECTED: Consistent error — no silent currency coercion
  #
  # STEP 6: Send booking request with extra unexpected fields in body (e.g. "internalPrice")
  # EXPECTED: Fields ignored or 400 Bad Request — no internal leakage
  #
  # POST-CHECK: Audit log shows all attempted bookings including failed ones

@manual @exploratory @booking
Scenario: Exploratory charter — auth bypass and permission escalation probing
  # CHARTER:  Explore authentication boundaries for booking APIs using role variation
  # TARGET:   All booking endpoints requiring auth
  # DURATION: 30 minutes
  #
  # STEP 1: Obtain token for CUSTOMER role
  # STEP 2: Attempt to call ADMIN-only booking management endpoints with CUSTOMER token
  # EXPECTED: 403 Forbidden on all restricted endpoints
  #
  # STEP 3: Swap auth token between requests mid-session (replace token header mid-flow)
  # EXPECTED: Request fails with 401, session is invalidated
  #
  # STEP 4: Send request with malformed JWT (truncated signature)
  # EXPECTED: 401 Unauthorised — not 500 Internal Server Error
  #
  # STEP 5: Replay an expired token from a previous session
  # EXPECTED: 401 Unauthorised with "token expired" message

# CHARTER-BASED SESSION — UI layer
@manual @exploratory @celium
Scenario: Exploratory charter — checkout flow with unexpected user behaviour
  # CHARTER:  Explore checkout UI using unusual navigation and timing patterns
  # TARGET:   Checkout pages on celium (web UI)
  # DURATION: 45 minutes
  #
  # STEP 1: Start checkout → navigate backward using browser back button at each step
  # EXPECTED: Cart state preserved, no duplicate entries
  #
  # STEP 2: Open checkout in 2 browser tabs simultaneously with same session
  # EXPECTED: No race condition; last-write-wins or conflict detected
  #
  # STEP 3: Apply promo code → remove it → re-apply it rapidly 5 times
  # EXPECTED: Final price matches promo-applied state
  #
  # STEP 4: Leave checkout idle for session timeout duration, then resume
  # EXPECTED: Session re-authentication prompt, cart preserved
  #
  # STEP 5: Resize browser window to < 320px width during payment step
  # EXPECTED: Layout does not break; CTA buttons remain accessible
  #
  # POST-CHECK: No orphaned bookings in system; session cleaned up correctly

# CHARTER-BASED SESSION — Mobile App
@manual @exploratory @app
Scenario: Exploratory charter — mobile app booking under poor network conditions
  # CHARTER:  Explore app booking flow using network interruption and background/foreground switching
  # TARGET:   Booking confirmation screen in the mobile app
  # DURATION: 30 minutes
  #
  # STEP 1: Start booking → throttle network to 2G mid-request
  # EXPECTED: Graceful loading state; no crash; retry mechanism visible
  #
  # STEP 2: Put app in background during booking API call → foreground after 10 seconds
  # EXPECTED: Request either completes or retries; no duplicate booking
  #
  # STEP 3: Kill app during payment confirmation → reopen
  # EXPECTED: App recovers to confirmation or pending state; no silent failure
  #
  # POST-CHECK: Backend shows only 1 booking; no orphaned payment authorisation
```

### 2.6 Manual Test Cases

Used when a scenario **cannot be automated** reliably:
- Visual design validation (layout, spacing, colours, animations)
- Rate limiting / throttle scenarios (require precise timing control)
- Third-party payment gateways (cannot simulate real transactions)
- Hardware-dependent features (NFC, biometrics, camera)
- Complex exploratory flows with no deterministic assertion

**Format:** `@manual` scenario with full step description — NO step definitions needed.
The steps serve as instructions for a human tester.

```gherkin
@manual @absolut-pr-9096
Scenario: Check if partial refund fails when refund percentage exceeds max and user lacks REFUND_LEADS role
  # PRE-CONDITION: User has a completed booking with partial refund eligibility
  # PRE-CONDITION: User account does NOT have the REFUND_LEADS role assigned
  # STEP 1: Navigate to Hub > Booking Management > select the eligible booking
  # STEP 2: Click "Refund" and enter a refund percentage GREATER than the maximum allowed
  # STEP 3: Click "Confirm Refund"
  # EXPECTED: Error message "You do not have permission to perform this refund"
  # EXPECTED: Refund is NOT processed; booking status remains unchanged

@manual
Scenario: Check if partial refund succeeds when percentage is within limit and user has REFUND_LEADS role
  # PRE-CONDITION: User account HAS the REFUND_LEADS role assigned
  # STEP 1: Navigate to Hub > Booking Management > select an eligible booking
  # STEP 2: Click "Refund" and enter a refund percentage LESS than the maximum allowed
  # STEP 3: Click "Confirm Refund"
  # EXPECTED: Refund processed successfully
  # EXPECTED: Booking status updated to PARTIALLY_REFUNDED
```

> **`@manual` scenarios must still describe steps** so a human tester can execute them.
> Do NOT leave `@manual` scenarios with only a one-line title.

### 2.7 Pending Automation (Designed but Not Yet Implemented)

`@pending` = scenario is designed but implementation is blocked (UI not ready,
API not deployed, story in progress, or automation is WIP):

```gherkin
@headout @pending
Scenario Outline: Verify custom fields at vendor tour level in variant flow
  Given User opens the application "home" and "ui"
  And User move to "<product>" select page
  And User selects the preferred time if there is a specific time slot ""
  When User clicks on "next button" button
  And User provide add addition pax type "<paxType>" and value "<count>" details
  And User clicks on "next button" button
  Then verify if the custom fields are shown at vendor tour level
  Examples:
    | product              | paxType                               | count       |
    | CUSTOM_FIELD_PRODUCT | Adult/Person with disability/Discounted | 1/1/1     |
```

### 2.8 Revamp Cases

`@revamp<N>` = an existing scenario under revision (refactoring, new API version,
or updated acceptance criteria):

```gherkin
@headout @fulfilment @test @test-regression @revamp @fs-neo-pr-42
Scenario Outline: Verify FS Neo card generation for booking "<bookingId>"
  ...
```

---

## Phase 3 — Gherkin Format Rules

### 3.1 Feature File Structure

```
File path:
  src/test/java/com/headout/features/<domain>/<service>/<descriptive-name>.feature

Naming:
  all-lowercase-hyphen-separated.feature
  e.g. account-login.feature, checkout-promo-code.feature, calendar-date-selection.feature

Feature name:
  Feature: <human-readable description of what this file tests>
  e.g. Feature: Account Login API
       Feature: Hub Checkout Promo Code Flow
       Feature: App Calendar Date Selection
```

### 3.2 Tag Placement

Tags go on the **line immediately above** the Scenario/Scenario Outline keyword.
Group related tags on multiple lines for readability:

```gherkin
Feature: Hub login flow

  @live-mb-regression @test-mb-regression @dweb
  @ode-regression @test-regression @test-sanity @live-sanity
  @mb @kirby @headout @test-mb-collection
  Scenario Outline: Verify login on "<microBrand>" micro brand
    ...
```

**Do NOT put tags on the Feature line** unless the entire file shares the tag —
always prefer per-scenario tagging for flexibility.

### 3.3 Scenario Outline vs Scenario

| Use | When |
|-----|------|
| `Scenario Outline` + `Examples` | Same steps, different data (2+ rows) |
| `Scenario` | Unique flow that cannot be parameterised |
| `Scenario` | Single exploratory or manual case |

```gherkin
# CORRECT: same steps, different currencies
Scenario Outline: Verify currency conversion for "<microBrand>"
  Given User opens the page "home" of micro brand "<microBrand>" ...
  ...
  Examples:
    | microBrand           | currencyCode | defaultCurrency |
    | kennedy-space-center | INR          | USD             |
    | kennedy-space-center | USD          | USD             |
    | tickets-rome         | EUR          | EUR             |

# CORRECT: unique multivariant flow — cannot be parameterised
Scenario: Validate multivariant booking flow for COMBO product on the-vatican-tickets
  Given User opens the page "home" of micro brand "the-vatican-tickets" ...
  ...
```

### 3.4 Given / When / Then Rules

```
Given   → Pre-condition / setup state (system must be in this state before the test)
When    → User action / trigger (the thing being tested)
Then    → Assertion / expected outcome
And     → Continuation of the previous keyword's context
But     → Negative continuation (rarely used)
```

**Anti-patterns to avoid:**

```gherkin
# WRONG: assertion in Given
Given Response status is 200

# WRONG: action in Then
Then User clicks the buy button

# WRONG: everything in When
When User logs in and navigates to checkout and applies promo code and sees total

# CORRECT: one clear action per When step
When User applies promo code "SUMMER20"
Then Promo discount is applied and total is reduced
```

### 3.5 Step Text Rules

- **Parameterise with `"double quotes"`** — always quote variable values
- **Never hardcode** environment URLs, IDs, credentials, or prices in step text
- **Use placeholders** from Examples table — `"<productId>"`, `"<email>"`, `"<code>"`
- **Max one action per When** — split long chains into multiple When/And steps
- **Tense:** present tense, active voice — "User clicks", "User enters", "Verify that"

```gherkin
# CORRECT
Given User set "account-login-email-v2" and "" Api endpoint
And User set body parameters "email&password" and "DIST_EMAIL&DIST_PASSWORD" for api
When User sends the post request
Then Verify Error Message "Invalid credentials" and Status "401" code for api

# WRONG — hardcoded URL
Given User navigates to "https://api.headout.com/api/v2/account/login"

# WRONG — multiple actions in one step
When User enters email "test@headout.com" and password "password123" and clicks login
```

### 3.6 Background (Shared Pre-conditions)

Use `Background:` only when **every** scenario in the feature file needs the same setup:

```gherkin
Feature: Arceus Collection Pages API

  Background:
    Given User set request headers for arceus

  @headout @arceus @test @test-regression
  Scenario Outline: Validate schema for collection-pages API for <uid>
    Given User set "collection-pages" and "arceus" Api endpoint
    And User set base path "<uid>" for api
    ...
```

Do NOT use Background if only some scenarios share the pre-condition — use `@Before` hooks instead.

### 3.7 DocString and DataTable Usage

Use DataTable when a step requires a **list or structured data**:

```gherkin
Then Verify following "product-card" sections on Kirby "horizontal-product-card":
  | title               |
  | primary-category    |
  | average-rating      |
  | rating-count        |
  | product-descriptors |
  | price               |
  | booking-flow-cta    |
```

Use DocString for raw JSON request bodies:

```gherkin
Given User sets request body:
  """
  {
    "email": "test@headout.com",
    "password": "TestPass@123"
  }
  """
```

---

## Phase 4 — Tag Taxonomy

### Mandatory Tags (at least one from each group)

| Group | Tags | Purpose |
|-------|------|---------|
| Environment | `@test`, `@live`, `@ondemand` | Which environment to run against |
| Status | _(none for automated)_, `@pending`, `@manual`, `@revamp` | Lifecycle state |

### Optional Suite Tags

| Category | Tags | When to Apply |
|----------|------|---------------|
| Domain | `@headout`, `@calipso`, `@arceus`, `@kirby`, `@fulfilment` | Service domain |
| Platform (UI) | `@dweb`, `@mb`, `@mweb` | Desktop web / mobile web |
| Platform (App) | `@app`, `@android`, `@ios` | Mobile app |
| Regression | `@test-regression`, `@ode-regression`, `@live-regression` | Regression suites |
| Sanity | `@test-sanity`, `@ode-sanity`, `@live-sanity` | Sanity/smoke suites |
| E2E | `@test-headout-e2e-flow`, `@ode-headout-e2e-flow` | End-to-end journeys |
| PR reference | `@absolut-pr-9096`, `@kirby-pr-907`, `@fs-neo-pr-42` | Links scenario to the PR |

### Tag Combination Examples

```gherkin
# API — full regression + sanity + cross-env
@headout @calipso @test @live @test-regression @ode-regression @test-sanity @ode-calipso

# UI desktop — regression + sanity on test environment
@headout @kirby @test @dweb @test-regression @test-sanity @test-mb-collection

# UI mobile browser — live + ode regression
@headout @kirby @live @mb @live-mb-regression @ode-mb-regression @live-mb-sanity

# App — test env only, pending
@app @pending

# App — manual validation
@app @manual

# Under revamp (linked to a PR)
@headout @fulfilment @test @test-regression @revamp @fs-neo-pr-42
```

---

## Phase 5 — Complete Test Suite Template

This template shows all scenario types for a single feature. Use this as the
starting structure for any new `.feature` file.

```gherkin
Feature: <Service Name> — <Short Description>
# File: src/test/java/com/headout/features/<domain>/<service>/<name>.feature

  # ─────────────────────────────────────────────────────────────────
  # POSITIVE — Happy Path
  # ─────────────────────────────────────────────────────────────────

  @headout @<domain> @test @test-regression @test-sanity @ode-regression
  Scenario Outline: Verify successful <action> with valid "<testCase>"
    Given <pre-condition setup>
    When  <primary action>
    Then  <primary assertion>
    And   <secondary assertion>
    Examples:
      | testCase        | inputParam      | expectedResult |
      | standard user   | VALID_DATA      | SUCCESS        |
      | premium user    | PREMIUM_DATA    | SUCCESS        |

  # ─────────────────────────────────────────────────────────────────
  # POSITIVE — Alternative Valid Paths
  # ─────────────────────────────────────────────────────────────────

  @headout @<domain> @test @test-regression
  Scenario Outline: Verify <action> works with optional parameter "<parameter>"
    Given <pre-condition>
    When  <action with optional param>
    Then  <expected outcome>
    Examples:
      | parameter   | expectedBehaviour  |
      | with param  | extended response  |
      | without param | default response |

  # ─────────────────────────────────────────────────────────────────
  # NEGATIVE — Invalid Inputs
  # ─────────────────────────────────────────────────────────────────

  @headout @<domain> @test @test-regression @ode-regression
  Scenario Outline: Verify error when "<errorScenario>"
    Given <pre-condition>
    When  <action with invalid input>
    Then  Verify Error Message "<expectedMessage>" and Status "<expectedCode>" code for api
    Examples:
      | errorScenario              | invalidInput | expectedMessage          | expectedCode |
      | missing required field     |              | Field is required        | 400          |
      | invalid format             | bad-value    | Invalid format           | 400          |
      | unauthorised access        | NO_AUTH      | Unauthorised             | 401          |
      | forbidden (wrong role)     | WRONG_ROLE   | Forbidden                | 403          |
      | resource not found         | ID_999999    | Not found                | 404          |
      | wrong content type         | BAD_HEADER   |                          | 406          |

  # ─────────────────────────────────────────────────────────────────
  # EDGE / BOUNDARY
  # ─────────────────────────────────────────────────────────────────

  @headout @<domain> @test @test-regression
  Scenario Outline: Verify boundary behaviour for "<boundaryCase>"
    Given <pre-condition>
    When  <action with boundary value>
    Then  <expected outcome>
    Examples:
      | boundaryCase         | value    | expectedOutcome |
      | minimum valid value  | 1        | success         |
      | maximum valid value  | 100      | success         |
      | below minimum        | 0        | error: 400      |
      | above maximum        | 101      | error: 400      |
      | exactly at min       | 1        | success         |
      | exactly at max       | 100      | success         |

  # ─────────────────────────────────────────────────────────────────
  # SCHEMA / CONTRACT (API only)
  # ─────────────────────────────────────────────────────────────────

  @headout @<domain> @test @test-regression @ode-regression
  Scenario Outline: Verify response schema for <entity> with "<paramValue>"
    Given <endpoint setup>
    And   User set query parameters "<paramKey>" and "<paramValue>" for api
    When  User sends the get request
    Then  Verify Api Response is correct with Schema "<schemaFileName>.json"
    Examples:
      | paramKey | paramValue | schemaFileName  |
      | locale   | en         | entity-schema   |
      | locale   | es         | entity-schema   |

  # ─────────────────────────────────────────────────────────────────
  # PENDING (Designed, not yet automatable)
  # ─────────────────────────────────────────────────────────────────

  @headout @<domain> @pending
  Scenario Outline: Verify <feature requiring WIP backend/UI>
    Given <pre-condition>
    When  <action>
    Then  <expected assertion>
    Examples:
      | testData |
      | value1   |

  # ─────────────────────────────────────────────────────────────────
  # MANUAL (Cannot be reliably automated)
  # ─────────────────────────────────────────────────────────────────

  @manual @<domain-pr-reference>
  Scenario: Verify <visual / rate-limit / hardware-dependent behaviour>
    # PRE-CONDITION: <state the system must be in>
    # STEP 1: <human tester action 1>
    # STEP 2: <human tester action 2>
    # STEP 3: <human tester action 3>
    # EXPECTED: <what the tester should observe>
    # EXPECTED: <secondary observation>
    # POST-CHECK: <state to verify after test>

  @manual
  Scenario: Verify <another manual scenario>
    # PRE-CONDITION: ...
    # STEP 1: ...
    # EXPECTED: ...

  # ─────────────────────────────────────────────────────────────────
  # BLACK BOX — Equivalence Partitioning + Decision Table
  # ─────────────────────────────────────────────────────────────────

  @headout @<domain> @black-box @test @test-regression
  Scenario Outline: Verify system response for "<inputClass>" equivalence class
    Given <endpoint setup>
    And   User set body parameters "<bodyKey>" and "<bodyValue>" for api
    When  <action>
    Then  Verify message "<expectedMessage>" and status code "<expectedCode>" for api
    Examples:
      # ── VALID CLASSES ──
      | inputClass          | bodyKey | bodyValue     | expectedMessage | expectedCode |
      | valid input class 1 | key1    | valid-value-1 |                 | 200          |
      | valid input class 2 | key2    | valid-value-2 |                 | 200          |
      # ── INVALID CLASSES ──
      | invalid class — null   | key1 |            | Field required  | 400          |
      | invalid class — format | key1 | bad!@#value | Invalid format  | 400          |

  # ─────────────────────────────────────────────────────────────────
  # WHITE BOX — Branch / Path / Condition Coverage
  # ─────────────────────────────────────────────────────────────────

  @headout @<domain> @white-box @test @test-regression
  Scenario Outline: Verify utility branch coverage for "<branch>"
    Given <endpoint setup>
    And   User set body "<key1>/<key2>" and "<val1>/<val2>" for api
    When  <action>
    Then  Verify message "<expectedMessage>" and status code "<expectedCode>" for api
    # BRANCH COVERED: <branch>
    Examples:
      | branch                       | key1  | key2  | val1       | val2 | expectedMessage | expectedCode |
      | valid → success branch       | field | count | valid      | 1    |                 | 200          |
      | null field → NPE branch      |       | count |            | 1    | Field required  | 400          |
      | count > max → exception path | field | count | valid      | 999  | Exceeds maximum | 400          |

  @manual @white-box @<domain>
  Scenario: Verify JaCoCo branch coverage for <Service>Utility after full regression run
    # PRE-CONDITION: JaCoCo code coverage enabled (mvn test -Pjacoco)
    # STEP 1: Run @test-regression suite for this domain
    # STEP 2: Open target/site/jacoco/<ServiceUtility>.html
    # EXPECTED: All branches in key methods show green (100% branch coverage)
    # EXPECTED: No uncovered catch blocks remain

  # ─────────────────────────────────────────────────────────────────
  # EXPLORATORY — Charter-Based Session
  # ─────────────────────────────────────────────────────────────────

  @manual @exploratory @<domain>
  Scenario: Exploratory charter — <feature> API boundary and "what-if" chaining
    # CHARTER:  Explore <feature> API using unexpected input combinations and response chaining
    # TARGET:   <primary endpoint(s)>
    # DURATION: 30–45 minutes
    #
    # STEP 1: Execute happy-path request → capture key response fields
    # STEP 2: Use captured field as input to a second unexpected request
    # EXPECTED: System handles chained inputs without data leakage or crash
    #
    # STEP 3: Send request with extra undocumented fields in body
    # EXPECTED: Extra fields ignored or 400 — no internal data leakage
    #
    # STEP 4: Rapidly repeat the same request 10× in quick succession
    # EXPECTED: No duplicate records; idempotency holds; no 5xx errors
    #
    # STEP 5: Mix valid and invalid params in same request in various combinations
    # EXPECTED: Consistent error messages; no 500s; no partial saves
    #
    # POST-CHECK: Audit log shows all attempts including failures; no orphaned records
```

---

## Phase 6 — Layer-Specific Checklist

### API (crest)

Before submitting:
- [ ] `Scenario Outline` used whenever 2+ data rows apply the same steps
- [ ] Both success (2xx) and failure (4xx/5xx) status codes covered
- [ ] JSON schema validation scenario included for GET endpoints returning entities
- [ ] No hardcoded API URLs in step text — uses CommonStepDef endpoint setter
- [ ] Error scenarios use `Verify Error Message "..." and Status "..." code for api`
- [ ] At least one `@test-sanity` tagged scenario for CI smoke gate

### Web UI (celium)

Before submitting:
- [ ] `Scenario Outline` used for data-driven flows (currencies, languages, brands)
- [ ] Both positive flow (form submits) and error states (field validation) covered
- [ ] SEO/meta scenarios (`@mb` / `@dweb`) separated from functional scenarios
- [ ] Manual scenarios written for visual design acceptance criteria
- [ ] `@pending` used when locators not yet available (feature in development)
- [ ] DataTable used when verifying multiple UI sections on one screen

### Mobile App (appium)

Before submitting:
- [ ] `@app` tag on every scenario
- [ ] Both `@android` and `@ios` tags when platform-specific behaviour exists
- [ ] Booking pre-conditions use shared data setup — not inline in scenario
- [ ] `@manual` used for design/layout and animation validation
- [ ] `@pending` used for features not yet in the build
- [ ] Each scenario is independent — no scenario depends on another scenario's state

---

## Phase 7 — Mandatory Test Case Count Targets (All 24 Categories)

**ALL 24 categories are mandatory.** Minimum count is the floor — not a target.
If a category produces 0 automatable scenarios, a `@pending` entry is still required.

| # | Category | Minimum | Output if not automatable |
|---|----------|---------|--------------------------|
| 2.1 | Positive — Happy Path | 1–2 | — (always automatable) |
| 2.2 | Positive — Alternative Paths | 1–3 | — (always automatable) |
| 2.3 | Negative — Error Paths | 3–6 (one per error code) | — (always automatable) |
| 2.4 | Validation — Field Level | 1 per required/constrained field | — (always automatable) |
| 2.5 | Edge Cases | 2–4 | — (usually automatable) |
| 2.6 | Boundary Values | 4 (min / max / min-1 / max+1) | — (always automatable) |
| 2.7 | Combination / Pairwise | 1 outline with ≥4 rows | `@pending` if single-param endpoint |
| 2.8 | State Transition | 1 per lifecycle state change | `@pending` if entity has no lifecycle |
| 2.9 | Schema / Contract | 1 per entity response | `@pending` if POST-only, no GET |
| 2.10 | Security / Authorization | 2 (401 + 403) minimum | — (always automatable) |
| 2.11 | Idempotency | 1 (repeat GET or POST) | — (always automatable) |
| 2.12 | Cross-service / Integration | 1 | `@pending` if isolated single-service |
| 2.13 | E2E Journey | 1 | `@pending` if no upstream/downstream flow |
| 2.14 | Performance Baseline | 1 `@manual` | `@manual` always |
| 2.15 | Localisation / i18n | 1 outline ≥2 currencies/locales | `@pending` if no i18n support |
| 2.16 | Concurrency / Race Condition | 1 `@manual` or `@pending` | `@manual` always |
| 2.17 | Data Sensitivity / PII | 1–2 (PII mask + IDOR) | `@pending` if no PII fields |
| 2.18 | Compatibility / Version | 1 (prior version test) | `@pending` if first version |
| 2.19 | Manual | 1+ | — (always needed) |
| 2.20 | Pending | 1+ (all blocked cases) | — (write it even if empty reason) |
| 2.21 | Revamp | 0–N | Only when prior scenarios exist |
| 2.22 | Black Box | 1 outline (valid classes + invalid classes) + optional decision table | `@pending` if input space trivially covered by 2.1–2.4 |
| 2.23 | White Box | 1 outline (one row per code branch) + 1 `@manual` JaCoCo check | `@manual` JaCoCo scenario always; `@pending` if no utility with branches |
| 2.24 | Exploratory | 1+ `@manual` charter scenarios | — (always `@manual`; never `@pending`) |

**Anti-hallucination rule:** After producing the matrix, the agent MUST verify:
```
COUNT check: matrix rows per category ≥ minimum above.
If any category has 0 rows → STOP and add a @pending entry before proceeding to code.
```

---

## Phase 8 — Anti-Patterns

```gherkin
# WRONG: Test depends on another test's output
Scenario: Verify booking cancellation
  Given The previous test created a booking   ← depends on external state

# WRONG: No data coverage — single row in Scenario Outline
Scenario Outline: Verify currency
  Examples:
    | currency |
    | USD      |   ← why not just use Scenario?

# WRONG: Missing error scenario coverage
# (Feature has 5 positive scenarios, 0 negative)

# WRONG: @manual with no steps
@manual
Scenario: Verify UI looks good   ← useless to a human tester

# WRONG: Mixing layers in one feature file
Feature: Login
  Scenario: API login works          ← API layer
  Scenario: UI login button visible  ← UI layer (separate file!)

# WRONG: Hardcoded dates, prices, IDs in Examples
  Examples:
    | bookingId | expectedPrice |
    | 12345678  | INR 1,200     |   ← use config constants, not literals
```
