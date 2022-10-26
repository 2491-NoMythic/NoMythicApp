import { Component, createEffect, createResource, createSignal } from 'solid-js'
import { filterBySubTeam } from '../../utilities/filters'
import { sortByFirstName } from '../../utilities/sorts'

import { MemberAttendance } from '../../types/Api'
import { getMemberAttendance } from '../../api/attendance'
import AttendanceList from '../../components/AttendanceList'
import { A, useSearchParams } from '@solidjs/router'
import { calculateDay } from '../../utilities/formatters'

const AttendanceForOneMeeting: Component = () => {
    const [searchParams] = useSearchParams()
    const [filteredTeam, setFilteredTeam] = createSignal<MemberAttendance[]>([])
    const [team, { mutate, refetch }] = createResource(searchParams.meetingDate, getMemberAttendance)

    // runs whenever team or subTeam are changed
    createEffect(() => {
        const filtered = filterBySubTeam(team(), searchParams.subTeam)
        const sorted = sortByFirstName(filtered)
        setFilteredTeam(sorted)
    })

    return (
        <div class="overflow-x-auto">
            <div class="mt-4 text-lg font-semibold">
                <A class="btn btn-secondary mr-4" href="/admin/attendance">
                    Back
                </A>
                {calculateDay(searchParams.meetingDate)} - {searchParams.meetingDate}
            </div>
            <AttendanceList meetingDate={searchParams.meetingDate} teamMembers={filteredTeam} refetch={refetch} />
        </div>
    )
}

export default AttendanceForOneMeeting
