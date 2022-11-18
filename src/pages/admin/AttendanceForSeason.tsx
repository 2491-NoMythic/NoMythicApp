import { createResource, createSignal, For, onMount, Show, Suspense } from 'solid-js'
import { getAttendanceByEvent } from '../../api/attendance'
import { getMemberCount } from '../../api/members'
import { RouteKeys } from '../../components/AppRouting'
import AttendanceStats from '../../components/AttendanceStats'
import BsCalendarPlus from '../../components/icons/BsCalendarPlus'
import PageLoading from '../../components/PageLoading'
import { Attendance, AttendanceTypes } from '../../types/Api'
import { isEmpty } from '../../utilities/bitsAndBobs'
import { getSeason } from '../../utilities/converters'
import { calculateMonth, formatEnumValue, formatUrl } from '../../utilities/formatters'
import { sortEventAttendance } from '../../utilities/sorts'

const AttendanceForSeason = () => {
    const today = new Date()
    const formatted = getSeason(today) + ''
    const [season, setSeason] = createSignal<string>(formatted)
    const [attendance, { mutate, refetch }] = createResource(season, getAttendanceByEvent)
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
        <Suspense fallback={<PageLoading />}>
            <div class=" m-4 flex">
                <div class="grow ">
                    This represents the attendance so far for the current season. Season switching to come later.
                </div>
                <div class="ml-4 min-w-max">
                    <a class="btn btn-primary gap-2 min-w-max" href={formatUrl(RouteKeys.EVENT_EDIT.nav, { id: 0 })}>
                        New <BsCalendarPlus />
                    </a>
                </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 mt-4 mb-4">
                <Show when={attendance() !== undefined}>
                    <div class="text-xl font-semibold">
                        {attendance()?.length} meetings in season {season()}
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
                                        <div class="text-xl font-semibold md:col-span-2 2xl:col-span-3 -mb-4">
                                            {month}
                                        </div>
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
        </Suspense>
    )
}

export default AttendanceForSeason
