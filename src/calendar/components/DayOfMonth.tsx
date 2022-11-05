import { getDate } from 'date-fns'
import { Component, Show } from 'solid-js'
import { Day } from '../types'

const DayOfMonth: Component<{ day: Day }> = (props) => {
    return (
        <div class={`aspect-square border-t border-r ${props?.day?.inMonth ? 'bg-base-100' : 'bg-base-300'}`}>
            <div class="p-2 md:p-4 font-bold text-right">{getDate(props?.day?.date)}</div>
            <Show when={props?.day?.isToday}>
                <div class="bg-secondary">Today</div>
            </Show>
        </div>
    )
}

export default DayOfMonth
