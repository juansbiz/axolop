import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

/**
 * Empty state component for better UX when no data is available
 *
 * Usage:
 *   <EmptyState
 *     icon={Users}
 *     title="No contacts yet"
 *     description="Get started by adding your first contact"
 *     action={{
 *       label: "Add Contact",
 *       onClick: () => setShowModal(true)
 *     }}
 *   />
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = ""
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}
    >
      {/* Icon */}
      {Icon && (
        <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-6 mb-4">
          <Icon className="h-12 w-12 text-gray-400 dark:text-gray-500" />
        </div>
      )}

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {title}
      </h3>

      {/* Description */}
      <p className="text-gray-500 dark:text-gray-400 text-center mb-6 max-w-sm">
        {description}
      </p>

      {/* Action button */}
      {action && (
        <Button
          onClick={action.onClick}
          variant={action.variant || "default"}
          size={action.size || "default"}
        >
          {action.label}
        </Button>
      )}
    </motion.div>
  );
}

/**
 * Search empty state - specialized for search results
 */
export function SearchEmptyState({ searchTerm, onClear }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12 px-4"
    >
      <div className="text-6xl mb-4">🔍</div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
        No results found for "{searchTerm}"
      </h3>
      <p className="text-gray-500 dark:text-gray-400 text-center mb-6 max-w-sm">
        Try adjusting your search or filters to find what you're looking for
      </p>
      {onClear && (
        <Button onClick={onClear} variant="outline">
          Clear search
        </Button>
      )}
    </motion.div>
  );
}

/**
 * Error empty state - for error scenarios
 */
export function ErrorEmptyState({ title, description, onRetry }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12 px-4"
    >
      <div className="text-6xl mb-4">⚠️</div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {title || "Something went wrong"}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 text-center mb-6 max-w-sm">
        {description || "We encountered an error loading this data. Please try again."}
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          Try again
        </Button>
      )}
    </motion.div>
  );
}
