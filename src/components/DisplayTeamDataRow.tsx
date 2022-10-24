import { useNavigate, useSearchParams } from '@solidjs/router'
import { Component, Show } from 'solid-js'
import { Member, SubTeam, TeamRole } from '../types/Api'
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
        <>
            <tr
                class="hover cursor-pointer hidden lg:table-row"
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
            <tr
                class="hover cursor-pointer lg:hidden"
                onClick={[
                    handleClick,
                    {
                        memberId: props.teamMember.member_id,
                    },
                ]}
            >
                <td>
                    <div class="flex flex-col">
                        <div class="flex flex-row gap-6 items-end">
                            <div class="text-xl">
                                {props.teamMember.first_name} {props.teamMember.last_name}
                            </div>
                            <Show
                                when={
                                    props.teamMember.pronouns !== null &&
                                    props.teamMember.pronouns !== undefined &&
                                    props.teamMember.pronouns !== ''
                                }
                            >
                                <div class="text-sm align-bottom">( {props.teamMember.pronouns} )</div>
                            </Show>
                            <div class="text-sm text-secondary align-bottom">
                                {capitalizeWord(props.teamMember.team_role)}
                                <Show when={props.teamMember.sub_team !== SubTeam.UNASSIGNED}>
                                    <span class="text-base-content"> of </span>
                                    {capitalizeWord(props.teamMember.sub_team)}
                                </Show>
                            </div>
                        </div>
                        <div class="flex flex row gap-6">
                            <div class="text-sm">Email: {props.teamMember.email}</div>
                            <div class="text-sm">Phone: {props.teamMember.phone}</div>
                        </div>
                    </div>
                </td>
            </tr>
        </>
    )
}

export default DisplayTeamDataRow
