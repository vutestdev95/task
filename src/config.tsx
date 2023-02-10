// TODO: Move this to .env
// https://create-react-app.dev/docs/adding-custom-environment-variables/
// https://12factor.net/config

// Environments
export interface Environment {
  name: string;
  okta: {
    clientId: string;
  };
  gqlApiUrl: string;
  realTimeUrl: string;
  servicesApiUrl: string;
  configCatKey: string;
  configCatRefreshInSeconds: number;
}

const prod: Environment = {
  name: "prod",
  okta: {
    clientId: "0oa3mgg0gcI3vXges5d7",
  },
  gqlApiUrl: "https://gql.e-courier.com",
  realTimeUrl: "wss://gql.e-courier.com",
  servicesApiUrl: "https://api.anabasius.net",
  configCatKey: "yFraCLRBA0qH1-3zZIOFKA/X_pS1R02nU23gER9p0sp1Q",
  configCatRefreshInSeconds: 120,
};

const staging: Environment = {
  name: "staging",
  okta: {
    clientId: "0oa531956lHA3bOpM5d7",
  },
  gqlApiUrl: "https://staging-gql.anabasius.net",
  realTimeUrl: "wss://staging-gql.anabasius.net",
  servicesApiUrl: "https://nxtgen-api-staging.anabasius.net",
  configCatKey: "yFraCLRBA0qH1-3zZIOFKA/wFNir9ncdkSR_woiP05fgQ",
  configCatRefreshInSeconds: 60,
};

const dev: Environment = {
  name: "dev",
  okta: {
    clientId: "0oa531956lHA3bOpM5d7",
  },
  gqlApiUrl: "https://dev-gql.anabasius.net",
  realTimeUrl: "wss://dev-gql.anabasius.net",
  servicesApiUrl: "https://nxtgen-api-dev.anabasius.net",
  configCatKey: "yFraCLRBA0qH1-3zZIOFKA/wFNir9ncdkSR_woiP05fgQ",
  configCatRefreshInSeconds: 30,
};

let env: Environment = dev;
const hostname = window.location.hostname;

if (hostname.match(/^dispatch\.(e-courier\.com|anabasius\.net)/)) {
  env = prod;
} else if (hostname === "staging.dispatch.anabasius.net") {
  env = staging;
}

// Okta Config
const oktaAuthConfig = {
  // Note: If your app is configured to use the Implicit flow
  // instead of the Authorization Code with Proof of Code Key Exchange (PKCE)
  // you will need to add `pkce: false`
  issuer: "https://ecourier.okta.com/oauth2/aus3u2bl237MTIwSx5d7",
  clientId: env.okta.clientId,
  redirectUri: window.location.origin + "/login/callback",
};

const oktaSignInConfig = {
  baseUrl: "https://ecourier.okta.com",
  clientId: env.okta.clientId,
  redirectUri: window.location.origin + "/login/callback",
  authParams: {
    // If your app is configured to use the Implicit flow
    // instead of the Authorization Code with Proof of Code Key Exchange (PKCE)
    // you will need to uncomment the below line
    // pkce: false
  },
  // Additional documentation on config options can be found at https://github.com/okta/okta-signin-widget#basic-config-options
};

// GraphQL Config
const GQL_API_URL = env.gqlApiUrl;
const REALTIME_API_URL = env.realTimeUrl;
const SERVICES_API_URL = env.servicesApiUrl;
const CONFIG_CAT_KEY = env.configCatKey;
const CONFIG_CAT_REFRESH_INTERVAL = env.configCatRefreshInSeconds;
const REGION = "us-east-1";
// const WEBSITE = "budtest";
const WEBSITE = "ecourier";

export {
  env,
  oktaAuthConfig,
  oktaSignInConfig,
  GQL_API_URL,
  REALTIME_API_URL,
  SERVICES_API_URL,
  REGION,
  CONFIG_CAT_KEY,
  CONFIG_CAT_REFRESH_INTERVAL,
  WEBSITE,
};
