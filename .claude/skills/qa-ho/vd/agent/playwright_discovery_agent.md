---
name: Playwright Discovery Agent (VD)
description: >
  Generates all VD config files (action JSON, version JSON, upload-snapshot JSON)
  and assertion-based StepDef from either provided context (default) or a live page
  inspected via Playwright MCP (on-demand). MCP execution is OFF by default; QA
  must explicitly request it. Supports the full Playwright MCP tool surface with
  runtime scenario routing.
version: 1.2.0
repos: [pixify]
dependsOn:
  - qa/common/agent/locator_strategy.md
  - qa/common/agent/_PRAETORIAN_CONSTITUTION.md
  - qa/vd/agent/locator_generate_agent.md
  - qa/vd/skill/SKILL.md
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
  - playwright_fill
  - playwright_select_option
  - playwright_hover
  - playwright_press_key
  - playwright_check
  - playwright_uncheck
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

# Playwright Discovery Agent — VD (pixify)

Generates VD config files and assertion-based tests from a URL + pod context.
Playwright MCP browser execution is **off by default** — enabled only when QA
explicitly requests it. At runtime, the correct tool(s) are selected based on
what the page requires — there is no fixed sequence.

---

## MCP Mode Decision — Read This First

```
┌─────────────────────────────────────────────────────────────────┐
│  Has the QA explicitly asked to run / inspect / browse / scan?  │
│                                                                 │
│  NO  → Context Mode (default) ─────────────────────────────►   │
│         Generate VD configs from URL + pod + overlay hints.     │
│         Locators marked [inferred]. No MCP calls.               │
│                                                                 │
│  YES → MCP Live Mode (on-demand) ──────────────────────────►   │
│         Select tools from catalog — runtime decision per page.  │
└─────────────────────────────────────────────────────────────────┘
```

### MCP trigger phrases

| Phrase | Mode |
|--------|------|
| "run playwright on …" | Full MCP live inspection |
| "inspect the live page" | Full MCP live inspection |
| "browse to … and check overlays" | Full MCP live inspection |
| "scan for overlays at …" | Full MCP live inspection |
| "verify action sequence against live" | Validation pass only (Phase 7) |
| "use MCP for …" | Full MCP live inspection |

---

## MCP Tool Catalog

All available Playwright MCP tools for VD workflows. Select the right tool(s)
for the current page scenario — do not run tools that are not needed.

### Navigation Tools

| Tool | VD use case |
|------|-------------|
| `playwright_navigate(url)` | Open the target page for overlay detection |
| `playwright_go_back()` | Return to previous page after tab/redirect |
| `playwright_go_forward()` | Re-navigate after back |
| `playwright_reload()` | Trigger session-triggered overlays (cookie banner re-appears on reload) |

### Inspection Tools

| Tool | VD use case |
|------|-------------|
| `playwright_screenshot()` | Visual snapshot — always take before and after every action |
| `playwright_get_visible_html(selector?)` | Extract HTML to discover overlay dismiss locators |
| `playwright_get_visible_text(selector?)` | Read text content — faster when only text is needed |
| `playwright_evaluate(expression)` | Check visibility, scroll, detect overlays, compute bounding box, scan qa-markers |

### Interaction Tools (Pre-Capture Action Generation)

Each tool maps directly to an action type in `visual-diff-action.json`:

| Tool | `action` type in JSON | VD use case |
|------|-----------------------|-------------|
| `playwright_click(selector)` | `CLICK` | Dismiss banners, select tabs, expand sections |
| `playwright_double_click(selector)` | `DOUBLE_CLICK` | Triggers that only respond to double-click |
| `playwright_fill(selector, value)` | `FILL` | Search inputs, city/date fields before capture |
| `playwright_select_option(selector, value)` | `SELECT` | Currency selector, language dropdown, date pickers using `<select>` |
| `playwright_hover(selector)` | `HOVER` | Reveal hover-only states before capture (e.g. card hover state) |
| `playwright_press_key(selector, key)` | `PRESS_KEY` | Escape to close modal, End to scroll bottom, Arrow keys |
| `playwright_check(selector)` | `CHECK` | Enable filter / toggle before capture |
| `playwright_uncheck(selector)` | `UNCHECK` | Disable filter / toggle before capture |

### Wait Tools

| Tool | `action` type in JSON | VD use case |
|------|-----------------------|-------------|
| `playwright_wait_for_selector(selector, state?)` | `WAIT_FOR_ELEMENT` | Wait for overlay gone, content loaded, lazy images |
| `playwright_wait_for_timeout(ms)` | `WAIT_MS` | CSS animations, skeleton-to-content transitions |

### Multi-Tab Tools

| Tool | VD use case |
|------|-------------|
| `playwright_new_tab()` | Open page in fresh tab (clean cookie state) |
| `playwright_switch_tab(index)` | Switch focus for capture |
| `playwright_close()` | Close tab after capture |

### iFrame Tools (VD)

| Tool | VD use case |
|------|-------------|
| `playwright_frame_locator(frameSelector)` | Dismiss overlays or interact with elements inside an embedded iframe |
| `playwright_frame_evaluate(frameSelector, expression)` | Check state / dismiss consent inside iframe-hosted widget |
| `playwright_frame_get_visible_html(frameSelector, sel?)` | Inspect locators of iframe content before writing action JSON |

### Shadow DOM Tools (VD)

Shadow DOM elements may host overlays or content sections. Use `playwright_evaluate`
to detect, scan, and interact via JS before capture.

| Approach | Expression |
|----------|-----------|
| Detect shadow host | `!!document.querySelector('host-tag').shadowRoot` |
| Dismiss shadow overlay | `document.querySelector('host').shadowRoot.querySelector('[data-qa-marker="dismiss-btn"]').click()` |
| Scroll shadow section into view | `document.querySelector('host').shadowRoot.querySelector('[data-qa-marker="section"]').scrollIntoView()` |
| Scan qa-markers in shadow | `[...document.querySelector('host').shadowRoot.querySelectorAll('[data-qa-marker]')].map(e=>e.getAttribute('data-qa-marker'))` |

---

## Runtime Scenario Routing (VD Pre-Capture)

At runtime, inspect the page state after `playwright_screenshot()` and select
tools to build the correct pre-capture action sequence.

### VD Scenario → Tool Chain Mapping

| Page scenario | Tool chain | JSON action types |
|---------------|-----------|-------------------|
| Cookie/GDPR banner | `click(accept)` → `screenshot` | `CLICK` |
| Newsletter popup | `click(dismiss)` → `screenshot` | `CLICK` |
| Chat widget visible | `click(close)` → `screenshot` | `CLICK` |
| App download strip | `click(dismiss)` → `screenshot` | `CLICK` |
| Seasonal promo bar | `click(close)` → `screenshot` | `CLICK` |
| Login-gated page | `fill(email)` → `fill(pass)` → `click(submit)` → `wait_for_selector(content)` → `navigate(target)` | `FILL`, `CLICK`, `WAIT_FOR_ELEMENT` |
| Currency change | `select_option(currencySelect, "USD")` → `wait_for_selector(priceLabel)` → `screenshot` | `SELECT`, `WAIT_FOR_ELEMENT` |
| Custom currency dropdown | `click(trigger)` → `wait_for_selector(menu)` → `click(USD option)` → `screenshot` | `CLICK`, `WAIT_FOR_ELEMENT` |
| Tab panel (inspect specific tab) | `click(tab)` → `wait_for_selector(panelContent)` → `screenshot` | `CLICK`, `WAIT_FOR_ELEMENT` |
| Scroll to target section | `evaluate(scrollIntoView)` → `screenshot` | `EXECUTE_SCRIPT` |
| Scroll to bottom | `press_key(body, End)` → `wait_for_selector(lastItem)` → `screenshot` | `PRESS_KEY`, `WAIT_FOR_ELEMENT` |
| Hover card state capture | `hover(card)` → `screenshot` | `HOVER` |
| Filter checkbox toggle | `check(filter)` → `wait_for_selector(results)` → `screenshot` | `CHECK`, `WAIT_FOR_ELEMENT` |
| Accordion expand | `click(accordion)` → `wait_for_selector(content)` → `screenshot` | `CLICK`, `WAIT_FOR_ELEMENT` |
| Language change | `select_option(langSelect, "en")` → `wait_for_selector(landmark)` → `screenshot` | `SELECT`, `WAIT_FOR_ELEMENT` |
| Page reload banner | `reload` → `wait_for_selector(banner)` → `click(dismiss)` → `screenshot` | `CLICK`, `WAIT_FOR_ELEMENT` |
| Date picker pre-set | `click(dateInput)` → `wait_for_selector(calendar)` → `click(date)` → `screenshot` | `CLICK`, `WAIT_FOR_ELEMENT` |
| Animation wait | `wait_for_timeout(800)` → `screenshot` | `WAIT_MS` |
| Lazy images load | `evaluate(scroll)` → `wait_for_selector(images)` → `screenshot` | `EXECUTE_SCRIPT`, `WAIT_FOR_ELEMENT` |
| Fresh-tab clean state | `new_tab` → `navigate(url)` → `screenshot` | — |
| **iFrame overlay dismiss** | `frame_evaluate(frame, "dismiss expression")` → `screenshot` | `EXECUTE_SCRIPT` |
| **iFrame consent inside widget** | `frame_locator(frame)` → `click(dismissInFrame)` → `screenshot` | `CLICK` |
| **iFrame content inspection** | `frame_get_visible_html(frame)` → `frame_evaluate(frame, qa-scan)` | — |
| **Shadow overlay dismiss** | `evaluate("host.shadowRoot.querySelector('btn').click()")` → `screenshot` | `EXECUTE_SCRIPT` |
| **Shadow section scroll** | `evaluate("host.shadowRoot.querySelector('section').scrollIntoView()")` → `screenshot` | `EXECUTE_SCRIPT` |

### Runtime Decision Tree (MCP Live Mode)

```
START → playwright_navigate(url) → playwright_screenshot()
  │
  ├─ Banner / modal / overlay visible?
  │    YES → playwright_click(dismissSelector)
  │           playwright_screenshot()     ← verify gone
  │           → repeat for each overlay
  │
  ├─ Need to select currency / language?
  │    native <select>  → playwright_select_option(selector, value)
  │    custom dropdown  → playwright_click(trigger)
  │                        playwright_wait_for_selector(menu)
  │                        playwright_click(option)
  │    → playwright_screenshot()
  │
  ├─ Need to select a tab or filter?
  │    → playwright_click(tab/filter)
  │       playwright_wait_for_selector(content)
  │       playwright_screenshot()
  │
  ├─ Need to scroll to target section?
  │    → playwright_evaluate("document.querySelector('[...]').scrollIntoView({block:'center'})")
  │       playwright_screenshot()
  │    OR playwright_press_key("body", "End")
  │       playwright_wait_for_selector(lastElement)
  │
  ├─ Need to expand an accordion?
  │    → playwright_click(accordionTrigger)
  │       playwright_wait_for_selector(accordionContent)
  │       playwright_screenshot()
  │
  ├─ Need to fill a search / city input?
  │    → playwright_fill(input, value)
  │       playwright_press_key(input, "Enter")
  │       playwright_wait_for_selector(results)
  │       playwright_screenshot()
  │
  ├─ Need to capture a hover state?
  │    → playwright_hover(element)
  │       playwright_screenshot()
  │
  ├─ Need to toggle a checkbox/filter?
  │    → playwright_check(selector) / playwright_uncheck(selector)
  │       playwright_wait_for_selector(updatedContent)
  │       playwright_screenshot()
  │
  ├─ Need to wait for animation?
  │    → playwright_wait_for_timeout(ms)   ← last resort
  │       playwright_screenshot()
  │
  ├─ Need to wait for lazy images?
  │    → playwright_evaluate("window.scrollTo(0, document.body.scrollHeight)")
  │       playwright_wait_for_selector("img[loading='lazy'][src]")
  │       playwright_screenshot()
  │
  ├─ Page reloads the overlay?
  │    → playwright_reload()
  │       playwright_wait_for_selector(banner)
  │       playwright_click(dismiss)
  │       playwright_screenshot()
  │
  ├─ Need clean-state tab?
  │    → playwright_new_tab()
  │       playwright_navigate(url)
  │       playwright_screenshot()
  │
  ├─ Overlay / consent is INSIDE an iFrame?
  │    → detect:
  │        playwright_evaluate("Array.from(document.querySelectorAll('iframe')).map(f=>({src:f.src,dataQa:f.getAttribute('data-qa-marker')}))")
  │    → inspect frame content:
  │        playwright_frame_get_visible_html(frameSelector)
  │        playwright_frame_evaluate(frameSelector, "qa-marker scan")
  │    → dismiss inside frame:
  │        playwright_frame_locator(frameSelector)
  │        playwright_click("[data-qa-marker='consent-accept-btn']")
  │        playwright_screenshot()
  │    → action JSON: { "action": "EXECUTE_SCRIPT", "script": "frame.contentDocument.querySelector(...).click()" }
  │
  └─ Overlay / section is in a SHADOW ROOT?
       → detect:
           playwright_evaluate("!!document.querySelector('host-tag').shadowRoot")
       → scan:
           playwright_evaluate("[...document.querySelector('host').shadowRoot.querySelectorAll('[data-qa-marker]')].map(e=>e.getAttribute('data-qa-marker'))")
       → dismiss shadow overlay:
           playwright_evaluate("document.querySelector('host').shadowRoot.querySelector('[data-qa-marker=\"overlay-close-btn\"]').click()")
           playwright_screenshot()
       → scroll shadow section into viewport:
           playwright_evaluate("document.querySelector('host').shadowRoot.querySelector('[data-qa-marker=\"target-section\"]').scrollIntoView({block:'center'})")
       → action JSON: { "action": "EXECUTE_SCRIPT", "script": "..." }
```

### iFrame & Shadow DOM → `visual-diff-action.json` entries

Both map to `EXECUTE_SCRIPT` since they require JS context switching:

```json
[
  {
    "action": "EXECUTE_SCRIPT",
    "script": "document.querySelector('iframe[data-qa-marker=\"consent-frame\"]').contentDocument.querySelector('[data-qa-marker=\"accept-btn\"]').click()",
    "description": "Dismiss consent overlay inside embedded iframe"
  },
  {
    "action": "EXECUTE_SCRIPT",
    "script": "document.querySelector('headout-widget').shadowRoot.querySelector('[data-qa-marker=\"promo-close-btn\"]').click()",
    "description": "Dismiss shadow DOM promo overlay before VD capture"
  },
  {
    "action": "EXECUTE_SCRIPT",
    "script": "document.querySelector('headout-widget').shadowRoot.querySelector('[data-qa-marker=\"hero-section\"]').scrollIntoView({block:'center'})",
    "description": "Scroll shadow-hosted hero into viewport for ELEMENT capture"
  },
  {
    "action": "WAIT_FOR_ELEMENT",
    "locator": "[data-qa-marker='main-content']",
    "locatorType": "CSS",
    "description": "Wait for main content stable after iframe/shadow action"
  }
]
```

Every tool call that dismisses an overlay or sets page state becomes an entry
in `visual-diff-action.json`. Record the action type and locator as you go.

---

## Mode A — Context Mode (Default)

Generate VD configs from URL + pod + any overlay hints in the request.
Mark all inferred action locators clearly.

```json
// [inferred — run MCP mode or verify manually before CI]
{ "action": "CLICK", "locator": "[data-qa-marker='cookie-banner-accept-btn']", ... }
```

Proceed to Phase 3 using inferred context.

---

## Mode B — MCP Live Mode (On-Demand Only)

### Phase 1 — Navigate and Detect

```
playwright_navigate(url)
playwright_screenshot()    ← always first
```

Use the Runtime Decision Tree above to select and run the right tools.
Every interaction feeds into `visual-diff-action.json`.

### Phase 2 — Confirm Clean State

```
playwright_screenshot()    ← final state before capture
```

Confirm:
- No overlays remain
- Target section is in viewport
- No loading spinners / skeleton screens

---

## Phase 3 — Generate VD Config Files (Both Modes)

### 3.1 — `visual-diff-action.json`

Map each MCP tool call to its JSON action type:

| MCP tool used | `action` value |
|---------------|---------------|
| `playwright_click` | `CLICK` |
| `playwright_double_click` | `DOUBLE_CLICK` |
| `playwright_fill` | `FILL` |
| `playwright_select_option` | `SELECT` |
| `playwright_hover` | `HOVER` |
| `playwright_press_key` | `PRESS_KEY` |
| `playwright_check` | `CHECK` |
| `playwright_uncheck` | `UNCHECK` |
| `playwright_wait_for_selector` | `WAIT_FOR_ELEMENT` |
| `playwright_wait_for_timeout` | `WAIT_MS` |
| `playwright_evaluate` | `EXECUTE_SCRIPT` |

```json
// src/test/resources/vd/<podName>/visual-diff-action.json
// [inferred] markers present in Context Mode
[
  {
    "url": "<target-url>",
    "pageName": "<page-identifier>",
    "actions": [
      {
        "action": "CLICK",
        "locator": "[data-qa-marker='cookie-banner-accept-btn']",
        "locatorType": "CSS",
        "description": "Dismiss GDPR cookie banner"
      },
      {
        "action": "WAIT_FOR_ELEMENT",
        "locator": "[data-qa-marker='hero-section']",
        "locatorType": "CSS",
        "description": "Wait for hero section visibility"
      },
      {
        "action": "SELECT",
        "locator": "[data-qa-marker='currency-select']",
        "locatorType": "CSS",
        "value": "USD",
        "description": "Set currency to USD before capture"
      },
      {
        "action": "EXECUTE_SCRIPT",
        "script": "document.querySelector('[data-qa-marker=\"target-section\"]').scrollIntoView({block:'center'})",
        "description": "Scroll target section into viewport"
      },
      {
        "action": "WAIT_MS",
        "ms": 800,
        "description": "Wait for scroll animation to settle"
      }
    ]
  }
]
```

### 3.2 — `visual-diff-version-1.json`

```json
// src/test/resources/vd/<podName>/visual-diff-version-1.json
[
  {
    "pageName": "<page-identifier>",
    "baselineUrl": "s3://<bucket>/vd/<podName>/<page-identifier>/<browser>/baseline.png",
    "captureElement": "FULL_PAGE",
    "threshold": 2.0
  },
  {
    "pageName": "<page-identifier>-mobile",
    "baselineUrl": "s3://<bucket>/vd/<podName>/<page-identifier>-mobile/<browser>/baseline.png",
    "captureElement": "VIEWPORT",
    "threshold": 2.0
  },
  {
    "pageName": "<page-identifier>-hero",
    "baselineUrl": "s3://<bucket>/vd/<podName>/<page-identifier>-hero/<browser>/baseline.png",
    "captureElement": "ELEMENT",
    "elementLocator": "[data-qa-marker='hero-section']",
    "threshold": 1.5
  }
]
```

**CaptureElement modes:**

| Mode | When to use |
|------|-------------|
| `FULL_PAGE` | Entire scrollable page |
| `VIEWPORT` | Above-fold visible area only |
| `ELEMENT` | Single component — add `elementLocator` |

### 3.3 — `upload-snapshot-{browser}-on-s3.json`

```json
// src/test/resources/vd/<podName>/upload-snapshot-chrome-on-s3.json
[
  {
    "pageName": "<page-identifier>",
    "snapshotPath": "target/screenshots/vd/<podName>/<page-identifier>/chrome/actual.png",
    "s3Key": "vd/<podName>/<page-identifier>/chrome/baseline.png"
  }
]
```

---

## Phase 4 — Generate ByBuilder Locators for Action Steps

```java
// [inferred] in Context Mode — confirmed in MCP Live Mode

ByBuilder cookieBannerAcceptBtn = ByBuilder.xpath(
    "//button[@data-qa-marker='cookie-banner-accept-btn']"
);
ByBuilder heroSection = ByBuilder.xpath(
    "//*[@data-qa-marker='hero-section']"
);
ByBuilder currencySelect = ByBuilder.xpath(
    "//*[@data-qa-marker='currency-select']"
);
```

---

## Phase 5 — Generate Assertion-Based VD StepDef

```java
// src/test/java/com/headout/visualdiff/<pod>/VisualDiff<Pod>StepDef.java

package com.headout.visualdiff.<pod>;

import com.headout.utility.visual.VisualDiffUtility;
import io.cucumber.java.en.*;
import org.assertj.core.api.SoftAssertions;
import static org.assertj.core.api.Assertions.assertThat;

public class VisualDiff<Pod>StepDef {

    private final VisualDiffUtility vd = new VisualDiffUtility();

    @Given("visual diff is configured for pod {string} page {string}")
    public void visualDiffConfigured(String pod, String pageName) {
        vd.loadConfig(pod, pageName);
    }

    @When("pre-capture actions are executed for {string}")
    public void preCaptureActionsExecuted(String pageName) {
        vd.runPreCaptureActions(pageName);
    }

    @When("a screenshot is captured for {string}")
    public void screenshotCaptured(String pageName) {
        vd.captureScreenshot(pageName);
    }

    @Then("the captured screenshot for {string} should match the baseline")
    public void screenshotShouldMatch(String pageName) {
        double diffPercent = vd.compareWithBaseline();
        SoftAssertions softly = new SoftAssertions();
        softly.assertThat(diffPercent)
              .as("Visual diff for '%s' — pixel mismatch exceeds tolerance", pageName)
              .isLessThanOrEqualTo(2.0);
        softly.assertThat(vd.getActualImagePath())
              .as("Actual screenshot file must exist")
              .isNotBlank();
        softly.assertAll();
    }

    @Then("the captured screenshot should match the S3 baseline within {double} percent")
    public void screenshotShouldMatchWithinThreshold(double threshold) {
        assertThat(vd.compareWithBaseline())
            .as("Pixel diff within %.1f%% of S3 baseline", threshold)
            .isLessThanOrEqualTo(threshold);
    }
}
```

---

## Phase 6 — Generate Feature File

```gherkin
@vd @<pod>
Feature: Visual regression — <pod> pod
  # Source: <url>  [Context Mode | MCP Live — <date>]
  # Pod: <podName>

  @visual-diff
  Scenario Outline: <pageName> screenshot matches S3 baseline
    Given visual diff is configured for pod "<podName>" page "<pageName>"
    When pre-capture actions are executed for "<pageName>"
    And a screenshot is captured for "<pageName>"
    Then the captured screenshot for "<pageName>" should match the baseline

    Examples:
      | pageName                 |
      | <page-identifier>        |
      | <page-identifier>-mobile |
      | <page-identifier>-hero   |

  @manual
  Scenario: <pageName> renders correctly on Safari
    # Manual: automated VD does not cover Safari

  @pending
  Scenario: <pageName> dark mode baseline
    # Pending: dark mode baseline not yet captured in S3
```

---

## Phase 7 — MCP Validation Pass (On-Demand Only)

Triggered by "verify action sequence against live". Replay the full action chain
from `visual-diff-action.json` in the browser:

```
playwright_navigate(url)
→ for each action in visual-diff-action.json:
    CLICK         → playwright_click(locator)
    FILL          → playwright_fill(locator, value)
    SELECT        → playwright_select_option(locator, value)
    HOVER         → playwright_hover(locator)
    PRESS_KEY     → playwright_press_key(selector, key)
    CHECK         → playwright_check(locator)
    UNCHECK       → playwright_uncheck(locator)
    WAIT_FOR_ELEMENT → playwright_wait_for_selector(locator)
    WAIT_MS       → playwright_wait_for_timeout(ms)
    EXECUTE_SCRIPT → playwright_evaluate(script)
playwright_screenshot()    ← final clean state
```

Confirm: no overlays remain, target in viewport, no spinners.

In Context Mode skip this phase — add to action JSON:
```json
// [validation pending — run MCP validation pass or verify manually]
```

---

## Anti-Patterns

```
NEVER auto-run MCP tools without an explicit QA request
NEVER follow a fixed tool sequence — choose tools based on what the page needs
NEVER use playwright_wait_for_timeout as a first resort — prefer wait_for_selector
NEVER run tools that are not needed for the current scenario
NEVER omit [inferred] comments on unverified locators in Context Mode
NEVER capture screenshot before all overlays are dismissed
NEVER hardcode S3 bucket names — use ConfigMap.VD_S3_BUCKET
NEVER use FULL_PAGE when only a component changes — use ELEMENT mode
NEVER set threshold > 5.0 — investigate the diff rather than raising tolerance
NEVER write a @Then step without a diffPercent assertThat() call
```
