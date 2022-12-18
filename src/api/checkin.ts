import { Checkin, CheckinStatusType, MemberCheckin } from '../types/Api'
import { supabase } from './SupabaseClient'

/**
 * Get member records with their checkins for an event
 * @param eventId
 * @returns MemberCheckin[]
 */
const getMemberCheckins = async (eventId: number) => {
    if (eventId === -1) {
        return []
    }
    const { data, error } = await supabase
        .from('members')
        .select('member_id, first_name, last_name, sub_team, team_role, checkin(*)')
        .eq('checkin.event_id', eventId)
        .eq('deleted', false)

    if (error) throw error

    if (data.length === 0) {
        return []
    }
    return data as unknown as MemberCheckin[]
}

/**
 * Check to see if a checkin records exists or not yet. We don't want to insert a second record
 * for a member on the same event.
 *
 * @param eventId number
 * @param memberId number
 */
const checkCheckinForEvent = async (eventId: number, memberId: number) => {
    const { data, error } = await supabase.from('checkin').select('*').eq('event_id', eventId).eq('member_id', memberId)
    if (error) throw error
    return data.length !== 0
}

/**
 * Get all Checkin records for an event
 * @param eventId
 * @returns
 */
const getCheckins = async (eventId: number) => {
    const { data, error } = await supabase.from('checkin').select().eq('event_id', eventId)
    if (error) throw error
    if (data.length === 0) {
        return null
    }
    return data as Checkin[]
}

const updateCheckIn = async (checkinId: number, memberStatus: CheckinStatusType, description: string) => {
    const { data, error } = await supabase
        .from('checkin')
        .update([{ member_status: memberStatus, description: description }])
        .eq('checkin_id', checkinId)
    if (error) throw error
}

const insertCheckin = async (
    eventId: number,
    memberId: number,
    memberStatus: CheckinStatusType,
    description: string
) => {
    const { data, error } = await supabase
        .from('checkin')
        .insert([{ event_id: eventId, member_id: memberId, member_status: memberStatus, description: description }])
    if (error) throw error
}

export { getMemberCheckins, checkCheckinForEvent, getCheckins, updateCheckIn, insertCheckin }
