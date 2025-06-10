import instanceadmin from "../../../config/axiosConfigAdmin";

import { AxiosResponse } from "axios";

// Tạo thiết bị mới
export const createEquipment = async (
  data: Equipment.IEquipmentCreate,
  token: string
): Promise<Equipment.IEquipment> => {
  const res: AxiosResponse<Equipment.IEquipment> = await instanceadmin.post("/equipment", data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return res.data;
};

// Lấy danh sách thiết bị
export const getAllEquipment = async (): Promise<Equipment.IEquipment[]> => {
  const res: AxiosResponse<Equipment.IEquipment[]> = await instanceadmin.get("/equipment");
  return res.data;
};

// Lấy chi tiết một thiết bị
export const getEquipmentById = async (id: string): Promise<Equipment.IEquipment> => {
  const res: AxiosResponse<Equipment.IEquipment> = await instanceadmin.get(`/equipment/${id}`);
  return res.data;
};

// Cập nhật thiết bị
export const updateEquipment = async (
  id: string,
  data: Equipment.IEquipmentUpdate,
  token: string
): Promise<Equipment.IEquipment> => {
  const res: AxiosResponse<Equipment.IEquipment> = await instanceadmin.put(`/equipment/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return res.data;
};

// Xóa thiết bị
export const deleteEquipment = async (id: string, token: string): Promise<{ msg: string }> => {
  const res: AxiosResponse<{ msg: string }> = await instanceadmin.delete(`/equipment/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
