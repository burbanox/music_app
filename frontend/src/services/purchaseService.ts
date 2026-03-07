import { apiClient } from '../api/client';
import type { PurchaseRequest, PurchaseResponse } from '../types';

export const purchaseService = {
  async purchase(data: PurchaseRequest): Promise<PurchaseResponse> {
    return apiClient<PurchaseResponse>('/api/v1/purchases', {
      method: 'POST',
      body: data,
    });
  },
};
