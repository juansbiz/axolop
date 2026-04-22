/**
 * Supabase RPC Helpers
 *
 * Provides fallback mechanisms and utilities for Supabase RPC function calls.
 * Prevents failures when RPC functions haven't been deployed yet.
 */

import { supabase } from '../config/supabaseClient.js';

/**
 * Call an RPC function with fallback handling
 *
 * Attempts to call an RPC function, and if it fails with "function does not exist" error,
 * tries a fallback query strategy (if provided) instead of failing.
 *
 * @param {string} functionName - Name of the RPC function
 * @param {Object} params - Parameters to pass to the RPC function
 * @param {Function} fallbackFn - Optional fallback function to call if RPC fails
 * @returns {Promise<{data, error}>} Result with data or error
 *
 * @example
 * // Call RPC with fallback to direct table query
 * const result = await callRPCWithFallback(
 *   'get_user_agencies_enhanced',
 *   { p_user_id: userId },
 *   async () => {
 *     // Fallback: query agencies table directly
 *     return await supabase
 *       .from('businesses')
 *       .select('*')
 *       .eq('user_id', userId);
 *   }
 * );
 */
export async function callRPCWithFallback(
  functionName,
  params,
  fallbackFn,
) {
  try {
    console.log(`[RPC Helper] Calling ${functionName}`, params);

    const { data, error } = await supabase.rpc(functionName, params);

    if (error) {
      // Check if error is "function does not exist"
      if (
        error.code === 'PGRST204' ||
        error.message?.includes('does not exist') ||
        error.message?.includes('undefined function')
      ) {
        console.warn(
          `[RPC Helper] Function ${functionName} does not exist. Using fallback...`,
          error,
        );

        if (fallbackFn) {
          return await fallbackFn();
        } else {
          console.error(`[RPC Helper] No fallback provided for ${functionName}`);
          return { data: null, error };
        }
      }

      // Other errors should be returned as-is
      console.error(`[RPC Helper] RPC ${functionName} failed:`, error);
      return { data: null, error };
    }

    console.log(`[RPC Helper] ${functionName} succeeded`);
    return { data, error: null };
  } catch (error) {
    console.error(`[RPC Helper] Exception calling ${functionName}:`, error);
    return { data: null, error };
  }
}

/**
 * Get user businesses with fallback
 *
 * Calls get_user_businesses RPC, falls back to direct table query if RPC doesn't exist.
 *
 * @param {string} userId - The user ID
 * @returns {Promise<{data: Array, error}>} Array of businesses or error
 */
export async function getUserBusinesses(userId) {
  return callRPCWithFallback(
    'get_user_businesses',
    { p_user_id: userId },
    async () => {
      // Fallback: query businesses directly from database
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('user_id', userId)
        .neq('status', 'deleted'); // Exclude deleted businesses

      return { data: data || [], error };
    },
  );
}

/**
 * Validate business access with fallback
 *
 * Calls validate_business_access RPC, falls back to role checking if RPC doesn't exist.
 *
 * @param {string} userId - The user ID
 * @param {string} businessId - The business ID
 * @returns {Promise<{data: Array, error}>} Validation result or error
 */
export async function validateBusinessAccess(userId, businessId) {
  return callRPCWithFallback(
    'validate_business_access',
    { p_user_id: userId, p_business_id: businessId },
    async () => {
      // Fallback: check if user is a member of the business
      const { data, error } = await supabase
        .from('business_members')
        .select('id, role')
        .eq('user_id', userId)
        .eq('business_id', businessId)
        .single();

      if (error) {
        // No membership found
        return {
          data: [],
          error: { message: 'User does not have access to this business' },
        };
      }

      // Return access validation result
      return {
        data: [{ has_access: !!data, role: data?.role }],
        error: null,
      };
    },
  );
}

/**
 * Get role templates with fallback
 *
 * Calls get_role_templates RPC, falls back to hardcoded defaults if RPC doesn't exist.
 *
 * @returns {Promise<{data: Array, error}>} Array of role templates or error
 */
export async function getRoleTemplates() {
  return callRPCWithFallback(
    'get_role_templates',
    {},
    async () => {
      // Fallback: return default role templates
      const defaultRoles = [
        {
          id: 'admin',
          name: 'Admin',
          description: 'Full access to all business features',
          permissions: ['*'],
        },
        {
          id: 'manager',
          name: 'Manager',
          description: 'Can manage team and view reports',
          permissions: [
            'manage_team',
            'view_reports',
            'manage_leads',
            'manage_opportunities',
          ],
        },
        {
          id: 'agent',
          name: 'Agent',
          description: 'Can manage leads and opportunities',
          permissions: ['manage_leads', 'manage_opportunities', 'manage_contacts'],
        },
        {
          id: 'viewer',
          name: 'Viewer',
          description: 'Read-only access to business data',
          permissions: ['view_leads', 'view_opportunities', 'view_contacts'],
        },
      ];

      return { data: defaultRoles, error: null };
    },
  );
}

/**
 * Get user roles with fallback
 *
 * Calls get_user_role_memberships RPC, falls back to direct table query if RPC doesn't exist.
 *
 * @param {string} userId - The user ID
 * @returns {Promise<{data: Array, error}>} Array of user roles or error
 */
export async function getUserRoles(userId) {
  return callRPCWithFallback(
    'get_user_role_memberships',
    { p_user_id: userId },
    async () => {
      // Fallback: query role assignments directly
      const { data, error } = await supabase
        .from('role_assignments')
        .select(
          `
          id,
          role:role_id (
            id,
            name,
            description,
            permissions
          ),
          business_id
        `,
        )
        .eq('user_id', userId);

      return { data: data || [], error };
    },
  );
}

/**
 * Check if an RPC function exists
 *
 * Attempts to call an RPC function with dummy parameters to check if it exists.
 * Safe to call - won't fail even if function doesn't exist.
 *
 * @param {string} functionName - Name of the RPC function to check
 * @returns {Promise<boolean>} True if function exists, false otherwise
 */
export async function rpcFunctionExists(functionName) {
  try {
    // Try calling with minimal params - we expect this to fail if function doesn't exist
    const { error } = await supabase.rpc(functionName, {});

    if (
      error?.code === 'PGRST204' ||
      error?.message?.includes('does not exist') ||
      error?.message?.includes('undefined function')
    ) {
      console.log(`[RPC Helper] Function ${functionName} does not exist`);
      return false;
    }

    // Function exists (might have other errors, but it exists)
    console.log(`[RPC Helper] Function ${functionName} exists`);
    return true;
  } catch (error) {
    // Assume function exists if we get other errors
    return true;
  }
}

/**
 * Retry RPC call with exponential backoff
 *
 * Attempts to call an RPC function multiple times with increasing delays.
 * Useful for functions that might be deploying or temporarily unavailable.
 *
 * @param {string} functionName - Name of the RPC function
 * @param {Object} params - Parameters to pass to the RPC function
 * @param {number} maxRetries - Maximum number of retry attempts (default: 3)
 * @param {number} initialDelay - Initial delay in milliseconds (default: 1000)
 * @returns {Promise<{data, error}>} Result with data or error
 */
export async function callRPCWithRetry(
  functionName,
  params,
  maxRetries = 3,
  initialDelay = 1000,
) {
  let lastError;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const { data, error } = await supabase.rpc(functionName, params);

      if (!error) {
        console.log(`[RPC Helper] ${functionName} succeeded on attempt ${attempt + 1}`);
        return { data, error: null };
      }

      // Don't retry on permission or validation errors
      if (
        error.code === 'PGRST403' ||
        error.code === 'PGRST401' ||
        error.code === 'PGRST204'
      ) {
        return { data: null, error };
      }

      lastError = error;

      if (attempt < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, attempt);
        console.log(
          `[RPC Helper] ${functionName} attempt ${attempt + 1} failed, retrying after ${delay}ms`,
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    } catch (error) {
      lastError = error;

      if (attempt < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, attempt);
        console.log(
          `[RPC Helper] ${functionName} attempt ${attempt + 1} error, retrying after ${delay}ms`,
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  console.error(`[RPC Helper] ${functionName} failed after ${maxRetries} attempts`);
  return { data: null, error: lastError };
}
