import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectUser } from '../../redux/features/userSlice'

const Index = () => {
  const user = useSelector(selectUser);
  return (
    user === null
      ? <Outlet />
      : <Navigate to={user?.user?.userType === 1 ? '/admin/dashboard' : '/dashboard'} />
  )
}

export default Index;
