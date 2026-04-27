---
name: ui_automation
description: "Selenium + Playwright + Cucumber (Java) skill for headout/celium — ByBuilder locators, waitForVisibility, genericMethod, Page Object extends BaseAutomation (FE), StepDef plain class."
version: 1.0.0
testingTypes: [E2E, Visual]
frameworks: [Selenium, Playwright, Cucumber, TestNG]
languages: [Java]
agents: [claude-code, cursor, copilot, windsurf]
repo: celium
baseClass: com.headout.base.fe.BaseAutomation
---

# Web UI Automation Skill — Selenium + Playwright + Cucumber (Java)

## Overview

Web UI tests in **celium** validate Headout's consumer site and Hub portal.
Pattern: **Feature → StepDef → Page Object (`<Page>PO`) using wrapper methods**

---

## Project Structure

```
celium/
└── src/test/java/com/headout/
    ├── base/
    │   ├── Test_Runner.java
    │   └── Failed_Test_Runner.java
    ├── pageobjects/
    │   ├── hub/                        # Hub portal page objects
    │   │   ├── LoginPO.java
    │   │   ├── HomePO.java
    │   │   ├── BookingDashboardPO.java
    │   │   ├── SchedulesDashboardPO.java
    │   │   └── ...
    │   └── ui/                         # Consumer site page objects
    │       ├── CommonPO.java
    │       ├── CalenderPO.java
    │       └── UserAccountPO.java
    ├── stepdefinitions/
    │   └── <domain>/
    │       └── <Feature>StepDef.java
    └── features/
        └── <domain>/<platform>/
            └── *.feature
```

---

## Framework Internals — What `BaseAutomation` (FE) Provides

Extending `com.headout.base.fe.BaseAutomation` gives every Page Object access to:

| Field | Type | Description |
|-------|------|-------------|
| `genericMethod` | `GenericMethodWrapper` | Clicks, types, getText, isDisplayed, sendKeys, getAttribute |
| `wait` | `WaitUtilityWrapper` | Visibility, clickability, page-load, hard-wait |
| `actionBuilderUtility` | `ActionBuilderWrapper` | Complex actions (hover, drag, ActionChains) |
| `jsUtil` | `JSUtilityWrapper` | JavaScript execution |
| `softAssertionUtil` | `ThreadLocal<SoftAssertionUtil>` | Soft assertions per thread |

**Step definitions do NOT extend `BaseAutomation`** — they instantiate Page Objects directly.

---

## Core Patterns

### 1. Locators — `ByBuilder`

All locators are **instance fields** (`ByBuilder`) in the Page Object class.
Never use `By.xpath` or `By.id` directly — always use `ByBuilder`.

```java
import com.headout.util.custom.ByBuilder;

// XPath locator (most common)
ByBuilder emailField   = ByBuilder.xpath("//input[@data-qa-marker='field-input-email']");
ByBuilder loginButton  = ByBuilder.xpath("//button[@data-qa-marker='Sign in']");
ByBuilder errorMessage = ByBuilder.xpath("//button[@aria-label='Try again']//parent::*//p");

// With dynamic replacement (use ${placeholder} in XPath)
ByBuilder dynamicItem = ByBuilder.xpath("//button[@data-qa-marker='menu-item-${name}']");
```

### 2. Interaction Methods via `genericMethod`

```java
// Navigate to URL
genericMethod.fe().goToPageURL(url);

// Click element
genericMethod.click(emailField);

// Type text (sendKeys)
genericMethod.sendKeys(emailField, "user@example.com");

// Get text
String text = genericMethod.getText(emailField);

// Check display
boolean shown = genericMethod.isDisplayed(emailField);

// Get attribute
String attr = genericMethod.getAttribute(emailField, "data-tooltip-hidden");

// Get all matching elements
List<WebElement> elements = genericMethod.getElements(emailField);

// Get current URL
String url = genericMethod.fe().getCurrentURL();

// JS click (use only when standard click fails)
genericMethod.jsClick(emailField);
```

### 3. Wait Methods via `wait`

```java
// Wait for element to be visible
wait.waitForVisibilityOfElement(emailField);

// Wait for element to be clickable
wait.waitForElementToBeClickable(loginButton);

// Wait for page to fully load
wait.waitForPageToLoadCompletely();

// Wait for element to disappear
wait.waitForInvisibilityOfElement(20, 5, errorMessage);  // (maxSec, intervalSec, locator)

// Hard wait (use sparingly — only when no other option)
wait.hardWait(10);  // seconds
```

### 4. Action Builder via `actionBuilderUtility`

```java
// Click using Actions chain (for elements that need hover first)
actionBuilderUtility.fe().clickByAction(dropdownMenu);

// Hover over element
actionBuilderUtility.fe().hoverOverElement(elementLocator);
```

### 5. Credentials from YAML

```java
import com.headout.common.YamlReader;

// Read from YAML app config: Users.<UserType>.<field>
String email    = YamlReader.getAppConfigValue("Users.Hub.Email");
String password = YamlReader.getAppConfigValue("Users.Hub.Password");

// Or with dynamic user type passed as parameter
String userEmail = YamlReader.getAppConfigValue("Users." + userType + ".Email");
```

---

## Page Object Pattern

### Writing a Page Object

```java
// src/test/java/com/headout/pageobjects/hub/LoginPO.java
package com.headout.pageobjects.hub;

import com.headout.base.fe.BaseAutomation;
import com.headout.base.common.SessionInitiator;
import com.headout.common.TestNGLogUtility;
import com.headout.common.YamlReader;
import com.headout.util.custom.ByBuilder;

public class LoginPO extends BaseAutomation {

    // Locators as ByBuilder instance fields
    ByBuilder textBoxEmail    = ByBuilder.xpath("//input[@data-qa-marker='field-input-email']");
    ByBuilder textBoxPassword = ByBuilder.xpath("//input[@data-qa-marker='field-input-password']");
    ByBuilder btnLogin        = ByBuilder.xpath("//button[@data-qa-marker=\"Sign in\"]");
    ByBuilder headoutIcon     = ByBuilder.xpath("//*[@data-framer-name='Logo_Dark_2x' or local-name()='svg']");
    ByBuilder expandSideBar   = ByBuilder.xpath("//button[@data-tooltip-content='Expand sidebar']");
    ByBuilder eleProfileIcon  = ByBuilder.xpath("//div[@data-qa-marker='user-dropdown-container']");
    ByBuilder eleLogout       = ByBuilder.xpath("//button[@data-qa-marker='menu-item-Logout']");
    ByBuilder getErrorMessage = ByBuilder.xpath("//button[@aria-label='Try again']//parent::*//p");

    // Navigate
    public void navigateToUrl(String url) {
        genericMethod.fe().goToPageURL(url);
        wait.waitForPageToLoadCompletely();
        TestNGLogUtility.info(genericMethod.fe().getCurrentURL());
    }

    // Fill credentials and submit
    public void fillUserCredentials(String user) {
        wait.waitForVisibilityOfElement(textBoxEmail);
        genericMethod.sendKeys(textBoxEmail,    YamlReader.getAppConfigValue("Users." + user + ".Email"));
        genericMethod.sendKeys(textBoxPassword, YamlReader.getAppConfigValue("Users." + user + ".Password"));
        genericMethod.click(btnLogin);
        wait.waitForVisibilityOfElement(headoutIcon);
        wait.waitForPageToLoadCompletely();
        wait.waitForInvisibilityOfElement(20, 5, getErrorMessage);
    }

    // Expand sidebar using Actions
    public void setExpandSideBar() {
        wait.waitForElementToBeClickable(expandSideBar);
        actionBuilderUtility.fe().clickByAction(expandSideBar);
    }

    // Verify login state
    public boolean verifyLogin(String user) {
        if (genericMethod.getAttribute(expandSideBar, "data-tooltip-hidden").equalsIgnoreCase("false")) {
            wait.waitForVisibilityOfElement(eleProfileIcon);
            wait.waitForElementToBeClickable(eleProfileIcon);
            genericMethod.click(eleProfileIcon);
            return genericMethod.isDisplayed(eleLogout);
        }
        return false;
    }
}
```

---

## Step Definition Pattern

Step definitions do **NOT** extend `BaseAutomation`. They instantiate POs directly.

```java
// src/test/java/com/headout/stepdefinitions/hub/LoginStepDef.java
package com.headout.stepdefinitions.hub;

import com.headout.common.TestNGLogUtility;
import com.headout.common.URLBuilder;
import com.headout.pageobjects.hub.LoginPO;
import com.headout.pageobjects.hub.BookingDashboardPO;
import com.headout.pageobjects.ui.HomePO;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.testng.Assert;

public class LoginStepDef {

    LoginPO            loginPO            = new LoginPO();
    HomePO             homePO             = new HomePO();
    BookingDashboardPO bookingDashboardPO = new BookingDashboardPO();

    @Given("User opens the application {string} and {string}")
    public void userOpensTheApplication(String repo, String module) {
        TestNGLogUtility.info("User opens the application " + repo + " and " + module
            + " -> thread: " + Thread.currentThread().getName()
            + Thread.currentThread().getId());
        loginPO.navigateToUrl(URLBuilder.getURL(repo, module));
        if (module.equalsIgnoreCase("ui")) {
            homePO.validateIfGettingTimeoutError();
            homePO.checkIfErrorMessageShowing();
        }
    }

    @Then("User logins with {string}")
    public void userLoginsWith(String user) {
        loginPO.fillUserCredentials(user);
        TestNGLogUtility.info("User Logins Successfully");
    }

    @And("verify {string} login sucessfully on hub")
    public void verifyLogin(String user) {
        Assert.assertTrue(loginPO.verifyLogin(user));
        Assert.assertTrue(loginPO.verifyUsernameAndEmail(user));
    }

    @When("User opens {string} page")
    public void userOpensTreatmentPage(String exp) {
        TestNGLogUtility.info("User opens the " + exp + " page " + Thread.currentThread().getName());
        loginPO.openTreatmentPage(exp);
    }
}
```

---

## Test Runner

```java
@CucumberOptions(
    features   = "src/test/java/com/headout/features",
    glue       = {"com.headout.stepdefinitions", "com.headout.base"},
    tags       = "@test",
    publish    = false,
    plugin     = {
        "json:target/cucumber-reports/Cucumber.json",
        "html:target/cucumber-reports/cucumber.html",
        "rerun:rerun/failed_scenarios.txt",
        "com.epam.reportportal.cucumber.ScenarioReporter"
    },
    monochrome = true
)
public class Test_Runner extends AbstractTestNGCucumberTests {
    private DataSetupForODE dataSetupForODE = new DataSetupForODE();

    @DataProvider(parallel = true)
    public Object[][] scenarios() { return testNGCucumberRunner.provideScenarios(); }

    @BeforeSuite
    public void setProperty() {
        dataSetupForODE.setupReportDataSet();
        dataSetupForODE.setupEnvDetails();
        dataSetupForODE.setupKirbyEnvironment();
    }

    @Before(order = 0)
    public void initTest(Scenario scenario) {
        CeliumDataHandler.getInstance().clearDataProps();
        SessionInitiator.getInstance().setScenario(scenario);
        SessionInitiator.getInstance().configureDriverForWeb();   // start browser
        SessionInitiator.getInstance().initializeSession(scenario);
        URLBuilders.setEndPoint();
    }

    @After(order = 0)
    public void tearTestDown(Scenario scenario) {
        if (scenario.isFailed()) {
            failedTests.add(scenario.getName());
            CeliumDataHandler.getInstance().commonApiUtility().removeCurrentThreadsFromHold();
        }
        SessionInitiator.getInstance().closeSession(scenario);    // quit browser
        CeliumDataHandler.getInstance().clearDataProps();
    }

    @AfterSuite
    public void tearDown() {
        runFailedTestRunnerClass();
        SessionInitiator.getInstance().sentSlackReport(reportPath);
        dataSetupForODE.sentDataToExcelSheet();
        dataSetupForODE.visualDiffAfterSuite();
        CacheMechanism.getInstance().removeAllData();
    }
}
```

---

## BDD Feature File

```gherkin
# src/test/java/com/headout/features/hub/login/hub-login.feature
@test @hub @login
Feature: Hub Partner Portal Login

  @smoke
  Scenario: Successful login with valid credentials
    Given User opens the application "hub" and "hub"
    Then User logins with "Admin"
    And verify "Admin" login sucessfully on hub

  @regression
  Scenario: User navigates to treatment page
    Given User opens the application "hub" and "hub"
    When User opens "experiment-page" page
    Then verify page loaded correctly
```

---

## Data Handler — CeliumDataHandler

```java
import com.headout.common.CeliumDataHandler;

// Store scenario-level data
CeliumDataHandler.getInstance().setData("productId", "12345");

// Read scenario-level data
String productId = CeliumDataHandler.getInstance().getData("productId");

// Clear at start of each scenario (done by Test_Runner @Before)
CeliumDataHandler.getInstance().clearDataProps();
```

---

## Run Commands

```bash
mvn test -Dcucumber.filter.tags="@test and @hub"   -DBROWSER=chrome    -DthreadCount=10
mvn test -Dcucumber.filter.tags="@test and @ui"    -DBROWSER=firefox
mvn test -Dcucumber.filter.tags="@test"            -DBROWSER=playwright
mvn test -Dcucumber.filter.tags="@ode-deimos-smoke-1 and @dweb"
mvn test -DSELENIUM_SERVER=remote -DSELENIUM_SERVER_HOST=http://grid:4444/wd/hub
```

---

## Agent Rules

1. Page Objects extend `com.headout.base.fe.BaseAutomation`.
2. Step definitions do **NOT** extend `BaseAutomation` — they instantiate POs.
3. Use `ByBuilder.xpath("...")` for ALL locators — never `By.xpath` or `By.id`.
4. Locators are instance fields (not `static final`) in PO classes.
5. Always use `wait.waitForVisibilityOfElement()` before interacting — NEVER `Thread.sleep()`.
6. Use `genericMethod.sendKeys()` for typing, `genericMethod.click()` for clicking.
7. Use `genericMethod.fe().goToPageURL(url)` for navigation followed by `wait.waitForPageToLoadCompletely()`.
8. Use `YamlReader.getAppConfigValue("Users.<type>.<field>")` for user credentials.
9. Use `URLBuilder.getURL(repo, module)` for building page URLs.
10. Use `actionBuilderUtility.fe().clickByAction()` for Action Chain interactions.
