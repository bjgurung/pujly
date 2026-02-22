import { Stack } from 'expo-router';
import { colors } from '@/constants/colors';

export default function AdminLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.white },
        headerShadowVisible: false,
        headerTintColor: colors.text,
      }}
    >
      <Stack.Screen name="index" options={{ title: "Admin Dashboard" }} />
      <Stack.Screen name="pandit-approvals" options={{ title: "Pandit Approvals" }} />
      <Stack.Screen name="pandit-approval-details" options={{ title: "Approval Details" }} />
    </Stack>
  );
}
