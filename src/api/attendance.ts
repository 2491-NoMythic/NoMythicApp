import { isBefore } from 'date-fns'
import { getToday, toDate, toYMD } from '../calendar/utilities'
import { Attendance, AttendanceTypesType, EventAttendance, MemberAttendance } from '../types/Api'
import { getSeason, getStartEndOfSeason } from '../utilities/converters'
import { supabase } from './SupabaseClient'
import { getEventById } from './events'

type MemberYear = {
    members: MemberAttendance
}

const flattenMemberAttendance = (memberYears: MemberYear[]) => {
    if (memberYears.length === 0) {
        return null;
    }
    let memberAttendance = [] as MemberAttendance[]
    memberYears.forEach((memberYear: MemberYear) => { 
        let member: MemberAttendance = {}
        member.member_id = memberYear.members.member_id
        member.first_name = memberYear.members.first_name
        member.last_name = memberYear.members.last_name
        member.team_role = memberYear.members.team_role
        member.sub_team = memberYear.members.sub_team
        member.attendance = memberYear.members.attendance
        memberAttendance.push(member) 
    })
    return memberAttendance
} 

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
    const robotEvent = await getEventById(eventId);
    const year = getSeason(toDate(robotEvent.event_date))
    console.log('year', year)
    const { data, error } = await supabase
        .from('member_year')
        .select('members(member_id, first_name, last_name, sub_team, team_role, attendance(*))')
        .eq('members.attendance.event_id', eventId)
        .eq('members.deleted', false)
        .eq('year', year + '')

    if (error) throw error

    if (data.length === 0) {
        return []
    }
    const flattened = flattenMemberAttendance(data as MemberYear[])
    console.log('data', data)
    console.log('flattened', flattened);
    return flattened
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
 * Season is the year the game comes out (in January)
 */
const getAttendanceForAllMembers = async (season: string) => {
    const { startDate, endDate } = getStartEndOfSeason(season)
    const theEnd = isBefore(getToday(), toDate(endDate)) ? toYMD(getToday()) : endDate
    const { data, error } = await supabase
        .from('attendance')
        .select('attendance_id, member_id, meeting_date, attendance, event_id, events(*)')
        .gte('meeting_date', startDate)
        .lte('meeting_date', theEnd)
        .eq('events.deleted', false)
        // doesn't work how we want it to. just returns null for an event, doesn't remove attendance record
        .eq('events.take_attendance', true)
    if (error) throw error

    if (data.length === 0) {
        return null
    }
    return data as Attendance[]
}

export {
    getMemberAttendance,
    getAttendance,
    checkAttendanceForEvent,
    updateAttendance,
    insertAttendance,
    getAttendanceForMember,
    getAttendanceByEvent,
    getAttendanceForAllMembers,
}
