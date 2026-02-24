import { Stack } from 'expo-router';
import { colors } from '@/constants/colors';

export default function PanditLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.white },
        headerShadowVisible: false,
        headerTintColor: colors.text,
      }}
    >
      <Stack.Screen name="[id]" options={{ title: "Pandit Details" }} />
    </Stack>
  );
}
