import * as React from 'react';
import { cn } from '@/lib/utils';

function Badge({ className, variant = 'default', ...props }) {
  const variants = {
    default: 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700',
    blue: 'bg-[#3F0D28]/10 dark:bg-[#CBA6F7]/20 text-[#3F0D28] dark:text-[#CBA6F7] border-[#3F0D28]/20 dark:border-[#CBA6F7]/40 hover:bg-[#3F0D28]/15 dark:hover:bg-[#CBA6F7]/30',
    green: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800',
    yellow: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
    red: 'bg-[#3F0D28]/10 dark:bg-[#CBA6F7]/20 text-[#3F0D28] dark:text-[#CBA6F7] border-[#3F0D28]/20 dark:border-[#CBA6F7]/40 hover:bg-[#3F0D28]/15 dark:hover:bg-[#CBA6F7]/30',
    amber: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    // Premium Accent Variants
    accent: 'bg-[#3F0D28]/10 dark:bg-[#CBA6F7]/20 text-[#3F0D28] dark:text-[#CBA6F7] border-[#3F0D28]/20 dark:border-[#CBA6F7]/40 hover:bg-[#3F0D28]/15 dark:hover:bg-[#CBA6F7]/30 font-semibold',
    'accent-solid': 'bg-[#3F0D28] dark:bg-[#3D1212] text-white border-[#3F0D28] dark:border-[#3D1212] hover:bg-[#3D1212] dark:hover:bg-[#2F0F0F] shadow-sm',
    purple: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    indigo: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    pink: 'bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-800',
    danger: 'bg-[#3F0D28]/10 dark:bg-[#CBA6F7]/20 text-[#3F0D28] dark:text-[#CBA6F7] border-[#3F0D28]/20 dark:border-[#CBA6F7]/40 hover:bg-[#3F0D28]/15 dark:hover:bg-[#CBA6F7]/30',
    info: 'bg-[#3F0D28]/10 dark:bg-[#CBA6F7]/20 text-[#3F0D28] dark:text-[#CBA6F7] border-[#3F0D28]/20 dark:border-[#CBA6F7]/40 hover:bg-[#3F0D28]/15 dark:hover:bg-[#CBA6F7]/30',
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
