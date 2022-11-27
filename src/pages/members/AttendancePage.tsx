import { Component, createEffect, createResource, createSignal, Show, Suspense } from 'solid-js'
import SubTeamSelector from '../../components/SubTeamSelector'
import { filterBySubTeam } from '../../utilities/filters'
import { sortByFirstName } from '../../utilities/sorts'
import SelectTeamInfoMessage from '../../components/SelectTeamInfoMessage'
import { MemberAttendance } from '../../types/Api'
import { getMemberAttendance } from '../../api/attendance'
import AttendanceList from '../../components/AttendanceList'
import PageLoading from '../../components/PageLoading'
import { useSessionContext } from '../../contexts/SessionContext'
import { getToday, toDate, toYMD } from '../../calendar/utilities'
import { useNoMythicUser } from '../../contexts/UserContext'
import IoCalendarOutline from '../../components/icons/IoCalendarOutline'
import EventPicker from '../../calendar/components/EventPicker'
import { getEventById, getEventsForDay } from '../../api/events'
import { eventColors } from '../../types/UiConstants'
import { format } from 'date-fns'
import { formatEnumValue, formatUrl } from '../../utilities/formatters'
import { useNavigate, useParams } from '@solidjs/router'
import { RouteKeys } from '../../components/AppRouting'
import BsCalendarPlus from '../../components/icons/BsCalendarPlus'

const AttendancePage: Component = () => {
    const [filteredTeam, setFilteredTeam] = createSignal<MemberAttendance[]>([])
    const [meetingDate, setMeetingDate] = createSignal<string>(toYMD(getToday()))
    const [showEventSelector, setShowEventSelector] = createSignal(false)

    const params = useParams()
    const navigate = useNavigate()
    const [sessionValues] = useSessionContext()
    const { isAdmin } = useNoMythicUser()

    const [team, { refetch }] = createResource(() => parseInt(params.id || '-1'), getMemberAttendance)
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
                    <div class="alert shadow-lg mt-4">There are multiple events today. Select an event.</div>
                </Show>
                <Show when={selectedEvent()?.event_id}>
                    <div class="alert shadow-lg mt-4">
                        <div>
                            <div class={eventColors[selectedEvent()?.event_type]}>
                                <IoCalendarOutline />
                            </div>
                            <div>
                                <h3 class="font-bold break-all overflow-hidden h-7">
                                    {format(toDate(selectedEvent()?.event_date || '1900-01-01'), 'MMMM d')}{' '}
                                    {formatEnumValue(selectedEvent()?.event_type)}{' '}
                                    <Show when={selectedEvent()?.title}>
                                        {' - '}
                                        {selectedEvent()?.title}
                                    </Show>
                                </h3>
                                <div class="text-xs">
                                    {selectedEvent()?.all_day === true ? (
                                        'All Day'
                                    ) : selectedEvent()?.start_time ? (
                                        <span>
                                            {selectedEvent()?.start_time} to {selectedEvent()?.end_time}
                                        </span>
                                    ) : (
                                        ''
                                    )}
                                    {selectedEvent()?.virtual && <span> - Virtual</span>}
                                </div>
                            </div>
                        </div>
                    </div>
                </Show>
                <SelectTeamInfoMessage
                    show={filteredTeam().length === 0}
                    extraMessage="Using current season. Pick an event."
                />
                <AttendanceList
                    eventId={parseInt(params.id)}
                    meetingDate={meetingDate()}
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
