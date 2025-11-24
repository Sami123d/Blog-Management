import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
 
import App from './App.jsx';
import MainLayout from './layouts/MainLayout.jsx';
import Homepage from './routes/Homepage.jsx';
import PostListPage from './routes/PostListPage.jsx';
import SinglePostPage from './routes/SinglePostPage.jsx';
import Write from './routes/Write.jsx';
import LoginPage from './routes/LoginPage.jsx';
import RegisterPage from './routes/RegisterPage.jsx';
import AuthProvider from "./context/AuthContext";
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
      // Wrap all other routes in ProtectedRoute
      {
        path: "/",
        element: (
          <ProtectedRoute>
            <Homepage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/posts",
        element: (
          <ProtectedRoute>
            <PostListPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/:slug",
        element: (
          <ProtectedRoute>
            <SinglePostPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/write",
        element: (
          <ProtectedRoute>
            <Write />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ToastContainer position="bottom-right" />
      </QueryClientProvider>
    </AuthProvider>
  </StrictMode>
);
