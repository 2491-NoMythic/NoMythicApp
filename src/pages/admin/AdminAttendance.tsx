import { createResource, createSignal, For, Show } from 'solid-js'
import { getAttendanceCounts } from '../../api/attendance'
import AttendanceStats from '../../components/AttendanceStats'
import { calculateMonth } from '../../utilities/formatters'
import { sortMeetingCounts } from '../../utilities/sorts'

// TODO: we need to get this from somewhere
const TEAM_SIZE = 30

const AdminAttendance = () => {
    const today = new Date()
    const formatted = today.getFullYear() + ''
    const [season, setSeason] = createSignal<string>(formatted)
    const [attendance, { mutate, refetch }] = createResource(season, getAttendanceCounts)

    let currentMonth = ''

    return (
        <>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
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
                                        <div class="text-xl font-semibold lg:col-span-2">{month}</div>
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
        </>
    )
}

export default AdminAttendance
