import { useRouter } from "expo-router";
import React, { useState } from "react";

export const AuthContext = React.createContext<{
  signIn: () => void;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
}>({
  signIn: () => null,
  signOut: () => null,
  session: null,
  isLoading: false,
});

export function AuthProvider(props: React.PropsWithChildren) {
  const { replace } = useRouter();
  const [session, setSession] = useState<string | null>(null);
  return (
    <AuthContext.Provider
      value={{
        signIn: () => {
          setSession("User");
          replace("/(app)");
        },
        signOut: () => {
          setSession(null);
        },
        isLoading: false,
        session,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
