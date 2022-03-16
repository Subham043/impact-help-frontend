import axios from 'axios';
import constant from './constant'


const instance = axios.create({
    baseURL: constant.API,
    // baseURL: "https://enthousiaste-saucisson-12296.herokuapp.com/",
    headers: {
        post: {
            Accept: 'application/json'
        },
        get: {
            Accept: 'application/json'
        }
    },
    withCredentials: true,
})

export default instance;

export const axiosPrivate = axios.create({
    baseURL: constant.API,
    headers: {
        post: {
            Accept: 'application/json'
        },
        get: {
            Accept: 'application/json'
        }
    },
    withCredentials: true,
})