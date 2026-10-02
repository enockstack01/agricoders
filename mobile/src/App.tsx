import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ClerkProvider, SignedIn, SignedOut, useAuth } from '@clerk/clerk-expo';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter';

import { CLERK_PUBLISHABLE_KEY } from './env';
import { tokenCache } from './lib/tokenCache';
import { setTokenGetter } from './lib/api';
import { useProfile } from './lib/useResource';
import { setCurrency } from './lib/format';
import { ThemeProvider, useTheme } from './theme/ThemeProvider';
import { ToastProvider } from './components/Toast';
import { ConfirmProvider } from './components/Confirm';
import { Loading } from './components/ui';
import { SplashHost, SplashReadyOnMount, useSplashReady } from './components/AppSplash';
import { AppNavigator } from './navigation/AppNavigator';
import { AuthNavigator } from './navigation/AuthNavigator';
import { ConnectionErrorScreen } from './screens/ConnectionErrorScreen';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false, staleTime: 15_000 } },
});

/** Bridges Clerk's session token into the API client (set during render, before any query fires). */
function ApiTokenBridge() {
  const { getToken } = useAuth();
  setTokenGetter(() => getToken());
  return null;
}

/**
 * Signed-in entry: loads the user's plan defaults (proves the API is reachable and the
 * session is accepted), then opens the app. The splash stays up while this resolves; a
 * server that can't be reached ends in a Retry screen instead of an endless spinner.
 */
function RootGate() {
  const { defaults, isLoading, isFetching, isError, error, refetch } = useProfile();
  const splashReady = useSplashReady();

  useEffect(() => {
    if (!isLoading) splashReady();
  }, [isLoading, splashReady]);

  if (isLoading) return <Loading label="Connecting to Agriplan…" />;
  if (isError || !defaults) {
    return <ConnectionErrorScreen error={error} retrying={isFetching} onRetry={() => refetch()} />;
  }
  setCurrency(defaults.currency || 'USD');
  return <AppNavigator />;
}

function NavRoot() {
  const { isDark, colors } = useTheme();
  const base = isDark ? DarkTheme : DefaultTheme;
  const navTheme = {
    ...base,
    colors: { ...base.colors, background: colors.bg, card: colors.card, text: colors.text, border: colors.border, primary: colors.primary },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <SignedIn>
        <RootGate />
      </SignedIn>
      <SignedOut>
        <SplashReadyOnMount />
        <AuthNavigator />
      </SignedOut>
    </NavigationContainer>
  );
}

/** Mounts the app once Clerk has restored the session (the splash covers the wait). */
function AppShell() {
  const { isLoaded } = useAuth();
  if (!isLoaded) return <Loading label="Connecting to Agriplan…" />;
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <ConfirmProvider>
          <ApiTokenBridge />
          <NavRoot />
        </ConfirmProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}

export default function App() {
  // Inter, CropManager's typeface; the splash covers the moment it takes to load
  const [fontsLoaded, fontError] = useFonts({ Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold });
  const ready = fontsLoaded || !!fontError;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <SplashHost>
            {ready ? (
              <ClerkProvider
                publishableKey={CLERK_PUBLISHABLE_KEY}
                tokenCache={tokenCache}
                experimental={{ rethrowOfflineNetworkErrors: true }}
              >
                <AppShell />
              </ClerkProvider>
            ) : null}
          </SplashHost>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
