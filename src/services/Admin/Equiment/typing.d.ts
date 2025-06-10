declare module Equipment {
  export type EquipmentStatus = "available" | "maintenance" | "unavailable";

  export interface IEquipment {
    _id: string;
    name: string;
    description?: string;
    imageUrl?: string;
    totalQuantity: number;
    availableQuantity: number;
    status: EquipmentStatus;
    createdAt?: string;
    updatedAt?: string;
  }

  export interface IEquipmentCreate {
    name: string;
    description?: string;
    imageUrl?: string;
    totalQuantity: number;
    status?: EquipmentStatus;
  }

  export interface IEquipmentUpdate {
    name?: string;
    description?: string;
    imageUrl?: string;
    totalQuantity?: number;
    availableQuantity?: number;
    status?: EquipmentStatus;
  }
}
