import { supabase } from './SupabaseClient'
import { Session } from '@supabase/supabase-js'
import { useMyUser } from '../contexts/UserContext'
import { convertGoogleSessionToAuthSession } from '../utilities/converters'

const loadAuthUser = (googleSession: Session) => {
    //const [setAuthSession, setGoogleUser] = useMyUser()
    const authSession = convertGoogleSessionToAuthSession(googleSession)
    const googleUser = convertGoogleSessionToAuthSession(googleSession)
    //setAuthSession(authSession)
    //setGoogleUser(googleUser)
}

export { loadAuthUser }
