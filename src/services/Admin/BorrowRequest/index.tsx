import instanceadmin from "../../../config/axiosConfigAdmin";

import { IBorrowRequest, IManageBorrowRequestBody } from "./typing";

// Lấy tất cả yêu cầu mượn (có thể filter theo status)
export const getAllBorrowRequests = async (token: string, status?: string): Promise<IBorrowRequest[]> => {
  const res = await instanceadmin.get<IBorrowRequest[]>(`/borrow/admin/all${status ? `?status=${status}` : ""}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Lấy chi tiết một yêu cầu mượn
export const getBorrowRequestDetail = async (token: string, requestId: string): Promise<IBorrowRequest> => {
  const res = await instanceadmin.get<IBorrowRequest>(`/borrow/admin/${requestId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Duyệt hoặc từ chối yêu cầu mượn
export const manageBorrowRequest = async (
  token: string,
  requestId: string,
  body: IManageBorrowRequestBody
): Promise<IBorrowRequest> => {
  const res = await instanceadmin.put<IBorrowRequest>(`/borrow/admin/manage/${requestId}`, body, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Xác nhận thiết bị đã được mượn
export const confirmBorrow = async (token: string, requestId: string): Promise<IBorrowRequest> => {
  const res = await instanceadmin.put<IBorrowRequest>(
    `/borrow/admin/confirm-borrow/${requestId}`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

// Xác nhận thiết bị đã được trả
export const confirmReturn = async (token: string, requestId: string): Promise<IBorrowRequest> => {
  const res = await instanceadmin.put<IBorrowRequest>(
    `/borrow/admin/confirm-return/${requestId}`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};
