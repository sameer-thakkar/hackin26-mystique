---
name: ByBuilder Locator Generator (UI)
description: >
  Given HTML source (web), generates the correct ByBuilder Java field
  declaration following the priority order defined in
  qa/common/agent/locator_strategy.md. This agent is invoked BEFORE any
  Page Object is written.
version: 1.1.0
repos: [celium]
dependsOn:
  - qa/common/agent/locator_strategy.md
  - qa/common/agent/_PRAETORIAN_CONSTITUTION.md
---

# ByBuilder Locator Generator (UI — celium)

## How to Use This Agent

Provide any of the following:
1. **HTML snippet** of the element(s) you need to locate
2. **Element description** ("the Submit button on the checkout page")
3. **Screenshot** with the element highlighted

This agent will:
1. Identify the correct locator tier (from `qa/common/agent/locator_strategy.md`)
2. Generate the `ByBuilder` Java field declaration
3. Indicate if the locator should be parameterized (`${id}`)
4. Emit a helper method if parameterized

---

## Web Locator Generation

### Priority applied top-down — stop at first match

```
Tier 1: data-qa-marker     → ByBuilder.xpath("//tag[@data-qa-marker='val']")
Tier 2: aria-label         → ByBuilder.xpath("//tag[@aria-label='val']")
Tier 3: data-testid/cy     → ByBuilder.xpath("//tag[@data-testid='val']")
Tier 4: stable id          → ByBuilder.id("val")
Tier 5: semantic CSS       → ByBuilder.cssSelector("tag[attr='val']")
Tier 6: name on inputs     → ByBuilder.xpath("//input[@name='val']")
Tier 7: data-framer-name   → ByBuilder.xpath("//*[@data-framer-name='val']")
Tier 8: attr combo         → ByBuilder.xpathWithDescription("//...", "desc")
```

### Dynamic check — after tier selection

```
Multiple sibling elements share the same tier attribute with a changing suffix?
  YES → Replace suffix with ${id}, emit parameterizedLocator() method
  NO  → Fixed value
```

### Output format

```java
// Tier used: [N] — [attribute name]
ByBuilder <fieldName> = ByBuilder.<method>("<selector>");

// If parameterized:
ByBuilder <fieldName> = ByBuilder.xpath("//tag[@data-qa-marker='prefix-${id}']");
public void <action>(String value) {
    genericMethod.click(genericMethod.parameterizedLocator(<fieldName>, value));
}
```

---

## Complete Example — Given HTML

**Input:**
```html
<div class="checkout-promo-section">
  <button data-qa-marker="checkout-promo-toggle" aria-label="Add promo code">
    Add promo code
  </button>
  <input data-qa-marker="checkout-promo-input" type="text" placeholder="Enter code" />
  <button data-qa-marker="checkout-promo-apply" type="submit">Apply</button>
  <span  data-qa-marker="checkout-promo-error-label" class="error-text"></span>
  <span  data-qa-marker="checkout-promo-success-label" class="success-text"></span>
</div>

<!-- Tabs: All, Active, Inactive, Expired -->
<div data-qa-marker="booking-status-tab-All">All</div>
<div data-qa-marker="booking-status-tab-Active">Active</div>
<div data-qa-marker="booking-status-tab-Inactive">Inactive</div>
<div data-qa-marker="booking-status-tab-Expired">Expired</div>
```

**Generated Output:**
```java
// --- Promo section locators (Tier 1: data-qa-marker) ---
ByBuilder promoToggleButton  = ByBuilder.xpath("//button[@data-qa-marker='checkout-promo-toggle']");
ByBuilder promoInput         = ByBuilder.xpath("//input[@data-qa-marker='checkout-promo-input']");
ByBuilder promoApplyButton   = ByBuilder.xpath("//button[@data-qa-marker='checkout-promo-apply']");
ByBuilder promoErrorLabel    = ByBuilder.xpath("//span[@data-qa-marker='checkout-promo-error-label']");
ByBuilder promoSuccessLabel  = ByBuilder.xpath("//span[@data-qa-marker='checkout-promo-success-label']");

// --- Booking status tab (Tier 1: data-qa-marker — parameterized, 4 sibling values) ---
ByBuilder bookingStatusTab = ByBuilder.xpath("//div[@data-qa-marker='booking-status-tab-${id}']");

public void clickBookingStatusTab(String tabName) {
    // tabName: "All" | "Active" | "Inactive" | "Expired"
    genericMethod.click(genericMethod.parameterizedLocator(bookingStatusTab, tabName));
}
```

---

## Anti-Patterns — What This Agent Must Never Emit

```java
// NEVER emit By.* — always ByBuilder.*
By btn = By.xpath("...");                          ✗

// NEVER emit static
static ByBuilder btn = ByBuilder.xpath("...");     ✗

// NEVER class-based locator
ByBuilder btn = ByBuilder.xpath("//button[contains(@class,'primary')]");  ✗

// NEVER positional XPath
ByBuilder btn = ByBuilder.xpath("(//button)[2]");  ✗

// NEVER text-based (breaks on translation)
ByBuilder btn = ByBuilder.xpath("//button[text()='Place Order']");  ✗
```
