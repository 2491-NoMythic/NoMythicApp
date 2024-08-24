import { A } from '@solidjs/router'
import { Component, createResource, createSignal, For, JSX, Show } from 'solid-js'
import { getMealList, saveMentor, updateMentor } from '../../api/meals'
import { RouteKeys } from '../../components/AppRouting'
import YearPicker from '../../components/YearPicker'
import { useNoMythicUser } from '../../contexts/UserContext'
import { MealInfo, MealListItem, Member, Parent, TeamRole } from '../../types/Api'
import { isEmpty } from '../../utilities/bitsAndBobs'
import { formatEnumValue, formatUrl } from '../../utilities/formatters'

const MealList: Component = () => {
    //TODO: hard coded to current year ??? need to change
    const [year, setYear] = createSignal('2025')
    const [mealList, { refetch }] = createResource(year, getMealList)
    const { member } = useNoMythicUser()

    /**
     * Create a link to assign mentor, or view member info on member
     * If no mentor assigned, a click will call updateMealMentor
     *
     * @param eventId number
     * @param mealId number
     * @param mentor Member
     * @returns
     */
    const mentorLink = (eventId: number, mealId: number, mentor: Member) => {
        if (mentor === undefined || mentor === null) {
            if (member().team_role === TeamRole.MENTOR) {
                return (
                    <span class="tooltip" data-tip="Assign Yourself">
                        <a href="" onClick={[updateMealMentor, { eventId, mealId }]}>
                            <span class="text-error">Missing</span>
                        </a>
                    </span>
                )
            }
            return <span class="text-error">Missing</span>
        }
        return (
            <span class="tooltip" data-tip="Mentor Info">
                <A href={formatUrl(RouteKeys.MEMBER_VIEW.nav, { mid: mentor?.member_id }, { back: 'MEAL_LIST' })}>
                    {mentor.first_name} {mentor.last_name}
                </A>
            </span>
        )
    }

    /**
     * Create link to go view parent information (phone/email/etc) if provided
     *
     * @param parent Parent
     * @returns
     */
    const parentLink = (parent: Parent) => {
        if (parent === undefined || parent === null) {
            return <span class="text-error">Missing</span>
        }
        return (
            <span class="tooltip" data-tip="Parent Info">
                <A
                    href={formatUrl(
                        RouteKeys.PARENT_VIEW.nav,
                        { mid: parent?.member_id, pid: parent?.parent_id },
                        { back: 'MEAL_LIST' }
                    )}
                >
                    {parent.first_name} {parent.last_name}
                </A>
            </span>
        )
    }

    /**
     * Creates a link to navigate to create a meal record
     * Meal record is maybe not created, or meal name not entered
     *
     * @param eventId number
     * @param meal MealInfo
     * @returns
     */
    const mealLink = (eventId: number, meal: MealInfo) => {
        let text: JSX.Element
        if (meal === undefined || meal === null) {
            text = <span class="text-error">Not Created</span>
        } else if (isEmpty(meal.meal_name)) {
            text = <span class="text-secondary">Not Entered</span>
        } else {
            text = <span>{meal.meal_name}</span>
        }
        return (
            <span class="tooltip" data-tip="Edit Meal">
                <A href={formatUrl(RouteKeys.MEAL_EDIT.nav, { id: eventId }, { back: 'MEAL_LIST' })}>{text}</A>
            </span>
        )
    }

    /**
     * Create a link to navigate to edit an event.
     * back used to track where to return to
     *
     * @param event MealListItem
     * @returns
     */
    const eventLink = (event: MealListItem) => {
        return (
            <span class="tooltip" data-tip="Edit Event">
                <A href={formatUrl(RouteKeys.EVENT_EDIT.nav, { id: event?.event_id }, { back: 'MEAL_LIST' })}>
                    {event.event_date}
                </A>
            </span>
        )
    }

    /**
     * Support assigning user (member) to mentorId.
     * If no meal record yet, need to create one instead of update
     */
    type Data = { eventId: number; mealId: number }
    const updateMealMentor = async (data: Data, event: Event) => {
        event.preventDefault()
        if (data.mealId === undefined) {
            await saveMentor(data.eventId, member().member_id)
        } else {
            await updateMentor(data.eventId, member().member_id)
        }
        refetch()
    }

    return (
        <div>
            <div class="flex">
                <div class="grow m-2 lg:m-8">
                    This is list a of events that have the 'Includes Meal' flag set. Click on event date to edit event.
                    Click on meal name to edit meal. Click on mentor or parent name to view info. If Mentor is missing,
                    clicking will assign you as the mentor.
                </div>
                <YearPicker year={year} setYear={setYear} />
            </div>
            <Show when={mealList() !== undefined}>
                <table class="table table-zebra w-full mt-4">
                    <thead class="hidden lg:table-header-group">
                        <tr>
                            <th>Event Date</th>
                            <th>Event Type</th>
                            <th>Meal Name</th>
                            <th>Mentor</th>
                            <th>Parent</th>
                        </tr>
                    </thead>
                    <tbody>
                        <For each={mealList()}>
                            {(eventMeal) => {
                                return (
                                    <tr>
                                        <td>{eventLink(eventMeal)}</td>
                                        <td>{formatEnumValue(eventMeal.event_type)}</td>
                                        <td>{mealLink(eventMeal?.event_id, eventMeal?.meals[0])}</td>
                                        <td>
                                            {mentorLink(
                                                eventMeal?.event_id,
                                                eventMeal?.meals[0]?.meal_id,
                                                eventMeal?.meals[0]?.members
                                            )}
                                        </td>
                                        <td>{parentLink(eventMeal?.meals[0]?.parent)}</td>
                                    </tr>
                                )
                            }}
                        </For>
                    </tbody>
                </table>
            </Show>
        </div>
    )
}

export default MealList
