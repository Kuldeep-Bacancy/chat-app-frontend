import React from 'react'
import ReactDOM from 'react-dom/client'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import './index.css'
import Layout from "./components/others/Layout"
import RouteError from "./components/others/RouteError"
import Login from './components/Login'
import Register from './components/Register'
import ForgetPassword from './components/ForgetPassword'
import ResetPassword from './components/ResetPassword'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout />} errorElement={<RouteError />} >
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/forget-password' element={<ForgetPassword />} />
      <Route path='/reset-password' element={<ResetPassword />} />
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
