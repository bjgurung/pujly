import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { colors } from "@/constants/colors";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
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
    <>
      <StatusBar style="dark" />
      <RootLayoutNav />
    </>
  );
}

function RootLayoutNav() {
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
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
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
