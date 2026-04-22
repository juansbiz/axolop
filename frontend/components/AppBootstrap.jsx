// frontend/components/AppBootstrap.jsx

/**
 * AppBootstrap - Legacy bootstrap wrapper
 *
 * NOTE: Bootstrap logic has been moved to AppShell component which provides
 * a stable visual shell during loading. This component is kept for backwards
 * compatibility but is now a simple pass-through.
 *
 * For new code, use AppShell instead which:
 * - Shows loading states INSIDE the content area (sidebar stays visible)
 * - Handles auth, bootstrap, and subscription checks
 * - Prevents full-screen flickering
 *
 * @deprecated Use AppShell for app routes instead
 */
export default function AppBootstrap({ children }) {
  // Pass-through: AppShell now handles all bootstrap logic
  // This maintains backwards compatibility for any code still using AppBootstrap
  return <>{children}</>;
}
