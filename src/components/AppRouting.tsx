import { Routes, Route, useNavigate } from '@solidjs/router'
import { lazy } from 'solid-js'

const Home = lazy(() => import('../pages/Home'))
const Welcome = lazy(() => import('../pages/Welcome'))
const Guest = lazy(() => import('../pages/Guest'))
const Profile = lazy(() => import('../pages/Profile'))
const ProfileEdit = lazy(() => import('../pages/members/ProfileEdit'))
const AdminAccess = lazy(() => import('../pages/admin/AdminAccess'))
const TeamList = lazy(() => import('../pages/admin/TeamList'))
const MemberView = lazy(() => import('../pages/admin/MemberView'))
const MemberEdit = lazy(() => import('../pages/admin/MemberEdit'))
const MemberAccess = lazy(() => import('../pages/members/MemberAccess'))
const AttendancePage = lazy(() => import('../pages/members/AttendancePage'))
const AttendanceForSeason = lazy(() => import('../pages/admin/AttendanceForSeason'))
const AttendanceForMeeting = lazy(() => import('../pages/admin/AttendanceForMeeting'))
const AttendanceForMember = lazy(() => import('../pages/admin/AttendanceForMember'))

const AppRouting = () => {
    const navigate = useNavigate()

    const Redirect = () => {
        navigate('/home')
        return <></>
    }

    return (
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
                <Route path="/attendance" component={AttendanceForSeason} />
                <Route path="/attendance/member/:id" component={AttendanceForMember} />
                <Route path="/attendance/meeting" component={AttendanceForMeeting} />
            </Route>
            <Route path="*" component={Redirect} />
        </Routes>
    )
}

export default AppRouting
