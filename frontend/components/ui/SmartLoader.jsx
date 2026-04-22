import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * Smart loading component that shows progressive messages based on loading time
 * Helps users understand that the app is still working even on slow networks
 *
 * @param {string} message - Initial loading message
 * @param {number} timeout - Timeout in ms before showing "try refresh" message
 */
export function SmartLoader({ message, timeout = 15000 }) {
  const { t } = useTranslation(['common']);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const defaultMessage = message || t('messages.loading');

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed(prev => prev + 1000);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getMessage = () => {
    if (timeElapsed < 2000) return defaultMessage;
    if (timeElapsed < 5000) return "Still loading...";
    if (timeElapsed < 10000) return "This is taking longer than usual...";
    if (timeElapsed < timeout) return "Almost there...";
    return "Taking too long? Try refreshing the page.";
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">{getMessage()}</p>
    </div>
  );
}
