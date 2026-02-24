import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc, trpcClient, setAuthTokenGetter } from "@/lib/trpc";
import { colors } from "@/constants/colors";
import { useAuthStore, setTrpcClientRef } from "@/store/auth-store";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="dark" />
        <RootLayoutNav />
      </QueryClientProvider>
    </trpc.Provider>
  );
}

class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary] Caught error:', error.message);
    console.error('[ErrorBoundary] Component stack:', errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={loadingStyles.errorContainer}>
          <Text style={loadingStyles.errorEmoji}>⚠️</Text>
          <Text style={loadingStyles.errorTitle}>Something went wrong</Text>
          <Text style={loadingStyles.errorMessage}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </Text>
          <TouchableOpacity
            style={loadingStyles.retryButton}
            onPress={() => this.setState({ hasError: false, error: null })}
          >
            <Text style={loadingStyles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

function RootLayoutNav() {
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated, isHydrated, token } = useAuthStore();
  const [isLayoutReady, setIsLayoutReady] = useState(false);

  useEffect(() => {
    setAuthTokenGetter(() => useAuthStore.getState().token);
    setTrpcClientRef(trpcClient);
    console.log('[Auth] Token getter and tRPC client registered');
  }, []);

  useEffect(() => {
    if (!isHydrated || !isLayoutReady) {
      console.log('[Auth] Waiting...', { isHydrated, isLayoutReady });
      return;
    }

    const inAuthGroup = (segments[0] as string) === '(auth)';
    console.log('[Auth] Navigation guard - isAuthenticated:', isAuthenticated, 'inAuthGroup:', inAuthGroup, 'segments:', JSON.stringify(segments));

    try {
      if (isAuthenticated && inAuthGroup) {
        console.log('[Auth] Authenticated, redirecting to home');
        router.replace('/(tabs)/(home)' as any);
      } else {
        console.log('[Auth] On route:', segments.join('/'), '| authenticated:', isAuthenticated);
      }
    } catch (e) {
      console.error('[Auth] Navigation error:', e);
    }
  }, [isAuthenticated, isHydrated, isLayoutReady, segments]);

  return (
    <AppErrorBoundary>
    <View style={{ flex: 1 }} onLayout={() => setIsLayoutReady(true)}>
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.white },
        headerShadowVisible: false,
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '600' as const },
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="pandit" options={{ headerShown: false }} />
      <Stack.Screen name="service" options={{ headerShown: false }} />
      <Stack.Screen name="category" options={{ headerShown: false }} />
      <Stack.Screen name="booking" options={{ headerShown: false }} />
      <Stack.Screen name="chat" options={{ headerShown: false }} />
      <Stack.Screen name="product" options={{ headerShown: false }} />
      <Stack.Screen name="cart" options={{ title: "Cart" }} />
      <Stack.Screen name="checkout" options={{ title: "Checkout" }} />
      <Stack.Screen name="order-success" options={{ headerShown: false }} />
      <Stack.Screen name="orders" options={{ title: "My Orders" }} />
      <Stack.Screen name="order" options={{ headerShown: false }} />
      <Stack.Screen name="wishlist" options={{ title: "Wishlist" }} />
      <Stack.Screen name="pandit-profile" options={{ title: "My Profile" }} />
      <Stack.Screen name="pandit-services" options={{ title: "My Services" }} />
      <Stack.Screen name="pandit-service-edit" options={{ title: "Edit Service" }} />
      <Stack.Screen name="pandit-schedule" options={{ title: "My Schedule" }} />
      <Stack.Screen name="pandit-earnings" options={{ title: "My Earnings" }} />
      <Stack.Screen name="edit-profile" options={{ title: "Edit Profile" }} />
      <Stack.Screen name="personal-info" options={{ title: "Personal Information" }} />
      <Stack.Screen name="payment-methods" options={{ title: "Payment Methods" }} />
      <Stack.Screen name="notifications" options={{ title: "Notifications" }} />
      <Stack.Screen name="help-support" options={{ title: "Help & Support" }} />
      <Stack.Screen name="privacy-policy" options={{ title: "Privacy Policy" }} />
      <Stack.Screen name="terms-of-service" options={{ title: "Terms of Service" }} />
      <Stack.Screen name="address" options={{ headerShown: false }} />
      <Stack.Screen name="admin" options={{ headerShown: false }} />
      <Stack.Screen name="pandit-onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="store" options={{ headerShown: false }} />
    </Stack>
    </View>
    </AppErrorBoundary>
  );
}

const loadingStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: 24,
  },
  errorEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center' as const,
    lineHeight: 20,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  retryText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600' as const,
  },
});
