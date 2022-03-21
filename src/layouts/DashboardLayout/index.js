import { Outlet, Link, NavLink } from "react-router-dom"
import './styles.css'
import logo from '../../assets/images/logo.png'
import avatar from '../../assets/images/avatar.png'
import { Dropdown } from 'react-bootstrap';
import { IoNotificationsOutline } from "react-icons/io5";
import menus from './menu'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useLoader from '../../hooks/useLoader'
import useToast from '../../hooks/useToast'
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux'
import { logout } from '../../redux/features/userSlice'
import { useCallback } from 'react'
import { useEffect, useState } from 'react'
import useErrorStatus from '../../hooks/useErrorStatus'
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";

function Index() {

    const axiosPrivate = useAxiosPrivate();
    const [loader, showLoader, hideLoader] = useLoader();
    const [successToast, errorToast] = useToast();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const errorStatus = useErrorStatus();
    const [notification, setNotification] = useState([])
    const [displaySideNav, setDisplaySideNav] = useState(false)

    const logoutHandler = useCallback(async () => {
        showLoader()
        try {
            const response = await axiosPrivate.get(`/auth/logout`);
            //   console.log(response.data)
            dispatch(logout())
            hideLoader()
            successToast(response.data.message)
            navigate('/')
        } catch (err) {
            hideLoader()
            if (err?.response?.status === 403 || err?.response?.status === 401) {
                errorStatus()
            }
            if (err?.response?.data?.message) {
                errorToast(err?.response?.data?.message)
            }
            console.log(err)
        }
    }, [])

    useEffect(() => {
        getNotificationHandler()

        return () => { }
    }, [])


    const getNotificationHandler = useCallback(async () => {
        showLoader()
        try {
            const response = await axiosPrivate.get(`/notification/view`);
            //   console.log(response.data)
            setNotification(response.data.data)
            hideLoader()
        } catch (err) {
            hideLoader()
            if (err?.response?.status === 403 || err?.response?.status === 401) {
                errorStatus()
            }
            if (err?.response?.data?.message) {
                errorToast(err?.response?.data?.message)
            }
            console.log(err)
        }
    }, [])

    return (
        <div className="main">
            <div className="dashboard-wrapper">

                <header>
                    <div className="header-wrapper">
                        <div className="row header-row">
                            <div className="col-lg-1 col-md-1 col-sm-1">
                                <button className="hamMenu"><AiOutlineMenu onClick={() => setDisplaySideNav(!displaySideNav)} /></button>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 header-menu-div">

                                <Dropdown className="dropdown--custom--main dropdown--custom--main--notification">
                                    <Dropdown.Toggle id="dropdown-basic" className="dropdown--custom--notification">
                                        <div className="menu-dropdown--row">
                                            <IoNotificationsOutline className="avatar-dropdown" />
                                        </div>
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        {notification.map((item, index) => {
                                            return (<Link className="dropdown-item" to={`/view-ticket/${item.ticketId}`} key={index}>{item.message}</Link>)
                                        })}

                                    </Dropdown.Menu>
                                </Dropdown>
                                <Dropdown className="dropdown--custom--main">
                                    <Dropdown.Toggle id="dropdown-basic" className="dropdown--custom">
                                        <div className="menu-dropdown--row">
                                            <img className="avatar-dropdown" src={avatar} alt="" />
                                        </div>
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Link className="dropdown-item" to={`/edit-profile`}>Edit Profile</Link>
                                        <Link className="dropdown-item" to={`/change-password`}>Change Password</Link>
                                        <Dropdown.Item onClick={logoutHandler}>Logout</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                </header>
                <section className="main-section">
                    <div className="section-wrapper">
                        <div className="row section-row">
                            <div className="col-lg-3 col-md-4 col-sm-12 section-menu-col" style={displaySideNav ? {display:'block'}:{display:'none'}}>
                                <div className="section-menu-div">
                                    {/* <div className="section-logo-img-container">
                                        <img src={logo} alt="logo" />
                                    </div> */}
                                    <div className="section-logo-img-mob-container">
                                        <img src={logo} alt="logo" />
                                        <button><AiOutlineClose onClick={()=>setDisplaySideNav(!displaySideNav)} /></button>
                                    </div>
                                    {menus.map((item, index) => <NavLink key={index} to={item.link} className={({ isActive }) => { return isActive ? "nav--menu nav--menu--active" : "nav--menu" }}>{item.icon} <p>{item.name}</p></NavLink>)}

                                </div>
                            </div>
                            <div className={displaySideNav ? "col-lg-9 offset-lg-3 col-md-8 offset-md-4 col-sm-12 section-content-col" : "col-lg-12 col-md-12 col-sm-12 section-content-col" }>
                                <Outlet />
                            </div>
                        </div>
                    </div>
                </section>
                {loader}
            </div>
        </div>
    )
}

export default Index