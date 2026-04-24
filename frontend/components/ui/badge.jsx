import * as React from 'react';
import { cn } from '@/lib/utils';

function Badge({ className, variant = 'default', ...props }) {
  const variants = {
    default: 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700',
    blue: 'bg-[#101010]/10 dark:bg-[#f2ff00]/20 text-[#101010] dark:text-[#f2ff00] border-[#101010]/20 dark:border-[#f2ff00]/40 hover:bg-[#101010]/15 dark:hover:bg-[#f2ff00]/30',
    green: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800',
    yellow: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
    red: 'bg-[#101010]/10 dark:bg-[#f2ff00]/20 text-[#101010] dark:text-[#f2ff00] border-[#101010]/20 dark:border-[#f2ff00]/40 hover:bg-[#101010]/15 dark:hover:bg-[#f2ff00]/30',
    amber: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    // Premium Accent Variants
    accent: 'bg-[#101010]/10 dark:bg-[#f2ff00]/20 text-[#101010] dark:text-[#f2ff00] border-[#101010]/20 dark:border-[#f2ff00]/40 hover:bg-[#101010]/15 dark:hover:bg-[#f2ff00]/30 font-semibold',
    'accent-solid': 'bg-[#101010] dark:bg-[#101010] text-white border-[#101010] dark:border-[#101010] hover:bg-[#303030] dark:hover:bg-[#303030] shadow-sm',
    indigo: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    danger: 'bg-[#101010]/10 dark:bg-[#f2ff00]/20 text-[#101010] dark:text-[#f2ff00] border-[#101010]/20 dark:border-[#f2ff00]/40 hover:bg-[#101010]/15 dark:hover:bg-[#f2ff00]/30',
    info: 'bg-[#101010]/10 dark:bg-[#f2ff00]/20 text-[#101010] dark:text-[#f2ff00] border-[#101010]/20 dark:border-[#f2ff00]/40 hover:bg-[#101010]/15 dark:hover:bg-[#f2ff00]/30',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-150',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
