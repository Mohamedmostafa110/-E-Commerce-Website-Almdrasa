import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { authService } from "../services/auth";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getSession());

  const signup = useCallback(async (data) => {
    const u = await authService.signup(data);
    setUser(u);
    return u;
  }, []);

  const login = useCallback(async (data) => {
    const u = await authService.login(data);
    setUser(u);
    return u;
  }, []);

  const loginWithGoogle = useCallback(async () => {
    const u = await authService.loginWithGoogle();
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const updateAccount = useCallback(
    async (data) => {
      const u = await authService.updateAccount(user, data);
      setUser(u);
      return u;
    },
    [user]
  );

  const value = useMemo(
    () => ({ user, isLoggedIn: Boolean(user), signup, login, loginWithGoogle, logout, updateAccount, usesFirebase: authService.usesFirebase }),
    [user, signup, login, loginWithGoogle, logout, updateAccount]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
