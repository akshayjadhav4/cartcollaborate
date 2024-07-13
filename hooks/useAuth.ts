import { AuthContext } from "@/providers/AuthProvider";
import React from "react";

export function useAuth() {
  const value = React.useContext(AuthContext);
  return value;
}
