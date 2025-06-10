export type BorrowRequestStatus = "pending" | "approved" | "rejected" | "borrowed" | "returned";

export interface IUser {
  _id: string;
  username: string;
  email: string;
  phoneNumber: string;
  // ...other fields
}

export interface IEquipment {
  _id: string;
  name: string;
  imageUrl: string;
  availableQuantity: number;
  // ...other fields
}

export interface IBorrowRequest {
  _id: string;
  user: IUser;
  equipment: IEquipment;
  quantityBorrowed: number;
  status: BorrowRequestStatus;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
  // ...other fields
}

export interface IManageBorrowRequestBody {
  status: "approved" | "rejected";
  adminNotes?: string;
}
