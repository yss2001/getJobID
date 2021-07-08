import React, {useState, useEffect} from 'react'
import Axios from "axios"
import Moment from "moment"
import "../../styles/applications.css"

var serverURL = 'http://localhost:3001/applicants'

function Rating(props){

    const [rating, setRating] = useState(0)

    const [message, setMessage] = useState('')


    function changeRating(event){
        setRating(event.target.value)
    }

    function submitRating(event){
        Axios
            .put(`${serverURL}/rate`, {
                params: {
                    rating: rating,
                    lid: props.lid,
                    uid: props.uid
                }
            })
            .then(
                setMessage('Rating submitted!'),
            setTimeout(() =>{
                setMessage('')
            }, 4000))
    }

    if(props.status !== 'Accepted'){
        return(
            <p>Cannot give a rating as you have not been accepted.</p>
        )
    }
    else{
        if (props.rating === -1) {
            return (
                <div>
                    <input min="0" max="5" value={rating} onChange={changeRating} pattern="^\d*(\.\d{0,2})?$"></input>
                    <p>{message}</p>
                    <button onClick={submitRating}>Rate</button>
                </div>
            )
        }
        else {
            return (
                <p>Your rating: {props.rating}</p>
            )
        }
    }
}

function Applications(props) {

    const [applications, setApplications] = useState([])   

    const [toggle, setToggle] = useState(0)

    useEffect(() => {
        let isMount = true
        Axios
            .get(`${serverURL}/myapps`, {
                params:{
                    email: props.email
                }
            })
            .then(response => {
                if(response.data !== null){
                    if(isMount === true){
                        setApplications(response.data)
                    }
                }
            })
            return () => {isMount = false}
    }, [props.email, toggle])


    function handleViewChange(type, event){
        if(type === 'd'){
            props.switch("DASHBOARD")
        }
        else{
            props.switch("PROFILE")
        }
    }

    function changetoggle(){
        if(toggle)
        setToggle(0)
    else
        setToggle(1)
    }
    if (applications !== undefined || applications.length !==0 ) {
        return (
            <div>
                <div className="nav">
                    <button onClick={(e) => handleViewChange('d', e)}>Dashboard</button>
                    <button onClick={(e) => handleViewChange('p', e)}>Profile</button>
                </div>
                <h1>Applications</h1>
                <table>
                    <tr>
                        <th>Title</th>
                        <th>Salary</th>
                        <th>Company</th>
                        <th>Date of Joining</th>
                        <th>Status</th>
                        <th>Rating</th>
                    </tr>

                    {applications.map((a, index) => {
                        if(a.dateOfJoining!== ''){
                        return(
                            <tr key={index}>
                                <td>{a.title}</td>
                                <td>{a.salary}</td>
                                <td>{a.companyName}</td>
                                <td>{Moment(a.postDate).format("DD MMMM YYYY")}</td>
                                <td>{a.status}</td>
                                <td><Rating status={a.status} rating={a.rating} lid={a.listID} uid={props.email} change={changetoggle}></Rating></td>
                            </tr>
                        )}
                        else{
                            return(
                                <tr key={index}>
                                    <td>{a.title}</td>
                                    <td>{a.salary}</td>
                                    <td>{a.companyName}</td>
                                    <td>{Moment(a.postDate).format("DD MMMM YYYY")}</td>
                                    <td>{a.status}</td>
                                    <td><Rating status={a.status} rating={a.rating} lid={a.listID} uid={props.email} change={changetoggle}></Rating></td>
                                </tr>
                            )
                        }
                    })}
                </table>
            </div>
        )
    }
    else {
        return (
            <div>
                <div className="nav">
                    <button onClick={(e) => handleViewChange('d', e)}>Dashboard</button>
                    <button onClick={(e) => handleViewChange('p', e)}>Profile</button>
                </div>
                <h1>Applications</h1>
            </div>
        )
    }
}

export default Applications;