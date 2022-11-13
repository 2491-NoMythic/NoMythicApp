import { useSearchParams } from '@solidjs/router'
import { Accessor, Component, createResource, createSignal, For } from 'solid-js'
import { getEventsForDay } from '../api/events'
import { toDate, toYMD } from '../calendar/utilities'

/*
    Allows selection of an event for a given date
*/
type input = { eventDate: Accessor<string> }
const EventSelector: Component<input> = (props) => {
    const [events, { mutate, refetch }] = createResource(props.eventDate(), getEventsForDay)

    const changeHandler = (event) => {
        console.log(event.target.selectedOptions[0].value)
    }

    return (
        <div class="form-control">
            <label class="label">
                <span class="label-text">Select Event</span>
            </label>
            <select class="select select-bordered" onChange={changeHandler}>
                <option disabled selected={events !== null}>
                    Select one
                </option>
                <For each={events()}>
                    {(event) => {
                        return (
                            <option value={event.event_id}>
                                {event.title !== '' ? event.title : event.event_type}
                            </option>
                        )
                    }}
                </For>
            </select>
        </div>
    )
}

export default EventSelector
