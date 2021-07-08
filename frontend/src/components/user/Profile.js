import React, { useState, useEffect } from 'react'
import Axios from "axios"

import '../../styles/profile.css'


var serverURL = 'http://localhost:3001/applicants'


function Profile(props) {

    const [profile, setProfile] = useState()

    const [skills, setSkills] = useState([])
    const [newSkill, setNewSkill] = useState('')

    const [edu, setEdu] = useState([])
    const [newInstitute, setNewInstitute] = useState('')
    const [newStart, setNewStart] = useState('')
    const [newEnd, setNewEnd] = useState('')

    const [message, setMessage] = useState('')


    useEffect(() => {
        let isMount = true
        Axios
            .get(`${serverURL}/profile`, {
                params: {
                    email: props.email
                }
            })
            .then(response => {
                if (response.data !== null) {
                    if (isMount === true) {
                        setProfile(response.data)
                        setEdu(response.data.education)
                        setSkills(response.data.skills)
                    }
                }
            })
        return () => { isMount = false }
    }, [props.email])

    function handleViewChange(type, event) {
        if (type === 'd') {
            props.switch('DASHBOARD')
        }
        else {
            props.switch('APPLICATIONS')
        }
    }

    function editProfile(event) {

        setProfile({
            ...profile,
            [event.target.name]: event.target.value
        })
    }

    function submitEdit(event) {
        event.preventDefault()

        let key1 = "education"
        let key2 = "skills"
        setProfile({
            ...profile,
            [key1]: edu,
            [key2]: skills
        })
        Axios
            .put(`${serverURL}/updateProfile/${profile.email}`, {
                params: {
                    profile: profile,
                    edu: edu,
                    skills: skills
                }
            })
            .then(setMessage('Profile Updated!'),
            setTimeout(() =>{
                setMessage('')
            }, 4000))
    }

    function changePreviousSkill(index, event) {
        let tempSkills = [...skills]
        let tempSkill = { ...tempSkills[index - 1] }
        tempSkill.content = event.target.value
        tempSkills[index - 1] = tempSkill
        setSkills(tempSkills)
    }

    function deleteSkill(index, event) {
        event.preventDefault()
        const tempSkills = skills.filter(skill => index !== skill.id)

        for (var i = index - 1; i < tempSkills.length; i++) {
            tempSkills[i].id -= 1;
        }

        setSkills(tempSkills)
    }

    function changeNewSkill(event) {
        setNewSkill(event.target.value)
    }

    function addSkill(event) {
        event.preventDefault()

        const skill = {
            id: skills.length + 1,
            content: newSkill
        }

        setSkills(skills.concat(skill))
        setNewSkill('')
    }

    function changePreviousEdu(type, index, event) {
        let tempEdu = [...edu]
        let tempEd = { ...tempEdu[index - 1] }

        if (type === 'i')
            tempEd.institute = event.target.value
        else if (type === 's')
            tempEd.start = Number(event.target.value)
        else
            tempEd.end = Number(event.target.value)
        tempEdu[index - 1] = tempEd
        setEdu(tempEdu)
    }

    function changeNewEdu(type, event) {
        if (type === 'i')
            setNewInstitute(event.target.value)
        else if (type === 's')
            setNewStart(Number(event.target.value))
        else
            setNewEnd(Number(event.target.value))
    }

    function addEdu(event) {
        event.preventDefault()

        const ed = {
            id: edu.length + 1,
            institute: newInstitute,
            start: Number(newStart),
            end: Number(newEnd)
        }

        setEdu(edu.concat(ed))
        setNewInstitute('')
        setNewStart('')
        setNewEnd('')
    }

    function deleteEdu(index, event) {
        event.preventDefault()
        const tempEdu = edu.filter(ed => index !== ed.id)

        for (var i = index - 1; i < tempEdu.length; i++) {
            tempEdu[i].id -= 1;
        }

        setEdu(tempEdu)

    }

    if (profile !== undefined) {
        return (
            <div className="profileUI">
                <button onClick={(e) => handleViewChange('d', e)}>Dashboard</button>
                <button onClick={(e) => handleViewChange('a', e)}>Applications</button>
                <form onSubmit={submitEdit}>
                    <h1>Profile</h1>
                    <p>Name: </p>
                    <input name="name" value={profile.name} onChange={editProfile}></input>
                    <p>Email: {profile.email}</p>
                    <p>Education:</p>
                    <div>
                        {edu.map(entry => {
                            return (
                                <div key={entry.id}>
                                    <input value={entry.institute} onChange={(e) => changePreviousEdu('i', entry.id, e)}></input>
                                    <input value={entry.start} onChange={(e) => changePreviousEdu('s', entry.id, e)}></input>
                                    <input value={entry.end} onChange={(e) => changePreviousEdu('e', entry.id, e)}></input>
                                    <button onClick={(e) => deleteEdu(entry.id, e)}>Delete</button>
                                    <br></br>
                                </div>
                            )
                        })}
                    </div>
                    <input value={newInstitute} onChange={(e) => changeNewEdu('i', e)}></input>
                    <input type="Number" min="0" value={newStart} onChange={(e) => changeNewEdu('s', e)}></input>
                    <input type="Number" min="0" value={newEnd} onChange={(e) => changeNewEdu('e', e)}></input>
                    <br></br>
                    <button onClick={addEdu}>Add New Education Entry</button>

                    <p>Skills: </p>
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
                    </div>
                    <input value={newSkill} onChange={changeNewSkill}></input>
                    <br></br>
                    <button onClick={addSkill}>Add The New Skill</button>
                    <br></br>
                    <p>{message}</p>
                    <button type="submit">Confirm Edits</button>
                </form>
                <p>Rating: {profile.rating}</p>
            </div>
        )
    }
    else {
        return (
            <div className="profileUI">
                <button onClick={(e) => handleViewChange('d', e)}>Dashboard</button>
                <button onClick={(e) => handleViewChange('a', e)}>Applications</button>
                <h1>User Profile.</h1>
            </div>
        )
    }
}

export default Profile;