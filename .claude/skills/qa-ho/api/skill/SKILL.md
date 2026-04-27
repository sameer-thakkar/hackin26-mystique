---
name: api_automation
description: "RestAssured + Cucumber (Java) skill for headout/crest — ThreadLocal request/response, BaseAutomation, URLBuilders, JSON schema validation, cURL-to-automation workflow, and softAssertionUtil."
version: 1.0.0
testingTypes: [API, Integration]
frameworks: [RestAssured, Cucumber, TestNG]
languages: [Java]
agents: [claude-code, cursor, copilot, windsurf]
repo: crest
baseClass: com.headout.base.be.BaseAutomation
---

# API Automation Skill — RestAssured + Cucumber (Java)

## Overview

API tests in **crest** validate Headout backend services using RestAssured via the
unified-qa-framework's `BaseAutomation` abstraction.
Pattern: **Feature → StepDef → `<Service>Utility` → `request.get()` / `response.get()`**

---

## Project Structure

```
crest/
├── src/test/java/com/headout/
│   ├── api/                              # All HTTP logic lives here
│   │   ├── CommonApiUtility.java
│   │   └── <domain>/
│   │       ├── InventoryUtility.java
│   │       ├── TourUtility.java
│   │       └── ...
│   ├── base/
│   │   ├── Test_Runner.java
│   │   └── Failed_Test_Runner.java
│   ├── common/
│   │   ├── CrestDataHandler.java
│   │   ├── URLBuilders.java
│   │   ├── CacheMechanism.java
│   │   └── TestNGLogUtility.java
│   ├── datasetup/
│   │   ├── DataSetupForODE.java
│   │   ├── BookingDataSetup.java
│   │   ├── InventoryDataSetup.java
│   │   └── GetSecretToken.java
│   ├── stepdefinitions/
│   │   └── <domain>/
│   │       └── <Feature>StepDef.java
│   └── features/
│       └── <domain>/<service>/
│           └── *.feature
└── src/test/resources/
    ├── ResponseSchema/                   # ← ALL JSON schema files live here
    │   ├── InventoryByVariantId.json
    │   ├── Booking.json
    │   ├── arceus-collection-pages.json
    │   └── <ServiceName>.json
    ├── json/                             # request body templates
    ├── testdata/                         # static test data files
    └── logback.xml
```

---

## Schema Files — `src/test/resources/ResponseSchema/`

### Naming Convention

```
<ServiceName>.json               — single entity response
<ServiceName>-v2.json            — versioned schema
<service>-<endpoint-name>.json   — multiple schemas per service
```

Real filenames in crest:
```
InventoryByVariantId.json        InventorySchema.json
Booking.json                     Booking-v3-getPublicItnerary.json
account-Details-v2.json          account-details-v3-token.json
arceus-collection-pages.json     arceus-domains-api.json
arceus-footers-api.json          arceus-subdomains-api.json
aries-calculate-refundable-amount.json
aries-getInventoryWithDateRange.json
TourDetailsByTGIDs.json          TourDetailsByTIDs.json
TourDetailsv6.json               GetSeatmapExtract.json
```

### Schema File Format (JSON Schema Draft-04)

Every schema uses `$schema: draft-04`, marks required fields, and sets
`"additionalProperties": true` on every object so new backend fields don't fail CI.

```json
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "type": "object",
  "properties": {
    "items": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id":            { "type": "string" },
          "startDateTime": { "type": "string" },
          "endDateTime":   { "type": "string" },
          "availability":  { "type": "string" },
          "remaining":     { "type": "integer" },
          "pricing": {
            "type": "object",
            "properties": {
              "persons": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "type":          { "type": "string" },
                    "name":          { "type": "string" },
                    "price":         { "type": "number" },
                    "originalPrice": { "type": "number" },
                    "netPrice":      { "type": "number" },
                    "ageFrom":       { "type": ["integer", "null"] },
                    "ageTo":         { "type": ["null", "integer"] }
                  },
                  "required": ["type", "name", "price", "originalPrice", "netPrice"],
                  "additionalProperties": true
                }
              },
              "groups": { "type": "array", "additionalItems": true }
            },
            "required": ["persons", "groups"],
            "additionalProperties": true
          }
        },
        "required": ["id", "startDateTime", "endDateTime", "availability", "remaining", "pricing"],
        "additionalProperties": true
      }
    },
    "nextUrl":    { "oneOf": [{"type": "null"}, {"type": "string"}] },
    "prevUrl":    { "oneOf": [{"type": "null"}, {"type": "string"}] },
    "total":      { "type": "integer" },
    "nextOffset": { "type": ["null", "integer"] }
  },
  "required": ["items", "nextUrl", "prevUrl", "total", "nextOffset"],
  "additionalProperties": true
}
```

### Type Mapping — JSON value → Schema type

| JSON value example | Schema type |
|--------------------|-------------|
| `"some string"` | `{ "type": "string" }` |
| `123` | `{ "type": "integer" }` |
| `1.5` | `{ "type": "number" }` |
| `true` | `{ "type": "boolean" }` |
| `null` or sometimes a string | `{ "type": ["null", "string"] }` |
| `null` or sometimes a number | `{ "oneOf": [{"type": "null"}, {"type": "number"}] }` |
| `[...]` | `{ "type": "array", "items": { ... } }` |
| `{...}` | `{ "type": "object", "properties": { ... } }` |

### How to Generate a Schema from a Real API Response

**Step 1** — Get the real JSON response (from curl, Postman, or a `@manual` run).

**Step 2** — Identify: is it a list (`items` array) or a single entity (`data` object)?

**Step 3** — Map every field to a schema type using the table above. Mark nullable
fields as `["null", "<type>"]` or `oneOf`. Mark always-present fields in `required`.

**Step 4** — Set `"additionalProperties": true` on every `object` node.

**Step 5** — Save to `src/test/resources/ResponseSchema/<ServiceName>.json`.

**Step 6** — Add a schema validation scenario to the `.feature` file:

```gherkin
@headout @<domain> @test @test-regression @ode-regression
Scenario Outline: Validate response schema for <endpoint> with "<param>"
  Given User set "<endpoint-key>" and "<repo>" Api endpoint
  And User set request headers
  And User set query parameters "<paramKey>" and "<paramValue>" for api
  And User sends the get request
  Then Verify Api Response is correct with Schema "<ServiceName>.json"
  Examples:
    | paramKey | paramValue |
    | locale   | en         |
    | locale   | es         |
```

### Schema Validation in Utility Code

```java
// In <Service>Utility.java — after status code assertion
public void verifyResponseMatchesSchema(String schemaFileName) {
    Assert.assertEquals(
        response.get().getStatusCode(), HttpStatus.SC_OK,
        "Status code must be 200 before schema validation. Endpoint: "
            + request.get().build().getEndpoint()
    );
    // Reads from src/test/resources/ResponseSchema/<schemaFileName>
    response.get().validateSchema(schemaFileName);
}
```

---

## Framework Internals — What `BaseAutomation` (BE) Provides

Extending `com.headout.base.be.BaseAutomation` gives every class access to:

| Field | Type | Description |
|-------|------|-------------|
| `request` | `ThreadLocal<RequestSpecification.RequestBuilder>` | Per-thread request builder |
| `response` | `ThreadLocal<GenericAPIResponse>` | Per-thread response holder |
| `requestMethod` | `RestWrapper` (RestAssuredImpl) | Executes HTTP calls |
| `softAssertionUtil` | `ThreadLocal<SoftAssertionUtil>` | Soft assertions per thread |
| `hardAssertionUtil` | `ThreadLocal<HardAssertUtil>` | Hard assertions per thread |

---

## Core Patterns

### 1. Building a Request with `request.get()`

`request.get()` returns `RequestSpecification.RequestBuilder`. Chain builder methods then call `.build()`.

```java
// Set endpoint — clears previous query params/headers/body
request.get().endpoint("https://api.test-headout.com/v2/inventory");

// Add query parameters
request.get().queryParams("variantId", "12345");
request.get().queryParams("date", "2024-06-01");
// OR pass a map (merges with existing params)
request.get().queryParams(Map.of("variantId", "12345", "date", "2024-06-01"));

// Add headers
request.get().header("x-api-key", tokenValue);
request.get().headers(Map.of("Accept", "application/json", "x-request-id", uuid));

// Set body
request.get().body("{\"tourGroupId\": \"123\"}");    // raw JSON string
request.get().body(Map.of("tourGroupId", "123"));     // map auto-serialized
request.get().body(myPojoObject);                     // POJO auto-serialized

// Basic auth
request.get().basic("username", "password");

// Build to get RequestSpecification
RequestSpecification spec = request.get().build();
```

### 2. Executing HTTP Calls with `requestMethod`

```java
// GET
response.set(requestMethod.get(request.get().build()));

// POST
response.set(requestMethod.post(request.get().build()));

// PUT
response.set(requestMethod.put(request.get().build()));

// DELETE
response.set(requestMethod.delete(request.get().build()));

// PATCH
response.set(requestMethod.patch(request.get().build()));
```

### 3. Asserting Responses with `response.get()`

#### 3.1 — Status Code (Hard Assert — Always First)

```java
Assert.assertEquals(
    response.get().getStatusCode(),
    HttpStatus.SC_OK,
    "Verifying Response status code " + response.get().getResponseMessage()
        + " Base URI " + request.get().build().getEndpoint()
        + (request.get().build().getBasePath() != null ? request.get().build().getBasePath() : "")
        + " Query Parameter " + request.get().build().getQueryParameterList()
        + (response.get().getStatusCode() == 500
            ? " Error Message " + response.get().jsonPath().getString("error.message") : "")
);
```

#### 3.2 — Full Response Key Validation (MANDATORY — every key in the response)

**RULE: Every key present in the sample response MUST have a corresponding soft assertion.**
Do NOT assert only top-level keys. Drill into nested objects and array items.

Assertion method per field type:

| Field type | Assertion to use | Example |
|-----------|-----------------|---------|
| String (always present) | `assertNotNull` + `assertFalse(isEmpty)` | `data.bookingId` |
| String (known value) | `assertEquals` | `data.status` == "CONFIRMED" |
| Integer / Long | `assertNotNull` + value range check | `data.totalAmount` > 0 |
| Number / Decimal | `assertNotNull` + `assertTrue(val > 0)` | `data.price` |
| Boolean | `assertNotNull` + `assertEquals` if known | `data.available` == true |
| Nullable field | `assertTrue(val == null OR !val.isEmpty())` | `data.nextUrl` |
| Array (non-empty) | `assertFalse(list.isEmpty())` + assert first item fields | `items` |
| Array (can be empty) | `assertNotNull(list)` | `slots` |
| Nested object | assert each child field individually | `data.pricing.persons[0].type` |

```java
// JSONPath extraction
String value    = response.get().jsonPath().getString("data.field");
int count       = response.get().jsonPath().getInt("data.count");
List<?> items   = response.get().jsonPath().getList("data.items");
```

#### 3.3 — Full Response Validation Pattern (MANDATORY Template)

Every `verify*()` method in a Utility class MUST follow this structure:

```java
public void verifyBookingCreated() {

    // 1. Hard assert status code first
    Assert.assertEquals(
        response.get().getStatusCode(), HttpStatus.SC_OK,
        "Booking creation failed. Endpoint: " + request.get().build().getEndpoint()
            + " Query Params: " + request.get().build().getQueryParameterList()
    );

    // 2. Log full response for debug
    TestNGLogUtility.info("Response Body: " + response.get().asString());

    // 3. Soft assert EVERY key from the sample response — no key skipped
    // --- top-level wrapper ---
    softAssertionUtil.get().assertNotNull(
        response.get().jsonPath().getString("data"),
        "data wrapper must not be null");

    // --- string fields ---
    String bookingId = response.get().jsonPath().getString("data.bookingId");
    softAssertionUtil.get().assertNotNull(bookingId,
        "data.bookingId must not be null");
    softAssertionUtil.get().assertFalse(bookingId != null && bookingId.isEmpty(),
        "data.bookingId must not be empty");

    softAssertionUtil.get().assertEquals(
        response.get().jsonPath().getString("data.status"), "CONFIRMED",
        "data.status must be CONFIRMED");

    softAssertionUtil.get().assertNotNull(
        response.get().jsonPath().getString("data.variantId"),
        "data.variantId must not be null");

    softAssertionUtil.get().assertNotNull(
        response.get().jsonPath().getString("data.currency"),
        "data.currency must not be null");

    softAssertionUtil.get().assertNotNull(
        response.get().jsonPath().getString("data.createdAt"),
        "data.createdAt must not be null");

    // --- numeric fields ---
    Double totalAmount = response.get().jsonPath().getDouble("data.totalAmount");
    softAssertionUtil.get().assertNotNull(totalAmount,
        "data.totalAmount must not be null");
    softAssertionUtil.get().assertTrue(totalAmount > 0,
        "data.totalAmount must be > 0, actual: " + totalAmount);

    // --- nullable fields ---
    // (assert the field exists in response even if value is null)
    softAssertionUtil.get().assertTrue(
        response.get().asString().contains("\"discountAmount\""),
        "data.discountAmount key must be present in response");

    // --- array fields ---
    List<?> personDetails = response.get().jsonPath().getList("data.personDetails");
    softAssertionUtil.get().assertNotNull(personDetails,
        "data.personDetails must not be null");
    softAssertionUtil.get().assertFalse(personDetails.isEmpty(),
        "data.personDetails must not be empty");

    // assert first item in array
    softAssertionUtil.get().assertNotNull(
        response.get().jsonPath().getString("data.personDetails[0].type"),
        "data.personDetails[0].type must not be null");
    softAssertionUtil.get().assertNotNull(
        response.get().jsonPath().getInt("data.personDetails[0].count"),
        "data.personDetails[0].count must not be null");

    // 4. Store any IDs needed by subsequent steps
    CrestDataHandler.setFieldValues("bookingId", bookingId);

    // 5. NEVER call assertAll() here — call it in the @Then StepDef
}
```

#### 3.4 — Anti-Hallucination Check for Response Keys

Before submitting any `verify*()` method, the agent MUST:

```
1. List every key in the sample response (including nested keys).
2. Confirm each key has a soft assertion in the verify method.
3. If a key is missing from assertions → add it before proceeding.

Missing key checklist (derived from sample response):
  [ ] top-level wrapper (data / items / result)
  [ ] every string field → assertNotNull + assertFalse(isEmpty) or assertEquals
  [ ] every integer / number field → assertNotNull + assertTrue(val > 0 or range)
  [ ] every boolean field → assertNotNull + assertEquals if known value
  [ ] every nullable field → assertTrue(key present in response body)
  [ ] every array field → assertNotNull + check isEmpty + assert [0] item fields
  [ ] every nested object → assert each child field individually
  [ ] pagination fields (nextUrl, prevUrl, total, nextOffset) if present
```

### 4. Utility Class (All HTTP + Assertion Logic)

Create `<Service>Utility.java` in `src/test/java/com/headout/api/<domain>/`.
This is the ONLY place where `request.get()`, `requestMethod`, and `response.get()` are used.

```java
// src/test/java/com/headout/api/calipso/InventoryUtility.java
package com.headout.api.calipso;

import com.headout.base.be.BaseAutomation;
import com.headout.common.CrestDataHandler;
import com.headout.common.TestNGLogUtility;
import org.apache.http.HttpStatus;
import org.testng.Assert;

public class InventoryUtility extends BaseAutomation {

    public void userGetInventoryDetails(String variantId) {
        TestNGLogUtility.info("Getting inventory details for variant: " + variantId);
        request.get().endpoint(URLBuilders.getInventoryUrl());
        request.get().queryParams("variantId", variantId);
        request.get().queryParams(
            "currency", CrestDataHandler.getValueFromDate("currentCurrency")
        );
        response.set(requestMethod.get(request.get().build()));
    }

    public void verifyInventoryDetails() {
        Assert.assertEquals(
            response.get().getStatusCode(), HttpStatus.SC_OK,
            "Verifying Response status code " + response.get().getResponseMessage()
                + " Base URI " + request.get().build().getEndpoint()
                + " Query Parameter " + request.get().build().getQueryParameterList()
        );
        softAssertionUtil.get().assertEquals(
            response.get().jsonPath().getString("data.variantId"),
            CrestDataHandler.getProjectData().getVariantId(),
            "Variant ID mismatch"
        );
    }
}
```

### 5. Step Definition (Thin Orchestration Only)

```java
// src/test/java/com/headout/stepdefinitions/calipso/InventoryStepDef.java
package com.headout.stepdefinitions.calipso;

import com.headout.api.calipso.InventoryUtility;
import com.headout.base.be.BaseAutomation;
import com.headout.common.CrestDataHandler;
import com.headout.common.TestNGLogUtility;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;

public class InventoryStepDef extends BaseAutomation {

    InventoryUtility inventoryUtility = new InventoryUtility();

    @Given("User get inventory details {string}")
    public void userGetInventoryDetails(String variantId) {
        inventoryUtility.userGetInventoryDetails(variantId);
    }

    @Then("Verify inventory Details gets from inventories api")
    public void verifyInventoryDetails() {
        TestNGLogUtility.info("Validating Response for inventories api");
        inventoryUtility.verifyInventoryDetails();
        softAssertionUtil.get().assertAll();   // ALWAYS call assertAll() in @Then
    }

    @And("Add parameter for seat info api")
    public void addParameterForSeatInfoApi() {
        TestNGLogUtility.info("Add parameter for seat info api");
        request.get().queryParams("tourGroupId",
            CrestDataHandler.getProjectData().getTourGroupID() != null
                ? CrestDataHandler.getProjectData().getTourGroupID()
                : CrestDataHandler.getValueFromDate("tourgroupId"));
        request.get().queryParams("inventory-date",  CrestDataHandler.getValueFromDate("startDate"));
        request.get().queryParams("inventory-start-time", CrestDataHandler.getValueFromDate("starttime"));
        request.get().queryParams("currency",
            CrestDataHandler.getProjectData().getCurrency() != null
                ? CrestDataHandler.getProjectData().getCurrency()
                : CrestDataHandler.getValueFromDate("currentCurrency"));
    }

    @And("User getting data key {string} from cache and store at thread level")
    public void userGettingDataKeyFromCacheAndStoreAtThreadLevel(String key) {
        inventoryUtility.updateThreadDataFromCacheMechanism(key);
    }
}
```

### 6. Data Handler — CrestDataHandler

```java
import com.headout.common.CrestDataHandler;
import com.headout.common.CacheMechanism;

// Write scenario-level data
CrestDataHandler.getProjectData().setVariantId("12345");
CrestDataHandler.getProjectData().setTourGroupID("67890");
CrestDataHandler.getProjectData().setCurrency("USD");
CrestDataHandler.setFieldValues("customKey", "value");

// Read scenario-level data
String variantId   = CrestDataHandler.getProjectData().getVariantId();
String tourGroupId = CrestDataHandler.getProjectData().getTourGroupID();
String custom      = CrestDataHandler.getProjectData().getFieldValues("customKey");

// Date-indexed map (populated by DataSetupForODE)
String startDate   = CrestDataHandler.getValueFromDate("startDate");
String startTime   = CrestDataHandler.getValueFromDate("starttime");
String currency    = CrestDataHandler.getValueFromDate("currentCurrency");

// Cross-scenario (suite-level) cache
CacheMechanism.getInstance().storeData("bookingId", bookingId);
String cached = (String) CacheMechanism.getInstance().getData("bookingId");

// Clear on @Before (done automatically by Test_Runner)
CrestDataHandler.clearProps();
CrestDataHandler.clearDataProps();
```

### 7. Config and Logging

```java
import com.headout.common.constants.PropertyUtils;
import com.headout.common.constants.ConfigMap;
import com.headout.common.TestNGLogUtility;

// Read config (never hardcode)
String env       = PropertyUtils.get(ConfigMap.TEST_ENVIRONMENT);   // test | live | ondemand
String namespace = PropertyUtils.get("NAME_SPACE");
String logLevel  = PropertyUtils.get("LOG_LEVEL");
boolean skipSetup = Boolean.parseBoolean(PropertyUtils.get("SKIP_AUTOMATION"));

// Logging (never use System.out.println)
TestNGLogUtility.info("Step: " + description + " | value: " + value);
TestNGLogUtility.error("Failure: " + reason, exception);
```

---

## Test Runner

```java
@CucumberOptions(
    features   = {"src/test/java/com/headout/features"},
    tags       = "@test",                // overridden at runtime via -Dcucumber.filter.tags
    glue       = {"com.headout.stepdefinitions", "com.headout.base"},
    plugin     = {
        "json:target/cucumber-reports/Cucumber.json",
        "html:target/cucumber-reports/cucumber.html",
        "junit:target/cucumber-reports/cucumber.xml",
        "rerun:rerun/failed_scenarios.txt",
        "com.epam.reportportal.cucumber.ScenarioReporter"
    },
    monochrome = true
)
public class Test_Runner extends AbstractTestNGCucumberTests {
    private static final SessionInitiator session = SessionInitiator.getInstance();
    private final DataSetupForODE dataSetupForODE = new DataSetupForODE();

    @Override
    @DataProvider(parallel = true)
    public Object[][] scenarios() { return super.scenarios(); }

    @BeforeSuite
    public void start() {
        dataSetupForODE.storeToken();
        dataSetupForODE.getBranchTags();
        dataSetupForODE.updateInventory();
        dataSetupForODE.setupEnvDetails();
        dataSetupForODE.storeBookingData();
    }

    @Before(order = 0)
    public void initTest(Scenario scenario) {
        CrestDataHandler.clearProps();       // clear ThreadLocal per scenario
        URLBuilders.setEndPoint();            // set environment URLs
        session.initializeSession(scenario);
    }

    @After(order = 0)
    public void tearDown(Scenario scenario) {
        if (scenario.isFailed()) {
            failedTests.add(scenario.getName());
            CrestDataHandler.commonApiUtility().removeCurrentThreadsFromHold();
        }
        session.closeSession(scenario);
        CrestDataHandler.clearDataProps();
    }

    @AfterSuite
    public void tearDown() {
        runFailedTestRunnerClass();
        session.sentSlackReport(reportPath);
        dataSetupForODE.sentDataToExcelSheet();
        CacheMechanism.getInstance().removeAllData();
    }
}
```

---

## BDD Feature File

```gherkin
# src/test/java/com/headout/features/inventory/calipso/inventory-availability.feature
@test @inventory
Feature: Inventory Availability API

  @smoke
  Scenario: Get available inventory for a valid variant
    Given User get inventory details "12345"
    And Add parameter for seat info api
    Then Verify inventory Details gets from inventories api

  @regression
  Scenario Outline: Validate inventory for multiple variants
    Given User get inventory details "<variantId>"
    Then Verify inventory Details gets from inventories api
    Examples:
      | variantId |
      | 12345     |
      | 67890     |
```

---

## Run Commands

```bash
mvn test -Dcucumber.filter.tags="@test" -DthreadCount=40
mvn test -Dcucumber.filter.tags="@test and @inventory"
mvn test -Dcucumber.filter.tags="@live" -DTEST_ENVIRONMENT=live
mvn test -Dcucumber.filter.tags="@ode-regression" -DNAME_SPACE=my-ode-env
mvn test -Dcucumber.filter.tags="@test" -DSKIP_AUTOMATION=true   # skip data setup
```

---

## cURL to Automation — Workflow

When a developer shares a cURL command + sample response, follow this exact
5-step process to produce complete automation.

### Step 1 — Parse the cURL

Extract these parts from the cURL:

```
METHOD     → GET | POST | PUT | DELETE | PATCH
URL        → Split into: base URL + path + query params
HEADERS    → -H "key: value" lines
BODY       → -d '{ ... }' or --data-raw '{ ... }'
AUTH       → -u user:pass  OR  -H "Authorization: Bearer ..."
```

Example cURL:
```bash
curl -X POST 'https://api.test-headout.com/api/v2/booking/create' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer TOKEN' \
  -d '{
    "variantId": "12345",
    "startDateTime": "2024-06-15T10:00:00",
    "personDetails": [{"type": "ADULT", "count": 2}],
    "currency": "USD"
  }'
```

Extracted:
```
METHOD:  POST
BASE:    https://api.test-headout.com
PATH:    /api/v2/booking/create
HEADERS: Content-Type: application/json, Authorization: Bearer <token>
BODY:    { variantId, startDateTime, personDetails, currency }
```

### Step 2 — Map to Framework Code

**Endpoint registration:** add a string key directly to `endpointMap` in `URLBuilders.java`.
No static constants — use the key string directly everywhere:
```java
// In URLBuilders.java — inside setEndPoint(), one line per endpoint:
endpointMap.put("booking-create-v2",
    PropertyUtils.get(ConfigMap.API_BASE_URL) + "/api/v2/booking/create");

// In Gherkin step, reference the key as a plain string:
// Given User set "booking-create-v2" and "" Api endpoint
```

**Utility class:**
```java
// src/test/java/com/headout/api/<domain>/BookingUtility.java
public class BookingUtility extends BaseAutomation {

    public void createBooking(String variantId) {
        TestNGLogUtility.info("Creating booking for variant: " + variantId);
        Map<String, Object> body = new HashMap<>();
        body.put("variantId", variantId);
        body.put("startDateTime", CrestDataHandler.getValueFromDate("startDate")
            + "T" + CrestDataHandler.getValueFromDate("starttime"));
        body.put("currency", CrestDataHandler.getValueFromDate("currentCurrency"));
        body.put("personDetails", List.of(
            Map.of("type", "ADULT", "count", 2)
        ));

        // Use the string key directly — no static constant
        request.get().endpoint(URLBuilders.getUrl("booking-create-v2"));
        request.get().header("Authorization", "Bearer " + GetSecretToken.getToken());
        request.get().body(body);
        response.set(requestMethod.post(request.get().build()));
    }

    public void verifyBookingCreated() {
        // 1. Hard assert status code
        Assert.assertEquals(
            response.get().getStatusCode(), HttpStatus.SC_OK,
            "Booking creation failed. Endpoint: " + request.get().build().getEndpoint()
                + " Params: " + request.get().build().getQueryParameterList()
        );

        // 2. Log full response
        TestNGLogUtility.info("Response Body: " + response.get().asString());

        // 3. Soft assert EVERY key from sample response — no key skipped
        // data wrapper
        softAssertionUtil.get().assertNotNull(
            response.get().jsonPath().getString("data"), "data must not be null");

        // string fields
        String bookingId = response.get().jsonPath().getString("data.bookingId");
        softAssertionUtil.get().assertNotNull(bookingId, "data.bookingId must not be null");
        softAssertionUtil.get().assertFalse(bookingId != null && bookingId.isEmpty(),
            "data.bookingId must not be empty");

        softAssertionUtil.get().assertEquals(
            response.get().jsonPath().getString("data.status"), "CONFIRMED",
            "data.status must be CONFIRMED");

        softAssertionUtil.get().assertNotNull(
            response.get().jsonPath().getString("data.variantId"),
            "data.variantId must not be null");

        softAssertionUtil.get().assertNotNull(
            response.get().jsonPath().getString("data.currency"),
            "data.currency must not be null");

        softAssertionUtil.get().assertNotNull(
            response.get().jsonPath().getString("data.createdAt"),
            "data.createdAt must not be null");

        // numeric fields
        Double totalAmount = response.get().jsonPath().getDouble("data.totalAmount");
        softAssertionUtil.get().assertNotNull(totalAmount, "data.totalAmount must not be null");
        softAssertionUtil.get().assertTrue(totalAmount > 0,
            "data.totalAmount must be > 0, actual: " + totalAmount);

        // 4. Store IDs for subsequent steps
        CrestDataHandler.setFieldValues("bookingId", bookingId);

        // NOTE: Do NOT call assertAll() here — always call it in the @Then StepDef
    }
}
```

### Step 3 — Generate the Schema File

Take the sample response JSON and produce `ResponseSchema/<ServiceName>.json`.
See the Schema section above for the generation steps.

Sample response:
```json
{
  "data": {
    "bookingId": "BK-001234",
    "status": "CONFIRMED",
    "variantId": "12345",
    "totalAmount": 120.50,
    "currency": "USD",
    "createdAt": "2024-06-15T10:05:00Z"
  }
}
```

Generated `ResponseSchema/BookingCreate.json`:
```json
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "type": "object",
  "properties": {
    "data": {
      "type": "object",
      "properties": {
        "bookingId":   { "type": "string" },
        "status":      { "type": "string" },
        "variantId":   { "type": "string" },
        "totalAmount": { "type": "number" },
        "currency":    { "type": "string" },
        "createdAt":   { "type": "string" }
      },
      "required": ["bookingId", "status", "variantId", "totalAmount", "currency"],
      "additionalProperties": true
    }
  },
  "required": ["data"],
  "additionalProperties": true
}
```

### Step 4 — Generate the Feature File

From the cURL, generate all scenario types (see `qa/common/skill/test_case_creation.skill.md`).

**Mandatory parameter patterns (applied in every feature file):**

| Need | Step pattern |
|------|-------------|
| Query params (vary per row) | `And User set query parameters "<queryParamKey>" and "<queryParamValue>" for api` — one step per param |
| Static query param | `And User set query parameters "currency" and "EUR" for api` |
| Header (vary per row) | `And User set header parameters "<headerKey>" and "<headerValue>" for api` |
| Static header | `And User set header parameters "X-Platform" and "chatbot" for api` |
| Multi-field body | `And User set body "f1/f2/f3" and "<v1>/<v2>/<v3>" for api` |
| Single-field body | `And User set body parameters "variantId" and "<variantId>" for api` |
| Authentication | `And User set authentication for api module "bms"` — **never** hardcode token |
| Persist for downstream step | `And Add Data key "<parameterKey>" and value "<parameterValue>" in Properties File` |
| > 10 params | Create `userSet<Domain>Parameters()` in `<Service>Utility.java`; call from one domain step |

```gherkin
# src/test/java/com/headout/features/booking/<domain>/booking-create.feature
Feature: Booking Creation API

  # POSITIVE — happy path (parameterized query + header + body + auth)
  @headout @booking @test @test-regression @test-sanity @ode-regression
  Scenario Outline: Verify successful booking creation for variant "<variantId>"
    Given User set "booking-create" and "" Api endpoint
    And User set authentication for api module "bms"
    And User set header parameters "X-Platform" and "<platform>" for api
    And User set query parameters "currency" and "<currency>" for api
    And User set body "variantId/paxCount" and "<variantId>/<paxCount>" for api
    And Add Data key "variantId" and value "<variantId>" in Properties File
    When User sends the post request
    Then Verify message "" and status code "200" for api
    And User validate booking creation response and status "CONFIRMED"
    Examples:
      | variantId | paxCount | currency | platform |
      | 12345     | 2        | USD      | web      |
      | 67890     | 1        | EUR      | chatbot  |

  # SCHEMA — contract test
  @headout @booking @test @test-regression @ode-regression
  Scenario: Validate response schema for booking creation
    Given User set "booking-create" and "" Api endpoint
    And User set authentication for api module "bms"
    And User set body parameters "variantId" and "12345" for api
    When User sends the post request
    Then Verify Api Response is correct with Schema "BookingCreate.json"

  # NEGATIVE — invalid inputs (parameterized body via Examples)
  @headout @booking @test @test-regression @ode-regression
  Scenario Outline: Verify error response for booking creation with "<scenario>"
    Given User set "booking-create" and "" Api endpoint
    And User set authentication for api module "bms"
    And User set body parameters "<bodyKey>" and "<bodyValue>" for api
    When User sends the post request
    Then Verify Error Message "<expectedMessage>" and Status "<expectedCode>" code for api
    Examples:
      | scenario             | bodyKey   | bodyValue | expectedMessage              | expectedCode |
      | missing variantId    |           |           | variantId is required        | 400          |
      | invalid variantId    | variantId | abc!@#    | Invalid variant ID           | 400          |
      | non-existent variant | variantId | 99999999  | Variant not found            | 404          |
      | no auth token        | variantId | 12345     | Unauthorised                 | 401          |

  # EDGE — boundary (slash-delimited body for multi-field)
  @headout @booking @test @test-regression
  Scenario Outline: Verify pax count boundary for booking creation
    Given User set "booking-create" and "" Api endpoint
    And User set authentication for api module "bms"
    And User set body "variantId/paxCount" and "12345/<paxCount>" for api
    When User sends the post request
    Then Verify Error Message "<expectedMessage>" and Status "<expectedCode>" code for api
    Examples:
      | paxCount | expectedMessage             | expectedCode |
      | 0        | Minimum 1 pax required      | 400          |
      | 1        |                             | 200          |
      | 10       |                             | 200          |
      | 11       | Maximum 10 pax allowed      | 400          |
```

### Step 5 — Checklist Before Submitting

```
[ ] Endpoint key added to URLBuilders.java
[ ] Utility class created in api/<domain>/
[ ] Schema file created in src/test/resources/ResponseSchema/
[ ] Feature file has: positive + schema + negative + edge scenarios
[ ] All tags applied: @headout @<domain> @test @test-regression @ode-regression
[ ] No hardcoded URLs, tokens, or credentials
[ ] Authentication uses "And User set authentication for api module <name>" — no hardcoded tokens
[ ] Multiple query params use "<queryParamKey>"/"<queryParamValue>" pattern via Examples
[ ] Multiple headers use "<headerKey>"/"<headerValue>" pattern via Examples
[ ] Multi-field body uses slash-delimited "f1/f2/f3" and "<v1>/<v2>/<v3>" pattern
[ ] > 10 params → utility method + Add Data key steps (no 10+ individual steps in feature)
[ ] softAssertionUtil.get().assertAll() called at end of every @Then
[ ] Black Box (2.22) — equivalence-partitioning outline present: valid class rows + invalid class rows, tagged @black-box
[ ] White Box (2.23) — branch-coverage outline present (1 row per code branch) + @manual JaCoCo scenario, tagged @white-box
[ ] Exploratory (2.24) — at least 1 @manual @exploratory charter scenario with CHARTER/TARGET/DURATION/STEP/EXPECTED/POST-CHECK
[ ] All 24 mandatory categories addressed (no silent skips)
```

---

## Agent Rules

1. Extend `com.headout.base.be.BaseAutomation` in ALL step defs and utility classes.
2. All HTTP calls go in `<Service>Utility.java` under `src/test/java/com/headout/api/<domain>/`.
3. Step definitions ONLY call utility methods — NO direct HTTP calls in step defs.
4. Chain `request.get().<methods>` then `.build()` to create a `RequestSpecification`.
5. Execute via `requestMethod.get/post/put/delete/patch(request.get().build())`.
6. Always store responses: `response.set(requestMethod.get(request.get().build()))`.
7. Use `softAssertionUtil.get()` for field assertions; call `.assertAll()` at end of `@Then`.
8. Use `CrestDataHandler` for all intra-scenario data sharing — NEVER static mutable fields.
9. Use `TestNGLogUtility.info()` for logging — NEVER `System.out.println()`.
10. Use `PropertyUtils.get(ConfigMap.*)` for config — NEVER hardcode URLs or tokens.
11. Schema files go ONLY in `src/test/resources/ResponseSchema/` — never inline.
12. When given a cURL, always follow the 5-step cURL-to-automation workflow above.
13. For document-driven test generation (dev PR / Notion / Google Doc), see
    `qa/common/skill/document_driven_test_generation.skill.md`.
14. Multiple query parameters: use `And User set query parameters "<queryParamKey>" and "<queryParamValue>" for api`
    once per param with `<>` placeholders driven by Scenario Outline Examples — NOT hardcoded individual steps.
15. Multiple headers: use `And User set header parameters "<headerKey>" and "<headerValue>" for api`
    with `<>` placeholders from Examples.
16. Multi-field body: use `And User set body "f1/f2/f3" and "<v1>/<v2>/<v3>" for api` (slash-delimited).
17. Authentication: always `And User set authentication for api module "<moduleName>"` — NEVER hardcode tokens.
18. Persist values for downstream steps: `And Add Data key "<parameterKey>" and value "<parameterValue>" in Properties File`.
19. If > 10 params are needed: create `userSet<Domain>Parameters()` utility method; never write 10+ individual param steps.
20. After compile passes, ask user Y/N to run tests; if N → print manual run instructions and auto-create PR; if Y → run tests then auto-create PR.
21. **Black Box (2.22)**: always include an equivalence-partitioning `Scenario Outline` with VALID CLASS rows and INVALID CLASS rows; optionally add a decision-table outline; tag `@black-box @test @test-regression`.
22. **White Box (2.23)**: always include a branch-coverage `Scenario Outline` (one Examples row per conditional branch in the primary utility method) + one `@manual` JaCoCo scenario; tag `@white-box @test @test-regression`.
23. **Exploratory (2.24)**: always include 1+ `@manual @exploratory` charter scenarios with CHARTER / TARGET / DURATION / STEP N / EXPECTED / POST-CHECK format; never automatable — `@pending` is NOT acceptable for this category.
24. All 24 mandatory categories must be covered for every feature; silently skipping any category is a hallucination violation.
