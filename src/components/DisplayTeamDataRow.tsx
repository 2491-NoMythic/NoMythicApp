import { A } from '@solidjs/router'
import { Component } from 'solid-js'
import { TeamMember } from '../types/Api'
import { capitalizeWord } from '../utilities/formatters'

const DisplayTeamDataRow: Component<{ teamMember: TeamMember }> = (props) => {
    return (
        <tr class="hover cursor-pointer">
            <td>
                <A href={'/admin/member/:' + props.teamMember.member_id}>Go</A>
            </td>
            <td>{props.teamMember.first_name + ' ' + props.teamMember.last_name}</td>
            <td>{props.teamMember.pronouns}</td>
            <td>{capitalizeWord(props.teamMember.sub_team)}</td>
            <td>{capitalizeWord(props.teamMember.team_role)}</td>
            <td>{props.teamMember.email}</td>
            <td>{props.teamMember.phone}</td>
        </tr>
    )
}

export default DisplayTeamDataRow
