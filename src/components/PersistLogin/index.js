import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import useRefreshToken from '../../hooks/useRefreshToken'
import { useSelector } from "react-redux";
import {selectUser} from '../../redux/features/userSlice'
import Loader from '../Loader'

const Index = () => {
    const user = useSelector(selectUser);
    const refresh = useRefreshToken();
    const [loading, setLoading] = useState(true)

    useEffect(() => {

        let isMounted = true;
        
        const verifyRefreshToken = async () => {
            try {
                await refresh();
            } catch (error) {
                console.log(error);
            }
            finally {
                isMounted && setLoading(false)
            }
        }
        user===null ? verifyRefreshToken() : setLoading(false)

        return () => isMounted = false;
    }, [])

    return (
        <>
            {
                loading ? <Loader /> : <Outlet />
            }
        </>
    )

}

 export default Index;
