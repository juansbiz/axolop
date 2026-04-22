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
import { AlertCircle, Loader2 } from 'lucide-react';

export function UnpublishConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  formName,
  publicUrl,
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
          <DialogTitle className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <AlertCircle className="h-5 w-5" />
            Unpublish Form?
          </DialogTitle>
          <DialogDescription className="space-y-3 pt-2">
            <p className="text-gray-700 dark:text-gray-300">
              Are you sure you want to unpublish this form? It will no longer be accessible to the public.
            </p>

            {formName && (
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 dark:border-amber-800">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {formName}
                </p>
                {publicUrl && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                    {publicUrl}
                  </p>
                )}
              </div>
            )}

            <p className="text-sm text-amber-700 dark:text-amber-300 font-medium">
              The public link will no longer work.
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
            variant="default"
            onClick={handleConfirm}
            disabled={isLoading}
            className="gap-2 bg-amber-600 hover:bg-amber-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Unpublishing...
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4" />
                Unpublish
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
