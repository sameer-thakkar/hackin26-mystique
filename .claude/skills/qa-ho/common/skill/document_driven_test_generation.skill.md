---
name: document_driven_test_generation
description: "Generates complete test suites (feature files, utility/PO code, schema files, test matrix) from cURL + response samples, GitHub dev PRs, Notion PRDs, and Google Docs for crest/celium/pixify/appium."
version: 1.0.0
testingTypes: [API, E2E, Mobile, Integration, VisualDiff]
repos: [crest, celium, pixify, appium]
---

# Document-Driven Test Generation Skill

---

## Supported Input Sources

| Source Type | What You Provide | What Gets Generated |
|-------------|-----------------|---------------------|
| **cURL + Response** | `curl -X ... -d '...'` + sample JSON | API feature file, schema JSON, utility code |
| **GitHub Dev PR** | PR URL or PR description + diff | Full test suite for changed endpoints/screens |
| **Notion Page** (PRD/ERD) | Notion URL or pasted content | Test case matrix + Gherkin for all layers |
| **Google Doc** (PRD/ERD) | Doc URL or pasted content | Test case matrix + Gherkin for all layers |

---

## Source 1 — cURL + Response Sample

### Input Format

Paste one or more cURL commands and, optionally, a sample JSON response.

```bash
# Example input
curl -X GET 'https://api.test-headout.com/api/v2/inventory/by-variant-id?variantId=12345&currency=USD&date=2024-06-15' \
  -H 'Accept: application/json' \
  -H 'x-api-key: API_KEY_VALUE'

# Sample response:
# {
#   "items": [{ "id": "inv-001", "startDateTime": "2024-06-15T09:00:00Z", ... }],
#   "total": 3, "nextUrl": null, "prevUrl": null, "nextOffset": null
# }
```

### Extraction Protocol

**Parse the cURL into a structured API contract:**

```
ENDPOINT KEY:   <derive a short lowercase-hyphen name from the path>
                e.g. /api/v2/inventory/by-variant-id → "inventory-by-variant-id"

METHOD:         GET / POST / PUT / DELETE / PATCH

PATH SEGMENTS:  Fixed path parts vs dynamic parts
                /api/v2/booking/{bookingId} → basePath = bookingId value, endpoint = .../booking/

QUERY PARAMS:   List every param: name, type, required/optional
                variantId: string, required
                currency:  string, optional (defaults to USD)
                date:      string (ISO date), required

REQUEST BODY:   List every field: name, type, required/optional
                variantId: string, required
                personDetails: array of { type: string, count: integer }, required

HEADERS:        Auth header type: Bearer token / API key / Cookie / None
                Additional headers: Content-Type, Accept

RESPONSE:       Top-level shape: object with "data" wrapper | direct object | array
                Key fields: list all fields, mark nullable
                Error shape: { "message": string, "status": integer, "error": object }
```

### What to Generate

For each cURL input, produce all of:

**1. Endpoint key in URLBuilders** — add a string key directly to `endpointMap`,
no static constants:
```java
// In URLBuilders.java — inside setEndPoint(), one line per new endpoint:
endpointMap.put("inventory-by-variant-id",
    PropertyUtils.get(ConfigMap.API_BASE_URL) + "/api/v2/inventory/by-variant-id");

// Reference in Gherkin:
// Given User set "inventory-by-variant-id" and "calipso" Api endpoint
```

**2. Utility class** — full `<Service>Utility.java` with request build + assertions:
```java
// src/test/java/com/headout/api/calipso/InventoryUtility.java
public class InventoryUtility extends BaseAutomation {

    public void getInventoryByVariantId(String variantId) {
        TestNGLogUtility.info("Fetching inventory for variantId: " + variantId);
        // Use the string key directly — no static constant
        request.get().endpoint(URLBuilders.getUrl("inventory-by-variant-id"));
        request.get().header("x-api-key", GetSecretToken.getApiKey());
        request.get().queryParams("variantId", variantId);
        request.get().queryParams("currency",
            CrestDataHandler.getValueFromDate("currentCurrency"));
        request.get().queryParams("date",
            CrestDataHandler.getValueFromDate("startDate"));
        response.set(requestMethod.get(request.get().build()));
    }

    public void verifyInventoryResponse(String expectedAvailability) {
        Assert.assertEquals(
            response.get().getStatusCode(), HttpStatus.SC_OK,
            "Inventory API status. Endpoint: " + request.get().build().getEndpoint()
                + " Params: " + request.get().build().getQueryParameterList()
        );
        softAssertionUtil.get().assertNotNull(
            response.get().jsonPath().getString("items[0].id"), "First item ID is null"
        );
        softAssertionUtil.get().assertEquals(
            response.get().jsonPath().getString("items[0].availability"),
            expectedAvailability, "Availability mismatch"
        );
        softAssertionUtil.get().assertAll();
    }
}
```

**3. Schema file** at `src/test/resources/ResponseSchema/<ServiceName>.json`:
Derive from the sample response — see qa/api/skill/SKILL.md schema section.

**4. Feature file** — all scenario types:
```gherkin
Feature: Inventory by Variant ID API

  # POSITIVE
  @headout @calipso @test @test-regression @test-sanity @ode-regression
  Scenario Outline: Verify inventory details for variant "<variantId>"
    Given User set "inventory-by-variant-id" and "calipso" Api endpoint
    And User set request headers
    And User set query parameters "variantId" and "<variantId>" for api
    And User sends the get request
    Then Verify inventory response has availability "<availability>"
    Examples:
      | variantId | availability |
      | 12345     | AVAILABLE    |
      | 67890     | AVAILABLE    |

  # SCHEMA CONTRACT
  @headout @calipso @test @test-regression @ode-regression
  Scenario: Validate response schema for inventory-by-variant-id
    Given User set "inventory-by-variant-id" and "calipso" Api endpoint
    And User set request headers
    And User set query parameters "variantId" and "12345" for api
    And User sends the get request
    Then Verify Api Response is correct with Schema "InventoryByVariantId.json"

  # NEGATIVE
  @headout @calipso @test @test-regression @ode-regression
  Scenario Outline: Verify error for inventory API with invalid "<scenario>"
    Given User set "inventory-by-variant-id" and "calipso" Api endpoint
    And User set header parameters "<headerKey>" and "<headerValue>" for api
    And User set query parameters "<paramKey>" and "<paramValue>" for api
    And User sends the get request
    Then Verify Error Message "<expectedMessage>" and Status "<expectedCode>" code for api
    Examples:
      | scenario           | headerKey   | headerValue          | paramKey  | paramValue | expectedMessage             | expectedCode |
      | missing variantId  | Accept      | application/json     |           |            | variantId is required       | 400          |
      | invalid variantId  | Accept      | application/json     | variantId | abc!@#     | Invalid variant ID          | 400          |
      | no auth header     |             |                      | variantId | 12345      | Unauthorised                | 401          |
      | wrong accept type  | Accept      | application/atom+xml | variantId | 12345      |                             | 406          |
      | non-existent ID    | Accept      | application/json     | variantId | 99999999   | Variant not found           | 404          |
```

---

## Source 2 — GitHub Dev PR

### What to Provide

Either:
- The **PR URL**: `https://github.com/headout/<repo>/pull/<number>`
- Or paste the **PR title + description + file diff summary**

### Extraction Protocol

Read the PR and extract:

```
CHANGED ENDPOINTS:
  - New endpoints (new routes in controller/router files)
  - Modified endpoints (changed request/response shapes)
  - Deleted endpoints (removed)

CHANGED SCREENS / COMPONENTS (for UI/App PRs):
  - New pages or screens
  - Modified interactions or flows
  - New data-qa-marker attributes added (check HTML/JSX diff)
  - New qaid-* resource-id attributes (check XML/layout diff)

BUSINESS LOGIC CHANGES:
  - New validation rules
  - Changed error codes or messages
  - New status transitions (e.g. booking status machine changes)
  - Permission/role changes
  - New configuration flags

BREAKING CHANGES:
  - Removed/renamed fields in response
  - Changed field types (string → integer)
  - Changed required → optional or optional → required
```

### Test Generation Rules Per Change Type

| Change | Required Tests |
|--------|----------------|
| **New endpoint** | Positive + schema + all negatives + edge cases (full suite) |
| **Modified endpoint** (new field) | Add field to schema, add positive scenario using new field |
| **Modified endpoint** (changed error) | Update negative scenario error message/code |
| **Removed field from response** | Remove from schema `required`, update assertions |
| **New UI screen** | UI positive flow + visual manual scenario + error states |
| **New app screen** | App positive flow + manual visual + deep link test |
| **New validation rule** | Add 1 negative scenario per new rule |
| **New role/permission** | Add forbidden (403) and authorised scenarios |
| **Breaking API change** | Update schema file + update all assertions on the field |

### Output Structure

```
For PR: headout/crest#1234 "feat(booking): add promo code support to booking create"

AFFECTED ENDPOINT:  POST /api/v2/booking/create
CHANGE TYPE:        Modified — new request field `promoCode`, new response field `discountAmount`

GENERATE:
  1. Update ResponseSchema/BookingCreate.json
     → Add "discountAmount": { "type": ["null", "number"] } to properties
     → Add to required if always present; leave out if optional

  2. Add to booking-create.feature:
     → Positive: booking with valid promo code
     → Positive: booking without promo code (still works — backwards compat)
     → Negative: invalid promo code → 400 "Invalid promo code"
     → Negative: expired promo code → 400 "Promo code has expired"
     → Edge: promo code with leading/trailing whitespace → trimmed or 400
     → Edge: promo code for different product → 400 "Promo code not applicable"

  3. Update BookingUtility.java
     → Add promoCode parameter to createBooking()
     → Add verifyDiscountApplied() assertion method
```

---

## Source 3 — Notion Page (PRD or ERD)

### What to Provide

Either:
- **Notion URL** (if the agent can access it via web fetch)
- **Pasted content** from the Notion page

### How to Read a Notion PRD

A Product Requirements Document typically has these sections:

```
OVERVIEW / PROBLEM STATEMENT
  → What user problem is being solved?
  → Gives context for what "correct behaviour" means in tests.

USER STORIES / ACCEPTANCE CRITERIA
  → GOLD: directly maps to test cases.
  → Each "Acceptance Criteria" bullet = minimum 1 automated test.

FUNCTIONAL REQUIREMENTS
  → "The system MUST / SHOULD / MAY..."
  → MUST → automated positive + negative tests
  → SHOULD → automated if deterministic, else @manual
  → MAY → @pending until confirmed in scope

API CONTRACTS / ENDPOINTS
  → New/changed endpoint list with request/response shapes
  → Treat each endpoint as a cURL input (Source 1 above)

UI DESIGNS / WIREFRAMES / FIGMA LINKS
  → Identify new screens, components, interactions
  → Extract data-qa-marker values if mentioned, or note for @manual

EDGE CASES / OUT-OF-SCOPE
  → Edge cases listed → add to test matrix
  → Out-of-scope → mark as @manual or @pending with comment

NON-FUNCTIONAL REQUIREMENTS (performance, accessibility, etc.)
  → Performance targets → @manual or Gatling performance tests
  → Accessibility → @manual
```

### Extraction Flow

```
1. READ the Notion page fully before generating any tests.

2. BUILD a test case matrix (use Phase 2 format from test_case_creation.skill.md):
   | # | Acceptance Criterion | Test Type | Layer | Automatable? | Tag |

3. FOR EACH ROW that is automatable:
   - If it's an API criterion → generate cURL-style contract + feature file
   - If it's a UI criterion   → identify page/component, generate Gherkin
   - If it's an App criterion → identify screen, generate Gherkin

4. FOR EACH ROW that is NOT automatable:
   - Write a @manual Scenario with full step instructions
   - Reference the acceptance criterion number in a comment

5. OUTPUT in this order:
   a. Test Case Matrix table
   b. API feature files (with schemas) — for each endpoint
   c. UI feature files — for each new screen/flow
   d. App feature files — for each new screen/flow
   e. List of @manual scenarios
   f. List of @pending scenarios with blocking reason
```

### Example — Notion PRD Extraction

**Notion content (input):**
```
Feature: Promo Code on Checkout
Acceptance Criteria:
  AC-1: User can enter a valid promo code and see the discount applied
  AC-2: An invalid promo code shows the error "Invalid promo code"
  AC-3: An expired promo code shows the error "This promo code has expired"
  AC-4: Promo code field is not visible until "Have a promo code?" is tapped (App)
  AC-5: Promo code discount is reflected in the booking confirmation email (out of scope for automation)
  AC-6: Maximum 1 promo code per booking
  AC-7: Promo code is case-insensitive

API: POST /api/v2/booking/apply-promo
     Request: { bookingId: string, promoCode: string }
     Response 200: { discountAmount: number, finalAmount: number, currency: string }
     Response 400: { message: "Invalid promo code" | "Promo code has expired" | "Maximum 1 promo code per booking" }
```

**Generated Test Case Matrix:**

| AC | Criterion | Test Type | Layer | Automatable | Tag |
|----|-----------|-----------|-------|-------------|-----|
| AC-1 | Valid promo applied, discount shown | Positive | API + App + UI | Yes | `@test @test-sanity` |
| AC-2 | Invalid promo → error message | Negative | API + App + UI | Yes | `@test @test-regression` |
| AC-3 | Expired promo → error message | Negative | API + App + UI | Yes | `@test @test-regression` |
| AC-4 | Promo field hidden until tap | UI/UX | App | Partial — interaction automatable | `@app @test` |
| AC-5 | Email reflects discount | External/email | None | No | `@manual` |
| AC-6 | Max 1 promo code | Edge | API + App | Yes | `@test @test-regression` |
| AC-7 | Case-insensitive code | Edge | API | Yes | `@test @test-regression` |

**Generated API Feature File:**
```gherkin
Feature: Booking Apply Promo Code API

  @headout @booking @test @test-regression @test-sanity @ode-regression
  Scenario Outline: AC-1 — Verify successful promo code application for "<promoCode>"
    Given User set "booking-apply-promo" and "" Api endpoint
    And User set request headers
    And User set body parameters "bookingId&promoCode" and "<bookingId>&<promoCode>" for api
    And User sends the post request
    Then Verify message "" and status code "200" for api
    And Verify promo response has discount amount greater than zero
    And Verify Api Response is correct with Schema "BookingApplyPromo.json"
    Examples:
      | bookingId       | promoCode  |
      | BOOKING_ID_LIVE | SUMMER20   |
      | BOOKING_ID_LIVE | SUMMER20   |

  @headout @booking @test @test-regression @ode-regression
  Scenario Outline: AC-2/AC-3/AC-6 — Verify error for promo code with "<scenario>"
    Given User set "booking-apply-promo" and "" Api endpoint
    And User set request headers
    And User set body parameters "bookingId&promoCode" and "<bookingId>&<promoCode>" for api
    And User sends the post request
    Then Verify Error Message "<expectedMessage>" and Status "<expectedCode>" code for api
    Examples:
      | scenario            | bookingId       | promoCode      | expectedMessage                    | expectedCode |
      | AC-2 invalid code   | BOOKING_ID_LIVE | BADCODE        | Invalid promo code                 | 400          |
      | AC-3 expired code   | BOOKING_ID_LIVE | EXPIRED2022    | This promo code has expired        | 400          |
      | AC-6 second promo   | BOOKING_HAS_PROMO | SUMMER20     | Maximum 1 promo code per booking   | 400          |
      | AC-7 lowercase code | BOOKING_ID_LIVE | summer20       |                                    | 200          |
      | missing bookingId   |                 | SUMMER20       | bookingId is required              | 400          |
      | missing promoCode   | BOOKING_ID_LIVE |                | promoCode is required              | 400          |
      | no auth             | BOOKING_ID_LIVE | SUMMER20       | Unauthorised                       | 401          |

  @manual
  Scenario: AC-5 — Verify promo discount is reflected in booking confirmation email
    # PRE-CONDITION: A booking with a valid promo code applied
    # STEP 1: Apply promo code SUMMER20 to a live booking
    # STEP 2: Complete booking and wait for confirmation email
    # STEP 3: Open the confirmation email
    # EXPECTED: Email shows original amount, discount amount, and discounted final amount
    # NOTE: Email delivery is out of scope for automation
```

---

## Source 4 — Google Doc (PRD or ERD)

### What to Provide

Either:
- **Google Doc URL** (if shareable and accessible)
- **Pasted text content** from the doc

### ERD-Specific Extraction

An Entity-Relationship Document defines data models. Extract for API testing:

```
FOR EACH ENTITY:
  → Identify all fields and their types → use for schema generation
  → Identify required vs optional fields → use for required[] in schema
  → Identify unique constraints → edge case: duplicate value test
  → Identify foreign key relationships → data setup pre-conditions

FOR EACH RELATIONSHIP:
  → One-to-many: test fetching the "many" side, test creating related entities
  → Many-to-many: test association/disassociation endpoints
  → Cascades (delete parent → child deleted): negative scenario — use deleted parent ID

FOR EACH ENUM FIELD:
  → Positive: each valid enum value
  → Negative: invalid enum value → 400
  → Edge: empty string → 400

FOR EACH CONSTRAINT (unique, not-null, max-length):
  → Negative: violate the constraint → assert 400 + error message
```

### PRD-Specific Extraction

Same as Notion PRD above — the reading protocol is identical regardless of
whether it's a Google Doc or Notion page. Apply the 5-step extraction flow
from Source 3.

---

## Universal Output Template — All Source Types

When generating from any document source, always output in this structure:

```
## Test Generation Report

### Source
[Source type + URL/description]

### Affected Layers
API (crest) | UI (celium) | App (appium) — list which apply

### Test Case Matrix
[Table with: # | Description | Test Type | Layer | Automatable | Tag]

### Generated Files

#### API Layer (crest)
  src/test/resources/ResponseSchema/<ServiceName>.json
  src/test/java/com/headout/api/<domain>/<Service>Utility.java
  src/test/java/com/headout/stepdefinitions/<domain>/<Service>StepDef.java
  src/test/java/com/headout/features/<domain>/<service>/<name>.feature

#### UI Layer (celium)
  src/test/java/com/headout/pageobjects/<domain>/<Page>PO.java
  src/test/java/com/headout/stepdefinitions/<domain>/<Feature>StepDef.java
  src/test/java/com/headout/features/<domain>/<service>/<name>.feature

#### App Layer (appium)
  src/test/java/com/headout/pages/<Screen>PO.java
  src/test/java/com/headout/stepdefinitions/<Feature>StepDef.java
  src/test/java/com/headout/features/<domain>/<name>.feature

### Manual Test Cases
[List all @manual scenarios with full step instructions]

### Pending (Blocked) Cases
[List all @pending scenarios with blocking reason and linked ticket]

### Gaps / Clarifications Needed
[List any ambiguous acceptance criteria that need product clarification before automating]
```

---

## Layer Decision — API vs UI vs App

When a document describes a feature, this table determines which layer(s) to test:

| Feature Change | API (crest) | UI (celium) | App (appium) |
|---------------|-------------|-------------|--------------|
| New backend endpoint | Always | Only if UI surfaces the data | Only if app surfaces the data |
| New form/interaction on web | No | Always | If same feature exists in app |
| New screen in mobile app | Data setup only | No | Always |
| Error message/validation | Always (API) | Only if shown in UI | Only if shown in app |
| Schema/contract | Always | No | No |
| Visual design | No | @manual | @manual |
| Deep link | No | No | Always |
| E2E journey (booking flow) | Always | Always | Always |

---

## Cross-Layer Data Flow

When the same feature needs API + UI + App tests, follow this data dependency order:

```
1. API test creates the entity (booking, promo, product)
   → stores ID in CacheMechanism for subsequent layers

2. UI test uses the created entity
   → reads ID from data config or API data setup step
   → validates the entity is displayed correctly on web

3. App test uses the created entity
   → reads ID from AppiumCommonDataHandler or deep link parameter
   → validates the entity is displayed correctly in the app
```

The API test is the **single source of truth for data setup** — UI and App tests
should not create data inline; they call the API to set up their pre-conditions.
