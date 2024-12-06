import ShoppingListItemCard from "@/components/ShoppingListItem";
import useShoppingList from "@/hooks/storage/useShoppingList";
import useShoppingListItems from "@/hooks/storage/useShoppingListItems";
import { Plus, ShoppingCart } from "@tamagui/lucide-icons";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { H2, H5, Text, View, YStack } from "tamagui";
import Animated, { LinearTransition } from "react-native-reanimated";

const ShoppingItems = () => {
  const { list: listId } = useLocalSearchParams<{ list: string }>();
  const { shoppingListDetails } = useShoppingList({ shoppingListID: listId });
  const { shoppingItems } = useShoppingListItems({ listId });
  return (
    <View flex={1} p="$5">
      <Stack.Screen
        options={{
          title: shoppingListDetails?.name ?? "Items",
          headerShown: true,
          headerBackTitleVisible: false,
          headerRight: () => (
            <Link
              href={{
                pathname: `/shopping/manage-item`,
                params: {
                  listId: shoppingListDetails?.id,
                },
              }}
            >
              <Plus />
            </Link>
          ),
        }}
      />
      {shoppingItems && shoppingItems?.length > 0 ? (
        <>
          <H2 mb="$2">Items</H2>
          <Animated.FlatList
            data={shoppingItems}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ShoppingListItemCard
                id={item.id}
                name={item.name}
                quantity={item.quantity}
                unit={item.unit}
                category={item.category}
                priority={item.priority}
                purchased={item.purchased}
                onTogglePurchased={(isPurchased) => {
                  item.togglePurchased(isPurchased);
                }}
                deleteHandler={() => {
                  item.removeItem();
                }}
              />
            )}
            itemLayoutAnimation={LinearTransition}
          />
        </>
      ) : (
        <YStack flex={1} alignItems="center" justifyContent="center">
          <ShoppingCart size={"$6"} my={"$5"} />
          <H5 mb={"$5"}>No Items</H5>
          <Text textAlign="center">
            It looks like this shopping list doesn't have any items yet. Tap the
            '+' button to add your first item.
          </Text>
        </YStack>
      )}
    </View>
  );
};

export default ShoppingItems;
