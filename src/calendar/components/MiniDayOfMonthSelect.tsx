import { getDate } from 'date-fns'
import { Component, Show } from 'solid-js'
import { useNoMythicUser } from '../../contexts/UserContext'
import { eventBgColors, eventColors } from '../../types/UiConstants'
import { Day } from '../types'

type inputs = { day: Day; handleSelect: (aDay: Day) => void }
const MiniDayOfMonthSelect: Component<inputs> = (props) => {
    const [authSession, googleUser, member, { isAdmin }] = useNoMythicUser()

    const handleClick = (event) => {
        event.preventDefault()
        if (isAdmin) {
            props.handleSelect(props.day)
        }
    }

    return (
        <div
            class={`aspect-square border-t border-r ${isAdmin() ? 'cursor-pointer hover:text-accent-content' : ''} ${
                props?.day?.inMonth ? 'bg-base-100' : 'bg-base-300'
            }`}
            onClick={handleClick}
        >
            <div class="flex justify-end">
                <div
                    class={`w-6 h-6 pr-1 text-right font-bold rounded-full ${
                        props?.day?.isToday ? 'bg-secondary' : ''
                    } ${props?.day?.isSelected ? 'ring ring-primary-content' : ''}`}
                >
                    {getDate(props?.day?.date)}
                </div>
            </div>
            <Show when={props?.day?.data}>
                <div class="-mt-1">
                    {props.day.data.map((robotEvent) => (
                        <div class={`mt-0.5 text-accent-content ${eventBgColors[robotEvent.event_type]}`}>
                            <div class="h-1.5"></div>
                        </div>
                    ))}
                </div>
            </Show>
        </div>
    )
}

export default MiniDayOfMonthSelect
