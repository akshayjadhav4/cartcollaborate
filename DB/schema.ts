import { appSchema, tableSchema } from "@nozbe/watermelondb";

export enum TableName {
  AuthSession = "auth_session",
  Groups = "groups",
  GroupMembers = "group_members",
  ShoppingList = "shopping_list",
  ShoppingListItem = "shopping_list_item",
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
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),
    tableSchema({
      name: TableName.ShoppingList,
      columns: [
        { name: "group_id", type: "string", isIndexed: true },
        { name: "user_id", type: "string", isIndexed: true },
        { name: "name", type: "string" },
        { name: "description", type: "string" },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),
    tableSchema({
      name: TableName.ShoppingListItem,
      columns: [
        { name: "shopping_list_id", type: "string", isIndexed: true },
        { name: "user_id", type: "string", isIndexed: true },
        { name: "name", type: "string" },
        { name: "category", type: "string", isOptional: true },
        { name: "note", type: "string", isOptional: true },
        { name: "priority", type: "string", isOptional: true },
        { name: "quantity", type: "number" },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),
  ],
});
