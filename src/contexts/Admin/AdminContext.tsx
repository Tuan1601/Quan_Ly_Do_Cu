import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import * as adminApi from "../../services/Admin/Auth/index"; // Giả sử bạn đã tách API

// ====== Định nghĩa các kiểu dữ liệu ======
interface AuthContextType {
  currentUser: Admin.IUser | null;
  token: string;
  login: (email: string, password: string) => Promise<Admin.IAuthResponse>;
  register: (userData: Admin.IUserRegister) => Promise<Admin.IAuthResponse>;
  logout: () => void;
  isAdmin: () => boolean;
  isAuthenticated: () => boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Hook tiện ích
export const useAuthAdmin = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// ====== Props cho AuthProvider ======
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<Admin.IUser | null>(null);
  const [token, setToken] = useState<string>(localStorage.getItem("admin_token") || "");
  const [loading, setLoading] = useState<boolean>(true);

  // Đăng nhập
  const login = async (email: string, password: string): Promise<Admin.IAuthResponse> => {
    try {
      const res = await adminApi.login(email, password);
      setToken(res.token);
      setCurrentUser(res.user);
      localStorage.setItem("admin_token", res.token);
      return res;
    } catch (error) {
      console.error("Login error:", error);
      setCurrentUser(null);
      setToken("");
      localStorage.removeItem("admin_token");
      throw error;
    }
  };

  // Đăng ký
  const register = async (userData: Admin.IUserRegister): Promise<Admin.IAuthResponse> => {
    try {
      const res = await adminApi.register(userData);
      return res;
    } catch (error) {
      throw error;
    }
  };

  // Đăng xuất
  const logout = () => {
    setCurrentUser(null);
    setToken("");
    localStorage.removeItem("admin_token");
  };

  // Gọi API /me khi reload page
  useEffect(() => {
    const fetchMe = async () => {
      if (token && !currentUser) {
        try {
          const user = await adminApi.getMe(token);
          setCurrentUser(
            user.data?._id
              ? {
                  _id: user.data._id,
                  email: user.data.email,
                  name: user.data.username || "",
                  role: user.data.role || "admin",
                }
              : null
          );
        } catch {
          setCurrentUser(null);
          setToken("");
          localStorage.removeItem("admin_token");
        }
      }
      setLoading(false);
    };
    fetchMe();
  }, [token, currentUser]);

  const isAdmin = () => currentUser?.role === "admin";
  const isAuthenticated = () => !!currentUser;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        token,
        login,
        register,
        logout,
        isAdmin,
        isAuthenticated,
        loading,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
