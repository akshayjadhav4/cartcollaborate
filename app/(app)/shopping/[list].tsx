import ShoppingListItemCard from "@/components/ShoppingListItem";
import useShoppingList from "@/hooks/storage/useShoppingList";
import useShoppingListItems from "@/hooks/storage/useShoppingListItems";
import { Plus } from "@tamagui/lucide-icons";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { H2, View } from "tamagui";
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
        <></>
      )}
    </View>
  );
};

export default ShoppingItems;
