import { Stack } from 'expo-router';
import { colors } from '@/constants/colors';

export default function AddressLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.white },
        headerShadowVisible: false,
        headerTintColor: colors.text,
      }}
    >
      <Stack.Screen name="select" options={{ title: "Select Address" }} />
      <Stack.Screen name="add" options={{ title: "Add Address" }} />
      <Stack.Screen name="edit" options={{ title: "Edit Address" }} />
    </Stack>
  );
}
