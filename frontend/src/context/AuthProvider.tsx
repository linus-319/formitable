import { useEffect, useState } from "react";

import {
  getCurrentUser,
  login as loginApi,
  logout as logoutApi,
} from "../api/auth";

import { AuthContext } from "./AuthContext";

import type { User } from "./AuthContext";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then((data) => {
        setUser(data);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  async function login(email: string, password: string) {
    await loginApi({
      email,
      password,
    });

    const user = await getCurrentUser();

    setUser(user);
  }

  async function logout() {
    await logoutApi();

    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}