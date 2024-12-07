import database from "@/DB";
import { TableName } from "@/DB/schema";
import useSync from "@/hooks/storage/useSync";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/supabase";
import { RealtimeChannel } from "@supabase/supabase-js";
import { usePathname } from "expo-router";
import React, { useEffect, useState } from "react";
import { AppState } from "react-native";
import { Subscription } from "rxjs";
import { debounce, Spinner, Text, View } from "tamagui";

export const SyncContext = React.createContext<{
  isSyncing: boolean;
  sync: () => void;
}>({
  sync: () => null,
  isSyncing: false,
});

export function SyncProvider(props: React.PropsWithChildren) {
  const [isSyncing, setIsSyncing] = useState(false);
  const { user } = useAuth();
  const { trigger } = useSync();
  const [queuedSync, setQueuedSync] = useState(false);
  const [isInitialSync, setisInitialSync] = useState(false);
  const pathname = usePathname();
  const [channel, setChannel] = useState<RealtimeChannel | null>();
  useEffect(() => {
    // Listen to sync event broadcast for shopping list items screen and sync changes
    if (pathname.split("/")[1] === "shopping" && !channel?.topic) {
      const channel = supabase.channel(`sync-${pathname.split("/")[2]}`, {
        config: { broadcast: { self: false } },
      });
      console.log("🚀 Created Channel", channel.topic);
      const subscription = channel
        ?.on("broadcast", { event: "sync" }, (payload) => {
          debounceSync();
        })
        .subscribe();
      console.log("🚀 Subscribed to Channel", channel.topic);
      setChannel(channel);
      return () => {
        if (subscription) {
          console.log("🚀 Unsubscribed from Channel", channel.topic);
          subscription?.unsubscribe();
          setChannel(null);
        }
      };
    }
  }, [pathname]);

  function syncLocalDb(isSyncForLoggedInUser = false) {
    if (isSyncing) {
      setQueuedSync(true); // Queue another sync if one is running
      return;
    }

    if (user?.id) {
      setIsSyncing(true);
      setisInitialSync(isSyncForLoggedInUser);
      trigger()
        .then(() => {
          setIsSyncing(false);
          setisInitialSync(false);
          if (queuedSync) {
            setQueuedSync(false);
            debounceSync(); // Run the queued sync
          }
          console.log("🚀 ~ .then ~ channel:", channel?.topic);
          if (channel) {
            channel
              ?.send({
                type: "broadcast",
                event: "sync",
                payload: { message: "Sync List Items" },
              })
              .then((value) => {
                console.log("🚀 Send broadcast", value);
              })
              .catch((error) => {
                console.log("🚀 Failed to send broadcast", error);
              });
          }
        })
        .catch((error) => {
          setIsSyncing(false);
          setisInitialSync(false);
          console.log("[🍉] ~ syncLocalDb ~ error:", error);
        });
    }
  }

  /**
   * Getting warning on multiple change due to multiple sync calls.
   * Diagnostic error: [Sync] Concurrent synchronization is not allowed.
   */
  const debounceSync = debounce(syncLocalDb, 900);

  // sync on Login
  useEffect(() => {
    syncLocalDb(true);
  }, [user?.id]);

  // sync between AppState change
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      console.log("[📲] ~ subscription ~ nextAppState:", nextAppState);
      syncLocalDb();
    });
    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    let subscription: Subscription;
    if (user?.id) {
      subscription = database
        .withChangesForTables([
          TableName.Groups,
          TableName.GroupMembers,
          TableName.ShoppingList,
          TableName.ShoppingListItem,
        ])
        .subscribe({
          next(value) {
            const nonSyncedChanges = value?.filter(
              (v) => v.record.syncStatus !== "synced" // 'synced' | 'created' | 'updated' | 'deleted' | 'disposable'
            );

            // if local changes then sync
            if (!!nonSyncedChanges?.length) {
              debounceSync();
            }
          },
        });
    }
    return () => {
      subscription?.unsubscribe();
    };
  }, [database, user?.id]);

  return isSyncing && isInitialSync ? (
    <View
      backgroundColor={"$background"}
      flex={1}
      alignItems="center"
      justifyContent="center"
    >
      <Spinner color={"$green11"} size="small" />
      <Text mt="$5">Connecting the dots... Almost there!</Text>
    </View>
  ) : (
    <SyncContext.Provider
      value={{
        isSyncing,
        sync: syncLocalDb,
      }}
    >
      {props.children}
    </SyncContext.Provider>
  );
}
