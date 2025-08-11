// src/hooks/useAccessToken.js
import { useMsal } from "@azure/msal-react";
import { InteractionRequiredAuthError } from "@azure/msal-browser";
import { tokenRequest } from "../utils/authConfig";

export function useAccessToken() {
  const { accounts, instance } = useMsal();

  async function getAccessToken() {
    if (accounts.length === 0) {
      throw new Error("No user signed in");
    }
    
    try {
      // Try to acquire token silently first
      const response = await instance.acquireTokenSilent({
        ...tokenRequest,
        account: accounts[0],
      });
      
      return response.accessToken;
    } catch (error) {
      // If interaction is required (token expired, etc.), fallback to popup
      if (error instanceof InteractionRequiredAuthError) {
        console.log("Silent token acquisition failed, falling back to interactive method");
        const response = await instance.acquireTokenPopup({
          ...tokenRequest,
          account: accounts[0],
        });
        return response.accessToken;
      }
      
      // For other errors, rethrow
      console.error("Token acquisition failed:", error);
      throw error;
    }
  }

  return { getAccessToken };
}
