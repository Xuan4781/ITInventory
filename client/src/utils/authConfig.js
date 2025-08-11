// src/utils/authConfig.js

export const msalConfig = {
  auth: {
    clientId: "5f7af1dd-bdea-4fbe-9947-b5142c66e7ef", // YOUR MS CLIENT ID
    authority: "https://login.microsoftonline.com/3bd2f7f9-3cce-4bc4-a0e9-cb8e90d689d3", // YOUR TENANT ID
    redirectUri: "http://localhost:5173",

  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
};

// This is used for popup login
export const loginRequest = {
  scopes: [],
};

// This is used when calling your API
export const tokenRequest = {
  scopes: ["api://5f7af1dd-bdea-4fbe-9947-b5142c66e7ef/access_as_user"], // YOUR API SCOPE
};
