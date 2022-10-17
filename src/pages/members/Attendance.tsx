import { Component, createEffect, createSignal, For, Show } from 'solid-js'
import DatePicker from '../../components/DatePicker'
import SubTeamSelector from '../../components/SubTeamSelector'
// static file instead of fetching from internet for now
import { teamMembers } from '../../assets/team'
import { filterBySubTeam } from '../../utilities/filters'
import { sortByFirstName } from '../../utilities/sorts'
import SelectTeamInfoMessage from '../../components/SelectTeamInfoMessage'
import { TeamMemberAttendance } from '../../types/Api'

const Attendance: Component = () => {
    // when not a static file, useResource
    const [team, setTeam] = createSignal<TeamMemberAttendance[]>([])
    const [subTeam, setSubTeam] = createSignal('')
    const [filteredTeam, setFilteredTeam] = createSignal<
        TeamMemberAttendance[]
    >([])
    setTeam(teamMembers)

    // runs whenever team or subTeam are changed
    createEffect(() => {
        const filtered = filterBySubTeam(team(), subTeam())
        const sorted = sortByFirstName(filtered)
        setFilteredTeam(sorted)
    })

    return (
        <div class="overflow-x-auto">
            <div class="flex">
                <div class="grow mr-2">
                    <SubTeamSelector
                        subTeam={subTeam}
                        setSubTeam={setSubTeam}
                    />
                </div>
                <DatePicker />
            </div>
            <SelectTeamInfoMessage
                show={filteredTeam().length === 0}
                extraMessage="Using current season."
            />
            <table class="table table-compact w-full mt-4">
                <tbody>
                    <For each={filteredTeam()}>
                        {(teamMember) => {
                            const subTeam =
                                teamMember.subTeam.charAt(0).toUpperCase() +
                                teamMember.subTeam.slice(1)
                            return (
                                <tr>
                                    <td>
                                        {teamMember.firstName}{' '}
                                        {teamMember.lastName}
                                        <div>
                                            {subTeam} - {teamMember.teamRole}
                                        </div>
                                    </td>
                                    <td class="text-right">
                                        <div class="btn-group">
                                            <input
                                                type="radio"
                                                name={'options' + teamMember.id}
                                                data-title="Ft"
                                                class="btn"
                                            />
                                            <input
                                                type="radio"
                                                name={'options' + teamMember.id}
                                                data-title="Pt"
                                                class="btn"
                                            />
                                            <input
                                                type="radio"
                                                name={'options' + teamMember.id}
                                                data-title="Ab"
                                                class="btn"
                                                checked
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

export default Attendance
