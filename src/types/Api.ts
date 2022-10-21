enum SubTeam {
    PROGRAMMING = 'programming',
    BUILD = 'build',
    OPERATIONS = 'operations',
    CAPTAIN = 'captain',
}

enum TeamRole {
    MEMBER = 'member',
    CAPTAIN = 'captain',
    MENTOR = 'mentor',
    COACH = 'coach',
}

enum AttendanceType {
    FULL_TIME = 'full_time',
    PART_TIME = 'part_time',
    ABSENT = 'absent',
}

type MemberAttendance = {
    member_id: number
    first_name: string
    last_name: string
    sub_team: SubTeam
    team_role: TeamRole
    attendance: Attendance[]
}

// static json master team list
type TeamMember = {
    member_id: number
    first_name: string
    last_name: string
    pronouns: string
    sub_team: SubTeam
    team_role: TeamRole
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
    sub_team: SubTeam
    team_role: TeamRole
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
    attendance: AttendanceType
}

export type { MemberAttendance, TeamMember, Member, AuthSession, GoogleUser, AuthUser, Attendance }

export { SubTeam, TeamRole, AttendanceType }
