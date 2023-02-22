import { isBefore } from 'date-fns'
import { getToday, toDate, toYMD } from '../calendar/utilities'
import Config from '../config'
import { Attendance, AttendanceStats, AttendanceTypesType, EventAttendance, MemberAttendance } from '../types/Api'
import { getStartEndOfSeason } from '../utilities/converters'
import { supabase } from './SupabaseClient'

/**
 * Get list of events for the season and their attendance
 * @param season
 */
const getAttendanceByEvent = async (season: string) => {
    const { startDate, endDate } = getStartEndOfSeason(season)
    const theEnd = isBefore(getToday(), toDate(endDate)) ? toYMD(getToday()) : endDate
    const { data, error } = await supabase
        .from('events')
        .select('event_id, event_date, event_type, title, attendance (*)')
        .gte('event_date', startDate)
        .lte('event_date', theEnd)
        .eq('deleted', false)
        .eq('take_attendance', true)
    if (error) throw error

    if (data.length === 0) {
        return []
    }
    return data as unknown as EventAttendance[]
}

/**
 * Get member records with their attendance attached for an event
 * @param eventId
 * @returns MemberAttendance[]
 */
const getMemberAttendance = async (eventId: number) => {
    if (eventId === -1) {
        return []
    }
    const { data, error } = await supabase
        .from('members')
        .select('member_id, first_name, last_name, sub_team, team_role, attendance(*)')
        .eq('attendance.event_id', eventId)
        .eq('deleted', false)

    if (error) throw error

    if (data.length === 0) {
        return []
    }
    return data as unknown as MemberAttendance[]
}

/**
 * Get all Attendance records for an event
 * @param eventId
 * @returns
 */
const getAttendance = async (eventId: number) => {
    const { data, error } = await supabase.from('attendance').select().eq('event_id', eventId)
    if (error) throw error
    if (data.length === 0) {
        return null
    }
    return data as Attendance[]
}

/**
 * Check to see if an attendance records exists or not yet. We don't want to insert a second record
 * for a member on the same event.
 *
 * @param eventId number
 * @param memberId number
 */
const checkAttendanceForEvent = async (eventId: number, memberId: number) => {
    const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('event_id', eventId)
        .eq('member_id', memberId)
    if (error) throw error
    return data.length !== 0
}

const updateAttendance = async (attendanceId: number, attendanceType: AttendanceTypesType) => {
    const { data, error } = await supabase
        .from('attendance')
        .update([{ attendance: attendanceType }])
        .eq('attendance_id', attendanceId)
    if (error) throw error
}

const insertAttendance = async (
    eventId: number,
    meetingDate: string,
    memberId: number,
    attendanceType: AttendanceTypesType
) => {
    const { data, error } = await supabase
        .from('attendance')
        .insert([{ event_id: eventId, meeting_date: meetingDate, member_id: memberId, attendance: attendanceType }])
    if (error) throw error
}

/*
 * Returns attendance for a member within the season (so far)
 * Season is the year the game comes out (in January)
 */
const getAttendanceForMember = async ({ season, memberId }) => {
    const { startDate, endDate } = getStartEndOfSeason(season)
    const theEnd = isBefore(getToday(), toDate(endDate)) ? toYMD(getToday()) : endDate
    const { data, error } = await supabase
        .from('attendance')
        .select()
        .eq('member_id', memberId)
        .gte('meeting_date', startDate)
        .lte('meeting_date', theEnd)

    if (error) throw error
    if (data.length === 0) {
        return null
    }
    return data as Attendance[]
}

/**
 * Fetch Attendance for all members within the season (so far)
 * Seaason is the year the game comes out (in January)
 */
const getAttendanceStatsForAllMembers = async (season: string) => {
    const { startDate, endDate } = getStartEndOfSeason(season)
    const theEnd = isBefore(getToday(), toDate(endDate)) ? toYMD(getToday()) : endDate
    const { data, error } = await supabase.rpc('aggregate_attendance_stats', {
        start_date: startDate,
        end_date: theEnd,
        //number of attended events by a member of the last few regular events (Config.lastNumPracticesAttended).
        last_num_practices: Config.lastNumPracticesAttended,
    })
    if (error) throw error

    if (data.length === 0) {
        return null
    }
    return data as AttendanceStats[]
}

export {
    getMemberAttendance,
    getAttendance,
    checkAttendanceForEvent,
    updateAttendance,
    insertAttendance,
    getAttendanceForMember,
    getAttendanceByEvent,
    getAttendanceStatsForAllMembers as getAttendanceForAllMembers,
}
