import { Component, createEffect, createResource, createSignal, For, onMount, Show, Suspense } from 'solid-js'
import { add, format, sub } from 'date-fns'
import DayOfMonth from './DayOfMonth'
import { Month, MonthValues } from '../types'
import { getCalendarMerged, getMonthValues, getSelectedEvents, getToday, toDate, toYMD } from '../utilities'
import { useSearchParams } from '@solidjs/router'
import { RobotEvent } from '../../types/Api'
import { getEvents } from '../../api/events'
import PageLoading from '../../components/PageLoading'
import { RouteKeys } from '../../components/AppRouting'
import { formatEnumValue, formatUrl } from '../../utilities/formatters'
import IoCalendarOutline from '../../components/icons/IoCalendarOutline'
import { useMyUser } from '../../contexts/UserContext'

const FullCalendar: Component = () => {
    const [month, setMonth] = createSignal<MonthValues>()
    const [calendar, setCalendar] = createSignal<Month>()
    const [selectedEvents, setSelectedEvents] = createSignal<RobotEvent[]>()
    const [searchParams, setSearchParams] = useSearchParams()
    const [robotEvents, { mutate, refetch }] = createResource(toDate(searchParams.date), getEvents)
    const [authSession, googleUser, member, { isMember, isAdmin }] = useMyUser()

    const eventColors = {
        meeting: 'text-info',
        regular_practice: 'text-accent',
        extra_practice: 'text-warning',
        competition: 'text-success',
        event: 'text-error',
    }

    // push selected day into search params - calendar redraws
    const selectDay = (aDate: Date) => {
        setSearchParams({ date: toYMD(aDate) })
    }

    // set a search param date if there isn't one
    onMount(() => {
        if (searchParams.date === undefined) {
            const today = toYMD(getToday())
            setSearchParams({ date: today })
        }
    })

    // get the base calendar stuff based on date param
    createEffect(() => {
        const aDate = toDate(searchParams.date)
        const monthValues = getMonthValues(aDate)
        setMonth(monthValues)
    })

    // create the calendar and merge with the events once we
    // have the base calendar stuff
    createEffect(() => {
        const aCalendar = getCalendarMerged(month(), robotEvents())
        setCalendar(aCalendar)
        const aDate = toDate(searchParams.date)
        const selectedEvents = getSelectedEvents(aDate, robotEvents())
        setSelectedEvents(selectedEvents)
    })

    const prevMonth = () => {
        const newMonth = sub(month().beginOfMonthDate, { months: 1 })
        const formatted = toYMD(newMonth)
        setSearchParams({ date: formatted })
    }

    const nextMonth = () => {
        const newMonth = add(month().beginOfMonthDate, { months: 1 })
        const formatted = toYMD(newMonth)
        setSearchParams({ date: formatted })
    }

    return (
        <Suspense fallback={<PageLoading />}>
            <Show when={calendar() && month()}>
                <div>
                    <div class="mt-8">
                        <div class="flex mb-4">
                            <div onClick={prevMonth} class="cursor-pointer hover:text-accent-content">
                                {format(sub(month().beginOfMonthDate, { months: 1 }), 'LLLL')}
                            </div>
                            <div class="grow text-center text-2xl text-accent-content">
                                {format(month().beginOfMonthDate, 'LLLL')}
                            </div>
                            <div onClick={nextMonth} class="cursor-pointer hover:text-accent-content">
                                {format(add(month().beginOfMonthDate, { months: 1 }), 'LLLL')}
                            </div>
                        </div>
                        <div class="grid grid-cols-7">
                            <For each={calendar()[0]}>
                                {(day) => <div class="text-center">{format(day.date, 'EEE')}</div>}
                            </For>
                        </div>
                        <div class="grid grid-cols-7 border-l border-b">
                            <For each={calendar()}>
                                {(week) => {
                                    return (
                                        <>
                                            <DayOfMonth day={week[0]} handleSelect={selectDay} />
                                            <DayOfMonth day={week[1]} handleSelect={selectDay} />
                                            <DayOfMonth day={week[2]} handleSelect={selectDay} />
                                            <DayOfMonth day={week[3]} handleSelect={selectDay} />
                                            <DayOfMonth day={week[4]} handleSelect={selectDay} />
                                            <DayOfMonth day={week[5]} handleSelect={selectDay} />
                                            <DayOfMonth day={week[6]} handleSelect={selectDay} />
                                        </>
                                    )
                                }}
                            </For>
                        </div>
                    </div>
                    <div class="flex mt-2 text-sm lg:hidden">
                        <div class="flex-auto text-center bg-info text-accent-content rounded-full pl-3 pr-3 mr-2">
                            Meeting
                        </div>
                        <div class="flex-auto text-center bg-accent text-accent-content rounded-full pl-3 pr-3 mr-2">
                            Practice
                        </div>
                        <div class="flex-auto text-center bg-warning text-accent-content rounded-full pl-3 pr-3 mr-2">
                            Extra
                        </div>
                        <div class="flex-auto text-center bg-primary text-accent-content rounded-full pl-3 pr-3 mr-2">
                            Comp
                        </div>
                        <div class="flex-auto text-center bg-error text-accent-content rounded-full pl-3 pr-3">
                            Event
                        </div>
                    </div>
                    <div class="card w-full bg-base-100 shadow-xl mt-4">
                        <div class="card-body">
                            <h2 class="card-title">{format(toDate(searchParams.date), 'MMMM d yyyy')}</h2>
                            <Show when={selectedEvents()?.length === 0}>
                                <p>No Events Today</p>
                            </Show>
                            <Show when={selectedEvents()?.length > 0}>
                                <For each={selectedEvents()}>
                                    {(robotEvent) => {
                                        return (
                                            <div class="mt-4">
                                                <div class="flex">
                                                    <div class={eventColors[robotEvent.event_type]}>
                                                        <IoCalendarOutline />
                                                    </div>
                                                    <div class="ml-4">{formatEnumValue(robotEvent.event_type)}</div>
                                                </div>
                                                <div>{robotEvent.description}</div>
                                            </div>
                                        )
                                    }}
                                </For>
                            </Show>
                            <Show when={isAdmin()}>
                                <div class="card-actions justify-end">
                                    <a
                                        class="btn btn-primary"
                                        href={formatUrl(
                                            RouteKeys.EVENT_EDIT.nav,
                                            { id: 0 },
                                            { date: searchParams?.date }
                                        )}
                                    >
                                        New Event
                                    </a>
                                </div>
                            </Show>
                        </div>
                    </div>
                </div>
            </Show>
        </Suspense>
    )
}

export default FullCalendar

const eventColors = {
    meeting: 'bg-info',
    regular_practice: 'bg-accent',
    extra_practice: 'bg-warning',
    competition: 'bg-success',
    event: 'bg-error',
}
