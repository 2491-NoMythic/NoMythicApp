import { useNavigate, useParams } from '@solidjs/router'
import { Component, createEffect, createResource, createSignal, Show, Suspense } from 'solid-js'
import { getMemberAttendance } from '../../api/attendance'
import { getEventById, getEventsForDay } from '../../api/events'
import EventPicker from '../../calendar/components/EventPicker'
import { getToday, toDate, toYMD } from '../../calendar/utilities'
import { RouteKeys } from '../../components/AppRouting'
import AttendanceList from '../../components/AttendanceList'
import BsCalendarPlus from '../../components/icons/BsCalendarPlus'
import IoCalendarOutline from '../../components/icons/IoCalendarOutline'
import PageLoading from '../../components/PageLoading'
import SelectedEvent from '../../components/SelectedEvent'
import SelectTeamInfoMessage from '../../components/SelectTeamInfoMessage'
import SubTeamSelector from '../../components/SubTeamSelector'
import { useSessionContext } from '../../contexts/SessionContext'
import { useNoMythicUser } from '../../contexts/UserContext'
import { MemberAttendance } from '../../types/Api'
import { filterBySubTeam } from '../../utilities/filters'
import { formatUrl } from '../../utilities/formatters'
import { sortByFirstName } from '../../utilities/sorts'

/* NOTE: This page has a ton of code in common with CheckinPage */

const AttendancePage: Component = () => {
    const [filteredTeam, setFilteredTeam] = createSignal<MemberAttendance[]>([])
    const [showEventSelector, setShowEventSelector] = createSignal(false)

    const params = useParams()
    const navigate = useNavigate()
    const [sessionValues] = useSessionContext()
    const { isAdmin } = useNoMythicUser()
    
    const [team, { refetch }] = createResource(() => parseInt(params.id || '-1'), getMemberAttendance)

    // meeting date is only used for getting initial data
    const [meetingDate, setMeetingDate] = createSignal<string>(toYMD(getToday()))
    // eventsToday is only used to get initial data when hitting the page for first time
    const [eventsToday] = createResource(meetingDate, getEventsForDay)
    const [selectedEvent] = createResource(() => parseInt(params.id || '-1'), getEventById)

    // runs whenever team or subTeam are changed
    createEffect(() => {
        const filtered = filterBySubTeam(team(), sessionValues.subTeam)
        const sorted = sortByFirstName(filtered)
        setFilteredTeam(sorted)
    })

    // called when the date field is changed
    const handleEventChange = (eventId: number) => {
        setShowEventSelector(false)
        if (eventId !== -1) {
            navigate(formatUrl(RouteKeys.TAKE_ATTENDANCE_ID.nav, { id: eventId }))
        }
    }

    // if there is one event for today, and nothing picked yet, use that event
    createEffect(() => {
        if (eventsToday()?.length === 1 && params.id === undefined) {
            navigate(formatUrl(RouteKeys.TAKE_ATTENDANCE_ID.nav, { id: eventsToday()[0].event_id }))
        }
    })

    return (
        <Suspense fallback={<PageLoading />}>
            <div class="overflow-x-auto">
                <div class="flex">
                    <div class="grow mr-2">
                        <SubTeamSelector />
                    </div>
                    <div class="mt-9">
                        <button onClick={() => setShowEventSelector(true)} class="btn btn-primary gap-2">
                            Pick Event <IoCalendarOutline />
                        </button>
                    </div>
                </div>

                <Show when={eventsToday()?.length === 0 && params.id === undefined}>
                    <div class="alert shadow-lg mt-4">
                        <div>There are no events today</div>
                        <Show when={isAdmin()}>
                            <div class="flex-none">
                                <a
                                    class="btn btn-primary gap-2"
                                    href={formatUrl(
                                        RouteKeys.EVENT_EDIT.nav,
                                        { id: 0 },
                                        { date: toYMD(getToday()), back: 'ATTENDANCE' }
                                    )}
                                >
                                    New <BsCalendarPlus />
                                </a>
                            </div>
                        </Show>
                    </div>
                </Show>
                <Show when={eventsToday()?.length > 1 && params.id === undefined}>
                    <div class="alert shadow-lg mt-4">There are multiple events today. Pick an event.</div>
                </Show>
                <Show when={selectedEvent()?.event_id}>
                    <SelectedEvent robotEvent={selectedEvent()}></SelectedEvent>
                </Show>
                <SelectTeamInfoMessage
                    show={filteredTeam().length === 0}
                    extraMessage="Using current season. Pick an event."
                />
                <AttendanceList
                    eventId={parseInt(params.id)}
                    meetingDate={selectedEvent()?.event_date}
                    teamMembers={filteredTeam}
                    refetch={refetch}
                />
            </div>
            <Show when={showEventSelector()}>
                <EventPicker aDate={toDate(meetingDate())} handleSelect={handleEventChange} />
            </Show>
        </Suspense>
    )
}

export default AttendancePage
