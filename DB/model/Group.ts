import { Model, Query } from "@nozbe/watermelondb";
import { children, date, readonly, text } from "@nozbe/watermelondb/decorators";
import { TableName } from "../schema";
import GroupMember from "./GroupMember";
import ShoppingList from "./ShoppingList";

//https://github.com/Nozbe/WatermelonDB/blob/master/src/decorators/children/index.js#L17
// https://github.com/Nozbe/WatermelonDB/blob/master/src/decorators/relation/index.js#L23

export default class Group extends Model {
  static table = TableName.Groups;
  static associations = {
    [TableName.GroupMembers]: {
      type: "has_many" as const,
      foreignKey: "group_id",
    },
    [TableName.ShoppingList]: {
      type: "has_many" as const,
      foreignKey: "group_id",
    },
  };

  @text("owner_id") owner_id: string;
  @text("name") name: string;
  @text("description") description: string;
  @readonly @date("created_at") createdAt: Date;
  @readonly @date("updated_at") updatedAt: Date;

  @children(TableName.GroupMembers) members: Query<GroupMember>;
  @children(TableName.ShoppingList)
  shoppingLists: Query<ShoppingList>;

  async markAsDeleted() {
    await this.members.markAllAsDeleted();
    await this.shoppingLists.markAllAsDeleted();
    await super.markAsDeleted();
  }
}
