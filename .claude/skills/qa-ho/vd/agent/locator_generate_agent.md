---
name: ByBuilder Locator Generator (VD)
description: >
  Given HTML source (web) for Visual Diff pages, generates the correct
  ByBuilder Java field declaration following the priority order defined in
  qa/common/agent/locator_strategy.md. This agent is invoked BEFORE any
  VD Page Object is written.
version: 1.1.0
repos: [pixify]
dependsOn:
  - qa/common/agent/locator_strategy.md
  - qa/common/agent/_PRAETORIAN_CONSTITUTION.md
---

# ByBuilder Locator Generator (VD — pixify)

## How to Use This Agent

Provide any of the following:
1. **HTML snippet** of the element(s) you need to locate for VD pre-capture actions
2. **Element description** ("the cookie banner dismiss button on the homepage")
3. **Screenshot** with the element highlighted

This agent will:
1. Identify the correct locator tier (from `qa/common/agent/locator_strategy.md`)
2. Generate the `ByBuilder` Java field declaration for use in `VisualDiffUtility`
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

## Complete Example — Given HTML (VD pre-capture action)

**Input:**
```html
<!-- Cookie banner shown before VD screenshot is taken -->
<div data-qa-marker="cookie-banner-container">
  <button data-qa-marker="cookie-banner-accept-btn" aria-label="Accept cookies">
    Accept
  </button>
  <button data-qa-marker="cookie-banner-decline-btn">Decline</button>
</div>
```

**Generated Output:**
```java
// --- Cookie banner locators (Tier 1: data-qa-marker) ---
// Used in visual-diff-action.json pre-capture click actions
ByBuilder cookieBannerAcceptBtn  = ByBuilder.xpath("//button[@data-qa-marker='cookie-banner-accept-btn']");
ByBuilder cookieBannerDeclineBtn = ByBuilder.xpath("//button[@data-qa-marker='cookie-banner-decline-btn']");
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
ByBuilder btn = ByBuilder.xpath("//button[text()='Accept']");  ✗
```
