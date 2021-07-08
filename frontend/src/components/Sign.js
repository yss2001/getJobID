import React, {useState} from 'react'
import Axios from "axios"
import '../styles/sign.css'

var serverURL = 'http://localhost:3001/authenticate'

function Error(props) {

    if (props.value === 1)
        return (
            <p>Wrong Credentials!</p>
        )
    else if (props.value === 2)
        return (
            <p>Account already registered with the email!</p>
        )
    else {
        return (
            <p></p>
        )
    }
}

function Sign(props){

    const [userType, setType] = useState('User')
    const [signType, setSign] = useState('SIGN IN')


    const [newEmail, setEmail] = useState('')
    const [newPassword, setPassword] = useState('')
    const [newName, setName] = useState('')
    const [newPhone, setPhone] = useState('')
    const [newBio, setBio] = useState('')
    const [error, setError] = useState(0)

    const [skills, setSkills] = useState([])
    const [newSkill, setNewSkill] = useState('')

    const [edu, setEdu] = useState([])
    const [newInstitute, setNewInstitute] = useState('')
    const [newStart, setNewStart] = useState(0)
    const [newEnd, setNewEnd] = useState(0)

    function changeUserType(){
        if(userType === 'User'){
            setType('Company')
        }
        else{
            setType('User')
        }
    }

    function changeSignType(){
        if(signType === 'SIGN IN'){
            setSign('REGISTER')
        }
        else{
            setSign('SIGN IN')
        }
    }


    function changeEmail(event){
        setEmail(event.target.value)
    }

    function changeName(event){
        setName(event.target.value)
    }

    function changePassword(event){
        setPassword(event.target.value)
    }

    function changePhone(event){
        setPhone(event.target.value)
    }

    function changeBio(event){
        setBio(event.target.value)
    }

    function changePreviousSkill(index, event){
        let tempSkills = [...skills]
        let tempSkill = {...tempSkills[index-1]}
        tempSkill.content = event.target.value
        tempSkills[index-1] = tempSkill
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

    function deleteSkill(index, event){
        event.preventDefault()
        const tempSkills = skills.filter(skill => index !== skill.id)

        for(var i=index-1; i<tempSkills.length; i++){
            tempSkills[i].id -= 1;
        }

        setSkills(tempSkills)
    }

    function changePreviousEdu(type, index, event){
        let tempEdu = [...edu]
        let tempEd = {...tempEdu[index-1]}
        
        if(type === 'i')
            tempEd.institute = event.target.value
        else if(type === 's')
            tempEd.start = Number(event.target.value)
        else
            tempEd.end = Number(event.target.value)
        tempEdu[index-1] = tempEd
        setEdu(tempEdu)
    }

    function changeNewEdu(type, event){
        if(type === 'i')
            setNewInstitute(event.target.value)
        else if(type === 's')
            setNewStart(Number(event.target.value))
        else
            setNewEnd(Number(event.target.value))
    }

    function addEdu(event){
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

    function deleteEdu(index, event){
        event.preventDefault()
        const tempEdu = edu.filter(ed => index !== ed.id)

        for(var i=index-1; i<tempEdu.length; i++){
            tempEdu[i].id -= 1;
        }
        
        setEdu(tempEdu)

    }

    function signIn(event){
        event.preventDefault()

        const credentials = {
            email: newEmail,
            password: newPassword
        }
        if(userType === 'User'){
            Axios
                .post(`${serverURL}/applicantSignIn`, credentials)
                .then(res =>{
                    if(res.data === 'FAIL'){
                        return(
                            setError(1),
                            props.sign(),
                            props.data('')
                        )
                    }
                    else if(res.data === 'SUCCESS'){
                        return(
                            props.user(),
                            props.data(credentials.email)
                        )
                    }
                })
        }
        else{
            Axios
                .post(`${serverURL}/recruiterSignIn`, credentials)
                .then(res =>{
                    
                    if(res.data === 'FAIL'){
                        return(
                            setError(1),
                            props.sign(),
                            props.data('')
                        )
                    }
                    else if(res.data === 'SUCCESS'){
                        return(
                            props.company(),
                            props.data(credentials.email)
                        )
                    }
                })

        }
    }

    function register(event){
        event.preventDefault()

        if(userType === 'User'){
            const credentials = {
                name: newName,
                email: newEmail,
                password: newPassword,
                education: edu,
                skills: skills
            }

            Axios
                .post(`${serverURL}/applicantRegister`, credentials)
                .then(res =>{
                    if(res.data === 'FAIL'){
                        return(
                            setError(2),
                            props.sign(),
                            props.data('')
                        )
                    }
                    else if(res.data === 'SUCCESS'){
                        return(
                            props.user(),
                            props.data(credentials.email)
                        )
                    }
                })

        }
        else{
            const credentials = {
                name: newName,
                email: newEmail,
                password: newPassword,
                contact: newPhone,
                bio: newBio
            }

            Axios
                .post(`${serverURL}/recruiterRegister`, credentials)
                .then(res =>{
                    if(res.data === 'FAIL'){
                        return(
                            setError(2),
                            props.sign(),
                            props.data('')
                        )
                    }
                    else if(res.data === 'SUCCESS'){
                        return(
                            props.company(),
                            props.data(credentials.email)
                        )
                    }
                })
        }
    }


    if(signType === 'SIGN IN'){
        return(
            <div className="signUI">
                <button onClick={changeUserType}>Signing in as a {userType}. Click to change.</button>
                <br></br>
                <button onClick={changeSignType}>Don't have an account? Click here to register.</button>
                <br></br>
                <form onSubmit={signIn}>
                    <p>Email </p>
                    <input required value={newEmail} onChange={changeEmail}/>
                    <br></br>
                    <p>Password </p>
                    <input type="password" className = "password "required value={newPassword} onChange={changePassword}/>
                    <br></br>
                    <button type="submit">Login</button>
                </form>
                <Error value={error}></Error>
            </div>
        )
    }
    else{
        if(userType === 'User'){
            return(
                <div className="signUI">
                    <button onClick={changeUserType}>Registering as a {userType}. Click to change.</button>
                    <br></br>
                    <button onClick={changeSignType}>Already have an account? Click here to sign in.</button>

                    <form onSubmit={register}>
                        <p>Name </p>
                        <input required value={newName} onChange={changeName}/>
                        <p>Email </p>
                        <input required value={newEmail} onChange={changeEmail}/>
                        <p>Password </p>
                        <input type = "password" className = "password" required value={newPassword} onChange={changePassword}/>
                        <p>Skills </p>
                        <div>
                            {skills.map(skill => {
                                return(
                                    <div key = {skill.id}>
                                        <input value={skill.content} onChange={(e) => changePreviousSkill(skill.id, e)}></input>
                                        <button onClick={(e) => deleteSkill(skill.id, e)}>Delete</button>
                                        <br></br>
                                    </div>
                                )
                            })}
                            <br></br>
                        </div>
                        <input value={newSkill} onChange={changeNewSkill}></input>
                        <button onClick={addSkill}>Add The New Skill</button>
                        

                        <p>Education</p>
                        <div>
                            {edu.map(entry => {
                                return(
                                    <div key = {entry.id}>
                                        <input value={entry.institute} onChange={(e) => changePreviousEdu('i', entry.id, e)}></input>
                                        <input value={entry.start} onChange={(e) => changePreviousEdu('s', entry.id, e)}></input>
                                        <input value={entry.end} onChange={(e) => changePreviousEdu('e', entry.id, e)}></input>
                                        <button onClick={(e) => deleteEdu(entry.id, e)}>Delete</button>
                                        <br></br>
                                    </div>
                                )
                            })}
                        </div>
                        <input type="Number" min="0"placeholder="Enter Institute Name..."value={newInstitute} onChange={(e) => changeNewEdu('i', e)}></input>
                        <input type="Number" min="0" placeholder="Enter Start Year (YYYY)..."value={newStart} onChange={(e) => changeNewEdu('s', e)}></input>
                        <input type="Number" min="0" placeholder="Enter End Year (YYYY)..."value={newEnd} onChange={(e) => changeNewEdu('e', e)}></input>
                        <button onClick={addEdu}>Add New Education Entry</button>
                        <br></br>
                        <button type="submit">Register</button>
                    </form>
                    <Error value={error}></Error>
                </div>
                )
        }
        else{
            return(
                <div className="signUI">
                    <button onClick={changeUserType}>Registering as a {userType}. Click to change.</button>
                    <br></br>
                    <button onClick={changeSignType}>Already have an account? Click here to sign in.</button>

                    <form onSubmit={register}>
                        <p>Name </p>
                        <input required value={newName} onChange={changeName}/>
                        <p>Email </p>
                        <input required value={newEmail} onChange={changeEmail}/>
                        <p>Password </p>
                        <input type = "password" className = "password" required value={newPassword} onChange={changePassword}/>
                        <p>Phone </p>
                        <input required value={newPhone} onChange={changePhone}/>
                        <p>Bio </p>
                        <textarea required value={newBio} onChange={changeBio}/>
                        <br></br>
                        <button type="submit">Register</button>
                    </form>
                    <Error value={error}></Error>
                </div>
                )
        }
        }
}


export default Sign;
