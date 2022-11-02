import { Routes, Route, useNavigate } from '@solidjs/router'
import { lazy } from 'solid-js'

import MemberAccess from '../pages/members/MemberAccess'
import AdminAccess from '../pages/admin/AdminAccess'

const Home = lazy(() => import('../pages/Home'))
const Welcome = lazy(() => import('../pages/Welcome'))
const Guest = lazy(() => import('../pages/Guest'))
const Profile = lazy(() => import('../pages/Profile'))
const ProfileEdit = lazy(() => import('../pages/members/ProfileEdit'))
const TeamList = lazy(() => import('../pages/admin/TeamList'))
const MemberView = lazy(() => import('../pages/admin/MemberView'))
const MemberEdit = lazy(() => import('../pages/admin/MemberEdit'))
const Parents = lazy(() => import('../pages/admin/Parents'))
const ParentView = lazy(() => import('../pages/admin/ParentView'))
const ParentEdit = lazy(() => import('../pages/admin/ParentEdit'))
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
                <Route path="/member/:id/edit" component={MemberEdit} />
                <Route path="/member/:mid/parent" component={Parents} />
                <Route path="/member/:mid/parent/:pid" component={ParentView} />
                <Route path="/member/:mid/parent/:pid/edit" component={ParentEdit} />
                <Route path="/attendance" component={AttendanceForSeason} />
                <Route path="/attendance/member/:id" component={AttendanceForMember} />
                <Route path="/attendance/meeting" component={AttendanceForMeeting} />
            </Route>
            <Route path="*" component={Redirect} />
        </Routes>
    )
}

export default AppRouting
