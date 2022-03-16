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
    const [passwordController, setPasswordController] = useState(true)

    const [loader, showLoader, hideLoader] = useLoader();
    const [successToast, errorToast] = useToast();

    const signUpHandler = async() => {

        setOtpError(false)
        setOtpErrorVal('')

        if (otp === '') {
            setOtpError(true)
            setOtpErrorVal('Please enter your otp')
            return;
        } else if (!(/^[0-9\s]*$/.test(otp)) || otp.length > 6 || otp.length < 6) {
            setOtpError(true)
            setOtpErrorVal('Please enter a valid otp')
            return;
        }

        showLoader()
        try {
            const response = await axios.post(`/auth/verify/${state.id}`, { otp },);
            // console.log(response)
            successToast(response.data.message)
            setOtp('')
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
            hideLoader()
        }

    }

    return (
        <div className="login-container">
            <h4>Verify Email Address</h4>
            <p className="sub-title">Enter the otp sent to your email address.</p>
            <div className="form-container">
                <label className="form-label">OTP</label>
                <div className="input-group mb-3">
                    <input type={passwordController ? `password` : `text`} className="form-control input-group-field" placeholder="Enter your otp" aria-label="Recipient's username" aria-describedby="basic-addon2" value={otp} onChange={(e) => setOtp(e.target.value)} />
                    <span className="input-group-text" id="basic-addon2" onClick={() => setPasswordController(!passwordController)}>{passwordController ? `show` : `hide`}</span>
                </div>
                {otpError ? <p className="error mb-3">{otpErrorVal}</p> : null}
                <div className="mb-3">
                    <button className="btn btn-primary custom-btn" onClick={signUpHandler}>Verify</button>
                </div>
            </div>
            {loader}
        </div>
    )
}

export default Index