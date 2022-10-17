import {
    createContext,
    createSignal,
    Accessor,
    useContext,
    Setter,
} from 'solid-js'
import { Session } from '@supabase/supabase-js'

import { AuthSession, GoogleUser, Member } from '../types/Api'
import {
    convertGoogleSessionToAuthSession,
    convertGoogleSessionToGoogleUser,
} from '../utilities/converters'
import { IoThumbsUpOutline } from 'solid-icons/io'

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
    }
]

const UserContext = createContext<UserStore>()

export function UserProvider(props) {
    const [authSession, setAuthSession] = createSignal<AuthSession>(
        {} as AuthSession
    )
    const [googleUser, setGoogleUser] = createSignal<GoogleUser>(
        {} as GoogleUser
    )
    const [member, setMember] = createSignal<Member>({} as Member)

    const store: UserStore = [
        authSession,
        googleUser,
        member,
        {
            loadUser(googleSession: Session) {
                console.log('google load')
                const authSession =
                    convertGoogleSessionToAuthSession(googleSession)
                const googleUser =
                    convertGoogleSessionToGoogleUser(googleSession)
                setAuthSession(authSession)
                setGoogleUser(googleUser)
            },
            loadMember(member: Member) {
                console.log('member load')
                setMember(member)
            },
            removeUser() {
                console.log('remove user')
                setAuthSession({} as AuthSession)
                setGoogleUser({} as GoogleUser)
                setMember({} as Member)
            },
            isLoggedIn() {
                return (
                    authSession() !== null &&
                    authSession().accessToken !== undefined
                )
            },
            isMember() {
                return member() !== null && member().id !== undefined
            },
        },
    ]
    return (
        <UserContext.Provider value={store}>
            {props.children}
        </UserContext.Provider>
    )
}

export function useMyUser() {
    return useContext(UserContext)!
}
