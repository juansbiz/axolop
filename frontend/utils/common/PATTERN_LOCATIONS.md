# Pattern Locations - Where to Apply New Utilities

This document maps where duplicated patterns exist across the codebase and should be replaced with the new utilities.

## Manual Loading State Pattern (useAsyncData)

**Pattern:** `useState(loading)` + `useState(error)` + `useEffect` with try-catch

**Found in 45+ files:**

### High Priority (200+ lines each)
- `/frontend/pages/Dashboard.jsx` - Multiple data fetching calls
- `/frontend/pages/Contacts.jsx` - Contact loading + stats
- `/frontend/pages/Leads.jsx` - Lead loading + stats
- `/frontend/pages/Calendar.jsx` - Calendar events + meetings
- `/frontend/pages/Opportunities.jsx` - Deals/opportunities loading

### Medium Priority (100-150 lines each)
- `/frontend/pages/SalesDialer.jsx` - Dialer data + lead queue
- `/frontend/pages/Calls.jsx` - Call history loading
- `/frontend/pages/FormBuilderV2.jsx` - Form data loading
- `/frontend/pages/Forms.jsx` - Forms list loading
- `/frontend/pages/BillingSettings.jsx` - Subscription data loading
- `/frontend/pages/AgencySettings.jsx` - Agency data loading
- `/frontend/pages/Profile.jsx` - Profile data loading
- `/frontend/pages/ProfileSettings.jsx` - Settings loading
- `/frontend/pages/AgencyAnalytics.jsx` - Analytics data loading

### Lower Priority (50-100 lines each)
- `/frontend/pages/AffiliatePortal.jsx`
- `/frontend/pages/ImportSharingHub.jsx`
- `/frontend/pages/AgencyManagement.jsx`
- `/frontend/pages/Funnels.jsx`
- `/frontend/pages/FunnelAnalytics.jsx`
- `/frontend/pages/Home.jsx`
- `/frontend/pages/InviteLandingPage.jsx`
- `/frontend/components/EnhancedLeadImportModal.jsx`
- `/frontend/components/MeetingsPanel.jsx`
- `/frontend/components/dialer/LeadQueueList.jsx`
- `/frontend/components/dialer/DialerGroupSelector.jsx`

**Pattern Example:**
```javascript
// REPLACE THIS:
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
}, [deps]);

// WITH THIS:
const { data, loading, error } = useAsyncData(
  () => api.get(),
  [deps],
  { initialData: [] }
);
```

---

## Date Formatting Pattern

**Pattern:** Manual date formatting with `new Date()` + locale methods

**Found in 70+ files:**

### Files with Heavy Date Usage (10+ instances)
- `/frontend/pages/Calendar.jsx` - Event dates, times
- `/frontend/pages/Calls.jsx` - Call timestamps
- `/frontend/pages/Dashboard.jsx` - Metric dates
- `/frontend/pages/Leads.jsx` - Lead created dates
- `/frontend/pages/Contacts.jsx` - Contact dates
- `/frontend/pages/BillingSettings.jsx` - Subscription dates
- `/frontend/pages/AffiliatePortal.jsx` - Payout dates
- `/frontend/pages/Profile.jsx` - User dates
- `/frontend/components/dialer/LeadQueueCard.jsx` - Queue dates
- `/frontend/components/billing/BillingHistory.jsx` - Transaction dates

### Files with Moderate Date Usage (5-10 instances)
- `/frontend/pages/AgencyAnalytics.jsx`
- `/frontend/pages/FunnelAnalytics.jsx`
- `/frontend/pages/InviteLandingPage.jsx`
- `/frontend/pages/PaymentSuccess.jsx`
- `/frontend/pages/ImportSharingHub.jsx`
- `/frontend/pages/Opportunities.jsx`
- `/frontend/components/TuesdayTable/TableRow.jsx`
- `/frontend/components/business/ActivityLog.jsx`

**Pattern Examples:**
```javascript
// REPLACE THESE:
new Date(date).toLocaleDateString()
new Date(date).toLocaleString()
format(new Date(date), 'MMM d, yyyy')
formatDistance(new Date(date), new Date(), { addSuffix: true })

// WITH THESE:
formatDateShort(date)      // Locale-aware short date
formatDateTime(date)       // Locale-aware date + time
formatRelativeTime(date)   // Locale-aware relative time
formatSmartDate(date)      // Smart: Today/Yesterday/5 days ago
```

---

## Error Handling Pattern

**Pattern:** Manual try-catch with toast + console.error

**Found in 180+ files:**

### Files with Heavy Error Handling (20+ instances)
- `/frontend/pages/Dashboard.jsx`
- `/frontend/pages/FormBuilderV2.jsx`
- `/frontend/pages/WorkflowBuilder.jsx`
- `/frontend/pages/Calendar.jsx`
- `/frontend/pages/Contacts.jsx`
- `/frontend/pages/Leads.jsx`
- `/frontend/pages/Opportunities.jsx`
- `/frontend/pages/BillingSettings.jsx`
- `/frontend/components/emails/builder/EmailCampaignBuilder.jsx`
- `/frontend/components/workflows/VisualWorkflowBuilder.jsx`

### Files with Moderate Error Handling (10-20 instances)
- `/frontend/pages/SalesDialer.jsx`
- `/frontend/pages/Forms.jsx`
- `/frontend/pages/Calls.jsx`
- `/frontend/pages/AgencySettings.jsx`
- `/frontend/pages/Profile.jsx`
- `/frontend/lib/api.js`
- `/frontend/services/bootstrapService.js`

**Pattern Example:**
```javascript
// REPLACE THIS:
catch (error) {
  console.error('Error:', error);
  const msg = error.response?.data?.error || error.message || 'Error occurred';
  toast({ title: 'Error', description: msg, variant: 'destructive' });
}

// WITH THIS:
catch (error) {
  handleApiError(error, { context: 'operation name', toast });
}
```

---

## API Call Patterns

**Pattern:** Manual query string building, response parsing

**Found in 100+ files:**

### Files Building Query Strings
- `/frontend/lib/api.js` - Multiple endpoints
- `/frontend/pages/Contacts.jsx` - Filter queries
- `/frontend/pages/Leads.jsx` - Filter queries
- `/frontend/pages/Opportunities.jsx` - Filter queries
- `/frontend/services/workflowsApi.js`
- `/frontend/services/formsApi.js`
- `/frontend/services/webhookApi.js`

**Pattern Example:**
```javascript
// REPLACE THIS:
const query = `?page=${page}&limit=${limit}&status=${status}`;
const url = `/api/contacts${query}`;

// WITH THIS:
const url = buildUrl('/api/contacts', { page, limit, status });
```

---

## Validation Patterns

**Pattern:** Manual regex validation, custom validation logic

**Found in 50+ files:**

### Files with Heavy Validation
- `/frontend/pages/FormBuilderV2.jsx` - Field validation
- `/frontend/pages/Profile.jsx` - Email/phone validation
- `/frontend/pages/SignUp.jsx` - Registration validation
- `/frontend/pages/SignIn.jsx` - Login validation
- `/frontend/pages/ProfileSettings.jsx` - Settings validation
- `/frontend/components/CreateContactModal.jsx` - Contact validation
- `/frontend/components/CreateLeadModal.jsx` - Lead validation

**Pattern Example:**
```javascript
// REPLACE THIS:
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  setError('Invalid email');
}

// WITH THIS:
if (!validateEmail(email)) {
  setError('Invalid email');
}
```

---

## Migration Priority by Impact

### Phase 1: High Impact (Immediate Benefits)
1. **Dashboard.jsx** - Most complex, highest duplication
2. **Contacts.jsx** - High traffic page
3. **Leads.jsx** - High traffic page
4. **Calendar.jsx** - Complex date handling
5. **Opportunities.jsx** - Similar to Contacts/Leads

**Estimated savings:** ~400 lines

### Phase 2: Medium Impact
1. **FormBuilderV2.jsx** - Complex error handling
2. **Calls.jsx** - Heavy date formatting
3. **BillingSettings.jsx** - Error handling + date formatting
4. **AgencySettings.jsx** - Multiple API calls
5. **Profile.jsx** - Validation + error handling

**Estimated savings:** ~250 lines

### Phase 3: Low Impact (Cleanup)
- All other components with 1-5 instances of patterns
- Component libraries
- Utility components

**Estimated savings:** ~100 lines

---

## Migration Strategy

### Step 1: Create Example Migrations (Proof of Concept)
- Migrate Opportunities.jsx as example
- Migrate one small component (LeadQueueCard.jsx)
- Document learnings

### Step 2: High Priority Files
- Tackle Dashboard.jsx, Contacts.jsx, Leads.jsx
- These have the most duplication
- Biggest impact on codebase size

### Step 3: Medium Priority Files
- Migrate FormBuilderV2.jsx and other complex pages
- Focus on error handling consistency

### Step 4: Systematic Cleanup
- Search for each pattern systematically
- Migrate all remaining instances
- Update documentation

---

## Quick Reference

### Import Statements

```javascript
// Hooks
import { useAsyncData, useAsyncDataWithBusiness } from '@/hooks/useAsyncData';

// All utilities (convenience)
import {
  formatDateShort,
  formatDateTime,
  handleApiError,
  validateEmail,
  buildQueryString
} from '@/utils/common';

// Or specific utilities
import { formatDateShort, formatDateTime } from '@/utils/common/dateFormatters';
import { handleApiError, createErrorHandler } from '@/utils/common/errorHandlers';
import { buildQueryString, safeApiCall } from '@/utils/common/apiHelpers';
import { validateEmail, validatePhone } from '@/utils/common/validators';
```

### Search Commands

Find files with patterns:

```bash
# Find manual loading states
grep -r "useState.*loading" frontend/pages/ | wc -l

# Find manual date formatting
grep -r "new Date.*toLocale" frontend/ | wc -l

# Find manual error handling
grep -r "catch.*error.*{" frontend/pages/ | wc -l

# Find query string building
grep -r "?.*=.*&" frontend/ | wc -l
```

---

## Progress Tracking

Track migration progress:

- [ ] Phase 1: Create utilities ✅ (COMPLETED)
- [ ] Phase 2: Create migration guide ✅ (COMPLETED)
- [ ] Phase 3: Example migrations (2-3 components)
- [ ] Phase 4: High priority pages (5 files)
- [ ] Phase 5: Medium priority pages (10 files)
- [ ] Phase 6: Systematic cleanup (remaining files)

**Target:** 750+ lines removed when fully adopted
