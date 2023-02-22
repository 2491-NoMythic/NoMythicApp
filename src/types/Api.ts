/**
 * Typescript types for objects coming back from the API, like a Member. All api calls will
 * need to have a type defined here. The db types like integer and varchar are seen here
 * as number and string.
 *
 * Also types to limit selections like SubTeam
 */

const SubTeam = {
    PROGRAMMING: 'programming',
    BUILD: 'build',
    OPERATIONS: 'operations',
    UNASSIGNED: 'unassigned',
} as const
type SubTeamType = typeof SubTeam[keyof typeof SubTeam]

const TeamRole = {
    MEMBER: 'member',
    CAPTAIN: 'captain',
    MENTOR: 'mentor',
    COACH: 'coach',
} as const
type TeamRoleType = typeof TeamRole[keyof typeof TeamRole]

const AttendanceTypes = {
    FULL_TIME: 'full_time',
    PART_TIME: 'part_time',
    ABSENT: 'absent',
} as const
type AttendanceTypesType = typeof AttendanceTypes[keyof typeof AttendanceTypes]

const School = {
    NON_STUDENT: 'non_student',
    AVALON: 'avalon',
    GRS: 'grs',
    OTHER: 'other',
} as const
type SchoolType = typeof School[keyof typeof School]

const EventTypes = {
    REGULAR_PRACTICE: 'regular_practice',
    EXTRA_PRACTICE: 'extra_practice',
    MEETING: 'meeting',
    EVENT: 'event',
    COMPETITION: 'competition',
} as const
type EventTypesType = typeof EventTypes[keyof typeof EventTypes]

const CheckinStatus = {
    GOOD: 'good',
    OK: 'ok',
    BAD: 'bad',
} as const
type CheckinStatusType = typeof CheckinStatus[keyof typeof CheckinStatus]

type Member = {
    member_id?: number
    auth_id?: string
    first_name?: string
    last_name?: string
    pronouns?: string
    sub_team?: SubTeamType
    team_role?: TeamRoleType
    school?: SchoolType
    grad_year?: number
    advisor?: string
    phone?: string
    email?: string
    address?: string
    food_needs?: string
    deleted?: boolean
    admin_tester?: boolean
}

type AuthSession = {
    accessToken?: string
    expiresAt?: number
    expiresIn?: number
}

type GoogleUser = {
    authId?: string
    email?: string
    fullName?: string
    avatarUrl?: string
}

type AuthUser = {
    member: Member
    authSession: AuthSession
    googleUser: GoogleUser
}

type Attendance = {
    attendance_id: number
    member_id: number
    meeting_date: string
    attendance: AttendanceTypesType
    event_id: number
}

type AttendanceStats = {
    member_id: number
    all_count: number
    regular_count: number
    last_few_count: number
}

type MemberAttendance = {
    member_id: number
    first_name: string
    last_name: string
    sub_team: SubTeamType
    team_role: TeamRoleType
    attendance: Attendance
}

type EventAttendance = {
    event_id: number
    event_date: string
    event_type: EventTypesType
    title: string
    attendance: Attendance[]
}
type MeetingCount = {
    count: number
    meeting_date: string
}

type Parent = {
    parent_id?: number
    member_id: number
    first_name: string
    last_name: string
    pronouns?: string
    email: string
    phone?: string
    addr1?: string
    addr2?: string
    city?: string
    state?: string
    zip?: string
}

type RobotEvent = {
    event_id?: number
    event_date: string
    event_type: EventTypesType
    description?: string
    start_time?: string
    end_time?: string
    all_day?: boolean
    virtual?: boolean
    title?: string
    take_attendance: boolean
    has_meal: boolean
}

type Checkin = {
    checkin_id?: number
    event_id: number
    member_id: number
    member_status: CheckinStatusType
    description?: string
}

type MemberCheckin = {
    member_id: number
    first_name: string
    last_name: string
    sub_team: SubTeamType
    team_role: TeamRoleType
    checkin: Checkin
}

type Meal = {
    meal_id: number
    event_id: number
    mentor_id: number
    parent_id: number
    meal_name: string
    description: string
}

type MealInfo = {
    meal_id: number
    event_id: number
    members: Member
    parent: Parent
    meal_name: string
    description: string
}

type MealListItem = {
    event_id?: number
    event_date: string
    event_type: EventTypesType
    title?: string
    has_meal: boolean
    meals: MealInfo
}

export type {
    MemberAttendance,
    Member,
    AuthSession,
    GoogleUser,
    AuthUser,
    SubTeamType,
    TeamRoleType,
    AttendanceTypesType,
    Attendance,
    AttendanceStats,
    SchoolType,
    MeetingCount,
    Parent,
    RobotEvent,
    EventTypesType,
    EventAttendance,
    Checkin,
    CheckinStatusType,
    MemberCheckin,
    Meal,
    MealInfo,
    MealListItem,
}

export { SubTeam, TeamRole, AttendanceTypes, School, EventTypes, CheckinStatus }
