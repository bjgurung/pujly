import { Stack } from 'expo-router';
import { colors } from '@/constants/colors';

export default function StoreLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.white },
        headerShadowVisible: false,
        headerTintColor: colors.text,
      }}
    >
      <Stack.Screen name="products" options={{ title: "Products" }} />
      <Stack.Screen name="category/[id]" options={{ title: "Category" }} />
    </Stack>
  );
}
