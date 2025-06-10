import instanceadmin from "../../../config/axiosConfigAdmin";

import { AxiosResponse } from "axios";

export const register = async (userData: Admin.IUserRegister): Promise<Admin.IAuthResponse> => {
  const response: AxiosResponse<Admin.IAuthResponse> = await instanceadmin.post("/users/register", userData);
  return response.data;
};

export const login = async (email: string, password: string): Promise<Admin.IAuthResponse> => {
  const response: AxiosResponse<Admin.IAuthResponse> = await instanceadmin.post("/users/login", {
    email,
    password,
  });
  return response.data;
};

export const getMe = async (token: string): Promise<Admin.IGetMeResult> => {
  try {
    if (!token) {
      throw new Error("Chưa có authentication token");
    }

    const response: AxiosResponse<Admin.IUserInfo> = await instanceadmin.get("/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.data) {
      throw new Error("Không nhận được dữ liệu từ server");
    }

    return {
      success: true,
      data: response.data,
      message: "Lấy thông tin người dùng thành công",
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || "Có lỗi xảy ra khi gọi getMe",
      status: error.response?.status,
    };
  }
};
