/**
 * Email Template Preview
 * Shows subject + first 100 chars of email body
 */

import { Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function EmailTemplatePreview({ data }) {
  if (!data) return null;

  const subject = data.subject || data.template_subject || 'No subject';
  const body = data.body || data.template_body || data.content || '';
  const truncatedBody = body.replace(/<[^>]+>/g, '').slice(0, 120);

  return (
    <div className="w-[240px] p-3 space-y-2">
      <div className="flex items-center gap-2">
        <Mail className="w-4 h-4 text-blue-500 dark:text-blue-400 flex-shrink-0" />
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Email Preview
        </span>
      </div>
      <div className="font-medium text-sm text-gray-900 dark:text-gray-100">
        {subject}
      </div>
      {truncatedBody && (
        <div className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
          {truncatedBody}
          {body.length > 120 && '...'}
        </div>
      )}
    </div>
  );
}
