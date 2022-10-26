import { MeetingCount } from '../types/Api'

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
    if (meetingCounts === undefined) {
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

export { sortByFirstName, sortMeetingCounts }
