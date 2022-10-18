import { Component, createEffect, lazy } from 'solid-js'
import AppToolBar from './components/AppToolBar'
import { Route, Routes, useNavigate } from '@solidjs/router'
import { supabase } from './api/SupabaseClient'
import { AuthChangeEvent, Session } from '@supabase/supabase-js'
import { useMyUser } from './contexts/UserContext'

const Home = lazy(() => import('./pages/Home'))
const Welcome = lazy(() => import('./pages/Welcome'))
const Guest = lazy(() => import('./pages/Guest'))
const Profile = lazy(() => import('./pages/Profile'))
const AdminAccess = lazy(() => import('./pages/admin/AdminAccess'))
const MasterTeamList = lazy(() => import('./pages/admin/MasterTeamList'))
const MemberAccess = lazy(() => import('./pages/members/MemberAccess'))
const AttendancePage = lazy(() => import('./pages/members/AttendancePage'))

const App: Component = () => {
    const [
        authSession,
        googleUser,
        member,
        { removeUser, loadUser, isLoggedIn, isMember },
    ] = useMyUser()
    const navigate = useNavigate()

    createEffect(() => {
        supabase.auth.onAuthStateChange(
            (event: AuthChangeEvent, session: Session) => {
                if (event === 'SIGNED_IN') {
                    loadUser(session)
                } else if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
                    removeUser()
                    navigate('/home')
                }
            }
        )
    })

    const Redirect = () => {
        navigate('/home')
        return <></>
    }

    return (
        <div class="bg-base-300 h-screen p-4">
            <AppToolBar />
            <Routes>
                <Route path="/home" component={Home} />
                <Route path="/welcome" component={Welcome} />
                <Route path="/guest" component={Guest} />
                <Route path="/profile" component={Profile} />
                <Route path="/members" component={MemberAccess}>
                    <Route path="/attendance" component={AttendancePage} />
                </Route>
                <Route path="/admin" component={AdminAccess}>
                    <Route path="/teamlist" component={MasterTeamList} />
                </Route>
                <Route path="*" component={Redirect} />
            </Routes>
        </div>
    )
}

export default App
