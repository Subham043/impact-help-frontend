import './styles.css'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useDropzone } from 'react-dropzone';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import InnerDashboardLayout from '../../layouts/InnerDashboardLayout'
import DashboardHeader from '../../components/DashboardHeader'
import useLoader from '../../hooks/useLoader'
import useToast from '../../hooks/useToast'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useErrorStatus from '../../hooks/useErrorStatus'

const baseStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    transition: 'border .3s ease-in-out'
};

const activeStyle = {
    borderColor: '#2196f3'
};

const acceptStyle = {
    borderColor: '#00e676'
};

const rejectStyle = {
    borderColor: '#ff1744'
};


const Index = () => {

    const [title, setTitle] = useState('')
    const [titleError, setTitleError] = useState(false)
    const [titleErrorVal, setTitleErrorVal] = useState('')
    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState(false)
    const [emailErrorVal, setEmailErrorVal] = useState('')
    const [issue, setIssue] = useState('')
    const [issueError, setIssueError] = useState(false)
    const [issueErrorVal, setIssueErrorVal] = useState('')
    const [description, setDescription] = useState('')
    const [descriptionError, setDescriptionError] = useState(false)
    const [descriptionErrorVal, setDescriptionErrorVal] = useState('')
    const [priority, setPriority] = useState(1)

    const [files, setFiles] = useState([]);
    const [imageError, setImageError] = useState(false)
    const [imageErrorVal, setImageErrorVal] = useState('')

    const [loader, showLoader, hideLoader] = useLoader();
    const [successToast, errorToast] = useToast();
    const axiosPrivate = useAxiosPrivate();
    const errorStatus = useErrorStatus();

    const onDrop = useCallback(acceptedFiles => {
        
        setFiles(...files,acceptedFiles.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file)
        })));
    }, []);

    
    

    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject
    } = useDropzone({
        onDrop,
        accept: 'image/jpeg, image/png',
    });

    const style = useMemo(() => ({
        ...baseStyle,
        ...(isDragActive ? activeStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
    }), [
        isDragActive,
        isDragReject,
        isDragAccept
    ]);

    const thumbs = files.map(file => (
        <div key={file.name}>
            <img
                src={file.preview}
                alt={file.name}
            />
        </div>
    ));

    // clean up
    useEffect(() => () => {
        showLoader()
        files.forEach(file => URL.revokeObjectURL(file.preview));
        hideLoader()
    }, [files]);

    const onSliderChange = useCallback((value) => {
        setPriority(value===0 ? 1 : value);
    }, [priority])

    const newTicketHandler = async() => {
        
        setTitleError(false)
        setTitleErrorVal('')
        setEmailError(false)
        setEmailErrorVal('')
        setIssueError(false)
        setIssueErrorVal('')
        setImageError(false)
        setImageErrorVal('')

        if (title === '') {
            setTitleError(true)
            setTitleErrorVal('Please enter your ticket title')
            return;
        } else if (!(/^[a-z 0-9~%.:_\@\-\/\&+=,]+$/i.test(title))) {
            setTitleError(true)
            setTitleErrorVal('Please enter a valid ticket title')
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

        if (issue === '') {
            setIssueError(true)
            setIssueErrorVal('Please enter your issue')
            return;
        } else if (!(/^[a-z 0-9~%.:_\@\-\/\&+=,]+$/i.test(issue))) {
            setIssueError(true)
            setIssueErrorVal('Please enter a valid issue')
            return;
        }

        showLoader()
        try {
            
            const formData = new FormData();
            formData.append('title', title);
            formData.append('email', email);
            formData.append('type', issue);
            formData.append('description', description);
            formData.append('priority', priority);
            files.map((item)=>{
                formData.append('upload', item);
            })
            const response = await axiosPrivate.post('/ticket/create', formData,);
            // console.log(response)
            successToast(response.data.message)
            setTitle('')
            setEmail('')
            setIssue('')
            setDescription('')
            setFiles([])
            setPriority(1)
            
        } catch (err) {
            console.log(err.response);
            if(err?.response?.status === 403 || err?.response?.status === 401){
                errorStatus()
            }
            if(err?.response?.data?.message){
                errorToast(err?.response?.data?.message)
            }
            if(err?.response?.data?.errors?.title){
                errorToast(err?.response?.data?.errors?.title?.msg)
            }
            if(err?.response?.data?.errors?.type){
                errorToast(err?.response?.data?.errors?.type?.msg)
            }
            if(err?.response?.data?.errors?.email){
                errorToast(err?.response?.data?.errors?.email?.msg)
            }
            if(err?.response?.data?.errors?.priority){
                errorToast(err?.response?.data?.errors?.priority?.msg)
            }
            if(err?.response?.data?.errors?.description){
                errorToast(err?.response?.data?.errors?.description?.msg)
            }
            if(err?.response?.data?.errors?.upload){
                errorToast(err?.response?.data?.errors?.upload?.msg)
            }
            
        }
        finally{
            hideLoader()
        }

    }



    return (
        <InnerDashboardLayout>
            <DashboardHeader name="Create New Ticket" />
            <div className="main-dashboard-content-form-data">
                <div className="mb-3">
                    <label className="form-label">Ticket Title</label>
                    <input type="text" placeholder="Enter your ticket title" className="form-control" value={title} onChange={(e)=>setTitle(e.target.value)} />
                </div>
                {titleError ? <p className="error mb-3">{titleErrorVal}</p> : null}
                <div className="mb-3">
                    <label className="form-label">Email (type in the same email id which you have enrolled for)</label>
                    <input type="email" placeholder="Enter your email" className="form-control" value={email} onChange={(e)=>setEmail(e.target.value)} />
                </div>
                {emailError ? <p className="error mb-3">{emailErrorVal}</p> : null}
                <div className="mb-3">
                    <label className="form-label">Issue Type</label>
                    <input type="email" placeholder="Enter your issue" className="form-control" value={issue} onChange={(e)=>setIssue(e.target.value)} />
                </div>
                {issueError ? <p className="error mb-3">{issueErrorVal}</p> : null}
                <div className="mb-3">
                    <label className="form-label">Description</label>
                    <CKEditor
                        editor={ClassicEditor}
                        data={description}
                        onChange={(event, editor) => {
                            const data = editor.getData();
                            setDescription(data)
                            // console.log({ event, editor, data });
                        }}
                        style={{ height: '200px' }}
                    />
                </div>
                {descriptionError ? <p className="error mb-3">{descriptionErrorVal}</p> : null}
                
                <div className="mb-5">
                    <label className="form-label">Priority</label>
                    <>
                        <Slider
                        min={1}
                        max={3}
                        value={priority}
                        onChange={onSliderChange}
                        marks={{
                            1: { style:{color:'red', fontSize:'18px', fontWeight:'bold',paddingLeft:'25px'}, label:"Low" },
                            2: { style:{color:'blue', fontSize:'18px', fontWeight:'bold'}, label:"Medium" },
                            3: { style:{color:'green', fontSize:'18px', fontWeight:'bold',paddingRight:'25px'}, label:"High" },
                        }}
                        handleStyle={{
                            border: "solid 2px #69558f",
                        }}
                        trackStyle={{
                            background: "#69558f"
                        }}
                        dotStyle={{
                            border: "solid 2px #69558f",
                        }}
                        activeDotStyle={{
                            border: "solid 2px #69558f",
                        }}
                        />
                    </>
                </div>
                <div className="mb-3">
                    <label className="form-label">Attatchment</label>

                    <section className="attachment-container">
                        <div {...getRootProps({ style })}>
                            <input {...getInputProps()} />
                            <div>Drag and drop your images here.</div>
                        </div>
                        <aside className="aside--container">
                            {files.length>0 ? <label className="form-label">Preview</label>:null}
                            <div className="preview--main--container">
                            {thumbs}
                            </div>
                        </aside>
                    </section>

                </div>
                {imageError ? <p className="error mb-3">{imageErrorVal}</p> : null}
                <div className="mt-5 mb-3">
                    <button className="btn btn-primary custom-btn" onClick={newTicketHandler}>Submit</button>
                </div>
            </div>
            {loader}
        </InnerDashboardLayout>
    )
}

export default Index;
