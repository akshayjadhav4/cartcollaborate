import CreateShoppingList from "@/components/CreateShoppingList";
import SwipeableListItem from "@/components/SwipeableListItem";
import useGroup from "@/hooks/storage/useGroups";
import useShoppingList from "@/hooks/storage/useShoppingList";
import getDueDateMessage from "@/utils";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { ClipboardList, Plus, Trash } from "@tamagui/lucide-icons";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { FlatList, Pressable } from "react-native";
import { Card, H2, H5, Paragraph, Text, View, XStack, YStack } from "tamagui";
const GroupPage = () => {
  const { id: groupID } = useLocalSearchParams<{ id: string }>();
  const { group } = useGroup({ groupID });
  const { shoppingLists, deleteList } = useShoppingList({ groupID });
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <View flex={1} p="$5">
        <Stack.Screen
          options={{
            headerTitle: () => (
              <Link
                href={{
                  pathname: "/group/group-details",
                  params: { id: group?.id },
                }}
              >
                <Text fontSize={"$5"}>{group?.name}</Text>
              </Link>
            ),
            headerBackTitleVisible: false,
            headerRight: () => (
              <Pressable onPress={() => setOpen(true)}>
                <Plus />
              </Pressable>
            ),
          }}
        />
        {shoppingLists && shoppingLists?.length > 0 ? (
          <>
            <H2 mb="$2">Shopping Lists</H2>
            <FlatList
              data={shoppingLists}
              renderItem={({ item }) => (
                <SwipeableListItem
                  rightActions={[
                    {
                      icon: <Trash />,
                      bgColor: "$red10",
                      onPress: () => {
                        deleteList(item.id);
                      },
                    },
                  ]}
                >
                  <Card p="$3" borderRadius={"$4"}>
                    <XStack alignItems="center">
                      <YStack flex={1}>
                        <Text fontWeight="bold">{item.name}</Text>
                        {item.description ? (
                          <Paragraph theme={"alt1"}>
                            {item.description}
                          </Paragraph>
                        ) : null}
                        <Paragraph theme={"dark_alt1"}>
                          {getDueDateMessage(item.dueDate, item?.createdAt)}
                        </Paragraph>
                      </YStack>
                      <Link href={`/shopping/${item.id}`}>
                        <EvilIcons
                          name="chevron-right"
                          size={40}
                          color={"grey"}
                        />
                      </Link>
                    </XStack>
                  </Card>
                </SwipeableListItem>
              )}
            />
          </>
        ) : (
          <>
            <YStack flex={1} alignItems="center" justifyContent="center">
              <ClipboardList size={"$6"} my={"$5"} />
              <H5 mb={"$5"}>No Shopping Lists Yet!</H5>
              <Text textAlign="center">
                It looks like there are no shopping lists created for this group
                yet. Tap the "+" button to create a new shopping list and start
                adding items.
              </Text>
            </YStack>
          </>
        )}
      </View>
      <CreateShoppingList groupID={groupID!} open={open} setOpen={setOpen} />
    </>
  );
};

export default GroupPage;
