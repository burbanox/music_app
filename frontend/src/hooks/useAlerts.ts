import { useState, useCallback } from 'react';
import type { Alert, AlertType } from '../types';

let alertCounter = 0;

export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const addAlert = useCallback((type: AlertType, message: string) => {
    const id = `alert-${++alertCounter}`;
    const alert: Alert = { id, type, message };
    setAlerts((prev) => [...prev, alert]);

    setTimeout(() => {
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    }, 5000);

    return id;
  }, []);

  const removeAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const success = useCallback((msg: string) => addAlert('success', msg), [addAlert]);
  const error = useCallback((msg: string) => addAlert('error', msg), [addAlert]);
  const info = useCallback((msg: string) => addAlert('info', msg), [addAlert]);
  const warning = useCallback((msg: string) => addAlert('warning', msg), [addAlert]);

  return { alerts, addAlert, removeAlert, success, error, info, warning };
}
