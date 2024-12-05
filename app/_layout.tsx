// import "../tamagui-web.css";
import { Slot, usePathname } from "expo-router";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { PortalProvider, TamaguiProvider } from "tamagui";
import { tamaguiConfig } from "../tamagui.config";
import { useColorScheme } from "@/hooks/useColorScheme";
import { AuthProvider } from "@/providers/AuthProvider";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SyncProvider } from "@/providers/SyncProvider";
import { GestureHandlerRootView } from "react-native-gesture-handler";
export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme!}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaProvider>
            <PortalProvider shouldAddRootHost>
              <AuthProvider>
                <SyncProvider>
                  <Slot />
                </SyncProvider>
              </AuthProvider>
            </PortalProvider>
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </ThemeProvider>
    </TamaguiProvider>
  );
}
