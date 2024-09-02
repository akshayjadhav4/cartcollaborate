import { supabase } from "@/supabase";
import React, { useEffect, useState } from "react";
import { AuthUser, AuthSession } from "@supabase/supabase-js";
import { Alert } from "react-native";
import useSync from "@/hooks/storage/useSync";

export const AuthContext = React.createContext<{
  signIn: (email: string | null, password: string | null) => Promise<void>;
  signUp: (
    displayName: string,
    email: string | null,
    password: string | null
  ) => Promise<void>;
  signOut: () => void;
  session?: AuthSession | null;
  user: AuthUser | null;
  isLoading: boolean;
}>({
  signIn: () => Promise.resolve(),
  signUp: () => Promise.resolve(),
  signOut: () => null,
  session: null,
  user: null,
  isLoading: false,
});

export function AuthProvider(props: React.PropsWithChildren) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { reset: resetLocalDB } = useSync();
  function reset() {
    setSession(null);
    setUser(null);
    setIsLoading(false);
  }
  async function getSession() {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error) {
      reset();
    } else {
      setSession(session);
      if (!user) {
        await getUser();
      }
    }
  }
  async function getUser() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) {
      reset();
    } else {
      setUser(user);
    }
  }
  useEffect(() => {
    if (!session) {
      setIsLoading(true);
      getSession().then(() => {
        setIsLoading(false);
      });
    }
  }, [session]);
  return (
    <AuthContext.Provider
      value={{
        signIn: async (email, password) => {
          if (email && password) {
            setIsLoading(true);
            const {
              data: { session, user },
              error,
            } = await supabase.auth.signInWithPassword({
              email,
              password,
            });
            if (error) {
              reset();
              Alert.alert(error.message);
            } else {
              setSession(session);
              setUser(user);
              setIsLoading(false);
            }
          }
        },
        signUp: async (displayName, email, password) => {
          setIsLoading(true);
          if (email && password) {
            const {
              data: { session, user },
              error,
            } = await supabase.auth.signUp({
              email,
              password,
              options: {
                data: {
                  display_name: displayName,
                },
              },
            });
            if (error) {
              reset();
              Alert.alert(error.message);
            } else {
              setSession(session);
              setUser(user);
              setIsLoading(false);
            }
          }
        },
        signOut: () => {
          supabase.auth.signOut().then(() => {
            resetLocalDB();
            reset();
          });
        },
        isLoading,
        session,
        user,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
