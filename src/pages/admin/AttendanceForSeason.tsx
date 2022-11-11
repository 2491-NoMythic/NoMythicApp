import { createResource, createSignal, For, Show, Suspense } from 'solid-js'
import { getAttendanceCounts } from '../../api/attendance'
import { RouteKeys } from '../../components/AppRouting'
import AttendanceStats from '../../components/AttendanceStats'
import BsCalendarPlus from '../../components/icons/BsCalendarPlus'
import PageLoading from '../../components/PageLoading'
import { calculateMonth, formatUrl } from '../../utilities/formatters'
import { sortMeetingCounts } from '../../utilities/sorts'

// TODO: we need to get this from somewhere
const TEAM_SIZE = 30

const AttendanceForSeason = () => {
    const today = new Date()
    const formatted = today.getFullYear() + ''
    const [season, setSeason] = createSignal<string>(formatted)
    const [attendance, { mutate, refetch }] = createResource(season, getAttendanceCounts)

    let currentMonth = ''

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
                    <For each={sortMeetingCounts(attendance(), 'DESC')}>
                        {(meeting) => {
                            let showMonth = false
                            const month = calculateMonth(meeting.meeting_date)
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
                                        meetingDate={meeting.meeting_date}
                                        meetingCount={meeting.count}
                                        meetingType="Regular Meeeting"
                                        teamSize={TEAM_SIZE}
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
