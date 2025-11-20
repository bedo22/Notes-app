import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from 'sonner';
import './index.css';
import Layout from './components/layout';
import NotesList from "./pages/NoteList";
import NoteDetail from "./pages/NoteDetail";
import Auth from './pages/Auth';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './components/AuthProvider';


const router = createBrowserRouter([
  {
    path: "/auth",
    element: <Auth />
  },{
    path: "/",
    element: (
    <ProtectedRoute>
      <Layout />
    </ProtectedRoute>
    ),
    children: [
      {index: true, element: <NotesList />},
      {path: "notes/:id", element: <NoteDetail /> },
    ],
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
    <RouterProvider router={router} />
    <Toaster position="top-center" richColors />
    </AuthProvider>
  </StrictMode>,
)
