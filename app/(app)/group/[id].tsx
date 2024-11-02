import CreateShoppingList from "@/components/CreateShoppingList";
import useGroup from "@/hooks/storage/useGroups";
import useShoppingList from "@/hooks/storage/useShoppingList";
import { ClipboardList, Plus } from "@tamagui/lucide-icons";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { FlatList, Pressable } from "react-native";
import { H2, H5, Paragraph, Text, View, YStack } from "tamagui";
import { format } from "date-fns";
const GroupPage = () => {
  const { id: groupID } = useLocalSearchParams<{ id: string }>();
  const { group } = useGroup({ groupID });
  const { shoppingLists } = useShoppingList({ groupID });
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
                <View
                  py={"$3"}
                  borderBottomColor={"$gray1"}
                  borderBottomWidth={"$1"}
                >
                  <Text fontSize={"$6"}>{item.name}</Text>
                  {item.description ? (
                    <Paragraph theme={"alt1"}>{item.description}</Paragraph>
                  ) : null}
                  <Paragraph theme={"dark_alt1"}>
                    {format(item?.createdAt, "do MMM y, h:mm a")}
                  </Paragraph>
                </View>
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
