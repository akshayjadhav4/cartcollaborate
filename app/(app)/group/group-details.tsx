import useGroup from "@/hooks/storage/useGroups";
import { format } from "date-fns";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Share, TouchableOpacity } from "react-native";
import {
  Card,
  Circle,
  Spinner,
  Text,
  View,
  XStack,
  YStack,
  Paragraph,
} from "tamagui";
import { Share as ShareIcon } from "@tamagui/lucide-icons";

interface GroupMember {
  id: string;
  role: string;
  created_at: string | null;
  user_id: string;
  profile: {
    display_name: string | null;
    email: string | null;
  } | null;
}

const GroupDetailsPage = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { group, getMembers } = useGroup({ groupID: id });
  const [members, setMembers] = useState<GroupMember[] | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  async function shareInvite() {
    await Share.share({
      title: "Let's Collaborate on Our Shopping List!",
      message: `Let’s team up for our next shopping trip! Join my group using the code "${group?.id}" and let’s make shopping more efficient together!`,
    });
  }

  useEffect(() => {
    if (id) {
      (async () => {
        try {
          setMembers(await getMembers(id));
          setErrorMessage(null);
        } catch (error: any) {
          setErrorMessage(error?.message);
        }
      })();
    }
  }, [id]);

  return (
    <View flex={1} p="$5">
      <Stack.Screen
        options={{
          title: "Group Info",
          headerBackTitleVisible: false,
        }}
      />
      <Text fontSize={"$9"} textAlign="center">
        {group?.name}
      </Text>
      {group?.description ? (
        <Text my="$1" textAlign="center">
          {group?.description}
        </Text>
      ) : null}
      {group?.createdAt ? (
        <Text my="$1" textAlign="center">
          {format(new Date(group?.createdAt), "do MMM y, h:mm a")}
        </Text>
      ) : null}
      <TouchableOpacity onPress={shareInvite}>
        <YStack alignItems="center" mt="$5">
          <ShareIcon />
          <Text mt="$1">Share Invite</Text>
        </YStack>
      </TouchableOpacity>
      {members?.length === 0 && !errorMessage ? (
        <Card my="$5" p="$5" elevate bordered>
          <Spinner size="large" color="$green10" />
        </Card>
      ) : errorMessage ? (
        <Card my="$5" p="$5" elevate bordered backgroundColor={"$red10"}>
          <Text color={"$red2"}>{errorMessage}</Text>
        </Card>
      ) : (
        <Card my="$5" p="$5" elevate bordered>
          <Text mb="$5" fontSize={"$5"} fontWeight={"bold"}>
            Members
          </Text>
          <FlatList
            data={members}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <XStack alignItems="flex-start" gap="$5" mb="$4">
                <Circle size={50} backgroundColor="$gray1" elevation="$4">
                  <Text fontSize={"$8"} fontWeight={"bold"}>
                    {item.profile?.display_name?.charAt(0)}
                  </Text>
                </Circle>
                <YStack
                  flex={1}
                  py="$2"
                  borderBottomColor={"$gray10"}
                  borderBottomWidth="$0.25"
                >
                  <Text fontWeight={"bold"}>{item.profile?.display_name}</Text>
                  <Paragraph theme={"alt1"}>{item.profile?.email}</Paragraph>
                </YStack>
              </XStack>
            )}
          />
        </Card>
      )}
    </View>
  );
};

export default GroupDetailsPage;
