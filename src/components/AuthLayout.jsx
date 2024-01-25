import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import Loader from './others/Loader';

function AuthLayout({ children }) {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const authStatus = useSelector(state => state.authentication.isAuthenticated)

  useEffect(() => {
    if (authStatus === false) {
      navigate('/login')
    }
    setLoader(false)
  }, [authStatus, navigate])

  return (
    loader ? <Loader/> : <>{children}</>
  )
}

export default AuthLayout