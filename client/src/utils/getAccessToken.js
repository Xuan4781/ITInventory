import { msalInstance } from '../msalConfig';
import { tokenRequest } from '../utils/authConfig';

export async function getAccessToken() {
  const accounts = msalInstance.getAllAccounts();
  if (!accounts || accounts.length === 0) {
    msalInstance.loginRedirect(tokenRequest);
    return new Promise(() => {}); // never resolves, redirects
  }

  try {
    const response = await msalInstance.acquireTokenSilent({
      ...tokenRequest,
      account: accounts[0],
    });
    return response.accessToken;
  } catch (error) {
    if (error.name === "InteractionRequiredAuthError") {
      // Token expired or interaction required — fallback to redirect or popup
      return msalInstance.acquireTokenRedirect({
        ...tokenRequest,
        account: accounts[0],
      });
    }
    throw error;
  }
}
