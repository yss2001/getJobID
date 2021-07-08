import React, {useState, useEffect} from 'react'
import Axios from "axios"
import Moment from "moment"
import Job from './Job'
import '../../styles/active.css'

var serverURL = 'http://localhost:3001/recruiters'


function Active(props) {

    const [active, setActive] = useState([])

    const [currentJob, setCurrentJob] = useState(-1)

    const [edit, setEdit] = useState('')

    const [del, setDelete] = useState('')

    function Edit(){
        if(edit === '')
            return null
        
        return(
            <div className="message">
                {edit}
            </div>
        )
    }

    function Delete(){
        if(del === '')
            return null
        
        return(
            <div className="message">
                {del}
            </div>
        )
    }

    useEffect(() => {
        let isMount = true
        Axios
            .get(`${serverURL}/activeJobs`, {
                params:{
                    email: props.email
                }
            })
            .then(response => {
                if(response.data !== null){
                    if(isMount === true){

                        var result = response.data.map(function(el){
                            var o = Object.assign({}, el)
                            var d = Moment(el.deadline, "YYYY-MM-DDTHH:mm")
                            o.year = Moment(d).get('year')
                            o.month = Number(Moment(d).get('month')) + 1
                            o.date = Moment(d).get('date')
                            o.hour = Moment(d).get('hour')
                            o.minute = Moment(d).get('minute')
                            return o
                        })

                        setActive(result)
                    }
                }
            })
            return () => {isMount = false}
    }, [props.email])

    function handleViewChange(id ,type, event){
        if(type === 'p'){
            props.switch('PROFILE')
        }
        else if(type === 'c'){
            props.switch('CREATE')
        }
        else if(type === 'e'){
            props.switch('EMPLOYEES')
        }
        else if(type === 'a'){
            setCurrentJob(id)
        }
    }

    function editListing(id, event){
        let key = event.target.name
        let val = event.target.value

        let temp

        if(key === 'maxPos'){
            temp = active.map((el, index) => {
                return(
                    index === id ? {...el, maxPos: val} : el
                )
            })
        }
        else if(key === 'maxApps'){
            temp = active.map((el, index) => {
                return(
                    index === id ? {...el, maxApps: val} : el
                )
            })
        }

        setActive(temp)
    }

    function changeDate(id, event){
        let key = event.target.name
        let val = event.target.value

        let temp

        if(key === 'year'){
            temp = active.map((el, index) => {
                return(
                    index === id ? {...el, year: val} : el
                )
            })
        }
        else if(key === 'month'){
            temp = active.map((el, index) => {
                return(
                    index === id ? {...el, month: val} : el
                )
            })
        }
        else if(key === 'date'){
            temp = active.map((el, index) => {
                return(
                    index === id ? {...el, date: val} : el
                )
            })

        }
        else if(key === 'hour'){
            temp = active.map((el, index) => {
                return(
                    index === id ? {...el, hour: val} : el
                )
            })

        }
        else if(key === 'minute'){
            temp = active.map((el, index) => {
                return(
                    index === id ? {...el, minute: val} : el
                )
            })

        }
        
        setActive(temp)
    }

    function submitEdits(index, event){
        event.preventDefault()
        Axios
            .put(`${serverURL}/updateListing`, {
                params:{
                    active: active[index]
                }
            })
            .then(
                setEdit('Edits Confirmed!'),
            setTimeout(() =>{
                setEdit('')
            }, 4000))

    }

    function deleteJob(id, event){
        event.preventDefault()
        Axios
            .put(`${serverURL}/deleteListing`, {
                params:{
                    jid: id
                }
            })
            .then(
                setDelete('Job Deleted!'),
            setTimeout(() =>{
                setDelete('')
            }, 4000))
    }
    
    if (currentJob === -1) {
        if (active !== undefined || active.length !== 0) {
            return (
                <div>
                    <div className="nav">
                        <button onClick={(e) => handleViewChange(-1, 'p', e)}>Profile</button>
                        <button onClick={(e) => handleViewChange(-1, 'c', e)}>Create Listing</button>
                        <button onClick={(e) => handleViewChange(-1, 'e', e)}>Employees</button>
                    </div>
                    <Edit></Edit>
                    <Delete></Delete>
                    <h1 className="title">Active Listings</h1>
                    <div>
                        {active.map((a, index) => {
                            return (
                                <div className="wrapper" key={index}>
                                    <div className="info">
                                        <p className="item"><b>Title:</b> {a.title}</p>
                                        <p className="item"><b>Date of Posting:</b> {Moment(a.postDate, "YYYY-MM-DD").format("DD MMMM YYYY")}</p>
                                        <p className="item"><b>Deadline:</b> {Moment(a.deadline).format('DD MMMM YYYY, HH:mm')}</p>
                                    </div>
                                    <div className="info">
                                        <p className="item"><b>Current Applications:</b> {a.curApps}</p>
                                        <p><b>Maximum Applications:</b></p>
                                        <input className="item" name="maxApps" onChange={(e) => editListing(index, e)} value={a.maxApps}></input>
                                        <p className="item"><b>Remaining Positions:</b> {a.maxPos - a.curPos}</p>
                                        <p><b>Maximum Positions:</b> </p>
                                        <input className="item" name="maxPos" onChange={(e) => editListing(index, e)} value={a.maxPos}></input>
                                    </div>

                                    <div className="info">
                                    <p><b>New Deadline:</b></p>
                                    <p className="align"><b> Year </b></p><input name="year" type="Number" min="2021" value={a.year} onChange={(e) => changeDate(index, e)}></input>
                                    <p><b>Month</b></p><input name="month" type="Number" min="1" max="12" value={a.month} onChange={(e) => changeDate(index, e)}></input>
                                    <p><b>Date</b></p><input name="date" type="Number" min="1" value={a.date} onChange={(e) => changeDate(index, e)}></input>
                                    <p><b>Hour</b></p><input name="hour" type="Number" min="0" max="23" value={a.hour} onChange={(e) => changeDate(index, e)}></input>
                                    <p><b>Minute</b></p><input name="minute" type="Number" min="0" max="59" value={a.minute} onChange={(e) => changeDate(index, e)}></input>
                                    </div>
                                    <div className="info">
                                    <button onClick={(e) => submitEdits(index, e)}>Confirm Edits</button>
                                    <button onClick={(e) => deleteJob(a.listID, e)}>Delete Job</button>
                                    <button onClick={(e) => handleViewChange(a.listID, 'a', e)}>Show Applications</button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )
        }
        else {
            return (
                <div>
                  <div className="nav">
                        <button onClick={(e) => handleViewChange(-1, 'p', e)}>Profile</button>
                        <button onClick={(e) => handleViewChange(-1, 'c', e)}>Create Listing</button>
                        <button onClick={(e) => handleViewChange(-1, 'e', e)}>Employees</button>
                    </div>
                </div>
            )
        }
    }
    else{
        return(
            <div>
                <Job job={currentJob} switch={(e) => handleViewChange(-1, 'a', e)}></Job>
            </div>
        )
    }
}

export default Active;