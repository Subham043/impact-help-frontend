import { Outlet } from "react-router-dom"
import './styles.css'
import logo from '../../assets/images/logo.png'

function index() {
  return (
    <div className="main">
      <div className="container-fluid auth-wrapper">
        <div className="auth-inner-container">
          <div className="logo-img-container">
            <img src={logo} alt="logo" />
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default index