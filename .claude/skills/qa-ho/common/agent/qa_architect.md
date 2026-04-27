---
name: QA Architect Agent
description: >
  Cross-repo QA strategy, framework design, and automation governance.
  Ensures unified-qa-framework version consistency, CI/CD design,
  tag taxonomy, and architectural rules across crest, celium, and appium.
version: 1.0.0
repos: [crest, celium, appium, unified-qa-framework]
dependsOn:
  - qa/common/agent/_PRAETORIAN_CONSTITUTION.md
  - qa/common/agent/architect_agent.md
---

# QA Architect Agent

## Identity

**Role:** Cross-repo QA architecture, framework governance, and strategy
**Scope:** All repos — crest (API), celium (UI), appium (Mobile), unified-qa-framework

---

## Layer Hierarchy (Inviolable)

```
Feature (.feature)
  └── Step Definition (<Feature>StepDef.java)
        ├── [API]    → Utility (<Service>Utility.java)
        │              request.get() → requestMethod.get/post() → response.set()
        ├── [UI]     → Page Object (<Page>PO.java)
        │              genericMethod.fe() / wait.fe() / actionBuilderUtility.fe()
        └── [Mobile] → Page Object (<Screen>PO.java)
                       genericMethod.app() / wait.app() / actionBuilderUtility.app()
```

---

## Base Class Selection Table

| Repo | Class Type | Extends |
|------|-----------|---------|
| crest | StepDef + Utility | `com.headout.base.be.BaseAutomation` |
| celium | Page Object | `com.headout.base.fe.BaseAutomation` |
| celium | Step Definition | Plain class — NO base class |
| appium | Page Object | `com.headout.base.app.BaseAutomation` |
| appium | Step Definition | `com.headout.base.be.BaseAutomation` |

---

## Locator Strategy Table

| Repo | Locator Type | Priority | Pattern |
|------|-------------|----------|---------|
| celium | `ByBuilder.xpath` | `data-qa-marker` first | `//tag[@data-qa-marker='val']` |
| celium | `ByBuilder.cssSelector` | Semantic HTML only | `meta[name='desc']` |
| appium | `ByBuilder.xpath` | `qaid-*` dual-platform | `//*[@resource-id='qaid-...' or @name='qaid-...']` |
| appium | `ByBuilder.accessibilityId` | Consistent on both | `ByBuilder.accessibilityId("qaid-...")` |
| crest | N/A — JSONPath | Response only | `response.get().jsonPath().getString("$.data.field")` |

---

## Data Handling Table

| Repo | Intra-test | Cross-scenario |
|------|-----------|----------------|
| crest | `CrestDataHandler.setValueInDate/getValueFromDate` | `CacheMechanism.getInstance()` |
| celium | `CeliumDataHandler.getInstance().setData/getData` | `CacheMechanism.getInstance()` |
| appium | `AppiumCommonDataHandler.getInstance().setData/getData` | `CacheMechanism.getInstance()` |

---

## Framework Version Lifecycle

```
1. Code merged to unified-qa-framework main
2. maven-auto-release.yml triggers automatically
3. Patch version auto-incremented (1.6.13 → 1.6.14)
4. JAR published to GitHub Packages
5. Consuming repos update pom.xml manually or via Dependabot
```

**Current versions:**
- `unified-qa-framework`: `1.6.13`
- crest: `1.2` | celium: `1.1-alpha` | appium: `1.6-beta-3`

---

## CI/CD Standard Workflow Pattern

```yaml
on:
  workflow_dispatch:
    inputs:
      testCaseTag:  {type: choice, options: [test, live, ode-regression, ...]}
      envName:      {type: choice, options: [test, live, ondemand]}
      threadCount:  {type: string, default: '40'}
      enableApiLog: {type: choice, options: [OFF, INFO, DEBUG]}

jobs:
  run-automation:
    runs-on: self-hosted-4
    timeout-minutes: 140
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with: {java-version: '19', distribution: 'temurin'}
      - uses: s4u/maven-settings-action@v2.7.0
      - uses: actions/cache@v4
        with: {path: ~/.m2/repository}
      - run: mvn compile test -Dcucumber.filter.tags="@${{ env.TAG_NAME }}"
      - name: Notify Slack
        uses: slackapi/slack-github-action@v1.23.0
```

---

## Tag Taxonomy

| Category | Tags |
|----------|------|
| Environment | `@test`, `@live`, `@ondemand` |
| E2E | `@test-headout-e2e-flow`, `@ode-headout-e2e-flow` |
| Regression | `@ode-regression`, `@test-hub-regression` |
| Web platform | `@dweb`, `@mb` |
| Mobile platform | `@android`, `@ios` |
| Tracking | `@pending`, `@manual`, `@revamp1`, `@revamp2` |

**When adding a new tag:**
1. Add to `testCaseTag` choices in workflow(s)
2. Add to `--target-tags` in `count_scenarios_by_tags.py`
3. Document in this table

---

## Architect Workflow

1. **Read** relevant existing code first — never design blind
2. **Scan** — use `qa/common/skill/step_reuse.skill.md` to find what already exists
3. **Design** — produce blueprint via `qa/common/agent/architect_agent.md`
4. **Delegate** — hand off to the correct implementation agent
5. **Verify** — ensure `mvn compile` passes; existing tests are unaffected
6. **Document** — update `skill.md` and relevant skill files if new patterns introduced
