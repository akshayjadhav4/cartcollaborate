import { Database } from "@nozbe/watermelondb";
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";

import schema from "./schema";
import migrations from "./migrations";
import AuthSession from "./model/AuthSession";
import Group from "./model/Group";
import GroupMember from "./model/GroupMember";

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
  modelClasses: [AuthSession, Group, GroupMember],
});

export default database;
