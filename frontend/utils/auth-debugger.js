/**
 * 🔍 AUTH DEBUGGER UTILITY
 *
 * Debug utility for troubleshooting authentication issues in Axolop CRM.
 * Usage: Open browser console (F12) and run `window.debugAuth()`
 *
 * This utility provides comprehensive diagnostic information about:
 * - Current authentication state
 * - Circuit breaker status
 * - Session health metrics
 * - Request queue status
 * - Cross-tab synchronization state
 */

/**
 * Enable authentication debugging
 * Exposes window.debugAuth() function for console access
 */
export function enableAuthDebugging() {
  // Define the main debug function
  window.debugAuth = () => {
    const supabase = window.supabaseSingleton;
    const requestQueue = window.requestQueue;

    console.group('🔍 AUTH SYSTEM DIAGNOSTICS');

    // Supabase Session Info
    console.group('📦 Supabase Session');
    const session = supabase?.getCurrentSession();
    if (session) {
      console.log('Session exists:', !!session);
      console.log('User ID:', session.user?.id);
      console.log('User Email:', session.user?.email);
      console.log('Access Token:', session.access_token?.substring(0, 30) + '...');
      console.log('Expires At:', new Date(session.expires_at * 1000).toLocaleString());

      // Calculate time until expiration
      const now = Math.floor(Date.now() / 1000);
      const expiresIn = session.expires_at - now;
      const expiresInMin = Math.floor(expiresIn / 60);
      console.log(`Expires In: ${expiresInMin} minutes (${expiresIn}s)`);

      // Check if stale
      const isStale = expiresIn < 300; // Less than 5 minutes
      if (isStale) {
        console.warn('⚠️ SESSION IS STALE - Will be refreshed automatically');
      }
    } else {
      console.warn('❌ NO SESSION FOUND');
    }
    console.groupEnd();

    // Circuit Breaker Status
    console.group('🔌 Circuit Breaker');
    if (requestQueue?.authCircuitBreaker) {
      const cb = requestQueue.authCircuitBreaker;
      console.log('State:', cb.state);
      console.log('Failure Count:', cb.failureCount);

      if (cb.state === 'OPEN' && cb.openUntil) {
        const remainingMs = cb.openUntil - Date.now();
        const remainingSec = Math.ceil(remainingMs / 1000);
        console.warn(`⛔ CIRCUIT IS OPEN - Reopens in ${remainingSec}s`);
      } else if (cb.state === 'CLOSED') {
        console.log('✅ Circuit is closed (normal operation)');
      }

      console.log('Last Failure:', cb.lastFailureTime ? new Date(cb.lastFailureTime).toLocaleString() : 'Never');
    } else {
      console.warn('❌ Circuit breaker not available');
    }
    console.groupEnd();

    // Session Health
    console.group('💚 Session Health');
    const health = supabase?.getSessionHealth?.();
    if (health) {
      console.log('Session ID:', health.sessionId);
      console.log('Tab Session ID:', health.tabSessionId);
      console.log('Health Status:', health.health);
      console.log('Is Refreshing:', health.isRefreshing);
      console.log('Has Session:', health.hasSession);
      console.log('Is Master Tab:', health.isMaster);
      console.log('Last Activity:', new Date(health.lastActivity).toLocaleString());
    } else {
      console.warn('❌ Session health not available');
    }
    console.groupEnd();

    // Request Queue Status
    console.group('📋 Request Queue');
    if (requestQueue) {
      const status = requestQueue.getStatus?.();
      if (status) {
        console.log('Queue Length:', status.queueLength);
        console.log('Is Processing:', status.isProcessing);
        console.log('Pending Requests:', status.pendingRequests);
        console.log('Metrics:', status.metrics);
      }

      const metrics = requestQueue.getMetrics?.();
      if (metrics) {
        console.log('Total Requests:', metrics.totalRequests);
        console.log('Failed Requests:', metrics.failedRequests);
        console.log('Success Rate:', metrics.successRate + '%');
        console.log('Avg Response Time:', Math.round(metrics.averageResponseTime) + 'ms');
      }
    } else {
      console.warn('❌ Request queue not available');
    }
    console.groupEnd();

    // Cross-Tab Sync
    console.group('🔄 Cross-Tab Synchronization');
    if (requestQueue?.circuitBreakerChannel) {
      console.log('✅ BroadcastChannel active');
      console.log('Channel Name:', 'axolop_circuit_breaker');
    } else {
      console.warn('❌ BroadcastChannel not available');
    }
    console.groupEnd();

    // Quick Actions
    console.group('⚡ Quick Actions');
    console.log('Reset Circuit Breaker:', 'window.debugAuth.resetCircuit()');
    console.log('Refresh Session:', 'window.debugAuth.refreshSession()');
    console.log('View Full Session:', 'window.debugAuth.viewSession()');
    console.log('Test Auth:', 'window.debugAuth.testAuth()');
    console.groupEnd();

    console.groupEnd();
  };

  // Quick action: Reset circuit breaker
  window.debugAuth.resetCircuit = () => {
    const requestQueue = window.requestQueue;
    if (requestQueue?.resetCircuitBreaker) {
      requestQueue.resetCircuitBreaker();
      console.log('✅ Circuit breaker manually reset');
    } else {
      console.error('❌ Could not reset circuit breaker');
    }
  };

  // Quick action: Refresh session
  window.debugAuth.refreshSession = async () => {
    const supabase = window.supabaseSingleton;
    if (supabase?.refreshSession) {
      console.log('🔄 Refreshing session...');
      try {
        await supabase.refreshSession();
        console.log('✅ Session refreshed successfully');
      } catch (error) {
        console.error('❌ Session refresh failed:', error);
      }
    } else {
      console.error('❌ Could not refresh session');
    }
  };

  // Quick action: View full session object
  window.debugAuth.viewSession = () => {
    const supabase = window.supabaseSingleton;
    const session = supabase?.getCurrentSession();
    console.log('📦 Full Session Object:', session);
    return session;
  };

  // Quick action: Test auth by making a simple API request
  window.debugAuth.testAuth = async () => {
    console.log('🧪 Testing auth with API request...');
    try {
      const response = await fetch('/api/v1/users/me', {
        headers: {
          'Authorization': `Bearer ${window.supabaseSingleton?.getCurrentSession()?.access_token}`
        }
      });
      const data = await response.json();

      if (response.ok) {
        console.log('✅ Auth test successful');
        console.log('User data:', data);
      } else {
        console.error('❌ Auth test failed:', response.status, data);
      }
    } catch (error) {
      console.error('❌ Auth test error:', error);
    }
  };

  console.log('✅ Auth debugger enabled');
  console.log('📋 Run window.debugAuth() to view diagnostics');
  console.log('⚡ Quick actions:');
  console.log('   - window.debugAuth.resetCircuit()');
  console.log('   - window.debugAuth.refreshSession()');
  console.log('   - window.debugAuth.viewSession()');
  console.log('   - window.debugAuth.testAuth()');
}

/**
 * Auto-enable debugging in development mode
 */
if (import.meta.env.DEV) {
  // Enable after a short delay to ensure singletons are initialized
  setTimeout(() => {
    enableAuthDebugging();
  }, 1000);
}

export default {
  enableAuthDebugging
};
