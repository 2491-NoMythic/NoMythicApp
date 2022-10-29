import { Component, createEffect, createResource, createSignal, Suspense } from 'solid-js'
import DatePicker from '../../components/DatePicker'
import SubTeamSelector from '../../components/SubTeamSelector'
import { filterBySubTeam } from '../../utilities/filters'
import { sortByFirstName } from '../../utilities/sorts'

import SelectTeamInfoMessage from '../../components/SelectTeamInfoMessage'
import { MemberAttendance } from '../../types/Api'
import { getMemberAttendance } from '../../api/attendance'
import AttendanceList from '../../components/AttendanceList'
import PageLoading from '../../components/PageLoading'

const AttendancePage: Component = () => {
    const [subTeam, setSubTeam] = createSignal('')
    const [filteredTeam, setFilteredTeam] = createSignal<MemberAttendance[]>([])
    const today = new Date()
    const formatted = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
    const [meetingDate, setMeetingDate] = createSignal<string>(formatted)
    const [team, { mutate, refetch }] = createResource(meetingDate, getMemberAttendance)

    // runs whenever team or subTeam are changed
    createEffect(() => {
        const filtered = filterBySubTeam(team(), subTeam())
        const sorted = sortByFirstName(filtered)
        setFilteredTeam(sorted)
    })

    return (
        <Suspense fallback={<PageLoading />}>
            <div class="overflow-x-auto">
                <div class="flex">
                    <div class="grow mr-2">
                        <SubTeamSelector subTeam={subTeam} setSubTeam={setSubTeam} />
                    </div>
                    <DatePicker selectedDate={meetingDate} setSelectedDate={setMeetingDate} />
                </div>
                <SelectTeamInfoMessage show={filteredTeam().length === 0} extraMessage="Using current season." />
                <AttendanceList meetingDate={meetingDate()} teamMembers={filteredTeam} refetch={refetch} />
            </div>
        </Suspense>
    )
}

export default AttendancePage
