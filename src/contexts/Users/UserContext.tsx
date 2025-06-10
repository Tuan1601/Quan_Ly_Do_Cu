import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { getMe, login as apiLogin, register as apiRegister } from "../../services/Users/Auth/index";
import { message } from "antd";

interface AuthContextType {
  user: Users.IAthResponse | null;
  setUser: React.Dispatch<React.SetStateAction<Users.IAthResponse | null>>;
  loading: boolean;
  logout: () => void;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: Users.IUserRegister) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<Users.IAthResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const logout = () => {
    localStorage.removeItem("user_token");
    setUser(null);
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await apiLogin({ email, password });
      if (!res.token) {
        message.error("Không nhận được token từ server!");
        return;
      }
      localStorage.setItem("user_token", res.token);
      const userData = await getMe();
      setUser(userData);
      message.success("Đăng nhập thành công!");
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Đăng nhập thất bại!");
      throw error;
    }
  };

  const register = async (data: Users.IUserRegister) => {
    try {
      const res = await apiRegister(data);
      message.success("Đăng ký thành công! Vui lòng đăng nhập.");
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Đăng ký thất bại!");
      throw error;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("user_token");
    if (token) {
      getMe()
        .then((userData) => {
          setUser({
            _id: userData._id,
            username: userData.username,
            email: userData.email,
            phoneNumber: userData.phoneNumber,
            role: userData.role,
            avatarUrl: userData.avatarUrl,
            token: token,
            data: userData.data,
          });
        })
        .catch(() => {
          localStorage.removeItem("user_token");
          setUser(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const value: AuthContextType = {
    user,
    setUser,
    loading,
    logout,
    isAuthenticated: !!user,
    login,
    register,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuthUser = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
