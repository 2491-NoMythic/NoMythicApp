import { Component, createEffect, createSignal, lazy, Show } from 'solid-js'
import { A, Route, Routes, useLocation, useNavigate } from '@solidjs/router'
import { supabase } from './api/SupabaseClient'
import { AuthChangeEvent, Session } from '@supabase/supabase-js'
import { useMyUser } from './contexts/UserContext'
import PersonMenu from './components/PersonMenu'
import { HiOutlineMenu } from 'solid-icons/hi'
import unicorn from './assets/2491_logo_disc_outline.png'
import { capitalizeWord } from './utilities/formatters'
import { getMemberByEamil } from './api/members'

const Home = lazy(() => import('./pages/Home'))
const Welcome = lazy(() => import('./pages/Welcome'))
const Guest = lazy(() => import('./pages/Guest'))
const Profile = lazy(() => import('./pages/Profile'))
const ProfileEdit = lazy(() => import('./pages/members/ProfileEdit'))
const AdminAccess = lazy(() => import('./pages/admin/AdminAccess'))
const TeamList = lazy(() => import('./pages/admin/TeamList'))
const MemberView = lazy(() => import('./pages/admin/MemberView'))
const MemberEdit = lazy(() => import('./pages/admin/MemberEdit'))
const MemberAccess = lazy(() => import('./pages/members/MemberAccess'))
const AttendancePage = lazy(() => import('./pages/members/AttendancePage'))

const App: Component = () => {
    const [authSession, googleUser, member, { removeUser, loadUser, loadMember, isLoggedIn, isMember }] = useMyUser()
    const navigate = useNavigate()
    const location = useLocation()
    const [checked, setChecked] = createSignal(false)
    const [path, setpath] = createSignal('')

    createEffect(() => {
        supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session) => {
            if (event === 'SIGNED_IN') {
                loadUser(session)
            } else if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
                removeUser()
                navigate('/home')
            }
        })
    })

    const setPageNameFromPath = () => {
        const position = location.pathname.lastIndexOf('/') + 1
        const page = location.pathname.substring(position, location.pathname.length)
        setpath(capitalizeWord(page))
    }

    createEffect(() => {
        setPageNameFromPath()
    })

    const handleLoadMember = async () => {
        // no point if not logged in

        if (isLoggedIn() && !isMember()) {
            const member = await getMemberByEamil(googleUser().email)
            if (member !== null && member.member_id !== undefined) {
                loadMember(member)
            }
        }
    }

    createEffect(() => {
        handleLoadMember()
    })

    const Redirect = () => {
        navigate('/home')
        return <></>
    }

    // the state is changed in the dom, so solid doesn't know it changed, so we need to switch it twice
    const closeMenu = () => {
        setChecked(true)
        setChecked(false)
    }

    return (
        <div class="bg-base-300 overscroll-contain">
            <div class="drawer drawer-mobile">
                <input id="my-drawer-2" type="checkbox" checked={checked()} class="drawer-toggle" />
                <div class="drawer-content flex flex-col m-4 lg:ml-0">
                    <div class="navbar bg-base-100 rounded-lg">
                        <label for="my-drawer-2" class="btn btn-square btn-ghost drawer-button lg:hidden">
                            <HiOutlineMenu size={24} />
                        </label>
                        <div class="flex-1 text-xl text-purple-600 font-semibold">NoMythic - {path()}</div>
                        <div class="flex-none">
                            <PersonMenu />
                        </div>
                    </div>
                    <div>
                        <Routes>
                            {/* any access level can view these pages */}
                            <Route path="/home" component={Home} />
                            <Route path="/welcome" component={Welcome} />
                            <Route path="/guest" component={Guest} />
                            <Route path="/profile" component={Profile} />
                            {/* must be a member to view these pages */}
                            <Route path="/members" component={MemberAccess}>
                                <Route path="/profileEdit" component={ProfileEdit} />
                                <Route path="/attendance" component={AttendancePage} />
                            </Route>
                            {/* must be an admin to view these pages */}
                            <Route path="/admin" component={AdminAccess}>
                                <Route path="/teamlist" component={TeamList} />
                                <Route path="/member/:id" component={MemberView} />
                                <Route path="/memberEdit/:id" component={MemberEdit} />
                            </Route>
                            <Route path="*" component={Redirect} />
                        </Routes>
                    </div>
                </div>
                <div class="drawer-side lg:m-4">
                    <label for="my-drawer-2" class="drawer-overlay"></label>
                    <div class="menu overflow-y-auto w-80 bg-base-100 text-base-content rounded-lg">
                        <div class="mt-4 mb-8 flex justify-center">
                            <img src={unicorn} class="w-60 h-60"></img>
                        </div>
                        <ul>
                            <li>
                                <A href="/home" onClick={closeMenu}>
                                    Home
                                </A>
                            </li>
                            <Show when={isMember()}>
                                <li>
                                    <A href="/members/attendance" onClick={closeMenu}>
                                        Attendance
                                    </A>
                                </li>
                            </Show>
                            {/* Need check for team role or something */}
                            <Show when={isMember()}>
                                <li>
                                    <A href="/admin/teamlist" onClick={closeMenu}>
                                        Team List
                                    </A>
                                </li>
                            </Show>
                            <li>
                                <A href="/guest" onClick={closeMenu}>
                                    Guest Area
                                </A>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App
