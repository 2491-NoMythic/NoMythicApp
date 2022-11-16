import { format } from 'date-fns'
import { Component, createResource, createSignal, For, onMount, Show } from 'solid-js'
import { getNextEvents } from '../api/events'
import logo from '../assets/logo.png'
import { getToday, toDate, toYMD } from '../calendar/utilities'
import { eventColors } from '../types/UiConstants'
import { formatEnumValue } from '../utilities/formatters'
import IoCalendarOutline from './icons/IoCalendarOutline'
const NextEvents: Component = () => {
    const [today, setToday] = createSignal<string>(toYMD(getToday()))
    const [nextEvents] = createResource(today, getNextEvents)
    onMount(() => {
        setToday(toYMD(getToday()))
    })

    return (
        <div class="card lg:card-side bg-base-100 shadow-xl mt-4">
            <div class="card-body">
                <h2 class="card-title">Upcoming Events:</h2>
                <For each={nextEvents()}>
                    {(robotEvent) => {
                        return (
                            <div class="mt-4">
                                <div class="flex">
                                    <div class={eventColors[robotEvent.event_type]}>
                                        <IoCalendarOutline />
                                    </div>
                                    <div class="ml-4 grow">
                                        <div>
                                            {formatEnumValue(robotEvent.event_type)}{' '}
                                            {robotEvent.virtual && <span> - Virtual</span>}
                                        </div>

                                        <div>{robotEvent.title}</div>
                                        <div>
                                            <Show when={robotEvent.event_date === toYMD(getToday())}>
                                                <span class="font-bold text-lg animate-pulse">Today</span>
                                            </Show>
                                            <Show when={robotEvent.event_date !== toYMD(getToday())}>
                                                <span class="font-bold text-lg">
                                                    {format(toDate(robotEvent.event_date), 'EEEE do')}
                                                </span>
                                            </Show>
                                            {robotEvent.all_day === true ? (
                                                ' All Day'
                                            ) : robotEvent.start_time ? (
                                                <span>
                                                    {' '}
                                                    {robotEvent.start_time} to {robotEvent.end_time}
                                                </span>
                                            ) : (
                                                ''
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }}
                </For>
            </div>
        </div>
    )
}

export default NextEvents
