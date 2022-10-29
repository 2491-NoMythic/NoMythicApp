import { Session } from '@supabase/supabase-js'
import { AuthSession, GoogleUser } from '../types/Api'

const convertGoogleSessionToAuthSession = (googleSession: Session) => {
    const session = {} as AuthSession
    session.accessToken = googleSession.access_token
    session.expiresAt = googleSession.expires_at
    session.expiresIn = googleSession.expires_in
    return session
}

const convertGoogleSessionToGoogleUser = (googleSession: Session) => {
    const googleUser = {} as GoogleUser
    googleUser.authId = googleSession?.user?.id
    googleUser.fullName = googleSession?.user?.user_metadata?.full_name
    googleUser.email = googleSession?.user?.user_metadata?.email
    googleUser.avatarUrl = googleSession?.user?.user_metadata.avatar_url
    return googleUser
}

const getStartEndOfSeason = (season: string) => {
    const startDate = Number.parseInt(season) - 1 + '-06-01'
    const endDate = season + '-05-31'
    return { startDate, endDate }
}

const seasonMonths = [
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
    'January',
    'February',
    'March',
    'April',
    'May',
]

export { convertGoogleSessionToAuthSession, convertGoogleSessionToGoogleUser, getStartEndOfSeason, seasonMonths }
