import './styles.css'
import logo from '../../assets/images/logo.png'
import { useSelector } from 'react-redux'
import { selectUser } from '../../redux/features/userSlice'
import { useLocation, useNavigate } from 'react-router-dom'

export default function Index() {
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const location = useLocation();

  const goBackHandler =() => {
    let routeTo;
    if(user!==null){
      routeTo = user.user.userType===1 ? '/admin/dashboard' : '/dashboard';
    }else{
      routeTo = '/'
    }
    const from = location.state?.from?.pathname || routeTo;
    navigate(from, {replace: true})
  }

  return (
    <div className="outer-404-container">
      <div className="container inner-404-container">
        <img src={logo} alt="" />
        <h3>404 Page Not Found !!</h3>
        <button className="btn btn-primary custom-btn" onClick={goBackHandler} >Go Back</button>
      </div>
    </div>
  )
}
