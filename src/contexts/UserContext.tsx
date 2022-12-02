import { createContext, createSignal, Accessor, useContext, JSX } from 'solid-js'
import { Session } from '@supabase/supabase-js'

import { AuthSession, GoogleUser, Member, TeamRole } from '../types/Api'
import { convertGoogleSessionToAuthSession, convertGoogleSessionToGoogleUser } from '../utilities/converters'
import { isEmpty } from '../utilities/bitsAndBobs'

type UserStore = {
    authSession: Accessor<AuthSession>
    googleUser: Accessor<GoogleUser>
    member: Accessor<Member>
    loadUser: (googleUser: Session) => void
    loadMember: (member: Member) => void
    removeUser: () => void
    resetMember: () => void
    isLoggedIn: () => boolean
    isFound: () => boolean
    isMember: () => boolean
    isAdmin: () => boolean
    getMemberStatus: () => string
}

type InitialState = {
    authSession: AuthSession
    googleUser: GoogleUser
    member: Member
}

const UserContext = createContext<UserStore>()

export function UserProvider(props: {
    children: number | boolean | Node | JSX.ArrayElement | JSX.FunctionElement | (string & {}) | null | undefined
    initialState: InitialState
}) {
    const [authSession, setAuthSession] = createSignal<AuthSession>(props.initialState.authSession)
    const [googleUser, setGoogleUser] = createSignal<GoogleUser>(props.initialState.googleUser)
    const [member, setMember] = createSignal<Member>(props.initialState.member)

    const checkIsLoggedIn = () => {
        return !isEmpty(authSession().accessToken)
    }

    const checkIsFound = () => {
        return isEmpty(member().auth_id) && !isEmpty(member().member_id)
    }

    const checkIsMember = () => {
        return !isEmpty(member().auth_id)
    }

    const store: UserStore = {
        authSession,
        googleUser,
        member,
        loadUser(googleSession: Session) {
            const authSession = convertGoogleSessionToAuthSession(googleSession)
            const googleUser = convertGoogleSessionToGoogleUser(googleSession)
            setAuthSession(authSession)
            setGoogleUser(googleUser)
        },
        loadMember(member: Member) {
            if (!isEmpty(member)) {
                setMember(member)
            }
        },
        removeUser() {
            setAuthSession({} as AuthSession)
            setGoogleUser({} as GoogleUser)
            setMember({} as Member)
        },
        resetMember() {
            setMember({} as Member)
        },
        isLoggedIn() {
            return checkIsLoggedIn()
        },
        isFound() {
            return checkIsFound()
        },
        isMember() {
            return checkIsMember()
        },
        isAdmin() {
            return (
                member().team_role === TeamRole.MENTOR ||
                member().team_role === TeamRole.COACH ||
                member().team_role === TeamRole.CAPTAIN ||
                member().admin_tester === true
            )
        },
        getMemberStatus() {
            if (checkIsMember()) {
                return 'MEMBER'
            } else if (checkIsFound()) {
                return 'FOUND'
            } else if (checkIsLoggedIn()) {
                return 'LOGGED_IN'
            }
            return 'ERROR'
        },
    }

    return <UserContext.Provider value={store}>{props.children}</UserContext.Provider>
}

export function useNoMythicUser() {
    return useContext(UserContext)!
}
