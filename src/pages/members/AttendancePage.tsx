import { Component, createEffect, createResource, createSignal, For } from 'solid-js'
import DatePicker from '../../components/DatePicker'
import SubTeamSelector from '../../components/SubTeamSelector'
import { filterBySubTeam } from '../../utilities/filters'
import { sortByFirstName } from '../../utilities/sorts'
import SelectTeamInfoMessage from '../../components/SelectTeamInfoMessage'
import { AttendanceType, MemberAttendance } from '../../types/Api'
import { getMemberAttendance, insertAttendance, updateAttendance } from '../../api/attendance'

const AttendancePage: Component = () => {
    const [subTeam, setSubTeam] = createSignal('')
    const [filteredTeam, setFilteredTeam] = createSignal<MemberAttendance[]>([])
    const [meetingDate, setMeetingDate] = createSignal<string>('2022-10-17')
    const [team, { mutate, refetch }] = createResource(meetingDate, getMemberAttendance)

    // runs whenever team or subTeam are changed
    createEffect(() => {
        const filtered = filterBySubTeam(team(), subTeam())
        const sorted = sortByFirstName(filtered)
        setFilteredTeam(sorted)
    })

    type data = { memberId: number; attendanceType: AttendanceType; attendanceId: number }
    const handleClick = async (data: data, _event) => {
        if (data.attendanceId === undefined) {
            await insertAttendance(meetingDate(), data.memberId, data.attendanceType)
        } else {
            await updateAttendance(data.attendanceId, data.attendanceType)
        }
        refetch()
    }

    return (
        <div class="overflow-x-auto">
            <div class="flex">
                <div class="grow mr-2">
                    <SubTeamSelector subTeam={subTeam} setSubTeam={setSubTeam} />
                </div>
                <DatePicker selectedDate={meetingDate} setSelectedDate={setMeetingDate} />
            </div>
            <SelectTeamInfoMessage show={filteredTeam().length === 0} extraMessage="Using current season." />
            <table class="table table-compact w-full mt-4">
                <tbody>
                    <For each={filteredTeam()}>
                        {(teamMember) => {
                            const subTeam = teamMember.sub_team.charAt(0).toUpperCase() + teamMember.sub_team.slice(1)
                            return (
                                <tr>
                                    <td>
                                        {teamMember.first_name} {teamMember.last_name}
                                        <div>
                                            {subTeam} - {teamMember.team_role}
                                        </div>
                                    </td>
                                    <td class="text-right">
                                        <div class="btn-group">
                                            <input
                                                type="radio"
                                                name={'options' + teamMember.member_id}
                                                data-title="Ft"
                                                class="btn"
                                                checked={
                                                    teamMember?.attendance[0]?.attendance === AttendanceType.FULL_TIME
                                                }
                                                onClick={[
                                                    handleClick,
                                                    {
                                                        memberId: teamMember.member_id,
                                                        attendanceType: AttendanceType.FULL_TIME,
                                                        attendanceId: teamMember?.attendance[0]?.attendance_id,
                                                    },
                                                ]}
                                            />
                                            <input
                                                type="radio"
                                                name={'options' + teamMember.member_id}
                                                data-title="Pt"
                                                class="btn"
                                                checked={
                                                    teamMember?.attendance[0]?.attendance === AttendanceType.PART_TIME
                                                }
                                                onClick={[
                                                    handleClick,
                                                    {
                                                        memberId: teamMember.member_id,
                                                        attendanceType: AttendanceType.PART_TIME,
                                                        attendanceId: teamMember?.attendance[0]?.attendance_id,
                                                    },
                                                ]}
                                            />
                                            <input
                                                type="radio"
                                                name={'options' + teamMember.member_id}
                                                data-title="Ab"
                                                class="btn"
                                                checked={
                                                    teamMember?.attendance[0]?.attendance === AttendanceType.ABSENT
                                                }
                                                onClick={[
                                                    handleClick,
                                                    {
                                                        memberId: teamMember.member_id,
                                                        attendanceType: AttendanceType.ABSENT,
                                                        attendanceId: teamMember?.attendance[0]?.attendance_id,
                                                    },
                                                ]}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            )
                        }}
                    </For>
                </tbody>
            </table>
        </div>
    )
}

export default AttendancePage
