---
name: app_test_agent
description: "Mobile app automation specialist for headout/appium — writes Appium 9 + Cucumber BDD tests using dual-platform ByBuilder locators, app.BaseAutomation (PO), be.BaseAutomation (StepDef), and AppiumCommonDataHandler."
version: 1.0.0
repo: appium
baseClassPO: com.headout.base.app.BaseAutomation
baseClassStepDef: com.headout.base.be.BaseAutomation
skill: qa/app/skill/SKILL.md
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
  - phase: COMMON_SKILL → qa/app/skill/SKILL.md
  - phase: EXECUTION    → qa/common/skill/test_execution_and_fix.skill.md  ← ON-DEMAND only
  - phase: PR_CREATED   → built-in Phase 6 (auto after commit; re-run prompt shown first)
---

# App Test Agent

## ON AGENT STARTUP — Read All Files Before Any Task

When this agent is loaded, it MUST immediately read the following files in order:

```
1. qa/common/agent/_PRAETORIAN_CONSTITUTION.md      ← universal rules (PRAETORIAN)
2. qa/common/agent/locator_strategy.md              ← locator priority rules
3. qa/ui/agent/locator_generate_agent.md            ← locator generation (dual-platform)
4. qa/common/skill/step_reuse.skill.md              ← REUSE protocol
5. qa/common/skill/document_driven_test_generation.skill.md  ← DOCUMENT skill
6. qa/common/skill/test_case_creation.skill.md      ← TEST CASE skill
7. qa/app/skill/SKILL.md                            ← COMMON SKILL (Mobile layer)
8. qa/common/skill/test_execution_and_fix.skill.md  ← EXECUTION skill (loaded, NOT run)
```

> **EXECUTION is on-demand** — tests are ONLY run when the user says YES to the prompt.
> **PR_CREATED** is built-in (Phase 6) and always preceded by a re-run prompt.

> **ACTIVE AGENTS**: `REUSE` · `DOCUMENT` · `TEST_CASE` · `COMMON_SKILL` · `EXECUTION`(on-demand) · `PR_CREATED`

---

## Identity

**Repo:** `appium`
**Layer:** Native Mobile (Android + iOS)
**Page Objects extend:** `com.headout.base.app.BaseAutomation`
**Step Definitions extend:** `com.headout.base.be.BaseAutomation`

---

## Pre-Task Checklist (MANDATORY)

```bash
# 1. Check CommonStepDef for reusable steps
grep -n "public void" src/test/java/com/headout/stepdefinitions/CommonStepDef.java

# 2. Scan all step definitions
grep -rn "step text fragment" src/test/java/com/headout/stepdefinitions/

# 3. Check shared Page Objects
ls src/test/java/com/headout/pages/
grep -rn "CalenderPO\|DeepLinkingPO\|VariantSelectionPO\|CommonPO" \
    src/test/java/com/headout/stepdefinitions/
```

---

## Locator Rules — Dual Platform ALWAYS

```java
// CORRECT — single locator, both platforms
private final ByBuilder buyButton = ByBuilder.xpath(
    "//*[@resource-id='qaid-product-buy-button' or @name='qaid-product-buy-button']"
);

// CORRECT — input with @clickable guard
private final ByBuilder searchField = ByBuilder.xpath(
    "//*[(@resource-id='qaid-search-input' and @clickable='true') or @name='qaid-search-input']"
);

// CORRECT — dynamic with ${id} and contains()
private final ByBuilder dateLabel = ByBuilder.xpath(
    "//*[contains(@resource-id,'qaid-calendar-date-${id}') or contains(@name,'qaid-calendar-date-${id}')]"
);

// WRONG — Android only
private final ByBuilder buyButton = ByBuilder.xpath("//*[@resource-id='qaid-product-buy-button']");

// WRONG — package-qualified resource-id
private final ByBuilder buyButton = ByBuilder.xpath(
    "//*[@resource-id='com.tourlandish.chronos:id/qaid-product-buy-button']"
);
```

---

## Page Object Structure

```java
package com.headout.pages;

import com.headout.base.app.BaseAutomation;
import com.headout.util.custom.ByBuilder;

public class CheckoutPO extends BaseAutomation {

    // All locators: private final ByBuilder — dual-platform
    private final ByBuilder productNameLabel = ByBuilder.xpath(
        "//*[@resource-id='qaid-checkout-product-name' or @name='qaid-checkout-product-name']"
    );
    private final ByBuilder promoButton = ByBuilder.xpath(
        "//*[@resource-id='qaid-checkout-promo-button' or @name='qaid-checkout-promo-button']"
    );
    private final ByBuilder promoField = ByBuilder.xpath(
        "//*[(@resource-id='qaid-checkout-promo-field' and @clickable='true') or @name='qaid-checkout-promo-field']"
    );
    private final ByBuilder promoApplyButton = ByBuilder.xpath(
        "//*[@resource-id='qaid-checkout-promo-apply' or @name='qaid-checkout-promo-apply']"
    );
    private final ByBuilder promoErrorLabel = ByBuilder.xpath(
        "//*[@resource-id='qaid-checkout-promo-error' or @name='qaid-checkout-promo-error']"
    );
    private final ByBuilder totalLabel = ByBuilder.xpath(
        "//*[@resource-id='qaid-checkout-total-price' or @name='qaid-checkout-total-price']"
    );
    private final ByBuilder placeOrderButton = ByBuilder.xpath(
        "//*[@resource-id='qaid-checkout-place-order' or @name='qaid-checkout-place-order']"
    );

    // Navigation
    public void openCheckoutViaDeepLink(String bookingId) {
        androidUtility.openDeepLink(
            PropertyUtils.get(ConfigMap.DEEPLINK_APP_SEQUENCE) + "://checkout?bookingId=" + bookingId
        );
        wait.app().isDisplayed(productNameLabel, 35);
    }

    // Interactions
    public void openPromoSection() {
        wait.app().isDisplayed(promoButton, 20);
        genericMethod.app().click(promoButton);
    }

    public void enterAndApplyPromoCode(String code) {
        wait.app().isDisplayed(promoField, 20);
        genericMethod.app().sendKeys(promoField, code);
        androidUtility.hideKeyboard();
        genericMethod.app().click(promoApplyButton);
    }

    // Assertions
    public String getPromoError() {
        wait.app().isDisplayed(promoErrorLabel, 15);
        return genericMethod.app().getText(promoErrorLabel);
    }

    public String getTotalPrice() {
        wait.app().isDisplayed(totalLabel, 10);
        return genericMethod.app().getText(totalLabel);
    }

    public String getProductName() {
        wait.app().isDisplayed(productNameLabel, 20);
        return genericMethod.app().getText(productNameLabel);
    }

    public boolean isPlaceOrderDisplayed() {
        return wait.app().isDisplayed(placeOrderButton, 20);
    }
}
```

---

## Step Definition Structure

```java
package com.headout.stepdefinitions;

import com.headout.base.be.BaseAutomation;   // ← step defs extend BE base
import com.headout.pages.CheckoutPO;
import com.headout.data.AppiumCommonDataHandler;
import io.cucumber.java.en.*;

public class CheckoutStepDef extends BaseAutomation {

    private final CheckoutPO checkoutPO = new CheckoutPO();

    @Given("User navigates to checkout for booking {string}")
    public void navigateToCheckout(String bookingId) {
        checkoutPO.openCheckoutViaDeepLink(bookingId);
    }

    @When("User applies promo code {string} on app")
    public void applyPromo(String code) {
        checkoutPO.openPromoSection();
        checkoutPO.enterAndApplyPromoCode(code);
    }

    @Then("App shows promo error {string}")
    public void verifyPromoError(String expectedError) {
        softAssertionUtil.get().assertEquals(
            checkoutPO.getPromoError(), expectedError, "Promo error mismatch"
        );
        softAssertionUtil.get().assertAll();   // MANDATORY
    }

    @Then("App shows updated total {string}")
    public void verifyTotal(String expectedTotal) {
        softAssertionUtil.get().assertEquals(
            checkoutPO.getTotalPrice(), expectedTotal, "Total price mismatch"
        );
        softAssertionUtil.get().assertAll();
    }
}
```

---

## Data Handling

```java
// Intra-test data storage
AppiumCommonDataHandler.getInstance().setData("bookingId", bookingId);
String bookingId = AppiumCommonDataHandler.getInstance().getData("bookingId");

// Cross-scenario cache
CacheMechanism.getInstance().setData("productTitle", title);
String title = (String) CacheMechanism.getInstance().getData("productTitle");

// Credentials
String email    = YamlReader.getAppConfigValue("Users.Customer.Email");
String password = YamlReader.getAppConfigValue("Users.Customer.Password");

// Config
String baseUrl  = PropertyUtils.get(ConfigMap.API_BASE_URL);
String deeplink = PropertyUtils.get(ConfigMap.DEEPLINK_APP_SEQUENCE);
```

---

## Wait Strategy

```java
// Before any interaction — always check visibility first
wait.app().isDisplayed(locator, 35);
genericMethod.app().click(locator);

// Before reading text
wait.app().isDisplayed(locator, 20);
String text = genericMethod.app().getText(locator);

// After keyboard input
androidUtility.hideKeyboard();

// After navigation — wait for landing screen element
wait.app().isDisplayed(screenIdentifierLocator, 35);

// Swipe actions
actionBuilderUtility.app().swipeUp();
actionBuilderUtility.app().swipeLeft();

// Platform back
androidUtility.pressBack();
```

---

## Shared Page Objects (Reuse Before Creating)

| Class | Purpose |
|-------|---------|
| `CalenderPO` | Date picker, month navigation, date selection |
| `DeepLinkingPO` | Deep link navigation utility |
| `VariantSelectionPO` | Product variant / pax selection |
| `CommonPO` | Shared screen elements (headers, loaders) |

---

## Run Commands

```bash
# Android emulator
mvn test -Dcucumber.filter.tags="@checkout-promo and @test" -DDEVICE_TYPE=android

# iOS simulator
mvn test -Dcucumber.filter.tags="@checkout-promo and @test" -DDEVICE_TYPE=ios

# Start emulator before running
./android-script/start-emulator.sh emulator-5554

# Reset UiAutomator between runs (if stale)
adb uninstall io.appium.uiautomator2.server
adb uninstall io.appium.uiautomator2.server.test
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
  │  │  Run mobile tests now? (EXECUTION agent)                      │
  │  │    [Y] Yes — run @<new-tag> on android + ios, then continue   │
  │  │    [N] No  — skip test run, proceed to commit                 │
  │  └──────────────────────────────────────────────────────────────┘
  │
  │  If Y:
  │    mvn test -Dcucumber.filter.tags="@<new-tag> and @test" -DDEVICE_TYPE=android
  │    mvn test -Dcucumber.filter.tags="@<new-tag> and @test" -DDEVICE_TYPE=ios
  │    → All scenarios must PASS on both platforms before continuing
  │
  │  If N: skip to commit →
  │
GATE C ─── COMMIT (AUTO)
  │  git add <specific files — never git add -A>
  │  git commit -m "test(<screen>): add mobile scenarios for <feature> ..."
  │
GATE D ─── PRE-PR RE-RUN PROMPT (PR_CREATED agent — before push/PR)
  │
  │  Before raising the PR, agent asks:
  │  ┌──────────────────────────────────────────────────────────────┐
  │  │  Ready to raise PR. Re-run tests first?                       │
  │  │    [Y] Yes — re-run @<new-tag> android + ios before PR        │
  │  │    [N] No  — raise PR now                                     │
  │  └──────────────────────────────────────────────────────────────┘
  │
  │  If Y: re-run Gate B test commands, then proceed to Gate E
  │  If N: proceed to Gate E immediately
  │
GATE E ─── PUSH AND RAISE PR (AUTO after Gate D response)
     git push -u origin claude/<feature-name>-$RAND
     gh pr create --base main \
       --title "test(<screen>): add mobile scenarios for <feature>" \
       --body "..."
```

---

## Commit Message Template

```
test(<screen>): add mobile scenarios for <feature>

Added Cucumber scenarios for <what> targeting Android and iOS.
Page Objects use private final ByBuilder with dual-platform XPath.
Step definitions extend base.be.BaseAutomation; data via AppiumCommonDataHandler.
Pre-conditions via @Before hooks in <DataSetup>.
mvn compile: PASSED
Test run: PASSED (android + ios)  ← or SKIPPED (run before merge)

Co-authored-by: Claude <noreply@anthropic.com>
```
