import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider as MUIThemeProvider, createTheme } from '@mui/material/styles';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Login from './components/Login';
import SignUp from './components/SignUp';
import VerifyEmail from './components/VerifyEmail';
import UserProfile from './components/UserProfile';
import Navbar from './components/Navbar';

import { Toaster } from 'react-hot-toast';
import { CookiesProvider } from 'react-cookie';
import { useTheme } from './components/Themecontext';

const App = () => {

  const { mode } = useTheme();

  const defaultTheme = createTheme({ palette: { mode } });

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <SignUp />,
    },
    {
      path: "/profile",
      element: <UserProfile />,
    },
    {
      path: "/verifyemail",
      element: <VerifyEmail />,
    },
  ]);

  return (
    <MUIThemeProvider theme={defaultTheme}>
      <CookiesProvider>
        <CssBaseline />
        <Navbar  />
        <RouterProvider router={router} />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              borderRadius: "20px",
            }
          }}
        />
      </CookiesProvider>
      </MUIThemeProvider>
  );
};

export default App;
