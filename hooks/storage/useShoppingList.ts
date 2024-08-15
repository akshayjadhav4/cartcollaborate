import database from "@/DB";
import { useAuth } from "../useAuth";
import { useEffect, useState } from "react";
import { TableName } from "@/DB/schema";
import { Q } from "@nozbe/watermelondb";
import ShoppingList from "@/DB/model/ShoppingList";

const useShoppingList = ({
  groupID,
  shoppingListID,
}: {
  groupID?: string;
  shoppingListID?: string;
}) => {
  const { user } = useAuth();
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[] | null>(
    null
  );
  const [shoppingListDetails, setShoppingListDetails] =
    useState<ShoppingList | null>(null);

  useEffect(() => {
    if (groupID) {
      const subscription = database.collections
        .get<ShoppingList>(TableName.ShoppingList)
        .query(Q.where("group_id", groupID), Q.sortBy("created_at", Q.desc))
        .observe()
        .subscribe((results) => {
          setShoppingLists(results);
        });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [groupID]);

  useEffect(() => {
    if (shoppingListID) {
      const subscription = database.collections
        .get<ShoppingList>(TableName.ShoppingList)
        .query(Q.where("id", shoppingListID))
        .observe()
        .subscribe(async (results) => {
          setShoppingListDetails(results?.[0] || null);
        });
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [shoppingListID]);

  const create = user
    ? async ({
        groupID,
        name,
        description,
      }: {
        groupID: string;
        name: string;
        description?: string;
      }) => {
        await database.write(async () => {
          await database
            .get<ShoppingList>(TableName.ShoppingList)
            .create((shoppingList) => {
              shoppingList.name = name;
              shoppingList.description = description || "";
              (shoppingList.user_id = user?.id),
                (shoppingList.group_id = groupID);
            });
        });
      }
    : null;
  return { create, shoppingLists, shoppingListDetails };
};

export default useShoppingList;
