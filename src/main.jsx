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
import Chat from './components/Chat'
import Home from './components/Home'
import store from './features/store'
import { Provider } from 'react-redux'
import AuthLayout from './components/AuthLayout'
import PublicLayout from './components/PublicLayout'


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout />} errorElement={<RouteError />} >
      <Route 
        path='/' 
        element={
          <PublicLayout>
            <Home />
          </PublicLayout>
        }
      />
      <Route 
        path='/login' 
        element={
          <PublicLayout>
            <Login />
          </PublicLayout>
        } 
      />
      <Route 
        path='/register'
        element={
          <PublicLayout>
            <Register />
          </PublicLayout>
        } 
      />
      <Route 
        path='/forget-password' 
        element={
          <PublicLayout>
            <ForgetPassword />
          </PublicLayout>
        } 
      />
      <Route 
        path='/reset-password' 
        element={
          <PublicLayout>
            <ResetPassword />
          </PublicLayout>
        } 
      />
      <Route 
        path='/chats' 
        element={
          <AuthLayout>
            <Chat />
          </AuthLayout>
        }
      />
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
)
