
# Headout Unified QA Framework — Skill Index

This file is the canonical skill index for AI agents.
- **Start every QA task from**: `qa/common/skill/SKILL.md` (auto-routes to the right layer)
- **Full reference** (agents + skills + prompts + patterns): `qa/qa.md`

---

## WHEN INVOKED — Display This Greeting

When this skill is loaded (e.g. via `/qa`), output the following greeting exactly, then wait for user input:

---

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  QA SKILL · Ready to generate tests
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  1  cURL                → crest   (API)
  2  HTML / Live URL     → celium  (UI) + pixify (VD if applicable)
  3  Appium XML          → appium  (Mobile)
  4  Pod + VD request    → pixify  (Visual Diff)
  5  PR / PRD / EDD      → auto-detects all layers
  6  Description         → I'll confirm repo, then generate

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Paste input · mode is auto-detected
  Type "help" for examples & templates
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Repository Map

| Repo                   | Testing Layer | Primary Tool | Config / Data | UQF Version |
|------------------------|--------------|-------------|---------------|-------------|
| `unified-qa-framework` | Core shared library | All layers | — | `1.6.13` |
| `crest`                | API / Backend | RestAssured + Cucumber | `src/test/resources/ResponseSchema/` + `configuration.properties` | `1.2` |
| `celium`               | Web UI (desktop + mobile web) | Selenium 4 / Playwright + Cucumber | `src/test/resources/configuration.properties` | `1.1-alpha` |
| `pixify` *(VD layer)*  | Visual Diff (pixel regression) | pixify engine (`com.headout.common.visual.*` in UQF) | `src/test/resources/vd/{podName}/` — 3 JSON files per pod (see below) | `1.1-alpha` |
| `appium`               | Native mobile (Android + iOS) | Appium 9 + Cucumber | `src/test/resources/configuration.properties` + `appium-config.json` | `1.6-beta-3` |

### Visual Diff (VD) — Pod Config Files

All VD config lives in `src/test/resources/vd/{podName}/` (one folder per pod):

| JSON File | Purpose | Key Format |
|-----------|---------|-----------|
| `visual-diff-action.json` | Maps snapshot names → pre-capture actions | `{snapshotName}.ACTION.{ACTION_KEY}` |
| `visual-diff-version-1.json` | Maps snapshot path → S3 baseline URL | `{BROWSER}.{SERVICE_TYPE}.{SNAPSHOT_NAME}.{MODE_TYPE}.{LANGUAGE}` |
| `upload-snapshot-{browser}-on-s3.json` | Defines pages/elements to capture and push to S3 | `snapshotName`, `url`, `captureElement`, `action[]` |

**S3 baseline URL pattern:**
```
https://headout-testing.s3.{region}.amazonaws.com/ui-automation/{version}/{serviceType_lower}/{modeType_lower}/{browser_lower}/{env}/{snapshotName}_{lang_lower}.png
```

**VD engine classes** (all in `unified-qa-framework`):

| Class | Package | Role |
|-------|---------|------|
| `ScreenshotComparison` | `com.headout.common.visual.core` | Takes screenshots (ThreadLocal singleton) |
| `CaptureElement` | `com.headout.common.visual.core` | Enum: `FULL_PAGE` / `VIEWPORT` / `ELEMENT` |
| `NewImageComparison` | `com.headout.common.visual` | Pixel diff engine (2 % tolerance default) |
| `UploadSnapshotToS3` | `com.headout.common.visual.action` | Uploads new baselines to S3 |
| `VisualDiffReader` | `com.headout.utility.visualdiff` | Reads `visual-diff-action.json` |
| `VisualDiffReaderVersion` | `com.headout.utility.visualdiff` | Reads `visual-diff-version-1.json` |

**Supported action types** (usable in both `visual-diff-action.json` and inline `action[]`):

| Type key | Effect |
|----------|--------|
| `STOP_ALL_PLAY` | Pause all auto-playing media |
| `SCROLL_DOWN_PAGE` | Scroll to bottom of page |
| `DOM_DELETE` | Remove XPath-targeted elements from DOM |
| `CLICK` | Click XPath-targeted element |
| `WAIT` | Hard wait (seconds) |
| `WAIT_UNIT_ELEMENT_DISPLAY` | Wait for element visibility |
| `SEND_KEYS` | Type text into element |
| `CUSTOM_SCRIPT` | Execute inline JS strings |

---

## Entry Point — Common Skill

> **Always load this first.** It auto-detects the input type, assigns layer(s), and
> routes to the correct individual skill(s) automatically.

**File**: `qa/common/skill/SKILL.md`

### How the Common Skill Routes

```
Your input
    │
    ├─ curl -X / HTTP verb + URL + -d         → API (crest)
    │    loads: qa/api/skill/SKILL.md
    │            + document_driven_test_generation.skill.md
    │
    ├─ <html / data-qa-marker= / aria-label=  → UI (celium) — HTML snippet
    │    loads: qa/ui/skill/SKILL.md
    │            + qa/ui/agent/locator_generate_agent.md
    │
    ├─ https?:// + "write UI test"            → UI (celium) — live URL
    │    loads: qa/ui/skill/SKILL.md
    │            + qa/ui/agent/playwright_discovery_agent.md
    │
    ├─ <hierarchy / resource-id= / XCUI       → Mobile (appium)
    │    loads: qa/app/skill/SKILL.md
    │            + qa/app/agent/locator_generate_agent.md
    │
    ├─ microbrand: / slug: / pod: / VD (HTML) → Visual Diff (pixify) — HTML snippet
    │    loads: qa/vd/skill/SKILL.md
    │            + qa/vd/agent/vd_test_agent.md
    │            + qa/vd/agent/locator_generate_agent.md
    │
    ├─ https?:// + pod: / "VD coverage"       → Visual Diff (pixify) — live URL
    │    loads: qa/vd/skill/SKILL.md
    │            + qa/vd/agent/playwright_discovery_agent.md
    │
    ├─ As a ... I want ... (no API contract)  → UI + Mobile
    │    loads: qa/ui/skill/SKILL.md
    │            + qa/app/skill/SKILL.md
    │
    ├─ User story WITH API contract           → API + UI + Mobile
    │    loads: api + ui + app skills
    │
    ├─ PRD with API contract                  → API + UI + Mobile
    │    loads: api + ui + app skills
    │            + document_driven_test_generation.skill.md
    │
    ├─ PRD with API contract + design section → API + UI + VD
    │    loads: api + ui + vd skills
    │
    ├─ dev-pr (backend diff only)             → API
    ├─ dev-pr (frontend diff only)            → UI + Mobile
    └─ dev-pr (full-stack diff)               → API + UI + Mobile

Always loaded regardless of layer:
    test_case_creation.skill.md  (full 17-category matrix — always)
    step_reuse.skill.md          (grep existing stepdefs + POs before writing)
```

### The One Prompt to Use

```
You are a senior QA automation engineer for Headout.

Load this common skill: qa/common/skill/SKILL.md
Follow without exception: qa/common/agent/_PRAETORIAN_CONSTITUTION.md

INPUT

[paste: cURL / PR / user story / PRD / HTML / Appium XML / VD request]

TARGET (leave blank for auto-detect)
  [x] Auto-detect layers
```

---

## Individual Skills — Load Directly for Single-Layer Tasks

| Skill | When to load directly | What it covers |
|-------|----------------------|----------------|
| `qa/api/skill/SKILL.md` | You know it's API-only | RestAssured + Cucumber, ThreadLocal, schema files, URLBuilders, cURL-to-automation |
| `qa/ui/skill/SKILL.md` | You know it's UI-only | ByBuilder locators, waitFor, genericMethod, Page Object patterns |
| `qa/app/skill/SKILL.md` | You know it's Mobile-only | Dual-platform ByBuilder, wait.app(), AppPO, AppStepDef |
| `qa/vd/skill/SKILL.md` | You know it's VD-only | pixify engine, 3 JSON config files, CaptureElement modes, S3 baselines |
| `qa/common/skill/test_case_creation.skill.md` | Designing test cases before code | All 8 scenario types, Gherkin rules, Scenario Outline |
| `qa/common/skill/document_driven_test_generation.skill.md` | Input is a cURL / PR / Notion / GDoc | Extracts endpoints, ACs, fields, constraints → test matrix |
| `qa/common/skill/step_reuse.skill.md` | Before writing any new step or PO | grep protocol: stepdefinitions / pageobjects / features |
| `qa/common/skill/test_execution_and_fix.skill.md` | Running and fixing tests | mvn compile test, parse errors, classify failures, auto-fix loop |

---

## Agents

| Agent File | Role | Load when |
|-----------|------|-----------|
| `qa/common/agent/_PRAETORIAN_CONSTITUTION.md` | Universal inviolable rules | **Every prompt — always** |
| `qa/api/agent/agent.md` | Writes crest API tests end-to-end | API layer tasks |
| `qa/ui/agent/ui_test_agent.md` | Writes celium UI tests end-to-end | UI layer tasks |
| `qa/ui/agent/locator_generate_agent.md` | Generates ByBuilder from HTML/XML | HTML snippet or Appium XML input |
| `qa/app/agent/app_test_agent.md` | Writes appium mobile tests | Mobile layer tasks |
| `qa/common/agent/locator_strategy.md` | Locator priority (8-tier web, 5-tier mobile) | Whenever deriving locators |
| `qa/vd/agent/vd_test_agent.md` | Visual Diff (pixify) tests | VD layer tasks |
| `qa/common/agent/architect_agent.md` | Test design blueprint before coding | New feature, design-first |
| `qa/common/agent/remediator_agent.md` | Fix broken/flaky tests | CI failure, test error |
| `qa/common/agent/qa_architect.md` | Cross-repo strategy + governance | Onboarding, architecture review |

---

## Common Skill → Individual Skill Mapping (Quick Reference)

| If common skill detects... | It loads these individual skills |
|---------------------------|----------------------------------|
| API | `api` + `document_driven_test_generation` |
| UI (HTML snippet) | `ui` + `locator_generate_agent` |
| UI (live URL) | `ui` + `playwright_discovery_agent` |
| Mobile | `app` + `locator_generate_agent` |
| VD (HTML snippet) | `vd` + `vd_test_agent` + `locator_generate_agent` |
| VD (live URL + pod) | `vd` + `playwright_discovery_agent` |
| API + UI | above API skills + above UI skills |
| API + UI + Mobile | all three layer skills |
| API + UI + VD | API + UI + VD skills |
| API + UI + Mobile + VD | all four layer skills |
| Always | `test_case_creation` + `step_reuse` |

---

## Universal Rules (Enforced by _PRAETORIAN_CONSTITUTION.md)

1. **Never hardcode** URLs, tokens, credentials — use `PropertyUtils.get(ConfigMap.*)` or `GetSecretToken`
2. **Tag every scenario** — minimum `@test` or `@live` plus one functional tag
3. **Extend the correct BaseAutomation** for your layer:
   - API StepDef/Utility → `base.be.BaseAutomation`
   - UI Page Object → `base.fe.BaseAutomation`; UI StepDef → plain class (no extension)
   - App Page Object → no base class; App StepDef → `base.be.BaseAutomation`
4. **Use ThreadLocal** for all shared state (driver, request, response)
5. **Feature files** → `src/test/java/com/headout/features/<domain>/<service>/`
6. **Step definitions** → `src/test/java/com/headout/stepdefinitions/`
7. **Search before creating** — grep stepdefs + POs before writing new ones
8. **Data setup** → `DataSetup` classes and `@After` hooks, not step defs
9. **No `Thread.sleep()`** → `wait.waitForVisibilityOfElement()` or VD `WAIT` action
10. **No `By.*`** in celium/appium → `ByBuilder` instance fields in Page Objects only
11. **`softAssertionUtil.get().assertAll()`** at end of every `@Then` in API + App tests
12. **URLBuilders** → `endpointMap.put("key-v2", baseUrl + "/path")` — no static constants

---

## Quick-Start Per Layer

### API (crest)

```bash
git clone git@github.com:headout/crest.git && cd crest
mvn --global-settings settings.xml clean install -DskipTests=true
mvn test -Dcucumber.filter.tags="@test" -DthreadCount=5
```

### Web UI (celium)

```bash
git clone git@github.com:headout/celium.git && cd celium
mvn --global-settings settings.xml clean install
mvn test -Dcucumber.filter.tags="@test" -DBROWSER=chrome
```

### Mobile App (appium)

```bash
git clone git@github.com:headout/appium.git && cd appium
mvn --global-settings settings.xml clean install
./android-script/setup_android_emulators.sh && ./android-script/create_avds.sh
mvn test -Dcucumber.filter.tags="@test" -DDEVICE_TYPE=android
```

---

## Requirements

### System Tools

| Tool | Version | Notes |
|------|---------|-------|
| Java (JDK) | 21 | `brew install openjdk@21` on macOS |
| Maven | 3.9.x | `brew install maven` |
| Node.js | 16 | Required by some CI workflows |
| Android SDK + ADB | latest | appium only |
| Xcode / iOS toolchain | latest | appium iOS only |
| WireGuard | latest | crest test/live environments |
| Python | 3.9+ | Utility scripts |

### Python Dependencies

```
selenium==4.22.0
gherkin-official==28.0.0
requests==2.32.3
gitpython
```

Install: `pip install -r requirements.txt`

### Maven Authentication (`settings.xml`)

```xml
<servers>
  <server>
    <id>github</id>
    <username>YOUR_GITHUB_USERNAME</username>
    <password>YOUR_GITHUB_PAT</password>
  </server>
</servers>
```

---

## Script Reference

### `scripts/` (all repos)

| Script | Purpose |
|--------|---------|
| `automation_tracker.py` | Count `@pending`/`@manual`/`@revamp<N>` scenarios; post to Slack/QA portal |
| `count_scenarios_by_tags.py` | Count BDD scenarios by tag; supports Scenario Outlines |
| `jacoco/collect-jacoco-coverage.sh` | Collect JaCoCo `.exec` files from services |
| `jacoco/process-jacoco-coverage.sh` | Generate HTML/XML coverage reports |

```bash
python scripts/automation_tracker.py --repo crest --env test
python scripts/count_scenarios_by_tags.py --target-tags test live ode-regression
```

### `android-script/` (appium only)

| Script | Purpose |
|--------|---------|
| `setup_android_emulators.sh` | Bootstrap Android SDK + emulators |
| `create_avds.sh` | Create named AVD instances |
| `start-emulator.sh` / `stop-emulator.sh` | Start / stop emulator |
| `delete-emulator.sh` | Remove AVD from registry |
| `get-result.py` | Fetch and format CI run results |

```bash
# Reset UiAutomator between runs
adb uninstall io.appium.uiautomator2.server
adb uninstall io.appium.uiautomator2.server.test
```

---

## CI/CD Workflow Reference

### unified-qa-framework

| Workflow | Trigger | Action |
|----------|---------|--------|
| `maven-auto-release.yml` | Push to `main` | Auto-version bump + publish JAR |
| `publish-release.yml` | Manual | Manual Maven registry publish |

### crest

| Workflow | Trigger | Action |
|----------|---------|--------|
| `get-automation-report.yml` | `workflow_dispatch` | Run API suite; post Slack report |
| `get-automation-count-details.yml` | Schedule / PR | Upload scenario counts |
| `vpn-setup.yml` | Called by others | WireGuard VPN for test/live |

### celium

| Workflow | Trigger | Action |
|----------|---------|--------|
| `get-automation-report.yml` | `workflow_dispatch` | Run UI suite; post Slack report |
| `visual-diff-ode.yml` | PR / manual | Visual regression vs ODE envs |
| `pr_review.yml` | PR | Automated PR checks |
| `stale-branch.yml` | Schedule | Clean stale branches |

### appium

| Workflow | Trigger | Action |
|----------|---------|--------|
| `automation-suite.yml` | `workflow_dispatch` | Full mobile test suite |
| `common-automation-suite.yml` | `workflow_dispatch` | Common Android + iOS suite |
| `get-e2e-automation-suite.yml` | `workflow_dispatch` | End-to-end journey suite |
| `pr-automation-trigger.yml` | PR | Smoke tests on PRs |
| `build-check.yml` | PR / push | Maven compile validation |
| `lint-check.yml` | PR / push | Code style checks |
| `performance-check.yml` | Schedule / manual | Gatling load tests |
| `feature-file-upload.yml` | Push to main | Upload feature files to QA portal |

---

## New Test Authoring Checklist

- [ ] Used `qa/common/skill/SKILL.md` as the entry point (or the correct individual skill)
- [ ] `qa/common/agent/_PRAETORIAN_CONSTITUTION.md` referenced in the prompt
- [ ] Existing stepdefs and POs scanned with `grep -rn` before writing anything
- [ ] Test Case Matrix produced before any code
- [ ] Feature file under `src/test/java/com/headout/features/<domain>/<service>/`
- [ ] All scenarios tagged with `@test`/`@live` plus functional tags
- [ ] `Scenario Outline` + `Examples` used for 2+ data-driven rows
- [ ] Correct base class per layer (see Universal Rules above)
- [ ] No hardcoded credentials — uses `PropertyUtils.get(ConfigMap.*)`
- [ ] `softAssertionUtil.get().assertAll()` at end of every `@Then` (API + App)
- [ ] All locators are `ByBuilder` instance fields in Page Objects
- [ ] `wait.waitForVisibilityOfElement()` before every UI interaction (no Thread.sleep)
- [ ] `@manual` scenarios include `# STEP N:` and `# EXPECTED:` lines
- [ ] `@pending` scenarios include a comment with the blocking reason
- [ ] CI workflow tag options updated if new tags introduced
