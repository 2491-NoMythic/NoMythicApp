import { Component, createEffect, createResource, createSignal, onMount, Suspense } from 'solid-js'
import { sortByFirstName } from '../../utilities/sorts'

import { AttendanceTypes, MemberAttendance } from '../../types/Api'
import { getMemberAttendance } from '../../api/attendance'
import AttendanceList from '../../components/AttendanceList'
import { A, useParams } from '@solidjs/router'
import { formatEnumValue } from '../../utilities/formatters'
import PageLoading from '../../components/PageLoading'
import { RouteKeys } from '../../components/AppRouting'
import SubTeamSelector from '../../components/SubTeamSelector'
import { useSessionContext } from '../../contexts/SessionContext'
import { getEventById } from '../../api/events'
import AttendanceStats from '../../components/AttendanceStats'
import { getMemberCount } from '../../api/members'
import { isEmpty } from '../../utilities/bitsAndBobs'
import { filterBySubTeam } from '../../utilities/filters'

const AttendanceForMeeting: Component = () => {
    const params = useParams()
    const [sessionValues] = useSessionContext()
    const [filteredTeam, setFilteredTeam] = createSignal<MemberAttendance[]>([])
    const [memberCount, setMemberCount] = createSignal<number>(0)
    const [eventCount, setEventCount] = createSignal<number>(0)
    const [team, { mutate, refetch }] = createResource(parseInt(params.id), getMemberAttendance)
    const [anEvent] = createResource(parseInt(params.id), getEventById)

    onMount(async () => {
        const count = await getMemberCount()
        setMemberCount(count)
    })

    createEffect(() => {
        const eventCount = countAttendance(team())
        setEventCount(eventCount)
    })

    // runs whenever team or subTeam are changed
    createEffect(() => {
        const filtered = filterBySubTeam(team(), sessionValues.subTeam)
        const sorted = sortByFirstName(filtered)
        setFilteredTeam(sorted)
    })

    const countAttendance = (memberAttendance: MemberAttendance[]) => {
        if (isEmpty(memberAttendance)) return 0
        const filtered = memberAttendance.filter((person) => {
            return (
                person?.attendance[0]?.attendance === AttendanceTypes.FULL_TIME ||
                person?.attendance[0]?.attendance === AttendanceTypes.PART_TIME
            )
        })
        return filtered?.length
    }

    return (
        <Suspense fallback={<PageLoading />}>
            <div class="overflow-x-auto">
                <div class="flex">
                    <div class="grow">
                        <AttendanceStats
                            eventId={anEvent()?.event_id}
                            meetingDate={anEvent()?.event_date}
                            meetingCount={eventCount()}
                            meetingType={formatEnumValue(anEvent()?.event_type)}
                            teamSize={memberCount()}
                        />
                    </div>
                    <div class="mt-4">
                        <A class="btn btn-secondary" href={RouteKeys.ATTENDANCE_SEASON.nav}>
                            Back
                        </A>
                    </div>
                </div>
                <SubTeamSelector />
                <AttendanceList
                    eventId={anEvent()?.event_id}
                    meetingDate={anEvent()?.event_date}
                    teamMembers={filteredTeam}
                    refetch={refetch}
                    clickToMember={true}
                />
            </div>
        </Suspense>
    )
}

export default AttendanceForMeeting
