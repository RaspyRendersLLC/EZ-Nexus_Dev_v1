import {
  Configuration,
  LogLevel,
  PublicClientApplication,
  SilentRequest,
} from "@azure/msal-browser";

const TENANT_ID = "617d6eb0-2279-4de1-93d8-b67d077491ba";
const CLIENT_ID = "79c97a47-0330-4e67-8e4a-bec36555cab7";

export const msalConfig: Configuration = {
  auth: {
    clientId:    CLIENT_ID,
    authority:   `https://login.microsoftonline.com/${TENANT_ID}`,
    redirectUri: window.location.origin, // must match Azure portal App Registration exactly
    postLogoutRedirectUri: window.location.origin,
  },
  cache: {
    cacheLocation:          "sessionStorage",
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      logLevel:             LogLevel.Warning,
      loggerCallback:       (level, message, containsPii) => {
        if (containsPii) return;
        if (level === LogLevel.Error) console.error("[MSAL]", message);
      },
    },
  },
};

export const loginRequest = {
  scopes: ["openid", "profile", "email", "User.Read"],
};

export const silentRequest: SilentRequest = {
  scopes:  ["openid", "profile", "email", "User.Read"],
  account: undefined, // filled at runtime
};

// Singleton — one instance per app lifecycle
export const msalInstance = new PublicClientApplication(msalConfig);
