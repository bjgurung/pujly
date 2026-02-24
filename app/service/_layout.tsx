import { Stack } from 'expo-router';
import { colors } from '@/constants/colors';

export default function ServiceLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.white },
        headerShadowVisible: false,
        headerTintColor: colors.text,
      }}
    >
      <Stack.Screen name="[id]" options={{ title: "Service Details" }} />
    </Stack>
  );
}
