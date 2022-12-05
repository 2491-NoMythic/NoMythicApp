import { createContext, JSX, useContext } from 'solid-js'
import { createStore, Store } from 'solid-js/store'

/**
 * Creates a store that is initialized on start of session.
 * Will reset when screen refreshed or browser closed.
 * This is accessed via a provider useSessionContext
 *
 * Add another item to SessionValueKeys and SessionValues type
 * to expand what you can store here.
 */
export enum SessionValueKeys {
    SUBTEAM = 'subTeam',
    SEASON = 'season',
    ATTENDANCE_TAB = 'attendanceTab',
}

type SessionValues = {
    subTeam: string | null
    season: string | null
    attendanceTab: string | null
}

type SessionStore = [
    Store<SessionValues>,
    {
        updateSessionValue: (key: SessionValueKeys, value: string) => void
    }
]

const SessionContext = createContext<SessionStore>()

export function SessionProvider(props: {
    children: number | boolean | Node | JSX.ArrayElement | JSX.FunctionElement | (string & {}) | null | undefined
    initialState: SessionValues
}) {
    const [sessionValues, setSessionValues] = createStore<SessionValues>({
        subTeam: props.initialState.subTeam,
        season: props.initialState.season,
        attendanceTab: props.initialState.attendanceTab,
    })

    const store: SessionStore = [
        sessionValues,
        {
            updateSessionValue(key: SessionValueKeys, value: string) {
                setSessionValues(key, value)
            },
        },
    ]
    return <SessionContext.Provider value={store}>{props.children}</SessionContext.Provider>
}

export function useSessionContext() {
    return useContext(SessionContext)!
}
