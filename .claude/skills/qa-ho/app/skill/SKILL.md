---
name: app_automation
description: "Appium + Cucumber (Java) skill for headout/appium — dual-platform ByBuilder (qaid-*), wait.app(), genericMethod.app(), AppPO extends app.BaseAutomation, AppStepDef extends be.BaseAutomation."
version: 1.0.0
testingTypes: [Mobile, E2E]
frameworks: [Appium, Selenium, Cucumber, TestNG]
languages: [Java]
agents: [claude-code, cursor, copilot, windsurf]
repo: appium
pageObjectBase: com.headout.base.app.BaseAutomation
stepDefBase: com.headout.base.be.BaseAutomation
---

# Mobile App Automation Skill — Appium + Cucumber (Java)

## Overview

Mobile tests in **appium** validate the Headout native app (Android + iOS).
Pattern: **Feature → StepDef → Page Object (`<Screen>PO`) using wrapper methods**

Two base classes are used:
- **Page Objects** extend `com.headout.base.app.BaseAutomation`
- **Step Definitions** extend `com.headout.base.be.BaseAutomation`

---

## Project Structure

```
appium/
└── src/test/java/com/headout/
    ├── base/
    │   └── Test_Runner.java
    ├── pages/                          # All Page Objects here
    │   ├── HomePO.java
    │   ├── ProductPO.java
    │   ├── CheckoutPO.java
    │   ├── PaymentPO.java
    │   ├── ConfirmationPO.java
    │   ├── CommonPO.java
    │   ├── CalenderPO.java
    │   ├── VariantSelectionPO.java
    │   ├── DeepLinkingPO.java
    │   └── UserFieldPO.java
    ├── datasetup/
    │   ├── BookingDataSetup.java
    │   ├── InventoryDataSetup.java
    │   ├── DataSetupForODE.java
    │   └── GetSecretToken.java
    ├── stepdefinitions/
    │   ├── HeadoutPageStepDef.java
    │   ├── ProductStepDef.java
    │   ├── CheckoutStepDef.java
    │   ├── BookingStepDef.java
    │   ├── PaymentStepDef.java
    │   └── ...
    ├── utility/
    │   ├── CommonApiUtility.java
    │   └── AppPojo.java
    └── features/
        └── <domain>/
            └── *.feature
```

---

## Framework Internals — What `BaseAutomation` (APP) Provides

Extending `com.headout.base.app.BaseAutomation` in Page Objects gives access to:

| Field | Type | Description |
|-------|------|-------------|
| `genericMethod` | `GenericMethodWrapper` | `genericMethod.app()` for mobile interactions |
| `wait` | `WaitUtilityWrapper` | `wait.app()` for mobile waits |
| `actionBuilderUtility` | `ActionBuilderWrapper` | `actionBuilderUtility.app()` for swipe/gestures |
| `jsUtil` | `JSUtilityWrapper` | `jsUtil.app()` for JS on mobile browser |
| `androidUtility` | `AndroidUtility` | ADB, deep links, back button |
| `iosUtility` | `IOSUtility` | XCUITest gestures, iOS-specific utilities |

Step definitions extend `com.headout.base.be.BaseAutomation` and access API utilities
and `AppiumCommonDataHandler` for shared data.

---

## Core Patterns

### 1. Locators — `ByBuilder` with Dual Platform Support

All locators in Page Objects are `private final ByBuilder` fields.
Use the `@resource-id='...' or @name='...'` pattern to support both Android and iOS.

```java
import com.headout.util.custom.ByBuilder;

// Dual-platform locator: Android uses resource-id, iOS uses name/accessibility label
private final ByBuilder productName = ByBuilder.xpath(
    "//*[@resource-id='qaid-checkout-productname-label' or @name='qaid-checkout-productname-label']"
);

private final ByBuilder buyNowButton = ByBuilder.xpath(
    "//*[@resource-id='qaid-product-buy-button' or @name='qaid-product-buy-button']"
);

private final ByBuilder promoCodeField = ByBuilder.xpath(
    "//*[(@resource-id='qaid-checkout-promocode-field' and @clickable='true') or @name='qaid-checkout-promocode-field']"
);
```

### 2. Interaction Methods via `genericMethod.app()`

```java
// Check visibility
boolean shown = genericMethod.app().isDisplayed(productName);

// Tap / click
genericMethod.app().click(buyNowButton);

// Type text
genericMethod.app().sendKeys(promoCodeField, "PROMO10");

// Get text
String name = genericMethod.app().getText(productName);

// Get attribute
String resourceId = genericMethod.app().getAttribute(productName, "resource-id");

// Check element not enabled
boolean notEnabled = genericMethod.app().isElementNotEnabled(disabledButton);
```

### 3. Wait Methods via `wait.app()`

```java
// Wait for element visible with timeout
boolean visible = wait.app().isDisplayed(productName, 35);   // (locator, timeoutSeconds)

// Wait for element clickable
wait.app().waitForElementToBeClickable(buyNowButton, 10);

// Hard wait (avoid unless required)
wait.hardWait(3);
```

### 4. Gestures via `actionBuilderUtility.app()`

```java
// Swipe left on carousel
actionBuilderUtility.app().swipeLeft();

// Swipe up for scroll
actionBuilderUtility.app().swipeUp();

// Scroll until element is visible
actionBuilderUtility.app().scrollToElement(targetElement);
```

### 5. Platform-Specific Utilities

```java
// Android
androidUtility.pressBack();
androidUtility.hideKeyboard();
androidUtility.openDeepLink("headout://product/12345");

// iOS
iosUtility.acceptAlert();
iosUtility.dismissAlert();
iosUtility.scrollToAccessibilityId("Buy Now");
```

---

## Page Object Pattern

```java
// src/test/java/com/headout/pages/CheckoutPO.java
package com.headout.pages;

import com.headout.base.app.BaseAutomation;
import com.headout.common.AppiumCommonDataHandler;
import com.headout.common.TestNGLogUtility;
import com.headout.util.custom.ByBuilder;
import com.headout.utility.CommonApiUtility;

public class CheckoutPO extends BaseAutomation {

    CommonApiUtility commonApiUtility = new CommonApiUtility();

    // Locators — dual-platform XPath
    private final ByBuilder productName = ByBuilder.xpath(
        "//*[@resource-id='qaid-checkout-productname-label' or @name='qaid-checkout-productname-label']"
    );
    private final ByBuilder promoCodeButton = ByBuilder.xpath(
        "//*[@resource-id='qaid-checkout-promocode-button' or @name='qaid-checkout-promocode-button']"
    );
    private final ByBuilder promoCodeTextField = ByBuilder.xpath(
        "//*[(@resource-id='qaid-checkout-promocode-field' and @clickable='true') or @name='qaid-checkout-promocode-field']"
    );
    private final ByBuilder promoCodeApplyButton = ByBuilder.xpath(
        "//*[@resource-id='qaid-checkout-promocode-apply-button' or @name='qaid-checkout-promocode-apply-button']"
    );
    private final ByBuilder promoCodeError = ByBuilder.xpath(
        "//*[@resource-id='qaid-checkout-promocode-error-label' or @name='qaid-checkout-promocode-error-label']"
    );
    private final ByBuilder totalPayablePrice = ByBuilder.xpath(
        "//*[@resource-id='qaid-checkout-totalpayable-price-label' or @name='qaid-checkout-totalpayable-price-label']"
    );

    // Check if checkout page is loaded
    public boolean isCheckoutPageEnabled() {
        return wait.app().isDisplayed(productName, 35);
    }

    // Get displayed product name
    public boolean validateProductName() {
        return genericMethod.app().isDisplayed(productName);
    }

    // Add promo code
    public void userAddPromoCodeDetails(String promoCode) {
        TestNGLogUtility.info("Adding promo code: " + promoCode);
        genericMethod.app().click(promoCodeButton);
        wait.app().isDisplayed(promoCodeTextField, 10);
        genericMethod.app().sendKeys(promoCodeTextField, promoCode);
        genericMethod.app().click(promoCodeApplyButton);
    }

    // Validate promo code result message
    public String validatePromoCode() {
        wait.app().isDisplayed(promoCodeError, 10);
        return genericMethod.app().getText(promoCodeError);
    }

    // Get total payable price
    public String getTotalPayablePrice() {
        return genericMethod.app().getText(totalPayablePrice);
    }
}
```

---

## Step Definition Pattern

Step definitions extend `com.headout.base.be.BaseAutomation` and instantiate POs.

```java
// src/test/java/com/headout/stepdefinitions/CheckoutStepDef.java
package com.headout.stepdefinitions;

import com.headout.base.be.BaseAutomation;
import com.headout.common.AppiumCommonDataHandler;
import com.headout.common.TestNGLogUtility;
import com.headout.pages.CheckoutPO;
import com.headout.pages.PaymentPO;
import com.headout.utility.CommonApiUtility;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Then;
import org.testng.Assert;

public class CheckoutStepDef extends BaseAutomation {

    CheckoutPO       checkoutPO     = new CheckoutPO();
    CommonApiUtility calipsoUtility = new CommonApiUtility();

    @Then("User validate promo code {string} message")
    public void userValidatePromoCodeMessage(String message) {
        Assert.assertEquals(
            checkoutPO.validatePromoCode(),
            message,
            "Validating promo code message on checkout Page"
        );
    }

    @Then("User provide promo code {string} details")
    public void userProvidePromoCodeDetails(String promoCode) {
        checkoutPO.userAddPromoCodeDetails(promoCode);
    }

    @Then("User processed with 3ds payment")
    public void userProcessedWithDsPayment() {
        PaymentPO paymentPO = new PaymentPO();
        paymentPO.challenge();
    }
}
```

---

## Data Handler — AppiumCommonDataHandler

```java
import com.headout.common.AppiumCommonDataHandler;

// Store scenario-level data
AppiumCommonDataHandler.getInstance().setData("productId", "12345");
AppiumCommonDataHandler.getInstance().setData("bookingId", bookingId);

// Read scenario-level data
String productId = AppiumCommonDataHandler.getInstance().getData("productId");
String bookingId = AppiumCommonDataHandler.getInstance().getData("bookingId");
```

---

## Capability File (`capability.json`)

```json
{
  "android": {
    "platformName": "Android",
    "automationName": "UiAutomator2",
    "deviceName": "emulator-5554",
    "appPackage": "com.tourlandish.chronos.develop",
    "appActivity": "com.tourlandish.chronos.MainActivity",
    "noReset": false,
    "fullReset": true,
    "autoGrantPermissions": true,
    "newCommandTimeout": 300
  },
  "ios": {
    "platformName": "iOS",
    "automationName": "XCUITest",
    "bundleId": "com.tourlandish.Tourlandish",
    "xcodeOrgId": "2YJUQJ6L86",
    "xcodeSigningId": "iPhone Developer",
    "noReset": false,
    "newCommandTimeout": 300
  }
}
```

---

## Android Emulator Scripts

```bash
# Bootstrap environment (one-time)
./android-script/setup_android_emulators.sh

# Create AVDs
./android-script/create_avds.sh

# Start before test run
./android-script/start-emulator.sh emulator-5554

# Reset Appium server state
adb uninstall io.appium.uiautomator2.server
adb uninstall io.appium.uiautomator2.server.test

# Stop after test run
./android-script/stop-emulator.sh emulator-5554
```

---

## BDD Feature File

```gherkin
# src/test/java/com/headout/features/checkout/checkout-flow.feature
@test @checkout @android
Feature: Checkout Flow

  @smoke
  Scenario: Validate promo code error on checkout
    Given User is on checkout page for product "12345"
    Then User provide promo code "INVALIDCODE" details
    And User validate promo code "Invalid promo code" message

  @regression
  Scenario: Complete checkout with promo code
    Given User is on checkout page for product "12345"
    Then User provide promo code "SAVE10" details
    And User validate promo code "Promo applied" message
    Then User processed with 3ds payment
```

---

## Run Commands

```bash
# Android, test env
mvn test -Dcucumber.filter.tags="@test and @android" -DDEVICE_TYPE=android

# iOS
mvn test -Dcucumber.filter.tags="@test and @ios" -DDEVICE_TYPE=ios

# BrowserStack cloud
mvn test -Dcucumber.filter.tags="@test" -DCLOUD_BROWSER_TYPE=BROWSER_STACK

# Parallel run with emulator pool
mvn test -Dcucumber.filter.tags="@test" -DthreadCount=4 -DPARALLEL_APPIUM_DEVICE_CONFIG=true
```

---

## Agent Rules

1. Page Objects extend `com.headout.base.app.BaseAutomation`.
2. Step Definitions extend `com.headout.base.be.BaseAutomation`.
3. All locators are `private final ByBuilder` fields in PO classes.
4. Use dual XPath pattern: `@resource-id='...' or @name='...'` for Android + iOS support.
5. Use `wait.app().isDisplayed(locator, timeoutSec)` before interactions — NEVER `Thread.sleep()`.
6. Use `genericMethod.app().click()` / `.sendKeys()` / `.getText()` / `.isDisplayed()`.
7. Use `androidUtility` / `iosUtility` for platform-specific operations only.
8. Step definitions instantiate PO classes and call PO methods — no direct driver interactions.
9. Use `AppiumCommonDataHandler.getInstance()` for all intra-scenario data.
10. Use `CommonApiUtility` in step defs for any API precondition calls during mobile testing.
