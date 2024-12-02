import useGroup from "@/hooks/storage/useGroups";
import { format } from "date-fns";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Share, TouchableOpacity } from "react-native";
import {
  Card,
  Circle,
  Spinner,
  Text,
  XStack,
  YStack,
  Paragraph,
  ScrollView,
} from "tamagui";
import {
  Share as ShareIcon,
  Trash,
  ArrowLeftSquare,
} from "@tamagui/lucide-icons";
import * as Burnt from "burnt";
import { Errors } from "@/constants/Errors";
import { useAuth } from "@/hooks/useAuth";
import { GroupRole } from "@/DB/model/GroupMember";

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
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { group, getMembers, deleteGroup, leaveGroup } = useGroup({
    groupID: id,
  });
  const [members, setMembers] = useState<GroupMember[] | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  async function shareInvite() {
    await Share.share({
      title: "Let's Collaborate on Our Shopping List!",
      message: `Let’s team up for our next shopping trip! Join my group using the code "${group?.id}" and let’s make shopping more efficient together!`,
    });
  }

  function deleteGroupHandler() {
    try {
      deleteGroup(group?.id);
      if (router.canDismiss()) router.dismissAll();
    } catch (error) {
      Burnt.toast({
        title: Errors.FAILED_TO_DELETE_GROUP,
        preset: "error",
        haptic: "error",
        duration: 2,
        from: "top",
        shouldDismissByDrag: true,
      });
    }
  }

  function leaveGroupHandler() {
    try {
      leaveGroup(group?.id, user?.id);
      if (router.canDismiss()) router.dismissAll();
    } catch (error) {
      Burnt.toast({
        title: Errors.FAILED_TO_LEAVE_GROUP,
        preset: "error",
        haptic: "error",
        duration: 2,
        from: "top",
        shouldDismissByDrag: true,
      });
    }
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
    <ScrollView p="$5">
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
      <Card width={"50%"} alignSelf="center" my="$5" py="$5" bordered>
        <TouchableOpacity onPress={shareInvite}>
          <YStack alignItems="center">
            <ShareIcon />
            <Text mt="$1">Share Invite</Text>
          </YStack>
        </TouchableOpacity>
      </Card>
      {members?.length === 0 && !errorMessage ? (
        <Card my="$5" p="$5" elevate bordered>
          <Spinner size="large" color="$green10" />
        </Card>
      ) : errorMessage ? (
        <Card my="$5" p="$5" elevate bordered backgroundColor={"$red10"}>
          <Text color={"$red2"}>{errorMessage}</Text>
        </Card>
      ) : (
        <Card my="$5" p="$5" bordered>
          {members?.map((member) => (
            <XStack key={member?.id} alignItems="flex-start" gap="$5" mb="$4">
              <Circle size={50} backgroundColor="$gray1" elevation="$4">
                <Text fontSize={"$8"} fontWeight={"bold"}>
                  {member.profile?.display_name?.charAt(0)}
                </Text>
              </Circle>
              <YStack
                flex={1}
                py="$2"
                borderBottomColor={"$gray10"}
                borderBottomWidth="$0.25"
              >
                <XStack alignItems="center" justifyContent="space-between">
                  <Text fontWeight={"bold"}>
                    {member.profile?.display_name}
                  </Text>
                  {member?.role === GroupRole.Owner ? (
                    <Text color={"$black9"}>{member?.role}</Text>
                  ) : null}
                </XStack>
                <Paragraph theme={"alt1"}>{member.profile?.email}</Paragraph>
              </YStack>
            </XStack>
          ))}
        </Card>
      )}
      <Card mt="$5" p="$5" bordered>
        <TouchableOpacity onPress={leaveGroupHandler}>
          <XStack alignItems="center">
            <ArrowLeftSquare color={"$red10Dark"} mr="$5" />

            <Text
              mt="$1"
              fontSize={"$5"}
              fontWeight={"bold"}
              color={"$red10Dark"}
            >
              Leave Group
            </Text>
          </XStack>
        </TouchableOpacity>
      </Card>
      {group?.owner_id === user?.id ? (
        <Card mt="$5" p="$5" bordered>
          <TouchableOpacity onPress={deleteGroupHandler}>
            <XStack alignItems="center">
              <Trash color={"$red10Dark"} mr="$5" />
              <Text fontSize={"$5"} fontWeight={"bold"} color={"$red10Dark"}>
                Delete Group
              </Text>
            </XStack>
          </TouchableOpacity>
        </Card>
      ) : null}
    </ScrollView>
  );
};

export default GroupDetailsPage;
