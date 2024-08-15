import { Model } from "@nozbe/watermelondb";
import { date, readonly, relation, text } from "@nozbe/watermelondb/decorators";
import { TableName } from "../schema";
import ShoppingList from "./ShoppingList";

export enum Priority {
  Optional = "optional",
  Recommended = "recommended",
  Essential = "essential",
}

export default class ShoppingListItem extends Model {
  static table = TableName.ShoppingListItem;
  static associations = {
    [TableName.ShoppingList]: {
      type: "belongs_to" as const,
      key: "shopping_list_id",
    },
  };

  @text("shopping_list_id") shoppingListId: string;
  @text("user_id") user_id: string;
  @text("name") name: string;
  @text("category") category: string;
  @text("note") note: string;
  @text("priority") priority: string;
  @text("quantity") quantity: number;
  @text("is_purchased") purchased: boolean;

  @readonly @date("created_at") createdAt: Date;
  @readonly @date("updated_at") updatedAt: Date;

  @relation(TableName.ShoppingList, "shopping_list_id")
  shopping_list: ShoppingList;
}
