import { Attendance, AttendanceType, MemberAttendance } from '../types/Api'
import { supabase } from './SupabaseClient'

const getMemberAttendance = async (meetingDate: string) => {
    console.log('getmemberAttendance')
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

const getAttendance = async (meetingDate: string) => {
    const { data, error } = await supabase.from('attendance').select().eq('meeting_date', meetingDate)

    if (error) throw error

    if (data.length === 0) {
        return null
    }
    return data as Attendance[]
}

const updateAttendance = async (attendanceId: number, attendanceType: AttendanceType) => {
    const { data, error } = await supabase
        .from('attendance')
        .update([{ attendance: attendanceType }])
        .eq('attendance_id', attendanceId)

    if (error) throw error
}

const insertAttendance = async (meetingDate: string, memberId: number, attendanceType: AttendanceType) => {
    const { data, error } = await supabase
        .from('attendance')
        .insert([{ meeting_date: meetingDate, member_id: memberId, attendance: attendanceType }])

    if (error) throw error
}

export { getMemberAttendance, getAttendance, updateAttendance, insertAttendance }
