import { getDate } from 'date-fns'
import { Component, Show } from 'solid-js'
import { formatEnumValue } from '../../utilities/formatters'
import { Day } from '../types'

// cannot seem to use EventTypes as a key
const eventColors = {
    meeting: 'bg-info',
    regular_practice: 'bg-accent',
    extra_practice: 'bg-warning',
    competition: 'bg-success',
    event: 'bg-error',
}

type inputs = { day: Day; handleSelect: (aDate: Date) => void }
const DayOfMonth: Component<inputs> = (props) => {
    const handleSelect = (event) => {
        event.preventDefault()
        props.handleSelect(props?.day?.date)
    }

    return (
        <div
            class={`aspect-square border-t border-r cursor-pointer hover:text-accent-content ${
                props?.day?.inMonth ? 'bg-base-100' : 'bg-base-300'
            }`}
            onClick={handleSelect}
        >
            <div class="flex justify-end ">
                <div
                    class={`w-6 h-6 lg:w-8 lg:h-8 lg:pt-1 text-center font-bold rounded-full ${
                        props?.day?.isToday ? 'bg-secondary' : ''
                    } ${props?.day?.isSelected ? 'ring ring-primary-content' : ''}`}
                >
                    {getDate(props?.day?.date)}
                </div>
            </div>
            <Show when={props?.day?.data}>
                <>
                    {props.day.data.map((robotEvent) => (
                        <div class={`mt-0.5 text-accent-content ${eventColors[robotEvent.event_type]}`}>
                            <p class="p-0.5 hidden lg:flex text-xs xl:text-base break-all overflow-hidden h-7">
                                {robotEvent.title ? robotEvent.title : formatEnumValue(robotEvent.event_type)}
                            </p>
                            <div class="h-2 md:h-4 lg:hidden"></div>
                        </div>
                    ))}
                </>
            </Show>
        </div>
    )
}

export default DayOfMonth
