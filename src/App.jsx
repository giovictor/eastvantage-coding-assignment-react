import { Routes, Route, Navigate } from 'react-router-dom'

import './App.css'

import Wrapper from './components/Wrapper'
import Notification from './components/Notification'

import Users from './pages/Users'
import UserForm from './pages/UserForm'
import Roles from './pages/Roles'
import RoleForm from './pages/RoleForm'

const App = () => {
  return (
    <>
        <Routes>
            <Route element={ <Wrapper /> }>
                <Route path="/users">
                    <Route path="" element={ <Users /> } />
                    <Route path="create" element={ <UserForm /> } />
                    <Route path="update/:id" element={ <UserForm /> } />
                </Route>

                <Route path="/roles">
                    <Route path="" element={ <Roles /> } />
                    <Route path="create" element={ <RoleForm /> } />
                    <Route path="update/:id" element={ <RoleForm /> } />
                </Route>

                <Route path="*" element={ <Navigate to="/users" /> } />
            </Route>
=        </Routes>

        <Notification />
    </>
  )
}

export default App
