import './styles.css';
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from 'react'
import axios from '../../axios'
import useLoader from '../../hooks/useLoader'
import useToast from '../../hooks/useToast'

function Index() {
    const navigate = useNavigate();
    const { state } = useLocation();

    useEffect(() => {
      showLoader()  
      if(state===null){
        navigate("/");
      }else{
        hideLoader()
      }
    
      return () => {}
    }, [])
    

    const [otp, setOtp] = useState('')
    const [otpError, setOtpError] = useState(false)
    const [otpErrorVal, setOtpErrorVal] = useState('')
    const [otpController, setOtpController] = useState(true)
    const [password, setPassword] = useState('')
    const [passwordError, setPasswordError] = useState(false)
    const [passwordErrorVal, setPasswordErrorVal] = useState('')
    const [passwordController, setPasswordController] = useState(true)
    const [cpassword, setCpassword] = useState('')
    const [cpasswordError, setCpasswordError] = useState(false)
    const [cpasswordErrorVal, setCpasswordErrorVal] = useState('')

    const [loader, showLoader, hideLoader] = useLoader();
    const [successToast, errorToast] = useToast();

    const signUpHandler = async() => {

        setOtpError(false)
        setOtpErrorVal('')
        setPasswordError(false)
        setPasswordErrorVal('')
        setCpasswordError(false)
        setCpasswordErrorVal('')

        if (otp === '') {
            setOtpError(true)
            setOtpErrorVal('Please enter your otp')
            return;
        } else if (!(/^[0-9\s]*$/.test(otp)) || otp.length > 6 || otp.length < 6) {
            setOtpError(true)
            setOtpErrorVal('Please enter a valid otp')
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

        if (cpassword === '') {
            setCpasswordError(true)
            setCpasswordErrorVal('Please enter your confirm password')
            return;
        } else if (!(/^[a-z 0-9~%.:_\@\-\/\&+=,]+$/i.test(cpassword))) {
            setCpasswordError(true)
            setCpasswordErrorVal('Please enter a valid confirm password')
            return;
        } else if (cpassword !== password) {
            setCpasswordError(true)
            setCpasswordErrorVal('Password and confirm password must be same')
            return;
        }

        showLoader()
        try {
            const response = await axios.post(`/auth/reset-password/${state.id}`, { otp,password,cpassword },);
            // console.log(response)
            successToast(response.data.message)
            setOtp('')
            setPassword('')
            setCpassword('')
            hideLoader()
            navigate("/");
        }
        catch(err) {
            // console.log(err.response);
            if(err?.response?.data?.message){
                errorToast(err?.response?.data?.message)
            }
            if(err?.response?.data?.errors?.otp){
                errorToast(err?.response?.data?.errors?.otp?.msg)
            }
            if(err?.response?.data?.errors?.password){
                errorToast(err?.response?.data?.errors?.password?.msg)
            }
            if(err?.response?.data?.errors?.cpassword){
                errorToast(err?.response?.data?.errors?.cpassword?.msg)
            }
            hideLoader()
        }

    }

    return (
        <div className="login-container">
            <h4>Reset Password</h4>
            <p className="sub-title">Enter the otp sent to your email address to reset your password.</p>
            <div className="form-container">
                <label className="form-label">OTP</label>
                <div className="input-group mb-3">
                    <input type={otpController ? `password` : `text`} className="form-control input-group-field" placeholder="Enter your otp" aria-label="Recipient's username" aria-describedby="basic-addon2" value={otp} onChange={(e) => setOtp(e.target.value)} />
                    <span className="input-group-text" id="basic-addon2" onClick={() => setOtpController(!otpController)}>{otpController ? `show` : `hide`}</span>
                </div>
                {otpError ? <p className="error mb-3">{otpErrorVal}</p> : null}
                <label className="form-label">Password</label>
                <div className="input-group mb-3">
                    <input type={passwordController ? `password` : `text`} className="form-control input-group-field" placeholder="Enter your password" aria-label="Recipient's username" aria-describedby="basic-addon2" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <span className="input-group-text" id="basic-addon2" onClick={() => setPasswordController(!passwordController)}>{passwordController ? `show` : `hide`}</span>
                </div>
                {passwordError ? <p className="error mb-3">{passwordErrorVal}</p> : null}
                <div className="mb-3">
                    <label className="form-label">Confirm Password</label>
                    <input type="password" placeholder="Enter your confirm password" className="form-control" value={cpassword} onChange={(e) => setCpassword(e.target.value)} />
                </div>
                {cpasswordError ? <p className="error mb-3">{cpasswordErrorVal}</p> : null}
                <div className="mb-3">
                    <button className="btn btn-primary custom-btn" onClick={signUpHandler}>Verify</button>
                </div>
            </div>
            {loader}
        </div>
    )
}

export default Index