import instanceuser from "../../../config/axiosConfigUser";

// đảm bảo khi người dùng đăng nhập sẽ sử dụng được
const userApi = {
  login: async (data: Users.IUserLogin): Promise<Users.IAthResponse> => {
    const res = await instanceuser.post("/users/login", data);
    return res.data;
  },

  register: (data: Users.IUserRegister): Promise<Users.IAthResponse> => {
    return instanceuser.post("/users/register", data);
  },

  getMe: (): Promise<Users.IAthResponse> => {
    return instanceuser.get("/users/me");
  },

  updateProfile: (data: Users.IUpdateProfileData): Promise<Users.IAthResponse> => {
    return instanceuser.put("/users/profile", data);
  },

  // api thiết bị
  getEquipment: (params?: Record<string, any>): Promise<Users.IEquipment[]> => {
    return instanceuser.get("/equipment", { params });
  },

  getEquipmentById: (id: string): Promise<Users.IEquipment> => {
    return instanceuser.get(`/equipment/${id}`);
  },

  searchEquipment: (query: string): Promise<Users.IEquipment[]> => {
    return instanceuser.get("/equipment/search", {
      params: { query },
    });
  },

  // api mượn thiết bị
  getBorrowingHistory: (): Promise<Users.IBorrowHistory[]> => {
    return instanceuser.get("/borrowing/history");
  },

  createBorrowRequest: (data: Users.IBorrowRequestData): Promise<any> => {
    return instanceuser.post("/borrow", data);
  },

  cancelBorrowRequest: (id: string): Promise<any> => {
    return instanceuser.delete(`/borrowing/request/${id}`);
  },

  //Mượn thiết bị
  getMyBorrowingHistory: (): Promise<any> => {
    return instanceuser.get("/borrow/my-history");
  },

  createBorrow: (data: any): Promise<any> => {
    return instanceuser.post("/borrow", data);
  },

  getBorrowDetails: (id: string): Promise<any> => {
    return instanceuser.get(`/borrow/${id}`);
  },

  cancelBorrow: (id: string): Promise<any> => {
    return instanceuser.put(`/borrow/${id}/cancel`);
  },

  returnEquipment: (id: string): Promise<any> => {
    return instanceuser.put(`/borrow/${id}/return`);
  },
};

// ====== Export functions directly ======

export const {
  login,
  register,
  getMe,
  updateProfile,
  getEquipment,
  getEquipmentById,
  searchEquipment,
  getBorrowingHistory,
  createBorrowRequest,
  cancelBorrowRequest,
  getMyBorrowingHistory,
  createBorrow,
  getBorrowDetails,
  cancelBorrow,
  returnEquipment,
} = userApi;

export default userApi;
