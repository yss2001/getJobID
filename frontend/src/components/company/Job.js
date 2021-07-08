import React, {useState, useEffect} from 'react'
import Axios from "axios"
import Moment from "moment"
import '../../styles/jobs.css'

var serverURL = 'http://localhost:3001/recruiters'

function Decide(props){

    function handleClick(data, event){
        props.act(data)
    }

    if(props.stage === 'Applied'){
        return(
            <div>
                <button onClick={(e) => handleClick('Shortlisted', e)}>SHORTLIST</button>
                <button onClick={(e) => handleClick('Rejected', e)}>REJECT</button>
            </div>
        )
    }
    else if(props.stage === 'Shortlisted'){
        return (
            <div>
                <button onClick={(e) => handleClick('Accepted', e)}>ACCEPT</button>
                <button onClick={(e) => handleClick('Rejected', e)}>REJECT</button>
            </div>
        )
    }
}

function Job(props){


    const [details, setDetails] = useState()

    const [message, setMessage] = useState('')

    function Message(){
        if(message === '')
            return null
        
        return (
            <div className="message">
                {message}
            </div>
        )
    }


    useEffect(() => {
        let isMount = true
        Axios
            .get(`${serverURL}/applications`, {
                params:{
                    id: props.job
                }
            })
            .then(response => {
                if(response.data !== null){
                    if(isMount === true){
                        let records = response.data.filter(r => r.status !== "Rejected" && r.status !== "Accepted")
                        setDetails(records)
                    }
                }
            })
            return () => {isMount = false}
    }, [props.job])

   
    function changeDecision(data, uid, lid, cid){
        Axios
            .put(`${serverURL}/decideApp`, {
                params:{
                    data: data,
                    uid: uid,
                    lid: lid,
                    cid: cid
                }
            })
            .then(
                setMessage(data, 'ed!'),
            setTimeout(() =>{
                setMessage('')
            }, 4000))

    }
    
    if(details !== undefined){
        return(
            <div className="parent">
                <button onClick={props.switch}>Go Back</button>
                <Message className="parent"></Message>
                <h1 >Applications: </h1>
                <table>
                    <tr>
                        <th>Name</th>
                        <th>Rating</th>
                        <th>Date of Application</th>
                        <th>Statement of Purpose</th>
                        <th>Stage</th>
                        <th>Action</th>
                    </tr>
                    
                    {details.map((d, index) => {
                        return (
                            <tr key={index}>
                                <td>{d.name}</td>
                                <td>{d.userRating}</td>
                                <td>{Moment(d.dateOfApp).format("YYYY-MM-DD")}</td>
                                <td>{d.sop}</td>
                                <td>{d.status}</td>
                                <td><Decide stage={d.status} act={data => changeDecision(data, d.userEmail, d.listID, d.companyEmail)}></Decide></td>
                            </tr>
                        )
                    })}
                </table>
            </div>
        )
    }
    else{
        return(
            <div>
                <button onClick={props.switch}>Go Back</button>
                <p>Applications: </p>
            </div>
        )
    }
    
}

export default Job;