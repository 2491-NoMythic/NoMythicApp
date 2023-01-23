import { A, useNavigate, useParams, useSearchParams } from '@solidjs/router'
import { format } from 'date-fns'
import { useFormHandler, yupSchema } from 'solid-form-handler'
import { HiOutlineTrash } from 'solid-icons/hi'
import { Component, createMemo, createResource, createSignal, Show, Suspense } from 'solid-js'
import * as yup from 'yup'
import { getEventById } from '../../api/events'
import { deleteMeal, getMealByEventId, getMealById, saveMeal, updateMeal } from '../../api/meals'
import { getMembers } from '../../api/members'
import { getAllParents } from '../../api/parents'
import { toDate } from '../../calendar/utilities'
import { RouteKeys } from '../../components/AppRouting'
import { SelectableField } from '../../components/forms/SelectableField'
import { TextArea } from '../../components/forms/TextArea'
import { TextField } from '../../components/forms/Textfield'
import IoCalendarOutline from '../../components/icons/IoCalendarOutline'
import PageLoading from '../../components/PageLoading'
import { eventColors } from '../../types/UiConstants'
import { formatEnumValue, formatUrl } from '../../utilities/formatters'

type Meal = {
    mentor_id: number
    parent_id: number
    meal_name: string
    description: string
}

// helper for yup transform function
const emptyStringToNull = (value, originalValue) => {
    if (typeof originalValue === 'string' && originalValue === '') {
        return null
    }
    return value
}

export const mealSchema: yup.SchemaOf<Meal> = yup.object({
    mentor_id: yup.number().required('Required Field').transform(emptyStringToNull).nullable(),
    parent_id: yup.number().notRequired().transform(emptyStringToNull).nullable(),
    meal_name: yup.string().notRequired().max(50),
    description: yup.string().notRequired().max(250),
})

const MealEdit: Component = () => {
    const formHandler = useFormHandler(yupSchema(mealSchema))
    const { formData } = formHandler
    const params = useParams()
    const [searchParams] = useSearchParams()
    const [opened, setOpened] = createSignal(false)
    const [eventMeal] = createResource(() => parseInt(params.id), getMealByEventId)
    const [event] = createResource(() => parseInt(params.id), getEventById)
    const [members] = createResource('2023', getMembers)
    const [allParents] = createResource('2023', getAllParents)
    const navigate = useNavigate()

    const createOptions = (data: Array<any>, valueName: string) => {
        if (data === undefined) return []
        const options = data.map((item) => {
            return { value: item[valueName], label: `${item.first_name} ${item.last_name}` }
        })
        return options
    }

    const mentors = createMemo(() => {
        if (members() === undefined) return []
        const filtered = members().filter((item) => item?.team_role === 'mentor')
        return createOptions(filtered, 'member_id')
    })
    const parents = createMemo(() => createOptions(allParents(), 'parent_id'))

    const toggleModal = () => {
        setOpened(!opened())
    }

    const handleDelete = async (event) => {
        event.preventDefault()
        setOpened(false)
        await deleteMeal(eventMeal()?.meal_id)
        navigate(RouteKeys.FULL_CALENDAR.nav)
    }

    const submit = async (event: Event) => {
        try {
            event.preventDefault()
            await formHandler.validateForm()
            const updatedMeal = {
                meal_id: eventMeal()?.meal_id,
                event_id: parseInt(params.id),
                mentor_id: formData().mentor_id,
                parent_id: emptyStringToNull(formData().parent_id, formData().parent_id),
                meal_name: formData().meal_name,
                description: formData().description,
            }
            if (eventMeal()?.meal_id === undefined) {
                await saveMeal(updatedMeal)
            } else {
                await updateMeal(updatedMeal)
            }
            navigate(navUrl())
        } catch (error) {
            console.error(error)
        }
    }

    const navUrl = () => {
        //if (searchParams.back === 'CALENDAR') {
        return formatUrl(RouteKeys.FULL_CALENDAR.nav, {}, { date: searchParams?.date })
        //}
    }

    const getEventInfo = () => {
        return (
            <div class="mt-4">
                <div class="flex">
                    <div class={eventColors[event()?.event_type]}>
                        <IoCalendarOutline />
                    </div>
                    <div class="ml-4 grow">
                        <div>
                            {formatEnumValue(event()?.event_type)} {event()?.virtual && <span> - Virtual</span>}
                        </div>

                        <div>{event()?.title}</div>
                        <div>
                            {event()?.all_day === true ? (
                                'All Day'
                            ) : event()?.start_time ? (
                                <span>
                                    {event()?.start_time} to {event()?.end_time}
                                </span>
                            ) : (
                                ''
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    return (
        <Suspense fallback={<PageLoading />}>
            <div class="card max-w-5xl bg-base-100 shadow-xl mt-4">
                <div class="card-body">
                    <div class="card-title">
                        <Show when={eventMeal()?.meal_id === undefined} fallback={<span>Edit Meal</span>}>
                            <span>New Meal</span>
                        </Show>
                        <span> - {format(toDate(event()?.event_date), 'MMMM d')}</span>
                    </div>
                    <Show when={event() !== undefined}>{getEventInfo()}</Show>
                    <Show when={eventMeal() !== undefined}>
                        <form>
                            <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 mt-8">
                                <SelectableField
                                    label="Meal Mentor"
                                    altLabel="Required"
                                    name="mentor_id"
                                    options={mentors()}
                                    value={eventMeal()?.mentor_id}
                                    formHandler={formHandler}
                                />
                                <SelectableField
                                    label="Meal Parent"
                                    name="parent_id"
                                    options={parents()}
                                    value={eventMeal()?.parent_id}
                                    formHandler={formHandler}
                                />
                                <TextField
                                    label="Meal Name"
                                    name="meal_name"
                                    value={eventMeal()?.meal_name}
                                    formHandler={formHandler}
                                />
                                <TextArea
                                    label="Description"
                                    altLabel="More info"
                                    name="description"
                                    value={eventMeal()?.description}
                                    formHandler={formHandler}
                                    class="h-24"
                                />
                            </div>
                        </form>
                        <div class="flex">
                            <Show when={eventMeal()?.meal_id !== undefined}>
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

export default MealEdit
