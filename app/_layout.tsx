import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments, useRootNavigationState } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc, trpcClient } from "@/lib/trpc";
import { colors } from "@/constants/colors";
import { useAuthStore } from "@/store/auth-store";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient());

  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error("Font loading error:", error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="dark" />
        <RootLayoutNav />
      </QueryClientProvider>
    </trpc.Provider>
  );
}

function RootLayoutNav() {
  const router = useRouter();
  const segments = useSegments();
  const rootNavigationState = useRootNavigationState();
  const { isAuthenticated, isHydrated } = useAuthStore();

  const navigationReady = rootNavigationState?.key != null;

  useEffect(() => {
    if (!isHydrated) {
      console.log('[Auth] Waiting for store hydration...');
      return;
    }

    if (!navigationReady) {
      console.log('[Auth] Waiting for navigation to be ready...');
      return;
    }

    const inAuthGroup = (segments[0] as string) === '(auth)';
    console.log('[Auth] Navigation guard - isAuthenticated:', isAuthenticated, 'inAuthGroup:', inAuthGroup, 'segments:', segments);

    if (!isAuthenticated && !inAuthGroup) {
      console.log('[Auth] Not authenticated, redirecting to welcome');
      router.replace('/(auth)/welcome' as any);
    } else if (isAuthenticated && inAuthGroup) {
      console.log('[Auth] Authenticated, redirecting to home');
      router.replace('/(tabs)/(home)' as any);
    } else if (isAuthenticated && !inAuthGroup) {
      console.log('[Auth] Authenticated and on correct route, showing content');
    }
  }, [isAuthenticated, isHydrated, navigationReady, segments]);

  if (!isHydrated || !navigationReady) {
    return (
      <View style={loadingStyles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
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
      <Stack.Screen name="pandit/[id]" options={{ title: "Pandit Details" }} />
      <Stack.Screen name="service/[id]" options={{ title: "Service Details" }} />
      <Stack.Screen name="category/[id]" options={{ title: "Category" }} />
      <Stack.Screen name="booking/[id]" options={{ title: "Booking Details" }} />
      <Stack.Screen name="booking/create" options={{ title: "Book Service" }} />
      <Stack.Screen name="chat/[id]" options={{ title: "Chat" }} />
      <Stack.Screen name="product/[id]" options={{ title: "Product Details" }} />
      <Stack.Screen name="cart" options={{ title: "Cart" }} />
      <Stack.Screen name="checkout" options={{ title: "Checkout" }} />
      <Stack.Screen name="order-success" options={{ headerShown: false }} />
      <Stack.Screen name="orders" options={{ title: "My Orders" }} />
      <Stack.Screen name="order/[id]" options={{ title: "Order Details" }} />
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
      <Stack.Screen name="address/select" options={{ title: "Select Address" }} />
      <Stack.Screen name="address/add" options={{ title: "Add Address" }} />
      <Stack.Screen name="address/edit" options={{ title: "Edit Address" }} />
      <Stack.Screen name="admin" options={{ headerShown: false }} />
      <Stack.Screen name="pandit-onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="store/products" options={{ title: "Products" }} />
      <Stack.Screen name="store/category/[id]" options={{ title: "Category" }} />
    </Stack>
  );
}

const loadingStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});
