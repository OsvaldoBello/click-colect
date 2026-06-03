import { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("click_colect_user");
    return saved ? JSON.parse(saved) : null;
  });

  const API_BASE_URL = "http://localhost:3001/api";

  const register = async (name, email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao realizar cadastro.");
      }

      localStorage.setItem("click_colect_user", JSON.stringify(data));
      setUser(data);
      return data;
    } catch (err) {
      throw new Error(err.message || "Erro de conexão com o servidor.");
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "E-mail ou senha incorretos.");
      }

      localStorage.setItem("click_colect_user", JSON.stringify(data));
      setUser(data);
      return data;
    } catch (err) {
      throw new Error(err.message || "Erro de conexão com o servidor.");
    }
  };

  const logout = () => {
    localStorage.removeItem("click_colect_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
