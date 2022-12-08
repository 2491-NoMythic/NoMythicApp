import { A, useParams, useSearchParams } from '@solidjs/router'
import { Component, createEffect, createMemo, createResource, createSignal, For, Show, Suspense } from 'solid-js'
import { getAttendanceForMember } from '../../api/attendance'
import { getNumberOfEvents, getSeasonEvents } from '../../api/events'
import { getMemberById } from '../../api/members'
import { RouteKeys } from '../../components/AppRouting'
import PageLoading from '../../components/PageLoading'
import TwoSideStatsBase from '../../components/TwoSideStatsBase'
import { Attendance, AttendanceTypes, RobotEvent } from '../../types/Api'
import { isEmpty } from '../../utilities/bitsAndBobs'
import { seasonMonths } from '../../utilities/converters'
import { calculateMonth, calculatePercent, calculateDay, formatEnumValue, formatUrl } from '../../utilities/formatters'
import { sortAttendance } from '../../utilities/sorts'

const AttendanceForMember: Component = () => {
    const params = useParams()
    const [searchParams] = useSearchParams()

    const [attendance] = createResource(
        () => ({ season: searchParams.season, memberId: params.mid }),
        getAttendanceForMember
    )
    const [memberAttended, setMemberAttended] = createSignal(0)
    const [numberOfMeetings] = createResource(searchParams.season, getNumberOfEvents)
    const [events] = createResource(searchParams.season, getSeasonEvents)
    const [member] = createResource(() => parseInt(params.mid), getMemberById)

    type AttendanceByMonth = { month: string; meetings: Attendance[] }
    const [byMonth, setByMonth] = createSignal([] as AttendanceByMonth[])

    // creating a lookup map of events to get info by event_id from attendance later
    const eventMap = createMemo(() => {
        const eventMap = new Map<number, RobotEvent>()
        events()?.forEach((anEvent) => {
            eventMap.set(anEvent.event_id, anEvent)
        })
        return eventMap
    })

    /*
     * Get number of meetings attended for a Attendance[]
     */
    const getMeetingsAttended = (attendance: Attendance[]) => {
        let numberAttended = 0
        if (attendance) {
            attendance.forEach((meeting) => {
                if (
                    meeting.attendance === AttendanceTypes.FULL_TIME ||
                    meeting.attendance === AttendanceTypes.PART_TIME
                ) {
                    numberAttended++
                }
            })
        }
        return numberAttended
    }

    /*
     *  Split up attendance into a map of Month => Attendance[]
     *  We also want to kick out attendance with meetings that have take_attendance = false
     */
    const splitByMonth = (attendance: Attendance[]) => {
        const months = new Map<string, Attendance[]>()
        if (attendance) {
            attendance.forEach((meeting) => {
                const event = eventMap().get(meeting.event_id)
                if (event !== undefined && event.take_attendance) {
                    const month = calculateMonth(meeting.meeting_date)
                    let meetings = months.get(month)
                    if (meetings === undefined) {
                        meetings = []
                    }
                    meetings.push(meeting)
                    months.set(month, meetings)
                }
            })
        }
        return months
    }

    /*
     *  Sorts an attendance map into the proper month order for a season.
     *  See seasonMonths from /utils/converters/seasonMonths
     */
    const sortByMonth = (months: Map<string, Attendance[]>, direction?: 'ASC' | 'DESC') => {
        const attendanceByMonth = [] as AttendanceByMonth[]
        const monthList = direction !== 'DESC' ? seasonMonths : seasonMonths.reverse()
        monthList.forEach((month) => {
            const meetingsUnsortd = months.get(month)
            if (meetingsUnsortd !== undefined) {
                const meetings = sortAttendance(months.get(month))
                attendanceByMonth.push({ month, meetings })
            }
        })
        return attendanceByMonth
    }

    createEffect(() => {
        if (!isEmpty(attendance()) && eventMap().size > 0) {
            const attendedCount = getMeetingsAttended(attendance())
            setMemberAttended(attendedCount)
            const monthsMap = splitByMonth(attendance())
            const attendanceByMonth = sortByMonth(monthsMap)
            setByMonth(attendanceByMonth)
        }
    })

    return (
        <Suspense fallback={<PageLoading />}>
            <div>
                <div class="flex">
                    <div class="text-xl font-semibold mt-4 grow">
                        Attendance for {member()?.first_name} {member()?.last_name}
                    </div>
                    <div class="mt-4">
                        <A class="btn btn-secondary" href={RouteKeys.ATTENDANCE_SEASON.nav}>
                            Back
                        </A>
                    </div>
                </div>
                <TwoSideStatsBase
                    leftText={searchParams.season + ' Season'}
                    leftValue={numberOfMeetings()?.toString() + ' Meetings'}
                    leftSubText={seasonMonths[0] + ' - ' + seasonMonths[11]}
                    rightText="Attendance"
                    rightValue={'At ' + memberAttended()?.toString()}
                    rightSubText={calculatePercent(memberAttended(), numberOfMeetings()) + '%'}
                    link={null}
                />
                <div>
                    <Show when={!isEmpty(byMonth() && !isEmpty(eventMap()) && eventMap().size > 0)}>
                        <For each={byMonth()}>
                            {(month) => {
                                return (
                                    <div>
                                        <div class="text-xl font-semibold mt-4">
                                            {month.month} : At {getMeetingsAttended(month.meetings)} Meetings
                                        </div>
                                        <div>
                                            <For each={month.meetings}>
                                                {(meeting) => {
                                                    const event = eventMap().get(meeting.event_id)
                                                    return (
                                                        <TwoSideStatsBase
                                                            leftText={calculateDay(meeting.meeting_date)}
                                                            leftValue={meeting.meeting_date}
                                                            leftSubText={formatEnumValue(event?.event_type)}
                                                            rightText="Attendance"
                                                            rightValue={formatEnumValue(meeting.attendance)}
                                                            rightSubText={null}
                                                            link={formatUrl(
                                                                RouteKeys.ATTENDANCE_MEETING.nav,
                                                                { id: meeting.event_id },
                                                                {
                                                                    meetingDate: meeting.meeting_date,
                                                                }
                                                            )}
                                                        />
                                                    )
                                                }}
                                            </For>
                                        </div>
                                    </div>
                                )
                            }}
                        </For>
                    </Show>
                </div>
            </div>
        </Suspense>
    )
}

export default AttendanceForMember
