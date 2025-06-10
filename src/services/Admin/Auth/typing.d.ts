declare module Admin {
  export interface IUserRegister {
    username?: string;
    email?: string;
    password?: string;
    phoneNumber?: string;
  }

  export interface IUser {
    _id: string;
    email: string;
    name: string;
    role?: string;
  }

  // Định nghĩa kiểu dữ liệu phản hồi khi đăng ký hoặc đăng nhập thành công
  export interface IAuthResponse {
    token: string;
    user: {
      _id: string;
      name: string;
      email: string;
    };
    //nếu server trả thêm expiresIn, refreshToken, v.v. thì khai báo thêm ở đây
  }

  // Định nghĩa kiểu dữ liệu thông tin người dùng khi gọi getMe
  export interface IUserInfo {
    _id: string;
    avatarUrl: string;
    phoneNumber: string;
    username: string;
    email: string;
    role: string;
  }

  // Định nghĩa kiểu dữ liệu chung cho kết quả của getMe (có thể chứa success, message, error, status)
  export interface IGetMeResult {
    success: boolean;
    data?: IUserInfo;
    message?: string;
    error?: string;
    status?: number;
  }
}
