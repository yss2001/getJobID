import React, {useState, useEffect} from 'react'
import Axios from "axios"
import '../../styles/profile.css'

var serverURL = 'http://localhost:3001/recruiters'

function Profile(props) {

    const [profile, setProfile] = useState()

    const [message, setMessage] = useState('')

    function editProfile(event){

        setProfile({
            ...profile,
            [event.target.name]: event.target.value
        })
    }
    useEffect(() =>{
        Axios
            .get(`${serverURL}/profile`, {
                params:{
                    email: props.email
                }
            })
            .then(response => {
                if(response.data !== null){
                    setProfile(response.data)

                }
            })
    }, [props.email])

    function handleViewChange(type, event){
        if(type === 'a'){
            props.switch('CURRENT')
        }
        else if(type === 'c'){
            props.switch('CREATE')
        }
        else{
            props.switch('EMPLOYEES')
        }
    }

    function submitEdit(event){
        event.preventDefault()
        Axios
            .put(`${serverURL}/updateProfile/${profile.email}`, {
                params:{
                    profile: profile
                }
            })
            .then(setMessage('Profile Updated!'),
            setTimeout(() =>{
                setMessage('')
            }, 4000))
    }

    if(profile !== undefined){
        return (
            <div className="profileUI">
                <button onClick={(e) => handleViewChange('a', e)}>Active Listings</button>
                <button onClick={(e) => handleViewChange('c', e)}>Create Listing</button>
                <button onClick={(e) => handleViewChange('e', e)}>Employees</button>
                <h1>Profile</h1>
                <form onSubmit={submitEdit}>
                <p>Name: </p>
                <input name="name" value={profile.name} onChange={editProfile}></input>
                <p>Email: {profile.email}</p>
                <p>Contact Number: </p>
                <input name="contact" value={profile.contact} onChange={editProfile}></input>
                <p>Bio: </p>
                <textarea name="bio" value={profile.bio} onChange={editProfile}></textarea>
                <br></br>
                <p>{message}</p>

                <button type="submit">Confirm Edits</button>
                </form>
            </div>
        )
    }
    else{
        return(
            <div className="profileUI">
                <button onClick={(e) => handleViewChange('a', e)}>Active Listings</button>
                <button onClick={(e) => handleViewChange('c', e)}>Create Listing</button>
                <button onClick={(e) => handleViewChange('e', e)}>Employees</button>
                <h1>Recruiter Profile.</h1>
            </div>
        )
    }
}

export default Profile;