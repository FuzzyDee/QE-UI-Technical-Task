# Solirius QE UI Technical Task

Your task is to create a functional automated UI test suite using JavaScript, TypeScript, or a language of your choice. We would prefer you to use tools like Playwright or Cypress. However should you opt to use a different tool, such as Selenium with Java, we will inquire as to your reasoning's into why you did not opt for an alternative framework or language.

There are no trick questions; we want to see your solution work, analyse your code structure, and understand your thought process.

## 📝 The Task - Part 1

On a public facing UK Government webpage 'Calculate your holiday entitlement', please write a working automated UI test suite. If the language/framework you decide to use supports BDD/Gherkin, you have the choice to use this or not. Though its usage is optional and therefore won't impact scoring.
An example feature file has been added to this repository should it be needed for reference.

You have autonomy on this task, the only remits are that you keep to the language and tools we have mentioned, that you provide a working solution and clear instructions on how to build and execute your solution.

We are looking for a demonstration of your technical skills, your ability to write a clear working solution that can be shared, and your 'tester mindset'.

The URL for 'Calculate your holiday entitlement': https://www.gov.uk/calculate-your-holiday-entitlement

### ✅ Part 1 Solution

This repository contains a working automated UI test suite built with **Playwright (JavaScript)** and **Cucumber/Gherkin**. The solution is designed to demonstrate:

- Page availability and key start-point checks
- Input validation behaviour (negative-path coverage)
- End-to-end entitlement calculation (positive-path coverage)
- A **BDD/Gherkin layer** using Cucumber for business-readable scenarios
- Cross-browser execution through Playwright projects (`chromium`, `firefox`, `webkit`)

#### Coverage summary

1. Start page loads and exposes the `Start now` control.
2. Validation error is shown when the first calculator question is submitted without an answer.
3. Full user journey for a regular worker with entitlement based on **days worked per week**, asserting the expected result:
   - 5 days per week
   - Full leave year
   - Result contains: `The statutory holiday entitlement is 28 days holiday.`
4. Irregular-hours / part-year accrual-related scenarios:
   - worker starting part way through the leave year
   - worker leaving part way through the leave year
5. Deep-link questionnaire validation for:
   - `https://www.gov.uk/calculate-your-holiday-entitlement/y/regular/days-worked-per-week/full-year/3.0`
   - validates the entitlement and the questionnaire summary shown on that page
6. Coverage for every `holiday entitlement based on` selection for a regular full-year worker:
   - `days worked per week`
   - `hours worked per week`
   - `annualised hours`
   - `compressed hours`
   - `shifts`

#### BDD and edge-case coverage

The `features/holiday-entitlement.feature` file includes:

- Happy-path entitlement calculation in Given/When/Then format
- First-question validation when user continues without selecting an answer
- Invalid days-worked values rejected (`0`, `8`, `abc`)
- Boundary validation where `7` days is accepted
- Irregular-hours first-year accrual guidance assertion
- Deep-link answer-summary verification against a fixed calculator URL
- Full-year basis-option coverage across all five entitlement types

#### Framework structure

- `features/holiday-entitlement.feature` → Gherkin scenarios (BDD source of truth)
- `features/step_definitions/holiday-entitlement.steps.js` → Cucumber + Playwright step definitions
- `tests/holiday-entitlement.spec.js` → Playwright spec suite aligned to the same BDD scenario intent
- `pages/` → Page Object Model classes (shared by BDD and Playwright tests)
- `support/` → shared constants and browser factory utilities
- `playwright.config.js` and `cucumber.js` → runner configuration

This provides two execution styles over the same user journeys:
- Business-readable BDD execution (`npm run test:bdd`)
- Standard Playwright spec execution (`npm run test:e2e`)

The BDD suite is also browser-selectable through `PW_BROWSER`, with npm shortcuts for:
- `chromium`
- `firefox`
- `webkit`

#### Build and run instructions

1. Install dependencies:
   ```bash
   npm install
   ```
2. Install Playwright browser binaries:
   ```bash
   npx playwright install chromium firefox webkit
   ```
3. Run tests headless:
   ```bash
   npm run test:e2e
   ```
4. (Optional) Run tests in headed mode:
   ```bash
   npm run test:e2e:headed
   ```
5. (Optional) Open the HTML report:
   ```bash
   npm run test:e2e:report
   ```

#### BDD / Gherkin execution

1. Run BDD tests headless:
   ```bash
   npm run test:bdd
   ```
2. (Optional) Run BDD tests headed:
   ```bash
   npm run test:bdd:headed
   ```
3. (Optional) Run BDD tests in parallel:
   ```bash
   npm run test:bdd:parallel
   ```
4. (Optional) Generate the BDD HTML report:
   ```bash
   npm run test:bdd:report
   ```
   Output: `reports/bdd-report.html`
5. (Optional) Run BDD tests in Firefox:
   ```bash
   npm run test:bdd:firefox
   ```
6. (Optional) Run BDD tests in WebKit:
   ```bash
   npm run test:bdd:webkit
   ```
7. (Optional) Run one BDD scenario (headed) by name:
   ```bash
   npm run test:bdd:headed -- --name "Successful full-year calculation for regular worker on 5 days per week"
   ```

#### Command selection guide

Use this as a quick guide for choosing the most appropriate command:

| Goal | Command | Notes |
|------|---------|-------|
| Fast BDD smoke (all scenarios) | `npm run test:bdd` | Fastest default for behaviour coverage |
| Debug one scenario visually | `npm run test:bdd:headed -- --name "<scenario name>"` | Best for step-by-step troubleshooting |
| BDD parallel execution | `npm run test:bdd:parallel` | Useful for faster CI feedback |
| Generate BDD HTML report | `npm run test:bdd:report` | Writes report to `reports/bdd-report.html` |
| BDD cross-browser (single browser target) | `npm run test:bdd:firefox` / `npm run test:bdd:webkit` | Runs same Gherkin scenarios in selected browser |
| Full cross-browser Playwright spec run | `npm run test:e2e` | Runs all spec tests across configured Playwright projects |
| Open Playwright HTML report | `npm run test:e2e:report` | Use after a Playwright run |

#### Latest execution status

- `npm run test:e2e` → **42 passed** (cross-browser Playwright execution across configured projects)
- `npm run test:bdd`
- `npm run test:bdd:headed` 
- `npm run test:bdd:report` 
- `npm run test:bdd:parallel`
- `npm run test:bdd:firefox` 
- `npm run test:bdd:webkit` 

## 🎢 Part 2 (bonus task)

At Solirius, we prioritise Accessibility. While we understand that not everyone may meet our understanding of the subject, we are eager to gauge your knowledge and awareness in this area.

Task two is to launch the basic web page we have created 'index.html' and provide us with a list of Accessibility issues/bugs you can find.

You can provide your list of answers anywhere you like, but tell us where you have put them. (e.g. within you README.md). Finally please provide at least one of them in the format of a Bug report. (doesn't have to be more then 1 in this format, the others can just be a quick list).

### ✅ Part 2 Findings

Accessibility findings are documented in this README, based on review of `public/index.html` and `public/index.css`.

#### Accessibility issue summary

1. **Form fields have no associated labels**
   - Inputs and textarea rely on placeholder text only.
   - Impact: screen-reader users may not get robust field purpose announcements.
   - WCAG references: 1.3.1 (Info and Relationships), 3.3.2 (Labels or Instructions).

2. **Image has no alt text**
   - The robot image is missing an `alt` attribute.
   - Impact: assistive technologies cannot announce meaningful alternative text (or explicitly ignore decorative imagery).
   - WCAG reference: 1.1.1 (Non-text Content).

3. **Insufficient placeholder contrast**
   - Placeholder colour `#aaaaaa` on white is low contrast.
   - Impact: low-vision users may struggle to read placeholder content.
   - WCAG reference: 1.4.3 (Contrast (Minimum)) and usability concerns for placeholder-only prompts.

4. **Missing document language metadata**
   - No `lang` attribute on the root `<html>` element.
   - Impact: screen readers may use incorrect pronunciation rules.
   - WCAG reference: 3.1.1 (Language of Page).

5. **Missing page title and semantic document metadata**
   - No `<title>` in the document `<head>`.
   - Impact: screen-reader users and browser/tab navigation lose important context.
   - WCAG reference: 2.4.2 (Page Titled).

6. **Layout likely fails reflow at 400% zoom / small screens**
   - Fixed widths (`800px`, `700px`) plus `overflow: hidden` risk clipped/off-screen content.
   - Impact: users with magnification or narrow viewports may lose content and horizontal access.
   - WCAG references: 1.4.10 (Reflow), 1.4.4 (Resize Text).

7. **Email field uses `type="text"` instead of `type="email"`**
   - Impact: reduced input assistance, weaker validation cues, and poorer mobile keyboard support.
   - WCAG reference: 1.3.5 (Identify Input Purpose) and general form usability best practice.

#### Example bug report

**Bug ID:** A11Y-001  
**Title:** Form inputs are missing programmatically associated labels  
**Severity:** High  
**Priority:** High  
**Environment:** Local page `http://localhost:8080/` (served via `npm start`)  
**Area:** Contact form

**Preconditions:**
- App is running locally.
- Page is opened in a browser with screen reader support (e.g. NVDA/JAWS/VoiceOver).

**Steps to Reproduce:**
1. Navigate to `http://localhost:8080/`.
2. Move focus through form controls using `Tab`, or use screen reader form navigation.
3. Listen to field announcements for name, email, and message fields.

**Expected Result:**
- Each field has a visible label and a programmatic association (`<label for=...>` / `id`), so assistive technologies announce a clear field name and purpose.

**Actual Result:**
- Fields are identified primarily by placeholder text; no associated labels are present.

**User Impact:**
- Screen-reader users may receive incomplete/fragile context.
- Placeholder text is not a reliable substitute for labels and may disappear once text is entered.

**Evidence / Code location:**
- `public/index.html`: text inputs and textarea are missing `<label>` elements.

**Suggested Fix:**
- Add explicit `<label>` elements for each form control.
- Link labels to controls via `for` and `id` attributes.
- Keep helpful hint text separate from labels where needed.

#### Page Launch Instructions

To launch the page locally, follow these simple steps:

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the application:
   ```bash
   npm start
   ```
3. Open your web browser and navigate to:
   ```bash
   http://localhost:8080/
   ```

## 🕗 Additional notes

There's no strict time limit for completing this task before the specified deadline given, we don't expect an extensive number of tests, but a well-rounded selection is appreciated.

If you have the time and inclination, feel free to attempt Task 2 (bonus task), also provide any additional thoughts on your framework solution, with any further considerations you would take in to account if you had more time.

## 📨 Presenting/Submitting Your Solution

Please download and email your solution from a private Github repository you have created and send the Zip back to us. Any issues please do get in touch with the recruiter you have been speaking with.
