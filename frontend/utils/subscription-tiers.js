/**
 * Subscription Tier Configuration
 *
 * Defines features, limits, and pricing for each tier
 * Used throughout the app for feature gating
 */

export const TIER_NAMES = {
  SALES: 'sales',
  BUILD: 'build',
  SCALE: 'scale'
};

export const TIER_DISPLAY_NAMES = {
  [TIER_NAMES.SALES]: 'Sales',
  [TIER_NAMES.BUILD]: 'Build',
  [TIER_NAMES.SCALE]: 'Scale'
};

/**
 * Feature limits per tier
 */
export const FEATURE_LIMITS = {
  // Custom Email Domains
  domains: {
    [TIER_NAMES.SALES]: 0,        // Cannot add custom domains
    [TIER_NAMES.BUILD]: 1,         // 1 domain
    [TIER_NAMES.SCALE]: Infinity   // Unlimited
  },

  // Email Campaigns
  campaigns: {
    [TIER_NAMES.SALES]: 50,        // 50 campaigns/month
    [TIER_NAMES.BUILD]: 200,       // 200 campaigns/month
    [TIER_NAMES.SCALE]: Infinity   // Unlimited
  },

  // A/B Testing
  abTests: {
    [TIER_NAMES.SALES]: false,     // No A/B testing
    [TIER_NAMES.BUILD]: true,      // Full A/B testing
    [TIER_NAMES.SCALE]: true       // Full A/B testing + advanced
  },

  // Email Segmentation
  segments: {
    [TIER_NAMES.SALES]: 5,         // 5 segments
    [TIER_NAMES.BUILD]: 50,        // 50 segments
    [TIER_NAMES.SCALE]: Infinity   // Unlimited
  },

  // Automation Workflows
  workflows: {
    [TIER_NAMES.SALES]: 0,         // No automation
    [TIER_NAMES.BUILD]: 10,        // 10 workflows
    [TIER_NAMES.SCALE]: Infinity   // Unlimited
  },

  // Email Templates
  customTemplates: {
    [TIER_NAMES.SALES]: 10,        // 10 custom templates
    [TIER_NAMES.BUILD]: 100,       // 100 custom templates
    [TIER_NAMES.SCALE]: Infinity   // Unlimited
  },

  // Advanced Email Blocks
  advancedBlocks: {
    [TIER_NAMES.SALES]: false,     // Basic blocks only
    [TIER_NAMES.BUILD]: true,      // All blocks including interactive
    [TIER_NAMES.SCALE]: true       // All blocks + custom blocks
  },

  // Analytics & Reporting
  advancedAnalytics: {
    [TIER_NAMES.SALES]: false,     // Basic analytics only
    [TIER_NAMES.BUILD]: true,      // Advanced analytics
    [TIER_NAMES.SCALE]: true       // Advanced + predictive
  },

  // Domain Health Monitoring
  healthMonitoring: {
    [TIER_NAMES.SALES]: false,     // No health monitoring
    [TIER_NAMES.BUILD]: true,      // Basic health monitoring
    [TIER_NAMES.SCALE]: true       // Advanced with alerts
  },

  // Blacklist Monitoring
  blacklistMonitoring: {
    [TIER_NAMES.SALES]: false,     // No blacklist monitoring
    [TIER_NAMES.BUILD]: true,      // Weekly checks
    [TIER_NAMES.SCALE]: true       // Daily checks + auto-alerts
  },

  // Team Members
  teamMembers: {
    [TIER_NAMES.SALES]: 1,         // Solo user
    [TIER_NAMES.BUILD]: 5,         // Up to 5 members
    [TIER_NAMES.SCALE]: Infinity   // Unlimited
  },

  // API Access
  apiAccess: {
    [TIER_NAMES.SALES]: false,     // No API access
    [TIER_NAMES.BUILD]: true,      // REST API access
    [TIER_NAMES.SCALE]: true       // REST + GraphQL + webhooks
  },

  // Priority Support
  prioritySupport: {
    [TIER_NAMES.SALES]: false,     // Community support
    [TIER_NAMES.BUILD]: true,      // Email support (24h response)
    [TIER_NAMES.SCALE]: true       // Priority support + phone
  },

  // White Label
  whiteLabel: {
    [TIER_NAMES.SALES]: false,     // Axolop branding
    [TIER_NAMES.BUILD]: false,     // Axolop branding
    [TIER_NAMES.SCALE]: true       // Remove Axolop branding
  }
};

/**
 * Pricing per tier (monthly)
 */
export const TIER_PRICING = {
  [TIER_NAMES.SALES]: {
    monthly: 97,
    annually: 970,  // ~$81/month
    currency: 'USD'
  },
  [TIER_NAMES.BUILD]: {
    monthly: 297,
    annually: 2970, // ~$248/month
    currency: 'USD'
  },
  [TIER_NAMES.SCALE]: {
    monthly: 497,
    annually: 4970, // ~$414/month
    currency: 'USD'
  }
};

/**
 * Feature descriptions for marketing
 */
export const FEATURE_DESCRIPTIONS = {
  domains: 'Custom email domains for branded sending',
  campaigns: 'Email campaigns per month',
  abTests: 'A/B testing with automatic winner selection',
  segments: 'Advanced audience segmentation',
  workflows: 'Automation workflows',
  customTemplates: 'Custom email templates',
  advancedBlocks: 'Interactive email blocks (polls, quizzes, countdowns)',
  advancedAnalytics: 'Advanced analytics and reporting',
  healthMonitoring: 'Domain health and reputation monitoring',
  blacklistMonitoring: 'Automatic blacklist monitoring',
  teamMembers: 'Team members',
  apiAccess: 'API access for integrations',
  prioritySupport: 'Priority customer support',
  whiteLabel: 'White-label (remove Axolop branding)'
};

/**
 * Check if user has access to a feature
 *
 * @param {string} userTier - User's subscription tier
 * @param {string} feature - Feature key from FEATURE_LIMITS
 * @param {number} currentUsage - Current usage count (for limited features)
 * @returns {boolean} - Whether user has access
 */
export function hasFeatureAccess(userTier, feature, currentUsage = 0) {
  const limit = FEATURE_LIMITS[feature]?.[userTier];

  if (limit === undefined) {
    console.warn(`Unknown feature: ${feature}`);
    return false;
  }

  // Boolean features
  if (typeof limit === 'boolean') {
    return limit;
  }

  // Numeric limits
  if (typeof limit === 'number') {
    if (limit === Infinity) return true;
    return currentUsage < limit;
  }

  return false;
}

/**
 * Get remaining usage for a feature
 *
 * @param {string} userTier - User's subscription tier
 * @param {string} feature - Feature key
 * @param {number} currentUsage - Current usage count
 * @returns {number|string} - Remaining count or 'unlimited'
 */
export function getRemainingUsage(userTier, feature, currentUsage = 0) {
  const limit = FEATURE_LIMITS[feature]?.[userTier];

  if (typeof limit !== 'number') return 0;
  if (limit === Infinity) return 'unlimited';

  const remaining = Math.max(0, limit - currentUsage);
  return remaining;
}

/**
 * Get upgrade path for a feature
 *
 * @param {string} currentTier - User's current tier
 * @param {string} feature - Feature they need
 * @returns {string|null} - Recommended tier to upgrade to
 */
export function getUpgradeTier(currentTier, feature) {
  const tiers = [TIER_NAMES.SALES, TIER_NAMES.BUILD, TIER_NAMES.SCALE];
  const currentIndex = tiers.indexOf(currentTier);

  // Check each higher tier
  for (let i = currentIndex + 1; i < tiers.length; i++) {
    const tier = tiers[i];
    const limit = FEATURE_LIMITS[feature]?.[tier];

    // If this tier has the feature, recommend it
    if (limit === true || limit > 0) {
      return tier;
    }
  }

  return null;
}

/**
 * Calculate savings for annual billing
 *
 * @param {string} tier - Tier name
 * @returns {object} - Savings info
 */
export function getAnnualSavings(tier) {
  const pricing = TIER_PRICING[tier];
  if (!pricing) return null;

  const monthlyCost = pricing.monthly * 12;
  const annualCost = pricing.annually;
  const savings = monthlyCost - annualCost;
  const savingsPercent = Math.round((savings / monthlyCost) * 100);

  return {
    monthlyCost,
    annualCost,
    savings,
    savingsPercent
  };
}

/**
 * Get feature comparison for tier selection
 *
 * @returns {array} - Feature comparison matrix
 */
export function getFeatureComparison() {
  return Object.keys(FEATURE_LIMITS).map(feature => {
    return {
      feature,
      description: FEATURE_DESCRIPTIONS[feature] || feature,
      sales: FEATURE_LIMITS[feature][TIER_NAMES.SALES],
      build: FEATURE_LIMITS[feature][TIER_NAMES.BUILD],
      scale: FEATURE_LIMITS[feature][TIER_NAMES.SCALE]
    };
  });
}

/**
 * Format limit for display
 *
 * @param {any} limit - Limit value
 * @returns {string} - Formatted string
 */
export function formatLimit(limit) {
  if (limit === true) return 'Included';
  if (limit === false) return 'Not included';
  if (limit === 0) return 'None';
  if (limit === Infinity) return 'Unlimited';
  return limit.toString();
}

/**
 * Check if user can access a section
 * Wrapper for hasFeatureAccess for section-level checks
 *
 * @param {string} userTier - User's subscription tier
 * @param {string} section - Section name
 * @returns {boolean} - Whether user can access the section
 */
export function canAccessSection(userTier, section) {
  // Map section names to feature keys if needed
  const sectionMap = {
    'email_campaigns': 'campaigns',
    'reports': 'advancedAnalytics',
    'tasks': 'workflows' // Example mapping, adjust as needed
  };

  const featureKey = sectionMap[section] || section;

  // If the section is a restricted feature, check access
  if (FEATURE_LIMITS[featureKey]) {
    return hasFeatureAccess(userTier, featureKey);
  }

  // Otherwise assume it's a core section available to all
  return true;
}

// Alias for hasFeatureAccess to match import in searchResultProcessor.js
export const canAccessFeature = hasFeatureAccess;

/**
 * Pricing configuration for UI display
 * B2C Ecommerce CRM Model - Simple, Flat Pricing
 */
export const PRICING = {
  free: {
    name: 'Free Forever',
    description: 'Self-host and own your data forever.',
    monthly: 0,
    monthlyYearly: 0,
    yearly: 0,
    discount: 'Forever',
    popular: false,
    features: [
      { text: 'Self-Host (Docker)', included: true },
      { text: 'Full CRM Features', included: true },
      { text: 'Email Marketing', included: true },
      { text: 'Forms & Funnels', included: true },
      { text: 'Workflows & Automation', included: true },
      { text: 'Connect Your AI', included: true },
      { text: 'Open API Access', included: true },
      { text: 'Community Support', included: true },
    ]
  },
  launch: {
    name: 'Cloud Launch',
    description: 'Perfect for new ecommerce founders.',
    monthly: 39,
    monthlyYearly: 29,
    yearly: 349,
    discount: 'Save 25%',
    popular: true,
    features: [
      { text: 'Everything in Free', included: true },
      { text: 'Managed Hosting', included: true },
      { text: 'Auto-Updates', included: true },
      { text: 'Priority Support', included: true },
      { text: '10,000 Contacts', included: true },
      { text: 'Custom Domain', included: true },
      { text: 'Email Deliverability', included: true },
    ]
  },
  growth: {
    name: 'Cloud Growth',
    description: 'For scaling brands ready to grow.',
    monthly: 79,
    monthlyYearly: 59,
    yearly: 709,
    discount: 'Save 25%',
    popular: false,
    features: [
      { text: 'Everything in Launch', included: true },
      { text: '50,000 Contacts', included: true },
      { text: 'Advanced Analytics', included: true },
      { text: 'White-Label Options', included: true },
      { text: 'Dedicated Support', included: true },
      { text: 'SLA Guarantee', included: true },
      { text: 'Custom Integrations', included: true },
    ]
  }
};

export default {
  TIER_NAMES,
  TIER_DISPLAY_NAMES,
  FEATURE_LIMITS,
  TIER_PRICING,
  FEATURE_DESCRIPTIONS,
  hasFeatureAccess,
  canAccessFeature,
  canAccessSection,
  getRemainingUsage,
  getUpgradeTier,
  getAnnualSavings,
  getFeatureComparison,
  getAnnualSavings,
  getFeatureComparison,
  formatLimit,
  PRICING
};
