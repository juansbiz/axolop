# Quick Reference Card

One-page reference for common utilities. Keep this handy while coding!

## Import Statement

```javascript
// Import everything you need at once
import {
  useAsyncData,          // Hook
  formatDateShort,       // Date formatter
  handleApiError,        // Error handler
  validateEmail,         // Validator
  buildQueryString,      // API helper
} from '@/utils/common';
```

---

## useAsyncData Hook

**Most Common Usage:**
```javascript
const { data, loading, error, refetch } = useAsyncData(
  async () => await api.getAll(),
  [dependency],
  { initialData: [] }
);
```

**With Business Context:**
```javascript
const business = useBusiness();
const { data, loading } = useAsyncDataWithBusiness(
  async (businessId, isDemo) => {
    if (isDemo) return demoDataService.get();
    return api.get(businessId);
  },
  business,
  []
);
```

---

## Date Formatters

```javascript
formatDateShort(date)        // "Dec 7, 2025"
formatDateTime(date)         // "Dec 7, 2025, 3:30 PM"
formatRelativeTime(date)     // "2 hours ago"
formatSmartDate(date)        // "Today" / "Yesterday" / "5 days ago"
getTimeAgo(date)             // "2h ago"
formatDateISO(date)          // "2025-12-07T15:30:00.000Z"
formatDateInput(date)        // "2025-12-07"
```

---

## Error Handlers

**Simple Usage:**
```javascript
try {
  await api.create(data);
} catch (error) {
  handleApiError(error, { context: 'creating item', toast });
}
```

**Create Bound Handler:**
```javascript
const handleError = createErrorHandler(toast, 'Page name');
handleError(error, 'operation name');
```

**Check Error Types:**
```javascript
if (isNetworkError(error)) { /* handle network error */ }
if (isAuthError(error)) { /* redirect to login */ }
if (isValidationError(error)) { /* show validation */ }
```

---

## API Helpers

```javascript
// Build query strings
const url = buildUrl('/api/contacts', { page: 1, limit: 10 });

// Retry with backoff
const data = await retryRequest(
  () => api.get('/contacts'),
  { maxAttempts: 3, delay: 1000 }
);

// Safe API call
const { data, error } = await safeApiCall(
  () => api.getAll(),
  { context: 'loading data', toast }
);
if (error) return; // Already handled
```

---

## Validators

**Basic Usage:**
```javascript
if (!validateEmail(email)) setError('Invalid email');
if (!validatePhone(phone)) setError('Invalid phone');
if (!validateUrl(url)) setError('Invalid URL');
if (!validateRequired(value)) setError('Required');
```

**With React Hook Form:**
```javascript
<input
  {...register('email', {
    validate: combineValidators(
      createValidator(validateRequired, 'Email required'),
      createValidator(validateEmail, 'Invalid email')
    )
  })}
/>
```

**Password Validation:**
```javascript
const result = validatePassword(password, {
  minLength: 8,
  requireUppercase: true,
  requireNumber: true,
});
if (!result.valid) {
  console.log(result.errors); // Array of error messages
}
```

---

## Common Patterns

### Pattern 1: Page Component
```javascript
import { useAsyncData } from '@/hooks/useAsyncData';
import { formatDateShort } from '@/utils/common';

function MyPage() {
  const { data, loading, error } = useAsyncData(
    () => api.getAll(),
    [],
    { initialData: [] }
  );

  if (loading) return <Loader />;
  if (error) return <Error message={error} />;

  return (
    <div>
      {data.map(item => (
        <div key={item.id}>
          <p>{item.name}</p>
          <p>{formatDateShort(item.created_at)}</p>
        </div>
      ))}
    </div>
  );
}
```

### Pattern 2: Form Component
```javascript
import { validateEmail, createValidator } from '@/utils/common';
import { handleApiError } from '@/utils/common';

function MyForm() {
  const { toast } = useToast();
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      await api.create(data);
      toast({ title: 'Success' });
    } catch (error) {
      handleApiError(error, { context: 'creating item', toast });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('email', {
          validate: createValidator(validateEmail, 'Invalid email')
        })}
      />
    </form>
  );
}
```

### Pattern 3: API Integration
```javascript
import { buildUrl, retryRequest, safeApiCall } from '@/utils/common';

// Build URLs with params
const url = buildUrl('/api/contacts', { page: 1, status: 'active' });

// Retry failed requests
const data = await retryRequest(() => api.get(url), {
  maxAttempts: 3,
  delay: 1000
});

// Safe API call (errors handled automatically)
const { data, error } = await safeApiCall(
  () => api.get(url),
  { context: 'loading contacts', toast }
);
```

---

## Migration Checklist

When migrating a component:

1. **Replace loading states** with `useAsyncData`
2. **Replace date formatting** with `formatDateShort`, etc.
3. **Replace error handling** with `handleApiError`
4. **Replace validation** with `validateEmail`, etc.
5. **Replace API patterns** with `buildUrl`, etc.
6. **Test thoroughly**

---

## File Locations

```
/frontend/
├── hooks/useAsyncData.js              # Main hook
└── utils/common/
    ├── index.js                       # Import from here
    ├── dateFormatters.js              # Date utilities
    ├── errorHandlers.js               # Error utilities
    ├── apiHelpers.js                  # API utilities
    ├── validators.js                  # Validation utilities
    ├── README.md                      # Full docs
    ├── MIGRATION_GUIDE.md             # Migration help
    └── EXAMPLE_MIGRATION.md           # Examples
```

---

## Key Benefits

✅ **Less code** - 750+ lines saved
✅ **Consistent** - Same patterns everywhere
✅ **Locale-aware** - Automatic language detection
✅ **Better errors** - Automatic logging + user feedback
✅ **Fewer bugs** - Single source of truth

---

## Need Help?

1. **Quick examples:** See `EXAMPLE_MIGRATION.md`
2. **Full guide:** See `MIGRATION_GUIDE.md`
3. **Pattern map:** See `PATTERN_LOCATIONS.md`
4. **All functions:** See `README.md`
5. **JSDoc:** Hover over functions in IDE

---

## Common Mistakes to Avoid

❌ **Don't:**
```javascript
// Manual loading states
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
// ... manual useEffect

// Manual date formatting
new Date().toLocaleDateString()

// Manual error extraction
error.response?.data?.error || error.message || 'Error'
```

✅ **Do:**
```javascript
// Use hook
const { data, loading, error } = useAsyncData(() => api.get(), []);

// Use formatter
formatDateShort(date)

// Use handler
handleApiError(error, { context, toast })
```

---

## Performance Tips

- `useAsyncData` includes automatic abort controller
- Date formatters cache locale objects
- Error handlers batch Sentry calls
- API helpers support request deduplication

---

**Print this and keep at your desk for quick reference!**
