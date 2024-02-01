import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../features/authSlice';
import { logoutUser } from '../services/users';
import SearchUserModal from './SearchUserModal';
import CreateGroupModal from './CreateGroupModal';
import { toast } from 'react-toastify';


function Header() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isLoggedin = useSelector(state => state.authentication.isAuthenticated)
  const [showModal, setShowModal] = useState(false)
  const [showGroupModal, setShowGroupModal] = useState(false)

  const handleLogout = async () => {
    await logoutUser()
    dispatch(logout())
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    navigate('/')
    toast.success("Logout successfully!")
  }

  return (
    <header className="bg-gray-800 text-white p-4 sticky top-0 z-10 flex justify-between items-center">
      <h1 className="text-2xl font-bold">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `text-white hover:underline ${isActive ? "text-orange-700" : "text-gray-700"}`
          }
        >
          Chat App
        </NavLink>
      </h1>
      <div className="flex items-center">
        {
          isLoggedin &&
          <button
            className="text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-4 py-2.5 text-center me-2 mb-2"
            onClick={() => { setShowModal(true) }}
          >
            Search User
          </button>
        }
        {
          showModal && <SearchUserModal setShowModal={setShowModal} />
        }
        {
          isLoggedin && 
          <button
            className="text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-4 focus:ring-yellow-300 font-medium rounded-full text-sm px-4 py-2.5 text-center me-2 mb-2"
            onClick={() => { setShowGroupModal(true) }}
          >
            Create Group
          </button>
        }
        
        {
          showGroupModal && <CreateGroupModal setShowGroupModal={setShowGroupModal} />
        }

        {isLoggedin && (
          <button
            className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
            onClick={handleLogout}
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;