import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trash2, UserMinus, Archive, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const ACTION_CONFIG = {
  delete: {
    icon: Trash2,
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    borderColor: 'border-red-200 dark:border-red-800',
    textColor: 'text-red-700 dark:text-red-300',
    buttonVariant: 'destructive',
    verb: 'Delete',
  },
  remove: {
    icon: UserMinus,
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-50 dark:bg-amber-900/20',
    borderColor: 'border-amber-200 dark:border-amber-800',
    textColor: 'text-amber-700 dark:text-amber-300',
    buttonVariant: 'default',
    verb: 'Remove',
  },
  archive: {
    icon: Archive,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    borderColor: 'border-blue-200 dark:border-blue-800',
    textColor: 'text-blue-700 dark:text-blue-300',
    buttonVariant: 'default',
    verb: 'Archive',
  },
};

export function BulkActionConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  action = 'delete',
  count,
  itemType,
  description,
  isLoading = false,
}) {
  const config = ACTION_CONFIG[action];
  const Icon = config.icon;
  const pluralizedItem = count === 1 ? itemType : `${itemType}s`;

  const handleConfirm = async () => {
    await onConfirm();
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className={cn('flex items-center gap-2', config.color)}>
            <Icon className="h-5 w-5" />
            {config.verb} {count} {pluralizedItem}?
          </DialogTitle>
          <DialogDescription className="space-y-3 pt-2">
            <p className="text-gray-700 dark:text-gray-300">
              {description || `Are you sure you want to ${action} ${count} ${pluralizedItem}?`}
            </p>

            {/* Count highlight */}
            <div className={cn('rounded-lg p-4 border text-center', config.bgColor, config.borderColor)}>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {count}
              </p>
              <p className={cn('text-sm font-medium mt-1', config.textColor)}>
                {pluralizedItem} will be {action}d
              </p>
            </div>

            {action === 'delete' && (
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                This action cannot be undone.
              </p>
            )}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant={config.buttonVariant}
            onClick={handleConfirm}
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {config.verb}ing...
              </>
            ) : (
              <>
                <Icon className="h-4 w-4" />
                {config.verb} {count} {pluralizedItem}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
