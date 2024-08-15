import { Model } from "@nozbe/watermelondb";
import { children, date, readonly, text } from "@nozbe/watermelondb/decorators";
import { TableName } from "../schema";
import ShoppingListItem from "./ShoppingListItem";

export default class ShoppingList extends Model {
  static table = TableName.ShoppingList;
  static associations = {
    [TableName.ShoppingListItem]: {
      type: "has_many" as const,
      foreignKey: "shopping_list_id",
    },
  };

  @text("group_id") group_id: string;
  @text("user_id") user_id: string;
  @text("name") name: string;
  @text("description") description: string;
  @readonly @date("created_at") createdAt: Date;
  @readonly @date("updated_at") updatedAt: Date;

  @children(TableName.ShoppingListItem) shoppingListItem: ShoppingListItem;
}
