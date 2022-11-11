import { Component, createEffect, createResource, Show, Suspense } from 'solid-js'
import { EventTypes, EventTypesType, TeamRole } from '../../types/Api'
import * as yup from 'yup'
import { useParams, useSearchParams, useNavigate, A } from '@solidjs/router'
import { useFormHandler, yupSchema } from 'solid-form-handler'
import { getEventById, saveEvent, updateEvent } from '../../api/events'
import { RouteKeys } from '../../components/AppRouting'
import { SelectableField, DateField, TextField } from '../../components/forms'
import PageLoading from '../../components/PageLoading'
import { TextArea } from '../../components/forms/TextArea'
import { isValid } from 'date-fns'
import { getToday, toDate, toYMD } from '../../calendar/utilities'
import { formatUrl } from '../../utilities/formatters'
import { Checkbox } from '../../components/forms/Checkbox'
import { createInputMask } from '@solid-primitives/input-mask'

// Definition of the fields we will do validatio on
type RobotEvent = {
    event_date: string
    event_type: EventTypesType
    description: string
    title: string
    start_time: string
    end_time: string
    virtual: boolean
    all_day: boolean
}

// these are the validation rules
// Yup date validation sucks, made my own using string
export const eventSchema: yup.SchemaOf<RobotEvent> = yup.object({
    event_date: yup
        .string()
        .required()
        .test('is-date', 'Not a valid date', (value) => {
            return isValid(toDate(value))
        }),
    event_type: yup
        .mixed<EventTypesType>()
        .oneOf(['regular_practice', 'extra_practice', 'competition', 'event', 'meeting'], 'Please select'),
    description: yup.string().notRequired().max(300, 'Max 300 characters'),
    title: yup.string().notRequired().max(50),
    start_time: yup.string().notRequired(),
    end_time: yup.string().notRequired(),
    virtual: yup.boolean().required().default(false),
    all_day: yup.boolean().required().default(false),
})

const timeInputHandler = createInputMask('99:99 aa')

const EventEdit: Component = () => {
    const formHandler = useFormHandler(yupSchema(eventSchema))
    const { formData } = formHandler
    const params = useParams()
    const [searchParams] = useSearchParams()
    const [robotEvent] = createResource(() => parseInt(params.id), getEventById)
    const navigate = useNavigate()

    const submit = async (event: Event) => {
        try {
            event.preventDefault()
            await formHandler.validateForm()
            const updatedEvent = {
                event_id: robotEvent()?.event_id,
                event_date: formData().event_date,
                event_type: formData().event_type,
                description: formData().description,
                title: formData().title,
                start_time: formData().start_time,
                end_time: formData().end_time,
                virtual: formData().virtual,
                all_day: formData().all_day,
            }
            if (robotEvent()?.event_id === undefined) {
                await saveEvent(updatedEvent)
            } else {
                await updateEvent(updatedEvent)
            }
            navigate(formatUrl(RouteKeys.FULL_CALENDAR.nav, {}, { date: searchParams.date }))
        } catch (error) {
            console.error(error)
        }
    }

    const dateToShow = () => {
        let theDate = robotEvent()?.event_date
        if (!theDate) {
            if (searchParams.date) {
                theDate = searchParams.date
            } else {
                theDate = toYMD(getToday())
            }
        }
        return theDate
    }

    return (
        <Suspense fallback={<PageLoading />}>
            <div class="card max-w-5xl bg-base-100 shadow-xl mt-4">
                <div class="card-body">
                    <Show when={robotEvent()?.event_id === undefined} fallback={<h2 class="card-title">Edit Event</h2>}>
                        <h2 class="card-title">New Event</h2>
                    </Show>
                    <Show when={robotEvent() !== undefined}>
                        <form onSubmit={submit}>
                            <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
                                <DateField
                                    label="Event Date"
                                    altLabel="Required"
                                    name="event_date"
                                    value={dateToShow()}
                                    formHandler={formHandler}
                                />

                                <SelectableField
                                    label="Event Type"
                                    altLabel="Required"
                                    name="event_type"
                                    options={[
                                        { value: EventTypes.REGULAR_PRACTICE, label: 'Regular Practice' },
                                        { value: EventTypes.EXTRA_PRACTICE, label: 'Extra Practice' },
                                        { value: EventTypes.MEETING, label: 'Meeting' },
                                        { value: EventTypes.EVENT, label: 'Community Event' },
                                        { value: EventTypes.COMPETITION, label: 'Competition' },
                                    ]}
                                    value={robotEvent()?.event_type}
                                    formHandler={formHandler}
                                />

                                <TextField
                                    label="Event Title"
                                    name="title"
                                    value={robotEvent()?.title}
                                    formHandler={formHandler}
                                />

                                <div class="max-w-sm flex">
                                    <Checkbox
                                        label="Virtual"
                                        name="virtual"
                                        checked={robotEvent()?.virtual}
                                        formHandler={formHandler}
                                    />
                                    <Checkbox
                                        label="All Day"
                                        name="all_day"
                                        checked={robotEvent()?.all_day}
                                        formHandler={formHandler}
                                    />
                                </div>

                                <Show when={!formData()?.all_day}>
                                    <TextField
                                        label="Start Time"
                                        name="start_time"
                                        altLabel="00:00 AM/PM"
                                        value={robotEvent()?.start_time}
                                        formHandler={formHandler}
                                        onInput={timeInputHandler}
                                        onPaste={timeInputHandler}
                                    />

                                    <TextField
                                        label="End Time"
                                        name="end_time"
                                        altLabel="00:00 AM/PM"
                                        value={robotEvent()?.end_time}
                                        formHandler={formHandler}
                                        onInput={timeInputHandler}
                                        onPaste={timeInputHandler}
                                    />
                                </Show>
                                <TextArea
                                    label="Description"
                                    altLabel="Anything"
                                    name="description"
                                    value={robotEvent()?.description}
                                    formHandler={formHandler}
                                    class="h-24"
                                />
                            </div>
                            <div class="card-actions justify-end">
                                <A
                                    href={formatUrl(
                                        RouteKeys.FULL_CALENDAR.nav,
                                        {},
                                        { date: searchParams.date ? searchParams.date : toYMD(getToday()) }
                                    )}
                                >
                                    <button class="btn btn-secondary modal-button mr-6">Cancel</button>
                                </A>
                                <button
                                    class="btn btn-primary modal-button"
                                    disabled={formHandler.isFormInvalid()}
                                    onClick={submit}
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </Show>
                </div>
            </div>
        </Suspense>
    )
}

export default EventEdit
