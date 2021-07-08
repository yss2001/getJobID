import { useState } from 'react'
import Sign from './components/Sign'

import UserProfile from './components/user/Profile'
import UserDashboard from './components/user/Dashboard'
import UserApplications from './components/user/Applications'

import CompanyProfile from './components/company/Profile'
import CreateDashboard from './components/company/Create'
import ActiveJobs from './components/company/Active'
import Employees from './components/company/Employees'

import './styles/common.css'


function App() {

  const [SignPage, setSignPage] = useState(true)
  const [UserState, setUserState] = useState('INACTIVE')
  const [CompanyState, setCompanyState] = useState('INACTIVE')
  let [CurrentID, setCurrentID] = useState('')

  function switchToUser() {
    setSignPage(false); setUserState('PROFILE'); setCompanyState('INACTIVE')
  }

  function switchToSign() {
    setSignPage(true); setUserState('INACTIVE'); setCompanyState('INACTIVE')
  }

  function switchToCompany() {
    setSignPage(false); setUserState('INACTIVE'); setCompanyState('PROFILE')
  }


  if (SignPage === true) {
    return (
      <div>
        <Sign user={switchToUser.bind(this)}
          data={data => { setCurrentID(data) }}
          company={switchToCompany.bind(this)}
          sign={switchToSign.bind(this)} />
      </div>
    )
  }
  else if (CompanyState === 'INACTIVE') {
    if (UserState === 'PROFILE') {
      return (
        <div>
          <UserProfile email={CurrentID} switch={data => { setUserState(data) }} />
        </div>
      )
    }
    else if (UserState === 'DASHBOARD') {
      return (
        <div>
          <UserDashboard email={CurrentID} switch={data => { setUserState(data) }} />
        </div>
      )
    }
    else {
      return (
        <div>
          <UserApplications email={CurrentID} switch={data => { setUserState(data) }} />
        </div>
      )
    }
  }
  else if (UserState === 'INACTIVE') {
    if (CompanyState === 'PROFILE') {
      return (
        <div>
          <CompanyProfile email={CurrentID} switch={data => { setCompanyState(data) }} />
        </div>
      )
    }
    else if (CompanyState === 'CREATE') {
      return (
        <div>
          <CreateDashboard email={CurrentID} switch={data => { setCompanyState(data) }} />
        </div>
      )
    }
    else if (CompanyState === 'CURRENT') {
      return (
        <div>
          <ActiveJobs email={CurrentID} switch={data => { setCompanyState(data) }} />
        </div>
      )
    }
    else {
      return (
        <div>
          <Employees email={CurrentID} switch={data => { setCompanyState(data) }} />
        </div>
      )
    }
  }
}

export default App;
