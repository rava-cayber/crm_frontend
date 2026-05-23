import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';

type AppAlert = {
  message: string;
  severity: 'success' | 'info' | 'warning' | 'error';
};

const getSeverity = (message: string): AppAlert['severity'] => {
  const normalized = message.toLowerCase();

  if (normalized.includes('xatolik') || normalized.includes('error')) {
    return 'error';
  }

  if (normalized.includes('muvaffaqiyatli') || normalized.includes('saqlandi') || normalized.includes("qo'shildi")) {
    return 'success';
  }

  if (normalized.includes('iltimos') || normalized.includes('mumkin emas')) {
    return 'warning';
  }

  return 'info';
};

export const AppAlertProvider = ({ children }: { children: ReactNode }) => {
  const [appAlert, setAppAlert] = useState<AppAlert | null>(null);

  const showAlert = useCallback((message?: unknown) => {
    const alertMessage = typeof message === 'string' ? message : String(message ?? '');
    setAppAlert({
      message: alertMessage,
      severity: getSeverity(alertMessage),
    });
  }, []);

  const originalAlert = useMemo(() => window.alert.bind(window), []);

  useEffect(() => {
    window.alert = showAlert;

    return () => {
      window.alert = originalAlert;
    };
  }, [originalAlert, showAlert]);

  return (
    <>
      {children}
      <Snackbar
        open={Boolean(appAlert)}
        autoHideDuration={4500}
        onClose={() => setAppAlert(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setAppAlert(null)}
          severity={appAlert?.severity || 'info'}
          variant="filled"
          sx={{ width: '100%', fontWeight: 700 }}
        >
          {appAlert?.message}
        </Alert>
      </Snackbar>
    </>
  );
};
