import React, { useState, useEffect } from 'react'
import Axios from "axios"
import ApplyPage from './ApplyPage'
import Moment from 'moment'
import '../../styles/dashboard.css'

var serverURL = 'http://localhost:3001/applicants'

function Apply(props) {

    if (props.value === 1) {
        return (
            <button className="applied" disabled type="submit" >Applied</button>
        )
    }
    else if (props.cura === props.maxa || props.curp === props.maxp) {
        return (
            <button className="full" disabled>Full</button>
        )
    }
    else {
        return (
            <button  onClick={props.change}>Apply</button>
        )
    }
}

function Dashboard(props) {

    const [listings, setListings] = useState([])

    const [listingsToShow, setToShow] = useState([])

    const [applied, setApplied] = useState([0])

    const [applyPage, setApplyPage] = useState(0)

    const [whichJob, setWhichJob] = useState(-1)

    const [search, setSearch] = useState('')

    const [sortType, setSortType] = useState('none')

    const [jobFilter, setJobFilter] = useState('all')

    const [salaryFilter, setSalaryFilter] = useState({ min: 0, max: 1000000000 })

    const [durationFilter, setDurationFilter] = useState(7)

    useEffect(() => {
        let isMount = true
        Axios
            .get(`${serverURL}/listings`, {
                params: {
                    search: search,
                    email: props.email
                }
            })
            .then(response => {
                if (response.data !== null) {
                    if (isMount) {
                        setApplied(response.data.applied)

                        var result = response.data.jobs.map(function (el, i) {
                            var o = Object.assign({}, el)
                            o.applied = response.data.applied[i]
                            return o;
                        })
                        setListings(result)
                        setToShow(result)
                    }
                }
            })
        return () => { isMount = false }
    }, [search, props.email, applyPage])

    useEffect(() => {

        let tempListings

        function filterDuration(list) {
            return list.duration < durationFilter
        }
        function filterSalary(list) {
            return list.salary >= salaryFilter.min && list.salary <= salaryFilter.max
        }
        function filterJobType(list) {
            return list.jobType === jobFilter
        }

        if (jobFilter === 'all')
            tempListings = listings.filter(filterSalary).filter(filterDuration)
        else
            tempListings = listings.filter(filterDuration).filter(filterSalary).filter(filterJobType)
        
        if (sortType === 'salary')
            tempListings.sort((a, b) => (a.salary > b.salary) ? 1 : -1)
        else if (sortType === 'rating')
            tempListings.sort((a, b) => (a.rating > b.rating) ? -1 : 1)
        else if (sortType === 'duration')
            tempListings.sort((a, b) => (a.duration > b.duration) ? 1 : -1)

            
        setToShow(tempListings)

    }, [salaryFilter, durationFilter, jobFilter, listings, sortType])

    function handleViewChange(type, event) {
        if (type === 'a') {
            props.switch("APPLICATION")
        }
        else {
            props.switch("PROFILE")
        }
    }

    function changeSearch(event) {
        setSearch(event.target.value)
    }

    function changeSort(event) {

        setSortType(event.target.value)

        let key = event.target.value

        let tempListings

        if(key === 'salary')
            tempListings = listingsToShow.slice().sort((a, b) => (a.salary > b.salary) ? 1 : -1)
        else if(key === 'rating')
            tempListings = listingsToShow.slice().sort((a, b) => (a.rating > b.rating) ? -1 : 1)
        else if(key === 'duration')
            tempListings = listingsToShow.slice().sort((a, b) => (a.duration > b.duration) ? 1 : -1)


        let tempApplied = []

        for (var t in tempListings) {
            var id = tempListings[t].listID
            tempApplied.push(applied[id - 1])
        }

        if (key === 'none') {
            setToShow(listings)
        }
        else {
            setToShow(tempListings)
        }
    }

    function changeJobFilter(event) {
        setJobFilter(event.target.value)
    }

    function changeSalaryFilter(event) {

        setSalaryFilter({
            ...salaryFilter,
            [event.target.name]: event.target.value
        })

    }

    function changeDurationFilter(event) {
        setDurationFilter(event.target.value)
    }

    function changeView(id, event) {
        setWhichJob(id)

        if (applyPage === 0)
            setApplyPage(1)
        else
            setApplyPage(0)
    }

    if (applyPage === 0) {
        if (listings !== undefined || listings.length !== 0) {
            return (
                <div>
                    <div className="nav">
                        <button onClick={(e) => handleViewChange('a', e)}>Application</button>
                        <button onClick={(e) => handleViewChange('p', e)}>Profile</button>
                    </div>
                    <h1>Dashboard</h1>
                    <input placeholder="Search for a job by title..." value={search} onChange={changeSearch}></input>
                    <br></br>

                    <div className="option">
                        <label>Sort by: </label>
                        <input checked={sortType === 'none'} type="radio" value="none" name="sort" onChange={changeSort} />None
                        <input checked={sortType === "salary"} type="radio" value="salary" name="sort" onChange={changeSort} />Salary
                        <input checked={sortType === "rating"} type="radio" value="rating" name="sort" onChange={changeSort} />Rating
                        <input checked={sortType === "duration"} type="radio" value="duration" name="sort" onChange={changeSort} />Duration
                    </div>
                    <div className="option">
                        <label>Filter by Job Type: </label>
                        <input checked={jobFilter === 'all'} type="radio" value="all" name="jt" onChange={changeJobFilter} />All
                        <input checked={jobFilter === 'Work From Home'} type="radio" value="Work From Home" name="jt" onChange={changeJobFilter} />Work From Home
                        <input checked={jobFilter === 'Full Time'} type="radio" value="Full Time" name="" onChange={changeJobFilter} />Full Time
                        <input checked={jobFilter === 'Part Time'} type="radio" value="Part Time" name="jt" onChange={changeJobFilter} />Part Time
                    </div>

                    <div className="option">
                        <label>Filter by Salary: </label>
                        <label>Minimum:</label>
                        <input type="number" min="0" name='min' value={salaryFilter.min} onChange={changeSalaryFilter}></input>
                        <label>Maximum:</label>
                        <input type="number" name='max' value={salaryFilter.max} onChange={changeSalaryFilter}></input>
                    </div>

                    <div className="option">
                    <label>Filter by Duration: </label>
                    <input type="number" min='1' max='7' value={durationFilter} onChange={changeDurationFilter}></input>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Company Name</th>
                                <th>Email</th>
                                <th>Post Date</th>
                                <th>Deadline</th>
                                <th>Skills</th>
                                <th>Job Type</th>
                                <th>Duration</th>
                                <th>Salary</th>
                                <th>Rating</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listingsToShow.map((l, index) => {
                                return (
                                    <tr key={index}>
                                        <td >{l.title}</td>
                                        <td >{l.name}</td>
                                        <td >{l.email}</td>
                                        <td >{Moment(l.postDate, "YYYY-MM-DD").format("DD MMMM YYYY")}</td>
                                        <td >{Moment(l.deadline).format('DD MMMM YYYY, HH:mm')}</td>
                                        <td>
                                            {l.skills.map(skill => {
                                                return (
                                                    <div key={skill.id}>
                                                        <p >{skill.content}</p>
                                                    </div>
                                                )
                                            })}
                                        </td>
                                        <td >{l.jobType}</td>
                                        <td >{l.duration}</td>
                                        <td >{l.salary}</td>
                                        <td >{l.rating}</td>
                                        <td ><Apply className="t" value={l.applied} maxa={l.maxApps} cura={l.curApps} maxp={l.maxPos} curp={l.curPos} change={(e) => changeView(l.listID, e)}></Apply></td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )
        }
        else {
            return (
                <div>
                    <div className="nav">
                        <button onClick={(e) => handleViewChange('a', e)}>Application</button>
                        <button onClick={(e) => handleViewChange('p', e)}>Profile</button>
                    </div>
                    <h1>Dashboard</h1>
                </div>
            )
        }
    }
    else {
        return (
            <ApplyPage id={whichJob} uid={props.email} switch={(e) => changeView(0, e)}></ApplyPage>
        )
    }

}

export default Dashboard;