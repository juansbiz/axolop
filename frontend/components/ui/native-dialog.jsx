import React from 'react';
import { AlertCircle, CheckCircle, Info, X, AlertTriangle } from 'lucide-react';

/**
 * Native Axolop Confirmation Dialog
 * Replaces browser alert() with styled modal
 * Styling matches Axolop's dark theme with orange accents
 */
export const NativeDialog = ({
  isOpen,
  onClose,
  onConfirm,
  onSecondary,
  title,
  message,
  confirmText = 'OK',
  cancelText = 'Cancel',
  secondaryText,
  showCancel = true,
  variant = 'warning' // 'warning', 'error', 'info', 'success'
}) => {
  if (!isOpen) return null;

  const variantConfig = {
    warning: {
      accentColor: 'bg-amber-500',
      iconBg: 'bg-amber-500/20',
      iconColor: 'text-amber-500',
      buttonBg: 'bg-amber-500 hover:bg-amber-400',
      icon: AlertTriangle
    },
    error: {
      accentColor: 'bg-red-500',
      iconBg: 'bg-red-500/20',
      iconColor: 'text-red-500',
      buttonBg: 'bg-red-500 hover:bg-red-400',
      icon: AlertCircle
    },
    info: {
      accentColor: 'bg-blue-500',
      iconBg: 'bg-blue-500/20',
      iconColor: 'text-blue-500',
      buttonBg: 'bg-blue-500 hover:bg-blue-400',
      icon: Info
    },
    success: {
      accentColor: 'bg-green-500',
      iconBg: 'bg-green-500/20',
      iconColor: 'text-green-500',
      buttonBg: 'bg-green-500 hover:bg-green-400',
      icon: CheckCircle
    }
  };

  const config = variantConfig[variant] || variantConfig.warning;
  const Icon = config.icon;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-200">
        {/* Header accent line */}
        <div className={`h-1 ${config.accentColor}`} />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <X size={18} />
        </button>

        {/* Content */}
        <div className="px-6 pt-6 pb-5">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className={`w-14 h-14 rounded-full ${config.iconBg} flex items-center justify-center`}>
              <Icon size={28} className={config.iconColor} />
            </div>
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
            {title}
          </h3>

          {/* Message */}
          <p className="text-gray-600 text-center text-sm leading-relaxed mb-6">
            {message}
          </p>

          {/* Actions */}
          <div className="space-y-2">
            {/* Primary button */}
            <button
              onClick={onConfirm}
              className={`w-full px-4 py-3 ${config.buttonBg} text-white rounded-lg font-medium transition-colors`}
            >
              {confirmText}
            </button>

            {/* Secondary action (e.g., "Call Anyway") */}
            {secondaryText && onSecondary && (
              <button
                onClick={onSecondary}
                className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors border border-gray-200"
              >
                {secondaryText}
              </button>
            )}

            {/* Cancel button */}
            {showCancel && !secondaryText && (
              <button
                onClick={onClose}
                className="w-full px-4 py-2.5 text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
              >
                {cancelText}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Hook for managing dialog state
 *
 * Usage:
 * const { dialogConfig, showDialog, closeDialog } = useNativeDialog();
 *
 * showDialog({
 *   title: 'Confirm',
 *   message: 'Are you sure?',
 *   confirmText: 'Yes',
 *   secondaryText: 'Do Something Else',
 *   onConfirm: () => { closeDialog(); doSomething(); },
 *   onSecondary: () => { closeDialog(); doSomethingElse(); }
 * });
 */
export const useNativeDialog = () => {
  const [dialogConfig, setDialogConfig] = React.useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'OK',
    cancelText: 'Cancel',
    secondaryText: '',
    showCancel: true,
    variant: 'warning',
    onConfirm: () => {},
    onSecondary: null
  });

  const showDialog = React.useCallback((config) => {
    setDialogConfig({
      isOpen: true,
      title: config.title || '',
      message: config.message || '',
      confirmText: config.confirmText || 'OK',
      cancelText: config.cancelText || 'Cancel',
      secondaryText: config.secondaryText || '',
      showCancel: config.showCancel !== false,
      variant: config.variant || 'warning',
      onConfirm: config.onConfirm || (() => {}),
      onSecondary: config.onSecondary || null
    });
  }, []);

  const closeDialog = React.useCallback(() => {
    setDialogConfig(prev => ({ ...prev, isOpen: false }));
  }, []);

  return { dialogConfig, showDialog, closeDialog };
};

export default NativeDialog;
