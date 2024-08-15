import { Database } from "@nozbe/watermelondb";
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";
import { setGenerator } from "@nozbe/watermelondb/utils/common/randomId";
import * as Crypto from "expo-crypto";

import schema from "./schema";
import migrations from "./migrations";
import AuthSession from "./model/AuthSession";
import Group from "./model/Group";
import GroupMember from "./model/GroupMember";
import ShoppingList from "./model/ShoppingList";
import ShoppingListItem from "./model/ShoppingListItem";

const adapter = new SQLiteAdapter({
  schema,
  migrations,
  dbName: "cartcollaborate",
  jsi: true,
  onSetUpError: (error) => {
    // Database failed to load -- offer the user to reload the app or log out
    console.log("DATABASE SETUP ERROR", error);
  },
});

const database = new Database({
  adapter,
  modelClasses: [
    AuthSession,
    Group,
    GroupMember,
    ShoppingList,
    ShoppingListItem,
  ],
});

export default database;

setGenerator(() => Crypto.randomUUID());
