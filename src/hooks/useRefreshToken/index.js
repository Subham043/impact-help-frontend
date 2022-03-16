import axios from '../../axios'
import { useDispatch } from 'react-redux'
import { login } from '../../redux/features/userSlice'

const Index = () => {
    const dispatch = useDispatch();

    const refresh = async() => {
        try {
            const response = await axios.get('/auth/refresh-token');
            // console.log(response)
            dispatch(login({accessToken:response.data.accessToken,user:response.data.user}));
            return response.data.accessToken
        } catch (error) {
            console.log(error);
        }
    }

  return refresh;
}

export default Index;
