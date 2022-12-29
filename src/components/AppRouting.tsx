import { Routes, Route, useNavigate } from '@solidjs/router'
import { lazy } from 'solid-js'

import MemberAccess from '../pages/members/MemberAccess'
import AdminAccess from '../pages/admin/AdminAccess'

/* By initializing this way, the pages are lazy loaded - not loaded to the browser until they are used */
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
const FullCalendar = lazy(() => import('../calendar/components/FullCalendar'))
const EventEdit = lazy(() => import('../pages/admin/EventEdit'))
const CheckinPage = lazy(() => import('../pages/admin/CheckinPage'))

/**
 * route: the path to give in the <Route> tags - no prefix like /admin or /members
 * nav: the path to use to nav to a new page - includes prefix like /admin or /members
 * regex: the regex test to apply to see if the current path matches the route
 * display: the title of the page you are on - see <PageTitle>
 *
 * For regex help see
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
 * https://www.regexpal.com
 */
export const RouteKeys = {
    HOME: { route: '/home', nav: '/home', regex: /\/home$/, display: 'Home' },
    WELCOME: { route: '/welcome', nav: '/welcome', regex: /\/welcome$/, display: 'Welcome' },
    GUEST: { route: '/guest', nav: '/guest', regex: /\/guest$/, display: 'Guest' },
    PROFILE: { route: '/profile', nav: '/profile', regex: /\/profile$/, display: 'Member Profile' },
    PROFILE_EDIT: {
        route: '/profileedit',
        nav: '/members/profileedit',
        regex: /\/members\/profileedit$/,
        display: 'Profile Edit',
    },
    TAKE_ATTENDANCE: {
        route: '/attendance',
        nav: '/members/attendance',
        regex: /\/members\/attendance$/,
        display: 'Take Attendance',
    },
    TAKE_ATTENDANCE_ID: {
        route: '/attendance/:id',
        nav: '/members/attendance/:id',
        regex: /\/members\/attendance\/[0-9]+$/,
        display: 'Take Attendance',
    },
    TEAM_LIST: { route: '/teamlist', nav: '/admin/teamlist', regex: /\/admin\/teamlist$/, display: 'Team List' },
    MEMBER_VIEW: {
        route: '/member/:mid',
        nav: '/admin/member/:mid',
        regex: /\/admin\/member\/[0-9]+$/,
        display: 'Member View',
    },
    MEMBER_EDIT: {
        route: '/member/:mid/edit',
        nav: '/admin/member/:mid/edit',
        regex: /\/admin\/member\/[0-9]+\/edit$/,
        display: 'Member Edit',
    },
    PARENT_LIST: {
        route: '/member/:mid/parent',
        nav: '/admin/member/:mid/parent',
        regex: /\/admin\/member\/[0-9]+\/parent$/,
        display: 'Parent List',
    },
    PARENT_VIEW: {
        route: '/member/:mid/parent/:pid',
        nav: '/admin/member/:mid/parent/:pid',
        regex: /\/admin\/member\/[0-9]+\/parent\/[0-9]+$/,
        display: 'View Parent',
    },
    PARENT_EDIT: {
        route: '/member/:mid/parent/:pid/edit',
        nav: '/admin/member/:mid/parent/:pid/edit',
        regex: /\/admin\/member\/[0-9]+\/parent\/[0-9]+\/edit$/,
        display: 'Edit Parent',
    },
    ATTENDANCE_SEASON: {
        route: '/attendance',
        nav: '/admin/attendance',
        regex: /\/admin\/attendance$/,
        display: 'Season Attendance',
    },
    ATTENDANCE_MEMBER: {
        route: '/attendance/member/:mid',
        nav: '/admin/attendance/member/:mid',
        regex: /\/admin\/attendance\/member\/[0-9]+$/,
        display: 'Member Attendance',
    },
    ATTENDANCE_MEETING: {
        route: '/attendance/event/:id',
        nav: '/admin/attendance/event/:id',
        regex: /\/admin\/attendance\/event\/[0-9]+$/,
        display: 'Meeting Attendance',
    },
    FULL_CALENDAR: {
        route: '/fullcalendar',
        nav: '/fullcalendar',
        regex: /\/fullcalendar$/,
        display: 'Full Calendar',
    },
    EVENT_EDIT: {
        route: '/eventedit/:id',
        nav: '/admin/eventedit/:id',
        regex: /\/admin\/eventedit\/[0-9]+$/,
        display: 'Edit Event',
    },
    TAKE_CHECKIN: {
        route: '/checkin',
        nav: '/admin/checkin',
        regex: /\/admin\/checkin$/,
        display: 'Member Checkin',
    },
    TAKE_CHECKIN_ID: {
        route: '/checkin/event/:id',
        nav: '/admin/checkin/event/:id',
        regex: /\/admin\/checkin\/event\/[0-9]+$/,
        display: 'Member Checkin',
    },
} as const

/**
 * This defines the routes, or indiidual pages that we can get to based on the url path in the browser
 */
const AppRouting = () => {
    const navigate = useNavigate()

    const Redirect = () => {
        navigate(RouteKeys.HOME.nav)
        return <></>
    }

    return (
        <Routes>
            {/* any access level can view these pages */}
            <Route path={RouteKeys.HOME.route} component={Home} />
            <Route path={RouteKeys.WELCOME.route} component={Welcome} />
            <Route path={RouteKeys.GUEST.route} component={Guest} />
            <Route path={RouteKeys.PROFILE.route} component={Profile} />
            <Route path={RouteKeys.FULL_CALENDAR.route} component={FullCalendar} />

            {/* must be a member to view these pages */}
            <Route path="/members" component={MemberAccess}>
                <Route path={RouteKeys.PROFILE_EDIT.route} component={ProfileEdit} />
                <Route path={RouteKeys.TAKE_ATTENDANCE.route} component={AttendancePage} />
                <Route path={RouteKeys.TAKE_ATTENDANCE_ID.route} component={AttendancePage} />
            </Route>

            {/* must be an admin to view these pages */}
            <Route path="/admin" component={AdminAccess}>
                <Route path={RouteKeys.TEAM_LIST.route} component={TeamList} />
                <Route path={RouteKeys.MEMBER_VIEW.route} component={MemberView} />
                <Route path={RouteKeys.MEMBER_EDIT.route} component={MemberEdit} />
                <Route path={RouteKeys.PARENT_LIST.route} component={Parents} />
                <Route path={RouteKeys.PARENT_VIEW.route} component={ParentView} />
                <Route path={RouteKeys.PARENT_EDIT.route} component={ParentEdit} />
                <Route path={RouteKeys.ATTENDANCE_SEASON.route} component={AttendanceForSeason} />
                <Route path={RouteKeys.ATTENDANCE_MEMBER.route} component={AttendanceForMember} />
                <Route path={RouteKeys.ATTENDANCE_MEETING.route} component={AttendanceForMeeting} />
                <Route path={RouteKeys.EVENT_EDIT.route} component={EventEdit} />
                <Route path={RouteKeys.TAKE_CHECKIN.route} component={CheckinPage} />
                <Route path={RouteKeys.TAKE_CHECKIN_ID.route} component={CheckinPage} />
            </Route>

            <Route path="*" component={Redirect} />
        </Routes>
    )
}

export default AppRouting
