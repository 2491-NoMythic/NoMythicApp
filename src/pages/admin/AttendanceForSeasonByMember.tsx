import { useNavigate } from '@solidjs/router'
import { Accessor, Component, createEffect, createMemo, createResource, createSignal, For, Show } from 'solid-js'
import { getAttendanceForAllMembers } from '../../api/attendance'
import { getSeasonEvents } from '../../api/events'
import { getMembers } from '../../api/members'
import { toDate } from '../../calendar/utilities'
import { RouteKeys } from '../../components/AppRouting'
import SubTeamSelector from '../../components/SubTeamSelector'
import { useSessionContext } from '../../contexts/SessionContext'
import { AttendanceTypes, EventTypes, Member, RobotEvent, SubTeam } from '../../types/Api'
import { isEmpty } from '../../utilities/bitsAndBobs'
import { filterBySubTeam } from '../../utilities/filters'
import { calculatePercent, capitalizeWord, formatUrl } from '../../utilities/formatters'
import { sortByFirstName } from '../../utilities/sorts'
import Config from '../../config'

const AttendanceForSeasonByMember: Component<{ season: Accessor<string> }> = (props) => {
    const [allAttendance] = createResource(props.season, getAttendanceForAllMembers)
    const [members] = createResource(props.season, getMembers)
    const [events] = createResource(props.season, getSeasonEvents)
    const [filteredMembers, setFilteredMembers] = createSignal<Member[]>([])
    const [sessionValues] = useSessionContext()
    const navigate = useNavigate()

    // creating a lookup map of events to get info by event_id from attendance later
    const eventMap = createMemo(() => {
        const eventMap = new Map<number, RobotEvent>()
        events()?.forEach((anEvent) => {
            eventMap.set(anEvent.event_id, anEvent)
        })
        return eventMap
    })

    // total number of all events
    const allEventCount = createMemo(() => {
        return isEmpty(events()) ? 0 : events().length
    })

    // number of all regular meetings
    const allRegularCount = createMemo(() => {
        if (isEmpty(events())) {
            return 0
        }
        const records = events().filter((record) => {
            const event = eventMap().get(record.event_id)
            return event.event_type === EventTypes.REGULAR_PRACTICE
        })
        return records.length
    })

    // function to get the number of attended events by a member of the last few regular events (Config.lastNumPracticesAttended).
    // events should be sorted on backend
    const lastFewRegularCount = (memberId: number) => {
        if (isEmpty(events())) {
            return 0
        }
        // get only regular events
        const filtered = events().filter((event: RobotEvent) => {
            return event.event_type === EventTypes.REGULAR_PRACTICE
        })
        if (isEmpty(filtered)) {
            return 0
        }
        // need the date of the practice we are going by
        let lastDate: string
        // if we have less events than the number we are looking for, take the last one
        if (filtered.length < Config.lastNumPracticesAttended) {
            lastDate = filtered[filtered.length - 1].event_date
        } else {
            lastDate = filtered[Config.lastNumPracticesAttended - 1].event_date
        }
        // now find the attendance records for the events limited by the date we figured out
        const records = allAttendance().filter((record) => {
            const event = eventMap().get(record.event_id)
            // undefined means the event shouldn't have had attendance records on it
            return (
                event !== undefined &&
                record.member_id === memberId &&
                event.event_type === EventTypes.REGULAR_PRACTICE &&
                record.attendance !== AttendanceTypes.ABSENT &&
                toDate(record.meeting_date) >= toDate(lastDate)
            )
        })
        if (isEmpty(records)) {
            return 0
        }
        return records.length
    }

    // function to get practices attended by a member
    const getFullCount = (memberId: number) => {
        if (isEmpty(allAttendance())) {
            return 0
        }
        const data = allAttendance().filter((record) => {
            const event = eventMap().get(record.event_id)
            // undefined means the event shouldn't have had attendance records on it
            return event !== undefined && record.member_id === memberId && record.attendance !== AttendanceTypes.ABSENT
        })
        return isEmpty(data) ? 0 : data.length
    }

    // function to get regular practices attended by a member
    const getRegularCount = (memberId: number) => {
        if (isEmpty(allAttendance())) {
            return 0
        }
        const data = allAttendance().filter((record) => {
            const event = eventMap().get(record.event_id)
            // undefined means the event shouldn't have had attendance records on it
            return (
                event !== undefined &&
                record.member_id === memberId &&
                event.event_type === EventTypes.REGULAR_PRACTICE &&
                record.attendance !== AttendanceTypes.ABSENT
            )
        })
        return isEmpty(data) ? 0 : data.length
    }

    type memberIdType = { memberId: number }
    const handleNavToMember = (data: memberIdType, event) => {
        event.preventDefault()
        navigate(formatUrl(RouteKeys.ATTENDANCE_MEMBER.nav, { mid: data.memberId }, { season: props.season() }))
    }

    // runs whenever team/subTeam are changed
    createEffect(() => {
        const filtered = filterBySubTeam(members(), sessionValues.subTeam)
        const sorted = sortByFirstName(filtered)
        setFilteredMembers(sorted)
    })

    // the show prevents race condition when solid can't tell eventMap updated on it's own
    return (
        <Show when={eventMap()?.size > 0 && allAttendance()?.length > 0}>
            <div>
                <div class="text-l lg:text-xl font-semibold p-4">
                    {allRegularCount()} regular meetings of {allEventCount()} total events in season {props.season()}
                </div>
                <div>
                    <SubTeamSelector />
                </div>
                <table class="table table-compact table-zebra w-full mt-4">
                    <thead>
                        <tr class="hidden lg:table-row">
                            <td>First Name</td>
                            <td>Last Name</td>
                            <td>Sub Team</td>
                            <td>Team Role</td>
                            <td>All</td>
                            <td>Regular</td>
                            <td>Last {Config.lastNumPracticesAttended}</td>
                        </tr>
                        <tr class="table-row lg:hidden">
                            <td>Member</td>
                            <td>All</td>
                            <td>Regular</td>
                            <td>Last {Config.lastNumPracticesAttended}</td>
                        </tr>
                    </thead>
                    <tbody>
                        <For each={filteredMembers()}>
                            {(record) => {
                                const fullCount = getFullCount(record.member_id)
                                const regularCount = getRegularCount(record.member_id)
                                const lastFew = lastFewRegularCount(record.member_id)
                                return (
                                    <tr>
                                        <td
                                            onClick={[handleNavToMember, { memberId: record.member_id }]}
                                            class="hidden lg:table-cell cursor-pointer"
                                        >
                                            {record.first_name}
                                        </td>
                                        <td
                                            onClick={[handleNavToMember, { memberId: record.member_id }]}
                                            class="hidden lg:table-cell cursor-pointer"
                                        >
                                            {record.last_name}
                                        </td>
                                        <td class="hidden lg:table-cell">{capitalizeWord(record.sub_team)}</td>
                                        <td class="hidden lg:table-cell">{capitalizeWord(record.team_role)}</td>
                                        <td
                                            onClick={[handleNavToMember, { memberId: record.member_id }]}
                                            class="lg:hidden cursor-pointer"
                                        >
                                            {record.first_name} {record.last_name}
                                            <div class="text-secondary">
                                                {capitalizeWord(record.team_role)}
                                                <Show when={record.sub_team !== SubTeam.UNASSIGNED}>
                                                    <span class="text-base-content"> of </span>
                                                    {capitalizeWord(record.sub_team)}
                                                </Show>
                                            </div>
                                        </td>
                                        <td>
                                            {fullCount} ({calculatePercent(fullCount, allEventCount())}%)
                                        </td>
                                        <td>
                                            {regularCount} ({calculatePercent(regularCount, allRegularCount())}%)
                                        </td>
                                        <td>{lastFew}</td>
                                    </tr>
                                )
                            }}
                        </For>
                    </tbody>
                </table>
            </div>
        </Show>
    )
}

export default AttendanceForSeasonByMember
