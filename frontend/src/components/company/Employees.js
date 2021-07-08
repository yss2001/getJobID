import React, {useState, useEffect} from 'react'
import Axios from "axios"
import Moment from "moment"

var serverURL = 'http://localhost:3001/recruiters'



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
                    uid: props.uid,
                }
            })
            .then(
                setMessage('Rating submitted!'),
            setTimeout(() =>{
                setMessage('')
            }, 4000))
    }

    if(props.rating === -1){
        return (
            <div>
                <input min="0" max="5" value={rating} onChange={changeRating} pattern="^\d*(\.\d{0,2})?$"></input>
                <p>{message}</p>
                <button onClick={submitRating}>Rate</button>
            </div>
        )
    }
    else{
        return(
            <p>Your rating: {props.rating}</p>
        )
    }
}

function Employees(props) {

    const [employees, setEmployees] = useState([])

    const [showEmployees, setToShow] = useState([])

    const [sortType, setSortType] = useState('none')

    
    useEffect(() => {
        let isMount = true
        Axios
            .get(`${serverURL}/employees`, {
                params:{
                    email: props.email
                }
            })
            .then(response => {
                if(response.data !== null){
                    if(isMount === true)
                    {
                        setEmployees(response.data)
                        setToShow(response.data)
                    }
                }
            })
            return () => {isMount = false}
    }, [props.email])

    function handleViewChange(type, event){
        if(type === 'p'){
            props.switch('PROFILE')
        }
        else if(type === 'c'){
            props.switch('CREATE')
        }
        else{
            props.switch('CURRENT')
        }
    }

    function changeSort(event){
        setSortType(event.target.value)

        let key = event.target.value

        let tempEmployees
        if(key === "name"){
            tempEmployees = employees.slice().sort((a ,b) => (a.name > b.name) ? 1:-1)
        }
        else if(key === "title"){
            tempEmployees = employees.slice().sort((a ,b) => (a.title > b.title) ? 1:-1)
        }
        else if(key === "dateOfJoining"){
            tempEmployees = employees.slice().sort((a ,b) => (a.dateOfJoining > b.dateOfJoining) ? 1:-1)
        }
        else if(key === "totalRating"){
            tempEmployees = employees.slice().sort((a ,b) => (a.totalRating > b.totalRating) ? 1:-1)
        }

        if(key === 'none')
            setToShow(employees)
        else
            setToShow(tempEmployees)
    }
    
    if (showEmployees.length !== 0) {
        return (
            <div>
                <div className="nav">
                    <button onClick={(e) => handleViewChange('p', e)}>Profile</button>
                    <button onClick={(e) => handleViewChange('c', e)}>Create Listing</button>
                    <button onClick={(e) => handleViewChange('a', e)}>Active Listings</button>
                </div>
                <h1>Employees</h1>
                <div>
                    <div className="option">
                        <label>Sort By:</label>
                        <input checked={sortType === 'none'} type="radio" value="none" name="sort" onChange={changeSort} />None
                        <input checked={sortType === 'name'} type="radio" value="name" name="sort" onChange={changeSort} />Name
                        <input checked={sortType === 'title'} type="radio" value="title" name="sort" onChange={changeSort} />Title
                        <input checked={sortType === 'dateOfJoining'} type="radio" value="dateOfJoining" name="sort" onChange={changeSort} />Date of Joining
                        <input checked={sortType === 'totalRating'} type="radio" value="totalRating" name="sort" onChange={changeSort} />Rating
                    </div>
                    <br></br>
                    <table>
                        <tr>
                            <th>Name</th>
                            <th>Date of Joining</th>
                            <th>Job Type</th>
                            <th>Title</th>
                            <th>Rating</th>
                        </tr>
                    
                    {showEmployees.map((e, index) =>{
                        return(
                            <tr key={index}>
                                <td>{e.name}</td>
                                <td>{Moment(e.postDate).format("DD MMMM YYYY")}</td>
                                <td>{e.jobType}</td>
                                <td>{e.title}</td>
                                <td><Rating rating={e.rating} uid={e.email} cid={props.email}></Rating></td>
                            </tr>
                        )
                    })}
                    </table>
                </div>
            </div>
        ) 
    }
    else {
        return (
            <div>
                <div className="nav">
                    <button onClick={(e) => handleViewChange('p', e)}>Profile</button>
                    <button onClick={(e) => handleViewChange('c', e)}>Create Listing</button>
                    <button onClick={(e) => handleViewChange('a', e)}>Active Listings</button>
                </div>
            </div>
        )
    }
}

export default Employees;