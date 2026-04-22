import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from "react";

const LogoutContext = createContext(undefined);

export const useLogout = () => {
  const context = useContext(LogoutContext);
  if (!context) {
    throw new Error("useLogout must be used within a LogoutProvider");
  }
  return context;
};

// Safe hook that doesn't throw - returns default values if context missing
export const useSafeLogout = () => {
  const context = useContext(LogoutContext);
  if (!context) {
    return {
      isLoggingOut: false,
      startLogout: async () => {},
      completeLogout: () => {},
      logoutInProgress: false,
    };
  }
  return context;
};

export const LogoutProvider = ({ children }) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutInProgress, setLogoutInProgress] = useState(false);
  const logoutTimeoutRef = useRef(null);
  const logoutStartTimeRef = useRef(null);
  const isStartingLogout = useRef(false); // Re-entry guard

  // Start logout process - sets immediate state and coordinates across tabs
  const startLogout = useCallback(() => {
    // Prevent re-entry - if already logging out, skip
    if (isStartingLogout.current || isLoggingOut) {
      console.log("[LogoutContext] Logout already in progress, skipping duplicate call");
      return;
    }
    isStartingLogout.current = true;

    console.log("[LogoutContext] Starting logout process...");

    // Clear any existing timeout
    if (logoutTimeoutRef.current) {
      clearTimeout(logoutTimeoutRef.current);
    }

    // Set logout start time
    logoutStartTimeRef.current = Date.now();

    // IMMEDIATELY set logout states (synchronous)
    setIsLoggingOut(true);
    setLogoutInProgress(true);

    // Broadcast to other tabs
    try {
      localStorage.setItem(
        "axolop_logout_state",
        JSON.stringify({
          isLoggingOut: true,
          timestamp: Date.now(),
          source: "logout-context",
        }),
      );

      // Trigger storage event for other tabs
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "axolop_logout_state",
          newValue: JSON.stringify({
            isLoggingOut: true,
            timestamp: Date.now(),
            source: "logout-context",
          }),
        }),
      );
    } catch (error) {
      console.warn("[LogoutContext] Failed to broadcast logout state:", error);
    }

    // Safety timeout - auto-complete logout after 10 seconds
    logoutTimeoutRef.current = setTimeout(() => {
      console.warn("[LogoutContext] Logout timeout - forcing completion");
      completeLogout();
    }, 10000);

    console.log("[LogoutContext] Logout state set to true");
  }, [isLoggingOut]);

  // Complete logout process - resets states after navigation
  const completeLogout = useCallback(() => {
    console.log("[LogoutContext] Completing logout process...");

    // Clear timeout
    if (logoutTimeoutRef.current) {
      clearTimeout(logoutTimeoutRef.current);
      logoutTimeoutRef.current = null;
    }

    // Calculate logout duration
    const duration = logoutStartTimeRef.current
      ? Date.now() - logoutStartTimeRef.current
      : 0;

    console.log(`[LogoutContext] Logout completed in ${duration}ms`);

    // Reset states
    setIsLoggingOut(false);
    setLogoutInProgress(false);

    // Clear logout state from storage
    try {
      localStorage.removeItem("axolop_logout_state");

      // Trigger storage event for other tabs
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "axolop_logout_state",
          newValue: null,
        }),
      );
    } catch (error) {
      console.warn("[LogoutContext] Failed to clear logout state:", error);
    }

    // Reset refs
    logoutStartTimeRef.current = null;

    // Reset re-entry guard
    isStartingLogout.current = false;
  }, []);

  // Listen for logout state changes from other tabs
  // FIXED: Changed from useState to useEffect - useState with side effects is an anti-pattern
  // that causes duplicate event listeners and infinite loops
  useEffect(() => {
    const handleStorageChange = (event) => {
      // Only react to real cross-tab events (not synthetic same-tab events)
      // event.isTrusted is false for events created by dispatchEvent()
      if (!event.isTrusted) {
        console.log("[LogoutContext] Ignoring synthetic storage event from same tab");
        return;
      }

      if (event.key === "axolop_logout_state") {
        try {
          const logoutState = event.newValue
            ? JSON.parse(event.newValue)
            : null;

          if (logoutState && logoutState.isLoggingOut) {
            console.log(
              "[LogoutContext] Received logout state from another tab:",
              logoutState,
            );
            setIsLoggingOut(true);
            setLogoutInProgress(true);

            // Set safety timeout for this tab too
            if (logoutTimeoutRef.current) {
              clearTimeout(logoutTimeoutRef.current);
            }
            logoutTimeoutRef.current = setTimeout(() => {
              console.warn(
                "[LogoutContext] Cross-tab logout timeout - forcing completion",
              );
              completeLogout();
            }, 10000);
          } else if (!logoutState) {
            console.log(
              "[LogoutContext] Logout state cleared from another tab",
            );
            completeLogout();
          }
        } catch (error) {
          console.warn(
            "[LogoutContext] Failed to parse logout state from storage:",
            error,
          );
        }
      }
    };

    // Listen for storage events
    window.addEventListener("storage", handleStorageChange);

    // Check for existing logout state on mount
    try {
      const existingState = localStorage.getItem("axolop_logout_state");
      if (existingState) {
        const logoutState = JSON.parse(existingState);
        if (logoutState.isLoggingOut) {
          console.log("[LogoutContext] Found existing logout state on mount");
          setIsLoggingOut(true);
          setLogoutInProgress(true);

          // Set completion timeout
          logoutTimeoutRef.current = setTimeout(() => {
            console.warn(
              "[LogoutContext] Existing logout timeout - forcing completion",
            );
            completeLogout();
          }, 10000);
        }
      }
    } catch (error) {
      console.warn(
        "[LogoutContext] Failed to check existing logout state:",
        error,
      );
    }

    // Cleanup - THIS WILL ACTUALLY RUN NOW (unlike useState)
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      if (logoutTimeoutRef.current) {
        clearTimeout(logoutTimeoutRef.current);
      }
    };
  }, [completeLogout]);

  const value = useMemo(
    () => ({
      isLoggingOut,
      logoutInProgress,
      startLogout,
      completeLogout,
    }),
    [isLoggingOut, logoutInProgress, startLogout, completeLogout]
  );

  return (
    <LogoutContext.Provider value={value}>{children}</LogoutContext.Provider>
  );
};

export default LogoutProvider;
