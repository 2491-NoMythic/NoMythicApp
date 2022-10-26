import { Attendance, AttendanceTypes, AttendanceTypesType, MeetingCount, MemberAttendance } from '../types/Api'
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

export { getMemberAttendance, getAttendance, updateAttendance, insertAttendance, getAttendanceCounts }
