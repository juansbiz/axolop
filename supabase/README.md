# Supabase Database Configuration

**Last Updated**: 2026-02-04
**Database**: PostgreSQL via Supabase

---

## Folder Structure

```
supabase/
├── config.toml          # Supabase CLI configuration
├── migrations/          # Official database migrations (Supabase CLI managed)
├── seeds/               # Seed data scripts (JS files)
└── README.md            # This file
```

---

## Quick Commands

### Creating Migrations

**Always use the migration script:**
```bash
./scripts/create-migration.sh "descriptive_name" "YOUR SQL HERE"
```

**Naming Convention:** `YYYYMMDDHHMMSS_category_description.sql`

| Prefix | Purpose | Example |
|--------|---------|---------|
| `create_` | New table/function | `create_pipeline_stages_table.sql` |
| `alter_` | Modify existing structure | `alter_users_add_business_alias.sql` |
| `fix_` | Bug fixes | `fix_get_user_businesses_rpc.sql` |
| `add_` | Add columns/indexes | `add_contacts_phone_index.sql` |
| `drop_` | Remove structures | `drop_legacy_agency_tables.sql` |
| `rename_` | Rename objects | `rename_agency_to_business.sql` |

### Applying Migrations

```bash
# Push all migrations to production
supabase db push

# View migration status
supabase migration list

# Check Supabase connection
supabase status
```

### Seeding Data

Seed scripts are in `supabase/seeds/`:

```bash
# Run specific seed
node supabase/seeds/seed-demo-data.js

# Available seeds:
# - seed-axolop-account.js    # Main account setup
# - seed-demo-data.js         # Demo data for testing
# - seed-for-user.js          # Seed for specific user
# - seed-onboarding-form.js   # Onboarding form data
# - seed-second-brain-data.js # AI/Knowledge base data
# - seed-via-service.js       # Service-based seeding
```

---

## Database Overview

### Core Tables (37+ tables)

| Category | Tables |
|----------|--------|
| **Core** | `users`, `businesses`, `business_members`, `leads`, `contacts`, `opportunities` |
| **Tasks** | `tasks`, `task_boards`, `task_folders`, `board_groups` |
| **Communications** | `email_campaigns`, `sms_messages`, `call_records`, `phone_numbers`, `voicemails` |
| **CRM** | `deals`, `custom_fields`, `activities`, `import_batches` |
| **Forms** | `forms`, `form_responses` |
| **Calendar** | `calendar_events` |
| **Workflows** | `workflows`, `workflow_executions` |
| **Funnels** | `funnels` |
| **Business** | `business_invites`, `business_audit_log`, `business_subscriptions` |
| **Payments** | `payment_links`, `payment_customers`, `subscription_products`, `subscription_prices`, `promo_codes` |
| **Dialer** | `dialer_sessions`, `dialer_groups` |

### Multi-Tenant Architecture

- **Business Isolation**: All data is scoped to businesses via `business_id`
- **Row Level Security (RLS)**: Database-enforced access control
- **User Membership**: Users belong to businesses via `business_members` table

---

## Important Notes

### Terminology Update (2026-02)
- **OLD**: `agencies`, `agency_members`, `agency_invites`
- **NEW**: `businesses`, `business_members`, `business_invites`

All agency-related tables have been renamed to business terminology.

### Legacy SQL Files
Legacy SQL files have been archived to `docs/archive/legacy-sql/`. See that folder's README for details.

### RPC Functions

Key functions:
- `get_user_businesses(user_id)` - Get all businesses for a user
- `check_business_membership(user_id, business_id)` - Verify membership

---

## Troubleshooting

### Migration Errors
```bash
# Check migration status
supabase migration list

# View specific migration
cat supabase/migrations/MIGRATION_FILE.sql
```

### Connection Issues
```bash
# Verify Supabase status
supabase status

# Check environment variables
echo $SUPABASE_URL
echo $SUPABASE_ANON_KEY
```

### RLS Policy Issues
```sql
-- Check policies on a table
SELECT * FROM pg_policies WHERE tablename = 'your_table';

-- Test user access
SET role authenticated;
SET request.jwt.claim.sub = 'USER_UUID_HERE';
SELECT * FROM your_table;
```

---

---

## Storage Buckets

Supabase Storage buckets used by Axolop CRM:

| Bucket | Purpose | Access | Max Size |
|--------|---------|--------|----------|
| `funnel-files` | Funnel page builder assets (images, videos) | Public | 50MB |
| `form-uploads` | Form submission file uploads | Private | 10MB |
| `email-attachments` | Email campaign attachments | Private | 25MB |
| `call-recordings` | Call recording audio files | Private | 100MB |
| `voicemail-files` | Voicemail recordings | Private | 20MB |
| `invoice-pdfs` | Generated invoice PDF files | Private | 5MB |
| `business-logos` | Business branding assets | Public | 2MB |
| `user-avatars` | User profile pictures | Public | 2MB |
| `task-attachments` | Task file attachments | Private | 25MB |

### Storage Policies

All buckets implement RLS policies:
- **Private buckets**: Only authenticated users with business membership can access
- **Public buckets**: Anyone can read, but only authenticated users can write

### Storage URL Pattern

```
https://[PROJECT_REF].supabase.co/storage/v1/object/public/[BUCKET]/[PATH]
```

### Common Operations

```javascript
// Upload file
const { data, error } = await supabase.storage
  .from('bucket-name')
  .upload('path/to/file.png', file);

// Get public URL
const { data } = supabase.storage
  .from('bucket-name')
  .getPublicUrl('path/to/file.png');

// Download file
const { data, error } = await supabase.storage
  .from('bucket-name')
  .download('path/to/file.png');

// Delete file
const { data, error } = await supabase.storage
  .from('bucket-name')
  .remove(['path/to/file.png']);
```

---

## SQL Editor Folder Organization

The SQL Editor in Supabase Dashboard should be organized into these folders:

```
SQL Editor Folders:
├── 01_Core_Business/      # Business, members, invites queries
├── 02_CRM_Sales/          # Leads, contacts, opportunities
├── 03_Communications/     # Email, SMS, calls, voicemail
├── 04_Tasks_Projects/     # Tasks, boards, folders
├── 05_Forms_Funnels/      # Forms, responses, funnels
├── 06_Workflows/          # Workflow definitions, executions
├── 07_Payments_Billing/   # Payment links, subscriptions
├── 08_Analytics_Reports/  # MRR, revenue analytics
├── 09_Security_RLS/       # RLS policies, access validation
├── 10_Maintenance/        # Cleanup, performance queries
└── 11_Functions/          # RPC functions, triggers
```

---

## Related Documentation

- `docs/database/README.md` - Database overview
- `docs/database/DATABASE_SCHEMA.md` - Schema documentation
- `docs/database/SCHEMA_OVERVIEW.md` - Table domain mapping
- `docs/database/MIGRATION_GUIDE.md` - Migration best practices
- `CLAUDE.md` - Migration automation rules

---

**Maintainer**: Development Team
