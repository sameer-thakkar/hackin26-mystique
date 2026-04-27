---
name: vd_automation
description: "Pixel-comparison visual regression skill for headout/pixify — pixify engine (com.headout.common.visual.*), 3 JSON config files per pod (action/version/upload-snapshot), CaptureElement modes, S3 baselines."
version: 1.0.0
layer: vd
repo: pixify
---

# Visual Diff (VD) Automation Skill

Visual Diff tests pixel-compare a live page screenshot against an S3 baseline.
The engine lives in `com.headout.common.visual.*` (unified-qa-framework).
The test infrastructure lives in the **pixify** repo (not celium).

---

## Architecture Overview

```
celium test
  └── VisualStepDef.java           ← Cucumber step definitions
        └── VisualDiffUtility.java ← PO — captures and compares images
              └── CacheMechanism.java ← loads JSON config per pod
                    └── src/test/resources/vd/{podName}/
                          ├── visual-diff-action.json        ← pre-capture actions
                          ├── visual-diff-version-1.json     ← S3 baseline URLs
                          └── upload-snapshot-{browser}-on-s3.json ← snapshot list
```

**Framework classes (unified-qa-framework):**

| Class | Package | Purpose |
|-------|---------|---------|
| `ScreenshotComparison` | `com.headout.common.visual.core` | Takes screenshots (ThreadLocal singleton) |
| `CaptureElement` | `com.headout.common.visual.core` | Enum of capture modes |
| `NewImageComparison` | `com.headout.common.visual` | Pixel comparison engine (2% tolerance default) |
| `ImageComparisonUtil` | `com.headout.common.visual` | Saves image files |
| `UploadSnapshotToS3` | `com.headout.common.visual.action` | Uploads baselines to S3 |
| `VisualSnapshotResponse` | `com.headout.common.visual.action` | POJO for upload-snapshot JSON entries |
| `ActionOperationDetails` | `com.headout.common.visual.action` | POJO for inline action objects |
| `Action.ACTION` | `com.headout.common.visual.action` | Enum of all supported action types |
| `VisualDiffReader` | `com.headout.utility.visualdiff` | Reads `visual-diff-action.json` |
| `VisualDiffReaderVersion` | `com.headout.utility.visualdiff` | Reads `visual-diff-version-1.json` |

---

## Pod Concept

A **pod** is a logical grouping of pages that share config files.

| Pod Name | Pages | Service Types |
|----------|-------|--------------|
| `platform` | Micro-brand (MB) sites (thevaticantickets, londontheatertickets, etc.) | `MB` |
| `discovery` | headout.com pages (homepage, city, product, collection) | `DEIMOS` |

Config folder: `src/test/resources/vd/{podName}/`

---

## Config Files

### 1. `visual-diff-action.json`

Maps snapshot names to the pre-capture actions to run.

**Key format:** `{snapshotName}.ACTION.{ACTION_KEY}`

```json
{
  "ho_homepage": {
    "ACTION": {
      "DOM_ELEMENTS": [
        "//div[contains(@class,'partnersSection__SectionContainer')]",
        "//div[contains(@class,'StyledVideoContainer')]"
      ],
      "CUSTOM_SCRIPT": [
        "document.querySelectorAll(\"[class *= 'ConsentFixedWrapper']\")[0].replaceWith()",
        "var video = document.querySelectorAll('video')[0]; if (video) { video.currentTime = 0; video.pause(); }"
      ],
      "CLICK_LOGIN_BUTTON": "//button[@data-qa-marker='header-login-button']",
      "WAIT_ELEMENT": "//div[@class='login-modal']",
      "WAIT": "2000",
      "TYPE": [
        "//input[contains(@id,'email-login-input-field')]",
        "qa@test.com"
      ]
    }
  }
}
```

**Built-in ACTION_KEY names used in step defs:**

| Key | Used in step as | Behaviour |
|-----|----------------|-----------|
| `DOM_ELEMENTS` | `"DOM_DELETE"` action type | XPath list — deletes each element from DOM |
| `CUSTOM_SCRIPT` | `"DOM_SCRIPT"` action type | JS strings executed in sequence |
| `CLICK_*` | `"CLICK"` action type | XPath of element to click |
| `WAIT_ELEMENT` | `"WAIT_UNIT_ELEMENT_DISPLAY"` | XPath to wait for visibility |
| `WAIT` | `"WAIT"` | Milliseconds to hard-wait |
| `TYPE` | `"SEND_KEYS"` | `[xpathLocator, textToType]` |

---

### 2. `visual-diff-version-1.json`

Maps `{BROWSER}.{SERVICE_TYPE}.{SNAPSHOT_NAME}.{MODE_TYPE}.{LANGUAGE}` path to an S3 image URL.

```json
{
  "CHROME": {
    "DEIMOS": {
      "ho_homepage": {
        "D_WEB": {
          "EN": "https://headout-testing.s3.us-east-1.amazonaws.com/ui-automation/1.0/deimos/d_web/chrome/live/ho_homepage_en.png"
        },
        "M_WEB": {
          "EN": "https://headout-testing.s3.us-east-1.amazonaws.com/ui-automation/1.0/deimos/m_web/chrome/live/ho_homepage_en.png"
        }
      }
    },
    "MB": {
      "thevaticantickets": {
        "D_WEB": {
          "EN": "https://headout-testing.s3.amazonaws.com/ui-automation/1.0/mb/d_web/chrome/live/thevaticantickets_en.png"
        }
      }
    }
  },
  "FIREFOX": {
    "DEIMOS": { ... },
    "MB": { ... }
  },
  "version": 1
}
```

**S3 URL pattern:**
```
https://headout-testing.s3.{region}.amazonaws.com/ui-automation/{version}/{serviceType_lower}/{modeType_lower}/{browser_lower}/{env}/{snapshotName}_{lang_lower}.png
```

| Service Type | Region | Path segment |
|-------------|--------|-------------|
| `DEIMOS` | `us-east-1` | `/deimos/` |
| `MB` | (default) | `/mb/` |

---

### 3. `upload-snapshot-{browser}-on-s3.json`

List of `VisualSnapshotResponse` objects — one per page/scenario to capture as baseline.

```json
[
  {
    "siteUrl": "https://www.headout.com",
    "initialImageName": "ho_homepage",
    "language": "EN",
    "serviceType": "DEIMOS",
    "modeType": "D_WEB",
    "browserType": "CHROME",
    "environment": "live",
    "deleteDom": [
      "//div[contains(@class,'StyledVideoContainer')]"
    ]
  },
  {
    "siteUrl": "https://www.headout.com",
    "initialImageName": "ho_homepage_signin",
    "language": "EN",
    "serviceType": "DEIMOS",
    "modeType": "D_WEB",
    "browserType": "CHROME",
    "environment": "live",
    "deleteDom": ["//div[contains(@class,'StyledVideoContainer')]"],
    "action": [
      { "type": "CLICK", "value": "//button[@data-qa-marker='header-login-button']" },
      { "type": "WAIT_UNIT_ELEMENT_DISPLAY", "value": "//div[@class='login-modal']" },
      { "type": "WAIT", "value": "2000" }
    ],
    "captureElement": "VIEWPORT"
  }
]
```

**All fields of `VisualSnapshotResponse`:**

| Field | Type | Required | Description |
|-------|------|---------|-------------|
| `siteUrl` | String | Yes | Full URL to open |
| `initialImageName` | String | Yes | Snapshot name (no extension). Becomes S3 key. |
| `language` | String | Yes | `EN`, `DE`, `IT`, etc. |
| `serviceType` | String | Yes | `DEIMOS`, `MB`, `HUB` |
| `modeType` | String | Yes | `D_WEB`, `M_WEB` |
| `browserType` | String | Yes | `CHROME`, `FIREFOX` |
| `environment` | String | Yes | `live`, `test`, `ondemand` |
| `deleteDom` | `List<String>` | No | XPath list to remove before screenshot |
| `action` | `List<ActionOperationDetails>` | No | Inline actions with `type` and `value` |
| `captureElement` | CaptureElement | No | Default: `FULL_PAGE_SCREENSHOT` |
| `blurElement` | `List<String>` | No | XPath list to blur before screenshot |
| `windowWidth` | String | No | Override browser width (px) |
| `windowHeight` | String | No | Override browser height (px) |
| `replaceSubPage` | `List<String>` | No | Dynamic sub-page replacement values |
| `fullImageName` | String | No | Override generated filename |

---

## CaptureElement Modes

```java
public enum CaptureElement {
    FULL,                    // Full page via DevTools
    FULL_SCROLL,             // Full scroll+stitch
    FULL_PAGE_SCREENSHOT,    // Default — full page screenshot
    FULL_SCROLL_WITH_SCROLL, // Scroll & stitch with scroll
    VIEWPORT,                // Visible viewport only
    VERTICAL_SCROLL,         // Vertical scroll element
    HORIZONTAL_SCROLL,       // Horizontal scroll
    OFF                      // Disable screenshot
}
```

**When to use which:**

| Mode | Use case |
|------|---------|
| `FULL_PAGE_SCREENSHOT` | Standard full page — homepage, category, product pages |
| `VIEWPORT` | Modal/popup/overlay state — only visible area matters |
| `FULL_SCROLL` | Long pages that need scroll+stitch |
| `FULL_SCROLL_WITH_SCROLL` | Lazy-loading pages (triggers scroll first) |

---

## Action Types (Action.ACTION enum)

All action types available in `visual-diff-action.json` and inline `action[]`:

```
HOVER, HOVER_OUT, CLICK, SCROLL_TO, WAIT, DOM_DELETE, SCROLL_DOWN_PAGE,
SCROLL_UP_PAGE, SCROLL_LEFT, SCROLL_RIGHT, ZOOM_SCREEN, SCROLL_DIV_INTERNAL,
TAKE_SCREENSHOT, REFRESH_PAGE, SCROLL_TO_TOP, SCROLL_TO_BOTTOM, MOVE_LEFT,
MOVE_RIGHT, SCROLL_ELEMENT_TO_MIDDLE, CUSTOM_SCRIPT, DOM_SCRIPT, STOP_ALL_PLAY,
BLUR_ELEMENT, SEND_KEYS, WAIT_UNIT_ELEMENT_DISPLAY, WAIT_UNIT_ELEMENT_NOT_VISIBLE,
WAIT_TILL_LAZY_LOADING
```

---

## Step Definitions (VisualStepDef.java)

All VD tests use only these steps — no custom step defs needed:

```gherkin
# Set up all config for a pod (loads all 3 JSON files)
Given User set basic vd data setup for pod "discovery"

# Open the page (standard celium step — not VD-specific)
Given User opens the application "home" and "ui"
# OR for MB:
Given User opens the page "home" of micro brand "<MB_TYPE>" and sub page "<SUB_PAGE>"

# Pre-capture actions (reads from visual-diff-action.json)
And User perform action "STOP_ALL_PLAY" for element "" on mb "<SNAPSHOT_NAME>"
And User perform action "SCROLL_DOWN_PAGE" for element "" on mb "<SNAPSHOT_NAME>"
And User perform action "DOM_DELETE" for element "DOM_ELEMENTS" on mb "<SNAPSHOT_NAME>"
And User perform action "CLICK" for element "CLICK_LOGIN_BUTTON" on mb "<SNAPSHOT_NAME>"
And User perform action "WAIT_UNIT_ELEMENT_DISPLAY" for element "WAIT_ELEMENT" on mb "<SNAPSHOT_NAME>"
And User perform action "WAIT" for element "WAIT" on mb "<SNAPSHOT_NAME>"
And User perform action "SEND_KEYS" for element "TYPE" on mb "<SNAPSHOT_NAME>"

# Capture actual screenshot
And User capture snapshot "<CAPTURE_MODE>" for page

# Load baseline from S3
And Get production snapshot based on snapshot name "<SNAPSHOT_NAME>", service type "<SERVICE_TYPE>" , language "<LANGUAGE>", and mode type "<MODE_TYPE>"

# Compare and assert
Then User compare both image and failed if any visual diff

# --- Baseline upload step ---
Given user take snapshot for all mb and store in aws s3 for "<REQUEST_ID>" for pod "<POD_NAME>"
```

---

## Feature File Templates

### Template 1: Discovery / headout.com Page (DEIMOS)

```gherkin
Feature: HO <PageName> visual diff on dweb

  # SNAPSHOT_NAME  -> Filename stored in S3 (no extension)
  # SERVICE_TYPE   -> DEIMOS / MB / HUB
  # LANGUAGE       -> EN / DE / IT etc.
  # MODE_TYPE      -> D_WEB / M_WEB

  @vd @ho-vd-sanity @ho-vd-regression @vd-sanity @dweb @discovery-vd @vd-<pageName>
  @test-vd-deimos-sanity @test-vd-deimos-regression @ode-vd-deimos-sanity @ode-vd-deimos-regression
  Scenario Outline: Validate no visual diff on HO <pageTitle> for mode type <MODE_TYPE>, language <LANGUAGE>
    Given User set basic vd data setup for pod "discovery"
    When User opens the application "<PAGE_OPEN_KEY>" and "ui"
    And User perform action "STOP_ALL_PLAY" for element "" on mb "<SNAPSHOT_NAME>"
    And User perform action "SCROLL_DOWN_PAGE" for element "" on mb "<SNAPSHOT_NAME>"
    And User perform action "DOM_DELETE" for element "DOM_ELEMENTS" on mb "<SNAPSHOT_NAME>"
    And User capture snapshot "<CAPTURE_MODE>" for page
    And Get production snapshot based on snapshot name "<SNAPSHOT_NAME>", service type "<SERVICE_TYPE>" , language "<LANGUAGE>", and mode type "<MODE_TYPE>"
    Then User compare both image and failed if any visual diff
    Examples:
      | SNAPSHOT_NAME   | SERVICE_TYPE | LANGUAGE | MODE_TYPE | CAPTURE_MODE         |
      | ho_<page_key>   | DEIMOS       | EN       | D_WEB     | FULL_PAGE_SCREENSHOT |
```

### Template 2: Micro-Brand (MB) Page

```gherkin
Feature: <MBName> MB Visual Diff

  # SNAPSHOT_NAME  -> Indicate snapshot filename stored in S3
  # SERVICE_TYPE   -> MB
  # LANGUAGE       -> EN / DE / IT etc.
  # MODE_TYPE      -> D_WEB / M_WEB

  @visual-diff @mb-visual-diff-sanity @mb-visual-diff-regression @visual-diff-sanity @dweb
  Scenario Outline: Validate no visual diff on <MB_TYPE> mode type <MODE_TYPE>, language <LANGUAGE>
    Given User opens the page "home" of micro brand "<MB_TYPE>" and sub page "<SUB_PAGE>"
    When Add Data key "podName" and value "platform" in Properties File
    And User perform action "STOP_ALL_PLAY" for element "" on mb "<SNAPSHOT_NAME>"
    And User perform action "SCROLL_DOWN_PAGE" for element "" on mb "<SNAPSHOT_NAME>"
    And User perform action "DOM_DELETE" for element "DOM_ELEMENTS" on mb "<SNAPSHOT_NAME>"
    And User capture snapshot "<CATPURE_MODE>" for page
    And Get production snapshot based on snapshot name "<SNAPSHOT_NAME>", service type "<SERVICE_TYPE>" , language "<LANGUAGE>", and mode type "<MODE_TYPE>"
    Then User compare both image and failed if any visual diff
    Examples:
      | SUB_PAGE | MB_TYPE            | SNAPSHOT_NAME    | SERVICE_TYPE | LANGUAGE | MODE_TYPE | CATPURE_MODE         |
      |          | the-vatican-tickets | thevaticantickets | MB           | EN       | D_WEB     | FULL_PAGE_SCREENSHOT |
```

### Template 3: Interactive State (Modal/Popup)

```gherkin
  @vd @ho-vd-regression @dweb @discovery-vd
  Scenario Outline: Validate no visual diff on HO <page> <state> modal
    Given User set basic vd data setup for pod "discovery"
    When User opens the application "home" and "ui"
    And User perform action "STOP_ALL_PLAY" for element "" on mb "<SNAPSHOT_NAME>"
    And User perform action "DOM_DELETE" for element "DOM_ELEMENTS" on mb "<SNAPSHOT_NAME>"
    And User perform action "CLICK" for element "CLICK_<BUTTON_KEY>" on mb "<SNAPSHOT_NAME>"
    And User perform action "WAIT_UNIT_ELEMENT_DISPLAY" for element "WAIT_ELEMENT" on mb "<SNAPSHOT_NAME>"
    And User perform action "WAIT" for element "WAIT" on mb "<SNAPSHOT_NAME>"
    And User capture snapshot "<CAPTURE_MODE>" for page
    And Get production snapshot based on snapshot name "<SNAPSHOT_NAME>", service type "<SERVICE_TYPE>" , language "<LANGUAGE>", and mode type "<MODE_TYPE>"
    Then User compare both image and failed if any visual diff
    Examples:
      | SNAPSHOT_NAME          | SERVICE_TYPE | LANGUAGE | MODE_TYPE | CAPTURE_MODE |
      | ho_homepage_signin     | DEIMOS       | EN       | D_WEB     | VIEWPORT     |
```

### Template 4: Baseline Upload Feature

```gherkin
Feature: Take <PodName> Snapshot

  @snapshot-update-chrome @dweb @start-browser @<pod>-snapshot-update-chrome
  Scenario Outline: Take snapshot and store in AWS S3 for request id <REQUEST_ID> on chrome
    Given user take snapshot for all mb and store in aws s3 for "<REQUEST_ID>" for pod "<POD_NAME>"
    Examples:
      | REQUEST_ID    |
      | MB_REQEUST-0  |
      | MB_REQEUST-1  |
      | MB_REQEUST-2  |
      ...

  @snapshot-update-firefox @dweb @start-browser @<pod>-snapshot-update-firefox
  Scenario Outline: Take snapshot and store in AWS S3 for request id <REQUEST_ID> on firefox
    Given user take snapshot for all mb and store in aws s3 for "<REQUEST_ID>" for pod "<POD_NAME>"
    Examples:
      | REQUEST_ID    |
      | MB_REQEUST-0  |
      ...
```

---

## Full Workflow: Adding a New VD Test

### Step 1 — Determine pod

- headout.com pages → pod = `discovery`
- micro-brand (MB) sites → pod = `platform`
- new area of site → create new pod under `src/test/resources/vd/{newPodName}/`

### Step 2 — Add entry to `upload-snapshot-{browser}-on-s3.json`

Calculate index N = existing array length. Add:
```json
{
  "siteUrl": "https://www.headout.com/new-page",
  "initialImageName": "ho_new_page",
  "language": "EN",
  "serviceType": "DEIMOS",
  "modeType": "D_WEB",
  "browserType": "CHROME",
  "environment": "live",
  "deleteDom": ["//div[contains(@class,'ConsentFixedWrapper')]"]
}
```
Add entry index `MB_REQEUST-N` to the snapshot feature file's Examples table.

### Step 3 — Add action config to `visual-diff-action.json`

```json
{
  "ho_new_page": {
    "ACTION": {
      "DOM_ELEMENTS": [
        "//div[contains(@class,'ConsentFixedWrapper')]"
      ],
      "CUSTOM_SCRIPT": [
        "document.querySelectorAll(\"[class *= 'ConsentFixedWrapper']\")[0].replaceWith()",
        "var video = document.querySelectorAll('video')[0]; if (video) { video.currentTime = 0; video.pause(); }"
      ]
    }
  }
}
```

### Step 4 — Capture baseline and add to `visual-diff-version-1.json`

Run the snapshot upload tag to capture the actual image and push to S3:
```bash
mvn compile test -Dcucumber.filter.tags="@snapshot-update-chrome and @dweb" -DthreadCount=5
```

Then add the S3 URL returned by the upload to `visual-diff-version-1.json`:
```json
{
  "CHROME": {
    "DEIMOS": {
      "ho_new_page": {
        "D_WEB": {
          "EN": "https://headout-testing.s3.us-east-1.amazonaws.com/ui-automation/1.0/deimos/d_web/chrome/live/ho_new_page_en.png"
        }
      }
    }
  }
}
```

### Step 5 — Write the VD comparison feature file

Use Template 1, 2, or 3 above. Place under:
```
src/test/java/com/headout/features/{domain}/ui/vd/{modeType}/{pageName}.feature
```

### Step 6 — Run VD tests

```bash
mvn compile test -Dcucumber.filter.tags="@vd-sanity and @dweb" -DthreadCount=10
```

---

## Tag Taxonomy for VD Tests

| Tag | Meaning |
|-----|---------|
| `@vd` | All visual diff tests |
| `@visual-diff` | Legacy MB visual diff tests |
| `@vd-sanity` / `@visual-diff-sanity` | Critical baseline checks |
| `@vd-regression` / `@mb-visual-diff-regression` | Full regression suite |
| `@ho-vd-sanity` | HO homepage VD sanity |
| `@ho-vd-regression` | HO homepage VD regression |
| `@discovery-vd` | All discovery pod VD tests |
| `@mb-visual-diff-sanity` | MB pod VD sanity |
| `@dweb` | Desktop web |
| `@mweb` | Mobile web |
| `@snapshot-update-chrome` | Capture baseline on Chrome |
| `@snapshot-update-firefox` | Capture baseline on Firefox |
| `@test-vd-deimos-sanity` | ODE/test env deimos sanity |
| `@ode-vd-deimos-sanity` | ODE env deimos sanity |

---

## Environment Variables (CI/CD)

| Variable | Value | Purpose |
|----------|-------|---------|
| `PERFORM_VISUAL_DIFF` | `true` | Enable VD mode |
| `VISUAL_TESTING_NEEDED` | `true` | Activate screenshot capture |
| `ENABLE_SAME_SCALE_FACTOR` | `true` | Normalize DPI across machines |
| `PIXEL_DIFFERENCE_OVERRIDE` | `2` (integer %) | Max % diff before fail |
| `NEED_TO_REDUCE_SCREENSHOT_SIZE` | `true/false` | Shrink result images |
| `REDUCE_SCREEN_SHOT_SIZE_BY_PERCENTAGE` | `40.00` | Reduction percent |
| `BROWSER` | `chrome` / `firefox` | Browser for screenshots |
| `MOBILE_VIEW` | `true/false` | Use mobile viewport |
| `AUTOMATION_TOOL_TYPE` | `SELENIUM` / `PLAYWRIGHT` / `BOTH` | Automation engine |

---

## Standard Pre-Capture Action Sequence

Always apply in this order before `User capture snapshot`:

```gherkin
# 1. Stop video & swiper autoplay (prevents animation blur)
And User perform action "STOP_ALL_PLAY" for element "" on mb "<SNAPSHOT_NAME>"

# 2. Scroll down then back up (triggers lazy loading)
And User perform action "SCROLL_DOWN_PAGE" for element "" on mb "<SNAPSHOT_NAME>"

# 3. Delete dynamic/animated DOM elements (ads, consent banners, live data)
And User perform action "DOM_DELETE" for element "DOM_ELEMENTS" on mb "<SNAPSHOT_NAME>"
```

**Elements that must always be in `DOM_ELEMENTS`:**
- Consent/cookie banners: `//div[contains(@class,'ConsentFixedWrapper')]`
- Partner logos (live data): `//div[contains(@class,'partnersSection__SectionContainer')]`
- Video containers: `//div[contains(@class,'StyledVideoContainer')]`
- Review sliders (animated): `//div[contains(@class,'globalReviewSection__Slider')]`
- Comparison tables (dynamic prices): `//*[contains(@class,'automated_comparison_table')]`

---

## File Location Map

```
celium/
├── src/test/java/com/headout/
│   ├── features/
│   │   ├── discovery/ui/vd/
│   │   │   ├── dweb/
│   │   │   │   ├── homepage.feature
│   │   │   │   ├── citypage.feature
│   │   │   │   ├── collection.feature
│   │   │   │   └── product-page.feature
│   │   │   ├── mweb/
│   │   │   │   └── homepage.feature
│   │   │   └── snapshot/
│   │   │       └── ho.feature          ← baseline upload
│   │   └── platfrom/visual/
│   │       ├── mb/
│   │       │   ├── thevaticantickets-visual-diff.feature
│   │       │   └── londontheatertickets-visual-diff.feature
│   │       └── snanpshot/
│   │           └── mb.feature          ← MB baseline upload
│   ├── pageobjects/visual/
│   │   └── VisualDiffUtility.java      ← PO
│   ├── stepdefinitions/visual/
│   │   └── VisualStepDef.java          ← step defs
│   └── utility/visualdiff/
│       ├── VisualDiffReader.java
│       └── VisualDiffReaderVersion.java
└── src/test/resources/vd/
    ├── platform/                       ← MB pod
    │   ├── visual-diff-action.json
    │   ├── visual-diff-version-1.json
    │   ├── upload-snapshot-chrome-on-s3.json
    │   └── upload-snapshot-firefox-on-s3.json
    └── discovery/                      ← DEIMOS pod
        ├── visual-diff-action.json
        ├── visual-diff-version-1.json
        ├── upload-snapshot-chrome-on-s3.json
        └── upload-snapshot-firefox-on-s3.json
```

---

## VD Test Anti-Patterns

| Anti-Pattern | Correct Approach |
|-------------|-----------------|
| No `STOP_ALL_PLAY` before capture | Always add as first action |
| No `DOM_DELETE` for consent banners | Always delete consent/cookie banners |
| No `SCROLL_DOWN_PAGE` for lazy pages | Add scroll action for pages with lazy-loaded images |
| Using `Thread.sleep()` instead of `WAIT` action | Use `WAIT` action type with ms value |
| `captureElement: FULL_PAGE_SCREENSHOT` for modals | Use `VIEWPORT` for modals/overlays |
| Hardcoded S3 URL in step | URL comes from `visual-diff-version-1.json` via snapshot name key |
| Missing entry in both chrome AND firefox upload-snapshot files | Add to both browser files |
| Snapshot name with spaces | Use `_` separator: `ho_homepage_signin` |
| Missing baseline entry in `visual-diff-version-1.json` | Run snapshot-update tag first to upload, then add URL |
