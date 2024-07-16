import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "expo-router";

import { Text, View } from "tamagui";

export default function Index() {
  const auth = useAuth();
  const { replace } = useRouter();
  return (
    <View flex={1} alignItems="center" justifyContent="center">
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Text
        onPress={() => {
          replace("/(app)/(manage-group)");
        }}
      >
        Sign Out
      </Text>
    </View>
  );
}
