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
}

type InitialState = {
    authSession: AuthSession
    googleUser: GoogleUser
    member: Member
}

const UserContext = createContext<UserStore>()

export function UserProvider(props: {
    children: number | boolean | Node | JSX.ArrayElement | JSX.FunctionElement | (string & {})
    initialState: InitialState
}) {
    const [authSession, setAuthSession] = createSignal<AuthSession>(props.initialState.authSession)
    const [googleUser, setGoogleUser] = createSignal<GoogleUser>(props.initialState.googleUser)
    const [member, setMember] = createSignal<Member>(props.initialState.member)

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
            setMember(member)
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
            return !isEmpty(authSession().accessToken)
        },
        isFound() {
            return isEmpty(member().auth_id) && !isEmpty(member().member_id)
        },
        isMember() {
            return !isEmpty(member().auth_id)
        },
        isAdmin() {
            return (
                member().team_role === TeamRole.MENTOR ||
                member().team_role === TeamRole.COACH ||
                member().team_role === TeamRole.CAPTAIN ||
                member().admin_tester === true
            )
        },
    }

    return <UserContext.Provider value={store}>{props.children}</UserContext.Provider>
}

export function useNoMythicUser() {
    return useContext(UserContext)!
}
