import { Component } from 'solid-js'
import { TeamMember } from '../types/Api'

const DisplayTeamDataRow: Component<{ teamMember: TeamMember }> = (props) => {
    return (
        <tr>
            <td>{props.teamMember.id}</td>
            <td>
                {props.teamMember.firstName + ' ' + props.teamMember.lastName}
            </td>
            <td>{props.teamMember.pronouns}</td>
            <td>{props.teamMember.subTeam}</td>
            <td>{props.teamMember.teamRole}</td>
            <td>{props.teamMember.email}</td>
            <td>{props.teamMember.phone}</td>
        </tr>
    )
}

export default DisplayTeamDataRow
