import { Routes, Route } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout'
import DashboardLayout from './layouts/DashboardLayout'
import AdminDashboardLayout from './layouts/AdminDashboardLayout'
import Login from './pages/Login'
import Register from './pages/Register'
import EmailVerification from './pages/EmailVerification'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/AdminDashboard'
import SupportTicket from './pages/SupportTicket'
import AdminSupportTicket from './pages/AdminSupportTicket'
import NewTicket from './pages/NewTicket'
import EditTicket from './pages/EditTicket'
import ViewTicket from './pages/ViewTicket'
import AdminViewTicket from './pages/AdminViewTicket'
import AdminEditTicket from './pages/AdminEditTicket'
import Faq from './pages/Faq'
import EditProfile from './pages/EditProfile'
import ChangePassword from './pages/ChangePassword'
import PageNotFound from './pages/PageNotFound'
import ProtectedRoutes from './components/ProtectedRoutes'
import UnprotectedRoutes from './components/UnprotectedRoutes'
import PersistLogin from './components/PersistLogin'

const ROLES = {
  'User': 2,
  'Admin': 1
}

function App() {
  return (

    <Routes>
      <Route element={<PersistLogin />}>

        {/* public routes */}
        <Route element={<UnprotectedRoutes />}>
          <Route path="/" element={<AuthLayout />}>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<EmailVerification />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>
        </Route>

        {/* protected routes */}
        <Route element={<ProtectedRoutes allowedRoles={[ROLES.User]} />}>
          <Route path="/" element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/support-ticket" element={<SupportTicket />} />
            <Route path="/create-ticket" element={<NewTicket />} />
            <Route path="/edit-ticket/:id" element={<EditTicket />} />
            <Route path="/view-ticket/:id" element={<ViewTicket />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/change-password" element={<ChangePassword />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoutes allowedRoles={[ROLES.Admin]} />}>
          <Route path="/admin" element={<AdminDashboardLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/support-ticket" element={<AdminSupportTicket />} />
            <Route path="/admin/edit-ticket/:id" element={<AdminEditTicket />} />
            <Route path="/admin/view-ticket/:id" element={<AdminViewTicket />} />
            <Route path="/admin/edit-profile" element={<EditProfile />} />
            <Route path="/admin/change-password" element={<ChangePassword />} />
          </Route>
        </Route>


        {/* catch all */}
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>

  );
}

export default App;
