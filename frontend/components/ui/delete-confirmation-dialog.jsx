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
import { Trash2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function DeleteConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Item?',
  description = 'Are you sure you want to delete this item?',
  itemName,
  itemType,
  confirmText = 'Delete',
  icon: Icon = Trash2,
  isLoading = false,
}) {
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
          <DialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <Icon className="h-5 w-5" />
            {title}
          </DialogTitle>
          <DialogDescription className="space-y-3 pt-2">
            <p className="text-gray-700 dark:text-gray-300">{description}</p>

            {/* Context info box - only show if itemName provided */}
            {itemName && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 shadow-md dark:border-gray-700">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {itemName}
                </p>
                {itemType && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Type: {itemType}
                  </p>
                )}
              </div>
            )}

            <p className="text-sm text-red-600 dark:text-red-400 font-medium">
              This action cannot be undone.
            </p>
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
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Icon className="h-4 w-4" />
                {confirmText}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
