import { Accessor, Component, createResource, createSignal, For, onMount, Show, Suspense } from 'solid-js'
import { getAttendanceByEvent } from '../../api/attendance'
import { getMemberCount } from '../../api/members'
import AttendanceStats from '../../components/AttendanceStats'
import PageLoading from '../../components/PageLoading'
import { Attendance, AttendanceTypes } from '../../types/Api'
import { isEmpty } from '../../utilities/bitsAndBobs'
import { calculateMonth, formatEnumValue } from '../../utilities/formatters'
import { sortEventAttendance } from '../../utilities/sorts'

const AttendanceForSeasonByPractice: Component<{ season: Accessor<string> }> = (props) => {
    const [attendance, { mutate, refetch }] = createResource(props.season, getAttendanceByEvent)
    const [memberCount, setMemberCount] = createSignal<number>(0)

    let currentMonth = ''

    onMount(async () => {
        const count = await getMemberCount()
        setMemberCount(count)
    })

    const countAttendance = (attendance: Attendance[]) => {
        if (isEmpty(attendance)) return 0
        const filtered = attendance.filter((person) => {
            return person.attendance === AttendanceTypes.FULL_TIME || person.attendance === AttendanceTypes.PART_TIME
        })
        return filtered?.length
    }

    return (
        <div class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 mt-4 mb-4">
            <Show when={attendance() !== undefined}>
                <div class="text-xl font-semibold">
                    {attendance()?.length} meetings in season {props.season()}
                </div>
                <For each={sortEventAttendance(attendance(), 'DESC')}>
                    {(event) => {
                        let showMonth = false
                        const month = calculateMonth(event.event_date)
                        if (currentMonth !== month) {
                            currentMonth = month
                            showMonth = true
                        }
                        return (
                            <>
                                <Show when={showMonth}>
                                    <div class="text-xl font-semibold md:col-span-2 2xl:col-span-3 -mb-4">{month}</div>
                                </Show>
                                <AttendanceStats
                                    eventId={event?.event_id}
                                    meetingDate={event?.event_date}
                                    meetingCount={countAttendance(event?.attendance)}
                                    meetingType={formatEnumValue(event.event_type)}
                                    teamSize={memberCount()}
                                />
                            </>
                        )
                    }}
                </For>
            </Show>
        </div>
    )
}

export default AttendanceForSeasonByPractice
