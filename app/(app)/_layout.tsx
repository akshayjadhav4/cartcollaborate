import { useAuth } from "@/hooks/useAuth";
import { Redirect, Stack } from "expo-router";
import { Spinner, View } from "tamagui";

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

  return <Stack />;
}
