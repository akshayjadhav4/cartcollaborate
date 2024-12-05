import { Model } from "@nozbe/watermelondb";
import {
  date,
  field,
  readonly,
  relation,
  text,
  writer,
} from "@nozbe/watermelondb/decorators";
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
  @field("priority") priority: number;
  @field("quantity") quantity: number;
  @field("is_purchased") purchased: boolean;
  @text("unit") unit: string;

  @readonly @date("created_at") createdAt: Date;
  @readonly @date("updated_at") updatedAt: Date;

  @relation(TableName.ShoppingList, "shopping_list_id")
  shopping_list: ShoppingList;

  @writer async togglePurchased(isPurchased: boolean) {
    await this.update((listItem) => {
      listItem.purchased = isPurchased;
    });
  }

  @writer async removeItem() {
    await this.markAsDeleted();
  }
}
