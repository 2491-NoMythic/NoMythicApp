import { Component, createEffect, createResource, createSignal, For, Show } from 'solid-js'
import { add, format, sub } from 'date-fns'
import { Day, Month, MonthValues } from '../types'
import { getCalendarMerged, getMonthValues, getSelectedEvents, toYMD } from '../utilities'
import { getEvents } from '../../api/events'
import { RobotEvent } from '../../types/Api'
import MiniDayOfMonthSelect from './MiniDayOfMonthSelect'
import { formatEnumValue, formatUrl } from '../../utilities/formatters'
import { RouteKeys } from '../../components/AppRouting'
import BsCalendarPlus from '../../components/icons/BsCalendarPlus'
import IoCalendarOutline from '../../components/icons/IoCalendarOutline'
import { useNoMythicUser } from '../../contexts/UserContext'
import { eventColors } from '../../types/UiConstants'

/**
 * Select a date then an event from that day.
 * If there is only one event, that event is selected
 */
type inputs = { aDate: Date; handleSelect: (eventId: number) => void }
const EventPicker: Component<inputs> = (props) => {
    const [month, setMonth] = createSignal<MonthValues>()
    const [calendar, setCalendar] = createSignal<Month>()
    const [monthDate, setMonthDate] = createSignal<Date>(props.aDate)
    const [showEvents, setShowEvents] = createSignal(false)
    const [selectedEvents, setSelectedEvents] = createSignal<RobotEvent[]>(null)
    const [robotEvents] = createResource(monthDate, getEvents)
    const { isAdmin } = useNoMythicUser()

    createEffect(() => {
        const monthValues = getMonthValues(monthDate())
        setMonth(monthValues)
    })

    // create the calendar and merge with the events once we
    // have the base calendar stuff and the events
    createEffect(() => {
        const aCalendar = getCalendarMerged(month(), robotEvents())
        setCalendar(aCalendar)
    })

    // want to show events for 'today' by default without a click
    // selected events = null at start and when changing a month
    // make sure robot events has loaded first
    createEffect(() => {
        if (selectedEvents() === null && !robotEvents.loading && robotEvents() !== null) {
            const filtered = getSelectedEvents(monthDate(), robotEvents())
            setSelectedEvents(filtered)
        }
    })

    const prevMonth = () => {
        const newMonth = sub(monthDate(), { months: 1 })
        setMonthDate(newMonth)
        setSelectedEvents(null)
    }

    const nextMonth = () => {
        const newMonth = add(monthDate(), { months: 1 })
        setMonthDate(newMonth)
        setSelectedEvents(null)
    }

    type Data = { date: Date }
    const handleClose = (data: Data, event) => {
        event.preventDefault()
        props.handleSelect(-1)
    }

    const handleSelectDay = (aDay: Day) => {
        setMonthDate(aDay.date)
        setSelectedEvents(aDay.data || [])
        setShowEvents(true)
    }

    type eventData = { eventId: number; takeAttendance: boolean }
    const handleSelectEvent = (data: eventData, event) => {
        event.preventDefault()
        if (data.takeAttendance) {
            setShowEvents(false)
            props.handleSelect(data.eventId)
        }
    }

    return (
        <>
            <Show when={calendar() && month()}>
                <div class="modal modal-open items-start">
                    <div class="flex flex-col">
                        <div class="h-10 md:h-32"></div>
                        <div class="w-96 border-2 rounded-xl p-2 bg-base-300 relative">
                            <div
                                class="btn btn-md btn-circle bg-secondary text-accent-content absolute -right-6 -top-6"
                                onClick={[handleClose, {}]}
                            >
                                ✕
                            </div>
                            <div class="flex">
                                <Show when={isAdmin()}>
                                    <div onClick={prevMonth} class="cursor-pointer ml-5 hover:text-accent-content">
                                        {format(sub(month().beginOfMonthDate, { months: 1 }), 'LLL')}
                                    </div>
                                </Show>
                                <div class="grow text-center font-bold text-accent-content">
                                    {format(month().beginOfMonthDate, 'LLLL yyyy')}
                                </div>
                                <Show when={isAdmin()}>
                                    <div onClick={nextMonth} class="cursor-pointer mr-5 hover:text-accent-content">
                                        {format(add(month().beginOfMonthDate, { months: 1 }), 'LLL')}
                                    </div>
                                </Show>
                            </div>
                            <div class="grid grid-cols-7">
                                <For each={calendar()[0]}>
                                    {(day) => <div class="text-center">{format(day.date, 'EEEEEE')}</div>}
                                </For>
                            </div>
                            <div class="grid grid-cols-7 border-l border-b">
                                <For each={calendar()}>
                                    {(week) => {
                                        return (
                                            <>
                                                <MiniDayOfMonthSelect day={week[0]} handleSelect={handleSelectDay} />
                                                <MiniDayOfMonthSelect day={week[1]} handleSelect={handleSelectDay} />
                                                <MiniDayOfMonthSelect day={week[2]} handleSelect={handleSelectDay} />
                                                <MiniDayOfMonthSelect day={week[3]} handleSelect={handleSelectDay} />
                                                <MiniDayOfMonthSelect day={week[4]} handleSelect={handleSelectDay} />
                                                <MiniDayOfMonthSelect day={week[5]} handleSelect={handleSelectDay} />
                                                <MiniDayOfMonthSelect day={week[6]} handleSelect={handleSelectDay} />
                                            </>
                                        )
                                    }}
                                </For>
                            </div>

                            <div class="card w-full bg-base-100 shadow-xl mt-4">
                                <div class="card-body p-4 flex">
                                    <div class="flex">
                                        <div class="card-title grow">{format(monthDate(), 'MMMM d')}</div>
                                        <Show when={isAdmin()}>
                                            <a
                                                class="btn btn-primary btn-sm gap-2"
                                                href={formatUrl(
                                                    RouteKeys.EVENT_EDIT.nav,
                                                    { id: 0 },
                                                    { date: toYMD(monthDate()), back: 'ATTENDANCE' }
                                                )}
                                            >
                                                New <BsCalendarPlus />
                                            </a>
                                        </Show>
                                    </div>
                                    <Show when={selectedEvents()?.length === 0}>
                                        <p>No Events Today</p>
                                    </Show>
                                    <Show when={selectedEvents()?.length > 0}>
                                        <For each={selectedEvents()}>
                                            {(robotEvent) => {
                                                return (
                                                    <div class="mt-2">
                                                        <div
                                                            class={`flex ${
                                                                robotEvent.take_attendance === true
                                                                    ? 'hover:text-accent-content cursor-pointer'
                                                                    : ''
                                                            }`}
                                                            onClick={[
                                                                handleSelectEvent,
                                                                {
                                                                    eventId: robotEvent.event_id,
                                                                    takeAttendance: robotEvent.take_attendance,
                                                                },
                                                            ]}
                                                        >
                                                            <div class={eventColors[robotEvent.event_type]}>
                                                                <IoCalendarOutline />
                                                            </div>
                                                            <div class="ml-2 grow">
                                                                <div class="break-all overflow-hidden h-7">
                                                                    {formatEnumValue(robotEvent.event_type)}
                                                                    <Show when={robotEvent.title}>
                                                                        {' - '}
                                                                        {robotEvent.title}
                                                                    </Show>
                                                                </div>
                                                                <div>
                                                                    {robotEvent.all_day === true ? (
                                                                        'All Day'
                                                                    ) : robotEvent.start_time ? (
                                                                        <span>
                                                                            {robotEvent.start_time} to{' '}
                                                                            {robotEvent.end_time}
                                                                        </span>
                                                                    ) : (
                                                                        ''
                                                                    )}
                                                                    {robotEvent.virtual && <span> - Virtual</span>}
                                                                </div>
                                                                <Show when={robotEvent.has_meal === true}>
                                                                    <div>Meal Provided</div>
                                                                </Show>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            }}
                                        </For>
                                        <p></p>
                                    </Show>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Show>
        </>
    )
}

export default EventPicker
