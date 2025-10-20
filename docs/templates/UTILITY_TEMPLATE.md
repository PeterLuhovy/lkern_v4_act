# ================================================================
# <Utility Name> (e.g., "Email Validation")
# ================================================================
# File: L:\system\lkern_codebase_v4_act\docs\utils\<utility-name>.md
# Version: 1.0.0
# Created: YYYY-MM-DD
# Updated: YYYY-MM-DD
# Utility Location: packages/config/src/utils/<utility-name>/<utility-name>.ts
# Package: @l-kern/config
# Project: BOSS (Business Operating System Service)
# Developer: BOSSystems s.r.o.
#
# Description:
#   Brief 1-2 sentence description of what this utility file contains.
#   (e.g., "Email validation, normalization, and parsing utilities")
# ================================================================

---

## Overview

**Purpose**: One-sentence description of utility purpose
**Package**: @l-kern/config
**Path**: packages/config/src/utils/<utility-name>
**Since**: v1.0.0

Brief 2-3 sentence overview of what utilities this file provides.

---

## Functions

This utility file exports the following functions:

### function1
[One-sentence description]

### function2
[One-sentence description]

### function3
[One-sentence description]

[... list all exported functions ...]

---

## API Reference

### Function 1: functionName

**Signature:**
```typescript
function functionName(
  param1: Type1,
  param2?: Type2
): ReturnType
```

**Purpose:**
[1-2 sentence description of what this function does]

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `param1` | `Type1` | Yes | [Description of param1] |
| `param2` | `Type2` | No | [Description of param2] (default: [value]) |

**Returns:**

| Type | Description |
|------|-------------|
| `ReturnType` | [Description of what is returned] |

**Validation Rules:** (if applicable)
- ✅ Rule 1
- ✅ Rule 2
- ✅ Rule 3

**Examples:**
```typescript
import { functionName } from '@l-kern/config';

// Example 1: Basic usage
const result1 = functionName('example');
console.log(result1); // true

// Example 2: With optional parameter
const result2 = functionName('example', { option: true });
console.log(result2); // "processed-example"

// Example 3: Invalid input
const result3 = functionName('');
console.log(result3); // false
```

**Edge Cases:**
```typescript
functionName('');           // [What happens with empty string]
functionName(null);         // [What happens with null] (TypeScript prevents this)
functionName(undefined);    // [What happens with undefined] (TypeScript prevents this)
functionName('very long string with 1000+ characters'); // [What happens with long input]
```

---

### Function 2: anotherFunction

[Repeat the same structure as Function 1]

**Signature:**
```typescript
function anotherFunction(param: Type): ReturnType
```

**Purpose:**
[Description]

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `param` | `Type` | Yes | [Description] |

**Returns:**

| Type | Description |
|------|-------------|
| `ReturnType` | [Description] |

**Examples:**
```typescript
// Examples
```

---

[Repeat for all functions in the utility file]

---

## Complete Usage Example

### Real-World Scenario

```typescript
import { functionName, anotherFunction } from '@l-kern/config';

function MyComponent() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    // Validate email
    if (!functionName(email)) {
      setError('Invalid email address');
      return;
    }

    // Normalize email
    const normalizedEmail = anotherFunction(email);

    // Submit
    submitForm({ email: normalizedEmail });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {error && <span>{error}</span>}
      <button type="submit">Submit</button>
    </form>
  );
}
```

---

## Performance

### Complexity Analysis

| Function | Time Complexity | Space Complexity |
|----------|----------------|------------------|
| `functionName` | O(n) | O(1) |
| `anotherFunction` | O(n) | O(n) |
| `thirdFunction` | O(1) | O(1) |

**Where:**
- n = length of input string/array
- k = number of elements

### Benchmarks

**Test Environment:**
- CPU: [Typical developer machine]
- Input: [Typical input size]

| Function | Average Time | Input Size |
|----------|-------------|------------|
| `functionName` | ~0.01ms | 100 characters |
| `anotherFunction` | ~0.005ms | 100 characters |
| `thirdFunction` | ~0.02ms | 1000 elements |

**Performance Notes:**
- ✅ Optimized for typical use cases (< 1000 characters)
- ⚠️ May slow down with very large inputs (> 10,000 characters)
- ✅ No memory leaks (no closures or event listeners)

---

## Known Issues

### Active Issues

**No known issues** ✅

*(Or list issues if any exist)*

**Issue #1**: [Short title]
- **Severity**: Low | Medium | High | Critical
- **Affects**: [Which functions]
- **Workaround**: [Temporary solution if any]
- **Tracking**: Task #123
- **Status**: Open | In Progress | Planned

### Fixed Issues

See [Changelog](#changelog) section below.

---

## Testing

### Test Coverage
- ✅ **Unit Tests**: [count] tests
- ✅ **Coverage**: [percentage]% (statements, branches, functions, lines)
- ✅ **Edge Case Tests**: [count] tests (null, undefined, empty, very long)
- ✅ **Unicode Tests**: [count] tests (special characters, emoji)

### Test File
`packages/config/src/utils/<utility-name>/<utility-name>.test.ts`

### Running Tests
```bash
# Run utility tests
docker exec lkms201-web-ui npx nx test config --testFile=utility-name.test.ts

# Run with coverage
docker exec lkms201-web-ui npx nx test config --coverage
```

### Key Test Cases

**functionName:**
- ✅ Valid inputs (typical use cases)
- ✅ Invalid inputs (edge cases)
- ✅ Empty string
- ✅ Very long string (10,000+ characters)
- ✅ Unicode characters (emoji, accents)

**anotherFunction:**
- ✅ [Test case 1]
- ✅ [Test case 2]
- ✅ [Test case 3]

[... list key test cases for each function ...]

---

## Related Utilities

- **[related-utility-1](related-utility-1.md)** - Brief description of relationship
- **[related-utility-2](related-utility-2.md)** - Brief description of relationship

---

## Related Components

- **[Component1](../components/Component1.md)** - Uses functionName
- **[Component2](../components/Component2.md)** - Uses anotherFunction

---

## Examples by Use Case

### Use Case 1: Email Validation in Form
```typescript
import { validateEmail } from '@l-kern/config';

function EmailForm() {
  const handleBlur = (email: string) => {
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
    }
  };
}
```

### Use Case 2: Email Normalization Before API Call
```typescript
import { normalizeEmail } from '@l-kern/config';

function submitContact(email: string) {
  const normalized = normalizeEmail(email); // "USER@EXAMPLE.COM" → "user@example.com"
  api.post('/contacts', { email: normalized });
}
```

### Use Case 3: Extract Domain for Analytics
```typescript
import { getEmailDomain } from '@l-kern/config';

function trackEmailDomain(email: string) {
  const domain = getEmailDomain(email); // "user@gmail.com" → "gmail.com"
  analytics.track('signup', { emailDomain: domain });
}
```

---

## Migration Guide

### From v3 to v4

**Breaking Changes:**
1. [Change description]
2. [Change description]

**Migration Example:**
```typescript
// v3
const result = oldFunction(param);

// v4
const result = newFunction(param);
```

---

## Changelog

### v1.0.0 (YYYY-MM-DD)
- 🎉 Initial release
- ✅ functionName - [Description]
- ✅ anotherFunction - [Description]
- ✅ [X] unit tests ([Y]% coverage)

---

## Troubleshooting

### Common Issues

**Issue**: Function returns false for valid input
**Cause**: Input contains whitespace
**Solution**:
```typescript
// Bad
validateEmail(' user@example.com ');  // false

// Good
validateEmail(email.trim());  // true
```

**Issue**: Performance slow on large inputs
**Cause**: Input size > 10,000 characters
**Solution**:
```typescript
// Check length before validation
if (input.length > 10000) {
  return false;  // Too long
}
return validateEmail(input);
```

---

## Best Practices

1. ✅ **Validate early** - Check inputs at form boundaries
2. ✅ **Normalize before save** - Store consistent format in database
3. ✅ **Handle edge cases** - Always trim whitespace, check length
4. ✅ **Use TypeScript** - Leverage type safety
5. ✅ **Don't validate UI-only** - Always validate on backend too

---

## Design Decisions

### Why These Validation Rules?

**Email Validation:**
- Follows RFC 5322 standard (most common email spec)
- Rejects obvious typos (missing @, no domain)
- Allows + addressing (user+tag@example.com)
- Does NOT verify domain exists (too slow)

**Phone Validation:**
- Supports SK, CZ, PL formats
- Country-specific rules (SK mobile: 9XX XXX XXX)
- International format optional (+421)

### Alternatives Considered

**Option 1**: Use external library (validator.js)
- ✅ Comprehensive validation
- ❌ Large bundle size (+50KB)
- ❌ Overkill for our needs

**Option 2**: Regex-only validation
- ✅ Fast
- ❌ Hard to maintain
- ❌ Doesn't handle edge cases

**Option 3**: Custom implementation (CHOSEN)
- ✅ Small bundle size (~2KB)
- ✅ Tailored to L-KERN needs
- ✅ Easy to extend
- ❌ More code to maintain

---

## Resources

### Internal Links
- [Coding Standards](../programming/coding-standards.md)
- [Testing Guide](../programming/testing-overview.md)
- [Design Tokens](../packages/config.md#design-tokens)

### External References
- [RFC 5322 (Email)](https://tools.ietf.org/html/rfc5322)
- [E.164 (Phone)](https://www.itu.int/rec/T-REC-E.164/)
- [MDN RegExp](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)

---

**Last Updated**: YYYY-MM-DD
**Maintainer**: BOSSystems s.r.o.
**Documentation Version**: 1.0.0
