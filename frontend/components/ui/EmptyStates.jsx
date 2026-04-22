/**
 * EmptyStates Component - Phase 4 UX Polish
 *
 * Beautiful empty state components for no-data scenarios
 * Provides helpful guidance and actions for users
 *
 * @example
 * {data.length === 0 ? (
 *   <NoDataEmpty
 *     title="No opportunities yet"
 *     description="Create your first opportunity to get started"
 *     actionLabel="Create Opportunity"
 *     onAction={handleCreate}
 *   />
 * ) : (
 *   <DataList data={data} />
 * )}
 */

import { motion } from 'framer-motion';
import {
  FileQuestion,
  SearchX,
  AlertCircle,
  Plus,
  RefreshCw,
  MailQuestion,
  Inbox,
  FolderOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * Base Empty State Component
 * Reusable foundation for all empty state variants
 */
function BaseEmptyState({
  icon: Icon = FileQuestion,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  variant = 'neutral',
  className = '',
  children,
}) {
  const variantStyles = {
    neutral: {
      iconBg: 'bg-gray-100 dark:bg-gray-800',
      iconColor: 'text-gray-500 dark:text-gray-400',
      glowColor: 'bg-gray-300/20',
    },
    error: {
      iconBg: 'bg-red-50 dark:bg-red-900/20',
      iconColor: 'text-red-500 dark:text-red-400',
      glowColor: 'bg-red-300/20',
    },
    info: {
      iconBg: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-500 dark:text-blue-400',
      glowColor: 'bg-blue-300/20',
    },
    success: {
      iconBg: 'bg-green-50 dark:bg-green-900/20',
      iconColor: 'text-green-500 dark:text-green-400',
      glowColor: 'bg-green-300/20',
    },
  };

  const styles = variantStyles[variant] || variantStyles.neutral;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 md:p-12',
        'min-h-[400px]',
        className
      )}
    >
      {/* Icon with glow effect */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="relative mb-6"
      >
        {/* Animated glow */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className={cn(
            'absolute inset-0 rounded-full blur-2xl',
            styles.glowColor
          )}
        />

        {/* Icon container */}
        <div
          className={cn(
            'relative w-20 h-20 md:w-24 md:h-24 rounded-full',
            'flex items-center justify-center',
            styles.iconBg
          )}
        >
          <Icon className={cn('w-10 h-10 md:w-12 md:h-12', styles.iconColor)} />
        </div>
      </motion.div>

      {/* Title */}
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2"
      >
        {title}
      </motion.h3>

      {/* Description */}
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-sm md:text-base text-gray-600 dark:text-gray-400 mb-6 max-w-md"
        >
          {description}
        </motion.p>
      )}

      {/* Custom children (for additional content) */}
      {children && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          className="mb-6"
        >
          {children}
        </motion.div>
      )}

      {/* Action Buttons */}
      {(onAction || onSecondaryAction) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center gap-3"
        >
          {onAction && (
            <Button
              onClick={onAction}
              size="lg"
              className="gap-2 shadow-lg hover:shadow-xl transition-shadow"
            >
              {actionLabel || 'Get Started'}
            </Button>
          )}
          {onSecondaryAction && (
            <Button
              onClick={onSecondaryAction}
              variant="outline"
              size="lg"
              className="gap-2"
            >
              {secondaryActionLabel || 'Learn More'}
            </Button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

/**
 * NoDataEmpty - When no data exists
 * Neutral tone, encourages user to create first item
 *
 * @example
 * <NoDataEmpty
 *   title="No opportunities yet"
 *   description="Create your first opportunity to get started"
 *   actionLabel="Create Opportunity"
 *   onAction={handleCreate}
 * />
 */
export function NoDataEmpty({
  title = 'No data yet',
  description = 'Get started by creating your first item',
  actionLabel = 'Create',
  onAction,
  icon = Inbox,
  className = '',
}) {
  return (
    <BaseEmptyState
      icon={icon}
      title={title}
      description={description}
      actionLabel={actionLabel}
      onAction={onAction}
      variant="neutral"
      className={className}
    />
  );
}

/**
 * NoSearchResults - When search returns nothing
 * Shows search icon and suggestions to clear filters
 *
 * @example
 * <NoSearchResults
 *   searchTerm="marketing"
 *   onClearFilters={handleClearFilters}
 * />
 */
export function NoSearchResults({
  searchTerm = '',
  title = 'No results found',
  description,
  onClearFilters,
  onTryAgain,
  className = '',
}) {
  const defaultDescription = searchTerm
    ? `We couldn't find anything matching "${searchTerm}". Try adjusting your search or filters.`
    : 'Try adjusting your search criteria or filters.';

  return (
    <BaseEmptyState
      icon={SearchX}
      title={title}
      description={description || defaultDescription}
      actionLabel={onClearFilters ? 'Clear Filters' : undefined}
      onAction={onClearFilters}
      secondaryActionLabel={onTryAgain ? 'Try Again' : undefined}
      onSecondaryAction={onTryAgain}
      variant="info"
      className={className}
    >
      {/* Search suggestions */}
      <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
        <p className="font-medium">Suggestions:</p>
        <ul className="text-left list-disc list-inside space-y-1">
          <li>Check your spelling</li>
          <li>Try different keywords</li>
          <li>Use fewer filters</li>
          <li>Broaden your search criteria</li>
        </ul>
      </div>
    </BaseEmptyState>
  );
}

/**
 * ErrorEmpty - When loading fails
 * Shows error icon and retry option
 *
 * @example
 * <ErrorEmpty
 *   title="Failed to load data"
 *   description="There was a problem loading your data. Please try again."
 *   onRetry={handleRetry}
 * />
 */
export function ErrorEmpty({
  title = 'Something went wrong',
  description = 'We encountered an error while loading your data. Please try again.',
  onRetry,
  onContactSupport,
  errorCode,
  className = '',
}) {
  return (
    <BaseEmptyState
      icon={AlertCircle}
      title={title}
      description={description}
      actionLabel="Try Again"
      onAction={onRetry}
      secondaryActionLabel={onContactSupport ? 'Contact Support' : undefined}
      onSecondaryAction={onContactSupport}
      variant="error"
      className={className}
    >
      {errorCode && (
        <div className="text-xs text-gray-500 dark:text-gray-500 font-mono bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded">
          Error Code: {errorCode}
        </div>
      )}
    </BaseEmptyState>
  );
}

/**
 * EmptyInbox - For empty inbox/messages
 *
 * @example
 * <EmptyInbox onCompose={handleCompose} />
 */
export function EmptyInbox({
  title = 'Your inbox is empty',
  description = "You're all caught up! No new messages.",
  onAction,
  actionLabel = 'Compose Message',
  className = '',
}) {
  return (
    <BaseEmptyState
      icon={Inbox}
      title={title}
      description={description}
      actionLabel={onAction ? actionLabel : undefined}
      onAction={onAction}
      variant="success"
      className={className}
    />
  );
}

/**
 * EmptyFolder - For empty folders/categories
 *
 * @example
 * <EmptyFolder
 *   folderName="Archive"
 *   onAddItem={handleAddItem}
 * />
 */
export function EmptyFolder({
  folderName = 'this folder',
  title,
  description,
  onAddItem,
  actionLabel = 'Add Item',
  className = '',
}) {
  const defaultTitle = `No items in ${folderName}`;
  const defaultDescription = `Start adding items to ${folderName} to organize your work.`;

  return (
    <BaseEmptyState
      icon={FolderOpen}
      title={title || defaultTitle}
      description={description || defaultDescription}
      actionLabel={onAddItem ? actionLabel : undefined}
      onAction={onAddItem}
      variant="neutral"
      className={className}
    />
  );
}

/**
 * ComingSoon - For features under development
 *
 * @example
 * <ComingSoon
 *   feature="Advanced Analytics"
 *   eta="Q2 2025"
 * />
 */
export function ComingSoon({
  feature = 'This feature',
  title,
  description,
  eta,
  onNotifyMe,
  className = '',
}) {
  const defaultTitle = `${feature} Coming Soon`;
  const defaultDescription = eta
    ? `This feature is currently under development and will be available in ${eta}.`
    : 'This feature is currently under development.';

  return (
    <BaseEmptyState
      icon={FileQuestion}
      title={title || defaultTitle}
      description={description || defaultDescription}
      actionLabel={onNotifyMe ? 'Notify Me' : undefined}
      onAction={onNotifyMe}
      variant="info"
      className={className}
    />
  );
}

// Export all empty state variants
export default {
  NoDataEmpty,
  NoSearchResults,
  ErrorEmpty,
  EmptyInbox,
  EmptyFolder,
  ComingSoon,
  BaseEmptyState,
};
