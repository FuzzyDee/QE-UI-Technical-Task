# Solirius QE UI Technical Task

Your task is to create a functional automated UI test suite using JavaScript, TypeScript, or a language of your choice. We would prefer you to use tools like Playwright or Cypress. However, should you opt to use a different tool, such as Selenium with Java, we will inquire as to your reasoning into why you did not opt for an alternative framework or language.

There are no trick questions; we want to see your solution work, analyse your code structure, and understand your thought process.

## 📝 The Task - Part 1

On the public facing UK Government webpage 'Calculate your holiday entitlement', write a working automated UI test suite.

The URL for 'Calculate your holiday entitlement': https://www.gov.uk/calculate-your-holiday-entitlement

### ✅ Part 1 Solution

**Built with Playwright (TypeScript) and Cucumber/Gherkin**

A fully migrated TypeScript test framework featuring:
- Page Object Model with strict typing and discriminated unions
- BDD and Playwright spec execution over shared infrastructure  
- Cross-platform npm scripts (Windows/macOS/Linux)
- Full cross-browser support (chromium, firefox, webkit)

#### Test Coverage

**Happy Path:** Full user journey for regular worker with 5 days/week; irregular-hours accrual scenarios (starting/leaving mid-year); deep-link validation  
**Validation:** First-question enforcement; invalid day boundaries (0, 8, abc); valid boundary at 7 days  
**Entitlement Basis:** All five scenarios (days worked per week, hours worked per week, annualised hours, compressed hours, shifts)  
**Execution:** 42 Playwright tests across 3 browsers; 14 Cucumber scenarios (113 steps)

#### Architecture

| Component | Purpose |
|-----------|---------|
| `pages/*.ts` | Page Object Model with strict TypeScript typing |
| `support/` | Constants, browser factory, type definitions |
| `features/support/custom-world.ts` | Typed Cucumber world constructor |
| `features/step_definitions/*.ts` | Cucumber step bindings |
| `tests/*.ts` | Playwright native specs |
| `playwright.config.ts` | Cross-browser Playwright configuration |

Both BDD (Cucumber) and Playwright specs share page objects and domain model. Cross-platform env var support via `cross-env` npm package.

#### Quick Start

```bash
# Install and verify
npm install
npm run typecheck
npx playwright install chromium firefox webkit

# Run tests
npm run test:e2e    # 42 Playwright tests (headless)
npm run test:bdd    # 14 Cucumber scenarios (headless)

# View HTML reports
npm run test:e2e:report
npm run test:bdd:report
```

#### Command Reference

| Goal | Command |
|------|---------|
| **Playwright** | |
| Headless run | `npm run test:e2e` |
| Headed (visible browser) | `npm run test:e2e:headed` |
| View HTML report | `npm run test:e2e:report` |
| **Cucumber BDD** | |
| Headless run | `npm run test:bdd` |
| Headed run | `npm run test:bdd:headed` |
| Parallel execution | `npm run test:bdd:parallel` |
| Specific browser (chromium/firefox/webkit) | `npm run test:bdd:chromium` |
| Run specific scenario | `npm run test:bdd:headed -- --name "<name>"` |
| Generate HTML report | `npm run test:bdd:report` |
| **TypeScript** | |
| Type check (no emit) | `npm run typecheck` |

#### Latest Test Results

All tests passing:
- `npm run test:e2e` → 42 passed (Playwright cross-browser)
- `npm run test:bdd` → 14 scenarios passed, 113 steps passed (Cucumber)

## 🎢 Part 2 (Bonus Task)

At Solirius, we prioritise Accessibility. While we understand that not everyone may meet our understanding of the subject, we are eager to gauge your knowledge and awareness in this area.

Task two is to launch the basic web page we have created 'index.html' and provide us with a list of Accessibility issues/bugs you can find.

### ✅ Part 2 Findings

Accessibility findings are documented below, based on review of `public/index.html` and `public/index.css`.

#### Accessibility Issue Summary

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
   - WCAG reference: 1.4.3 (Contrast (Minimum)).

4. **Missing document language metadata**
   - No `lang` attribute on the root `<html>` element.
   - Impact: screen readers may use incorrect pronunciation rules.
   - WCAG reference: 3.1.1 (Language of Page).

5. **Missing page title and semantic document metadata**
   - No `<title>` in the document `<head>`.
   - Impact: screen-reader users and browser/tab navigation lose important context.
   - WCAG reference: 2.4.2 (Page Titled).

6. **Layout fails reflow at 400% zoom / small screens**
   - Fixed widths (`800px`, `700px`) plus `overflow: hidden` risk clipped/off-screen content.
   - Impact: users with magnification or narrow viewports may lose content and horizontal access.
   - WCAG references: 1.4.10 (Reflow), 1.4.4 (Resize Text).

7. **Email field uses `type="text"` instead of `type="email"`**
   - Impact: reduced input assistance, weaker validation cues, and poorer mobile keyboard support.
   - WCAG reference: 1.3.5 (Identify Input Purpose).

#### Example Bug Report

**Bug ID:** A11Y-001  
**Title:** Form inputs are missing programmatically associated labels  
**Severity:** High | **Priority:** High  
**Environment:** Local page `http://localhost:8080/` (served via `npm start`)

**Preconditions:**
- App is running locally.
- Page is opened in a browser with screen reader support (e.g. NVDA/JAWS/VoiceOver).

**Steps to Reproduce:**
1. Navigate to `http://localhost:8080/`.
2. Move focus through form controls using Tab, or use screen reader form navigation.
3. Listen to field announcements for name, email, and message fields.

**Expected Result:**
- Each field has a visible label and a programmatic association (`<label for="...">` / `id`), so assistive technologies announce a clear field name and purpose.

**Actual Result:**
- Fields are identified primarily by placeholder text; no associated labels are present.

**User Impact:**
- Screen-reader users receive incomplete/fragile context.
- Placeholder text is not a reliable substitute for labels and disappears once text is entered.

**Suggested Fix:**
- Add explicit `<label>` elements for each form control.
- Link labels to controls via `for` and `id` attributes.
- Keep helpful hint text separate from labels where needed.

#### Page Launch Instructions

To launch the page locally:

```bash
npm install
npm start
```

Then navigate to `http://localhost:8080/` in your web browser.

## 📨 Additional Notes

There is no strict time limit for this task before the specified deadline. We don't expect an extensive number of tests, but a well-rounded selection is appreciated.

If you have the time and inclination, we welcome your thoughts on the framework solution and any further considerations you would take into account if you had more time.

## 📬 Submitting Your Solution

Please download and email your solution from a private Github repository you have created and send the Zip back to us. Any issues please get in touch with the recruiter you have been speaking with.
