/**
 * Loading State Components - Theme-aware
 * Provides consistent loading states across the application
 */

import { motion } from "framer-motion";
import { useTranslation } from 'react-i18next';

export const FullPageLoader = () => {
  const { t } = useTranslation(['common']);
  return (
    <div className="flex-1 flex items-center justify-center min-h-[400px] bg-white dark:bg-[#0a0a0a] transition-colors duration-200">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center"
      >
        <div className="inline-flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 dark:border-gray-700 border-t-[#3F0D28]"></div>
          <span className="text-gray-600 dark:text-gray-400 text-sm">{t('messages.loading')}</span>
        </div>
      </motion.div>
    </div>
  );
};

export const CardLoader = () => (
  <div className="animate-pulse bg-gray-200 dark:bg-gray-800 h-24 rounded-lg mb-4"></div>
);

export const TableLoader = ({ rows = 3 }) => (
  <div className="space-y-2">
    {Array.from({ length: rows }).map((_, index) => (
      <div key={index} className="animate-pulse bg-gray-200 dark:bg-gray-800 h-12 rounded"></div>
    ))}
  </div>
);

export const ButtonLoader = ({ text }) => {
  const { t } = useTranslation(['common']);
  const loadingText = text || t('messages.loading');
  return (
    <div className="inline-flex items-center space-x-2">
      <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-200 dark:border-gray-700 border-t-[#3F0D28]"></div>
      <span className="text-gray-600 dark:text-gray-400 text-sm">{loadingText}</span>
    </div>
  );
};

export const SkeletonText = ({ width = "w-full", height = "h-4" }) => (
  <div className={`${width} ${height} bg-gray-200 dark:bg-gray-800 rounded animate-pulse`}></div>
);

export const SkeletonAvatar = () => (
  <div className="flex items-center space-x-4">
    <div className="animate-pulse bg-gray-200 dark:bg-gray-800 h-10 w-10 rounded-full"></div>
    <div className="space-y-2">
      <div className="animate-pulse bg-gray-200 dark:bg-gray-800 h-4 w-24 rounded"></div>
      <div className="animate-pulse bg-gray-200 dark:bg-gray-800 h-4 w-16 rounded"></div>
    </div>
  </div>
);

export const withLoadingState = (Component) => {
  return function WithLoadingState({ isLoading, ...props }) {
    if (isLoading) {
      return <FullPageLoader />;
    }
    return <Component {...props} />;
  };
};

export default {
  FullPageLoader,
  CardLoader,
  TableLoader,
  ButtonLoader,
  SkeletonText,
  SkeletonAvatar,
  withLoadingState,
};
