import { createContext, useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // new

  const login = (data) => {
    localStorage.setItem("accessToken", data.token);
    try {
      const decoded = jwtDecode(data.token);
      setUser(decoded);
    } catch (err) {
      console.log("Invalid token:", err);
      setUser(null);
      toast.error("Login failed: Invalid token");
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
    toast.success("Logged out successfully!");
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp && decoded.exp < currentTime) {
          logout();
        } else {
          setUser(decoded);
        }
      } catch (err) {
        console.log("Invalid token:", err);
        logout();
      }
    }
    setLoading(false); // finished checking
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
