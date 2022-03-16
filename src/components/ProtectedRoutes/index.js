import React from 'react'
import { useLocation, Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectUser } from '../../redux/features/userSlice'
import PageNotFound from '../../pages/PageNotFound'

const Index = ({ allowedRoles }) => {
  const user = useSelector(selectUser);
  const location = useLocation();
  return (
    allowedRoles.includes(user?.user?.userType)
      ? <Outlet />
      : user !== null
        ? <PageNotFound />
        : <Navigate to="/" state={{ from: location }} replace />
  )
}

export default Index;
