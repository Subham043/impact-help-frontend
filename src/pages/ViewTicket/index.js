import './styles.css'
import { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import 'rc-slider/assets/index.css';
import InnerDashboardLayout from '../../layouts/InnerDashboardLayout'
import DashboardHeader from '../../components/DashboardHeader'
import useLoader from '../../hooks/useLoader'
import useToast from '../../hooks/useToast'
import useErrorStatus from '../../hooks/useErrorStatus'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { useParams, useNavigate } from 'react-router-dom'
import ImageViewer from "react-simple-image-viewer";
import Table from 'react-bootstrap/Table';
import TableStatus from '../../components/TableStatus'
import TablePriority from '../../components/TablePriority'
import { AiOutlineSend } from 'react-icons/ai';
import avatar from '../../assets/images/avatar.png'
import logo from '../../assets/images/icon-logo.png'
import { useSelector } from 'react-redux'
import { selectUser } from '../../redux/features/userSlice'
import constant from '../../constant'
import io from "socket.io-client";
const socket = io('http://localhost:8081/', {
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 2000,
    reconnectionDelayMax: 3500
});




const Index = () => {

    let { id } = useParams();
    const navigate = useNavigate();
    const user = useSelector(selectUser);
    const [title, setTitle] = useState('')
    const [email, setEmail] = useState('')
    const [issue, setIssue] = useState('')
    const [description, setDescription] = useState('')
    const [priority, setPriority] = useState(1)
    const [status, setStatus] = useState(1)

    const [images, setImages] = useState([]);

    const [message, setMessage] = useState('')
    const [ticketUpdatesData, setTicketUpdatesData] = useState([])

    const [currentImage, setCurrentImage] = useState(0);
    const [isViewerOpen, setIsViewerOpen] = useState(false);

    const [loader, showLoader, hideLoader] = useLoader();
    const [successToast, errorToast] = useToast();
    const axiosPrivate = useAxiosPrivate();
    const errorStatus = useErrorStatus();

    const messagesEndRef = useRef(null)

    useEffect(() => {

        let isMounted = true;

        isMounted && getTicketData();
        isMounted && getTicketUpdateData();
        return () => isMounted = false;
    }, [id])

    const getTicketData = async () => {
        showLoader()
        try {
            const response = await axiosPrivate.get(`/ticket/view/${id}`);
            // console.log(response)
            setTitle(response?.data?.data?.title)
            setDescription(response?.data?.data?.description)
            setEmail(response?.data?.data?.email)
            setPriority(response?.data?.data?.priority)
            setIssue((response?.data?.data?.type))
            setImages(response?.data?.data?.images)
            setStatus(response?.data?.data?.status)
            hideLoader()
        } catch (err) {
            console.log(err.response);
            hideLoader()
            if (err?.response?.status === 403 || err?.response?.status === 401) {
                errorStatus()
            }
            if (err?.response?.data?.message) {
                errorToast(err?.response?.data?.message)
            }

            if (err?.response?.data?.errors?.id?.msg) {
                errorToast(err?.response?.data?.errors?.id?.msg)
                navigate('/dashboard')
            }
        }
    }

    const getTicketUpdateData = async () => {
        showLoader()
        try {
            const response = await axiosPrivate.get(`/ticket-updates/view/${id}`);
            // console.log(response)
            setTicketUpdatesData(response?.data?.data)
            hideLoader()
        } catch (err) {
            console.log(err.response);
            hideLoader()
            if (err?.response?.status === 403 || err?.response?.status === 401) {
                errorStatus()
            }
            if (err?.response?.data?.message) {
                errorToast(err?.response?.data?.message)
            }

            if (err?.response?.data?.errors?.id?.msg) {
                errorToast(err?.response?.data?.errors?.id?.msg)
                navigate('/dashboard')
            }
        }
    }


    useEffect(() => {

        socket.auth = { user: user.user };
        socket.connect();
        socket.emit("join room", id);
        return () => socket.disconnect()
    }, [id]);

    useEffect(() => {
        socket.on("connect_error", (err) => {
            console.log(err)
            socket.auth = { user: user.user };
            socket.connect();
            socket.emit("join room", id);
        });
        socket.on("recieve message", (content) => {
            // console.log(content)
            setTicketUpdatesData([...ticketUpdatesData, content])
        });
    })

    const issueName = useCallback(() => {
        return issue;
    }, [issue])




    const imageThumbs = images.map((file, index) => (
        <div key={file.id}>
            <img
                onClick={() => openImageViewer(index)}
                src={`${constant.API}uploads/${file.name}`}
                alt={file.name}
            />
        </div>
    ));

    const imageUrl = useMemo(() => images.map(file => `${constant.API}uploads/${file.name}`), [images]);

    const openImageViewer = useCallback((index) => {
        setCurrentImage(index);
        setIsViewerOpen(true);
    }, []);

    const closeImageViewer = () => {
        setCurrentImage(0);
        setIsViewerOpen(false);
    };

    useEffect(() => {
        messagesEndRef.current.scrollTo(0, messagesEndRef.current.scrollHeight);
    }, [ticketUpdatesData])

    const newTicketUpdateHandler = async (event) => {
        event.preventDefault();

        if (message === '') {
            errorToast('Please enter a message')
            return;
        }
        showLoader()
        try {

            const response = await axiosPrivate.post(`/ticket-updates/create/${id}`, { message },);
            // console.log(response)
            // successToast(response.data.message)
            notificationHandler({
                message: 'Update on Ticket ID ' + id,
                type: 1,
                seenByUser: 1,
                seenByAdmin: 0
            })
            socket.emit('send message', { roomId: id, data: response?.data?.data });
            setTicketUpdatesData([...ticketUpdatesData, response?.data?.data])
            setMessage('')

        } catch (err) {
            console.log(err.response);
            if (err?.response?.status === 403 || err?.response?.status === 401) {
                errorStatus()
            }
            if (err?.response?.data?.message) {
                errorToast(err?.response?.data?.message)
            }
            if (err?.response?.data?.errors?.message) {
                errorToast(err?.response?.data?.errors?.message?.msg)
            }
            if (err?.response?.data?.errors?.id) {
                errorToast(err?.response?.data?.errors?.id?.msg)
            }

        }
        finally {
            hideLoader()
        }
    }

    const notificationHandler = async (data) => {

        try {

            const response = await axiosPrivate.post(`/notification/create/${id}`, data,);
            // console.log(response)
            // socket.emit('send message', {roomId:id,data:response?.data?.data});

        } catch (err) {
            console.log(err.response);
            if (err?.response?.status === 403 || err?.response?.status === 401) {
                errorStatus()
            }

        }
    }



    return (
        <InnerDashboardLayout>
            <DashboardHeader name="View Ticket" link={`/edit-ticket/${id}`} routeName="Edit Ticket" />
            <div className="main-dashboard-content-form-data">

                <div className="mb-3">
                    <Table responsive>
                        <thead>
                            <tr>
                                <th>Ticket Id</th>
                                <th>Title</th>
                                <th>Email</th>
                                <th>Issue</th>
                                <th>Priority</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{id}</td>
                                <td>{title}</td>
                                <td>{email}</td>
                                <td>{issueName()}</td>
                                <td><TablePriority status={priority} /></td>
                                <td><TableStatus status={status} /></td>

                            </tr>

                        </tbody>
                    </Table>
                </div>

                {description.length > 0 ? <div className="mb-3">
                    <label className="form-label">Description</label>
                    <div dangerouslySetInnerHTML={{ __html: description }}></div>
                </div> : null}

                {images.length > 0 ? <div className="mb-3 image-exist">
                    <label className="form-label">Attatchment</label>


                    <aside className="aside--container">
                        <div className="preview--main--container">
                            {imageThumbs}
                        </div>
                    </aside>

                </div> : null}
                {description.length > 0 || images.length > 0 ? <hr /> : null}
                <div className="mb-3">
                    <h4>Updates</h4>
                    <div className="update-container">
                        <div className="update-chat-container" ref={messagesEndRef}>
                            {ticketUpdatesData.length === 0 && (<p style={{ textAlign: 'center', fontWeight: 'bold' }}>No Updates yet!!</p>)}
                            {ticketUpdatesData.length > 0 ? ticketUpdatesData?.map((item, index) => {
                                if (item.userId === user?.user?.id) {
                                    return (
                                        <div className="chat-message-container-sender" key={index}>
                                            <div className="chat-message">
                                                <p className="message">{item.message}</p>
                                                <div className="chat-info">
                                                    <img src={avatar} alt="" />
                                                    <p className="detail"><span>10/2/2022 10:20 AM</span></p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                                return (
                                    <div className="chat-message-container-reciever" key={index}>
                                        <div className="chat-message">
                                            <p className="message">{item.message}</p>
                                            <div className="chat-info">
                                                <img src={logo} alt="" />
                                                <p className="detail"><span>10/2/2022 10:20 AM</span></p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }) : null}

                        </div>
                        <form onSubmit={(event) => newTicketUpdateHandler(event)}>
                            <div className="update-chat-input-container">
                                <input type="text" placeholder="Type Here..." className="form-control" value={message} onChange={(e) => setMessage(e.target.value)} />
                                <button className="btn btn-primary custom-btn" onClick={(event) => newTicketUpdateHandler(event)}><AiOutlineSend /></button>
                            </div>
                        </form>
                    </div>
                </div>

            </div>
            {loader}
            {isViewerOpen && (
                <ImageViewer
                    src={imageUrl}
                    currentIndex={currentImage}
                    onClose={closeImageViewer}
                    disableScroll={false}
                    backgroundStyle={{
                        backgroundColor: "rgba(0,0,0,0.9)"
                    }}
                    closeOnClickOutside={true}
                />
            )}
        </InnerDashboardLayout>
    )
}

export default Index;
