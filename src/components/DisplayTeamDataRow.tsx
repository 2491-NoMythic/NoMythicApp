import { useNavigate, useSearchParams } from '@solidjs/router'
import { Component } from 'solid-js'
import { Member } from '../types/Api'
import { capitalizeWord } from '../utilities/formatters'
import { addSubTeamToUrl } from '../utilities/stringbuilders'

const DisplayTeamDataRow: Component<{ teamMember: Member }> = (props) => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    type data = { memberId: number }
    const handleClick = async (data: data, _event) => {
        navigate(addSubTeamToUrl('/admin/member/' + data.memberId, searchParams.subteam))
    }

    return (
        <tr
            class="hover cursor-pointer"
            onClick={[
                handleClick,
                {
                    memberId: props.teamMember.member_id,
                },
            ]}
        >
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
