# State Management Boundaries

## When to Use What

| Type | Use For | Examples |
|------|---------|---------|
| **Zustand** (`store/`) | Global app state, UI preferences, feature flags | `uiStore`, `businessStore`, `demoModeStore` |
| **React Context** (`context/`) | Feature-scoped state with provider trees | `SupabaseContext`, `UnifiedBusinessContext` |
| **URL State** | Navigation, filters, selected records | `?tab=details`, `?task=123`, `/app/leads` |
| **localStorage** | Persistence only (via Zustand `persist`) | Theme, sidebar, draft data |

## Rules

1. **Never duplicate state** between Zustand and Context
2. **Zustand for new features** - prefer Zustand over new Context providers
3. **Context for auth/business** - SupabaseContext and UnifiedBusinessContext stay as Context (deeply integrated with provider tree)
4. **URL for shareable state** - anything that should work via link sharing goes in URL

## Existing Stores

- `store/businessStore.js` - Business selector UI state, recent businesses
- `store/uiStore.js` - Sidebar, layout, command palette
- `store/demoModeStore.js` - Demo mode toggle
- `store/spacesStore.js` - Space navigation
- `store/callStore.js` - Call state
- `store/inboxStore.js` - Inbox state
- `store/affiliateStore.js` - Affiliate tracking
- `stores/emailCampaignStore.js` - Email campaign builder
- `stores/domainStore.js` - Domain management
- `stores/funnelThemeStore.js` - Funnel theming
