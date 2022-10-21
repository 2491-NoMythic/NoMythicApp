import { TypeOf } from 'yup'

const SubTeam = {
    PROGRAMMING: 'programming',
    BUILD: 'build',
    OPERATIONS: 'operations',
    CAPTAIN: 'captain',
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

type MemberAttendance = {
    member_id: number
    first_name: string
    last_name: string
    sub_team: SubTeamType
    team_role: TeamRoleType
    attendance: Attendance
}

// static json master team list
type TeamMember = {
    member_id: number
    first_name: string
    last_name: string
    pronouns: string
    sub_team: SubTeamType
    team_role: TeamRoleType
    school: string
    grade: number
    advisor: string
    parent_names: string
    parent_emails: string
    phone: string
    email: string
    address: string
    food_needs: string
}

type Member = {
    member_id?: number
    auth_id?: string
    first_name: string
    last_name: string
    pronouns?: string
    sub_team: SubTeamType
    team_role: TeamRoleType
    school?: string
    grade?: number
    advisor?: string
    phone: string
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

export type {
    MemberAttendance,
    TeamMember,
    Member,
    AuthSession,
    GoogleUser,
    AuthUser,
    SubTeamType,
    TeamRoleType,
    AttendanceTypesType,
    Attendance,
}

export { SubTeam, TeamRole, AttendanceTypes }
