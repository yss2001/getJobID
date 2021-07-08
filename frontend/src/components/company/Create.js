import { useState } from "react"
import Axios from "axios"
import "../../styles/create.css"

var serverURL = 'http://localhost:3001/recruiters'

function Create(props) {

    const [listing, setListing] = useState({
        title: '',
        name: '',
        email: '',
        maxApps: 0,
        curApps: 0,
        maxPos: 0,
        dday: 1,
        dmonth: 1,
        dyear: 2021,
        dhours: 0,
        dminutes: 0,
        jobType: 'Full Time',
        duration: 0,
        salary: 0,
        rating: 0,
        skills: ['']
    })

    const [skills, setSkills] = useState([])
    const [newSkill, setNewSkill] = useState('')
    const [message, setMessage] = useState('')

    function handleViewChange(type, event){
        if(type === 'p'){
            props.switch('PROFILE')
        }
        else if(type === 'a'){
            props.switch('CURRENT')
        }
        else{
            props.switch('EMPLOYEES')
        }
    }

    function changeField(event){
        setListing({
            ...listing,
            [event.target.name]: event.target.value
        })
    }

    function createListing(event){
        event.preventDefault()

        let list = listing
        list.email = props.email
        list.rating = Number(0)
        list.skills = skills
        Axios
            .post(`${serverURL}/createListing`, list)
            .then(setMessage('New Listing Created!'),
            setTimeout(() =>{
                setMessage('')
            }, 4000))
    }

    function changePreviousSkill(index, event){
        let tempSkills = [...skills]
        let tempSkill = {...tempSkills[index-1]}
        tempSkill.content = event.target.value
        tempSkills[index-1] = tempSkill
        setSkills(tempSkills)
    }

    function deleteSkill(index, event){
        event.preventDefault()
        const tempSkills = skills.filter(skill => index !== skill.id)

        for(var i=index-1; i<tempSkills.length; i++){
            tempSkills[i].id -= 1;
        }

        setSkills(tempSkills)
    }

    function changeNewSkill(event){
        setNewSkill(event.target.value)
    }

    function addSkill(event){
        event.preventDefault()

        const skill = {
            id: skills.length + 1,
            content: newSkill
        }
        
        setSkills(skills.concat(skill))
        setNewSkill('')
    }


    return(
        <div>
            <div className="nav">
                <button onClick={(e) => handleViewChange('p', e)}>Profile</button>
                <button onClick={(e) => handleViewChange('e', e)}>Employees</button>
                <button onClick={(e) => handleViewChange('a', e)}>Active Listings</button>
            </div>
            <form className="createForm" onSubmit={createListing}>
                <p>Job Title </p>
                <input required name="title" value={listing.title} onChange={changeField}></input>
                <p>Maximum Applications </p>
                <input required type="number" min="1" name="maxApps" value={listing.maxApps} onChange={changeField}></input>
                <p>Maximum Positions </p>
                <input required type="number" min="1" name="maxPos" value={listing.maxPos} onChange={changeField}></input>
                <p>Deadline </p>
                <label>Day:</label>
                <input required type="number" name="dday" min="1" value={listing.dday} onChange={changeField}></input>
                <label>Month: </label>
                <input required type="number" min="1" max="12" name="dmonth" value={listing.dmonth} onChange={changeField}></input>
                <label>Year: </label>
                <input required type="number" min="2021" name ="dyear" value={listing.dyear} onChange={changeField}></input>
                <label>Hours: </label>
                <input required type="number" name="dhours" min="0" max="23" value={listing.dhours} onChange={changeField}></input>
                <label>Minutes </label>
                <input required type="number" name="dminutes" min="0" max="59" value={listing.dminutes} onChange={changeField}></input>
                <p>Skills </p>
                <div>
                    {skills.map(skill => {
                        return (
                            <div key={skill.id}>
                                <label>{skill.id}</label>
                                <input value={skill.content} onChange={(e) => changePreviousSkill(skill.id, e)}></input>
                                <button onClick={(e) => deleteSkill(skill.id, e)}>Delete</button>
                                <br></br>
                            </div>
                        )
                    })}
                    <br></br>
                </div>
                <input value={newSkill} onChange={changeNewSkill}></input>
                <br></br>
                <button onClick={addSkill}>Add The New Skill</button>
                <p>Job Type </p>
                <input checked = {listing.jobType === "Full Time"} type="radio" value="Full Time" name="jobType" onChange={changeField} /> Full Time
                <input checked = {listing.jobType === "Part Time"} type="radio" value="Part Time" name="jobType" onChange={changeField} /> Part Time
                <input checked = {listing.jobType === "Work From Home"} type="radio" value="Work From Home" name="jobType" onChange={changeField} /> Work From Home
                <p>Duration</p>
                <input required type="number" min="0" max="6" name="duration" value={listing.duration} onChange={changeField}></input>
                <p>Salary</p>
                <input required type="number" min="0" name="salary"value={listing.salary} onChange={changeField}></input>
                <br></br>
                <p>{message}</p>
                <button type="submit">Create Job</button>

            </form>
        </div>
    )
}

export default Create;