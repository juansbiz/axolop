import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSupabase } from "@/context/SupabaseContext";
import { useSafeSubdomain } from "@/context/SubdomainContext";
import SubdomainAccessDenied from "./SubdomainAccessDenied";

// God mode emails: configured via VITE_GOD_EMAILS env var (comma-separated), with hardcoded fallback
const GOD_EMAILS = (import.meta.env.VITE_GOD_EMAILS || "axolopcrm@gmail.com,kate@kateviolet.com")
  .split(",")
  .map((e) => e.trim())
  .filter(Boolean);

// B2B Admin - only axolopcrm@gmail.com has B2B access
const B2B_ADMIN_EMAIL = "axolopcrm@gmail.com";

// SECURITY: Explicit subscription status whitelists
const ALLOWED_STATUSES = ["active", "trialing", "past_due"];
const DENIED_STATUSES = ["canceled", "unpaid", "incomplete", "none"];

// Extract language from URL path for routing
const getLanguageFromPath = (pathname) => {
  const match = pathname.match(/^\/(en|es)(\/|$)/);
  return match ? match[1] : 'en';
};

const ProtectedRoute = ({
  children,
  requireAdmin = false,
  requireB2B = false,
  skipOnboarding = false,
}) => {
  const { user, loading, supabase } = useSupabase();
  const { accessDenied, subdomainLoading } = useSafeSubdomain();
  const location = useLocation();
  
  // B2B access check
  const isB2BAdmin = user?.email?.toLowerCase() === B2B_ADMIN_EMAIL.toLowerCase();
  // Initialize as "loading" to prevent flash while checking onboarding status
  const [onboardingStatus, setOnboardingStatus] = useState("loading");

  // Get language from URL for proper redirects
  const lang = getLanguageFromPath(location.pathname);

  // Check subdomain access - show access denied page if user not a member
  if (!subdomainLoading && accessDenied && user) {
    return <SubdomainAccessDenied />;
  }

  // Derive user flags (must be computed before hooks that depend on them)
  // FAIL CLOSED - Wrap user metadata access in try-catch
  let userEmail, isAdmin, isGodUser, subscriptionStatus, hasActivePlan, isFreeUser;

  try {
    userEmail = user?.email?.toLowerCase() || "";
    isAdmin = GOD_EMAILS.includes(userEmail);
    isGodUser = isAdmin;
    subscriptionStatus = user?.user_metadata?.subscription_status || "none";
    hasActivePlan =
      subscriptionStatus !== "none" && subscriptionStatus !== "free";
    isFreeUser = !isGodUser && !hasActivePlan;
  } catch (error) {
    console.error("[ProtectedRoute] Error accessing user metadata:", error);
    // FAIL CLOSED - Redirect to signin on metadata access error
    return <Navigate to={`/${lang}/signin?error=metadata_error`} replace />;
  }

  // ONBOARDING CHECK - B2C CRM: skip onboarding for now
  useEffect(() => {
    // Skip onboarding check for B2C CRM
    if (loading || !user) {
      return;
    }
    // Mark as complete for B2C
    setOnboardingStatus(true);
  }, [loading, user]);

  // Refresh session periodically to ensure latest subscription metadata
  useEffect(() => {
    const refreshSessionIfNeeded = async () => {
      if (!user || loading) return;

      // Only refresh once per 5 minutes
      const lastRefresh = sessionStorage.getItem('last_session_refresh');
      const now = Date.now();

      if (!lastRefresh || now - parseInt(lastRefresh) > 5 * 60 * 1000) {
        try {
          await supabase.auth.refreshSession();
          sessionStorage.setItem('last_session_refresh', now.toString());
        } catch (error) {
          // Session refresh failed - will retry on next check
        }
      }
    };

    refreshSessionIfNeeded();
  }, [user, loading, supabase]);

  // 1. LOADING SAFETY VALVE - Wait for auth to finish loading
  // NOTE: For app routes, AppShell handles loading states in the content area
  // This loading state is only shown for non-app routes (e.g., select-plan)
  // Use minimal placeholder to prevent full-screen flash
  if (loading) {
    // Return null to prevent flash - AppShell shows loading in content area
    // For non-app routes, this brief null won't be noticeable
    return null;
  }

  // 2. NO USER -> SIGN IN (unless already on auth pages)
  if (!user) {
    // If we're already on signin/signup, don't redirect again
    if (location.pathname.endsWith("/signin") || location.pathname.endsWith("/signup")) {
      return children;
    }
    return <Navigate to={`/${lang}/signin`} state={{ from: location }} replace />;
  }

  // 3. GOD USER BYPASS - The Golden Rule
  if (isGodUser) {
    // If on select-plan, redirect to app/home
    if (location.pathname.endsWith("/select-plan")) {
      return <Navigate to={`/${lang}/app/home`} replace />;
    }

    // If on auth pages, redirect to app/home
    if (location.pathname.endsWith("/signin") || location.pathname.endsWith("/signup")) {
      return <Navigate to={`/${lang}/app/home`} replace />;
    }

    // OTHERWISE: ALLOW EVERYTHING
    return children;
  }

  // 4. PAST DUE & SUSPENSION CHECK
  if (subscriptionStatus === "past_due") {
    const paymentFailedAt = user?.user_metadata?.payment_failed_at;
    let daysPastDue = 0;

    if (paymentFailedAt) {
      const failedDate = new Date(paymentFailedAt);
      const now = new Date();
      daysPastDue = Math.floor((now - failedDate) / (1000 * 60 * 60 * 24));
    }

    // SUSPENDED > 7 DAYS
    if (daysPastDue > 7) {
      // User is effectively locked out and must buy again
      if (!location.pathname.endsWith("/select-plan")) {
        return <Navigate to={`/${lang}/select-plan`} replace />;
      }
      return children;
    }

    // LOCKED BILLING (< 7 DAYS)
    // Only allow access to billing settings to update payment
    if (!location.pathname.includes("/app/settings/billing")) {
      return <Navigate to={`/${lang}/app/settings/billing?locked=true`} replace />;
    }

    // Allow access to billing section only
    return children;
  }

  // 5. STRIPE CHECKOUT CALLBACK WHITELIST
  // Allow access to app routes when coming from Stripe checkout
  // This must come BEFORE subscription status checks because the webhook
  // may not have processed yet, leaving subscription_status as "none"
  const searchParams = new URLSearchParams(location.search);
  const fromCheckout = searchParams.get('checkout');
  const isAppRoute = location.pathname.includes('/app/');

  if (isAppRoute && fromCheckout === 'success') {
    return children;
  }

  // 6. PAID USER CHECK (Non-God) - SECURITY HARDENED
  // Explicit status validation with fail-closed for unknown statuses

  // First, check if status is explicitly DENIED
  if (DENIED_STATUSES.includes(subscriptionStatus)) {
    if (!location.pathname.endsWith("/select-plan")) {
      return <Navigate to={`/${lang}/select-plan`} replace />;
    }
    return children;
  }

  // Then, check if status is explicitly ALLOWED
  if (!ALLOWED_STATUSES.includes(subscriptionStatus) && !isGodUser) {
    // Unknown status - FAIL CLOSED
    if (!location.pathname.endsWith("/select-plan")) {
      return <Navigate to={`/${lang}/select-plan?error=invalid_status`} replace />;
    }
    return children;
  }

  // 7. ACTIVE PLAN ACCESS
  if (hasActivePlan) {
    // Redirect from select-plan/auth to app/home
    if (location.pathname.endsWith("/select-plan") || location.pathname.endsWith("/signin") || location.pathname.endsWith("/signup")) {
      return <Navigate to={`/${lang}/app/home`} replace />;
    }
    return children;
  }

  // 8. B2B ACCESS CHECK
  if (requireB2B && !isB2BAdmin) {
    // Non-B2B users trying to access B2B routes get redirected to home
    return <Navigate to={`/${lang}/app/home`} replace />;
  }

  // 9. ADMIN REQUIREMENT CHECK
  if (requireAdmin && !isAdmin) {
    return <Navigate to={`/${lang}/app/home`} state={{ accessDenied: true }} replace />;
  }

  // 10. ONBOARDING CHECK
  // Wait for onboarding check to complete (prevent flash)
  if (!skipOnboarding && !isGodUser && onboardingStatus === "loading") {
    // Return null while checking - AppShell handles loading in content area
    return null;
  }

  if (
    !skipOnboarding &&
    !isGodUser &&
    onboardingStatus === false &&
    !location.pathname.endsWith("/onboarding")
  ) {
    return <Navigate to={`/${lang}/onboarding`} replace />;
  }

  // 11. SAFETY FALLBACK (Should be caught by Check 6)
  if (isFreeUser && !location.pathname.endsWith("/select-plan")) {
     return <Navigate to={`/${lang}/select-plan`} replace />;
  }
  // DEFAULT: Allow access
  return children;
};

export default ProtectedRoute;
