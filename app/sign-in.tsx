import { useAuth } from "@/hooks/useAuth";
import { Text, View } from "tamagui";

export default function SignIn() {
  const auth = useAuth();
  return (
    <View
      flex={1}
      alignItems="center"
      justifyContent="center"
      backgroundColor={"$background"}
    >
      <Text onPress={() => auth.signIn()}>SignIn</Text>
    </View>
  );
}
