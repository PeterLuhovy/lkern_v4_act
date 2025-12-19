---
id: testing-best-practices
title: Testing Best Practices
sidebar_label: Best Practices
sidebar_position: 6
---

## 📋 Overview

This document defines **testing best practices** for L-KERN v4. Following these practices ensures **reliable, maintainable, and fast tests**.

**Key Topics:**
- ✅ Test isolation (prevent flaky tests)
- ✅ Flaky test prevention (race conditions, timing)
- ✅ Coverage requirements (90% UI, 95% API)
- ✅ Naming conventions (descriptive test names)
- ✅ Arrange-Act-Assert pattern
- ✅ Testing DO's and DON'Ts
- ✅ Debugging tests (screen.debug, query errors)
- ✅ CI/CD integration (fast feedback)

**See also:**
- [testing-overview.md](testing-overview.md) - Testing strategy and tools
- [testing-unit.md](testing-unit.md) - Unit testing guide
- [testing-integration.md](testing-integration.md) - Integration testing
- [testing-e2e.md](testing-e2e.md) - End-to-end testing

---

## 1. Test Isolation

**Test isolation means each test is completely independent** - no shared state, no order dependencies, no side effects.

### Why Test Isolation Matters

**❌ Without isolation:**
```typescript
// ❌ BAD - Tests share state
let user: User;

test('creates user', () => {
  user = { id: 1, name: 'John' };  // Modifies shared state
});

test('updates user', () => {
  user.name = 'Jane';  // Depends on previous test!
  expect(user.name).toBe('Jane');  // FLAKY - fails if run alone
});
```

**✅ With isolation:**
```typescript
// ✅ GOOD - Each test independent
test('creates user', () => {
  const user = { id: 1, name: 'John' };
  expect(user.name).toBe('John');
});

test('updates user', () => {
  const user = { id: 1, name: 'John' };
  user.name = 'Jane';
  expect(user.name).toBe('Jane');  // ✅ Works independently
});
```

---

### beforeEach/afterEach Patterns

**Use `beforeEach` and `afterEach` to reset state between tests.**

#### Frontend (Vitest)

```typescript
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { ContactList } from './ContactList';

describe('ContactList', () => {
  // === SETUP ===
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    // Clear localStorage
    localStorage.clear();

    // Reset DOM (React Testing Library does this automatically)
    // But if you have global state, reset it here
  });

  afterEach(() => {
    // Clean up after each test
    cleanup();

    // Clear any timers
    vi.clearAllTimers();
  });

  // === TESTS ===
  it('renders empty list initially', () => {
    render(<ContactList />);
    expect(screen.getByText('No contacts found')).toBeInTheDocument();
  });

  it('renders contacts after fetch', async () => {
    render(<ContactList />);
    expect(await screen.findByText('John Doe')).toBeInTheDocument();
  });
});
```

**Why this works:**
- ✅ `vi.clearAllMocks()` - Resets all mock function calls and return values
- ✅ `localStorage.clear()` - Prevents localStorage pollution between tests
- ✅ `cleanup()` - Unmounts React components (usually automatic)
- ✅ Each test starts with clean slate

---

#### Backend (pytest)

```python
import pytest
from app.models.contact import Contact

@pytest.fixture(autouse=True)
def reset_database(db_session):
    """Reset database before each test."""
    yield  # Test runs here

    # Cleanup after test
    db_session.query(Contact).delete()
    db_session.commit()

@pytest.fixture(autouse=True)
def reset_mocks(mocker):
    """Reset all mocks before each test."""
    yield

    # Mocks automatically reset by pytest-mock
    # But if you have manual mocks, reset them here

def test_create_contact(client):
    """Each test has clean database."""
    response = client.post("/api/v1/contacts", json={
        "name": "John Doe",
        "email": "john@example.com"
    })

    assert response.status_code == 201

def test_get_empty_list(client):
    """No leftover data from previous test."""
    response = client.get("/api/v1/contacts")

    assert response.status_code == 200
    assert response.json() == []
```

**Why this works:**
- ✅ `autouse=True` - Fixture runs automatically before each test
- ✅ `db_session.query().delete()` - Clears all records
- ✅ Each test starts with empty database

---

### Clearing Mocks

**CRITICAL: Clear mocks between tests to prevent cross-test pollution.**

#### Vitest Mock Clearing

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('API Service', () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    // ✅ Clear mock calls and return values
    vi.clearAllMocks();

    // OR clear specific mock
    mockFetch.mockClear();
  });

  it('calls API once', async () => {
    mockFetch.mockResolvedValue({ data: [] });

    await fetchContacts();

    expect(mockFetch).toHaveBeenCalledTimes(1);  // ✅ Accurate count
  });

  it('calls API twice', async () => {
    mockFetch.mockResolvedValue({ data: [] });

    await fetchContacts();
    await fetchContacts();

    expect(mockFetch).toHaveBeenCalledTimes(2);  // ✅ Not 3 from previous test
  });
});
```

**Mock clearing methods:**
- ✅ `vi.clearAllMocks()` - Clear ALL mocks (recommended in `beforeEach`)
- ✅ `mockFn.mockClear()` - Clear specific mock
- ✅ `mockFn.mockReset()` - Clear mock + remove return values
- ✅ `mockFn.mockRestore()` - Restore original implementation

---

### Resetting State (localStorage, sessionStorage)

```typescript
import { beforeEach, afterEach, it } from 'vitest';

describe('Auth State', () => {
  beforeEach(() => {
    // ✅ Clear storage before each test
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    // ✅ Optional: Clean up after test
    localStorage.clear();
    sessionStorage.clear();
  });

  it('saves token to localStorage', () => {
    const token = 'abc123';
    localStorage.setItem('authToken', token);

    expect(localStorage.getItem('authToken')).toBe(token);
  });

  it('does not have token from previous test', () => {
    // ✅ localStorage empty (cleared in beforeEach)
    expect(localStorage.getItem('authToken')).toBeNull();
  });
});
```

---

## 2. Flaky Test Prevention

**Flaky tests are tests that randomly pass or fail.** They destroy confidence in test suite.

### Common Causes of Flaky Tests

1. **Race conditions** (async operations finish at different times)
2. **Shared state between tests** (test order matters)
3. **Timing dependencies** (setTimeout, setInterval)
4. **External API calls** (network latency, API downtime)
5. **Date/time dependencies** (hardcoded dates)
6. **Random data** (Math.random without seed)

---

### Race Conditions - Use waitFor and findBy*

**❌ WRONG - Race condition:**
```typescript
it('displays loaded data', () => {
  render(<ContactList />);

  // ❌ FLAKY - Element might not exist yet
  expect(screen.getByText('John Doe')).toBeInTheDocument();
});
```

**✅ CORRECT - Wait for element:**
```typescript
it('displays loaded data', async () => {
  render(<ContactList />);

  // ✅ Wait for element to appear
  expect(await screen.findByText('John Doe')).toBeInTheDocument();
});
```

**✅ BETTER - Use waitFor for complex conditions:**
```typescript
import { waitFor } from '@testing-library/react';

it('displays all loaded contacts', async () => {
  render(<ContactList />);

  // ✅ Wait until condition is true
  await waitFor(() => {
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });
});
```

**Query comparison:**

| Query Type | When to Use | Throws Error? | Returns |
|------------|-------------|---------------|---------|
| `getBy*` | Element exists NOW | ✅ Yes | Element or throws |
| `queryBy*` | Check if element DOESN'T exist | ❌ No | Element or null |
| `findBy*` | Element will exist SOON (async) | ✅ Yes (after timeout) | Promise\<Element\> |

**Examples:**
```typescript
// ✅ Element exists NOW
const button = screen.getByRole('button');

// ✅ Element might NOT exist (checking absence)
expect(screen.queryByText('Error')).not.toBeInTheDocument();

// ✅ Element will appear after async operation
const contact = await screen.findByText('John Doe');
```

---

### Shared State - Avoid Global Variables

**❌ WRONG - Shared global state:**
```typescript
// ❌ BAD - Global variable shared between tests
let contacts: Contact[] = [];

it('adds contact', () => {
  contacts.push({ id: 1, name: 'John' });
  expect(contacts).toHaveLength(1);
});

it('lists contacts', () => {
  // ❌ FLAKY - Depends on previous test running first
  expect(contacts).toHaveLength(1);
});
```

**✅ CORRECT - Each test independent:**
```typescript
// ✅ GOOD - No shared state
it('adds contact', () => {
  const contacts: Contact[] = [];
  contacts.push({ id: 1, name: 'John' });
  expect(contacts).toHaveLength(1);
});

it('lists contacts', () => {
  const contacts: Contact[] = [{ id: 1, name: 'John' }];
  expect(contacts).toHaveLength(1);
});
```

**✅ BETTER - Use beforeEach for setup:**
```typescript
describe('Contact List', () => {
  let contacts: Contact[];

  beforeEach(() => {
    // ✅ Reset before each test
    contacts = [];
  });

  it('starts empty', () => {
    expect(contacts).toHaveLength(0);
  });

  it('adds contact', () => {
    contacts.push({ id: 1, name: 'John' });
    expect(contacts).toHaveLength(1);
  });
});
```

---

### Timing Dependencies - Use vi.useFakeTimers

**❌ WRONG - Real timers (flaky):**
```typescript
it('debounces input', async () => {
  render(<SearchInput />);

  userEvent.type(screen.getByRole('textbox'), 'John');

  // ❌ FLAKY - Real time passes, unpredictable
  await new Promise(resolve => setTimeout(resolve, 350));

  expect(mockSearch).toHaveBeenCalledWith('John');
});
```

**✅ CORRECT - Fake timers:**
```typescript
import { beforeEach, afterEach, vi } from 'vitest';

describe('SearchInput', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('debounces input', async () => {
    render(<SearchInput />);

    await userEvent.type(screen.getByRole('textbox'), 'John');

    // ✅ Advance fake time by 300ms
    vi.advanceTimersByTime(300);

    expect(mockSearch).toHaveBeenCalledWith('John');
  });
});
```

**Fake timer methods:**
- ✅ `vi.useFakeTimers()` - Replace setTimeout/setInterval with fake timers
- ✅ `vi.advanceTimersByTime(ms)` - Fast-forward time by X milliseconds
- ✅ `vi.runAllTimers()` - Execute all pending timers immediately
- ✅ `vi.useRealTimers()` - Restore real timers (do in afterEach)

---

### External API Calls - Mock with MSW

**❌ WRONG - Real API calls:**
```typescript
it('fetches contacts', async () => {
  render(<ContactList />);

  // ❌ FLAKY - Depends on network, API uptime, data
  expect(await screen.findByText('John Doe')).toBeInTheDocument();
});
```

**✅ CORRECT - Mock API with MSW:**
```typescript
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

// === SETUP MSW SERVER ===
const server = setupServer(
  http.get('/api/v1/contacts', () => {
    return HttpResponse.json([
      { id: 1, name: 'John Doe', email: 'john@example.com' }
    ]);
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// === TESTS ===
it('fetches contacts from API', async () => {
  render(<ContactList />);

  // ✅ Predictable - Always returns mocked data
  expect(await screen.findByText('John Doe')).toBeInTheDocument();
});

it('handles API error', async () => {
  // Override handler for this test
  server.use(
    http.get('/api/v1/contacts', () => {
      return HttpResponse.json({ error: 'Server error' }, { status: 500 });
    })
  );

  render(<ContactList />);

  expect(await screen.findByText('Failed to load contacts')).toBeInTheDocument();
});
```

**See full MSW guide:** [testing-integration.md](testing-integration.md)

---

### Date/Time Dependencies - Mock Date

**❌ WRONG - Hardcoded dates:**
```typescript
it('shows today date', () => {
  render(<DateDisplay />);

  // ❌ FLAKY - Fails tomorrow
  expect(screen.getByText('2025-10-19')).toBeInTheDocument();
});
```

**✅ CORRECT - Mock current date:**
```typescript
import { beforeEach, afterEach, vi } from 'vitest';

describe('DateDisplay', () => {
  beforeEach(() => {
    // ✅ Mock Date to fixed value
    vi.setSystemTime(new Date('2025-10-19T10:00:00Z'));
  });

  afterEach(() => {
    // ✅ Restore real date
    vi.useRealTimers();
  });

  it('shows today date', () => {
    render(<DateDisplay />);

    // ✅ Predictable - Always 2025-10-19
    expect(screen.getByText('2025-10-19')).toBeInTheDocument();
  });
});
```

---

## 3. Coverage Requirements

**L-KERN v4 coverage targets:**

| Code Type | Minimum Coverage | Ideal Coverage | Why? |
|-----------|------------------|----------------|------|
| **UI Components** | 90% | 95%+ | User-facing code is critical |
| **API Endpoints** | 95% | 98%+ | Business logic must be robust |
| **Business Logic** | 95% | 98%+ | Core functionality |
| **Utilities** | 80% | 90%+ | Helper functions are lower risk |
| **Database Models** | 85% | 90%+ | CRUD operations |

---

### How to Check Coverage

#### Frontend (Vitest)

```bash
# Run tests with coverage
npm run test:coverage

# Output:
# File                | % Stmts | % Branch | % Funcs | % Lines
# -------------------|---------|----------|---------|--------
# Button.tsx         |   95.12 |    88.89 |  100.00 |   95.12
# ContactList.tsx    |   92.31 |    85.71 |   90.00 |   92.31
```

**Coverage report location:**
```
coverage/
├── index.html       # ← Open this in browser
├── lcov.info
└── coverage-final.json
```

**View in browser:**
```bash
# Windows
start coverage/index.html

# Mac/Linux
open coverage/index.html
```

---

#### Backend (pytest)

```bash
# Run tests with coverage
pytest --cov=app --cov-report=html tests/

# Output:
# Name                  Stmts   Miss  Cover
# -----------------------------------------
# app/main.py              45      2    95%
# app/models/contact.py    32      1    97%
# app/routers/contacts.py  58      3    95%
```

**Coverage report location:**
```
htmlcov/
├── index.html       # ← Open this in browser
└── *.html
```

---

### What to Do if Coverage is Low?

**1. Identify uncovered lines:**
```bash
# Frontend - Show uncovered lines
npm run test:coverage -- --reporter=verbose

# Backend - Show missing lines
pytest --cov=app --cov-report=term-missing tests/
```

**2. Add tests for uncovered code:**
```python
# Example: Uncovered line
def get_contact(contact_id: int):
    contact = db.query(Contact).filter(Contact.id == contact_id).first()
    if not contact:
        raise HTTPException(404, "Contact not found")  # ← UNCOVERED
    return contact

# Add test:
def test_get_contact_not_found(client):
    """Test 404 for nonexistent contact."""
    response = client.get("/api/v1/contacts/99999")

    assert response.status_code == 404
    assert "not found" in response.json()["detail"]
```

**3. Ignore untestable code (rare):**
```python
# Use # pragma: no cover for truly untestable code
def debug_only_function():  # pragma: no cover
    """Only used in development, not worth testing."""
    print(debug_info)
```

---

## 4. Naming Conventions

**Test names should be DESCRIPTIVE** - explain what is being tested and expected outcome.

### Good vs Bad Test Names

**❌ BAD - Vague test names:**
```typescript
it('test email');
it('button works');
it('API call');
it('validation');
```

**✅ GOOD - Descriptive test names:**
```typescript
it('validates email format using RFC 5322 standard');
it('calls onClick handler when button is clicked');
it('fetches contacts from API on component mount');
it('rejects password shorter than 8 characters');
```

---

### Naming Pattern (Frontend)

**Format:** `<action> when <condition> [expected outcome]`

**Examples:**
```typescript
// Component interactions
it('calls onClick when button is clicked');
it('disables button when loading prop is true');
it('shows error message when validation fails');

// Rendering
it('renders children correctly');
it('applies primary variant class when variant prop is primary');
it('displays loading spinner when fetching data');

// State
it('updates input value when user types');
it('clears form when reset button is clicked');
it('toggles modal visibility when open prop changes');

// Validation
it('accepts valid email format');
it('rejects email without @ symbol');
it('shows error when required field is empty');
```

---

### Naming Pattern (Backend)

**Format:** `test_<action>_<condition>_<expected_outcome>`

**Examples:**
```python
# Success cases
def test_create_contact_with_valid_data_returns_201():
def test_get_contact_by_id_returns_contact_object():
def test_update_contact_name_changes_database_record():

# Error cases
def test_create_contact_with_duplicate_email_returns_400():
def test_get_nonexistent_contact_returns_404():
def test_create_contact_without_name_returns_422():

# Edge cases
def test_create_contact_with_empty_phone_saves_null():
def test_delete_contact_removes_from_database():
def test_update_nonexistent_contact_returns_404():
```

---

### Why Descriptive Names Matter

**1. Self-documenting tests:**
```typescript
// ❌ Need to read code to understand
it('test 1', () => { ... });

// ✅ Understand from name alone
it('validates email format using RFC 5322 standard', () => { ... });
```

**2. Better error messages:**
```bash
# ❌ BAD - Unclear what failed
FAIL  Button.test.tsx
  × test 1

# ✅ GOOD - Immediately know what failed
FAIL  Button.test.tsx
  × calls onClick when button is clicked
```

**3. Easier debugging:**
```bash
# ✅ Failed test name tells you exactly what to fix
× rejects email without @ symbol

  Expected: false
  Received: true
```

---

## 5. Arrange-Act-Assert Pattern

**AAA pattern makes tests readable and consistent.**

### Pattern Structure

```typescript
it('test description', () => {
  // === ARRANGE ===
  // Set up test data and preconditions

  // === ACT ===
  // Execute the code being tested

  // === ASSERT ===
  // Verify the outcome
});
```

---

### Frontend Example

```typescript
it('adds two numbers correctly', () => {
  // === ARRANGE ===
  const a = 5;
  const b = 3;
  const expectedSum = 8;

  // === ACT ===
  const result = add(a, b);

  // === ASSERT ===
  expect(result).toBe(expectedSum);
});
```

```typescript
it('calls onClick when button is clicked', async () => {
  // === ARRANGE ===
  const onClick = vi.fn();
  render(<Button onClick={onClick}>Click me</Button>);

  // === ACT ===
  await userEvent.click(screen.getByRole('button'));

  // === ASSERT ===
  expect(onClick).toHaveBeenCalledTimes(1);
});
```

---

### Backend Example

```python
def test_create_contact_with_valid_data_returns_201(client):
    # === ARRANGE ===
    contact_data = {
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+421900123456"
    }

    # === ACT ===
    response = client.post("/api/v1/contacts", json=contact_data)

    # === ASSERT ===
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "John Doe"
    assert data["email"] == "john@example.com"
    assert "id" in data
```

---

### Complex Example with Multiple Assertions

```typescript
it('updates contact and shows success notification', async () => {
  // === ARRANGE ===
  const mockToast = vi.fn();
  const contact = { id: 1, name: 'John Doe' };

  server.use(
    http.put('/api/v1/contacts/1', () => {
      return HttpResponse.json({ ...contact, name: 'Jane Doe' });
    })
  );

  render(<ContactForm contact={contact} onSuccess={mockToast} />);

  // === ACT ===
  const nameInput = screen.getByLabelText('Name');
  await userEvent.clear(nameInput);
  await userEvent.type(nameInput, 'Jane Doe');
  await userEvent.click(screen.getByText('Save'));

  // === ASSERT ===
  await waitFor(() => {
    expect(mockToast).toHaveBeenCalledWith({
      type: 'success',
      message: 'Contact updated successfully'
    });
  });

  expect(nameInput).toHaveValue('Jane Doe');
});
```

---

## 6. Testing DO's and DON'Ts

### ✅ DO: Test User Behavior

**Test what users see and do, not implementation details.**

```typescript
// ✅ GOOD - Test user behavior
it('shows error message when email is invalid', async () => {
  render(<ContactForm />);

  await userEvent.type(screen.getByLabelText('Email'), 'not-an-email');
  await userEvent.click(screen.getByText('Save'));

  expect(screen.getByText('Invalid email format')).toBeInTheDocument();
});

// ❌ BAD - Test implementation details
it('sets error state when validation fails', () => {
  const { result } = renderHook(() => useForm());

  act(() => {
    result.current.setEmail('not-an-email');
    result.current.validate();
  });

  expect(result.current.errors.email).toBe('Invalid email format');
});
```

**Why?** User doesn't care about `errors.email` state. They care about seeing error message.

---

### ✅ DO: Use userEvent, DON'T Use fireEvent

```typescript
// ✅ GOOD - Realistic user interaction
await userEvent.click(button);
await userEvent.type(input, 'Hello');
await userEvent.selectOptions(select, 'Option 1');

// ❌ BAD - Low-level DOM events
fireEvent.click(button);
fireEvent.change(input, { target: { value: 'Hello' } });
```

**Why?** `userEvent` simulates realistic user behavior (focus, blur, multiple events). `fireEvent` fires single DOM event.

---

### ✅ DO: Test One Thing Per Test

```typescript
// ✅ GOOD - Separate tests
it('validates email format', () => {
  expect(validateEmail('john@example.com')).toBe(true);
});

it('validates phone format', () => {
  expect(validatePhone('+421900123456')).toBe(true);
});

// ❌ BAD - Multiple unrelated assertions
it('validates all fields', () => {
  expect(validateEmail('john@example.com')).toBe(true);
  expect(validatePhone('+421900123456')).toBe(true);
  expect(validateName('John Doe')).toBe(true);
});
```

**Why?** If test fails, you immediately know WHAT failed. With multiple assertions, harder to debug.

---

### ❌ DON'T: Test Implementation Details

```typescript
// ❌ BAD - Testing internal state
it('sets loading state when fetching', () => {
  const { result } = renderHook(() => useContacts());

  expect(result.current.loading).toBe(true);
});

// ✅ GOOD - Test user-visible outcome
it('shows loading spinner when fetching contacts', () => {
  render(<ContactList />);

  expect(screen.getByText('Loading...')).toBeInTheDocument();
});
```

**Why?** Internal state can change (rename variable, refactor hook). User-visible behavior should stay same.

---

### ❌ DON'T: Share State Between Tests

```typescript
// ❌ BAD - Shared state
let contacts: Contact[] = [];

it('adds contact', () => {
  contacts.push({ id: 1, name: 'John' });
  expect(contacts).toHaveLength(1);
});

it('lists contacts', () => {
  expect(contacts).toHaveLength(1);  // FLAKY
});

// ✅ GOOD - Independent tests
describe('Contact List', () => {
  let contacts: Contact[];

  beforeEach(() => {
    contacts = [];  // Reset before each test
  });

  it('starts empty', () => {
    expect(contacts).toHaveLength(0);
  });

  it('adds contact', () => {
    contacts.push({ id: 1, name: 'John' });
    expect(contacts).toHaveLength(1);
  });
});
```

---

### ❌ DON'T: Test Third-Party Libraries

```typescript
// ❌ BAD - Testing React itself
it('useState updates state', () => {
  const [state, setState] = useState(0);
  setState(1);
  expect(state).toBe(1);
});

// ✅ GOOD - Test YOUR code
it('increments counter when button clicked', async () => {
  render(<Counter />);

  await userEvent.click(screen.getByText('Increment'));

  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});
```

**Why?** Third-party libraries are already tested. Test your own code.

---

## 7. Debugging Tests

### View Rendered DOM

**Use `screen.debug()` to see what React Testing Library rendered:**

```typescript
import { render, screen } from '@testing-library/react';

test('debug example', () => {
  render(<ContactList />);

  // Print entire DOM tree
  screen.debug();

  // Print specific element
  screen.debug(screen.getByRole('button'));
});
```

**Output:**
```html
<body>
  <div>
    <h1>Contacts</h1>
    <ul>
      <li>John Doe</li>
      <li>Jane Smith</li>
    </ul>
    <button>Add Contact</button>
  </div>
</body>
```

---

### Common Query Errors

#### Error 1: "Unable to find element"

```typescript
// ❌ Error thrown
screen.getByText('Loading...');

// TestingLibraryElementError: Unable to find an element with the text: Loading...
```

**Solutions:**

```typescript
// ✅ Solution 1: Use async query (element appears later)
expect(await screen.findByText('Loading...')).toBeInTheDocument();

// ✅ Solution 2: Use queryBy to check absence
expect(screen.queryByText('Loading...')).not.toBeInTheDocument();

// ✅ Solution 3: Debug what's actually rendered
screen.debug();
```

---

#### Error 2: "Multiple elements found"

```typescript
// ❌ Error thrown
screen.getByRole('button');

// TestingLibraryElementError: Found multiple elements with role "button"
```

**Solutions:**

```typescript
// ✅ Solution 1: Use getAllByRole
const buttons = screen.getAllByRole('button');
expect(buttons).toHaveLength(2);

// ✅ Solution 2: Add name option
screen.getByRole('button', { name: 'Save' });

// ✅ Solution 3: Use data-testid
screen.getByTestId('save-button');
```

---

#### Error 3: Query Timing Issues

```typescript
// ❌ Element not in DOM yet
expect(screen.getByText('Success!')).toBeInTheDocument();

// ✅ Wait for element
expect(await screen.findByText('Success!')).toBeInTheDocument();

// ✅ Use waitFor for complex conditions
await waitFor(() => {
  expect(screen.getByText('Success!')).toBeInTheDocument();
  expect(screen.getByText('Contact saved')).toBeInTheDocument();
});
```

---

### Query Priority (React Testing Library)

**Use this priority order when selecting elements:**

1. **Accessible by everyone** (best)
   - `getByRole` - Button, textbox, etc.
   - `getByLabelText` - Form fields with labels
   - `getByPlaceholderText` - Inputs with placeholder
   - `getByText` - Non-interactive text
   - `getByDisplayValue` - Current input value

2. **Semantic queries**
   - `getByAltText` - Images with alt text
   - `getByTitle` - Elements with title attribute

3. **Test IDs** (last resort)
   - `getByTestId` - data-testid attribute

**Example:**
```typescript
// ✅ BEST - Accessible
screen.getByRole('button', { name: 'Save' });
screen.getByLabelText('Email');

// ✅ GOOD - Semantic
screen.getByText('Contact Details');
screen.getByPlaceholderText('Enter email');

// ❌ AVOID - Test IDs (only if no alternative)
screen.getByTestId('save-button');
```

---

## 8. CI/CD Integration

**Run tests automatically on every push and pull request.**

### GitHub Actions Example

**`.github/workflows/tests.yml`:**

```yaml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  frontend-tests:
    name: Frontend Tests
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm run test:coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
          flags: frontend

      - name: Fail if coverage below 90%
        run: |
          COVERAGE=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
          if (( $(echo "$COVERAGE < 90" | bc -l) )); then
            echo "Coverage $COVERAGE% is below 90%"
            exit 1
          fi

  backend-tests:
    name: Backend Tests
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
          cache: 'pip'

      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          pip install pytest pytest-cov

      - name: Run tests
        run: pytest --cov=app --cov-report=xml tests/
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage.xml
          flags: backend

      - name: Fail if coverage below 95%
        run: |
          COVERAGE=$(pytest --cov=app tests/ --cov-report=term | grep TOTAL | awk '{print $4}' | sed 's/%//')
          if (( $(echo "$COVERAGE < 95" | bc -l) )); then
            echo "Coverage $COVERAGE% is below 95%"
            exit 1
          fi

  e2e-tests:
    name: E2E Tests
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload test results
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

---

### Fast Feedback Loop

**Optimize CI/CD for fast test feedback:**

1. **Run tests in parallel:**
   ```yaml
   jobs:
     frontend-tests:
       strategy:
         matrix:
           shard: [1, 2, 3, 4]
       steps:
         - run: npm run test -- --shard=${{ matrix.shard }}/4
   ```

2. **Cache dependencies:**
   ```yaml
   - uses: actions/setup-node@v3
     with:
       cache: 'npm'  # Cache node_modules
   ```

3. **Run unit tests before E2E:**
   ```yaml
   jobs:
     unit-tests:
       # Fast (1-2 min)

     e2e-tests:
       needs: unit-tests  # Only run if unit tests pass
       # Slow (5-10 min)
   ```

4. **Only run affected tests (Nx):**
   ```yaml
   - run: npx nx affected:test --base=origin/main
   ```

---

### Coverage Thresholds

**Enforce minimum coverage in CI/CD:**

**Frontend (`vitest.config.ts`):**
```typescript
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      thresholds: {
        lines: 90,      // 90% line coverage
        functions: 90,  // 90% function coverage
        branches: 85,   // 85% branch coverage
        statements: 90  // 90% statement coverage
      }
    }
  }
});
```

**Backend (`pytest.ini`):**
```ini
[pytest]
addopts = --cov=app --cov-fail-under=95
```

**What happens?** Tests FAIL if coverage below threshold.

---

## 9. Summary

**Testing best practices covered:**

### ✅ Test Isolation
- Use `beforeEach`/`afterEach` to reset state
- Clear mocks with `vi.clearAllMocks()`
- Clear localStorage/sessionStorage
- Each test independent

### ✅ Flaky Test Prevention
- Use `waitFor` and `findBy*` for async operations
- Mock timers with `vi.useFakeTimers()`
- Mock APIs with MSW
- Mock dates with `vi.setSystemTime()`
- Avoid shared state between tests

### ✅ Coverage Requirements
- Frontend: 90%+ UI components
- Backend: 95%+ API endpoints
- Check with `npm run test:coverage` / `pytest --cov`
- Enforce thresholds in CI/CD

### ✅ Naming Conventions
- Descriptive test names: `test_create_contact_with_duplicate_email_returns_400`
- Frontend: `<action> when <condition>`
- Backend: `test_<action>_<condition>_<expected>`

### ✅ Arrange-Act-Assert
- Arrange: Set up test data
- Act: Execute code
- Assert: Verify outcome

### ✅ Testing DO's and DON'Ts
- ✅ DO: Test user behavior
- ✅ DO: Use userEvent
- ❌ DON'T: Test implementation details
- ❌ DON'T: Share state between tests

### ✅ Debugging
- Use `screen.debug()` to see rendered DOM
- Understand query differences (getBy, queryBy, findBy)
- Use proper query priority (role > label > text > testid)

### ✅ CI/CD Integration
- Run tests on push and pull request
- Parallel test execution
- Coverage thresholds enforced
- Fast feedback loop

---

**Next steps:**
1. Apply these practices to all new tests
2. Refactor existing tests to follow best practices
3. Set up CI/CD pipeline with coverage thresholds
4. Review [testing-overview.md](testing-overview.md) for testing strategy
5. Read [testing-unit.md](testing-unit.md) for unit testing patterns

---

**Last Updated:** 2025-10-19
**Maintainer:** BOSSystems s.r.o.
**Documentation Location:** `L:\system\lkern_codebase_v4_act\docs\programming\`
