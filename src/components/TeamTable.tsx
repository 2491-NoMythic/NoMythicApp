import { Accessor, Component, For, Show } from 'solid-js'
import { Member } from '../types/Api'
import DisplayTeamDataRow from './DisplayTeamDataRow'

const TeamTable: Component<{ teamMembers: Accessor<Member[]> }> = (props) => {
    return (
        <Show when={props.teamMembers().length > 0}>
            <table class="table table-zebra w-full mt-4">
                <thead class="hidden lg:table-header-group">
                    <tr>
                        <td>Name</td>
                        <td>Pronouns</td>
                        <td>Sub Team</td>
                        <td>Team Role</td>
                        <td>Phone</td>
                    </tr>
                </thead>
                <tbody>
                    <For each={props.teamMembers()}>
                        {(teamMember) => {
                            return <DisplayTeamDataRow teamMember={teamMember} />
                        }}
                    </For>
                </tbody>
            </table>
        </Show>
    )
}

export default TeamTable
