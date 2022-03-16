import './style.css';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from 'react'
import axios from '../../axios'
import useLoader from '../../hooks/useLoader'
import useToast from '../../hooks/useToast'
import {useDispatch, useSelector} from 'react-redux'
import {selectUser, login} from '../../redux/features/userSlice'

function Index() {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const navigate = useNavigate();
    const location = useLocation();
    // const routeTo = user?.user?.userType==1 ? '/admin/dashboard' : '/dashboard';
    // const from = location.state?.from?.pathname || routeTo;

    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState(false)
    const [emailErrorVal, setEmailErrorVal] = useState('')
    const [password, setPassword] = useState('')
    const [passwordError, setPasswordError] = useState(false)
    const [passwordErrorVal, setPasswordErrorVal] = useState('')
    const [passwordController, setPasswordController] = useState(true)

    const [loader, showLoader, hideLoader] = useLoader();
    const [successToast, errorToast] = useToast();

    const signInHandler = async() => {

        setEmailError(false)
        setEmailErrorVal('')
        setPasswordError(false)
        setPasswordErrorVal('')

        if (email === '') {
            setEmailError(true)
            setEmailErrorVal('Please enter your email')
            return;
        } else if (!(/^([A-Z|a-z|0-9](\.|_){0,1})+[A-Z|a-z|0-9]\@([A-Z|a-z|0-9])+((\.){0,1}[A-Z|a-z|0-9]){2}\.[a-z]{2,3}$/.test(email))) {
            setEmailError(true)
            setEmailErrorVal('Please enter a valid email')
            return;
        }

        if (password === '') {
            setPasswordError(true)
            setPasswordErrorVal('Please enter your password')
            return;
        } else if (!(/^[a-z 0-9~%.:_\@\-\/\&+=,]+$/i.test(password))) {
            setPasswordError(true)
            setPasswordErrorVal('Please enter a valid password')
            return;
        }

        showLoader()
        try {
            const response = await axios.post('/auth/login', { email,password },);
            // console.log(response)
            successToast(response.data.message)
            setEmail('')
            setPassword('')
            dispatch(login({accessToken:response.data.accessToken,user:response.data.user}))
            hideLoader()
            const routeTo = response.data.user.userType==1 ? '/admin/dashboard' : '/dashboard';
            const from = location.state?.from?.pathname || routeTo;
            navigate(from, {replace: true})
        }
        catch(err) {
            // console.log(err);
            if(err?.response?.data?.message){
                errorToast(err?.response?.data?.message)
            }
            if(err?.response?.data?.errors?.email){
                errorToast(err?.response?.data?.errors?.email?.msg)
            }
            if(err?.response?.data?.errors?.password){
                errorToast(err?.response?.data?.errors?.password?.msg)
            }
            hideLoader()
        }

    }

    return (
        <div className="login-container">
            <h4>Sign In</h4>
            <p className="sub-title">Enter your email and password to login.</p>
            <div className="form-container">
                <div className="mb-3">
                    <label className="form-label">Email Address</label>
                    <input type="email" placeholder="Enter your email address" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                {emailError ? <p className="error mb-3">{emailErrorVal}</p> : null}
                <label className="form-label">Password</label>
                <div className="input-group mb-3">
                    <input type={passwordController ? `password` : `text`} className="form-control input-group-field" placeholder="Enter your password" aria-label="Recipient's username" aria-describedby="basic-addon2" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <span className="input-group-text" id="basic-addon2" onClick={() => setPasswordController(!passwordController)}>{passwordController ? `show` : `hide`}</span>
                </div>
                {passwordError ? <p className="error mb-3">{passwordErrorVal}</p> : null}
                <div className="mb-3 text-right">
                    <Link to="/forgot-password" className="color-primary custom-link">Forgot password ?</Link>
                </div>
                <div className="mb-3">
                    <button className="btn btn-primary custom-btn" onClick={signInHandler}>Sign In</button>
                </div>
            </div>
            <div className="mb-3">
                <p className="sub-title">Don't have an account? <Link to="/register" className="color-primary custom-link">Create Account</Link></p>
            </div>
            {loader}
        </div>
    )
}

export default Index