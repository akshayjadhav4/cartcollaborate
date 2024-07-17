import { Model, Relation } from "@nozbe/watermelondb";
import { TableName } from "../schema";
import {
  date,
  field,
  readonly,
  relation,
} from "@nozbe/watermelondb/decorators";
import Group from "./Group";

export enum GroupRole {
  Owner = "owner",
  Member = "Member",
}

export default class GroupMember extends Model {
  static table = TableName.GroupMembers;
  static associations = {
    [TableName.Groups]: { type: "belongs_to" as const, key: "group_id" },
  };

  @field("group_id") group_id!: string;
  @field("user_id") user_id!: string;
  @field("role") role!: string;
  @readonly @date("joined_at") joinedAt!: Date;

  @relation(TableName.Groups, "group_id") group: Relation<Group>;
}
