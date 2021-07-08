import React, { useState, useEffect} from 'react'
import Axios from "axios"
import '../../styles/applypage.css'

var serverURL = 'http://localhost:3001/applicants'

function ApplyPage(props) {

    const [sop, setSop] = useState('')

    const [apps, setApps] = useState(0)

    const [jobstatus, setJobStatus] = useState(0)

    const [message, setMessage] = useState('')

    useEffect(() =>{
        let isMount = true
        Axios
            .get(`${serverURL}/profile`, {
                params:{
                    email: props.uid
                }
            })
            .then(response => {
                if(response.data !== null){
                    if(isMount === true){
                        setApps(response.data.activeApplications)
                        setJobStatus(response.data.employee)
                    }
                }
            })
            return () => {isMount = false}
    }, [props.uid])

    function changeSOP(event){
        setSop(event.target.value)
    }

    function applyJob(event){
        event.preventDefault()

        Axios
            .post(`${serverURL}/apply`, {
                params:{
                    jid: props.id,
                    uid: props.uid,
                    sop: sop
                }
            })
            .then(setMessage('Application Successful!'),
            setSop(''),
            setTimeout(() =>{
                setMessage('')
            }, 4000),)
    }

    if (!jobstatus) {
        if (apps < 1) {
            return (
                <div className="applyUI">
                    <p>{message}</p>
                    <button onClick={props.switch}>Back to Dashboard</button>
                    <p>Statement of Purpose: </p>
                    <form onSubmit={applyJob}>
                        <textarea value={sop} onChange={changeSOP} maxLength="250"></textarea>
                        <br></br>
                        <button type="submit">Apply</button>
                    </form>
                </div>
            )
        }
        else {
            return (
                <div className="applyUI">
                    <button onClick={props.switch}>Back to Dashboard</button>
                    <p>You cannot have more than 10 open applications!</p>
                </div>
            )
        }
    }
    else{
        return (
            <div className="applyUI">
                <button onClick={props.switch}>Back to Dashboard</button>
                <p>You have already been accepted into a job!</p>
            </div>
        )
    }

}

export default ApplyPage;