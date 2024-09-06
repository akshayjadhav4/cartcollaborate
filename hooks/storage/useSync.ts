import { SyncDatabaseChangeSet, synchronize } from "@nozbe/watermelondb/sync";
import { supabase } from "@/supabase";
import database from "@/DB";

const useSync = () => {
  const trigger = async (forceSync = true) => {
    await synchronize({
      database,
      pullChanges: async ({ lastPulledAt, schemaVersion, migration }) => {
        const { data, error } = await supabase.rpc("pullv2", {
          last_pulled_at: forceSync ? 0 : lastPulledAt,
        });

        if (error) {
          throw new Error("[🍉] Sync Pull Changes ⛔️  ".concat(error.message));
        }

        const { changes, timestamp } = data as {
          changes: SyncDatabaseChangeSet;
          timestamp: number;
        };
        return { changes: changes, timestamp: timestamp };
      },
      pushChanges: async ({ changes, lastPulledAt }) => {
        const { error } = await supabase.rpc("push", { changes });

        if (error) {
          throw new Error("[🍉] Sync Push Changes ⛔️ ".concat(error.message));
        }
      },
      sendCreatedAsUpdated: true,
    });
  };

  const reset = async () => {
    await database.write(async () => {
      // permanently destroys ALL records stored in the database, and sets up empty database
      await database.unsafeResetDatabase();
      console.log("[🍉] Reset DB");
    });
  };

  return { trigger, reset };
};

export default useSync;
