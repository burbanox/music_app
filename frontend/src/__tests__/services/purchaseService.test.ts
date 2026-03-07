import { describe, it, expect, vi, beforeEach } from 'vitest';
import { purchaseService } from '../../services/purchaseService';

vi.mock('../../api/client', () => ({
  apiClient: vi.fn(),
}));

import { apiClient } from '../../api/client';

describe('purchaseService', () => {
  const mockPurchaseResponse = {
    message: 'Purchase completed successfully',
    invoice_id: 456,
    invoice_line_id: 789,
    track_id: 1,
    customer_id: 123,
    total: 9.99,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('purchase', () => {
    it('should successfully purchase a track', async () => {
      vi.mocked(apiClient).mockResolvedValueOnce(mockPurchaseResponse);

      const result = await purchaseService.purchase({
        track_id: 1,
        customer_id: 123,
      });

      expect(result).toEqual(mockPurchaseResponse);
    });

    it('should call apiClient with correct endpoint and method', async () => {
      vi.mocked(apiClient).mockResolvedValueOnce(mockPurchaseResponse);

      await purchaseService.purchase({
        track_id: 1,
        customer_id: 123,
      });

      expect(apiClient).toHaveBeenCalledWith('/api/v1/purchases', {
        method: 'POST',
        body: {
          track_id: 1,
          customer_id: 123,
        },
      });
    });

    it('should handle purchase with different track IDs', async () => {
      const customResponse = {
        ...mockPurchaseResponse,
        track_id: 999,
        invoice_id: 100,
      };
      vi.mocked(apiClient).mockResolvedValueOnce(customResponse);

      const result = await purchaseService.purchase({
        track_id: 999,
        customer_id: 123,
      });

      expect(result.track_id).toBe(999);
      expect(result.invoice_id).toBe(100);
    });

    it('should return invoice and invoice_line IDs', async () => {
      vi.mocked(apiClient).mockResolvedValueOnce(mockPurchaseResponse);

      const result = await purchaseService.purchase({
        track_id: 1,
        customer_id: 123,
      });

      expect(result).toHaveProperty('invoice_id');
      expect(result).toHaveProperty('invoice_line_id');
      expect(result.invoice_id).toBe(456);
      expect(result.invoice_line_id).toBe(789);
    });
  });
});
