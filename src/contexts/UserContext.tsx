import { createContext, createSignal, Accessor, useContext } from 'solid-js'
import { Session } from '@supabase/supabase-js'

import { AuthSession, GoogleUser, Member, TeamRole } from '../types/Api'
import { convertGoogleSessionToAuthSession, convertGoogleSessionToGoogleUser } from '../utilities/converters'

type UserStore = [
    Accessor<AuthSession>,
    Accessor<GoogleUser>,
    Accessor<Member>,
    {
        loadUser: (googleUser: Session) => void
        loadMember: (member: Member) => void
        removeUser: () => void
        isLoggedIn: () => boolean
        isMember: () => boolean
        isAdmin: () => boolean
    }
]

const UserContext = createContext<UserStore>()

export function UserProvider(props) {
    const [authSession, setAuthSession] = createSignal<AuthSession>({} as AuthSession)
    const [googleUser, setGoogleUser] = createSignal<GoogleUser>({} as GoogleUser)
    const [member, setMember] = createSignal<Member>({} as Member)

    const store: UserStore = [
        authSession,
        googleUser,
        member,
        {
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
            isLoggedIn() {
                return authSession() !== null && authSession().accessToken !== undefined
            },
            isMember() {
                return member() !== null && member().member_id !== undefined
            },
            isAdmin() {
                return (
                    member() != null &&
                    (member().team_role === TeamRole.MENTOR ||
                        member().team_role === TeamRole.COACH ||
                        member().team_role === TeamRole.CAPTAIN)
                )
            },
        },
    ]
    return <UserContext.Provider value={store}>{props.children}</UserContext.Provider>
}

export function useMyUser() {
    return useContext(UserContext)!
}
