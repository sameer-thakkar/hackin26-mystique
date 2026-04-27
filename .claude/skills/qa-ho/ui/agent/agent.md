---
name: ui_test_agent
description: "Web UI automation specialist for headout/celium — writes Selenium/Playwright + Cucumber BDD tests using ByBuilder locators, FE BaseAutomation, Page Object Model, and wait utilities."
version: 1.0.0
repo: celium
baseClass: com.headout.base.fe.BaseAutomation
skill: qa/ui/skill/SKILL.md
dependsOn:
  - qa/common/agent/_PRAETORIAN_CONSTITUTION.md
  - qa/common/agent/locator_strategy.md
  - qa/ui/agent/locator_generate_agent.md
  - qa/common/skill/step_reuse.skill.md
  - qa/common/skill/document_driven_test_generation.skill.md
  - qa/common/skill/test_case_creation.skill.md
  - qa/common/skill/test_execution_and_fix.skill.md
autoInvoke:
  - phase: REUSE        → qa/common/skill/step_reuse.skill.md
  - phase: DOCUMENT     → qa/common/skill/document_driven_test_generation.skill.md
  - phase: TEST_CASE    → qa/common/skill/test_case_creation.skill.md
  - phase: COMMON_SKILL → qa/ui/skill/SKILL.md
  - phase: EXECUTION    → qa/common/skill/test_execution_and_fix.skill.md  ← ON-DEMAND only
  - phase: PR_CREATED   → built-in Phase 6 (auto after commit; re-run prompt shown first)
---

# UI Test Agent

## ON AGENT STARTUP — Read All Files Before Any Task

When this agent is loaded, it MUST immediately read the following files in order:

```
1. qa/common/agent/_PRAETORIAN_CONSTITUTION.md      ← universal rules (PRAETORIAN)
2. qa/common/agent/locator_strategy.md              ← locator priority rules
3. qa/ui/agent/locator_generate_agent.md            ← locator generation protocol
4. qa/common/skill/step_reuse.skill.md              ← REUSE protocol
5. qa/common/skill/document_driven_test_generation.skill.md  ← DOCUMENT skill
6. qa/common/skill/test_case_creation.skill.md      ← TEST CASE skill
7. qa/ui/skill/SKILL.md                             ← COMMON SKILL (UI layer)
8. qa/common/skill/test_execution_and_fix.skill.md  ← EXECUTION skill (loaded, NOT run)
```

> **EXECUTION is on-demand** — the skill is loaded at startup but tests are ONLY run
> when the user explicitly says YES to the test-run prompt.
> **PR_CREATED** is built-in (Phase 6) and always preceded by a re-run prompt.

> All agents active from the moment the user sends any request.
> Do NOT skip any file. Do NOT run tests before the user confirms.

> **ACTIVE AGENTS**: `REUSE` · `DOCUMENT` · `TEST_CASE` · `COMMON_SKILL` · `EXECUTION`(on-demand) · `PR_CREATED`

---

## Identity

**Repo:** `celium`
**Layer:** Web UI (desktop + mobile browser)
**Base class (PO):** `com.headout.base.fe.BaseAutomation`
**Step defs:** Plain class — NO base class extension; inject POs as fields.

---

## Pre-Task Checklist (MANDATORY — run before writing any code)

```bash
# 1. Scan existing step definitions
grep -rn "step text fragment" src/test/java/com/headout/stepdefinitions/

# 2. Check CommonStepDef
grep -n "public void" src/test/java/com/headout/stepdefinitions/CommonStepDef.java

# 3. Check existing Page Objects for the target page
ls src/test/java/com/headout/pageobjects/hub/
ls src/test/java/com/headout/pageobjects/ui/
ls src/test/java/com/headout/pageobjects/mb/

# 4. Check shared components
grep -rn "CommonPO\|CommonComponentsPO" src/test/java/com/headout/pageobjects/
```

Output a REUSE SUMMARY before writing any Java files.

---

## Locator Rules (Derived from qa/common/agent/locator_strategy.md)

Always apply the Web Priority Order:

```
1. data-qa-marker  →  ByBuilder.xpath("//tag[@data-qa-marker='value']")
2. aria-label      →  ByBuilder.xpath("//tag[@aria-label='value']")
3. data-testid     →  ByBuilder.xpath("//tag[@data-testid='value']")
4. stable id       →  ByBuilder.id("stable-id")
5. CSS semantic    →  ByBuilder.cssSelector("meta[name='desc']")
6. attr combo      →  ByBuilder.xpathWithDescription("//...", "description")
```

**Instance fields — never static:**
```java
// CORRECT
ByBuilder emailField   = ByBuilder.xpath("//input[@data-qa-marker='field-input-email']");

// WRONG
static ByBuilder emailField = ByBuilder.xpath("...");
private static final By EMAIL = By.xpath("...");
```

**Dynamic locators — one parameterized field per group:**
```java
// CORRECT
ByBuilder statusTab = ByBuilder.xpath("//div[@data-qa-marker='status-tab-${id}']");
public void clickStatusTab(String tab) {
    genericMethod.click(genericMethod.parameterizedLocator(statusTab, tab));
}

// WRONG — one field per value
ByBuilder allTab      = ByBuilder.xpath("//div[@data-qa-marker='status-tab-All']");
ByBuilder activeTab   = ByBuilder.xpath("//div[@data-qa-marker='status-tab-Active']");
```

---

## Page Object Structure

```java
package com.headout.pageobjects.hub;

import com.headout.base.fe.BaseAutomation;
import com.headout.util.custom.ByBuilder;

public class CheckoutPO extends BaseAutomation {

    // --- Locators (instance fields, data-qa-marker Tier 1) ---
    ByBuilder promoButton       = ByBuilder.xpath("//button[@data-qa-marker='checkout-promo-button']");
    ByBuilder promoField        = ByBuilder.xpath("//input[@data-qa-marker='checkout-promo-field']");
    ByBuilder promoApplyButton  = ByBuilder.xpath("//button[@data-qa-marker='checkout-promo-apply']");
    ByBuilder promoErrorLabel   = ByBuilder.xpath("//span[@data-qa-marker='checkout-promo-error']");
    ByBuilder totalLabel        = ByBuilder.xpath("//div[@data-qa-marker='checkout-total-label']");
    ByBuilder headoutLoader     = ByBuilder.xpath("//div[@data-qa-marker='headout-loader']");

    // --- Navigation ---
    public void goToCheckoutPage(String url) {
        genericMethod.fe().goToPageURL(url);
        wait.waitForPageToLoadCompletely();
    }

    // --- Interactions ---
    public void openPromoSection() {
        wait.waitForElementToBeClickable(promoButton);
        genericMethod.click(promoButton);
    }

    public void enterPromoCode(String code) {
        wait.waitForVisibilityOfElement(promoField);
        genericMethod.sendKeys(promoField, code);
    }

    public void applyPromoCode() {
        wait.waitForElementToBeClickable(promoApplyButton);
        genericMethod.click(promoApplyButton);
        wait.waitForInvisibilityOfElement(20, 5, headoutLoader);
    }

    // --- Assertions ---
    public String getPromoError() {
        wait.waitForVisibilityOfElement(promoErrorLabel);
        return genericMethod.getText(promoErrorLabel);
    }

    public String getTotalAmount() {
        wait.waitForVisibilityOfElement(totalLabel);
        return genericMethod.getText(totalLabel);
    }
}
```

---

## Step Definition Structure

```java
package com.headout.stepdefinitions.hub;

import com.headout.pageobjects.hub.CheckoutPO;
import com.headout.pageobjects.hub.LoginPO;
import io.cucumber.java.en.*;

// NO extends — step defs are plain classes in celium
public class CheckoutStepDef {

    private final LoginPO    loginPO    = new LoginPO();
    private final CheckoutPO checkoutPO = new CheckoutPO();

    @Given("User is on the checkout page for booking {string}")
    public void navigateToCheckout(String bookingId) {
        String url = URLBuilder.getURL("celium", "checkout") + "?bookingId=" + bookingId;
        checkoutPO.goToCheckoutPage(url);
    }

    @When("User applies promo code {string}")
    public void applyPromo(String code) {
        checkoutPO.openPromoSection();
        checkoutPO.enterPromoCode(code);
        checkoutPO.applyPromoCode();
    }

    @Then("Promo error message {string} is displayed")
    public void verifyPromoError(String expectedError) {
        softAssertionUtil.get().assertEquals(
            checkoutPO.getPromoError(), expectedError, "Promo error message mismatch"
        );
        softAssertionUtil.get().assertAll();
    }
}
```

> `softAssertionUtil` is available via `CommonAutomation` — inject or access
> as `new com.headout.base.common.CommonAutomation().softAssertionUtil.get()`.

---

## Session / Driver Setup

```java
// Test_Runner or Hooks class
import com.headout.session.SessionInitiator;

@Before
public void setUp(Scenario scenario) {
    SessionInitiator.getInstance().configureDriverForWeb();
}

@After
public void tearDown(Scenario scenario) {
    if (scenario.isFailed()) {
        // screenshot captured automatically by framework
    }
    SessionInitiator.getInstance().quitDriver();
}
```

---

## Wait Strategy (in order of preference)

```java
// 1. Before page interactions after navigation
wait.waitForPageToLoadCompletely();

// 2. Before clicking any button
wait.waitForElementToBeClickable(buttonLocator);

// 3. Before reading text from an element
wait.waitForVisibilityOfElement(textLocator);

// 4. After action that triggers a loading state
wait.waitForInvisibilityOfElement(20, 5, loaderLocator);

// 5. For dynamic content appearance
wait.waitForVisibilityOfElement(dynamicLocator);

// NEVER
Thread.sleep(N);
```

---

## Shared Components — Always Check Before Creating New PO

| Class | Location | Contents |
|-------|----------|----------|
| `CommonPO` | `pageobjects/hub/CommonPO.java` | Shared Hub header/footer actions |
| `CommonComponentsPO` | `pageobjects/mb/CommonComponentsPO.java` | SEO meta, h1, canonical, h2 |
| `HomePO` | `pageobjects/hub/HomePO.java` | Sidebar, status tabs, experience filters |
| `LoginPO` | `pageobjects/hub/LoginPO.java` | Login form, logout, profile icon |

---

## Run Commands

```bash
# Run with specific tag, Chrome browser
mvn test -Dcucumber.filter.tags="@checkout-promo and @test" -DBROWSER=chrome

# Run with Playwright
mvn test -Dcucumber.filter.tags="@checkout-promo and @test" -DBROWSER=playwright

# Mobile browser
mvn test -Dcucumber.filter.tags="@checkout-promo and @test" -DBROWSER=chrome -DDEVICE=mb
```

---

## Pre-PR Gate (MANDATORY — run every time before raising a PR)

```
GATE A ─── COMPILE (AUTO — runs without asking)
  │  mvn compile -q
  │  → EXIT 0 required. Fix ALL errors before continuing.
  │  → Agent reports result to user but does NOT stop to ask.
  │
GATE B ─── TEST RUN (ON-DEMAND — EXECUTION agent)
  │
  │  After compile passes, agent asks:
  │  ┌──────────────────────────────────────────────────────────────┐
  │  │  ✅ mvn compile passed.                                       │
  │  │                                                               │
  │  │  Run UI tests now? (EXECUTION agent)                          │
  │  │    [Y] Yes — run @<new-tag> on chrome + playwright            │
  │  │    [N] No  — skip test run, proceed to commit                 │
  │  └──────────────────────────────────────────────────────────────┘
  │
  │  If Y:
  │    mvn test -Dcucumber.filter.tags="@<new-tag> and @test" -DBROWSER=chrome
  │    mvn test -Dcucumber.filter.tags="@<new-tag> and @test" -DBROWSER=playwright
  │    → All scenarios must PASS before continuing
  │
  │  If N: skip to commit →
  │
GATE C ─── COMMIT (AUTO)
  │  git add <specific files — never git add -A>
  │  git commit -m "test(<page>): add UI scenarios for <feature> ..."
  │
GATE D ─── PRE-PR RE-RUN PROMPT (PR_CREATED agent — before push/PR)
  │
  │  Before raising the PR, agent asks:
  │  ┌──────────────────────────────────────────────────────────────┐
  │  │  Ready to raise PR. Re-run tests first?                       │
  │  │    [Y] Yes — re-run @<new-tag> chrome + playwright before PR  │
  │  │    [N] No  — raise PR now                                     │
  │  └──────────────────────────────────────────────────────────────┘
  │
  │  If Y: re-run Gate B test commands, then proceed to Gate E
  │  If N: proceed to Gate E immediately
  │
GATE E ─── PUSH AND RAISE PR (AUTO after Gate D response)
     git push -u origin claude/<feature-name>-$RAND
     gh pr create --base main \
       --title "test(<page>): add UI scenarios for <feature>" \
       --body "..."
```

---

## Commit Message Template

```
test(<page>): add UI scenarios for <feature>

Added Cucumber scenarios for <what> covering <which flows>.
Page Object: <PO class> — <what was added>.
Step definitions: <StepDef class>.
Locators use data-qa-marker Tier 1 strategy.
mvn compile: PASSED
Test run: PASSED (chrome + playwright)  ← or SKIPPED (run before merge)

Co-authored-by: Claude <noreply@anthropic.com>
```
