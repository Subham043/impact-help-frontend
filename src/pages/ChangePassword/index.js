import './styles.css'
import { useState } from 'react'
import 'rc-slider/assets/index.css';
import InnerDashboardLayout from '../../layouts/InnerDashboardLayout'
import DashboardHeader from '../../components/DashboardHeader'
import useLoader from '../../hooks/useLoader'
import useToast from '../../hooks/useToast'
import useErrorStatus from '../../hooks/useErrorStatus'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'



const Index = () => {

    const [oldPassword, setOldPassword] = useState('')
    const [oldPasswordError, setOldPasswordError] = useState(false)
    const [oldPasswordErrorVal, setOldPasswordErrorVal] = useState('')
    const [oldPasswordController, setOldPasswordController] = useState(true)
    const [password, setPassword] = useState('')
    const [passwordError, setPasswordError] = useState(false)
    const [passwordErrorVal, setPasswordErrorVal] = useState('')
    const [passwordController, setPasswordController] = useState(true)
    const [cpassword, setCpassword] = useState('')
    const [cpasswordError, setCpasswordError] = useState(false)
    const [cpasswordErrorVal, setCpasswordErrorVal] = useState('')

    const [loader, showLoader, hideLoader] = useLoader();
    const [successToast, errorToast] = useToast();
    const axiosPrivate = useAxiosPrivate();
    const errorStatus = useErrorStatus();


    const profileUpdateHandler = async () => {

        setOldPasswordError(false)
        setOldPasswordErrorVal('')
        setPasswordError(false)
        setPasswordErrorVal('')
        setCpasswordError(false)
        setCpasswordErrorVal('')

        if (oldPassword === '') {
            setOldPasswordError(true)
            setOldPasswordErrorVal('Please enter your current password')
            return;
        } else if (!(/^[a-z 0-9~%.:_\@\-\/\&+=,]+$/i.test(oldPassword))) {
            setOldPasswordError(true)
            setOldPasswordErrorVal('Please enter a valid current password')
            return;
        }

        if (password === '') {
            setPasswordError(true)
            setPasswordErrorVal('Please enter your new password')
            return;
        } else if (!(/^[a-z 0-9~%.:_\@\-\/\&+=,]+$/i.test(password))) {
            setPasswordError(true)
            setPasswordErrorVal('Please enter a valid new password')
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

            const response = await axiosPrivate.post('/auth/change-password', { oldPassword,password,cpassword },);
            // console.log(response)
            setOldPassword('')
            setPassword('')
            setCpassword('')
            successToast("Password Updated Successfully")

        } catch (err) {
            console.log(err.response);
            if(err?.response?.status === 403 || err?.response?.status === 401){
                errorStatus()
            }
            if (err?.response?.data?.message) {
                errorToast(err?.response?.data?.message)
            }
            if (err?.response?.data?.errors?.oldPassword) {
                errorToast(err?.response?.data?.errors?.oldPassword?.msg)
            }
            if (err?.response?.data?.errors?.password) {
                errorToast(err?.response?.data?.errors?.password?.msg)
            }
            if (err?.response?.data?.errors?.cpassword) {
                errorToast(err?.response?.data?.errors?.cpassword?.msg)
            }

        }
        finally {
            hideLoader()
        }

    }



    return (
        <InnerDashboardLayout>
            <DashboardHeader name="Change Password" />
            <div className="main-dashboard-content-form-data">
                <label className="form-label">Current Password</label>
                <div className="input-group mb-3">
                    <input type={oldPasswordController ? `password` : `text`} className="form-control input-group-field" placeholder="Enter your current password" aria-label="Recipient's username" aria-describedby="basic-addon2" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                    <span className="input-group-text" id="basic-addon2" onClick={() => setOldPasswordController(!oldPasswordController)}>{oldPasswordController ? `show` : `hide`}</span>
                </div>
                {oldPasswordError ? <p className="error mb-3">{oldPasswordErrorVal}</p> : null}
                <label className="form-label">New Password</label>
                <div className="input-group mb-3">
                    <input type={passwordController ? `password` : `text`} className="form-control input-group-field" placeholder="Enter your new password" aria-label="Recipient's username" aria-describedby="basic-addon2" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <span className="input-group-text" id="basic-addon2" onClick={() => setPasswordController(!passwordController)}>{passwordController ? `show` : `hide`}</span>
                </div>
                {passwordError ? <p className="error mb-3">{passwordErrorVal}</p> : null}
                <div className="mb-3">
                    <label className="form-label">Confirm Password</label>
                    <input type="password" placeholder="Enter your confirm password" className="form-control" value={cpassword} onChange={(e) => setCpassword(e.target.value)} />
                </div>
                {cpasswordError ? <p className="error mb-3">{cpasswordErrorVal}</p> : null}
                
                <div className="mt-5 mb-3">
                    <button className="btn btn-primary custom-btn" onClick={profileUpdateHandler}>Submit</button>
                </div>
            </div>
            {loader}
            
        </InnerDashboardLayout>
    )
}

export default Index;
