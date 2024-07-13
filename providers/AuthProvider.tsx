import { useRouter } from "expo-router";
import React, { useState } from "react";

export const AuthContext = React.createContext<{
  signIn: (email: string | null, password: string | null) => void;
  signUp: (
    displayName: string,
    email: string | null,
    password: string | null
  ) => void;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
}>({
  signIn: () => null,
  signUp: () => null,
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
        signIn: (email, password) => {
          setSession(email);
          replace("/(app)");
        },
        signUp: (displayName, email, password) => {
          setSession(email);
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
