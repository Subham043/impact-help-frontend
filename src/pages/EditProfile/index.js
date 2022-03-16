import './styles.css'
import { useEffect, useState } from 'react'
import 'rc-slider/assets/index.css';
import InnerDashboardLayout from '../../layouts/InnerDashboardLayout'
import DashboardHeader from '../../components/DashboardHeader'
import useLoader from '../../hooks/useLoader'
import useToast from '../../hooks/useToast'
import useErrorStatus from '../../hooks/useErrorStatus'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'



const Index = () => {

    const [name, setName] = useState('')
    const [nameError, setNameError] = useState(false)
    const [nameErrorVal, setNameErrorVal] = useState('')
    const [phone, setPhone] = useState('')
    const [phoneError, setPhoneError] = useState(false)
    const [phoneErrorVal, setPhoneErrorVal] = useState('')
    const [email, setEmail] = useState('')

    const [loader, showLoader, hideLoader] = useLoader();
    const [successToast, errorToast] = useToast();
    const axiosPrivate = useAxiosPrivate();
    const errorStatus = useErrorStatus();

    useEffect(() => {

        let isMounted = true;

        isMounted && getUserData();
        return () => isMounted = false;
    }, [])

    const getUserData = async () => {
        showLoader()
        try {
            const response = await axiosPrivate.get(`/auth/view-profile`);
            // console.log(response)
            setName(response?.data?.data?.name)
            setPhone(response?.data?.data?.phone)
            setEmail(response?.data?.data?.email)
            hideLoader()
        } catch (err) {
            console.log(err.response);
            hideLoader()
            if(err?.response?.status === 403 || err?.response?.status === 401){
                errorStatus()
            }
            if (err?.response?.data?.message) {
                errorToast(err?.response?.data?.message)
            }

        }
    }


    const profileUpdateHandler = async () => {

        setNameError(false)
        setNameErrorVal('')
        setPhoneError(false)
        setPhoneErrorVal('')

        if (name === '') {
            setNameError(true)
            setNameErrorVal('Please enter your name')
            return;
        } else if (!(/^[a-zA-Z\s]*$/.test(name))) {
            setNameError(true)
            setNameErrorVal('Please enter a valid name')
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

        showLoader()
        try {

            const response = await axiosPrivate.post('/auth/update-profile', { name,phone },);
            // console.log(response)
            successToast(response.data.message)

        } catch (err) {
            console.log(err.response);
            if(err?.response?.status === 403 || err?.response?.status === 401){
                errorStatus()
            }
            if (err?.response?.data?.message) {
                errorToast(err?.response?.data?.message)
            }
            if (err?.response?.data?.errors?.name) {
                errorToast(err?.response?.data?.errors?.name?.msg)
            }
            if (err?.response?.data?.errors?.phone) {
                errorToast(err?.response?.data?.errors?.phone?.msg)
            }

        }
        finally {
            hideLoader()
        }

    }



    return (
        <InnerDashboardLayout>
            <DashboardHeader name="Edit Profile" />
            <div className="main-dashboard-content-form-data">
                <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input type="text" placeholder="Enter your name" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                {nameError ? <p className="error mb-3">{nameErrorVal}</p> : null}
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" placeholder="Enter your email" className="form-control" defaultValue={email} readOnly={true} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Phone</label>
                    <input type="text" placeholder="Enter your phone number" className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                {phoneError ? <p className="error mb-3">{phoneErrorVal}</p> : null}
                
                <div className="mt-5 mb-3">
                    <button className="btn btn-primary custom-btn" onClick={profileUpdateHandler}>Submit</button>
                </div>
            </div>
            {loader}
            
        </InnerDashboardLayout>
    )
}

export default Index;
