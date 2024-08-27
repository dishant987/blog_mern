import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider as MUIThemeProvider, createTheme } from '@mui/material/styles';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';
import VerifyEmail from './components/VerifyEmail';
import UserProfile from './components/UserProfile';
import Navbar from './components/Navbar';
import AddPostForm from './components/Addpost';
import { Toaster } from 'react-hot-toast';
import { CookiesProvider } from 'react-cookie';
import { useTheme } from './components/Themecontext';
import AllPost from './components/allpost/AllPost';
import PostView from './components/allpost/PostView';
import UserPost from './components/allpost/UserPost';
import EditPost from './components/allpost/EditPost';

// Layout Component with Navbar
const Layout = () => (
  <>
    <Navbar />
    <Outlet /> {/* Renders the matched route's component */}
  </>
);

const App = () => {
  const { mode } = useTheme(); // Access the theme mode from ThemeContext
  const defaultTheme = createTheme({ palette: { mode } });

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />, // Use the Layout for all routes
      children: [
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
        {
          path: "/addpost",
          element: <AddPostForm />,
        },
        {
          path: "/allpost",
          element:<AllPost/>,
        },
        {
          path: "/post/:id",
          element:<PostView/>,
        },
        {
          path: "/userpost",
          element:<UserPost/>,
        },
        {
          path: "/editpost/:postid",
          element:<EditPost/>,
        },
      ],
    },
  ]);

  return (
    <MUIThemeProvider theme={defaultTheme}>
      <CookiesProvider>
        <CssBaseline />
        <RouterProvider router={router}>
          
        </RouterProvider>
      </CookiesProvider>
    </MUIThemeProvider>
  );
};

export default App;
