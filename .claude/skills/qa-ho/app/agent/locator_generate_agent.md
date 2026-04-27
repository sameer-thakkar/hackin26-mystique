---
name: ByBuilder Locator Generator (App)
description: >
  Given Appium XML (mobile), generates the correct ByBuilder Java field
  declaration following the priority order defined in
  qa/common/agent/locator_strategy.md. This agent is invoked BEFORE any
  Page Object is written.
version: 1.1.0
repos: [appium]
dependsOn:
  - qa/common/agent/locator_strategy.md
  - qa/common/agent/_PRAETORIAN_CONSTITUTION.md
---

# ByBuilder Locator Generator (App — appium)

## How to Use This Agent

Provide any of the following:
1. **Appium XML dump** of the screen element(s) (from Appium Inspector)
2. **Element description** ("the Place Order button on the checkout screen")
3. **Screenshot** with the element highlighted

This agent will:
1. Identify the correct locator tier (from `qa/common/agent/locator_strategy.md`)
2. Generate the dual-platform `ByBuilder` Java field declaration (Android + iOS)
3. Indicate if the locator should be parameterized (`${id}`)
4. Emit a helper method if parameterized

---

## Mobile Locator Generation

### Priority applied top-down — stop at first match

```
Tier 1:  qaid-* resource-id AND name (dual)
         → ByBuilder.xpath("//*[@resource-id='qaid-...' or @name='qaid-...']")

Tier 1b: input + must be clickable
         → ByBuilder.xpath("//*[(@resource-id='qaid-...' and @clickable='true') or @name='qaid-...']")

Tier 2:  qaid-* accessibility-id (consistent both platforms)
         → ByBuilder.accessibilityId("qaid-...")

Tier 3:  dynamic qaid-* (contains)
         → ByBuilder.xpath("//*[contains(@resource-id,'qaid-...-${id}') or contains(@name,'qaid-...-${id}')]")

Tier 4:  non-qaid resource-id (dual)
         → ByBuilder.xpath("//*[@resource-id='...' or @name='...']")

Tier 5:  static text / label
         → ByBuilder.xpath("//*[contains(@text,'...') or contains(@label,'...')]")
```

### Dynamic check — after tier selection

```
Multiple sibling elements share the same qaid-* suffix with a changing key?
  YES → Replace key with ${id}, use contains(), emit parameterizedLocator() method
  NO  → Fixed value
```

### Output format

```java
// Tier used: [N] — [attribute]
private final ByBuilder <fieldName> = ByBuilder.<method>("<selector>");

// If parameterized:
private final ByBuilder <fieldName> = ByBuilder.xpath(
    "//*[contains(@resource-id,'qaid-...-${id}') or contains(@name,'qaid-...-${id}')]"
);
public void <action>(String key) {
    genericMethod.app().click(genericMethod.parameterizedLocator(<fieldName>, key));
}
```

---

## Complete Example — Given Appium XML

**Input:**
```xml
<!-- Android XML dump (UI Automator / Appium Inspector) -->
<android.widget.TextView
  resource-id="com.tourlandish.chronos.develop:id/qaid-checkout-total-price-label"
  text="INR 1,200"
  clickable="false" />

<android.widget.Button
  resource-id="com.tourlandish.chronos.develop:id/qaid-checkout-place-order-button"
  content-desc="qaid-checkout-place-order-button"
  clickable="true" />

<android.widget.EditText
  resource-id="com.tourlandish.chronos.develop:id/qaid-checkout-promo-input"
  clickable="true" />

<!-- Calendar dates (dynamic) -->
<android.widget.TextView resource-id="qaid-calendar-date-label-2024-06-15" />
<android.widget.TextView resource-id="qaid-calendar-date-label-2024-06-16" />
<android.widget.TextView resource-id="qaid-calendar-date-label-2024-06-17-disabled" />
```

**Generated Output:**
```java
// --- Checkout locators (Tier 1: qaid-* dual-platform) ---

// TextView — not clickable, no @clickable guard needed
private final ByBuilder totalPriceLabel = ByBuilder.xpath(
    "//*[@resource-id='qaid-checkout-total-price-label' or @name='qaid-checkout-total-price-label']"
);

// Button — clickable, standard dual
private final ByBuilder placeOrderButton = ByBuilder.xpath(
    "//*[@resource-id='qaid-checkout-place-order-button' or @name='qaid-checkout-place-order-button']"
);

// EditText — input: add @clickable='true' on Android side (Tier 1b)
private final ByBuilder promoInput = ByBuilder.xpath(
    "//*[(@resource-id='qaid-checkout-promo-input' and @clickable='true') or @name='qaid-checkout-promo-input']"
);

// Calendar dates — dynamic suffix: use contains() + ${id} (Tier 3)
private final ByBuilder calendarDate = ByBuilder.xpath(
    "//*[contains(@resource-id,'qaid-calendar-date-label-${id}') or contains(@name,'qaid-calendar-date-label-${id}')]"
);

public void selectCalendarDate(String dateKey) {
    // dateKey examples: "2024-06-15", "2024-06-17-disabled"
    genericMethod.app().click(genericMethod.parameterizedLocator(calendarDate, dateKey));
}
```

---

## Anti-Patterns — What This Agent Must Never Emit

```java
// NEVER emit By.* — always ByBuilder.*
By btn = By.xpath("...");                          ✗

// NEVER emit static
static ByBuilder btn = ByBuilder.xpath("...");     ✗

// NEVER Android-only — always dual-platform
private final ByBuilder btn = ByBuilder.xpath("//*[@resource-id='qaid-buy']");  ✗
// MUST include iOS @name too:
private final ByBuilder btn = ByBuilder.xpath("//*[@resource-id='qaid-buy' or @name='qaid-buy']");  ✓

// NEVER package-qualified resource-id
"//*[@resource-id='com.tourlandish.chronos:id/qaid-buy']"  ✗
"//*[@resource-id='qaid-buy' or @name='qaid-buy']"          ✓

// NEVER positional XPath
ByBuilder btn = ByBuilder.xpath("(//android.widget.Button)[2]");  ✗

// NEVER text-based (breaks on translation)
ByBuilder btn = ByBuilder.xpath("//*[@text='Place Order']");  ✗
```
