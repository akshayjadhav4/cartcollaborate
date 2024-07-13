import { useAuth } from "@/hooks/useAuth";
import { Text, View } from "tamagui";

export default function Index() {
  const auth = useAuth();
  return (
    <View flex={1} alignItems="center" justifyContent="center">
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Text
        onPress={() => {
          auth.signOut();
        }}
      >
        Sign Out
      </Text>
    </View>
  );
}
