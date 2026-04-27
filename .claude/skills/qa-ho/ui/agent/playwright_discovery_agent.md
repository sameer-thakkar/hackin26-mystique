---
name: Playwright Discovery Agent (UI)
description: >
  Generates a complete UI test — Page Object + StepDef + Feature — from either
  provided context (default) or a live page inspected via Playwright MCP (on-demand).
  MCP execution is OFF by default; QA must explicitly request it.
  Supports the full Playwright MCP tool surface with runtime scenario routing.
version: 1.2.0
repos: [celium]
dependsOn:
  - qa/common/agent/locator_strategy.md
  - qa/common/agent/_PRAETORIAN_CONSTITUTION.md
  - qa/ui/agent/locator_generate_agent.md
  - qa/ui/skill/SKILL.md
mcpTools:
  # Navigation
  - playwright_navigate
  - playwright_go_back
  - playwright_go_forward
  - playwright_reload
  # Inspection
  - playwright_screenshot
  - playwright_get_visible_html
  - playwright_get_visible_text
  - playwright_evaluate
  # Interactions
  - playwright_click
  - playwright_double_click
  - playwright_right_click
  - playwright_fill
  - playwright_select_option
  - playwright_hover
  - playwright_press_key
  - playwright_check
  - playwright_uncheck
  - playwright_drag
  - playwright_upload_file
  # Waiting
  - playwright_wait_for_timeout
  - playwright_wait_for_selector
  # Waiting
  - playwright_wait_for_timeout
  - playwright_wait_for_selector
  # Multi-tab
  - playwright_new_tab
  - playwright_switch_tab
  - playwright_close
  # iFrame
  - playwright_frame_locator
  - playwright_frame_evaluate
  - playwright_frame_get_visible_html
  # Shadow DOM
  - playwright_evaluate          # used for shadow root traversal
mcpMode: on-demand
---

# Playwright Discovery Agent — UI (celium)

Generates a complete, assertion-rich Cucumber test from a URL or HTML context.
Playwright MCP browser execution is **off by default** — enabled only when QA
explicitly requests it. At runtime, the correct tool(s) are selected based on
the scenario — there is no fixed sequence.

---

## MCP Mode Decision — Read This First

```
┌─────────────────────────────────────────────────────────────────┐
│  Has the QA explicitly asked to run / inspect / browse / scan?  │
│                                                                 │
│  NO  → Context Mode (default) ─────────────────────────────►   │
│         Generate test from HTML / description / AC.             │
│         Locators marked [inferred]. No MCP calls.               │
│                                                                 │
│  YES → MCP Live Mode (on-demand) ──────────────────────────►   │
│         Select tools from the catalog below based on scenario.  │
│         Tool sequence is decided at runtime — not fixed.        │
└─────────────────────────────────────────────────────────────────┘
```

### MCP trigger phrases

| Phrase | Mode triggered |
|--------|----------------|
| "run playwright on …" | Full MCP live inspection |
| "inspect the live page" | Full MCP live inspection |
| "browse to … and check" | Full MCP live inspection |
| "scan the page at …" | Full MCP live inspection |
| "use MCP for …" | Full MCP live inspection |
| "verify locators against live DOM" | Validation pass only |

---

## MCP Tool Catalog

All available Playwright MCP tools. At runtime, pick the right tool(s)
for the current scenario — do not blindly run all of them.

### Navigation Tools

| Tool | When to use |
|------|-------------|
| `playwright_navigate(url)` | Open a URL in the browser |
| `playwright_go_back()` | Test back-navigation behaviour |
| `playwright_go_forward()` | Test forward-navigation behaviour |
| `playwright_reload()` | Verify page state after refresh (session, cache) |

### Inspection Tools

| Tool | When to use |
|------|-------------|
| `playwright_screenshot()` | Capture current visual state — use before/after every interaction |
| `playwright_get_visible_html(selector?)` | Extract HTML of an element or full page |
| `playwright_get_visible_text(selector?)` | Extract plain text — faster than HTML when locators not needed |
| `playwright_evaluate(expression)` | Run JS — scan attributes, scroll, check state, extract computed values |

### Interaction Tools

| Tool | When to use |
|------|-------------|
| `playwright_click(selector)` | Button, link, tab, dismiss overlay, any clickable |
| `playwright_double_click(selector)` | Edit-in-place cells, file rename, canvas items |
| `playwright_right_click(selector)` | Context menus |
| `playwright_fill(selector, value)` | Text inputs, search bars, textarea |
| `playwright_select_option(selector, value)` | `<select>` dropdowns |
| `playwright_hover(selector)` | Reveal tooltips, dropdown menus, hover-only states |
| `playwright_press_key(selector, key)` | Keyboard shortcuts, Tab navigation, Enter submit, Escape close, Arrow keys, End/Home scroll |
| `playwright_check(selector)` | Check a checkbox or radio button |
| `playwright_uncheck(selector)` | Uncheck a checkbox |
| `playwright_drag(sourceSelector, targetSelector)` | Drag-and-drop sortable lists, kanban cards, sliders |
| `playwright_upload_file(selector, filePath)` | File input / upload zones |

### Wait Tools

| Tool | When to use |
|------|-------------|
| `playwright_wait_for_selector(selector, state?)` | Wait for element to appear/disappear (prefer over sleep) |
| `playwright_wait_for_timeout(ms)` | Last resort — only for CSS animations with no DOM signal |

### Multi-Tab Tools

| Tool | When to use |
|------|-------------|
| `playwright_new_tab()` | Open a new tab (e.g. "open in new tab" links) |
| `playwright_switch_tab(tabIndex)` | Switch focus between open tabs |
| `playwright_close()` | Close current tab or browser session |

### iFrame Tools

| Tool | When to use |
|------|-------------|
| `playwright_frame_locator(frameSelector)` | Scope all subsequent selectors inside a specific iframe |
| `playwright_frame_evaluate(frameSelector, expression)` | Run JS expression within the iframe's document context |
| `playwright_frame_get_visible_html(frameSelector, elementSelector?)` | Extract HTML from inside an iframe |

### Shadow DOM Tools

Shadow DOM is handled via `playwright_evaluate` — Playwright's standard locators
automatically pierce open shadow roots, but for discovery you need JS to traverse them.

| Approach | Tool | Expression |
|----------|------|-----------|
| Check if element has shadow root | `playwright_evaluate` | `!!document.querySelector('tag').shadowRoot` |
| Get all qa-markers inside shadow root | `playwright_evaluate` | `[...document.querySelector('host').shadowRoot.querySelectorAll('[data-qa-marker]')].map(e=>e.getAttribute('data-qa-marker'))` |
| Get HTML of shadow root | `playwright_evaluate` | `document.querySelector('host').shadowRoot.innerHTML` |
| Get nested shadow (chained) | `playwright_evaluate` | `el.shadowRoot.querySelector('inner-host').shadowRoot.innerHTML` |

---

## Runtime Scenario Routing

At runtime, inspect the scenario context and select the appropriate tool chain.
There is no fixed order — assemble the right sequence for the situation.

### Scenario → Tool Chain Mapping

| Scenario | Tool chain |
|----------|-----------|
| Simple page inspection | `navigate` → `screenshot` → `get_visible_html` → `evaluate` |
| Overlay / modal dismissal | `screenshot` → `click(dismiss)` → `screenshot` |
| Form fill + submit | `fill` → `click(submit)` → `wait_for_selector(result)` → `screenshot` |
| Dropdown (`<select>`) | `select_option` → `screenshot` |
| Custom dropdown (non-select) | `click(trigger)` → `wait_for_selector(menu)` → `screenshot` → `get_visible_html(menu)` |
| Hover state (tooltip) | `hover` → `screenshot` → `get_visible_html(tooltip)` |
| Hover state (dropdown menu) | `hover` → `wait_for_selector(menu)` → `screenshot` → `get_visible_html(menu)` |
| Keyboard navigation | `press_key(Tab)` → `screenshot` → repeat |
| Enter to submit | `fill` → `press_key(Enter)` → `wait_for_selector(result)` |
| Escape to close modal | `press_key(Escape)` → `screenshot` |
| Arrow key carousel | `press_key(ArrowRight)` → `screenshot` → repeat |
| Checkbox toggle | `check` / `uncheck` → `screenshot` |
| Drag and drop | `drag(source, target)` → `screenshot` |
| File upload | `upload_file(input, path)` → `wait_for_selector(success)` → `screenshot` |
| Double-click to edit | `double_click` → `screenshot` → `get_visible_html(editField)` |
| Right-click context menu | `right_click` → `screenshot` → `get_visible_html(menu)` |
| Back navigation | `go_back` → `wait_for_selector(landmark)` → `screenshot` |
| Forward navigation | `go_forward` → `wait_for_selector(landmark)` → `screenshot` |
| Page reload state | `reload` → `wait_for_selector(landmark)` → `screenshot` |
| Dynamic content (lazy load) | `evaluate(scroll)` → `wait_for_selector(newItems)` → `screenshot` |
| Infinite scroll | `press_key(End)` → `wait_for_selector(newBatch)` → `screenshot` |
| Animation wait | `wait_for_timeout(ms)` → `screenshot` |
| Multi-tab flow | `click(newTabLink)` → `switch_tab(1)` → `screenshot` → `close` |
| Text extraction only | `navigate` → `get_visible_text(selector)` |
| Attribute scan | `evaluate("Array.from(...).map(...)")` |
| Scroll to section | `evaluate("document.querySelector('[...]').scrollIntoView()")` → `screenshot` |
| Computed style check | `evaluate("getComputedStyle(el).color")` |
| Auth-gated page | `navigate(login)` → `fill(user)` → `fill(pass)` → `click(submit)` → `navigate(target)` |
| Pagination | `click(nextPage)` → `wait_for_selector(pageContent)` → `screenshot` |
| Date picker | `click(dateInput)` → `wait_for_selector(calendar)` → `click(date)` → `screenshot` |
| Search + filter | `fill(search)` → `press_key(Enter)` → `wait_for_selector(results)` → `screenshot` |
| Tab panel switch | `click(tab)` → `wait_for_selector(panelContent)` → `screenshot` → `get_visible_html(panel)` |
| **iFrame — discover elements** | `frame_get_visible_html(frameSelector)` → `frame_evaluate(frameSelector, qa-marker scan)` |
| **iFrame — interact inside** | `frame_locator(frameSelector)` → standard tools scoped to frame |
| **iFrame — run JS inside** | `frame_evaluate(frameSelector, expression)` |
| **Shadow DOM — detect** | `evaluate("!!document.querySelector('host').shadowRoot")` |
| **Shadow DOM — scan markers** | `evaluate("[...host.shadowRoot.querySelectorAll('[data-qa-marker]')].map(...)")` |
| **Shadow DOM — get HTML** | `evaluate("host.shadowRoot.innerHTML")` |
| **Shadow DOM — nested host** | `evaluate("host.shadowRoot.querySelector('inner').shadowRoot.innerHTML")` |

### Runtime Decision Tree (MCP Live Mode)

```
START
  │
  ├─ Need to reach a page?
  │    YES → playwright_navigate(url)
  │
  ├─ Need to see current state?
  │    ALWAYS → playwright_screenshot()   ← do this before and after every interaction
  │
  ├─ There is a blocking overlay?
  │    YES → playwright_click(dismissSelector)
  │           playwright_screenshot()
  │
  ├─ Need to fill a text input?
  │    YES → playwright_fill(selector, value)
  │
  ├─ Need to select from a <select>?
  │    YES → playwright_select_option(selector, value)
  │
  ├─ Need to pick from a custom dropdown?
  │    YES → playwright_click(trigger)
  │           playwright_wait_for_selector(menu)
  │           playwright_click(option)
  │
  ├─ Need to reveal a hover state?
  │    YES → playwright_hover(selector)
  │           playwright_screenshot()
  │
  ├─ Need to press a key?
  │    YES → playwright_press_key(selector, key)
  │    Keys: Tab, Enter, Escape, ArrowUp/Down/Left/Right, End, Home, Space
  │
  ├─ Need to toggle a checkbox?
  │    YES → playwright_check(selector)  OR  playwright_uncheck(selector)
  │
  ├─ Need to drag something?
  │    YES → playwright_drag(source, target)
  │
  ├─ Need to upload a file?
  │    YES → playwright_upload_file(selector, filePath)
  │
  ├─ Need to double-click?
  │    YES → playwright_double_click(selector)
  │
  ├─ Need to open a context menu?
  │    YES → playwright_right_click(selector)
  │
  ├─ Need to switch to a new tab?
  │    YES → playwright_new_tab()  OR  playwright_switch_tab(index)
  │
  ├─ Need to navigate browser history?
  │    YES → playwright_go_back()  OR  playwright_go_forward()
  │
  ├─ Need to reload the page?
  │    YES → playwright_reload()
  │
  ├─ Need to wait for an element?
  │    YES → playwright_wait_for_selector(selector, state)
  │    state: "visible" | "hidden" | "attached" | "detached"
  │
  ├─ Need to wait for animation only?
  │    YES → playwright_wait_for_timeout(ms)   ← last resort
  │
  ├─ Need to extract HTML for locator analysis?
  │    YES → playwright_get_visible_html(selector)
  │
  ├─ Need only text (no locator analysis)?
  │    YES → playwright_get_visible_text(selector)
  │
  ├─ Need to run JS or extract computed state?
  │    YES → playwright_evaluate(expression)
  │
  ├─ Element is inside an iFrame?
  │    → detect:   playwright_evaluate("document.querySelectorAll('iframe').length")
  │    → inspect:  playwright_frame_get_visible_html(frameSelector, elementSelector?)
  │    → scan:     playwright_frame_evaluate(frameSelector, "qa-marker scan expression")
  │    → interact: playwright_frame_locator(frameSelector) scopes all tools to the frame
  │
  └─ Element is inside Shadow DOM?
       → detect:   playwright_evaluate("!!document.querySelector('host-tag').shadowRoot")
       → scan:     playwright_evaluate("[...document.querySelector('host').shadowRoot
                     .querySelectorAll('[data-qa-marker]')].map(e=>e.getAttribute('data-qa-marker'))")
       → get HTML: playwright_evaluate("document.querySelector('host').shadowRoot.innerHTML")
       → nested:   playwright_evaluate("host.shadowRoot.querySelector('inner-host').shadowRoot.innerHTML")
       → Playwright locators pierce OPEN shadow roots automatically —
         use ByBuilder.xpath("//host-tag >> //target-element") for generated locators
```

---

## Special Cases: iFrame & Shadow DOM Handling

### iFrame — MCP Discovery Flow

**Step 1 — Detect iframes on the page**
```
MCP: playwright_evaluate
  expression: |
    Array.from(document.querySelectorAll('iframe')).map(f => ({
      src: f.src,
      id: f.id,
      name: f.name,
      dataQa: f.getAttribute('data-qa-marker')
    }))
```

**Step 2 — Extract HTML from inside the iframe**
```
MCP: playwright_frame_get_visible_html
  frameSelector: "iframe[data-qa-marker='payment-iframe']"
  elementSelector: "body"          ← optional: scope to a sub-element
```

**Step 3 — Scan qa-markers inside the iframe**
```
MCP: playwright_frame_evaluate
  frameSelector: "iframe[data-qa-marker='payment-iframe']"
  expression: |
    Array.from(document.querySelectorAll('[data-qa-marker]'))
      .map(el => ({ tag: el.tagName, marker: el.getAttribute('data-qa-marker') }))
```

**Step 4 — Interact inside the iframe (fill, click, etc.)**
```
MCP: playwright_frame_locator
  frameSelector: "iframe[data-qa-marker='payment-iframe']"
  → all subsequent tool calls are scoped to this frame until frame context is cleared

MCP: playwright_fill
  selector: "[data-qa-marker='card-number-input']"   ← resolved inside the frame

MCP: playwright_click
  selector: "[data-qa-marker='pay-now-btn']"         ← resolved inside the frame
```

**Generated Java — iFrame handling in Page Object**
```java
// Selenium approach: switch into frame, interact, switch back
public class PaymentPO extends BaseAutomation {

    // Locator for the iframe itself (on the parent page)
    ByBuilder paymentIframe = ByBuilder.xpath("//iframe[@data-qa-marker='payment-iframe']");

    // Locators resolved INSIDE the iframe (used after switchTo)
    ByBuilder cardNumberInput = ByBuilder.xpath("//*[@data-qa-marker='card-number-input']");
    ByBuilder cardExpiryInput = ByBuilder.xpath("//*[@data-qa-marker='card-expiry-input']");
    ByBuilder cardCvvInput    = ByBuilder.xpath("//*[@data-qa-marker='card-cvv-input']");
    ByBuilder payNowButton    = ByBuilder.xpath("//*[@data-qa-marker='pay-now-btn']");

    /** Switch into the payment iframe, run [actions], then return to main content. */
    private void withinPaymentFrame(Runnable actions) {
        WebElement frameEl = genericMethod.findElement(paymentIframe);
        driver.switchTo().frame(frameEl);
        try {
            actions.run();
        } finally {
            driver.switchTo().defaultContent();   // always exit the frame
        }
    }

    public void enterCardDetails(String number, String expiry, String cvv) {
        withinPaymentFrame(() -> {
            wait.waitForVisibility(cardNumberInput);
            genericMethod.clearAndSendKeys(cardNumberInput, number);
            genericMethod.clearAndSendKeys(cardExpiryInput, expiry);
            genericMethod.clearAndSendKeys(cardCvvInput, cvv);
        });
    }

    public void clickPayNow() {
        withinPaymentFrame(() -> {
            wait.waitForClickability(payNowButton);
            genericMethod.click(payNowButton);
        });
    }

    // Assertion helpers inside frame
    public boolean isPayNowVisible() {
        driver.switchTo().frame(genericMethod.findElement(paymentIframe));
        boolean visible = genericMethod.isDisplayed(payNowButton);
        driver.switchTo().defaultContent();
        return visible;
    }
}
```

**iFrame anti-patterns**
```java
// NEVER leave the driver inside a frame after the method returns
driver.switchTo().frame(el);
genericMethod.click(payNowButton);
// missing switchTo().defaultContent() → every subsequent call breaks  ✗

// NEVER hardcode frame index — use element or name
driver.switchTo().frame(0);  ✗
driver.switchTo().frame(genericMethod.findElement(paymentIframe));  ✓

// NEVER use frame locators for elements on the parent page
// ALWAYS switch back to defaultContent() in a finally block
```

---

### Shadow DOM — MCP Discovery Flow

**Step 1 — Detect shadow hosts on the page**
```
MCP: playwright_evaluate
  expression: |
    Array.from(document.querySelectorAll('*'))
      .filter(el => el.shadowRoot)
      .map(el => ({ tag: el.tagName, id: el.id, dataQa: el.getAttribute('data-qa-marker') }))
```

**Step 2 — Scan qa-markers inside a shadow root**
```
MCP: playwright_evaluate
  expression: |
    Array.from(document.querySelector('headout-checkout-widget').shadowRoot
      .querySelectorAll('[data-qa-marker]'))
      .map(el => ({ tag: el.tagName, marker: el.getAttribute('data-qa-marker'), text: el.innerText?.trim().slice(0,60) }))
```

**Step 3 — Get HTML of the shadow root**
```
MCP: playwright_evaluate
  expression: document.querySelector('headout-checkout-widget').shadowRoot.innerHTML
```

**Step 4 — Nested shadow roots (shadow inside shadow)**
```
MCP: playwright_evaluate
  expression: |
    const outer = document.querySelector('outer-host').shadowRoot;
    const inner = outer.querySelector('inner-host').shadowRoot;
    [...inner.querySelectorAll('[data-qa-marker]')].map(e => e.getAttribute('data-qa-marker'))
```

**Step 5 — Interact with shadow element (Playwright pierces open shadow roots)**
```
MCP: playwright_click
  selector: "headout-checkout-widget >> [data-qa-marker='checkout-pay-btn']"
  ← Playwright's >> operator pierces shadow DOM automatically for OPEN roots
```

**Generated Java — Shadow DOM in Page Object**

Playwright WebDriver pierces **open** shadow roots automatically using `>>>` deep combinator.
Selenium needs explicit `JavascriptExecutor` for shadow root expansion.

```java
public class CheckoutWidgetPO extends BaseAutomation {

    // Shadow host element (on the main DOM)
    ByBuilder checkoutWidget = ByBuilder.cssSelector("headout-checkout-widget");

    // ── Playwright / CDP approach (deep combinator — pierces open shadow) ──
    // Use this when running via Playwright driver
    ByBuilder payButton      = ByBuilder.cssSelector("headout-checkout-widget >>> [data-qa-marker='checkout-pay-btn']");
    ByBuilder totalLabel     = ByBuilder.cssSelector("headout-checkout-widget >>> [data-qa-marker='checkout-total-label']");
    ByBuilder promoInput     = ByBuilder.cssSelector("headout-checkout-widget >>> [data-qa-marker='checkout-promo-input']");

    // ── Selenium / JS approach (manual shadow root expansion) ──────────────
    // Use this when running via Selenium WebDriver without CDP
    private WebElement shadowElement(String hostCss, String innerCss) {
        WebElement host = driver.findElement(By.cssSelector(hostCss));
        SearchContext shadow = (SearchContext) ((JavascriptExecutor) driver)
            .executeScript("return arguments[0].shadowRoot", host);
        return shadow.findElement(By.cssSelector(innerCss));
    }

    private WebElement shadowElement(WebElement host, String innerCss) {
        SearchContext shadow = (SearchContext) ((JavascriptExecutor) driver)
            .executeScript("return arguments[0].shadowRoot", host);
        return shadow.findElement(By.cssSelector(innerCss));
    }

    // ── Nested shadow roots ────────────────────────────────────────────────
    private WebElement nestedShadowElement(String outerHost, String innerHost, String targetCss) {
        WebElement outer = driver.findElement(By.cssSelector(outerHost));
        SearchContext outerShadow = (SearchContext) ((JavascriptExecutor) driver)
            .executeScript("return arguments[0].shadowRoot", outer);
        WebElement inner = outerShadow.findElement(By.cssSelector(innerHost));
        SearchContext innerShadow = (SearchContext) ((JavascriptExecutor) driver)
            .executeScript("return arguments[0].shadowRoot", inner);
        return innerShadow.findElement(By.cssSelector(targetCss));
    }

    // ── Actions ────────────────────────────────────────────────────────────

    /** Clicks Pay button inside the checkout shadow widget. */
    public void clickPay() {
        // Playwright path (preferred — automatic shadow piercing)
        wait.waitForClickability(payButton);
        genericMethod.click(payButton);
    }

    /** Fallback: click Pay via JS shadow traversal (Selenium without CDP). */
    public void clickPayViaShadow() {
        WebElement btn = shadowElement("headout-checkout-widget", "[data-qa-marker='checkout-pay-btn']");
        btn.click();
    }

    public void enterPromoCode(String code) {
        WebElement input = shadowElement("headout-checkout-widget", "[data-qa-marker='checkout-promo-input']");
        input.clear();
        input.sendKeys(code);
    }

    // ── Assertions ─────────────────────────────────────────────────────────

    public String getTotalText() {
        // Playwright deep combinator path
        wait.waitForVisibility(totalLabel);
        return genericMethod.getText(totalLabel);
    }

    public String getTotalTextViaShadow() {
        WebElement el = shadowElement("headout-checkout-widget", "[data-qa-marker='checkout-total-label']");
        return el.getText();
    }

    public boolean isPayButtonVisible() {
        return genericMethod.isDisplayed(payButton);
    }
}
```

**Shadow DOM anti-patterns**
```java
// NEVER use By.xpath() on a shadow element — XPath cannot cross shadow boundaries
By btn = By.xpath("//headout-checkout-widget//button");  ✗

// NEVER use ByBuilder.xpath() for shadow-internal elements
ByBuilder btn = ByBuilder.xpath("//headout-checkout-widget//button[@data-qa-marker='pay']");  ✗

// USE cssSelector with >>> (Playwright) or JS shadowRoot (Selenium)
ByBuilder btn = ByBuilder.cssSelector("headout-checkout-widget >>> [data-qa-marker='checkout-pay-btn']");  ✓

// NEVER assume shadow root is open — check first:
// playwright_evaluate("!!document.querySelector('host').shadowRoot")
// closed shadow roots (mode: 'closed') cannot be traversed from JS

// NEVER skip the host element locator — always confirm the host is found first
```

---

## Mode A — Context Mode (Default)

Use when HTML, description, ACs, or user story is provided — no MCP request.

Identify elements from context, apply `locator_strategy.md`, mark inferred locators:

```java
// [inferred — verify against live DOM or run MCP mode]
ByBuilder placeOrderButton = ByBuilder.xpath("//button[@data-qa-marker='checkout-place-order']");
```

Proceed directly to Phase 3 (Locator Discovery) → Phase 4 → Phase 5 → Phase 6.

---

## Mode B — MCP Live Mode (On-Demand Only)

### Phase 1 — Navigate and Capture

```
playwright_navigate(url)
playwright_screenshot()    ← always take a screenshot first
```

Identify what's on the page. Then select tools from the catalog above based
on what you see — overlays, forms, dropdowns, tabs, etc.

### Phase 2 — Interact to Reach Target State

Assemble the correct tool chain for the scenario. Examples:

**Overlay on load:**
```
playwright_click("[data-qa-marker='cookie-banner-accept-btn']")
playwright_screenshot()
```

**Login-gated page:**
```
playwright_fill("[data-qa-marker='login-email-input']", "qa@headout.com")
playwright_fill("[data-qa-marker='login-password-input']", "<test-password>")
playwright_click("[data-qa-marker='login-submit-btn']")
playwright_wait_for_selector("[data-qa-marker='dashboard-header']")
playwright_navigate("<target-url>")
playwright_screenshot()
```

**Tab panel — inspect content behind a tab:**
```
playwright_click("[data-qa-marker='bookings-tab-active']")
playwright_wait_for_selector("[data-qa-marker='bookings-list-container']")
playwright_screenshot()
playwright_get_visible_html("[data-qa-marker='bookings-list-container']")
```

**Hover tooltip — capture locator of tooltip element:**
```
playwright_hover("[data-qa-marker='info-icon-price']")
playwright_wait_for_selector("[data-qa-marker='price-tooltip']")
playwright_screenshot()
playwright_get_visible_html("[data-qa-marker='price-tooltip']")
```

**Custom dropdown (not `<select>`):**
```
playwright_click("[data-qa-marker='currency-dropdown-trigger']")
playwright_wait_for_selector("[data-qa-marker='currency-dropdown-menu']")
playwright_screenshot()
playwright_get_visible_html("[data-qa-marker='currency-dropdown-menu']")
playwright_click("[data-qa-marker='currency-option-USD']")
playwright_screenshot()
```

**Keyboard navigation (Tab through form):**
```
playwright_click("[data-qa-marker='form-first-input']")
playwright_press_key("[data-qa-marker='form-first-input']", "Tab")
playwright_screenshot()    ← capture focused state of next field
playwright_press_key("body", "Tab")
playwright_screenshot()
```

**Drag-and-drop sortable list:**
```
playwright_drag("[data-qa-marker='schedule-item-3']", "[data-qa-marker='schedule-item-1']")
playwright_screenshot()
playwright_get_visible_html("[data-qa-marker='schedule-list']")
```

**Multi-tab flow:**
```
playwright_click("[data-qa-marker='open-in-new-tab-link']")
playwright_switch_tab(1)
playwright_screenshot()
playwright_get_visible_html("body")
playwright_close()
playwright_switch_tab(0)    ← back to original tab
```

**Infinite scroll / lazy load:**
```
playwright_evaluate("window.scrollTo(0, document.body.scrollHeight)")
playwright_wait_for_selector("[data-qa-marker='lazy-loaded-item']")
playwright_screenshot()
```

**File upload:**
```
playwright_click("[data-qa-marker='upload-trigger-btn']")
playwright_upload_file("[data-qa-marker='file-input']", "/tmp/test-image.jpg")
playwright_wait_for_selector("[data-qa-marker='upload-success-msg']")
playwright_screenshot()
```

**Date picker:**
```
playwright_click("[data-qa-marker='date-picker-input']")
playwright_wait_for_selector("[data-qa-marker='calendar-container']")
playwright_screenshot()
playwright_click("[data-qa-marker='calendar-date-label-2025-06-15']")
playwright_screenshot()
```

**Checkbox group:**
```
playwright_check("[data-qa-marker='filter-checkbox-free-cancellation']")
playwright_screenshot()
playwright_uncheck("[data-qa-marker='filter-checkbox-free-cancellation']")
playwright_screenshot()
```

**Page reload state:**
```
playwright_reload()
playwright_wait_for_selector("[data-qa-marker='page-header']")
playwright_screenshot()
```

### Phase 2b — Extract HTML

After reaching target state, extract HTML for locator analysis:

```
playwright_get_visible_html("<component-root-selector or body>")

playwright_evaluate("""
  Array.from(document.querySelectorAll('[data-qa-marker]'))
    .map(el => ({
      tag: el.tagName,
      marker: el.getAttribute('data-qa-marker'),
      text: el.innerText?.trim().slice(0, 80),
      visible: el.offsetParent !== null
    }))
""")
```

---

## Phase 3 — Locator Discovery (Both Modes)

Apply `qa/common/agent/locator_strategy.md` tier rules to every element.

### Element Classification Table

| Element | Tag | Tier | Attribute | ByBuilder Method | Dynamic? | Field Name |
|---------|-----|------|-----------|-----------------|----------|------------|
| Place Order btn | `button` | 1 | `data-qa-marker="checkout-place-order"` | `xpath` | No | `placeOrderButton` |
| Total price | `span` | 1 | `data-qa-marker="checkout-total-price"` | `xpath` | No | `totalPriceLabel` |
| Promo input | `input` | 1 | `data-qa-marker="checkout-promo-input"` | `xpath` | No | `promoInput` |
| Status tab | `div` | 1 | `data-qa-marker="status-tab-${id}"` | `xpath` | Yes | `statusTab` |

### Tier Priority

```
Tier 1: data-qa-marker          ← always prefer
Tier 2: aria-label
Tier 3: data-testid / data-cy
Tier 4: stable id (non-generated)
Tier 5: semantic CSS (meta, link, h1)
Tier 6: name on inputs
Tier 7: data-framer-name
Tier 8: attribute combo + xpathWithDescription()
```

---

## Phase 4 — Generate ByBuilder Locators

```java
// Static
ByBuilder <fieldName> = ByBuilder.xpath("//tag[@data-qa-marker='value']");

// Parameterized
ByBuilder <listField> = ByBuilder.xpath("//div[@data-qa-marker='prefix-${id}']");
public void click<Name>(String value) {
    genericMethod.click(genericMethod.parameterizedLocator(<listField>, value));
}

// Tier 8
ByBuilder <fieldName> = ByBuilder.xpathWithDescription(
    "//button[@type='submit' and @data-form='checkout']",
    "Primary checkout submit — no stable qa-marker"
);
```

---

## Phase 5 — Generate Page Object

```java
// src/test/java/com/headout/pageobjects/<domain>/<Page>PO.java

package com.headout.pageobjects.<domain>;

import com.headout.base.fe.BaseAutomation;
import com.headout.locator.ByBuilder;

/**
 * Page Object for <PageName>.
 * Source: <url>  [Context Mode | MCP Live — <date>]
 * Covers: <list of user journeys>
 */
public class <Page>PO extends BaseAutomation {

    // ── Locators ───────────────────────────────────────────────────────────
    ByBuilder <field1>    = ByBuilder.xpath("//...");
    ByBuilder <field2>    = ByBuilder.xpath("//...");
    ByBuilder <listField> = ByBuilder.xpath("//div[@data-qa-marker='<prefix>-${id}']");

    // ── Actions ────────────────────────────────────────────────────────────

    public void waitForPageReady() {
        wait.waitForVisibility(<primaryElement>);
    }

    public void enter<FieldName>(String value) {
        genericMethod.clearAndSendKeys(<fieldLocator>, value);
    }

    public void click<ActionName>() {
        wait.waitForClickability(<buttonLocator>);
        genericMethod.click(<buttonLocator>);
    }

    public void click<ListName>(String key) {
        genericMethod.click(genericMethod.parameterizedLocator(<listField>, key));
    }

    // ── Assertion helpers ──────────────────────────────────────────────────

    public String get<Field>Text() {
        wait.waitForVisibility(<labelLocator>);
        return genericMethod.getText(<labelLocator>);
    }

    public boolean is<Element>Displayed() {
        return genericMethod.isDisplayed(<elementLocator>);
    }

    public String get<Element>Attribute(String attrName) {
        return genericMethod.getAttribute(<elementLocator>, attrName);
    }
}
```

---

## Phase 6 — Generate StepDef with Assertion Builder

```java
// src/test/java/com/headout/stepdefinitions/<domain>/<Feature>StepDef.java

package com.headout.stepdefinitions.<domain>;

import com.headout.pageobjects.<domain>.<Page>PO;
import io.cucumber.java.en.*;
import org.assertj.core.api.SoftAssertions;
import static org.assertj.core.api.Assertions.assertThat;

public class <Feature>StepDef {

    private final <Page>PO page = new <Page>PO();

    @Given("user is on the <page name> page")
    public void userIsOnPage() { page.waitForPageReady(); }

    @When("user enters {string} in the <field> field")
    public void userEntersInField(String value) { page.enter<FieldName>(value); }

    @When("user clicks the <button> button")
    public void userClicksButton() { page.click<ActionName>(); }

    @When("user selects the {string} <list item>")
    public void userSelectsListItem(String key) { page.click<ListName>(key); }

    // ── Single assertions ──────────────────────────────────────────────────

    @Then("the <label> should display {string}")
    public void labelShouldDisplay(String expected) {
        assertThat(page.get<Field>Text())
            .as("Expected <label> to show '%s'", expected)
            .isEqualTo(expected);
    }

    @Then("the <element> should be visible")
    public void elementShouldBeVisible() {
        assertThat(page.is<Element>Displayed()).as("<element> should be visible").isTrue();
    }

    @Then("the <element> should not be visible")
    public void elementShouldNotBeVisible() {
        assertThat(page.is<Element>Displayed()).as("<element> should be hidden").isFalse();
    }

    // ── Soft assertion block — multi-field checks ──────────────────────────

    @Then("the <section> should show correct details:")
    public void sectionShouldShowCorrectDetails(io.cucumber.datatable.DataTable table) {
        var expected = table.asMap(String.class, String.class);
        SoftAssertions softly = new SoftAssertions();

        if (expected.containsKey("<field1>"))
            softly.assertThat(page.get<Field1>Text()).as("<field1>").isEqualTo(expected.get("<field1>"));
        if (expected.containsKey("<field2>"))
            softly.assertThat(page.get<Field2>Text()).as("<field2>").isEqualTo(expected.get("<field2>"));
        if (expected.containsKey("<field3>"))
            softly.assertThat(page.is<Field3>Displayed()).as("<field3> visible").isTrue();

        softly.assertAll();
    }
}
```

### Assertion Builder Patterns

```java
assertThat(page.getLabelText()).isEqualTo("expected");
assertThat(page.getLabelText()).contains("partial");
assertThat(page.isElementDisplayed()).isTrue();
assertThat(page.isElementDisplayed()).isFalse();
assertThat(page.getElementAttribute("href")).endsWith("/checkout");
assertThat(page.getLabelText()).isNotBlank();
assertThat(Integer.parseInt(page.getCountText())).isGreaterThan(0);

SoftAssertions softly = new SoftAssertions();
softly.assertThat(...).isEqualTo(...);
softly.assertThat(...).isTrue();
softly.assertAll();
```

---

## Phase 7 — Generate Feature File

```gherkin
@<domain> @<feature-tag>
Feature: <Feature Title>
  # Source: <url>  [Context Mode | MCP Live — <date>]

  Background:
    Given user is on the <page name> page

  @test
  Scenario: <Happy path>
    When user <action>
    Then the <element> should <assertion>

  @test
  Scenario Outline: <Parameterized>
    When user selects the "<key>" <item>
    Then the <section> should show correct details:
      | <field1> | <value1> |
      | <field2> | <value2> |
    Examples:
      | key       |
      | <value-a> |
      | <value-b> |

  @test
  Scenario: <Error/edge case>
    When user <invalid action>
    Then the <error element> should be visible
    And the <error element> should display "<error message>"

  @manual
  Scenario: <perception / animation>
    # Manual: verify <behaviour>

  @pending
  Scenario: <blocked>
    # Pending: <reason>
```

---

## Phase 8 — MCP Validation Pass (On-Demand Only)

Triggered by "verify locators against live DOM". For each generated locator:

```
playwright_evaluate(
  "document.querySelectorAll('[data-qa-marker=\"<value>\"]').length"
)
```

- `> 0` → confirmed ✓
- `0`   → `@pending` + escalate to dev

In Context Mode skip this phase — add:
```java
// [unverified — run MCP validation or check manually]
```

---

## Anti-Patterns

```
NEVER auto-run MCP tools without an explicit QA request
NEVER follow a fixed tool sequence — choose tools based on the scenario
NEVER use playwright_wait_for_timeout as a first resort — prefer wait_for_selector
NEVER run all tools just because they exist — only run what the scenario needs
NEVER hardcode URLs in StepDef — use PropertyUtils.get(ConfigMap.BASE_URL)
NEVER use Thread.sleep() — use wait.waitForVisibility() / waitForClickability()
NEVER use By.* — always ByBuilder.*
NEVER write a @Then step without an assertThat() / softly.assertThat() call
```
