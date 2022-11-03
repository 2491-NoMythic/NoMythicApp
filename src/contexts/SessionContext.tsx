import { createContext, useContext } from 'solid-js'
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
}

type SessionValues = {
    subTeam: string
    season: string
}

type SessionStore = [
    Store<SessionValues>,
    {
        updateSessionValue: (key: SessionValueKeys, value: string) => void
    }
]

const SessionContext = createContext<SessionStore>()

export function SessionProvider(props) {
    const [sessionValues, setSessionValues] = createStore<SessionValues>({
        subTeam: null,
        season: null,
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
