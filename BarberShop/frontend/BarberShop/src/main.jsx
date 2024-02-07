import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import RegisterBarberShop from './components/Authenticate/RegisterBarberShop.jsx'
import {LoginBarberShop} from './components/Authenticate/LoginBarberShop.jsx'
import { RegisterClient } from './components/Authenticate/RegisterClient.jsx'
import { LoginClient } from './components/Authenticate/LoginClient.jsx'
import { Home } from './components/pages/Home.jsx'
import SchedulingsOfClient from './components/pages/SchedulingsOfClient.jsx'
const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>,
    children: [
      {
        path: '/',
        element: <Home/>
      },
      {
        path: 'barbershop/register',
        element: <RegisterBarberShop/>
      },
      {
        path: 'barbershop/login',
        element: <LoginBarberShop/>
      },
      {
        path: 'client/register',
        element: <RegisterClient/>
      },
      {
        path: 'client/login',
        element: <LoginClient/>
      },
      {
        path: 'client/schedulings',
        element: <SchedulingsOfClient/>
      }
    ]
  }
])


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
