import { Stack } from 'expo-router';
import { colors } from '@/constants/colors';

export default function BookingLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.white },
        headerShadowVisible: false,
        headerTintColor: colors.text,
      }}
    >
      <Stack.Screen name="[id]" options={{ title: "Booking Details" }} />
      <Stack.Screen name="create" options={{ title: "Book Service" }} />
    </Stack>
  );
}
