# ================================================================
# L-KERN v4 - Testing Overview
# ================================================================
# File: L:\system\lkern_codebase_v4_act\docs\programming\testing-overview.md
# Version: 2.0.0
# Created: 2025-10-19
# Updated: 2025-10-19
# Project: BOSS (Business Operating System Service)
# Developer: BOSSystems s.r.o.
#
# Description:
#   Main testing documentation hub for L-KERN v4. Provides overview
#   of testing strategy, test types, tools, and links to detailed
#   guides for each testing approach.
# ================================================================

---

## 📋 Overview

This is the **main testing documentation** for L-KERN v4 project.

**Testing Philosophy:** Write tests that give **confidence** without slowing development. Test **user behavior**, not **implementation details**.

**Documentation Structure:**
- **This file**: Testing strategy, tools, quick start
- **Detailed guides**: Specific testing types (unit, integration, E2E, visual, best practices)

---

## 🎯 Testing Strategy

### Testing Pyramid (L-KERN v4)

```
         /\
        /E2E\         ← 5-10% - Critical user journeys
       /------\
      /Integr.\      ← 40-50% - Components + API stubs
     /----------\
    /   Unit     \   ← 40-50% - Business logic, utilities
   /--------------\
```

**Ratios Explained:**

| Test Type | Percentage | Speed | Cost | When to Use |
|-----------|-----------|-------|------|-------------|
| **Unit** | 40-50% | ⚡ Fast (ms) | 💰 Low | Pure functions, utilities, hooks |
| **Integration** | 40-50% | ⚡ Medium (100ms) | 💰💰 Medium | Components + API, parent ↔ child |
| **E2E** | 5-10% | 🐌 Slow (seconds) | 💰💰💰 High | Critical flows, authentication |

---

## 🛠️ Testing Tools

### Frontend Stack

| Tool | Purpose | Version |
|------|---------|---------|
| **Vitest** | Test runner (modern Jest alternative) | Latest |
| **React Testing Library** | Component testing (user-centric) | Latest |
| **@testing-library/user-event** | Realistic user interactions | Latest |
| **@testing-library/jest-dom** | DOM matchers (toBeInTheDocument) | Latest |
| **MSW** | API mocking (Mock Service Worker) | Latest |
| **Playwright** | E2E testing (cross-browser) | Latest |

### Backend Stack

| Tool | Purpose | Version |
|------|---------|---------|
| **pytest** | Test runner | Latest |
| **pytest-asyncio** | Async test support | Latest |
| **pytest-cov** | Coverage reporting | Latest |
| **httpx** | HTTP client for API tests | Latest |
| **TestClient** | FastAPI test client | Built-in |

---

## 📚 Testing Guides (Detailed Documentation)

### 1. Unit Testing
**File:** [testing-unit.md](testing-unit.md)

**What:** Test individual functions/components in **complete isolation**.

**Examples:**
- Utility functions (formatPhoneNumber, validateEmail)
- Custom hooks (useModalWizard, useToast)
- Business logic (validation, calculations)
- Pure React components (Button, Input)

**Tools:** Vitest + React Testing Library (frontend), pytest (backend)

**Read guide:** [testing-unit.md](testing-unit.md)

---

### 2. Integration Testing
**File:** [testing-integration.md](testing-integration.md)

**What:** Test how **multiple components work together** or **components with APIs**.

**Examples:**
- ContactForm + API stub (test form submission)
- ContactList + API stub (test data fetching)
- Modal + Form + Validation (test wizard workflow)

**Tools:** Vitest + RTL + MSW (frontend), pytest + TestClient (backend)

**Read guide:** [testing-integration.md](testing-integration.md)

---

### 3. E2E Testing (End-to-End)
**File:** [testing-e2e.md](testing-e2e.md)

**What:** Test **complete user flows** from browser perspective (real browser, real server).

**Examples:**
- Login flow (email + password → dashboard)
- Create contact (navigate → open modal → fill form → save → verify)
- Search & filter (type search → results update → click filter → verify)

**Tools:** Playwright (cross-browser)

**Read guide:** [testing-e2e.md](testing-e2e.md)

---

### 4. Visual Regression Testing
**File:** [testing-visual.md](testing-visual.md)

**What:** Detect **unintended UI changes** via screenshot comparison.

**Status:** ⚠️ **OPTIONAL** - High maintenance cost, only for design systems.

**Tools:** Chromatic, Percy (not currently implemented)

**Read guide:** [testing-visual.md](testing-visual.md)

---

### 5. Testing Best Practices
**File:** [testing-best-practices.md](testing-best-practices.md)

**Topics:**
- Test isolation (beforeEach, afterEach)
- Flaky test prevention (race conditions, timing)
- Coverage requirements (90% UI, 95% API)
- Naming conventions (test_create_contact_with_duplicate_email)
- Arrange-Act-Assert pattern

**Read guide:** [testing-best-practices.md](testing-best-practices.md)

---

## ⚡ Quick Start

### Frontend Testing

**1. Install dependencies:**
```bash
cd apps/web-ui
npm install -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom msw
```

**2. Run tests:**
```bash
# All tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage

# Docker
docker exec lkms201-web-ui npm run test
```

**3. Write your first test:**
```typescript
// Button.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

test('calls onClick when clicked', async () => {
  const onClick = vi.fn();
  render(<Button onClick={onClick}>Click me</Button>);

  await userEvent.click(screen.getByRole('button'));

  expect(onClick).toHaveBeenCalledTimes(1);
});
```

**See full guide:** [testing-unit.md](testing-unit.md)

---

### Backend Testing

**1. Install dependencies:**
```bash
cd services/lkms101-contacts
pip install pytest pytest-asyncio pytest-cov httpx
```

**2. Run tests:**
```bash
# All tests
pytest

# Coverage
pytest --cov=app --cov-report=html tests/

# Docker
docker exec lkms101-contacts pytest
```

**3. Write your first test:**
```python
# test_api.py
def test_create_contact_success(client):
    response = client.post(
        "/api/v1/contacts",
        json={"name": "John Doe", "email": "john@example.com"}
    )

    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "John Doe"
    assert "id" in data
```

**See full guide:** [testing-unit.md](testing-unit.md)

---

## 📊 Coverage Requirements

**L-KERN v4 Targets:**

| Code Type | Minimum Coverage | Ideal Coverage |
|-----------|------------------|----------------|
| **UI Components** | 90% | 95%+ |
| **API Endpoints** | 95% | 98%+ |
| **Business Logic** | 95% | 98%+ |
| **Utilities** | 80% | 90%+ |
| **Database Models** | 85% | 90%+ |

**Why these targets?**
- **UI Components (90%)**: User-facing code is critical
- **API Endpoints (95%)**: Business logic must be robust
- **Utilities (80%)**: Helper functions are lower risk

**Check coverage:**
```bash
# Frontend
npm run test:coverage

# Backend
pytest --cov=app --cov-report=html tests/
```

---

## 🎯 When to Use Each Test Type?

### Decision Tree

```
Is it a pure function (no DOM, no API)?
├─ YES → Unit Test
└─ NO → Continue...

Does it interact with an API?
├─ YES → Integration Test (with MSW)
└─ NO → Continue...

Does it involve multiple pages or authentication?
├─ YES → E2E Test (with Playwright)
└─ NO → Unit Test (if single component)
```

### Examples by Feature

**Feature: Contact Form**

| Test Type | What to Test | File |
|-----------|-------------|------|
| **Unit** | Validation logic (email format, phone format) | `validateEmail.test.ts` |
| **Integration** | Form submission + API stub | `ContactForm.test.tsx` |
| **E2E** | Full flow: navigate → open modal → fill → save → verify | `contacts.spec.ts` |

**Feature: Authentication**

| Test Type | What to Test | File |
|-----------|-------------|------|
| **Unit** | Password hash, JWT decode | `auth.test.ts` |
| **Integration** | Login API endpoint + test DB | `test_auth_api.py` |
| **E2E** | Login flow: email + password → dashboard redirect | `auth.spec.ts` |

---

## 🔍 Test File Structure

### Frontend (`apps/web-ui/`)

```
src/
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.module.css
│   │   ├── Button.test.tsx          ← Unit tests
│   │   └── index.ts
│   └── ContactForm/
│       ├── ContactForm.tsx
│       ├── ContactForm.module.css
│       ├── ContactForm.test.tsx     ← Integration tests (with MSW)
│       └── index.ts
├── utils/
│   ├── phoneUtils/
│   │   ├── phoneUtils.ts
│   │   ├── phoneUtils.test.ts       ← Unit tests
│   │   └── index.ts
└── e2e/                              ← E2E tests (Playwright)
    ├── contacts.spec.ts
    ├── auth.spec.ts
    └── search.spec.ts
```

### Backend (`services/lkms101-contacts/`)

```
app/
├── models/
│   └── contact.py
├── routers/
│   └── contacts.py
├── services/
│   └── contact_service.py
└── tests/
    ├── conftest.py                   ← Test fixtures
    ├── test_contact_model.py         ← Unit tests (models)
    ├── test_contact_service.py       ← Unit tests (business logic)
    ├── test_contact_api.py           ← Integration tests (API + DB)
    └── test_contact_grpc.py          ← Integration tests (gRPC)
```

---

## 🚀 CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm install
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v3  # Upload coverage

  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - run: pip install -r requirements.txt
      - run: pytest --cov=app --cov-report=xml
      - uses: codecov/codecov-action@v3  # Upload coverage

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npx playwright install
      - run: npm run test:e2e
```

---

## 📝 Testing Checklist (New Feature)

Before merging a new feature, ensure:

### Code Written
- [ ] Feature code implemented
- [ ] Unit tests written (40-50% of tests)
- [ ] Integration tests written (40-50% of tests)
- [ ] E2E tests written for critical flows (5-10% of tests)

### Coverage Requirements Met
- [ ] UI components: 90%+ coverage
- [ ] API endpoints: 95%+ coverage
- [ ] Business logic: 95%+ coverage

### Quality Checks
- [ ] All tests passing locally
- [ ] All tests passing in CI/CD
- [ ] No flaky tests (run 3x to verify)
- [ ] Coverage report reviewed

### Documentation
- [ ] Test scenarios documented (if complex)
- [ ] Test data factories created (if needed)
- [ ] Mock handlers added to MSW (if API integration)

---

## 🆘 Common Issues & Solutions

### Issue 1: Tests Fail Locally but Pass in CI

**Cause:** Environment differences (NODE_ENV, timezone, locale)

**Solution:**
```typescript
// Set environment variables in test
process.env.NODE_ENV = 'test';
process.env.TZ = 'UTC';
```

---

### Issue 2: Tests are Flaky (Pass/Fail Randomly)

**Cause:** Race conditions, async timing

**Solution:** Use `waitFor()` or `findBy*` queries

```typescript
// ❌ WRONG - Flaky
expect(screen.getByText('Loaded')).toBeInTheDocument();

// ✅ CORRECT - Waits for element
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});

// ✅ BETTER - findBy waits automatically
expect(await screen.findByText('Loaded')).toBeInTheDocument();
```

**Full guide:** [testing-best-practices.md](testing-best-practices.md#flaky-tests)

---

### Issue 3: Mock Not Working (API Still Called)

**Cause:** MSW server not started or handlers not registered

**Solution:** Verify test setup

```typescript
// vitest.setup.ts
import { setupServer } from 'msw/node';
import { handlers } from './mocks/handlers';

export const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

**Full guide:** [testing-integration.md](testing-integration.md#msw-setup)

---

## 📚 External Resources

### Official Documentation
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/)
- [pytest Documentation](https://docs.pytest.org/)
- [MSW Documentation](https://mswjs.io/)

### Articles & Guides
- Kent C. Dodds - Common Testing Mistakes
- Gil Tayar - Testing Your Frontend Code (5-part series)
- Testing JavaScript (testingjavascript.com)

### L-KERN v4 Related Docs
- [frontend-standards.md](frontend-standards.md) - React/TypeScript patterns
- [backend-standards.md](backend-standards.md) - Python/FastAPI patterns
- [code-examples.md](code-examples.md) - Practical code examples

---

## 🎯 Summary

**Testing documentation structure:**
1. **This file** - Overview, strategy, quick start
2. [testing-unit.md](testing-unit.md) - Unit testing (40-50%)
3. [testing-integration.md](testing-integration.md) - Integration testing (40-50%)
4. [testing-e2e.md](testing-e2e.md) - E2E testing (5-10%)
5. [testing-visual.md](testing-visual.md) - Visual regression (optional)
6. [testing-best-practices.md](testing-best-practices.md) - Best practices

**Next steps:**
1. Read [testing-unit.md](testing-unit.md) for unit testing patterns
2. Read [testing-integration.md](testing-integration.md) for API mocking with MSW
3. Read [testing-e2e.md](testing-e2e.md) for Playwright setup
4. Read [testing-best-practices.md](testing-best-practices.md) for common pitfalls

**Questions?** Check troubleshooting sections in each guide or ask the team.

---

**Last Updated:** 2025-10-19
**Maintainer:** BOSSystems s.r.o.
**Documentation Location:** `L:\system\lkern_codebase_v4_act\docs\programming\`
