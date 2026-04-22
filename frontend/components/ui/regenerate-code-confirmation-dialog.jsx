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
import { AlertTriangle, Loader2 } from 'lucide-react';

export function RegenerateCodeConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  currentCode,
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
            <AlertTriangle className="h-5 w-5" />
            Regenerate Affiliate Code?
          </DialogTitle>
          <DialogDescription className="space-y-3 pt-2">
            <p className="text-gray-700 dark:text-gray-300 font-medium">
              ⚠️ This will invalidate your current referral link and create a new one.
            </p>

            {currentCode && (
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 dark:border-amber-800">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Current code:</p>
                <p className="text-sm font-mono font-semibold text-gray-900 dark:text-gray-100">
                  {currentCode}
                </p>
              </div>
            )}

            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 dark:border-red-800">
              <p className="text-sm font-semibold text-red-900 dark:text-red-100 mb-2">
                Consequences:
              </p>
              <ul className="text-sm text-red-700 dark:text-red-300 space-y-1 list-disc list-inside">
                <li>All existing referral links will stop working</li>
                <li>You'll need to share the new link with everyone</li>
                <li>Past referrals remain tracked (not affected)</li>
              </ul>
            </div>

            <p className="text-sm text-amber-700 dark:text-amber-300 font-medium">
              Are you absolutely sure?
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
                Regenerating...
              </>
            ) : (
              <>
                <AlertTriangle className="h-4 w-4" />
                Regenerate Code
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
