import './styles.css';
import { Link, useNavigate } from "react-router-dom";
import { useState } from 'react'
import axios from '../../axios'
import useLoader from '../../hooks/useLoader'
import useToast from '../../hooks/useToast'

function Index() {
    const navigate = useNavigate();

    const [name, setName] = useState('')
    const [nameError, setNameError] = useState(false)
    const [nameErrorVal, setNameErrorVal] = useState('')
    const [phone, setPhone] = useState('')
    const [phoneError, setPhoneError] = useState(false)
    const [phoneErrorVal, setPhoneErrorVal] = useState('')
    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState(false)
    const [emailErrorVal, setEmailErrorVal] = useState('')
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

        setNameError(false)
        setNameErrorVal('')
        setPhoneError(false)
        setPhoneErrorVal('')
        setEmailError(false)
        setEmailErrorVal('')
        setPasswordError(false)
        setPasswordErrorVal('')
        setCpasswordError(false)
        setCpasswordErrorVal('')

        if (name === '') {
            setNameError(true)
            setNameErrorVal('Please enter your name')
            return;
        } else if (!(/^[a-zA-Z\s]*$/.test(name))) {
            setNameError(true)
            setNameErrorVal('Please enter a valid name')
            return;
        }

        if (email === '') {
            setEmailError(true)
            setEmailErrorVal('Please enter your email')
            return;
        } else if (!(/^([A-Z|a-z|0-9](\.|_){0,1})+[A-Z|a-z|0-9]\@([A-Z|a-z|0-9])+((\.){0,1}[A-Z|a-z|0-9]){2}\.[a-z]{2,3}$/.test(email))) {
            setEmailError(true)
            setEmailErrorVal('Please enter a valid email')
            return;
        }

        if (phone === '') {
            setPhoneError(true)
            setPhoneErrorVal('Please enter your phone')
            return;
        } else if (!(/^[0-9\s]*$/.test(phone)) || phone.length > 10 || phone.length < 10) {
            setPhoneError(true)
            setPhoneErrorVal('Please enter a valid phone')
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
            const response = await axios.post('/auth/register', { name,email,phone,password,cpassword },);
            // console.log(response)
            successToast(response.data.message)
            setName('')
            setEmail('')
            setPhone('')
            setPassword('')
            setCpassword('')
            hideLoader()
            navigate("/verify-email", { state: {id:response.data.id} });
        }
        catch(err) {
            // console.log(err.response);
            if(err?.response?.data?.message){
                errorToast(err?.response?.data?.message)
            }
            if(err?.response?.data?.errors?.name){
                errorToast(err?.response?.data?.errors?.name?.msg)
            }
            if(err?.response?.data?.errors?.phone){
                errorToast(err?.response?.data?.errors?.phone?.msg)
            }
            if(err?.response?.data?.errors?.email){
                errorToast(err?.response?.data?.errors?.email?.msg)
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
            <h4>Sign Up</h4>
            <p className="sub-title">Enter the required details to register your account.</p>
            <div className="form-container">
                <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input type="text" placeholder="Enter your full name" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                {nameError ? <p className="error mb-3">{nameErrorVal}</p> : null}
                <div className="mb-3">
                    <label className="form-label">Email Address</label>
                    <input type="email" placeholder="Enter your email address" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                {emailError ? <p className="error mb-3">{emailErrorVal}</p> : null}
                <div className="mb-3">
                    <label className="form-label">Phone Number</label>
                    <input type="text" placeholder="Enter your phone number" className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                {phoneError ? <p className="error mb-3">{phoneErrorVal}</p> : null}
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
                    <button className="btn btn-primary custom-btn" onClick={signUpHandler}>Sign Up</button>
                </div>
            </div>
            <div className="mb-3">
                <p className="sub-title">Already have an account? <Link to="/" className="color-primary custom-link">Sign In</Link></p>
            </div>
            {loader}
        </div>
    )
}

export default Index