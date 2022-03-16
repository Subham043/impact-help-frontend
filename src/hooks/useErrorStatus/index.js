import React, {useState} from 'react'
import { useNavigate, useLocation } from "react-router-dom";

function useErrosStatus() {

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/dashboard';

    const errorStatus = () =>{
        navigate('/', {state:{from:location},replace: true})
    }

    return errorStatus;
}

export default useErrosStatus