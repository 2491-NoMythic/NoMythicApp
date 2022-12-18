import { Component, createEffect, createResource, createSignal, onMount, Suspense } from 'solid-js'
import { sortByFirstName } from '../../utilities/sorts'
import { MemberCheckin } from '../../types/Api'
import { A, useParams } from '@solidjs/router'
import PageLoading from '../../components/PageLoading'
import { RouteKeys } from '../../components/AppRouting'
import SubTeamSelector from '../../components/SubTeamSelector'
import { useSessionContext } from '../../contexts/SessionContext'
import { getEventById } from '../../api/events'
import { filterBySubTeam } from '../../utilities/filters'
import { getMemberCheckins } from '../../api/checkin'
import CheckinList from '../../components/CheckinList'

const CheckinForMeeting: Component = () => {
    const params = useParams()
    const [sessionValues] = useSessionContext()
    const [filteredTeam, setFilteredTeam] = createSignal<MemberCheckin[]>([])
    const [team, { mutate, refetch }] = createResource(() => parseInt(params.id), getMemberCheckins)
    const [anEvent] = createResource(() => parseInt(params.id), getEventById)

    // runs whenever team or subTeam are changed
    createEffect(() => {
        const filtered = filterBySubTeam(team(), sessionValues.subTeam)
        const sorted = sortByFirstName(filtered)
        setFilteredTeam(sorted)
    })

    return (
        <Suspense fallback={<PageLoading />}>
            <div class="overflow-x-auto">
                <div class="flex">
                    <div class="grow">Member Checkins for {anEvent()?.event_date}</div>
                    <div class="mt-4">
                        <A class="btn btn-secondary" href={RouteKeys.ATTENDANCE_SEASON.nav}>
                            Back
                        </A>
                    </div>
                </div>
                <SubTeamSelector />
                <CheckinList
                    eventId={anEvent()?.event_id}
                    teamMembers={filteredTeam}
                    refetch={refetch}
                    clickToMember={true}
                />
            </div>
        </Suspense>
    )
}

export default CheckinForMeeting
