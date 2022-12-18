import { format } from 'date-fns'
import { Component, Show } from 'solid-js'
import { toDate } from '../calendar/utilities'
import { RobotEvent } from '../types/Api'
import { eventColors } from '../types/UiConstants'
import { formatEnumValue } from '../utilities/formatters'
import IoCalendarOutline from './icons/IoCalendarOutline'

const SelectedEvent: Component<{ robotEvent: RobotEvent }> = (props) => {
    return (
        <div class="alert shadow-lg mt-4">
            <div>
                <div class={eventColors[props.robotEvent?.event_type]}>
                    <IoCalendarOutline />
                </div>
                <div>
                    <h3 class="font-bold break-all overflow-hidden h-7">
                        {format(toDate(props.robotEvent?.event_date || '1900-01-01'), 'MMMM d')}{' '}
                        {formatEnumValue(props.robotEvent?.event_type)}{' '}
                        <Show when={props.robotEvent?.title}>
                            {' - '}
                            {props.robotEvent?.title}
                        </Show>
                    </h3>
                    <div class="text-xs">
                        {props.robotEvent?.all_day === true ? (
                            'All Day'
                        ) : props.robotEvent?.start_time ? (
                            <span>
                                {props.robotEvent?.start_time} to {props.robotEvent?.end_time}
                            </span>
                        ) : (
                            ''
                        )}
                        {props.robotEvent?.virtual && <span> - Virtual</span>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SelectedEvent
