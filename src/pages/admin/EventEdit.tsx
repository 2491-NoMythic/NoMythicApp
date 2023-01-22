import { Component, createResource, createSignal, Show, Suspense } from 'solid-js'
import { EventTypes, EventTypesType } from '../../types/Api'
import * as yup from 'yup'
import { useParams, useSearchParams, useNavigate, A } from '@solidjs/router'
import { useFormHandler, yupSchema } from 'solid-form-handler'
import { deleteEvent, getEventById, saveEvent, updateEvent } from '../../api/events'
import { RouteKeys } from '../../components/AppRouting'
import { SelectableField, DateField, TextField } from '../../components/forms'
import PageLoading from '../../components/PageLoading'
import { TextArea } from '../../components/forms/TextArea'
import { isValid } from 'date-fns'
import { getToday, isValidTime, toDate, toYMD } from '../../calendar/utilities'
import { formatUrl } from '../../utilities/formatters'
import { Checkbox } from '../../components/forms/Checkbox'
import { createInputMask } from '@solid-primitives/input-mask'
import { HiOutlineTrash } from 'solid-icons/hi'
import Config from '../../config'

// Definition of the fields we will do validation on
type RobotEvent = {
    event_date: string
    event_type: EventTypesType
    description: string
    title: string
    start_time: string
    end_time: string
    virtual: boolean
    all_day: boolean
    take_attendance: boolean
    has_meal: boolean
}

// helper for yup transform function
const emptyStringToNull = (value, originalValue) => {
    if (typeof originalValue === 'string' && originalValue === '') {
        return null
    }
    return value
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
    title: yup.string().notRequired().max(50).nullable(),
    start_time: yup
        .string()
        .notRequired()
        .transform(emptyStringToNull)
        .nullable()
        .test('is-time', 'Invalid time', (value) => {
            return isValidTime(value)
        }),
    end_time: yup
        .string()
        .notRequired()
        .transform(emptyStringToNull)
        .nullable()
        .test('is-time', 'Invalid time', (value) => {
            return isValidTime(value)
        }),
    virtual: yup.boolean().required().default(false),
    all_day: yup.boolean().required().default(false),
    take_attendance: yup.boolean().required().default(false), // will not work defaulting to true
    has_meal: yup.boolean().required().default(false),
})

const timeInputHandler = createInputMask([/^[0-9]{1,2}/, ':', /[0-9]{1,2}/, ' ', /[ap|AP]/, /[m|M]/])

const EventEdit: Component = () => {
    const formHandler = useFormHandler(yupSchema(eventSchema))
    const { formData } = formHandler
    const params = useParams()
    const [searchParams] = useSearchParams()
    const [opened, setOpened] = createSignal(false)
    const [robotEvent] = createResource(() => parseInt(params.id), getEventById)
    const navigate = useNavigate()

    const toggleModal = () => {
        setOpened(!opened())
    }

    const handleDelete = async (event) => {
        event.preventDefault()
        setOpened(false)
        await deleteEvent(robotEvent()?.event_id)
        navigate(RouteKeys.FULL_CALENDAR.nav)
    }

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
                start_time: formData().start_time.toUpperCase(),
                end_time: formData().end_time.toUpperCase(),
                virtual: formData().virtual,
                all_day: formData().all_day,
                take_attendance: formData().take_attendance,
                has_meal: formData().has_meal,
            }
            if (robotEvent()?.event_id === undefined) {
                await saveEvent(updatedEvent)
            } else {
                await updateEvent(updatedEvent)
            }
            navigate(navUrl())
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

    const navUrl = () => {
        if (searchParams.back === 'ATTENDANCE') {
            return formatUrl(RouteKeys.TAKE_ATTENDANCE.nav)
        } else if (searchParams.back === 'CHECKIN') {
            return formatUrl(RouteKeys.TAKE_CHECKIN.nav)
        } else {
            return formatUrl(RouteKeys.FULL_CALENDAR.nav, {}, { date: formData().event_date })
        }
    }

    return (
        <Suspense fallback={<PageLoading />}>
            <div class="card max-w-5xl bg-base-100 shadow-xl mt-4">
                <div class="card-body">
                    <Show when={robotEvent()?.event_id === undefined} fallback={<h2 class="card-title">Edit Event</h2>}>
                        <h2 class="card-title">New Event</h2>
                    </Show>
                    <Show when={robotEvent() !== undefined}>
                        <form>
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

                                <Checkbox
                                    label="Take Attendance"
                                    name="take_attendance"
                                    checked={robotEvent() === null ? true : robotEvent().take_attendance}
                                    formHandler={formHandler}
                                />

                                <Show when={Config.hasTeamMeals}>
                                    <Checkbox
                                        label="Includes Meal"
                                        name="has_meal"
                                        checked={robotEvent() === null ? true : robotEvent().has_meal}
                                        formHandler={formHandler}
                                    />
                                </Show>
                            </div>
                        </form>
                        <div class="flex">
                            <Show when={params.id !== '0'}>
                                <div class="flex-none">
                                    <button class="btn btn-error inline-flex items-center" onClick={toggleModal}>
                                        <HiOutlineTrash fill="none" class="mr-3 mb-3" />
                                        Delete
                                    </button>
                                </div>
                            </Show>
                            <div class="card-actions grow justify-end">
                                <A href={navUrl()}>
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
                        </div>
                    </Show>
                </div>
            </div>
            <Show when={opened()}>
                <div class="modal modal-open">
                    <div class="modal-box">
                        <h3 class="font-bold text-lg">Are you sure you want to delete?</h3>
                        <p class="py-4">You cannot restore the event after deleting.</p>
                        <div class="modal-action">
                            <button class="btn btn-secondary" onClick={toggleModal}>
                                Cancel
                            </button>
                            <button class="btn btn-error inline-flex items-center" onClick={handleDelete}>
                                <HiOutlineTrash fill="none" class="mb-3 mr-3" /> Delete
                            </button>
                        </div>
                    </div>
                </div>
            </Show>
        </Suspense>
    )
}

export default EventEdit
