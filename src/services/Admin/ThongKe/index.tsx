import instanceadmin from "../../../config/axiosConfigAdmin";

export interface MostBorrowedEquipment {
  _id: string;
  name: string;
  imageUrl?: string;
  totalBorrowed: number;
}

export const getMostBorrowedEquipments = async (
  token: string,
  month?: number,
  year?: number
): Promise<MostBorrowedEquipment[]> => {
  let url = "/equipment/stats/most-borrowed";
  const params: string[] = [];
  if (month) params.push(`month=${month}`);
  if (year) params.push(`year=${year}`);
  if (params.length) url += "?" + params.join("&");
  const res = await instanceadmin.get<MostBorrowedEquipment[]>(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
