# Example Migration - Before and After

This document shows real-world examples of how components look before and after migration to the new utilities.

## Example 1: Simple Page (Small Component)

### Before Migration (LeadQueueCard.jsx - Partial)

```jsx
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

function LeadQueueCard({ queueId }) {
  const [queue, setQueue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchQueue = async () => {
      setLoading(true);
      try {
        const response = await dialerGroupService.getQueue(queueId);
        setQueue(response.data);
      } catch (err) {
        console.error('Error loading queue:', err);
        const message = err.response?.data?.error || err.message || 'Failed to load queue';
        setError(message);
        toast({
          title: 'Error',
          description: message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchQueue();
  }, [queueId]);

  // Date formatting
  const formattedDate = queue?.created_at
    ? new Date(queue.created_at).toLocaleDateString()
    : '';

  if (loading) return <Spinner />;
  if (error) return <Error message={error} />;

  return (
    <Card>
      <h3>{queue.name}</h3>
      <p>Created: {formattedDate}</p>
      <p>{queue.leads_count} leads</p>
    </Card>
  );
}
```

**Lines of code:** ~45 lines

---

### After Migration (LeadQueueCard.jsx - Migrated)

```jsx
import { useAsyncData } from '@/hooks/useAsyncData';
import { formatDateShort } from '@/utils/common';
import { useToast } from '@/components/ui/use-toast';

function LeadQueueCard({ queueId }) {
  const { toast } = useToast();

  const { data: queue, loading, error } = useAsyncData(
    async () => await dialerGroupService.getQueue(queueId),
    [queueId],
    {
      onError: (err) => toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      })
    }
  );

  if (loading) return <Spinner />;
  if (error) return <Error message={error} />;

  return (
    <Card>
      <h3>{queue.name}</h3>
      <p>Created: {formatDateShort(queue.created_at)}</p>
      <p>{queue.leads_count} leads</p>
    </Card>
  );
}
```

**Lines of code:** ~25 lines

**Savings:** 20 lines (44% reduction)

**Improvements:**
- ✅ Automatic abort controller (prevents memory leaks)
- ✅ Cleaner error handling
- ✅ Locale-aware date formatting
- ✅ Consistent with rest of codebase
- ✅ Less code to maintain

---

## Example 2: Complex Page (Dashboard Metrics)

### Before Migration (Dashboard.jsx - Metrics Section)

```jsx
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useBusiness } from '@/context/BusinessContext';
import { demoDataService } from '@/services/demoDataService';

function DashboardMetrics() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();
  const { isDemoBusinessSelected, selectedBusinessId } = useBusiness();

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      setError(null);

      try {
        let response;

        if (isDemoBusinessSelected()) {
          console.log('[Dashboard] Using demo metrics');
          response = await demoDataService.getMetrics();
        } else {
          response = await dashboardApi.getMetrics(selectedBusinessId);
        }

        setMetrics(response.data);
      } catch (err) {
        console.error('[Dashboard] Error loading metrics:', err);

        const message = err.response?.data?.error
          || err.message
          || 'Failed to load dashboard metrics';

        setError(message);

        toast({
          title: 'Error loading dashboard',
          description: message,
          variant: 'destructive',
        });

        // Log to Sentry in production
        if (!import.meta.env.DEV) {
          Sentry.captureException(err, {
            tags: { component: 'Dashboard', action: 'load_metrics' },
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [selectedBusinessId, isDemoBusinessSelected]);

  // Format dates
  const formattedLastUpdate = metrics?.last_updated
    ? new Date(metrics.last_updated).toLocaleDateString()
    : 'Never';

  const formattedCreatedAt = metrics?.created_at
    ? new Date(metrics.created_at).toLocaleString()
    : '';

  if (loading) {
    return (
      <div className="grid grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} />)}
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      <MetricCard
        title="Revenue"
        value={`$${metrics.revenue.toLocaleString()}`}
        change={`${metrics.revenue_change}%`}
      />
      <MetricCard
        title="Contacts"
        value={metrics.contacts_count}
        subtitle={`Updated ${formattedLastUpdate}`}
      />
      <MetricCard
        title="Leads"
        value={metrics.leads_count}
        subtitle={`Created ${formattedCreatedAt}`}
      />
      {/* ... more metrics */}
    </div>
  );
}
```

**Lines of code:** ~95 lines

---

### After Migration (Dashboard.jsx - Metrics Section)

```jsx
import { useAsyncDataWithBusiness } from '@/hooks/useAsyncData';
import { formatDateShort, formatDateTime } from '@/utils/common';
import { handleApiError } from '@/utils/common';
import { useToast } from '@/components/ui/use-toast';
import { useBusiness } from '@/context/BusinessContext';
import { demoDataService } from '@/services/demoDataService';

function DashboardMetrics() {
  const { toast } = useToast();
  const business = useBusiness();

  const { data: metrics, loading, error } = useAsyncDataWithBusiness(
    async (businessId, isDemo) => {
      if (isDemo) {
        console.log('[Dashboard] Using demo metrics');
        return await demoDataService.getMetrics();
      }
      return await dashboardApi.getMetrics(businessId);
    },
    business,
    [],
    {
      onError: (err) => handleApiError(err, {
        context: 'loading dashboard metrics',
        toast,
      })
    }
  );

  if (loading) {
    return (
      <div className="grid grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} />)}
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      <MetricCard
        title="Revenue"
        value={`$${metrics.revenue.toLocaleString()}`}
        change={`${metrics.revenue_change}%`}
      />
      <MetricCard
        title="Contacts"
        value={metrics.contacts_count}
        subtitle={`Updated ${formatDateShort(metrics.last_updated) || 'Never'}`}
      />
      <MetricCard
        title="Leads"
        value={metrics.leads_count}
        subtitle={`Created ${formatDateTime(metrics.created_at)}`}
      />
      {/* ... more metrics */}
    </div>
  );
}
```

**Lines of code:** ~50 lines

**Savings:** 45 lines (47% reduction)

**Improvements:**
- ✅ Automatic business context handling
- ✅ Automatic demo mode detection
- ✅ Consistent error handling with Sentry logging
- ✅ Locale-aware date formatting
- ✅ Cleaner, more readable code
- ✅ Automatic abort controller
- ✅ Less prone to bugs

---

## Example 3: Form with Validation

### Before Migration (ContactForm.jsx)

```jsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from '@/components/ui/use-toast';

function ContactForm({ onSuccess }) {
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) || 'Invalid email address';
  };

  const validatePhone = (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    return (cleaned.length === 10 || cleaned.length === 11) || 'Invalid phone number';
  };

  const onSubmit = async (data) => {
    setSaving(true);

    try {
      await contactsApi.create(data);

      toast({
        title: 'Success',
        description: 'Contact created successfully',
      });

      onSuccess?.();
    } catch (error) {
      console.error('Error creating contact:', error);

      const message = error.response?.data?.error
        || error.message
        || 'Failed to create contact';

      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('name', {
          required: 'Name is required',
          minLength: { value: 2, message: 'Name must be at least 2 characters' }
        })}
        placeholder="Name"
      />
      {errors.name && <span>{errors.name.message}</span>}

      <input
        {...register('email', {
          required: 'Email is required',
          validate: validateEmail
        })}
        placeholder="Email"
      />
      {errors.email && <span>{errors.email.message}</span>}

      <input
        {...register('phone', { validate: validatePhone })}
        placeholder="Phone"
      />
      {errors.phone && <span>{errors.phone.message}</span>}

      <button type="submit" disabled={saving}>
        {saving ? 'Saving...' : 'Create Contact'}
      </button>
    </form>
  );
}
```

**Lines of code:** ~75 lines

---

### After Migration (ContactForm.jsx)

```jsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from '@/components/ui/use-toast';
import {
  validateEmail,
  validatePhone,
  validateRequired,
  validateMinLength,
  createValidator,
  combineValidators,
  handleApiError,
} from '@/utils/common';

function ContactForm({ onSuccess }) {
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setSaving(true);

    try {
      await contactsApi.create(data);

      toast({
        title: 'Success',
        description: 'Contact created successfully',
      });

      onSuccess?.();
    } catch (error) {
      handleApiError(error, { context: 'creating contact', toast });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('name', {
          validate: combineValidators(
            createValidator(validateRequired, 'Name is required'),
            createValidator((v) => validateMinLength(v, 2), 'Name must be at least 2 characters')
          )
        })}
        placeholder="Name"
      />
      {errors.name && <span>{errors.name.message}</span>}

      <input
        {...register('email', {
          validate: combineValidators(
            createValidator(validateRequired, 'Email is required'),
            createValidator(validateEmail, 'Invalid email address')
          )
        })}
        placeholder="Email"
      />
      {errors.email && <span>{errors.email.message}</span>}

      <input
        {...register('phone', {
          validate: createValidator(validatePhone, 'Invalid phone number')
        })}
        placeholder="Phone"
      />
      {errors.phone && <span>{errors.phone.message}</span>}

      <button type="submit" disabled={saving}>
        {saving ? 'Saving...' : 'Create Contact'}
      </button>
    </form>
  );
}
```

**Lines of code:** ~55 lines

**Savings:** 20 lines (27% reduction)

**Improvements:**
- ✅ Reusable validation functions
- ✅ Consistent error handling
- ✅ No duplicate validation logic
- ✅ Easier to test
- ✅ More maintainable

---

## Summary

### Example 1: LeadQueueCard
- **Before:** 45 lines
- **After:** 25 lines
- **Savings:** 20 lines (44% reduction)

### Example 2: DashboardMetrics
- **Before:** 95 lines
- **After:** 50 lines
- **Savings:** 45 lines (47% reduction)

### Example 3: ContactForm
- **Before:** 75 lines
- **After:** 55 lines
- **Savings:** 20 lines (27% reduction)

### Total Example Savings
- **Before:** 215 lines
- **After:** 130 lines
- **Savings:** 85 lines (40% reduction)

## Key Benefits Demonstrated

1. **Cleaner Code**
   - Less boilerplate
   - More readable
   - Clearer intent

2. **Consistent Patterns**
   - Same error handling everywhere
   - Same date formatting everywhere
   - Same validation patterns

3. **Better Error Handling**
   - Automatic Sentry logging
   - Consistent toast messages
   - Better error extraction

4. **Locale Support**
   - Automatic language detection
   - Consistent formatting
   - No manual locale management

5. **Fewer Bugs**
   - No copy-paste errors
   - Single source of truth
   - Easier to fix issues

6. **Easier Testing**
   - Utilities are testable
   - Less code to test
   - Predictable behavior

## Next Steps

1. Review these examples
2. Try migrating a small component
3. Follow the migration guide
4. Gradually migrate high-priority files
5. Enjoy cleaner, more maintainable code!
