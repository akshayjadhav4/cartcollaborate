import { SyncDatabaseChangeSet, synchronize } from "@nozbe/watermelondb/sync";
import { supabase } from "@/supabase";
import database from "@/DB";

const useSync = () => {
  const trigger = async () => {
    await synchronize({
      database,
      pullChanges: async ({ lastPulledAt, schemaVersion, migration }) => {
        const { data, error } = await supabase.rpc("pull", {
          last_pulled_at: lastPulledAt,
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
      sendCreatedAsUpdated: false,
    });
  };

  return { trigger };
};

export default useSync;
