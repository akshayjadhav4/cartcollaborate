import useSync from "@/hooks/storage/useSync";
import { useAuth } from "@/hooks/useAuth";
import React, { useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import { Spinner, Text, View } from "tamagui";

export const SyncContext = React.createContext<{
  isSyncing: boolean;
  sync: () => void;
}>({
  sync: () => null,
  isSyncing: false,
});

export function SyncProvider(props: React.PropsWithChildren) {
  const appState = useRef(AppState.currentState);
  const [isSyncing, setIsSyncing] = useState(false);
  const { user } = useAuth();
  const { trigger } = useSync();
  async function syncLocalDb() {
    try {
      setIsSyncing(true);
      if (user?.id && !isSyncing) {
        await trigger();
      }
      setIsSyncing(false);
    } catch (error) {
      setIsSyncing(false);
      console.log("[🍉] ~ syncLocalDb ~ error:", error);
    }
  }
  useEffect(() => {
    syncLocalDb();
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        syncLocalDb();
      } else if (nextAppState.match(/inactive|background/)) {
        syncLocalDb();
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return isSyncing ? (
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
