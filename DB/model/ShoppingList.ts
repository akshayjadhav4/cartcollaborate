import { Model, Query, Relation } from "@nozbe/watermelondb";
import {
  children,
  date,
  readonly,
  relation,
  text,
} from "@nozbe/watermelondb/decorators";
import { TableName } from "../schema";
import ShoppingListItem from "./ShoppingListItem";
import Group from "./Group";

export default class ShoppingList extends Model {
  static table = TableName.ShoppingList;
  static associations = {
    [TableName.Groups]: { type: "belongs_to" as const, key: "group_id" },
    [TableName.ShoppingListItem]: {
      type: "has_many" as const,
      foreignKey: "shopping_list_id",
    },
  };

  @text("group_id") group_id: string;
  @text("user_id") user_id: string;
  @text("name") name: string;
  @text("description") description: string;
  @date("due_date_at") dueDate: Date;
  @readonly @date("created_at") createdAt: Date;
  @readonly @date("updated_at") updatedAt: Date;

  @relation(TableName.Groups, "group_id") group: Relation<Group>;
  @children(TableName.ShoppingListItem)
  shoppingListItems: Query<ShoppingListItem>;

  async markAsDeleted() {
    await this.shoppingListItems.markAllAsDeleted();
    await super.markAsDeleted();
  }
}
