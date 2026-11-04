// Learn more https://docs.expo.dev/guides/customizing-metro
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

// `mobile` is intentionally NOT one of the repo's npm workspaces (server, client)
// and ships its own complete node_modules, so the default config is sufficient.
const config = getDefaultConfig(__dirname);

// Development preview: with EXPO_PUBLIC_PREVIEW=1 the real app runs in a browser with a stand in for
// Clerk that also installs a mock API (see preview/), so every screen can be viewed without signing in.
// Without that variable (every normal and release build) this block does nothing.
if (process.env.EXPO_PUBLIC_PREVIEW === '1') {
  const upstream = config.resolver.resolveRequest;
  config.resolver.resolveRequest = (context, moduleName, platform) => {
    if (moduleName === '@clerk/clerk-expo') {
      return { type: 'sourceFile', filePath: path.join(__dirname, 'preview/clerkMock.tsx') };
    }
    return (upstream ?? context.resolveRequest)(context, moduleName, platform);
  };
}

module.exports = config;
