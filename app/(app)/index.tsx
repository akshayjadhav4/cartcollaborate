import useGroup from "@/hooks/storage/useGroups";
import { Link, Redirect, useRouter } from "expo-router";
import { FlatList } from "react-native";

import { Paragraph, Text, View } from "tamagui";

export default function Index() {
  const {} = useRouter();
  const { groups } = useGroup({ fetchGroupCollections: true });

  if (groups?.length === 0) {
    return <Redirect href={"/(app)/(manage-group)"} />;
  }
  return (
    <View flex={1} p={"$5"}>
      <FlatList
        data={groups}
        renderItem={({ item }) => (
          <Link href={`/${item.id}`}>
            <View
              py={"$5"}
              borderBottomColor={"$gray1"}
              borderBottomWidth={"$1"}
            >
              <Text fontSize={"$6"}>{item.name}</Text>
              <Paragraph theme={"alt1"}>{item.description}</Paragraph>
            </View>
          </Link>
        )}
      />
    </View>
  );
}
