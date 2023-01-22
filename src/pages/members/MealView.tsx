import { useParams, useSearchParams, useNavigate, A } from '@solidjs/router'
import { format } from 'date-fns'
import { Component, createEffect, createResource, Show, Suspense } from 'solid-js'
import { getEventById } from '../../api/events'
import { getMealInfoByEventId } from '../../api/meals'
import { toDate } from '../../calendar/utilities'
import { RouteKeys } from '../../components/AppRouting'
import IoCalendarOutline from '../../components/icons/IoCalendarOutline'
import PageLoading from '../../components/PageLoading'
import { eventColors } from '../../types/UiConstants'
import { formatEnumValue, formatUrl } from '../../utilities/formatters'

const MealView: Component = () => {
    const params = useParams()
    const [searchParams] = useSearchParams()
    const [mealInfo] = createResource(() => parseInt(params.id), getMealInfoByEventId)
    const [event] = createResource(() => parseInt(params.id), getEventById)
    const navigate = useNavigate()

    createEffect(() => {
        // but we don't want to auto send to edit for non admin
        // if (event()?.event_id !== undefined && mealInfo() === null) {
        //     navigate(formatUrl(RouteKeys.MEAL_EDIT.nav, { id: event()?.event_id }, { date: searchParams?.date }))
        // }
    })

    const getEventInfo = () => {
        return (
            <>
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
            </>
        )
    }

    return (
        <Suspense fallback={<PageLoading />}>
            <div class="card max-w-5xl bg-base-100 shadow-xl mt-4">
                <div class="card-body">
                    <div class="card-title">
                        <Show when={mealInfo()?.meal_id === undefined} fallback={<span>View Meal</span>}>
                            <span>Meal Not Entered</span>
                        </Show>
                        <span> - {format(toDate(event()?.event_date), 'MMMM d')}</span>
                    </div>
                    <Show when={event() !== undefined}>{getEventInfo()}</Show>
                    <table class="table table-compact w-full mt-4">
                        <tbody>
                            <tr>
                                <td>Mentor</td>
                                <td>
                                    {mealInfo()?.members?.first_name} {mealInfo()?.members?.last_name}
                                </td>
                            </tr>
                            <tr>
                                <td>Parent</td>
                                <td>
                                    {mealInfo()?.parent?.first_name} {mealInfo()?.parent?.last_name}
                                </td>
                            </tr>
                            <tr>
                                <td>Meal</td>
                                <td>{mealInfo()?.meal_name}</td>
                            </tr>
                            <tr>
                                <td>Description</td>
                                <td>{mealInfo()?.description}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="flex">
                        <div class="flex flex-auto justify-end">
                            <label class="btn btn-secondary modal-button mr-4">
                                <A href={formatUrl(RouteKeys.FULL_CALENDAR.nav, {}, { date: searchParams?.date })}>
                                    Back
                                </A>
                            </label>
                            <label class="btn btn-primary modal-button">
                                <A
                                    href={formatUrl(
                                        RouteKeys.MEAL_EDIT.nav,
                                        { id: event()?.event_id },
                                        { date: searchParams?.date }
                                    )}
                                >
                                    <Show when={mealInfo()?.meal_id === undefined} fallback={<span>Edit</span>}>
                                        <span>New</span>
                                    </Show>
                                </A>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </Suspense>
    )
}

export default MealView
