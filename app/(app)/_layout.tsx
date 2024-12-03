import { useAuth } from "@/hooks/useAuth";
import { Redirect, Stack } from "expo-router";
import { Spinner, View } from "tamagui";
import HomeDropdown from "@/components/Dropdowns/HomeDropdown";

export default function AppLayout() {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View flex={1} alignItems="center" justifyContent="center">
        <Spinner size="large" />
      </View>
    );
  }

  if (!session) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Groups",
          headerRight: () => <HomeDropdown />,
        }}
      />
      <Stack.Screen name="manage-group" options={{ headerShown: false }} />
    </Stack>
  );
}
