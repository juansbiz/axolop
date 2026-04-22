import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link2, Loader2, AlertCircle } from 'lucide-react';

export function LinkInputDialog({
  isOpen,
  onClose,
  onConfirm,
  defaultValue = '',
  isLoading = false,
}) {
  const [url, setUrl] = useState(defaultValue);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setUrl(defaultValue);
      setError('');
    }
  }, [isOpen, defaultValue]);

  const validateUrl = (value) => {
    if (!value.trim()) {
      return 'URL is required';
    }

    // Basic URL validation
    try {
      const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      if (!urlPattern.test(value.trim())) {
        return 'Please enter a valid URL';
      }
      return '';
    } catch {
      return 'Invalid URL format';
    }
  };

  const handleUrlChange = (e) => {
    const value = e.target.value;
    setUrl(value);

    // Validate on change
    const validationError = validateUrl(value);
    setError(validationError);
  };

  const handleConfirm = () => {
    const validationError = validateUrl(url);
    if (validationError) {
      setError(validationError);
      return;
    }

    // Ensure URL has protocol
    let finalUrl = url.trim();
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = 'https://' + finalUrl;
    }

    onConfirm(finalUrl);
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !error && url.trim()) {
      handleConfirm();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const isValid = !error && url.trim();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <Link2 className="h-5 w-5" />
            Insert Link
          </DialogTitle>
          <DialogDescription className="pt-2">
            Enter the URL you want to link to.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="url" className="text-sm font-medium">
              URL
            </Label>
            <Input
              id="url"
              type="text"
              placeholder="https://example.com"
              value={url}
              onChange={handleUrlChange}
              onKeyDown={handleKeyDown}
              className={error ? 'border-red-500 focus:ring-red-500' : ''}
              autoFocus
            />
            {error && (
              <div className="flex items-center gap-1.5 text-sm text-red-600 dark:text-red-400">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}
            {url && !error && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {url.trim().startsWith('http') ? url.trim() : `https://${url.trim()}`}
              </p>
            )}
          </div>
        </div>

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
            disabled={isLoading || !isValid}
            className="gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Inserting...
              </>
            ) : (
              <>
                <Link2 className="h-4 w-4" />
                Insert Link
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
