import { Accessor, Component, For, Show } from 'solid-js'
import { TeamMember } from '../types/Api'
import DisplayTeamDataRow from './DisplayTeamDataRow'

const MasterTeamTable: Component<{ teamMembers: Accessor<TeamMember[]> }> = (
    props
) => {
    return (
        <Show when={props.teamMembers().length > 0}>
            <table class="table table-zebra w-full mt-4">
                <thead>
                    <tr>
                        <td>ID</td>
                        <td>Name</td>
                        <td>Pronouns</td>
                        <td>Sub Team</td>
                        <td>Team Role</td>
                        <td>Eamil</td>
                        <td>Phone</td>
                    </tr>
                </thead>
                <tbody>
                    <For each={props.teamMembers()}>
                        {(teamMember) => {
                            return (
                                <DisplayTeamDataRow teamMember={teamMember} />
                            )
                        }}
                    </For>
                </tbody>
            </table>
        </Show>
    )
}

export default MasterTeamTable
