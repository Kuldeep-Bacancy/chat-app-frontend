import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../features/authSlice';
import { logoutUser } from '../services/users';
import SearchUserModal from './SearchUserModal';
import CreateGroupModal from './CreateGroupModal';
import { toast } from 'react-toastify';
import { setSelectedChat, addNotifications, setShowNotifications } from '../features/chatSlice';

function Header() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isLoggedin = useSelector(state => state.authentication.isAuthenticated)
  const notifications = useSelector(state => state.chat.notifications)
  const showNotifications = useSelector(state => state.chat.showNotifications)
  const [showModal, setShowModal] = useState(false)
  const [showGroupModal, setShowGroupModal] = useState(false)
  const [notificationsPosition, setNotificationsPosition] = useState({ top: 0, left: 0 });


  const handleLogout = async () => {
    await logoutUser()
    dispatch(logout())
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    navigate('/')
    toast.success("Logout successfully!")
  }

  const handleToggleNotifications = (event) => {
    // Calculate the position of the notifications relative to the bell icon
    const bellIconRect = event.currentTarget.getBoundingClientRect();
    const notificationsPosition = {
      top: bellIconRect.bottom + window.scrollY + 5,
      left: bellIconRect.left + window.scrollX - 180, // Adjust the left position as needed
    };

    // Set the position and toggle the visibility of notifications
    setNotificationsPosition(notificationsPosition);
    dispatch(setShowNotifications(!showNotifications))
  };

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
        {isLoggedin && (
          <>
            <span className="relative inline-block">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-white cursor-pointer mr-4" onClick={(e) => handleToggleNotifications(e)}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5" />
              </svg>
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">{notifications.length}</span>
            </span>
            {showNotifications && (
                <div className="bg-white p-2 rounded-md shadow-md absolute right-0 mt-8" style={{ top: `${notificationsPosition.top}px`, left: `${notificationsPosition.left}px` }} >
                  {
                    notifications.length > 0
                      ?
                      notifications.map((notification, index) => {
                        return (
                          <div 
                            className="text-gray-800 mb-2 cursor-pointer" 
                            key={index}
                            onClick={() => {
                              dispatch(setSelectedChat(notification.chat._id))
                              dispatch(addNotifications(notifications.filter((not) => not !== notification)))
                              dispatch(setShowNotifications(!showNotifications))
                              }
                            }
                          >
                            {
                              notification.chat.isGroupChat ? `A new message in ${notification.chat.name}` : `A new Message from ${notification.sender.username}`
                            }
                          </div>
                        )
                      })
                      :
                      <div className="text-gray-800 mb-2">No new notifications!</div>
                  }
                </div>
            )}
          </>
        )}
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