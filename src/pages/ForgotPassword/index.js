import './styles.css';
import { Link, useNavigate } from "react-router-dom";
import { useState } from 'react'
import axios from '../../axios'
import useLoader from '../../hooks/useLoader'
import useToast from '../../hooks/useToast'

function Index() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState(false)
    const [emailErrorVal, setEmailErrorVal] = useState('')

    const [loader, showLoader, hideLoader] = useLoader();
    const [successToast, errorToast] = useToast();

    const signUpHandler = async() => {

        setEmailError(false)
        setEmailErrorVal('')

        if (email === '') {
            setEmailError(true)
            setEmailErrorVal('Please enter your email')
            return;
        } else if (!(/^([A-Z|a-z|0-9](\.|_){0,1})+[A-Z|a-z|0-9]\@([A-Z|a-z|0-9])+((\.){0,1}[A-Z|a-z|0-9]){2}\.[a-z]{2,3}$/.test(email))) {
            setEmailError(true)
            setEmailErrorVal('Please enter a valid email')
            return;
        }

        showLoader()
        try {
            const response = await axios.post('/auth/forgot-password', { email },);
            // console.log(response)
            successToast(response.data.message)
            setEmail('')
            hideLoader()
            navigate("/reset-password", { state: {id:response.data.id} });
        }
        catch(err) {
            // console.log(err.response);
            if(err?.response?.data?.message){
                errorToast(err?.response?.data?.message)
            }
            if(err?.response?.data?.errors?.email){
                errorToast(err?.response?.data?.errors?.email?.msg)
            }
            hideLoader()
        }

    }

    return (
        <div className="login-container">
            <h4>Forgot Password</h4>
            <p className="sub-title">Enter your registered email to reset your password.</p>
            <div className="form-container">
                <div className="mb-3">
                    <label className="form-label">Email Address</label>
                    <input type="email" placeholder="Enter your email address" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                {emailError ? <p className="error mb-3">{emailErrorVal}</p> : null}
                <div className="mb-3">
                    <button className="btn btn-primary custom-btn" onClick={signUpHandler}>Reset Password</button>
                </div>
            </div>
            <div className="mb-3">
                <p className="sub-title">Remember your password? <Link to="/" className="color-primary custom-link">Sign In</Link></p>
            </div>
            {loader}
        </div>
    )
}

export default Index