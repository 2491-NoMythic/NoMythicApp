import { Attendance, EventAttendance, MeetingCount } from '../types/Api'
import { isEmpty } from './bitsAndBobs'

const sortByFirstName = (teamMembers) => {
    if (teamMembers === undefined) {
        return []
    }
    const sorted = teamMembers.sort((memberA, memberB) => {
        const firstNameA = memberA.first_name.toLowerCase()
        const firstNameB = memberB.first_name.toLowerCase()

        if (firstNameA < firstNameB) {
            return -1
        }
        if (firstNameA > firstNameB) {
            return 1
        }
        return 0
    })
    return sorted
}

const sortMeetingCounts = (meetingCounts: MeetingCount[], direction?: 'ASC' | 'DESC') => {
    if (isEmpty(meetingCounts)) {
        return []
    }
    const dir = direction === 'DESC' ? -1 : 1
    const sorted = meetingCounts.sort((meetingA, meetingB) => {
        if (meetingA.meeting_date < meetingB.meeting_date) {
            return -1 * dir
        }
        if (meetingA.meeting_date > meetingB.meeting_date) {
            return 1 * dir
        }
        return 0
    })
    return sorted
}

const sortEventAttendance = (eventAttendance: EventAttendance[], direction?: 'ASC' | 'DESC') => {
    if (isEmpty(eventAttendance)) {
        return []
    }
    const dir = direction === 'DESC' ? -1 : 1
    const sorted = eventAttendance.sort((meetingA, meetingB) => {
        if (meetingA.event_date < meetingB.event_date) {
            return -1 * dir
        }
        if (meetingA.event_date > meetingB.event_date) {
            return 1 * dir
        }
        return 0
    })
    return sorted
}

const sortAttendance = (attendance: Attendance[], direction?: 'ASC' | 'DESC') => {
    if (attendance === undefined) {
        return []
    }
    const dir = direction === 'DESC' ? -1 : 1
    const sorted = attendance.sort((meetingA, meetingB) => {
        if (meetingA.meeting_date < meetingB.meeting_date) {
            return -1 * dir
        }
        if (meetingA.meeting_date > meetingB.meeting_date) {
            return 1 * dir
        }
        return 0
    })
    return sorted
}

export { sortByFirstName, sortMeetingCounts, sortAttendance, sortEventAttendance }
