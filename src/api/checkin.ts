import { Checkin, CheckinStatusType } from '../types/Api'
import { supabase } from './SupabaseClient'

/**
 * Get all Attendance records for an event
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

export { getCheckins, updateCheckIn, insertCheckin }
