/**
 * Entity Card Preview
 * Shows avatar, name, email, phone, company, last activity
 * Used in context menu hover previews
 */

import { User, Mail, Phone, Building2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

function timeAgo(dateStr) {
  if (!dateStr) return 'No activity';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 'No activity';
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return d.toLocaleDateString();
}

export default function EntityCardPreview({ data }) {
  if (!data) return null;

  const name = data.name || data.title || `${data.first_name || ''} ${data.last_name || ''}`.trim() || 'Unknown';
  const email = data.email;
  const phone = data.phone || data.phone_number;
  const company = data.company || data.company_name || data.organization;
  const lastActivity = data.last_activity_at || data.updated_at;
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="w-[240px] p-3 space-y-2">
      {/* Header with avatar */}
      <div className="flex items-center gap-3">
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold",
          "bg-gradient-to-br from-[#101010] to-[#101010] text-white"
        )}>
          {initials || <User className="w-5 h-5" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate">{name}</div>
          {company && (
            <div className="text-xs text-gray-500 dark:text-gray-400 truncate flex items-center gap-1">
              <Building2 className="w-3 h-3 flex-shrink-0" />
              {company}
            </div>
          )}
        </div>
      </div>

      {/* Contact info */}
      <div className="space-y-1">
        {email && (
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
            <Mail className="w-3 h-3 text-gray-400 dark:text-gray-500 flex-shrink-0" />
            <span className="truncate">{email}</span>
          </div>
        )}
        {phone && (
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
            <Phone className="w-3 h-3 text-gray-400 dark:text-gray-500 flex-shrink-0" />
            <span>{phone}</span>
          </div>
        )}
      </div>

      {/* Last activity */}
      <div className="flex items-center gap-1.5 text-[11px] text-gray-400 dark:text-gray-500 pt-1 border-t border-gray-100 dark:border-gray-700/30">
        <Clock className="w-3 h-3" />
        Last active {timeAgo(lastActivity)}
      </div>
    </div>
  );
}
