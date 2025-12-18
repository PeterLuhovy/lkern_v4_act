---
id: testing-visual
title: Visual Regression Testing (Optional)
sidebar_label: Visual Testing
sidebar_position: 5
---

# ================================================================
# Visual Regression Testing Guide (OPTIONAL - NOT IMPLEMENTED)
# ================================================================
# File: L:\system\lkern_codebase_v4_act\docs\programming\testing-visual.md
# Version: 1.0.0
# Created: 2025-10-19
# Updated: 2025-10-19
# Project: BOSS (Business Operating System Service)
# Developer: BOSSystems s.r.o.
#
# Description:
#   Overview of visual regression testing (screenshot comparison).
#   This document explains what visual regression testing is and
#   why L-KERN v4 does NOT implement it due to high maintenance cost.
# ================================================================

---

## 🚨 IMPORTANT NOTE

**Visual regression testing is OPTIONAL and currently NOT IMPLEMENTED in L-KERN v4.**

**Why?**
- **High maintenance cost** - Every CSS change breaks screenshots
- **ERP system nature** - L-KERN is internal business software, not customer-facing marketing site
- **Better alternatives** - Manual visual review during PR + component testing sufficient
- **Limited benefit** - High effort with minimal value for internal ERP applications

**Recommendation:** Focus on **unit tests**, **integration tests**, and **manual visual review** instead.

---

## 📋 What is Visual Regression Testing?

Visual regression testing compares **screenshots** of UI components before and after code changes to detect unintended visual changes.

### How It Works

1. **Baseline capture** - Take screenshots of all UI components (initial state)
2. **Code changes** - Make changes to CSS, components, or layout
3. **New screenshots** - Capture screenshots after changes
4. **Comparison** - Automatically compare baseline vs. new screenshots pixel-by-pixel
5. **Review differences** - Manually approve or reject visual changes

### Example Workflow

```bash
# 1. Capture baseline screenshots
npm run test:visual:baseline

# 2. Make CSS changes
# ... edit component styles ...

# 3. Run visual regression tests
npm run test:visual

# 4. Review visual differences
npm run test:visual:review

# 5. Approve changes (update baseline)
npm run test:visual:approve
```

---

## 🎯 When to Use Visual Regression Testing

Visual regression testing is **useful for**:

### ✅ Good Use Cases

1. **Design Systems & Component Libraries**
   - Public component libraries (Material-UI, Ant Design)
   - Shared design system across multiple products
   - High stability requirements for reusable components

2. **Customer-Facing Marketing Websites**
   - Landing pages with precise design requirements
   - E-commerce product pages
   - Brand websites where visual consistency is critical

3. **Pixel-Perfect UI Requirements**
   - Apps with strict design specifications
   - White-label products with multiple themes
   - High-stakes applications (banking, medical)

### ❌ Poor Use Cases (Like L-KERN)

1. **Internal ERP Systems**
   - Business applications used by employees
   - Frequent UI iterations and improvements
   - Functional correctness > pixel perfection

2. **Rapid Development Environments**
   - Prototypes and MVPs
   - Startups with evolving design
   - Projects with frequent CSS refactoring

3. **Low-Traffic Internal Tools**
   - Admin dashboards
   - Configuration panels
   - Developer tools

**L-KERN is an internal ERP system** → Visual regression testing adds more cost than value.

---

## 🛠️ Visual Regression Tools Overview

### Popular Tools

| Tool | Description | Best For | Pricing |
|------|-------------|----------|---------|
| **[Chromatic](https://www.chromatic.com/)** | Storybook-based visual testing | Component libraries | $149/month (5000 snapshots) |
| **[Percy](https://percy.io/)** | Visual testing platform by BrowserStack | Web apps & components | $319/month (10k snapshots) |
| **[BackstopJS](https://github.com/garris/BackstopJS)** | Open-source screenshot comparison | Self-hosted projects | Free (open-source) |
| **[Playwright Visual Comparisons](https://playwright.dev/docs/test-snapshots)** | Built into Playwright | E2E test suites | Free (built-in) |
| **[Puppeteer + Pixelmatch](https://github.com/mapbox/pixelmatch)** | DIY solution | Custom implementations | Free (open-source) |

---

## 📖 Example: Chromatic Setup (Reference Only)

**Note:** This is for educational purposes. L-KERN does NOT implement this.

### 1. Install Chromatic

```bash
npm install --save-dev chromatic
```

### 2. Configure Storybook

```javascript
// .storybook/main.ts
export default {
  stories: ['../src/**/*.stories.tsx'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: '@storybook/react-vite',
};
```

### 3. Add Chromatic Script

```json
// package.json
{
  "scripts": {
    "chromatic": "chromatic --project-token=YOUR_PROJECT_TOKEN"
  }
}
```

### 4. Run Visual Tests

```bash
npm run chromatic
```

### 5. Review Visual Changes

Chromatic uploads screenshots to cloud and shows visual diffs in web UI.

---

## ⚖️ Trade-offs: Visual Regression Testing

### ✅ Pros

1. **Catches Visual Regressions**
   - Detects unintended CSS changes
   - Prevents "invisible" bugs (wrong colors, broken layouts)
   - Protects against accidental design changes

2. **Automated Visual QA**
   - No need for manual screenshot comparison
   - Consistent visual checks across all components
   - Fast feedback loop in CI/CD

3. **Design System Stability**
   - Ensures component library consistency
   - Prevents breaking changes in shared components
   - Documents visual changes over time

### ❌ Cons (Why L-KERN Skips It)

1. **High Maintenance Cost**
   - Every CSS change requires manual review and approval
   - Screenshots break on intentional design updates
   - False positives from font rendering, browser differences

2. **Slow Test Execution**
   - Screenshot capture is slow (5-10 seconds per component)
   - Large test suites take 10+ minutes to run
   - Cloud services add network latency

3. **Expensive for Large Codebases**
   - Cloud services charge per screenshot
   - L-KERN has 100+ components → high monthly cost
   - Self-hosted solutions require infrastructure

4. **Limited Value for Internal ERP**
   - Users care about functionality, not pixel perfection
   - Manual visual review during PR is sufficient
   - Better ROI from functional testing

---

## 🎯 L-KERN Testing Strategy (What We Use Instead)

Since L-KERN is an **internal ERP system**, we prioritize **functional correctness** over **pixel-perfect visuals**.

### Our Testing Approach

1. **Component Testing (Vitest)**
   - Test component behavior and state
   - Verify correct data rendering
   - Check accessibility (ARIA attributes)

2. **Integration Testing (Vitest + React Testing Library)**
   - Test user interactions (click, type, submit)
   - Verify form validation and error handling
   - Test API integration

3. **Manual Visual Review During PR**
   - Developer checks visual changes in browser
   - PR reviewer validates UI changes manually
   - Storybook used for component documentation

4. **End-to-End Testing (Playwright)** (Future)
   - Test critical user flows
   - Verify multi-page interactions
   - Check production-like behavior

**Result:** Lower maintenance cost, faster development, sufficient quality for internal ERP.

---

## 📚 Resources & Further Reading

### Official Documentation

- **Chromatic:** https://www.chromatic.com/docs
- **Percy:** https://docs.percy.io/
- **BackstopJS:** https://github.com/garris/BackstopJS
- **Playwright Visual Comparisons:** https://playwright.dev/docs/test-snapshots

### Articles & Guides

- **Visual Regression Testing Guide (Smashing Magazine):**
  https://www.smashingmagazine.com/2015/09/visual-regression-testing/

- **When NOT to Use Visual Regression Testing:**
  https://www.chromatic.com/blog/visual-testing-best-practices/

- **Component Visual Testing (Storybook):**
  https://storybook.js.org/docs/react/writing-tests/visual-testing

### Open Source Tools

- **Pixelmatch (Screenshot Comparison Library):**
  https://github.com/mapbox/pixelmatch

- **Puppeteer:**
  https://pptr.dev/

- **Playwright:**
  https://playwright.dev/

---

## 🔗 Related Documentation

- **[testing-guide.md](testing-guide.md)** - Overall testing strategy for L-KERN v4
- **[testing-overview.md](testing-overview.md)** - Testing philosophy and tools overview
- **[code-examples.md](code-examples.md)** - Practical testing examples (Vitest, React Testing Library)
- **[frontend-standards.md](frontend-standards.md)** - Frontend development standards

---

## 📝 Summary

**Visual regression testing is OPTIONAL and NOT IMPLEMENTED in L-KERN v4.**

**Why?**
- High maintenance cost (screenshots break on every CSS change)
- L-KERN is internal ERP, not customer-facing marketing site
- Better ROI from component testing + manual visual review

**When to Consider It:**
- Building public design system or component library
- Customer-facing website with strict branding requirements
- High-budget project with dedicated QA team

**For L-KERN, we use:**
- Component testing (Vitest + React Testing Library)
- Manual visual review during PR
- Storybook for component documentation

**If you need visual regression testing in the future**, this document provides starting point and tool references.

---

**Last Updated:** 2025-10-19
**Status:** OPTIONAL - NOT IMPLEMENTED
**Recommended Alternative:** Component testing + manual visual review
