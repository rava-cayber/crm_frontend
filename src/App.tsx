import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CustomThemeProvider, useThemeContext } from './ThemeContext';
import { AuthProvider, useAuth } from './AuthContext';
import Layout from './components/Layout';
import Courses from './pages/Courses';
import Teachers from './pages/Teachers';
import Groups from './pages/Groups';
import GroupDetails from './pages/GroupDetails';
import Students from './pages/Students';
import Rooms from './pages/Rooms';
import Branches from './pages/Branches';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import StudentPayments from './pages/StudentPayments';
import StudentSettings from './pages/StudentSettings';
import { AppAlertProvider } from './components/AppAlertProvider';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const MuiThemeWrapper = ({ children }: { children: React.ReactNode }) => {
  const { isDarkMode } = useThemeContext();

  const theme = useMemo(() => createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      primary: {
        main: '#8b5cf6',
      },
      secondary: {
        main: '#facc15',
      },
      background: {
        default: isDarkMode ? '#0B0E14' : '#f8fafc',
        paper: isDarkMode ? '#151921' : '#ffffff',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      button: {
        textTransform: 'none',
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            padding: '8px 16px',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: '12px',
          },
        },
      },
    },
  }), [isDarkMode]);

  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  );
};

function App() {
  return (
    <CustomThemeProvider>
      <AuthProvider>
        <MuiThemeWrapper>
        <CssBaseline />
        <AppAlertProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route 
                path="/" 
                element={
                  <PrivateRoute>
                    <Layout />
                  </PrivateRoute>
                }
              >
                <Route index element={<Navigate to="/asosiy" replace />} />
                <Route path="asosiy" element={<Dashboard />} />
                <Route path="boshqarish/kurslar" element={<Courses />} />
                <Route path="boshqarish/xonalar" element={<Rooms />} />
                <Route path="boshqarish/filiallar" element={<Branches />} />
                <Route path="oqituvchilar" element={<Teachers />} />
                <Route path="guruhlar" element={<Groups />} />
                <Route path="guruhlar/:id" element={<GroupDetails />} />
                <Route path="talabalar" element={<Students />} />
                <Route path="student/tolovlarim" element={<StudentPayments />} />
                <Route path="student/sozlamalar" element={<StudentSettings />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AppAlertProvider>
        </MuiThemeWrapper>
      </AuthProvider>
    </CustomThemeProvider>
  );
}

export default App;
