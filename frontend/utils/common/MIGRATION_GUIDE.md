# Common Utilities Migration Guide

## Overview

This guide explains how to migrate from duplicated patterns to centralized reusable hooks and utilities.

**Benefits:**
- 750+ lines of code savings when fully adopted
- Consistent error handling across the app
- Easier testing and maintenance
- Better developer experience

## New Hooks

### `useAsyncData` Hook

Replaces 50+ manual implementations of loading/error state management.

#### Before (Manual Pattern)

```jsx
import { useState, useEffect } from 'react';

function ContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContacts = async () => {
      setLoading(true);
      try {
        const response = await contactsApi.getAll();
        setContacts(response.data);
      } catch (err) {
        setError(err.message);
        toast.error('Failed to load contacts');
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  if (loading) return <Loader />;
  if (error) return <Error message={error} />;

  return <div>{/* render contacts */}</div>;
}
```

#### After (useAsyncData)

```jsx
import { useAsyncData } from '@/hooks/useAsyncData';

function ContactsPage() {
  const { data: contacts, loading, error } = useAsyncData(
    async () => await contactsApi.getAll(),
    []
  );

  if (loading) return <Loader />;
  if (error) return <Error message={error} />;

  return <div>{/* render contacts */}</div>;
}
```

#### Advanced Usage

```jsx
import { useAsyncData } from '@/hooks/useAsyncData';
import { useToast } from '@/components/ui/use-toast';

function LeadsPage() {
  const { toast } = useToast();

  const { data: leads, loading, error, refetch } = useAsyncData(
    async (signal) => {
      const response = await leadsApi.getBootstrap(signal);
      return response.data;
    },
    [businessId], // Refetch when businessId changes
    {
      initialData: [],
      keepPreviousData: true, // Keep old data while loading new
      onSuccess: (data) => console.log('Loaded', data.length, 'leads'),
      // Don't expose raw error messages to users
      onError: () => toast.error('Failed to load leads. Please try again.'),
    }
  );

  // Manual refetch
  const handleRefresh = () => refetch();

  return (
    <div>
      <Button onClick={handleRefresh}>Refresh</Button>
      {loading && <Spinner />}
      {/* render leads */}
    </div>
  );
}
```

#### With Business Context

```jsx
import { useAsyncDataWithBusiness } from '@/hooks/useAsyncData';
import { useBusiness } from '@/context/BusinessContext';
import { demoDataService } from '@/services/demoDataService';

function DashboardPage() {
  const business = useBusiness();

  const { data: metrics, loading } = useAsyncDataWithBusiness(
    async (businessId, isDemo, signal) => {
      if (isDemo) {
        return await demoDataService.getMetrics();
      }
      return await dashboardApi.getMetrics(businessId, signal);
    },
    business,
    [], // Additional dependencies
    { initialData: {} }
  );

  // Automatically handles business switching and demo mode
}
```

## New Utilities

### Date Formatters (`@/utils/common/dateFormatters`)

Replaces 70+ instances of duplicate date formatting.

#### Before

```jsx
// Scattered across 70+ files
new Date(createdAt).toLocaleDateString();
new Date(updatedAt).toLocaleString();
formatDistance(new Date(date), new Date(), { addSuffix: true });
```

#### After

```jsx
import { formatDateShort, formatDateTime, formatRelativeTime } from '@/utils/common';

// Auto-detects language from i18n
const dateStr = formatDateShort(createdAt); // "Dec 7, 2025" or "7 dic 2025"
const dateTimeStr = formatDateTime(updatedAt); // "Dec 7, 2025, 3:30 PM"
const relativeStr = formatRelativeTime(date); // "2 hours ago" or "hace 2 horas"
```

#### Available Functions

```jsx
import {
  formatDate,           // Custom format
  formatDateShort,      // Dec 7, 2025
  formatDateLong,       // December 7, 2025
  formatDateTime,       // Dec 7, 2025, 3:30 PM
  formatRelativeTime,   // 2 hours ago
  formatTime,           // 3:30 PM
  formatDateRange,      // Dec 1 - Dec 7, 2025
  formatSmartDate,      // Today/Yesterday/5 days ago
  formatDateISO,        // 2025-12-07T15:30:00.000Z
  formatDateInput,      // 2025-12-07 (for input[type="date"])
  getTimeAgo,           // "2h ago" (compact)
} from '@/utils/common/dateFormatters';
```

### Error Handlers (`@/utils/common/errorHandlers`)

Replaces 180+ instances of duplicate error handling.

#### Before

```jsx
try {
  await contactsApi.create(data);
  toast({ title: 'Success', description: 'Contact created' });
} catch (error) {
  console.error('Error creating contact:', error);
  const message = error.response?.data?.error || error.message || 'Failed to create contact';
  toast({ title: 'Error', description: message, variant: 'destructive' });
}
```

#### After

```jsx
import { handleApiError } from '@/utils/common/errorHandlers';

try {
  await contactsApi.create(data);
  toast({ title: 'Success', description: 'Contact created' });
} catch (error) {
  handleApiError(error, { context: 'creating contact', toast });
}
```

#### Create Error Handler

```jsx
import { createErrorHandler } from '@/utils/common/errorHandlers';

function ContactsPage() {
  const { toast } = useToast();
  const handleError = createErrorHandler(toast, 'Contacts page');

  const deleteContact = async (id) => {
    try {
      await contactsApi.delete(id);
    } catch (error) {
      handleError(error, 'deleting contact'); // Auto-logs and shows toast
    }
  };
}
```

#### Available Functions

```jsx
import {
  getErrorMessage,        // Extract user-friendly message
  formatErrorForToast,    // Format for toast notification
  handleApiError,         // Handle with logging + toast
  createErrorHandler,     // Create bound error handler
  withErrorHandling,      // Wrap function with error handling
  isNetworkError,         // Check if network error
  isAuthError,            // Check if auth error
  isValidationError,      // Check if validation error
} from '@/utils/common/errorHandlers';
```

### API Helpers (`@/utils/common/apiHelpers`)

Common API patterns for queries, retries, and response handling.

#### Query String Building

```jsx
import { buildQueryString, buildUrl } from '@/utils/common/apiHelpers';

// Before
const query = `?page=${page}&limit=${limit}&status=${status}`;

// After
const query = buildQueryString({ page, limit, status }); // "page=1&limit=10&status=active"
const url = buildUrl('/api/contacts', { page, limit, status });
```

#### Retry with Exponential Backoff

```jsx
import { retryRequest } from '@/utils/common/apiHelpers';

const data = await retryRequest(
  () => api.get('/contacts'),
  {
    maxAttempts: 3,
    delay: 1000,
    backoff: 2, // 1s, 2s, 4s
  }
);
```

#### Safe API Call

```jsx
import { safeApiCall } from '@/utils/common/apiHelpers';

const { data, error } = await safeApiCall(
  () => contactsApi.getAll(),
  { context: 'loading contacts', toast }
);

if (error) return; // Error already handled
// Use data
```

#### Available Functions

```jsx
import {
  buildQueryString,         // Build query string from object
  buildUrl,                 // Build URL with query params
  parseResponse,            // Parse various API response formats
  parsePaginatedResponse,   // Parse paginated responses
  retryRequest,             // Retry with exponential backoff
  batchRequests,            // Batch requests with concurrency
  debounceApiCall,          // Debounce API calls
  safeApiCall,              // Safe API call with error handling
  transformSupabaseResponse,// Transform Supabase response
  buildSupabaseFilters,     // Build Supabase filters
} from '@/utils/common/apiHelpers';
```

### Validators (`@/utils/common/validators`)

Reusable validation functions for forms and data.

#### Before

```jsx
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  setError('Invalid email');
}
```

#### After

```jsx
import { validateEmail } from '@/utils/common/validators';

if (!validateEmail(email)) {
  setError('Invalid email');
}
```

#### Available Functions

```jsx
import {
  validateEmail,            // Email validation
  validatePhone,            // US phone validation
  validateUrl,              // URL validation
  validateRequired,         // Required field
  validateMinLength,        // Minimum length
  validateMaxLength,        // Maximum length
  validateNumberRange,      // Number in range
  validatePassword,         // Password strength
  validateSlug,             // URL-safe slug
  validateFileExtension,    // File extension
  validateFileSize,         // File size
  createValidator,          // Create custom validator
  combineValidators,        // Combine multiple validators
} from '@/utils/common/validators';
```

#### With React Hook Form

```jsx
import { useForm } from 'react-hook-form';
import { validateEmail, validateRequired, createValidator, combineValidators } from '@/utils/common/validators';

const { register, handleSubmit, formState: { errors } } = useForm();

<input
  {...register('email', {
    validate: combineValidators(
      createValidator(validateRequired, 'Email is required'),
      createValidator(validateEmail, 'Invalid email address')
    )
  })}
/>
```

## Migration Priority

### High Priority (Immediate Benefits)

Files with most duplication - migrate these first:

1. **Dashboard.jsx** - 200+ lines using manual loading states
2. **Contacts.jsx** - 150+ lines using manual loading states
3. **Leads.jsx** - 150+ lines using manual loading states
4. **Calendar.jsx** - 100+ lines using manual loading + date formatting
5. **Opportunities.jsx** - 100+ lines using manual loading states

### Medium Priority

Files with moderate duplication:

- FormBuilderV2.jsx
- Calls.jsx
- BillingSettings.jsx
- AgencySettings.jsx
- Profile.jsx

### Low Priority

Files with minimal duplication - migrate as needed:

- Component libraries
- Utility widgets
- Test files

## Migration Checklist

For each file you migrate:

- [ ] Replace manual loading states with `useAsyncData`
- [ ] Replace date formatting with `@/utils/common/dateFormatters`
- [ ] Replace error handling with `@/utils/common/errorHandlers`
- [ ] Replace query building with `@/utils/common/apiHelpers`
- [ ] Replace validation logic with `@/utils/common/validators`
- [ ] Test the component thoroughly
- [ ] Remove unused imports
- [ ] Update tests if needed

## Example: Full Migration

### Before (Dashboard.jsx - Partial)

```jsx
import { useState, useEffect } from 'react';

function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      try {
        const response = await dashboardApi.getMetrics();
        setMetrics(response.data);
      } catch (err) {
        const message = err.response?.data?.error || err.message || 'Failed to load metrics';
        setError(message);
        toast({ title: 'Error', description: message, variant: 'destructive' });
        console.error('Error loading metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [businessId]);

  const formattedDate = new Date(metrics?.lastUpdated).toLocaleDateString();

  return (
    <div>
      {loading && <Spinner />}
      {error && <Error message={error} />}
      {metrics && (
        <div>
          <p>Last updated: {formattedDate}</p>
          {/* ... */}
        </div>
      )}
    </div>
  );
}
```

### After (Dashboard.jsx - Migrated)

```jsx
import { useAsyncData } from '@/hooks/useAsyncData';
import { formatDateShort } from '@/utils/common/dateFormatters';
import { useToast } from '@/components/ui/use-toast';

function Dashboard() {
  const { toast } = useToast();

  const { data: metrics, loading, error } = useAsyncData(
    async () => await dashboardApi.getMetrics(),
    [businessId],
    {
      onError: (err) => toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive'
      })
    }
  );

  return (
    <div>
      {loading && <Spinner />}
      {error && <Error message={error} />}
      {metrics && (
        <div>
          <p>Last updated: {formatDateShort(metrics.lastUpdated)}</p>
          {/* ... */}
        </div>
      )}
    </div>
  );
}
```

**Lines saved:** ~25 lines removed

## Common Patterns

### Pattern 1: Fetch on Mount

```jsx
// Before: 15 lines
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  const fetch = async () => {
    setLoading(true);
    try {
      const res = await api.get();
      setData(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  fetch();
}, []);

// After: 5 lines
const { data, loading, error } = useAsyncData(
  () => api.get(),
  [],
  { initialData: [] }
);
```

### Pattern 2: Error Handling

```jsx
// Before: 8 lines
catch (error) {
  console.error('Error:', error);
  const msg = error.response?.data?.error || error.message || 'Error occurred';
  toast({ title: 'Error', description: msg, variant: 'destructive' });
  Sentry.captureException(error);
}

// After: 3 lines
catch (error) {
  handleApiError(error, { context: 'operation', toast });
}
```

### Pattern 3: Date Formatting

```jsx
// Before: Multiple variations across files
new Date(date).toLocaleDateString()
new Date(date).toLocaleString()
format(new Date(date), 'MMM d, yyyy')
formatDistance(new Date(date), new Date())

// After: Consistent, locale-aware
formatDateShort(date)      // Locale-aware
formatDateTime(date)       // Locale-aware
formatRelativeTime(date)   // Locale-aware
```

## Testing

All utilities include JSDoc comments with examples. Test them in isolation:

```jsx
import { formatDateShort, handleApiError, validateEmail } from '@/utils/common';

// Test date formatting
console.log(formatDateShort(new Date())); // "Jan 16, 2026"

// Test validation
console.log(validateEmail('test@example.com')); // true
console.log(validateEmail('invalid')); // false

// Test error handling
try {
  throw new Error('Test error');
} catch (error) {
  const message = getErrorMessage(error); // "Test error"
}
```

## Support

If you encounter issues during migration:

1. Check JSDoc comments in utility files
2. Review examples in this guide
3. Look at migrated components for reference
4. Test each change incrementally

## Estimated Savings

When fully adopted across the codebase:

- **750+ lines removed** (duplicate code)
- **~15% reduction** in component complexity
- **Consistent patterns** across all pages
- **Easier testing** with centralized utilities
- **Better developer experience** with clear APIs
