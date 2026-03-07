import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useAlerts } from '../../hooks/useAlerts';

vi.useFakeTimers();

describe('useAlerts', () => {
  beforeEach(() => {
    vi.clearAllTimers();
  });

  it('should initialize with empty alerts', () => {
    const { result } = renderHook(() => useAlerts());

    expect(result.current.alerts).toEqual([]);
  });

  describe('addAlert', () => {
    it('should add a success alert', () => {
      const { result } = renderHook(() => useAlerts());

      act(() => {
        result.current.addAlert('success', 'Success message');
      });

      expect(result.current.alerts).toHaveLength(1);
      expect(result.current.alerts[0].type).toBe('success');
      expect(result.current.alerts[0].message).toBe('Success message');
    });

    it('should add multiple alerts', () => {
      const { result } = renderHook(() => useAlerts());

      act(() => {
        result.current.addAlert('success', 'First alert');
        result.current.addAlert('error', 'Second alert');
      });

      expect(result.current.alerts).toHaveLength(2);
    });

    it('should return alert ID', () => {
      const { result } = renderHook(() => useAlerts());

      let alertId: string;
      act(() => {
        alertId = result.current.addAlert('info', 'Alert message');
      });

      expect(alertId).toBeDefined();
      expect(alertId).toMatch(/^alert-\d+$/);
    });
  });

  describe('success', () => {
    it('should add a success alert', () => {
      const { result } = renderHook(() => useAlerts());

      act(() => {
        result.current.success('Success message');
      });

      expect(result.current.alerts).toHaveLength(1);
      expect(result.current.alerts[0].type).toBe('success');
      expect(result.current.alerts[0].message).toBe('Success message');
    });
  });

  describe('error', () => {
    it('should add an error alert', () => {
      const { result } = renderHook(() => useAlerts());

      act(() => {
        result.current.error('Error message');
      });

      expect(result.current.alerts).toHaveLength(1);
      expect(result.current.alerts[0].type).toBe('error');
      expect(result.current.alerts[0].message).toBe('Error message');
    });
  });

  describe('info', () => {
    it('should add an info alert', () => {
      const { result } = renderHook(() => useAlerts());

      act(() => {
        result.current.info('Info message');
      });

      expect(result.current.alerts).toHaveLength(1);
      expect(result.current.alerts[0].type).toBe('info');
    });
  });

  describe('warning', () => {
    it('should add a warning alert', () => {
      const { result } = renderHook(() => useAlerts());

      act(() => {
        result.current.warning('Warning message');
      });

      expect(result.current.alerts).toHaveLength(1);
      expect(result.current.alerts[0].type).toBe('warning');
    });
  });

  describe('removeAlert', () => {
    it('should remove alert by ID', () => {
      const { result } = renderHook(() => useAlerts());

      let alertId: string;
      act(() => {
        alertId = result.current.addAlert('success', 'Alert to remove');
      });

      expect(result.current.alerts).toHaveLength(1);

      act(() => {
        result.current.removeAlert(alertId);
      });

      expect(result.current.alerts).toHaveLength(0);
    });

    it('should not affect other alerts when removing one', () => {
      const { result } = renderHook(() => useAlerts());

      let firstId: string, secondId: string;
      act(() => {
        firstId = result.current.addAlert('success', 'First');
        secondId = result.current.addAlert('error', 'Second');
      });

      act(() => {
        result.current.removeAlert(firstId);
      });

      expect(result.current.alerts).toHaveLength(1);
      expect(result.current.alerts[0].id).toBe(secondId);
    });
  });

  describe('auto-dismiss', () => {
    it('should auto-dismiss alert after 5 seconds', () => {
      const { result } = renderHook(() => useAlerts());

      act(() => {
        result.current.success('Will be dismissed');
      });

      expect(result.current.alerts).toHaveLength(1);

      act(() => {
        vi.advanceTimersByTime(5000);
      });

      expect(result.current.alerts).toHaveLength(0);
    });

    it('should dismiss multiple alerts on their own timers', () => {
      const { result } = renderHook(() => useAlerts());

      act(() => {
        result.current.success('First alert');
        result.current.error('Second alert');
      });

      expect(result.current.alerts).toHaveLength(2);

      act(() => {
        vi.advanceTimersByTime(5000);
      });

      expect(result.current.alerts).toHaveLength(0);
    });
  });
});
