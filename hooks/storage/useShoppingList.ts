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
        .query(Q.where("group_id", groupID))
        .observe()
        .subscribe((results) => {
          // TODO: refactor with alternate approach
          const sortedRecords = results.sort((a, b) => {
            // First check `due_date_at` and sort by that (earliest first)
            const aDueDate = a.dueDate;
            const bDueDate = b.dueDate;
            // If both have due dates, sort by due date
            if (aDueDate && bDueDate) {
              return aDueDate < bDueDate ? -1 : aDueDate > bDueDate ? 1 : 0;
            }
            // If only one has a due date put it first
            if (aDueDate && !bDueDate) {
              return -1;
            }
            if (bDueDate && !aDueDate) {
              return 1;
            }
            // If neither has a due date sort by creation date
            return a.createdAt < b.createdAt
              ? -1
              : a.createdAt > b.createdAt
              ? 1
              : 0;
          });
          setShoppingLists(sortedRecords);
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
        dueDate,
      }: {
        groupID: string;
        name: string;
        description?: string;
        dueDate: Date | null;
      }) => {
        await database.write(async () => {
          await database
            .get<ShoppingList>(TableName.ShoppingList)
            .create((shoppingList) => {
              shoppingList.name = name;
              shoppingList.description = description || "";
              (shoppingList.user_id = user?.id),
                (shoppingList.group_id = groupID);
              if (dueDate) {
                shoppingList.dueDate = dueDate;
              }
            });
        });
      }
    : null;

  const deleteList = async (listId: string) => {
    if (listId) {
      await database.write(async () => {
        const list = await database.collections
          .get<ShoppingList>(TableName.ShoppingList)
          .find(listId);
        await list.markAsDeleted();
      });
    }
  };
  return { create, shoppingLists, shoppingListDetails, deleteList };
};

export default useShoppingList;
