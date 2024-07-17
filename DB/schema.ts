import { appSchema, tableSchema } from "@nozbe/watermelondb";

export enum TableName {
  AuthSession = "auth_session",
  Groups = "groups",
  GroupMembers = "group_members",
}

export default appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: TableName.AuthSession,
      columns: [{ name: "session", type: "string" }],
    }),
    tableSchema({
      name: TableName.Groups,
      columns: [
        { name: "owner_id", type: "string", isIndexed: true },
        { name: "name", type: "string" },
        { name: "description", type: "string" },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),
    tableSchema({
      name: TableName.GroupMembers,
      columns: [
        { name: "group_id", type: "string", isIndexed: true },
        { name: "user_id", type: "string", isIndexed: true },
        { name: "role", type: "string" },
        { name: "joined_at", type: "number" },
      ],
    }),
  ],
});
