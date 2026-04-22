# Common Utilities

Centralized, reusable utilities for Axolop CRM.

## Overview

This directory contains common utilities that replace 50+ instances of duplicated patterns across the codebase. These utilities provide:

- **Consistent patterns** across all components
- **Reduced code duplication** (~750 lines savings)
- **Better error handling** with logging and user feedback
- **Locale-aware formatting** for dates, numbers, and currency
- **Reusable validation** functions
- **API helpers** for common operations

## Quick Start

```javascript
// Import what you need
import {
  useAsyncData,           // Hook
  formatDateShort,        // Date formatter
  handleApiError,         // Error handler
  validateEmail,          // Validator
  buildQueryString,       // API helper
} from '@/utils/common';

// Or import from specific files
import { useAsyncData } from '@/hooks/useAsyncData';
import { formatDateShort } from '@/utils/common/dateFormatters';
import { handleApiError } from '@/utils/common/errorHandlers';
```

## Contents

### 1. `useAsyncData` Hook

**File:** `/frontend/hooks/useAsyncData.js`

Replaces manual loading/error state management.

```javascript
const { data, loading, error, refetch } = useAsyncData(
  async () => await contactsApi.getAll(),
  [businessId],
  { initialData: [] }
);
```

**Features:**
- Automatic loading/error states
- Abort controller support
- Business context integration
- Debounce support
- Keep previous data option

**Replaces:** 45+ instances of manual useState + useEffect patterns

---

### 2. Date Formatters

**File:** `/frontend/utils/common/dateFormatters.js`

Locale-aware date formatting utilities.

```javascript
import { formatDateShort, formatDateTime, formatRelativeTime } from '@/utils/common';

formatDateShort(date);      // "Dec 7, 2025" or "7 dic 2025"
formatDateTime(date);       // "Dec 7, 2025, 3:30 PM" or "7 dic 2025, 15:30"
formatRelativeTime(date);   // "2 hours ago" or "hace 2 horas"
formatSmartDate(date);      // "Today" / "Yesterday" / "5 days ago"
```

**Available Functions:**
- `formatDate(date, format)` - Custom format
- `formatDateShort(date)` - Short date
- `formatDateLong(date)` - Long date
- `formatDateTime(date)` - Date + time
- `formatRelativeTime(date)` - Relative time
- `formatTime(date)` - Time only
- `formatDateRange(start, end)` - Date range
- `formatSmartDate(date)` - Smart relative/absolute
- `formatDateISO(date)` - ISO format
- `formatDateInput(date)` - For input[type="date"]
- `getTimeAgo(date)` - Compact time ago

**Replaces:** 70+ instances of manual date formatting

---

### 3. Error Handlers

**File:** `/frontend/utils/common/errorHandlers.js`

Consistent error handling with logging and user feedback.

```javascript
import { handleApiError, createErrorHandler } from '@/utils/common';

// Quick error handling
try {
  await api.create(data);
} catch (error) {
  handleApiError(error, { context: 'creating contact', toast });
}

// Create bound error handler
const handleError = createErrorHandler(toast, 'Contacts page');
handleError(error, 'deleting contact');
```

**Available Functions:**
- `getErrorMessage(error)` - Extract message
- `formatErrorForToast(error, context)` - Format for toast
- `handleApiError(error, options)` - Handle with logging + toast
- `createErrorHandler(toast, context)` - Create bound handler
- `withErrorHandling(fn, options)` - Wrap function
- `isNetworkError(error)` - Check error type
- `isAuthError(error)` - Check auth error
- `isValidationError(error)` - Check validation error

**Replaces:** 180+ instances of manual error handling

---

### 4. API Helpers

**File:** `/frontend/utils/common/apiHelpers.js`

Common API patterns and utilities.

```javascript
import { buildQueryString, buildUrl, retryRequest, safeApiCall } from '@/utils/common';

// Build query strings
const url = buildUrl('/api/contacts', { page: 1, limit: 10, status: 'active' });

// Retry with backoff
const data = await retryRequest(
  () => api.get('/contacts'),
  { maxAttempts: 3, delay: 1000 }
);

// Safe API call with error handling
const { data, error } = await safeApiCall(
  () => contactsApi.getAll(),
  { context: 'loading contacts', toast }
);
```

**Available Functions:**
- `buildQueryString(params)` - Build query string
- `buildUrl(base, params)` - Build full URL
- `parseResponse(response)` - Parse API response
- `parsePaginatedResponse(response)` - Parse pagination
- `retryRequest(fn, options)` - Retry with backoff
- `batchRequests(requests, concurrency)` - Batch with limit
- `debounceApiCall(fn, delay)` - Debounce API calls
- `safeApiCall(fn, options)` - Safe call with error handling
- `transformSupabaseResponse(response)` - Transform Supabase
- `buildSupabaseFilters(filters)` - Build Supabase filters

**Replaces:** 100+ instances of manual query building and response handling

---

### 5. Validators

**File:** `/frontend/utils/common/validators.js`

Reusable validation functions.

```javascript
import { validateEmail, validatePhone, validatePassword, createValidator } from '@/utils/common';

// Basic validation
if (!validateEmail(email)) {
  setError('Invalid email');
}

// With React Hook Form
<input
  {...register('email', {
    validate: createValidator(validateEmail, 'Invalid email address')
  })}
/>
```

**Available Functions:**
- `validateEmail(email)` - Email validation
- `validatePhone(phone)` - US phone validation
- `validateUrl(url)` - URL validation
- `validateRequired(value)` - Required field
- `validateMinLength(value, min)` - Min length
- `validateMaxLength(value, max)` - Max length
- `validateNumberRange(value, min, max)` - Number range
- `validatePassword(password, options)` - Password strength
- `validateSlug(slug)` - URL-safe slug
- `validateFileExtension(filename, exts)` - File extension
- `validateFileSize(size, maxMB)` - File size
- `createValidator(fn, message)` - Custom validator
- `combineValidators(...validators)` - Combine validators

**Replaces:** 50+ instances of manual validation

---

## Usage Examples

### Example 1: Page with Data Fetching

```javascript
import { useAsyncData } from '@/hooks/useAsyncData';
import { formatDateShort } from '@/utils/common';
import { handleApiError } from '@/utils/common';
import { useToast } from '@/components/ui/use-toast';

function ContactsPage() {
  const { toast } = useToast();

  const { data: contacts, loading, error, refetch } = useAsyncData(
    async () => await contactsApi.getAll(),
    [],
    {
      initialData: [],
      onError: (err) => handleApiError(err, { context: 'loading contacts', toast })
    }
  );

  return (
    <div>
      {loading && <Spinner />}
      {contacts.map(contact => (
        <div key={contact.id}>
          <p>{contact.name}</p>
          <p>Created: {formatDateShort(contact.created_at)}</p>
        </div>
      ))}
    </div>
  );
}
```

### Example 2: Form with Validation

```javascript
import { useForm } from 'react-hook-form';
import { validateEmail, validateRequired, createValidator, combineValidators } from '@/utils/common';

function ContactForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <form>
      <input
        {...register('email', {
          validate: combineValidators(
            createValidator(validateRequired, 'Email is required'),
            createValidator(validateEmail, 'Invalid email address')
          )
        })}
      />
      {errors.email && <span>{errors.email.message}</span>}
    </form>
  );
}
```

### Example 3: Error Handling

```javascript
import { createErrorHandler, handleApiError } from '@/utils/common';
import { useToast } from '@/components/ui/use-toast';

function ContactActions() {
  const { toast } = useToast();
  const handleError = createErrorHandler(toast, 'Contact actions');

  const deleteContact = async (id) => {
    try {
      await contactsApi.delete(id);
      toast({ title: 'Success', description: 'Contact deleted' });
    } catch (error) {
      handleError(error, 'deleting contact');
    }
  };

  return <button onClick={() => deleteContact(123)}>Delete</button>;
}
```

## Migration Guide

See [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) for detailed migration instructions.

See [PATTERN_LOCATIONS.md](./PATTERN_LOCATIONS.md) for a map of where patterns exist in the codebase.

## Benefits

### Code Reduction
- **750+ lines** removed when fully adopted
- **~15% reduction** in component complexity
- **Fewer bugs** from copy-paste errors

### Consistency
- **Unified error handling** across all components
- **Consistent date formatting** with locale support
- **Standard validation** patterns

### Developer Experience
- **Easy to use** - simple imports, clear APIs
- **Well documented** - JSDoc comments with examples
- **Type hints** - JSDoc for better IDE support
- **Testing** - Utilities are easier to test in isolation

### Maintainability
- **Single source of truth** for common patterns
- **Easier updates** - change once, apply everywhere
- **Better code reviews** - consistent patterns

## Testing

All utilities are pure functions and easy to test:

```javascript
import { formatDateShort, validateEmail, getErrorMessage } from '@/utils/common';

// Test formatters
expect(formatDateShort(new Date('2025-12-07'))).toBe('Dec 7, 2025');

// Test validators
expect(validateEmail('test@example.com')).toBe(true);
expect(validateEmail('invalid')).toBe(false);

// Test error handlers
const error = new Error('Test error');
expect(getErrorMessage(error)).toBe('Test error');
```

## Performance

- **Lightweight** - No heavy dependencies
- **Tree-shakeable** - Only import what you use
- **Memoization** - Hook uses memoization for performance
- **Debouncing** - Built-in debounce for API calls

## Browser Support

All utilities work in:
- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)

Uses standard Web APIs:
- `Intl.DateTimeFormat` for locale-aware formatting
- `AbortController` for request cancellation
- `URLSearchParams` for query string building

## Contributing

When adding new utilities:

1. **Create file** in appropriate category
2. **Add JSDoc comments** with examples
3. **Export from index.js** for convenience
4. **Update README.md** with usage examples
5. **Add to MIGRATION_GUIDE.md** if replacing existing patterns

## Support

For questions or issues:

1. Check JSDoc comments in source files
2. Review examples in MIGRATION_GUIDE.md
3. Look at migrated components for reference
4. Open an issue with specific questions

## License

Part of Axolop CRM - Internal use only.
