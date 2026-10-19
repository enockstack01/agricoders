import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ClerkProvider, SignedIn, SignedOut, useAuth } from '@clerk/clerk-expo';
import { useFonts, Carlito_400Regular, Carlito_700Bold } from '@expo-google-fonts/carlito';

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
import { SignInServiceErrorScreen } from './screens/SignInServiceErrorScreen';

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
/** How long to wait for the sign in service before showing an error instead of the spinner. */
const AUTH_LOAD_TIMEOUT = 15000;

function AppShell({ onRetry }: { onRetry: () => void }) {
  const { isLoaded } = useAuth();
  const [stalled, setStalled] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      setStalled(false);
      return;
    }
    const t = setTimeout(() => setStalled(true), AUTH_LOAD_TIMEOUT);
    return () => clearTimeout(t);
  }, [isLoaded]);

  if (!isLoaded) {
    return stalled ? <SignInServiceErrorScreen onRetry={onRetry} /> : <Loading label="Connecting to Agriplan…" />;
  }
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
  // Carlito (the open twin of Calibri, the brand typeface); the splash covers the moment it takes to load
  const [fontsLoaded, fontError] = useFonts({ Carlito_400Regular, Carlito_700Bold });
  const ready = fontsLoaded || !!fontError;
  // bumping the key remounts Clerk, which retries loading the sign in service
  const [attempt, setAttempt] = useState(0);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <SplashHost>
            {ready ? (
              <ClerkProvider
                key={attempt}
                publishableKey={CLERK_PUBLISHABLE_KEY}
                tokenCache={tokenCache}
                experimental={{ rethrowOfflineNetworkErrors: true }}
              >
                <AppShell onRetry={() => setAttempt((n) => n + 1)} />
              </ClerkProvider>
            ) : null}
          </SplashHost>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
