import { Component, createEffect, lazy } from 'solid-js'
import AppToolBar from './components/AppToolBar'
import { Route, Routes, useNavigate } from '@solidjs/router'
import { supabase } from './api/SupabaseClient'
import { AuthChangeEvent, Session } from '@supabase/supabase-js'
import { useMyUser } from './contexts/UserContext'

const Home = lazy(() => import('./pages/Home'))
const Attendance = lazy(() => import('./pages/Attendance'))
const Admin = lazy(() => import('./pages/Admin'))
const Welcome = lazy(() => import('./pages/Welcome'))
const Guest = lazy(() => import('./pages/Guest'))
const Profile = lazy(() => import('./pages/Profile'))

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
                console.log('event', event)
                console.log('session changed', session)
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
                <Route path="/attendance" component={Attendance} />
                <Route path="/admin" component={Admin} />
                <Route path="/welcome" component={Welcome} />
                <Route path="/guest" component={Guest} />
                <Route path="/profile" component={Profile} />
                <Route path="*" component={Redirect} />
            </Routes>
        </div>
    )
}

export default App
