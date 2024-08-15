import { Model, Relation } from "@nozbe/watermelondb";
import { children, date, readonly, text } from "@nozbe/watermelondb/decorators";
import { TableName } from "../schema";
import GroupMember from "./GroupMember";

export default class Group extends Model {
  static table = TableName.Groups;
  static associations = {
    [TableName.GroupMembers]: {
      type: "has_many" as const,
      foreignKey: "group_id",
    },
  };

  @text("owner_id") owner_id: string;
  @text("name") name: string;
  @text("description") description: string;
  @readonly @date("created_at") createdAt: Date;
  @readonly @date("updated_at") updatedAt: Date;

  @children(TableName.GroupMembers) members!: Relation<GroupMember>;
}
