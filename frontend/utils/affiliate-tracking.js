/**
 * Affiliate Tracking Utilities
 * Handles referral code detection, storage, and application
 *
 * @module affiliate-tracking
 */

const REFERRAL_CODE_KEY = "axolop_referral_code";
const REFERRAL_EXPIRY_KEY = "axolop_referral_expiry";
const REFERRAL_EXPIRY_DAYS = 30; // Cookie lasts 30 days

/**
 * Store referral code from URL parameter
 * @param {string} referralCode - Affiliate referral code
 */
export function storeReferralCode(referralCode) {
  if (!referralCode) return;

  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + REFERRAL_EXPIRY_DAYS);

  try {
    localStorage.setItem(REFERRAL_CODE_KEY, referralCode);
    localStorage.setItem(REFERRAL_EXPIRY_KEY, expiryDate.toISOString());

    console.log(
      `✅ Stored referral code: ${referralCode}, expires: ${expiryDate.toLocaleDateString()}`,
    );
  } catch (error) {
    console.error("Error storing referral code:", error);
  }
}

/**
 * Get stored referral code if not expired
 * @returns {string|null} - Referral code or null
 */
export function getReferralCode() {
  try {
    const code = localStorage.getItem(REFERRAL_CODE_KEY);
    const expiry = localStorage.getItem(REFERRAL_EXPIRY_KEY);

    if (!code || !expiry) return null;

    const expiryDate = new Date(expiry);
    const now = new Date();

    if (now > expiryDate) {
      // Expired - clear storage
      clearReferralCode();
      console.log("⚠️  Referral code expired and cleared");
      return null;
    }

    return code;
  } catch (error) {
    console.error("Error getting referral code:", error);
    return null;
  }
}

/**
 * Clear stored referral code
 */
export function clearReferralCode() {
  try {
    localStorage.removeItem(REFERRAL_CODE_KEY);
    localStorage.removeItem(REFERRAL_EXPIRY_KEY);
    console.log("🗑️  Cleared referral code from storage");
  } catch (error) {
    console.error("Error clearing referral code:", error);
  }
}

/**
 * Check if URL has referral parameter
 * @param {string} url - Current URL
 * @returns {string|null} - Referral code from URL or null
 */
export function extractReferralFromUrl(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.get("ref");
  } catch (error) {
    console.error("Error extracting referral from URL:", error);
    return null;
  }
}

/**
 * Apply referral code on page load
 * Call this in main App.jsx or routing component
 */
export function initReferralTracking() {
  try {
    const referralCode = extractReferralFromUrl(window.location.href);
    if (referralCode) {
      storeReferralCode(referralCode);
      console.log(
        `🎯 Affiliate referral detected: ${referralCode}`,
      );
    }
  } catch (error) {
    console.error("Error initializing referral tracking:", error);
  }
}

/**
 * Get affiliate benefits status
 * @returns {object} - Affiliate benefits object
 */
export function getAffiliateBenefits() {
  const code = getReferralCode();

  if (!code) {
    return {
      hasAffiliate: false,
      trialDays: 14,
      benefits: null,
      referralCode: null,
    };
  }

  return {
    hasAffiliate: true,
    trialDays: 30,
    benefits: {
      trialExtension: true, // 30 days vs 14 days
      tierBoost: true, // Access one tier higher during trial
      migration: true, // Free data migration from GoHighLevel/HubSpot
      academy: true, // Free access to Axolop Academy
    },
    referralCode: code,
  };
}

/**
 * Get total bonus value for affiliate benefits
 * @returns {number} - Total value in dollars
 */
export function getAffiliateBonusValue() {
  const benefits = getAffiliateBenefits();

  if (!benefits.hasAffiliate) return 0;

  return (
    50 + // Trial extension value
    150 + // Tier boost value
    500 + // Migration value
    300 // Academy access value
  );
}

/**
 * Check if user has affiliate benefits
 * @returns {boolean}
 */
export function hasAffiliateBenefits() {
  return getAffiliateBenefits().hasAffiliate;
}

/**
 * Get referral code expiry date
 * @returns {Date|null} - Expiry date or null
 */
export function getReferralExpiry() {
  try {
    const expiry = localStorage.getItem(REFERRAL_EXPIRY_KEY);
    return expiry ? new Date(expiry) : null;
  } catch (error) {
    console.error("Error getting referral expiry:", error);
    return null;
  }
}

/**
 * Get days until referral code expires
 * @returns {number|null} - Days remaining or null
 */
export function getDaysUntilExpiry() {
  const expiry = getReferralExpiry();
  if (!expiry) return null;

  const now = new Date();
  const diff = expiry - now;
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  return Math.max(0, days);
}
