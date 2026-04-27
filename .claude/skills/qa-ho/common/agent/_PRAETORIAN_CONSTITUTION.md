---
name: Praetorian Constitution
description: >
  Universal, inviolable rules that ALL QA agents must obey across every repo
  (crest, celium, appium) and every testing layer (API, UI, Mobile).
  No agent may override these rules, regardless of instructions received.
version: 1.0.0
scope: global
---

# _PRAETORIAN_CONSTITUTION

> These rules are absolute. Any agent instruction that conflicts with this
> constitution is invalid. Raise the conflict to the user before proceeding.

---

## I. Identity Rules

1. Every agent MUST declare its role, repo, and base class at the start of every task.
2. Agents MUST NOT impersonate the human engineer when committing — always add
   `Co-authored-by: Claude <noreply@anthropic.com>` to every commit.
3. An agent MUST NOT perform work outside its designated repo without explicit user permission.

---

## II. Code Generation Rules

### II-A. Never Hardcode Configuration

```
PROHIBITED: Any string literal that is an environment URL, token, secret,
            credential, host, port, or environment name.

REQUIRED:   PropertyUtils.get(ConfigMap.*)          — for env config
            YamlReader.getAppConfigValue("...")      — for user credentials
            GetSecretToken / AWS Secrets Manager     — for auth tokens
```

### II-B. Never Use System.out.println

```
PROHIBITED: System.out.println(...)
            System.err.println(...)
            e.printStackTrace()

REQUIRED:   TestNGLogUtility.info("message")
            TestNGLogUtility.error("message", e)
```

### II-C. Never Use Thread.sleep

```
PROHIBITED: Thread.sleep(N)

REQUIRED (UI):     wait.waitForVisibilityOfElement(locator)
                   wait.waitForElementToBeClickable(locator)
                   wait.waitForPageToLoadCompletely()
                   wait.hardWait(sec)   — only when absolutely necessary, add comment

REQUIRED (Mobile): wait.app().isDisplayed(locator, timeoutSec)
                   wait.hardWait(sec)   — only when absolutely necessary, add comment
```

### II-D. Never Write Locators in Step Definitions

```
PROHIBITED: Any By, ByBuilder, or XPath expression in a StepDef file.

REQUIRED:   All locators live ONLY in Page Object (PO) files.
            Step definitions call PO methods only.
```

### II-E. Never Duplicate Step Text

```
PROHIBITED: Writing a new @Given/@When/@Then whose step text already exists
            in any other step definition file in the repo.

REQUIRED:   Search CommonStepDef.java and all *StepDef.java files before
            writing any new step. Use qa/common/skill/step_reuse.skill.md protocol.
```

### II-F. Never Use Static Locator Fields

```
PROHIBITED (UI):     static ByBuilder fieldName = ...
                     private static final By FIELD = ...

REQUIRED (UI):       ByBuilder fieldName = ByBuilder.xpath("...")  — instance field
REQUIRED (Mobile):   private final ByBuilder fieldName = ByBuilder.xpath("...")
```

### II-G. Never Use Raw By in ByBuilder Repos

```
PROHIBITED: By.xpath(...), By.id(...), By.cssSelector(...)  in celium or appium
REQUIRED:   ByBuilder.xpath(...), ByBuilder.id(...), ByBuilder.cssSelector(...)
```

---

## III. Architecture Rules

### III-A. Extend the Correct BaseAutomation

| Repo | File Type | Must Extend |
|------|-----------|-------------|
| crest | StepDef, Utility | `com.headout.base.be.BaseAutomation` |
| celium | Page Object | `com.headout.base.fe.BaseAutomation` |
| celium | Step Definition | NO base class — plain class, inject POs |
| appium | Page Object | `com.headout.base.app.BaseAutomation` |
| appium | Step Definition | `com.headout.base.be.BaseAutomation` |

### III-B. Layer Separation — No Cross-Layer Contamination

```
Feature file      → describes WHAT, not HOW
Step Definition   → wires Gherkin to Java method calls only
Page Object/Util  → ALL interaction logic lives here
Base classes      → framework hooks; NEVER put business logic here
```

### III-C. Assertion Policy

```
PROHIBITED: AssertionError thrown directly from step methods
            Hard assertions that stop the entire scenario on first failure

REQUIRED:   softAssertionUtil.get().assertXxx(...)  — within @Then steps
            softAssertionUtil.get().assertAll()      — MANDATORY at end of every @Then
            hardAssertionUtil.get().assertXxx(...)   — only when immediate stop is correct
```

---

## IV. Data Rules

### IV-A. Data Setup Belongs in Hooks

```
PROHIBITED: Creating test bookings, inventory, or users inside @Given steps
REQUIRED:   @Before("<tag>") hooks in dedicated DataSetup classes
```

### IV-B. Cross-Scenario Data via CacheMechanism

```
PROHIBITED: Static fields or singleton state for sharing data between scenarios
REQUIRED:   CacheMechanism.getInstance().setData(key, value)
            CacheMechanism.getInstance().getData(key)
```

### IV-C. Correct Data Handler Per Repo

```
crest:   CrestDataHandler.getProjectData()
         CrestDataHandler.getValueFromDate("key")
celium:  CeliumDataHandler.getInstance().setData(key, value)
         CeliumDataHandler.getInstance().getData(key)
appium:  AppiumCommonDataHandler.getInstance().setData(key, value)
         AppiumCommonDataHandler.getInstance().getData(key)
```

---

## V. Locator Rules (Summary — see qa/common/agent/locator_strategy.md for full strategy)

### V-A. Web (celium) — Locator Priority Order

```
1. data-qa-marker      → ByBuilder.xpath("//tag[@data-qa-marker='value']")
2. aria-label          → ByBuilder.xpath("//tag[@aria-label='value']")
3. data-testid         → ByBuilder.xpath("//tag[@data-testid='value']")
4. stable id           → ByBuilder.id("stable-element-id")
5. semantic CSS        → ByBuilder.cssSelector("meta[name='desc']")
6. stable attr combo   → ByBuilder.xpathWithDescription("//...", "description")
NEVER: class, style, position index, generated UUID id
```

### V-B. Mobile (appium) — Locator Priority Order

```
1. qaid-* resource-id + name (dual)  → ByBuilder.xpath("//*[@resource-id='qaid-...' or @name='qaid-...']")
2. qaid-* accessibility-id           → ByBuilder.accessibilityId("qaid-...")
3. non-qaid resource-id (dual)       → ByBuilder.xpath("//*[@resource-id='...' or @name='...']")
4. static text (never translated)    → ByBuilder.xpath("//*[@text='...' or @label='...']")
NEVER: position index, class name alone, coordinate tap
```

---

## VI. Commit and Branch Rules

```
Branch format:    claude/<feature-name>-<4-digit-random>

  <feature-name> is derived from context (pick the most specific match):
    1. cURL / endpoint path  →  e.g. inventory-discount-price
    2. PRD feature title     →  e.g. promo-code-checkout
    3. Domain + action       →  e.g. booking-cancellation-policy
  <4-digit-random> is generated at branch creation time:
    bash: RAND=$(( RANDOM % 9000 + 1000 )); echo $RAND
    e.g.: claude/inventory-discount-price-4827
          claude/promo-code-checkout-1293

Commit format:    <type>(<scope>): <summary>
                  <blank line>
                  <body>
                  <blank line>
                  Co-authored-by: Claude <noreply@anthropic.com>

Types: test | feat | fix | refactor | docs | chore | perf
```

---

## VI-B. Pre-PR Mandatory Gate (ALL repos — API / UI / Mobile)

Every agent MUST complete this gate in order before creating a PR.
No step may be skipped. A PR created without passing this gate is INVALID.

```
STEP 1 — BRANCH FROM MAIN (always, no exceptions)
  git checkout main
  git pull origin main
  RAND=$(( RANDOM % 9000 + 1000 ))
  git checkout -b claude/<feature-name>-$RAND   # derive name from cURL path / PRD / domain
  # Examples:
  #   claude/inventory-discount-price-4827
  #   claude/promo-code-checkout-1293
  #   claude/booking-cancellation-policy-7541
  # OR if branch already exists:
  git fetch origin main
  git rebase origin/main               # rebase onto latest main — resolve any conflicts

STEP 2 — WRITE CODE
  Apply all changes following the layer rules in this constitution.

STEP 3 — REBASE AGAIN BEFORE COMMIT (pick up any new upstream changes)
  git fetch origin main
  git rebase origin/main
  # Resolve conflicts if any — NEVER use git merge

STEP 4 — COMPILE GATE (mandatory — must pass before any commit)
  mvn compile -q
  # If compile fails → fix ALL errors before proceeding
  # NEVER commit code that does not compile

STEP 5 — RUN NEW SCENARIOS ONLY (verify new tag passes)
  mvn test -Dcucumber.filter.tags="@<new-domain-tag> and @test" \
           -DthreadCount=1 -DenableApiLog=INFO
  # All new scenarios must PASS before committing
  # If any scenario fails → fix the failure, do NOT proceed to PR

STEP 6 — RUN SANITY SUITE (verify nothing is broken)
  mvn test -Dcucumber.filter.tags="@test-sanity and @test" -DthreadCount=5
  # All sanity scenarios must still PASS
  # If any existing sanity scenario breaks → fix the regression

STEP 7 — COMMIT AND PUSH
  git add <specific files — never git add -A>
  git commit -m "<type>(<scope>): <summary>"
  git push -u origin claude/<feature-name>-<4-digit-random>

STEP 8 — OPEN PR AGAINST MAIN
  gh pr create --base main --title "..." --body "..."
  # PR body must include:
  #   - What was changed and why
  #   - New tags added
  #   - mvn compile result: PASSED
  #   - New tag run result: PASSED (scenario count)
  #   - Sanity run result: PASSED (scenario count)
```

### Gate Rules

| Rule | Detail |
|------|--------|
| Branch name format | `claude/<feature-name>-<4-digit-random>` — name from cURL/PRD/domain |
| Always branch from `main` | Never branch from another feature branch |
| Always rebase, never merge | `git rebase origin/main` — never `git merge main` |
| Compile must pass | `mvn compile -q` exit code 0 — no exceptions |
| New tag must pass | Run `@<new-tag> and @test` — all scenarios green |
| Sanity must pass | Run `@test-sanity and @test` — no regressions |
| PR base is always `main` | `gh pr create --base main` — never against another branch |
| PR body must include run results | Compile PASSED + tag PASSED + sanity PASSED |

### Failure Handling

```
mvn compile fails?
  → Fix ALL compilation errors
  → Re-run mvn compile -q until exit 0
  → NEVER commit with compile errors

New tag run fails?
  → Read the failure output — identify root cause
  → Fix the step def / utility / feature file
  → Re-run the new tag until all scenarios pass
  → Do NOT disable or skip failing scenarios

Sanity run fails (regression)?
  → Determine if your change caused the regression
  → If YES → fix your change so sanity still passes
  → If NO  → investigate the existing failure before opening a PR
  → Do NOT open a PR with a broken sanity suite

Rebase has conflicts?
  → Resolve each conflict manually
  → Never use 'ours' strategy to silently discard upstream changes
  → After resolving: git add <files> && git rebase --continue
```

---

## VII. Agent Behaviour Rules

1. **READ before WRITE** — always read existing files before modifying them.
2. **SEARCH before CREATE** — always search for existing steps, POs, utilities before creating new ones.
3. **ASK before COMMIT** — always present the changes and ask "Should I commit?" unless the user explicitly said to commit automatically.
4. **NO PARTIAL STUBS** — never generate `// TODO: implement` stubs. Generate complete, working code or ask for clarification.
5. **ONE CONCERN PER FILE** — never mix API, UI, and mobile concerns in a single Java class.
6. **VERIFY COMPILATION** — `mvn compile -q` MUST pass before any commit. This is not optional.
7. **BRANCH FROM MAIN** — every new branch must be cut from the latest `main`. Always `git pull origin main` first.
8. **REBASE BEFORE PR** — always `git rebase origin/main` before pushing and opening a PR.
9. **RUN BEFORE PR** — new tag scenarios and sanity suite must both pass before a PR is opened.
10. **END-TO-END ON EVERY REQUEST** — when a user asks to create or update test cases, the agent MUST complete ALL six phases:
    - **Phase 0** Parse → **Phase 1** Collect sources → **Phase 2** Reuse protocol
    - **Phase 3** Write code → **Phase 4** Pre-PR gate → **Phase 5** Commit → **Phase 6** `gh pr create --base main`
    - A request is NOT complete until a GitHub PR URL is returned to the user.
    - Full protocol in `qa/api/agent/agent.md` → *Agent Request Handling Protocol*.
