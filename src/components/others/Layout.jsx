import React from 'react'
import Footer from "../Footer";
import { Outlet } from "react-router-dom";
import Header from '../Header';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ToastContainer/>
    </div>
  )
}

export default Layout