declare module Users {
  export interface IUserLogin {
    email: string;
    password: string;
  }

  export interface IUserRegister {
    username: string;
    email: string;
    password: string;
    phoneNumber: string;
    role: string;
  }

  export interface IAthResponse {
    _id: string;
    username: string;
    email: string;
    role: string;
    token: string;
    phoneNumber?: string;
    avatarUrl?: string;
    data: any;
  }

  // export interface IUser {
  //   _id: string;
  //   username: string;
  //   email: string;
  //   phoneNumber: string;
  //   role: string;
  //   avatarUrl: string;
  // }

  // export interface IAuthResponse {
  //   token: string;
  //   user: IUser;
  // }

  export interface IUpdateProfileData {
    name?: string;
    email?: string;
    password?: string;
  }

  export interface IEquipment {
    _id?: string;
    name: string;
    description?: string;
    totalQuantity?: number;
    status: string;
    imageUrl?: string;
  }

  export interface IBorrowRequestData {
    equipmentId: string;
    quantityBorrowed: number;
    borrowDate: string; // YYYY-MM-DD
    expectedReturnDate: string; // YYYY-MM-DD
    notes: string;
  }

  export interface IBorrowHistory {
    _id: string;
    equipment: IEquipment;
    status: string;
    borrowedAt: string;
    returnedAt?: string;
  }
}
