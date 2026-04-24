/**
 * Context Menu Testing Component
 *
 * Quick visual test for Phase 1 features:
 * - useRightClick hook
 * - useLongPress hook
 * - useClipboardActions hook
 * - Sub-menus
 * - Search
 * - Checkboxes
 * - Universal items
 *
 * Usage: Import this component in any page to test context menus
 */

import React, { useState } from 'react';
import { useRightClick } from '@/hooks/useRightClick';
import { useLongPress } from '@/hooks/useLongPress';
import { useClipboardActions } from '@/hooks/useClipboardActions';
import { CRMMenuConfigs } from '@/components/ui/ContextMenuProvider';
import { Edit, Trash2, Copy, Mail, Phone, Download, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/lib/toast-helper';

export function ContextMenuTest() {
  const [columns, setColumns] = useState({
    name: true,
    email: true,
    phone: true,
    status: true,
  });

  const { copyItem } = useClipboardActions({ format: 'json' });

  // Test data
  const testLead = {
    id: 1,
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    company: 'Acme Corp',
    title: 'CEO',
  };

  // Test menu with sub-menus
  const getTestMenuWithSubmenus = () => [
    {
      key: 'edit',
      label: 'Edit Lead',
      icon: Edit,
      action: () => toast.success('Edit clicked'),
    },
    {
      key: 'move-stage',
      label: 'Move to Stage',
      icon: ArrowRight,
      type: 'submenu',
      submenuItems: [
        {
          key: 'lead',
          label: 'Lead',
          badge: '5',
          action: () => toast.success('Moved to Lead'),
        },
        {
          key: 'qualified',
          label: 'Qualified',
          badge: '12',
          action: () => toast.success('Moved to Qualified'),
        },
        {
          key: 'proposal',
          label: 'Proposal',
          badge: '3',
          action: () => toast.success('Moved to Proposal'),
        },
      ],
    },
    { type: 'divider' },
    {
      key: 'email',
      label: 'Send Email',
      icon: Mail,
      action: () => toast.success('Email clicked'),
    },
    {
      key: 'call',
      label: 'Log Call',
      icon: Phone,
      action: () => toast.success('Call clicked'),
    },
    { type: 'divider' },
    {
      key: 'copy-vcard',
      label: 'Copy as vCard',
      icon: Download,
      action: () => copyItem(testLead, 'Lead', { format: 'vcard' }),
      badge: 'NEW',
      badgeVariant: 'info',
    },
    { type: 'divider' },
    {
      key: 'delete',
      label: 'Delete Lead',
      icon: Trash2,
      action: () => toast.success('Delete clicked'),
      variant: 'destructive',
    },
  ];

  // Test menu with checkboxes
  const getColumnMenu = () => [
    { type: 'header', label: 'Visible Columns' },
    {
      key: 'col-name',
      label: 'Name',
      type: 'checkbox',
      checked: columns.name,
      onChange: (checked) => setColumns({ ...columns, name: checked }),
    },
    {
      key: 'col-email',
      label: 'Email',
      type: 'checkbox',
      checked: columns.email,
      onChange: (checked) => setColumns({ ...columns, email: checked }),
    },
    {
      key: 'col-phone',
      label: 'Phone',
      type: 'checkbox',
      checked: columns.phone,
      onChange: (checked) => setColumns({ ...columns, phone: checked }),
    },
    {
      key: 'col-status',
      label: 'Status',
      type: 'checkbox',
      checked: columns.status,
      onChange: (checked) => setColumns({ ...columns, status: checked }),
    },
  ];

  // Test menu with 15+ items (triggers search)
  const getLargeMenu = () => {
    const items = [];
    for (let i = 1; i <= 20; i++) {
      items.push({
        key: `item-${i}`,
        label: `Menu Item ${i}`,
        icon: Copy,
        action: () => toast.success(`Item ${i} clicked`),
      });
    }
    return items;
  };

  // Hook integrations
  const basicMenu = useRightClick({
    items: getTestMenuWithSubmenus,
    data: testLead,
  });

  const columnMenu = useRightClick({
    items: getColumnMenu,
  });

  const largeMenu = useRightClick({
    items: getLargeMenu,
  });

  const crmMenu = useRightClick({
    items: (data) =>
      CRMMenuConfigs.lead(data, {
        onEdit: () => toast.success('Edit lead'),
        onDelete: () => toast.success('Delete lead'),
        onConvert: () => toast.success('Convert to opportunity'),
        onEmail: () => toast.success('Send email'),
        onCall: () => toast.success('Log call'),
      }),
    data: testLead,
  });

  // Mobile long-press test
  const longPress = useLongPress({
    onLongPress: (e) => {
      toast.success('Long press detected!');
      basicMenu.handleContextMenu({
        preventDefault: () => {},
        stopPropagation: () => {},
        clientX: e.touches[0].clientX,
        clientY: e.touches[0].clientY,
      });
    },
  });

  return (
    <div className="p-8 space-y-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Context Menu Test Suite</h1>
        <p className="text-gray-600 mb-8">
          Right-click on any card below to test context menus. On mobile, long-press.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Test 1: Basic menu with sub-menus */}
          <div
            {...basicMenu}
            className={cn(
              'p-6 border-2 border-dashed border-gray-300 rounded-lg',
              'hover:border-blue-500 hover:bg-blue-50',
              'cursor-pointer transition-all'
            )}
          >
            <h3 className="text-lg font-semibold mb-2">
              Test 1: Sub-Menus & Badges
            </h3>
            <p className="text-sm text-gray-600">
              Right-click to see menu with sub-menus and badge counts. Hover
              over "Move to Stage" to see submenu.
            </p>
            <div className="mt-4 text-xs font-mono text-gray-500">
              Features: Sub-menus, Badges, vCard export
            </div>
          </div>

          {/* Test 2: Checkbox menu */}
          <div
            {...columnMenu}
            className={cn(
              'p-6 border-2 border-dashed border-gray-300 rounded-lg',
              'hover:border-green-500 hover:bg-green-50',
              'cursor-pointer transition-all'
            )}
          >
            <h3 className="text-lg font-semibold mb-2">
              Test 2: Checkbox Items
            </h3>
            <p className="text-sm text-gray-600">
              Right-click to toggle column visibility. Watch the smooth checkbox
              animations.
            </p>
            <div className="mt-4 text-xs font-mono text-gray-500">
              Features: Checkboxes, Framer Motion animations
            </div>
          </div>

          {/* Test 3: Large menu with search */}
          <div
            {...largeMenu}
            className={cn(
              'p-6 border-2 border-dashed border-gray-300 rounded-lg',
              'hover:border-yellow-500 hover:bg-yellow-500',
              'cursor-pointer transition-all'
            )}
          >
            <h3 className="text-lg font-semibold mb-2">
              Test 3: Search & Filter
            </h3>
            <p className="text-sm text-gray-600">
              Right-click to see 20 items with auto-search. Try fuzzy matching by
              typing "itm 5" to find "Item 5".
            </p>
            <div className="mt-4 text-xs font-mono text-gray-500">
              Features: Search bar, Fuzzy matching, 10+ item threshold
            </div>
          </div>

          {/* Test 4: CRM config (with universal items) */}
          <div
            {...crmMenu}
            className={cn(
              'p-6 border-2 border-dashed border-gray-300 rounded-lg',
              'hover:border-orange-500 hover:bg-orange-50',
              'cursor-pointer transition-all'
            )}
          >
            <h3 className="text-lg font-semibold mb-2">
              Test 4: Universal Items
            </h3>
            <p className="text-sm text-gray-600">
              Right-click to see Lead menu with universal items at bottom:
              Keyboard Shortcuts, Send Feedback, Help & Support.
            </p>
            <div className="mt-4 text-xs font-mono text-gray-500">
              Features: Universal footer, CRM menu config
            </div>
          </div>

          {/* Test 5: Mobile long-press */}
          <div
            {...longPress}
            className={cn(
              'p-6 border-2 border-dashed border-gray-300 rounded-lg',
              'hover:border-yellow-500 hover:bg-yellow-50',
              'cursor-pointer transition-all',
              longPress.isPressed && 'scale-95 opacity-80'
            )}
          >
            <h3 className="text-lg font-semibold mb-2">
              Test 5: Mobile Long-Press
            </h3>
            <p className="text-sm text-gray-600">
              On mobile: Long-press (500ms) to trigger context menu. Watch for
              visual feedback and haptic vibration.
            </p>
            <div className="mt-4 text-xs font-mono text-gray-500">
              Features: Touch detection, Haptic feedback, Visual state
            </div>
          </div>

          {/* Test 6: Copy as vCard */}
          <div
            className={cn(
              'p-6 border-2 border-dashed border-gray-300 rounded-lg',
              'hover:border-cyan-500 hover:bg-cyan-50',
              'cursor-pointer transition-all'
            )}
            onContextMenu={(e) => {
              e.preventDefault();
              copyItem(testLead, 'Lead', { format: 'vcard' });
            }}
          >
            <h3 className="text-lg font-semibold mb-2">
              Test 6: vCard Export 🎁
            </h3>
            <p className="text-sm text-gray-600">
              Right-click to instantly copy lead as vCard format. Open Contacts
              app and paste!
            </p>
            <div className="mt-4 text-xs font-mono text-gray-500">
              Features: Surprise feature, Clipboard API, Toast feedback
            </div>
          </div>
        </div>

        {/* Column visibility display */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-semibold mb-2">Column Visibility State:</h3>
          <div className="flex gap-4 text-sm">
            <div>Name: {columns.name ? '✅' : '❌'}</div>
            <div>Email: {columns.email ? '✅' : '❌'}</div>
            <div>Phone: {columns.phone ? '✅' : '❌'}</div>
            <div>Status: {columns.status ? '✅' : '❌'}</div>
          </div>
        </div>

        {/* Test lead data */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-semibold mb-2">Test Lead Data:</h3>
          <pre className="text-xs font-mono">
            {JSON.stringify(testLead, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default ContextMenuTest;
