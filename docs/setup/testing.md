# ================================================================
# Testing Guide - L-KERN v4
# ================================================================
# File: L:\system\lkern_codebase_v4_act\docs\setup\testing.md
# Version: 1.0.0
# Created: 2025-10-18
# Updated: 2025-10-18
# Project: BOSS (Business Operating System Service)
# Developer: BOSSystems s.r.o.
#
# Description:
#   Comprehensive testing guide covering Vitest (frontend) and
#   pytest (backend) with Docker integration and coverage reporting.
# ================================================================

---

## 📋 Overview

L-KERN v4 uses different testing frameworks for frontend and backend:

- **Frontend**: **Vitest** - Fast unit testing for React components
- **Backend**: **pytest** - Python testing framework for FastAPI services

---

## 🎯 Quick Reference

### Frontend Tests (Vitest)

```bash
# Inside Docker container
docker exec lkms201-web-ui yarn nx test ui-components
docker exec lkms201-web-ui yarn nx test web-ui --coverage

# From host machine (requires local Yarn)
yarn nx test ui-components
yarn nx test ui-components --watch
yarn nx test ui-components --coverage
```

### Backend Tests (pytest)

```bash
# Inside Docker container (when lkms101-contacts is active)
docker exec lkms101-contacts pytest
docker exec lkms101-contacts pytest --cov=app --cov-report=html

# From host machine (requires Python + pytest)
pytest services/lkms101-contacts/tests/
pytest --verbose --cov=app
```

---

## 🧪 Frontend Testing (Vitest)

### Running Tests in Docker

**Run all tests for a package:**
```bash
docker exec lkms201-web-ui yarn nx test ui-components
```

**Run tests in watch mode:**
```bash
# Watch mode requires interactive terminal
docker exec -it lkms201-web-ui yarn nx test ui-components -- --watch
```

**Run tests with coverage:**
```bash
docker exec lkms201-web-ui yarn nx test ui-components --coverage
```

**Run specific test file:**
```bash
docker exec lkms201-web-ui yarn nx test ui-components -- Button.test.tsx
```

**Run tests matching pattern:**
```bash
docker exec lkms201-web-ui yarn nx test ui-components -- --testNamePattern="Button"
```

---

### Running Tests Locally (Without Docker)

**Prerequisites:**
- Node.js 20+ installed
- Yarn 4 installed (`corepack enable`)
- Dependencies installed (`yarn install`)

**Commands:**
```bash
# All tests for a project
yarn nx test ui-components

# Watch mode (re-runs on file changes)
yarn nx test ui-components --watch

# Coverage report
yarn nx test ui-components --coverage

# Single test file
yarn nx test ui-components -- Button.test.tsx

# Verbose output
yarn nx test ui-components -- --verbose
```

---

### Test File Structure

**Component Structure Example:**

```
packages/ui-components/src/components/Button/
├── Button.tsx           # Component implementation
├── Button.module.css    # Styles
├── Button.test.tsx      # Unit tests ⭐
└── index.ts             # Export
```

**Available Test Suites (115 tests total):**
- Button.test.tsx - 16 tests (variants, sizes, loading, icons)
- Input.test.tsx - 15 tests (types, error states, accessibility)
- FormField.test.tsx - 11 tests (label, required, error display)
- Select.test.tsx - 21 tests (options, placeholder, error handling)
- Checkbox.test.tsx - 19 tests (label, indeterminate state, accessibility)
- Radio.test.tsx - 13 tests (states, disabled, forward ref)
- RadioGroup.test.tsx - 20 tests (selection, layout, accessibility)

**Test File Example (Button):**
```typescript
// packages/ui-components/src/components/Button/Button.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click me</Button>);

    await userEvent.click(screen.getByText('Click me'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<Button loading>Submit</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('disabled');
  });
});
```

**Test File Example (Checkbox):**
```typescript
// packages/ui-components/src/components/Checkbox/Checkbox.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('renders with label', () => {
    render(<Checkbox label="Accept terms" />);
    expect(screen.getByLabelText('Accept terms')).toBeInTheDocument();
  });

  it('sets indeterminate state', () => {
    render(<Checkbox label="Select all" indeterminate />);
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.indeterminate).toBe(true);
  });

  it('toggles checked state on click', async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Toggle me" />);
    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).not.toBeChecked();
    await user.click(checkbox);
    expect(checkbox).toBeChecked();
  });
});
```

**Test File Example (RadioGroup):**
```typescript
// packages/ui-components/src/components/Radio/RadioGroup.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RadioGroup } from './RadioGroup';

const options = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
];

describe('RadioGroup', () => {
  it('renders all radio options', () => {
    render(<RadioGroup name="size" options={options} />);
    expect(screen.getByLabelText('Small')).toBeInTheDocument();
    expect(screen.getByLabelText('Medium')).toBeInTheDocument();
    expect(screen.getByLabelText('Large')).toBeInTheDocument();
  });

  it('calls onChange with selected value', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<RadioGroup name="size" options={options} onChange={handleChange} />);

    await user.click(screen.getByLabelText('Large'));
    expect(handleChange).toHaveBeenCalledWith('large');
  });
});
```

**See:** [programming/code-examples.md#frontend-testing](programming/code-examples.md#frontend-testing) for more examples.

---

### Vitest Configuration

**Location:** `packages/ui-components/vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['**/*.test.{ts,tsx}', '**/*.d.ts'],
    },
  },
});
```

---

## 🐍 Backend Testing (pytest)

### Running Tests in Docker

**⚠️ Note:** Backend services not yet implemented in v4. Commands shown for future reference.

**Run all tests:**
```bash
docker exec lkms101-contacts pytest
```

**Run with verbose output:**
```bash
docker exec lkms101-contacts pytest -v
```

**Run specific test file:**
```bash
docker exec lkms101-contacts pytest tests/test_api.py
```

**Run specific test function:**
```bash
docker exec lkms101-contacts pytest tests/test_api.py::test_create_contact
```

**Run with coverage:**
```bash
docker exec lkms101-contacts pytest --cov=app --cov-report=html
```

**View coverage report:**
```bash
# Coverage HTML report generated inside container
docker exec lkms101-contacts cat htmlcov/index.html
```

---

### Running Tests Locally (Without Docker)

**Prerequisites:**
- Python 3.11+ installed
- Virtual environment created
- Dependencies installed (`pip install -r requirements.txt`)

**Commands:**
```bash
# Navigate to service directory
cd services/lkms101-contacts

# Activate virtual environment
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Run all tests
pytest

# Run with coverage
pytest --cov=app --cov-report=html

# Run specific test
pytest tests/test_api.py::test_create_contact

# Run with verbose output
pytest -v

# Run tests matching pattern
pytest -k "contact"
```

---

### Test File Structure

**Example: Contacts Service Tests**

```
services/lkms101-contacts/
├── app/
│   ├── models/
│   ├── routers/
│   └── schemas/
├── tests/
│   ├── conftest.py       # Pytest fixtures
│   ├── test_api.py       # REST API tests ⭐
│   ├── test_grpc.py      # gRPC tests ⭐
│   └── test_models.py    # Database model tests ⭐
└── requirements.txt
```

**Test File Example:**
```python
# tests/test_api.py
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_create_contact(db_session):
    """Test creating a new contact via REST API."""
    response = client.post("/api/v1/contacts", json={
        "name": "Test Company",
        "email": "test@example.com",
        "phone": "+421 900 123 456"
    })

    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Test Company"
    assert "id" in data

def test_get_contacts(db_session):
    """Test retrieving contact list."""
    response = client.get("/api/v1/contacts")

    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
```

**See:** [programming/code-examples.md#backend-testing](programming/code-examples.md#backend-testing) for more examples.

---

### pytest Configuration

**Location:** `services/lkms101-contacts/pytest.ini`

```ini
[pytest]
testpaths = tests
python_files = test_*.py
python_classes = Test*
python_functions = test_*
addopts =
    -v
    --strict-markers
    --cov=app
    --cov-report=term-missing
    --cov-report=html
```

---

## 🔧 Testing in CI/CD Pipeline

### GitHub Actions (Future)

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      - run: corepack enable
      - run: yarn install
      - run: yarn nx test ui-components --coverage

  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: 3.11
      - run: pip install -r services/lkms101-contacts/requirements.txt
      - run: pytest services/lkms101-contacts/tests/ --cov
```

---

## 🎯 Test Coverage Goals

**L-KERN v4 Test Coverage Standards:**

| Component Type | Minimum Coverage | Target Coverage |
|----------------|------------------|-----------------|
| React Components | 80% | 100% |
| REST API Endpoints | 90% | 100% |
| gRPC Services | 90% | 100% |
| Database Models | 85% | 95% |
| Utility Functions | 95% | 100% |

**Coverage Reports:**
- **Frontend**: `packages/ui-components/coverage/index.html`
- **Backend**: `services/lkms101-contacts/htmlcov/index.html`

---

## 📊 Test Types

### Unit Tests
- Test individual components/functions in isolation
- Mock external dependencies (API calls, database)
- Fast execution (< 1s per test)
- **Example**: Button component click handler

### Integration Tests
- Test multiple components working together
- May use real database (with test data)
- Slower execution (1-10s per test)
- **Example**: Creating contact via API + database storage

### E2E Tests (Future - Playwright)
- Test complete user workflows
- Run in real browser
- Slowest execution (10-60s per test)
- **Example**: User logs in → creates contact → views contact list

---

## 🔍 Debugging Tests

### Debug Frontend Tests

```bash
# Add console.log in test
it('debug test', () => {
  console.log('Debug info:', someVariable);
  render(<Button>Test</Button>);
  screen.debug(); // Prints DOM tree
});

# Run single test in watch mode
yarn nx test ui-components -- Button.test.tsx --watch
```

### Debug Backend Tests

```bash
# Add breakpoints with pdb
def test_create_contact():
    import pdb; pdb.set_trace()  # Debugger stops here
    response = client.post("/api/v1/contacts", json={...})

# Run with pdb
docker exec -it lkms101-contacts pytest --pdb

# Print debug info
def test_something():
    print(f"Debug: {variable}")
    pytest.set_trace()  # Alternative to pdb
```

---

## 🚨 Common Issues

### ⚠️ CRITICAL: Docker Volume Issues

**⚠️ ALWAYS run tests in Docker container, not on host!**

Tests run on Windows host may fail due to OneDrive symlink path resolution (L: vs C: drive mapping).

**✅ CORRECT:**
```bash
docker exec lkms201-web-ui npx nx test ui-components --run
```

**❌ WRONG:**
```bash
npx nx test ui-components  # Fails on host due to path issues
```

---

### "Cannot find module 'vite-plugin-dts'" or Similar

**Symptom:**
```
Error: Cannot find module 'vite-plugin-dts'
```

**Cause:** Docker image built BEFORE dependency was added to package.json.

**Solution:**
```bash
# IMPORTANT: Use -v flag to remove volumes!
docker-compose down -v
docker-compose up --build -d
```

**Why `-v` flag?**
- Removes named volume `lkern-v4-node-modules`
- Forces Docker to copy fresh `node_modules` from newly built image
- Without `-v`, old `node_modules` persists and new dependencies are missing

---

### "Invalid Chai property: toBeInTheDocument"

**Symptom:**
```
Invalid Chai property: toBeInTheDocument
```

**Cause:** Missing `@testing-library/jest-dom` setup.

**Required Dependencies:**
```json
{
  "@testing-library/jest-dom": "^6.6.3",
  "@testing-library/user-event": "^14.5.2"
}
```

**Required Setup File:** `packages/ui-components/vitest.setup.ts`
```typescript
import '@testing-library/jest-dom/vitest';
```

**Vite Config:** `packages/ui-components/vite.config.ts`
```typescript
test: {
  setupFiles: ['./vitest.setup.ts'],  // ← Must include this!
  // ...
}
```

**Solution:**
1. Add dependencies to `package.json`
2. Create `vitest.setup.ts`
3. Update `vite.config.ts`
4. Rebuild Docker: `docker-compose down -v && docker-compose up --build -d`

---

### Container Keeps Restarting

**Symptom:**
```bash
docker ps  # Shows: Restarting (1) X seconds ago
```

**Cause:** Nx cannot process project graph due to missing dependencies.

**Solution:**
```bash
# Check logs for error
docker logs lkms201-web-ui --tail 50

# Look for "Cannot find module" or "Failed to process project graph"

# Fix: Rebuild with clean volumes
docker-compose down -v
docker-compose up --build -d
```

---

### CSS Modules Class Name Test Failures

**Symptom:**
```
Error: expect(received).toBeInTheDocument()
received value must be an HTMLElement or an SVGElement.
Received has type: Null
```

**Cause:** CSS Modules generate hashed class names (`.button__button___abc123`).

**❌ WRONG:**
```typescript
const button = container.querySelector('.button--primary');
expect(button).toBeInTheDocument(); // FAILS - class is hashed!
```

**✅ CORRECT:**
```typescript
const button = screen.getByRole('button');
expect(button.className).toContain('button');
expect(button.className).toContain('primary');
```

---

### "Cannot find module" Error

**Symptom:**
```
Error: Cannot find module '@l-kern/config'
```

**Solution:**
```bash
# Rebuild Docker image (dependencies missing)
docker-compose down -v  # ← IMPORTANT: -v flag!
docker-compose up --build -d

# Or install locally
yarn install
```

---

### Tests Pass Locally, Fail in Docker

**Symptom:**
Tests pass with `yarn nx test` but fail with `docker exec`.

**Causes:**
- Volume mounting issues
- Node modules mismatch
- Environment variables missing

**Solution:**
```bash
# Rebuild Docker image with clean volumes
docker-compose down -v
docker-compose up --build -d

# Check environment inside container
docker exec lkms201-web-ui env | grep NODE_ENV
```

---

### Coverage Report Not Generated

**Symptom:**
`coverage/index.html` file not found.

**Solution:**
```bash
# Generate coverage explicitly
docker exec lkms201-web-ui yarn nx test ui-components --coverage

# Check coverage directory
docker exec lkms201-web-ui ls -la packages/ui-components/coverage/
```

---

## 🔗 Related Documentation

- [Coding Standards](programming/coding-standards.md#testing-standards) - Testing conventions
- [Code Examples](programming/code-examples.md#testing) - Test examples
- [Troubleshooting](troubleshooting.md#testing-issues) - Common test problems

---

**Last Updated**: 2025-10-18 13:45:00
**Maintainer**: BOSSystems s.r.o.
