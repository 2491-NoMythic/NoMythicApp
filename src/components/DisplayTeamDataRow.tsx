import { Component } from 'solid-js'
import { TeamMember } from '../types/Api'

const DisplayTeamDataRow: Component<{ teamMember: TeamMember }> = (props) => {
    return (
        <tr>
            <td>{props.teamMember.member_id}</td>
            <td>{props.teamMember.first_name + ' ' + props.teamMember.last_name}</td>
            <td>{props.teamMember.pronouns}</td>
            <td>{props.teamMember.sub_team}</td>
            <td>{props.teamMember.team_role}</td>
            <td>{props.teamMember.email}</td>
            <td>{props.teamMember.phone}</td>
        </tr>
    )
}

export default DisplayTeamDataRow
