// ========================================
// SECURE TOKEN STORAGE
// ========================================
// Encryption utilities for secure localStorage token storage

import CryptoJS from "crypto-js";

const ENCRYPTION_KEY =
  import.meta.env.VITE_ENCRYPTION_KEY || "default-dev-key-change-in-production";

/**
 * Encrypt data using AES encryption
 */
export const encrypt = (data) => {
  if (!data) return null;

  try {
    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      ENCRYPTION_KEY,
    ).toString();
    return encrypted;
  } catch (error) {
    console.error("Encryption error:", error);
    return null;
  }
};

/**
 * Decrypt data using AES encryption
 */
export const decrypt = (encryptedData) => {
  if (!encryptedData) return null;

  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  } catch (error) {
    console.error("Decryption error:", error);
    return null;
  }
};

/**
 * Secure token storage utilities
 */
export const secureStorage = {
  /**
   * Store auth session securely
   */
  setSession: (session) => {
    if (!session) {
      localStorage.removeItem("axolop_auth_session");
      localStorage.removeItem("axolop_auth_timestamp");
      return;
    }

    try {
      const encryptedSession = encrypt(session);
      if (encryptedSession) {
        localStorage.setItem("axolop_auth_session", encryptedSession);
        localStorage.setItem("axolop_auth_timestamp", Date.now().toString());
      }
    } catch (error) {
      console.error("Failed to encrypt session:", error);
      // Fallback to plaintext storage (development only)
      if (import.meta.env.MODE !== "production") {
        localStorage.setItem("axolop_auth_session", JSON.stringify(session));
        localStorage.setItem("axolop_auth_timestamp", Date.now().toString());
      }
    }
  },

  /**
   * Retrieve and decrypt auth session
   */
  getSession: () => {
    try {
      const encryptedSession = localStorage.getItem("axolop_auth_session");
      const timestamp = localStorage.getItem("axolop_auth_timestamp");

      if (encryptedSession && timestamp) {
        const session = decrypt(encryptedSession);
        const sessionAge = Date.now() - parseInt(timestamp);

        // Session valid for 7 days
        if (sessionAge < 7 * 24 * 60 * 60 * 1000) {
          return session;
        }
      }
    } catch (error) {
      console.error("Failed to decrypt session:", error);
    }

    // Fallback to plaintext (development only)
    if (import.meta.env.MODE !== "production") {
      try {
        const plaintextSession = localStorage.getItem("axolop_auth_session");
        const timestamp = localStorage.getItem("axolop_auth_timestamp");

        if (plaintextSession && timestamp) {
          const session = JSON.parse(plaintextSession);
          const sessionAge = Date.now() - parseInt(timestamp);

          if (sessionAge < 7 * 24 * 60 * 60 * 1000) {
            return session;
          }
        }
      } catch (parseError) {
        console.error("Failed to parse plaintext session:", parseError);
      }
    }

    return null;
  },

  /**
   * Clear auth session securely
   */
  clearSession: () => {
    localStorage.removeItem("axolop_auth_session");
    localStorage.removeItem("axolop_auth_timestamp");

    // Also clear any other sensitive data
    localStorage.removeItem("axolop_user_preferences");
    localStorage.removeItem("axolop_current_business");
  },

  /**
   * Check if session exists and is valid
   */
  hasValidSession: () => {
    const session = secureStorage.getSession();
    return session !== null && session.user && session.access_token;
  },
};
