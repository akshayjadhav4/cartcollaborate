import database from "@/DB";
import { useAuth } from "../useAuth";
import { useEffect, useState } from "react";
import { TableName } from "@/DB/schema";
import { Q } from "@nozbe/watermelondb";
import ShoppingListItem from "@/DB/model/ShoppingListItem";

const useShoppingListItems = ({ listId }: { listId?: string }) => {
  const { user } = useAuth();
  const [shoppingItems, setShoppingItems] = useState<ShoppingListItem[] | null>(
    null
  );
  useEffect(() => {
    if (listId) {
      const subscription = database.collections
        .get<ShoppingListItem>(TableName.ShoppingListItem)
        .query(
          Q.where("shopping_list_id", listId),
          Q.where("_status", Q.notEq("deleted")),
          Q.sortBy("is_purchased", Q.asc),
          Q.sortBy("priority", Q.desc)
        )
        .observe() //TODO:: observe sometimes not reactive on is_purchased update
        .subscribe((results) => {
          setShoppingItems(results);
        });
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [listId]);

  const addItem = user
    ? async ({
        listId,
        category,
        name,
        note,
        priority,
        purchased,
        quantity,
        unit,
      }: {
        listId: string;
        name: string;
        category: string;
        note: string;
        priority: number;
        purchased: boolean;
        quantity: number;
        unit: string;
      }) => {
        await database.write(async () => {
          await database
            .get<ShoppingListItem>(TableName.ShoppingListItem)
            .create((shoppingListItem) => {
              shoppingListItem.shoppingListId = listId;
              shoppingListItem.user_id = user?.id;
              shoppingListItem.name = name;
              shoppingListItem.category = category;
              shoppingListItem.note = note;
              shoppingListItem.priority = Number(priority);
              shoppingListItem.purchased = purchased;
              shoppingListItem.quantity = Number(quantity);
              shoppingListItem.unit = unit;
            });
        });
      }
    : null;

  return { addItem, shoppingItems };
};

export default useShoppingListItems;
