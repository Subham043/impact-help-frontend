import { toast } from 'react-toastify';

export default function Index() {

    const successToast = (message) => {
        toast.success(message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            toastId: new Date()
          });
    }

    const errorToast = (message) => {
        toast.error(message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            toastId: new Date()
          });
    }
    return [
        (msg) => successToast(msg),
        (msg) => errorToast(msg),
    ]
}