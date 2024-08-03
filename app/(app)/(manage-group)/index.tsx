import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Card, H4, SizableText, View } from "tamagui";
import ParagraphWithNumber from "@/components/ParagraphWithNumber";
import { Link, useRouter } from "expo-router";

const OnboardingPage = () => {
  const { push } = useRouter();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View flex={1} p="$5">
        <SizableText size={"$10"}>Welcome to</SizableText>
        <SizableText size={"$10"}>Cart Collaborate!</SizableText>
        <SizableText size={"$6"} paddingVertical="$4">
          Get started by creating a new group or joining an existing one.
        </SizableText>
        <View width={"100%"} alignItems="center" justifyContent="center">
          <Link href={"/(app)/(manage-group)/create"} asChild>
            <Button
              width={"80%"}
              marginVertical="$5"
              borderRadius={"$10"}
              variant="outlined"
              borderColor={"$borderColor"}
            >
              Create a New Group
            </Button>
          </Link>
          <Link href={"/(app)/(manage-group)/join"} asChild>
            <Button
              width={"80%"}
              marginVertical="$5"
              borderRadius={"$10"}
              backgroundColor={"$borderColor"}
              variant="outlined"
            >
              Join an Existing Group
            </Button>
          </Link>
        </View>
        <Card>
          <Card.Header>
            <H4 mb="$3">Why Join a Group?</H4>
            <ParagraphWithNumber
              number={1}
              text="Collaborate with family members on shared shopping lists."
            />
            <ParagraphWithNumber
              number={2}
              text="Get real-time updates when items are added or removed."
            />
            <ParagraphWithNumber
              number={3}
              text="Ensure everyone is on the same page with household needs."
            />
          </Card.Header>
        </Card>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingPage;
