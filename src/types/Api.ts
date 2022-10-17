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

type TeamMemberAttendance = {
    id: number
    firstName: string
    lastName: string
    subTeam: SubTeam
    teamRole: TeamRole
}

type TeamMember = {
    id: number
    firstName: string
    lastName: string
    pronouns: string
    subTeam: SubTeam
    teamRole: TeamRole
    school: string
    grade: number
    advisor: string
    parentNames: string
    parentEmails: string
    phone: string
    email: string
    address: string
    foodNeeds: string
}

type Member = {
    id: number
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

export type {
    TeamMemberAttendance,
    TeamMember,
    Member,
    AuthSession,
    GoogleUser,
    AuthUser,
}

export { SubTeam, TeamRole }
