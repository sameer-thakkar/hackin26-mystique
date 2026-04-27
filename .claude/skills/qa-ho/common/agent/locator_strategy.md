---
name: Locator Strategy Agent
description: >
  Defines the exact priority order and decision process for generating ByBuilder
  locators from a page source (HTML for web, Appium XML for mobile).
  All locator-writing must follow this strategy before any other agent rule.
version: 1.0.0
repos: [celium, appium]
---

# Locator Strategy — Priority Order and Page Source Analysis

When you receive a page source (HTML dump, screenshot description, or Appium
XML/UI Inspector dump), always follow this workflow in strict order.

---

## STEP 1 — Identify the Platform

```
Page source is HTML  →  Web strategy (celium, Selenium/Playwright)
Page source is XML with @resource-id / @content-desc  →  Mobile strategy (appium)
```

---

## STEP 2 — Web Strategy: HTML Attribute Priority Order

Scan the element in the HTML source top-to-bottom through these tiers.
Use the **first tier that has a stable, non-generated value**.

### Tier 1 — `data-qa-marker` ★ HIGHEST PRIORITY

```html
<!-- HTML -->
<button data-qa-marker="checkout-place-order">Place Order</button>
<input  data-qa-marker="field-input-email" type="email" />
<div    data-qa-marker="experience-status-label-Active">Active</div>
```

```java
// Generated locator
ByBuilder placeOrderButton = ByBuilder.xpath("//button[@data-qa-marker='checkout-place-order']");
ByBuilder emailField       = ByBuilder.xpath("//input[@data-qa-marker='field-input-email']");

// If value is dynamic (list/tab/status), use ${id} parameterized form
ByBuilder experienceStatus = ByBuilder.xpath("//div[@data-qa-marker='experience-status-label-${id}']");
```

**When to parameterize:** if multiple sibling elements share the same `data-qa-marker` prefix
with a changing suffix (like a tab label or item ID), use `${id}` and emit a helper method.

---

### Tier 2 — `aria-label` / `aria-labelledby`

```html
<button aria-label="Close dialog">×</button>
<input  aria-labelledby="search-label" type="text" />
```

```java
ByBuilder closeDialog = ByBuilder.xpath("//button[@aria-label='Close dialog']");
ByBuilder searchInput = ByBuilder.xpath("//input[@aria-labelledby='search-label']");
```

---

### Tier 3 — `data-testid` / `data-test` / `data-cy`

```html
<div data-testid="booking-summary-card">...</div>
<button data-cy="apply-promo">Apply</button>
```

```java
ByBuilder bookingSummary = ByBuilder.xpath("//div[@data-testid='booking-summary-card']");
ByBuilder applyPromo     = ByBuilder.xpath("//button[@data-cy='apply-promo']");
```

---

### Tier 4 — Stable `id` Attribute

Only use `id` if the value is clearly stable (not a UUID, not a timestamp, not `react-<number>`).

```html
<!-- STABLE — use it -->
<input id="email-field" type="email" />

<!-- UNSTABLE — skip this tier -->
<div id="react-123456">...</div>
<div id="1a2b3c4d-5e6f-...">...</div>
```

```java
// Stable id → use ByBuilder.id()
ByBuilder emailField = ByBuilder.id("email-field");
```

---

### Tier 5 — Semantic CSS Selectors

For meta tags, link tags, and semantic HTML where the tag + attribute uniquely identifies the element:

```html
<meta name="description" content="Headout experiences..."/>
<link rel="canonical" href="https://..."/>
<h1>Experiences in Dubai</h1>
<meta property="og:title" content="..."/>
```

```java
ByBuilder metaDescription = ByBuilder.cssSelector("meta[name='description']");
ByBuilder canonicalLink   = ByBuilder.cssSelector("link[rel='canonical']");
ByBuilder pageH1          = ByBuilder.cssSelector("h1");
ByBuilder ogTitle         = ByBuilder.cssSelector("meta[property='og:title']");
```

---

### Tier 6 — `name` Attribute on Form Inputs

```html
<input name="promoCode" type="text" />
<select name="currency">...</select>
```

```java
ByBuilder promoCodeInput = ByBuilder.xpath("//input[@name='promoCode']");
```

---

### Tier 7 — `data-framer-name` (Framer-rendered elements)

```html
<div data-framer-name="Logo_Dark_2x" ...></div>
```

```java
ByBuilder headoutLogo = ByBuilder.xpath("//*[@data-framer-name='Logo_Dark_2x']");
```

---

### Tier 8 — Stable Attribute Combination + `xpathWithDescription`

Only when no single attribute provides a stable unique locator.
Combine 2–3 stable attributes and add a description:

```html
<button type="submit" data-form="login-form" class="btn ...">Sign In</button>
```

```java
ByBuilder loginSubmit = ByBuilder.xpathWithDescription(
    "//button[@type='submit' and @data-form='login-form']",
    "Primary sign-in submit button on login form"
);
```

---

### NEVER USE (Web)

| Attribute | Reason |
|-----------|--------|
| `class` alone | Changes with every UI redesign / CSS module rename |
| `style` | Presentation — not identity |
| Positional `(//tag)[N]` | Breaks when DOM order changes |
| Element text `[text()='...']` | Breaks on translation, copy change |
| Auto-generated `id` (react-*, uuid) | Different on every render |
| Parent-child counting `div:nth-child(3)` | DOM-order dependent |

---

## STEP 3 — Mobile Strategy: Appium XML Attribute Priority Order

Open the Appium Inspector XML dump or UI Automator dump and scan each element.

### Tier 1 — `qaid-` Prefixed resource-id AND name (dual-platform) ★ HIGHEST PRIORITY

```xml
<!-- Android XML -->
<android.widget.Button
  resource-id="com.headout.app:id/qaid-checkout-place-order"
  content-desc="qaid-checkout-place-order"
  clickable="true" />

<!-- iOS XML (same screen) -->
<XCUIElementTypeButton
  name="qaid-checkout-place-order"
  label="Place Order" />
```

```java
// Always combine Android resource-id + iOS name in one locator
private final ByBuilder placeOrderButton = ByBuilder.xpath(
    "//*[@resource-id='qaid-checkout-place-order' or @name='qaid-checkout-place-order']"
);
```

**Strip the package prefix** (`com.headout.app:id/`) when writing the XPath:
```java
// CORRECT — no package prefix in XPath
"//*[@resource-id='qaid-checkout-place-order' ...]"

// WRONG — package prefix makes locator break on flavor/buildType change
"//*[@resource-id='com.headout.app:id/qaid-checkout-place-order' ...]"
```

---

### Tier 1b — Input Fields: Add `@clickable='true'` for Android

When the Appium dump shows multiple nodes with the same `resource-id` (hidden + visible input pattern):

```java
private final ByBuilder promoField = ByBuilder.xpath(
    "//*[(@resource-id='qaid-checkout-promo-field' and @clickable='true') or @name='qaid-checkout-promo-field']"
);
```

---

### Tier 2 — `qaid-` Accessibility ID (both platforms consistent)

When `content-desc` (Android) and `name` (iOS) match exactly and start with `qaid-`:

```xml
<android.widget.Button content-desc="qaid-close-modal" />
<!-- iOS: name="qaid-close-modal" -->
```

```java
private final ByBuilder closeModal = ByBuilder.accessibilityId("qaid-close-modal");
```

---

### Tier 3 — Dynamic qaid- IDs: Use `contains()` + `${id}`

When `resource-id` includes a dynamic value (date, index, variant ID):

```xml
<!-- Calendar: resource-id changes per date -->
<android.widget.TextView resource-id="qaid-calendar-date-label-2024-06-15" />
<android.widget.TextView resource-id="qaid-calendar-date-label-2024-06-16" />
```

```java
// Parameterized with ${id} + contains()
private final ByBuilder dateLabel = ByBuilder.xpath(
    "//*[contains(@resource-id,'qaid-calendar-date-label-${id}') or contains(@name,'qaid-calendar-date-label-${id}')]"
);

public void selectDate(String dateKey) {
    genericMethod.app().click(genericMethod.parameterizedLocator(dateLabel, dateKey));
}
```

---

### Tier 4 — Non-qaid resource-id (still use dual-platform)

When the resource-id exists but does not have `qaid-` prefix — still emit dual-platform:

```java
private final ByBuilder headerTitle = ByBuilder.xpath(
    "//*[@resource-id='toolbar-title' or @name='toolbar-title']"
);
```

---

### Tier 5 — `text` Attribute for Truly Static Labels

Only for button labels or messages that are in English, never localised, and truly static.
Use `contains()` to avoid whitespace issues:

```java
private final ByBuilder placeOrderText = ByBuilder.xpath(
    "//*[contains(@text,'Place Order') or contains(@label,'Place Order')]"
);
```

---

### NEVER USE (Mobile)

| Pattern | Reason |
|---------|--------|
| Position index `//*[3]` | DOM order differs by platform/screen size |
| `class` / `type` alone | Too many matching elements |
| Coordinate tap | Breaks on different screen resolutions |
| Separate Android + iOS ByBuilder fields | Duplicates locators — use dual in one |
| Package-qualified `resource-id` | Breaks across build flavors |

---

## STEP 4 — Dynamic vs Static Decision

After choosing the locator tier, determine if the locator is dynamic:

```
Is the element ONE of many identical siblings (list item, tab, status badge)?
  YES → Use ${id} parameterized ByBuilder + emit helper method
  NO  → Use fixed ByBuilder value

Does the text/value vary per test run (date, booking ID, price)?
  YES → Use ${id} parameterized ByBuilder + contains() for partial match
  NO  → Use fixed ByBuilder value
```

---

## STEP 5 — Naming the Field

Follow the naming table from `qa/ui/agent/locator_generate_agent.md`:

| Element Type | Suffix | Example |
|---|---|---|
| Button | `Button` | `placeOrderButton` |
| Input/Field | `Field` or `Input` | `emailField`, `searchInput` |
| Label/Text | `Label` or `Text` | `productNameLabel` |
| Container | `Container` or `Section` | `bookingCardContainer` |
| Link | `Link` | `termsLink` |
| Dropdown | `Dropdown` | `currencyDropdown` |
| Toggle | `Toggle` | `notificationsToggle` |
| Tab | `Tab` | `statusTab` (parameterized) |
| Loader | `Loader` | `checkoutLoader` |
| Icon | `Icon` | `profileIcon` |

---

## STEP 6 — Full Output Template

### Web (celium) — Final Output Form

```java
// src/test/java/com/headout/pageobjects/<domain>/<Page>PO.java

// Static element — fixed value
ByBuilder placeOrderButton = ByBuilder.xpath("//button[@data-qa-marker='checkout-place-order']");

// With description — for non-obvious XPath
ByBuilder expandSidebar = ByBuilder.xpathWithDescription(
    "//button[@data-tooltip-content='Expand sidebar']",
    "Hub sidebar expand/collapse toggle"
);

// Dynamic element — parameterized
ByBuilder statusTab = ByBuilder.xpath("//div[@data-qa-marker='status-tab-${id}']");

public void clickStatusTab(String tabName) {
    genericMethod.click(genericMethod.parameterizedLocator(statusTab, tabName));
}
```

### Mobile (appium) — Final Output Form

```java
// src/test/java/com/headout/pages/<Screen>PO.java

// Static element — fixed dual-platform
private final ByBuilder placeOrderButton = ByBuilder.xpath(
    "//*[@resource-id='qaid-checkout-place-order' or @name='qaid-checkout-place-order']"
);

// Input requiring @clickable='true' on Android
private final ByBuilder promoField = ByBuilder.xpath(
    "//*[(@resource-id='qaid-promo-field' and @clickable='true') or @name='qaid-promo-field']"
);

// Dynamic element — parameterized contains()
private final ByBuilder dateLabel = ByBuilder.xpath(
    "//*[contains(@resource-id,'qaid-calendar-date-label-${id}') or contains(@name,'qaid-calendar-date-label-${id}')]"
);

public void selectDate(String dateKey) {
    genericMethod.app().click(genericMethod.parameterizedLocator(dateLabel, dateKey));
}
```

---

## Quick Reference — Priority Tables

### Web Priority

| Priority | Attribute | ByBuilder Method |
|----------|-----------|-----------------|
| 1 ★ | `data-qa-marker` | `xpath("//tag[@data-qa-marker='val']")` |
| 2 | `aria-label` | `xpath("//tag[@aria-label='val']")` |
| 3 | `data-testid` / `data-cy` | `xpath("//tag[@data-testid='val']")` |
| 4 | stable `id` | `id("stable-id")` |
| 5 | semantic tag + attr | `cssSelector("meta[name='desc']")` |
| 6 | `name` on inputs | `xpath("//input[@name='val']")` |
| 7 | `data-framer-name` | `xpath("//*[@data-framer-name='val']")` |
| 8 | attr combo | `xpathWithDescription("//...", "desc")` |

### Mobile Priority

| Priority | Attribute | ByBuilder Method |
|----------|-----------|-----------------|
| 1 ★ | `qaid-*` resource-id + name | `xpath("//*[@resource-id='qaid-...' or @name='qaid-...']")` |
| 1b | input + @clickable | `xpath("//*[(@resource-id='qaid-...' and @clickable='true') or ...]")` |
| 2 | `qaid-*` consistent on both platforms | `accessibilityId("qaid-...")` |
| 3 | dynamic qaid-* | `xpath("contains(@resource-id,'qaid-...-${id}') or contains(@name,...)")` |
| 4 | non-qaid resource-id | `xpath("//*[@resource-id='...' or @name='...']")` |
| 5 | static `text` / `label` | `xpath("contains(@text,'...') or contains(@label,'...')")` |
