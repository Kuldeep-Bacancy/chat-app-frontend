import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'

function PublicLayout({ children }) {
  const navigate = useNavigate();
  const authStatus = useSelector(state => state.authentication.isAuthenticated)

  useEffect(() => {
    if (authStatus === true){
      navigate('/chats')
    }
  }, [authStatus, navigate])
  return children
}

export default PublicLayout