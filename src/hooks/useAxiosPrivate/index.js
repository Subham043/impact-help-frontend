import { axiosPrivate } from "../../axios";
import {useEffect} from 'react'
import useRefreshToken from '../useRefreshToken'
import { useSelector } from 'react-redux'
import { selectUser } from "../../redux/features/userSlice";

const useAxiosPrivate = () => {
    const refresh = useRefreshToken();
    const user = useSelector(selectUser);

    useEffect(() => {

        const requestInterceptor = axiosPrivate.interceptors.request.use(
            config => {
                if(!config.headers['authorization']){
                    config.headers['authorization'] = `Bearer ${user?.accessToken}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );
      
        const responseInterceptor = axiosPrivate.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config;
                if((error?.response?.status === 403 || error?.response?.status === 401) && !prevRequest?.sent){
                    prevRequest.sent = true;
                    const newAccessToken = await refresh();
                    prevRequest.headers['authorization'] = `Bearer ${newAccessToken}`;
                    return axiosPrivate(prevRequest);
                }
                return Promise.reject(error);
            }
        );
    
      return () => {
          axiosPrivate.interceptors.request.eject(requestInterceptor);
          axiosPrivate.interceptors.response.eject(responseInterceptor);
      }
    }, [user,refresh])
    

    return axiosPrivate;
}

export default useAxiosPrivate;