import { Attendance, AttendanceTypes, AttendanceTypesType, MeetingCount, MemberAttendance } from '../types/Api'
import { getStartEndOfSeason } from '../utilities/converters'
import { supabase } from './SupabaseClient'

const makeCountsByMeetingDate = (records: MeetingCounts[]) => {
    const meetingCounts = new Map<string, number>()
    records.forEach((record) => {
        const meetingDate = record.meeting_date
        const currentCount = meetingCounts.get(meetingDate)
        const value = record.attendance !== AttendanceTypes.ABSENT ? 1 : 0
        if (currentCount === undefined) {
            meetingCounts.set(meetingDate, value)
        } else {
            meetingCounts.set(meetingDate, currentCount + value)
        }
    })
    const countArray = [] as MeetingCount[]
    for (const key of meetingCounts.keys()) {
        countArray.push({ count: meetingCounts.get(key), meeting_date: key })
    }
    return countArray
}

const getMemberAttendance = async (meetingDate: string) => {
    const { data, error } = await supabase
        .from('members')
        .select('member_id, first_name, last_name, sub_team, team_role, attendance (*)')
        .eq('attendance.meeting_date', meetingDate)

    if (error) throw error

    if (data.length === 0) {
        return null
    }
    return data as unknown as MemberAttendance[]
}

const getAttendanceByMemberId = async (memberId: number, season: string) => {}

const getAttendanceBySubTeam = async (subTeam: string, season: string) => {}

const getAttendanceForTeam = async (season: string) => {}

type MeetingCounts = { meeting_date: string; attendance: AttendanceTypesType }
const getAttendanceCounts = async (season: string) => {
    // not the query we want to do, but supabse doesn't support distinct or group by yet
    // this is what we want in sql:
    // select count(distinct member_id) as att_count, meeting_date from attendance
    // where attendance = 'full_time' or attendance = 'part_time'
    // group by meeting_date
    const { data, error } = await supabase.from('attendance').select('meeting_date, attendance')

    if (error) throw error

    if (data.length === 0) {
        return null
    }
    const attendanceCounts = data as unknown as MeetingCounts[]
    const counts = makeCountsByMeetingDate(attendanceCounts)
    return counts
}

const getAttendance = async (meetingDate: string) => {
    const { data, error } = await supabase.from('attendance').select().eq('meeting_date', meetingDate)

    if (error) throw error

    if (data.length === 0) {
        return null
    }
    return data as Attendance[]
}

const updateAttendance = async (attendanceId: number, attendanceType: AttendanceTypesType) => {
    const { data, error } = await supabase
        .from('attendance')
        .update([{ attendance: attendanceType }])
        .eq('attendance_id', attendanceId)

    if (error) throw error
}

const insertAttendance = async (meetingDate: string, memberId: number, attendanceType: AttendanceTypesType) => {
    const { data, error } = await supabase
        .from('attendance')
        .insert([{ meeting_date: meetingDate, member_id: memberId, attendance: attendanceType }])

    if (error) throw error
}

/*
 * Returns attendance for a member from June of previous season year, to end of May current season
 * Season is the year the game comes out (in January)
 * Can't figure out how to add types here
 */
const getAttendanceForMember = async ({ season, memberId }) => {
    const { startDate, endDate } = getStartEndOfSeason(season)
    const { data, error } = await supabase
        .from('attendance')
        .select()
        .eq('member_id', memberId)
        .gte('meeting_date', startDate)
        .lte('meeting_date', endDate)

    if (error) throw error

    if (data.length === 0) {
        return null
    }
    return data as Attendance[]
}

/*
 *  Total number of meetings in season that attendance was taken
 */
const getNumberOfMeetings = async (season: string) => {
    const { startDate, endDate } = getStartEndOfSeason(season)
    const { data, error } = await supabase.rpc('number_of_meetings', { start_date: startDate, end_date: endDate })
    if (error) throw error

    if (data.length === 0) {
        return null
    }
    return data as unknown as number
}

export {
    getMemberAttendance,
    getAttendance,
    updateAttendance,
    insertAttendance,
    getAttendanceCounts,
    getAttendanceForMember,
    getNumberOfMeetings,
}
