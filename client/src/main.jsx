import React from 'react'
import ReactDOM from 'react-dom/client'
import { ToastContainer, toast } from 'react-toastify';
import './index.css'
import 'react-toastify/dist/ReactToastify.css';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Root from './routes/root.jsx'
import ErrorPage from './routes/not-found.jsx';
import MainLayout from './components/MainLayout.jsx'
import CreateCurrency from './routes/create-currency.jsx';
import CreateRate from './routes/create-rate.jsx';
import Currency from './routes/currency.jsx';

globalThis.domain = 'http://localhost:3000'

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Root />
      },
      {
        path: '/currency',
        element: <Currency />
      },
      {
        path: "/currency/create",
        element: <CreateCurrency />
      },
      {
        path: "/rate/create",
        element: <CreateRate />
      }
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ToastContainer
      position="bottom-center"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      // draggable
      pauseOnHover
      theme="dark"
    />
    <RouterProvider router={router} />
  </React.StrictMode>,
)
