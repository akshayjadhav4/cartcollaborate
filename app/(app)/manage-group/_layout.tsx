import { Stack } from "expo-router";

export default function ManageGroupLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="create"
        options={{
          presentation: "modal",
          title: "Create a New Group",
          headerBackVisible: true,
        }}
      />
      <Stack.Screen
        name="join"
        options={{
          presentation: "modal",
          title: "Join a New Group",
          headerBackVisible: true,
        }}
      />
    </Stack>
  );
}
