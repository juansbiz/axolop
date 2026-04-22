# Implementation Checklist

Use this checklist to track progress as you adopt the new utilities across the codebase.

## Phase 1: Setup & Documentation ✅

- [x] Create `useAsyncData` hook
- [x] Create date formatters
- [x] Create error handlers
- [x] Create API helpers
- [x] Create validators
- [x] Create index.js for exports
- [x] Write comprehensive README
- [x] Write migration guide
- [x] Document pattern locations
- [x] Create example migrations
- [x] Add unit tests

**Status:** ✅ COMPLETE

---

## Phase 2: Example Migrations (Optional)

Demonstrate the pattern with 2-3 small components:

### Example 1: LeadQueueCard.jsx
- [ ] Read current implementation
- [ ] Migrate to useAsyncData
- [ ] Replace date formatting
- [ ] Test functionality
- [ ] Verify ~20 line reduction

### Example 2: Small Dashboard Widget
- [ ] Read current implementation
- [ ] Migrate to useAsyncData
- [ ] Replace error handling
- [ ] Replace date formatting
- [ ] Test functionality
- [ ] Verify ~30 line reduction

### Example 3: Simple Form Component
- [ ] Read current implementation
- [ ] Replace validators
- [ ] Replace error handling
- [ ] Test functionality
- [ ] Verify ~15 line reduction

**Target:** Demonstrate 65+ line reduction in 3 components

---

## Phase 3: High Priority Migrations

These files have the most duplication and highest impact.

### 1. Dashboard.jsx
- [ ] Audit current patterns
- [ ] Plan migration approach
- [ ] Migrate data fetching (useAsyncData)
- [ ] Migrate date formatting
- [ ] Migrate error handling
- [ ] Test thoroughly
- [ ] Verify ~100 line reduction

### 2. Contacts.jsx
- [ ] Audit current patterns
- [ ] Plan migration approach
- [ ] Migrate data fetching (useAsyncData)
- [ ] Migrate date formatting
- [ ] Migrate error handling
- [ ] Test thoroughly
- [ ] Verify ~80 line reduction

### 3. Leads.jsx
- [ ] Audit current patterns
- [ ] Plan migration approach
- [ ] Migrate data fetching (useAsyncData)
- [ ] Migrate date formatting
- [ ] Migrate error handling
- [ ] Migrate validation
- [ ] Test thoroughly
- [ ] Verify ~80 line reduction

### 4. Calendar.jsx
- [ ] Audit current patterns
- [ ] Plan migration approach
- [ ] Migrate data fetching (useAsyncData)
- [ ] Migrate date formatting (heavy usage)
- [ ] Migrate error handling
- [ ] Test thoroughly
- [ ] Verify ~70 line reduction

### 5. Opportunities.jsx
- [ ] Audit current patterns
- [ ] Plan migration approach
- [ ] Migrate data fetching (useAsyncData)
- [ ] Migrate date formatting
- [ ] Migrate error handling
- [ ] Test thoroughly
- [ ] Verify ~70 line reduction

**Target:** 400+ line reduction in 5 files

---

## Phase 4: Medium Priority Migrations

### 6. FormBuilderV2.jsx
- [ ] Migrate data fetching
- [ ] Migrate error handling (heavy usage)
- [ ] Migrate validation
- [ ] Test thoroughly
- [ ] Verify ~60 line reduction

### 7. Calls.jsx
- [ ] Migrate data fetching
- [ ] Migrate date formatting (heavy usage)
- [ ] Migrate error handling
- [ ] Test thoroughly
- [ ] Verify ~50 line reduction

### 8. BillingSettings.jsx
- [ ] Migrate data fetching
- [ ] Migrate date formatting
- [ ] Migrate error handling
- [ ] Test thoroughly
- [ ] Verify ~40 line reduction

### 9. AgencySettings.jsx
- [ ] Migrate data fetching
- [ ] Migrate error handling
- [ ] Test thoroughly
- [ ] Verify ~30 line reduction

### 10. Profile.jsx
- [ ] Migrate data fetching
- [ ] Migrate validation
- [ ] Migrate error handling
- [ ] Test thoroughly
- [ ] Verify ~30 line reduction

### 11-15. Additional Medium Priority Files
- [ ] SalesDialer.jsx (~30 lines)
- [ ] Forms.jsx (~25 lines)
- [ ] AgencyAnalytics.jsx (~20 lines)
- [ ] FunnelAnalytics.jsx (~15 lines)
- [ ] ImportSharingHub.jsx (~10 lines)

**Target:** 250+ line reduction in 10 files

---

## Phase 5: Systematic Cleanup

Search and replace patterns across remaining files.

### Date Formatting Pattern
- [ ] Search: `new Date().toLocaleDateString()`
- [ ] Replace with: `formatDateShort()`
- [ ] Files affected: ~50 files
- [ ] Estimated: ~100 line reduction

### Error Handling Pattern
- [ ] Search: `catch.*error.*toast.*{`
- [ ] Replace with: `handleApiError(error, { context, toast })`
- [ ] Files affected: ~100 files
- [ ] Estimated: ~150 line reduction

### Validation Pattern
- [ ] Search: Email regex patterns
- [ ] Replace with: `validateEmail()`
- [ ] Files affected: ~30 files
- [ ] Estimated: ~50 line reduction

**Target:** 100+ line reduction in remaining files

---

## Progress Tracking

### Overall Statistics

**Files Migrated:** 0 / ~60 files
**Lines Saved:** 0 / ~750 lines

### By Phase
- Phase 1: ✅ COMPLETE (10 files created)
- Phase 2: ⏳ PENDING (3 examples)
- Phase 3: ⏳ PENDING (5 high-priority files)
- Phase 4: ⏳ PENDING (10 medium-priority files)
- Phase 5: ⏳ PENDING (systematic cleanup)

### Timeline Estimate
- Phase 2: ~2-3 hours (optional)
- Phase 3: ~8-10 hours (high impact)
- Phase 4: ~6-8 hours (medium impact)
- Phase 5: ~4-6 hours (cleanup)

**Total:** ~20-27 hours for full migration

---

## Quality Checklist

For each migrated file:

### Before Migration
- [ ] Identify all patterns to replace
- [ ] Document current line count
- [ ] Review component functionality
- [ ] Check for edge cases

### During Migration
- [ ] Replace loading states with useAsyncData
- [ ] Replace date formatting with formatters
- [ ] Replace error handling with handlers
- [ ] Replace validation with validators
- [ ] Replace API patterns with helpers

### After Migration
- [ ] Test all functionality
- [ ] Verify no regressions
- [ ] Check console for errors
- [ ] Verify locale switching works
- [ ] Count lines saved
- [ ] Update this checklist

### Testing
- [ ] Manual testing in browser
- [ ] Test with demo mode
- [ ] Test with production data
- [ ] Test error scenarios
- [ ] Test edge cases

---

## Common Migration Patterns

### Pattern 1: Data Fetching
```diff
- const [data, setData] = useState([]);
- const [loading, setLoading] = useState(true);
- const [error, setError] = useState(null);
-
- useEffect(() => {
-   const fetch = async () => {
-     setLoading(true);
-     try {
-       const res = await api.get();
-       setData(res.data);
-     } catch (err) {
-       setError(err.message);
-     } finally {
-       setLoading(false);
-     }
-   };
-   fetch();
- }, [deps]);

+ const { data, loading, error } = useAsyncData(
+   () => api.get(),
+   [deps],
+   { initialData: [] }
+ );
```

### Pattern 2: Error Handling
```diff
- catch (error) {
-   console.error('Error:', error);
-   const msg = error.response?.data?.error || error.message || 'Error';
-   toast({ title: 'Error', description: msg, variant: 'destructive' });
- }

+ catch (error) {
+   handleApiError(error, { context: 'operation', toast });
+ }
```

### Pattern 3: Date Formatting
```diff
- const date = new Date(created_at).toLocaleDateString();
+ const date = formatDateShort(created_at);
```

### Pattern 4: Validation
```diff
- const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
- if (!emailRegex.test(email)) {
-   setError('Invalid email');
- }

+ if (!validateEmail(email)) {
+   setError('Invalid email');
+ }
```

---

## Tips & Best Practices

### 1. Start Small
- Begin with small components to learn the pattern
- Gain confidence before tackling complex files

### 2. Test Thoroughly
- Test each migration immediately
- Don't batch multiple migrations without testing

### 3. Use Examples
- Reference EXAMPLE_MIGRATION.md
- Follow the proven patterns

### 4. Keep Track
- Update this checklist as you go
- Document any issues encountered

### 5. Ask for Help
- Review documentation if stuck
- Check JSDoc comments in utility files

---

## Success Metrics

Track these metrics to measure success:

- **Lines of code reduced:** Target 750+
- **Components migrated:** Target 60+
- **Bugs introduced:** Target 0
- **Test coverage:** Target 100% for utilities
- **Developer satisfaction:** Target high

---

## Notes & Issues

Document any issues or learnings here:

### Issues Encountered
_To be filled in during migration_

### Learnings
_To be filled in during migration_

### Improvements
_Ideas for future enhancements_

---

**Last Updated:** January 16, 2026
**Next Review:** After Phase 2 completion
