import { useNavigate } from '@solidjs/router'
import { Accessor, Component, For, Resource, Show } from 'solid-js'
import { insertAttendance, updateAttendance } from '../api/attendance'
import { AttendanceTypes, AttendanceTypesType, MemberAttendance, SubTeam } from '../types/Api'
import { capitalizeWord } from '../utilities/formatters'

const AttendanceList: Component<{
    meetingDate: string
    teamMembers: Accessor<MemberAttendance[]>
    refetch: Function
    clickToMember?: boolean
}> = (props) => {
    const navigate = useNavigate()

    type memberIdType = { memberId: number }
    const handleNavToMember = (data: memberIdType, _event) => {
        if (props.clickToMember) {
            navigate('/admin/attendance/member/' + data.memberId + '?season=2023')
        }
    }

    type data = { memberId: number; attendanceType: AttendanceTypesType; attendanceId: number }
    const handleClick = async (data: data, _event) => {
        if (data.attendanceId === undefined) {
            await insertAttendance(props.meetingDate, data.memberId, data.attendanceType)
        } else {
            await updateAttendance(data.attendanceId, data.attendanceType)
        }
        // calling refresh will get any updates other might have entered too
        props.refetch()
    }

    return (
        <Show when={props.teamMembers() !== undefined && props.teamMembers().length !== 0}>
            <table class="table table-compact lg:table-zebra w-full mt-4">
                <thead class="hidden lg:table-header-group">
                    <tr>
                        <td>First Name</td>
                        <td>Last Name</td>
                        <td>Sub Team</td>
                        <td>Team Role</td>
                        <td class="text-right pr-10">Attendance</td>
                    </tr>
                </thead>
                <tbody>
                    <For each={props.teamMembers()}>
                        {(teamMember) => {
                            return (
                                <tr
                                    onClick={[handleNavToMember, { memberId: teamMember.member_id }]}
                                    class={`${props.clickToMember ? 'cursor-pointer' : ''}`}
                                >
                                    <td class="hidden lg:table-cell">{teamMember.first_name}</td>
                                    <td class="hidden lg:table-cell">{teamMember.last_name}</td>
                                    <td class="hidden lg:table-cell">{capitalizeWord(teamMember.sub_team)}</td>
                                    <td class="hidden lg:table-cell">{capitalizeWord(teamMember.team_role)}</td>
                                    <td class="lg:hidden">
                                        {teamMember.first_name} {teamMember.last_name}
                                        <div class="text-secondary">
                                            {capitalizeWord(teamMember.team_role)}
                                            <Show when={teamMember.sub_team !== SubTeam.UNASSIGNED}>
                                                <span class="text-base-content"> of </span>
                                                {capitalizeWord(teamMember.sub_team)}
                                            </Show>
                                        </div>
                                    </td>
                                    <td class="text-right">
                                        <div class="btn-group">
                                            <input
                                                type="radio"
                                                name={'options' + teamMember.member_id}
                                                data-title="FT"
                                                class="btn [.btn-group>input[type='radio']&]:lg:before:content-['Full_Time']"
                                                checked={
                                                    teamMember?.attendance[0]?.attendance === AttendanceTypes.FULL_TIME
                                                }
                                                onClick={[
                                                    handleClick,
                                                    {
                                                        memberId: teamMember.member_id,
                                                        attendanceType: AttendanceTypes.FULL_TIME,
                                                        attendanceId: teamMember?.attendance[0]?.attendance_id,
                                                    },
                                                ]}
                                            />
                                            <input
                                                type="radio"
                                                name={'options' + teamMember.member_id}
                                                data-title="PT"
                                                class="btn [.btn-group>input[type='radio']&]:lg:before:content-['Part_Time']"
                                                checked={
                                                    teamMember?.attendance[0]?.attendance === AttendanceTypes.PART_TIME
                                                }
                                                onClick={[
                                                    handleClick,
                                                    {
                                                        memberId: teamMember.member_id,
                                                        attendanceType: AttendanceTypes.PART_TIME,
                                                        attendanceId: teamMember?.attendance[0]?.attendance_id,
                                                    },
                                                ]}
                                            />
                                            <input
                                                type="radio"
                                                name={'options' + teamMember.member_id}
                                                data-title="AB"
                                                class="btn [.btn-group>input[type='radio']&]:lg:before:content-['Absent']"
                                                checked={
                                                    teamMember?.attendance[0]?.attendance === AttendanceTypes.ABSENT
                                                }
                                                onClick={[
                                                    handleClick,
                                                    {
                                                        memberId: teamMember.member_id,
                                                        attendanceType: AttendanceTypes.ABSENT,
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
        </Show>
    )
}

export default AttendanceList
