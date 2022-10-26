import { TypeOf } from 'yup'

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
}
type SchoolType = typeof School[keyof typeof School]

type MemberAttendance = {
    member_id: number
    first_name: string
    last_name: string
    sub_team: SubTeamType
    team_role: TeamRoleType
    attendance: Attendance
}

type Member = {
    member_id?: number
    auth_id?: string
    first_name: string
    last_name: string
    pronouns?: string
    sub_team: SubTeamType
    team_role: TeamRoleType
    school?: SchoolType
    grade?: number
    advisor?: string
    phone?: string
    email: string
    address?: string
    food_needs?: string
}

type AuthSession = {
    accessToken: string
    expiresAt: number
    expiresIn: number
}

type GoogleUser = {
    authId: string
    email: string
    fullName: string
    avatarUrl: string
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
}

type MeetingCount = {
    count: number
    meeting_date: string
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
    SchoolType,
    MeetingCount,
}

export { SubTeam, TeamRole, AttendanceTypes, School }
