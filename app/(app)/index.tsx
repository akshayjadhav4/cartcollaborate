import SwipeableListItem from "@/components/SwipeableListItem";
import useGroup from "@/hooks/storage/useGroups";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { Trash } from "@tamagui/lucide-icons";
import { Link, Redirect, useRouter } from "expo-router";
import Animated, { LinearTransition } from "react-native-reanimated";

import { Card, Paragraph, Text, View, XStack, YStack } from "tamagui";

export default function Index() {
  const {} = useRouter();
  const { groups, deleteGroup } = useGroup({ fetchGroupCollections: true });

  if (groups?.length === 0) {
    return <Redirect href={"/(app)/manage-group"} />;
  }
  return (
    <View flex={1} p={"$5"}>
      <Animated.FlatList
        data={groups}
        renderItem={({ item }) => (
          <SwipeableListItem
            rightActions={[
              {
                icon: <Trash />,
                bgColor: "$red10",
                onPress: () => {
                  deleteGroup(item.id);
                },
              },
            ]}
          >
            <Card p="$3" borderRadius={"$4"}>
              <XStack alignItems="center">
                <YStack flex={1}>
                  <Text fontSize={"$6"}>{item.name}</Text>
                  <Paragraph theme={"alt1"}>{item.description}</Paragraph>
                </YStack>
                <Link href={`/group/${item.id}`}>
                  <EvilIcons name="chevron-right" size={40} color={"grey"} />
                </Link>
              </XStack>
            </Card>
          </SwipeableListItem>
        )}
        itemLayoutAnimation={LinearTransition}
      />
    </View>
  );
}
