import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (email, password) => {
    if (email === "eya" && password === "aya11") {
      setUser({ role: "client" });
      return "client";
    }
    if (email === "admin@gmail.com" && password === "admin123") {
      setUser({ role: "admin" });
      return "admin";
    }
    return null;
  };

  return (
    <AuthContext.Provider value={{ user, login }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);