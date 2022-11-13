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
import { useMyUser } from '../../contexts/UserContext'
import IoCalendarOutline from '../../components/icons/IoCalendarOutline'
import EventPicker from '../../calendar/components/EventPicker'
import { getEventById, getEventsForDay } from '../../api/events'
import { eventColors } from '../../types/UiConstants'
import { format } from 'date-fns'
import { formatEnumValue } from '../../utilities/formatters'

const AttendancePage: Component = () => {
    const [filteredTeam, setFilteredTeam] = createSignal<MemberAttendance[]>([])
    const [meetingDate, setMeetingDate] = createSignal<string>(toYMD(getToday()))
    const [showEventSelector, setShowEventSelector] = createSignal(false)
    const [selectedId, setSelectedId] = createSignal<number>(-1)

    const [team, { mutate, refetch }] = createResource(meetingDate, getMemberAttendance)
    const [eventsToday] = createResource(meetingDate, getEventsForDay)
    const [selectedEvent] = createResource(selectedId, getEventById)

    const [sessionValues] = useSessionContext()
    const [authSession, googleUser, member, { isAdmin }] = useMyUser()

    // runs whenever team or subTeam are changed
    createEffect(() => {
        const filtered = filterBySubTeam(team(), sessionValues.subTeam)
        const sorted = sortByFirstName(filtered)
        setFilteredTeam(sorted)
    })

    // called when the date field is changed
    const handleEventChange = (eventId: number) => {
        console.log('the event id', eventId)
        setSelectedId(eventId)
        setShowEventSelector(false)
    }

    // if there is one event for today, and nothing picked yet, use that event
    createEffect(() => {
        if (eventsToday()?.length === 1 && selectedId() === -1) {
            setSelectedId(eventsToday()[0].event_id)
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

                <Show when={eventsToday()?.length === 1 && selectedId() === -1}>
                    <div class="alert shadow-lg mt-4">
                        <div class="flex">
                            <div class="grow">There are no events today</div>
                            <div>New</div>
                        </div>
                    </div>
                </Show>
                <Show when={eventsToday()?.length > 1 && selectedId() === -1}>
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
                    extraMessage="Using current season. NOTE: YOU ARE ONLY TAKING ATTENDANCE FOR A PARTICULAR DAY. In the future you will pick the event."
                />
                <AttendanceList meetingDate={meetingDate()} teamMembers={filteredTeam} refetch={refetch} />
            </div>
            <Show when={showEventSelector()}>
                <EventPicker aDate={toDate(meetingDate())} handleSelect={handleEventChange} />
            </Show>
        </Suspense>
    )
}

export default AttendancePage
