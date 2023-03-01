import { useNavigate, useSearchParams } from '@solidjs/router'
import { Component, Show } from 'solid-js'
import { useNoMythicUser } from '../contexts/UserContext'
import { Member, SubTeam, TeamRole } from '../types/Api'
import { capitalizeWord, formatUrl } from '../utilities/formatters'
import { RouteKeys } from './AppRouting'

const DisplayTeamDataRow: Component<{ teamMember: Member }> = (props) => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const { isAdmin } = useNoMythicUser()

    type data = { memberId: number }
    const handleClick = async (data: data, _event) => {
        if (isAdmin()) {
            navigate(formatUrl(RouteKeys.MEMBER_VIEW.nav, { mid: data.memberId }))
        }
    }

    return (
        <>
            <tr
                class={`hover ${isAdmin() ? 'cursor-pointer' : ''} hidden lg:table-row`}
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
                <td>{props.teamMember.phone}</td>
            </tr>

            <tr
                class={`hover ${isAdmin() ? 'cursor-pointer' : ''} lg:hidden`}
                onClick={[
                    handleClick,
                    {
                        memberId: props.teamMember.member_id,
                    },
                ]}
            >
                <td>
                    <div class="flex flex-col">
                        <div class="flex flex-row gap-2 items-end">
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
                                <div class="text-sm pb-1">({props.teamMember.pronouns})</div>
                            </Show>
                            <div class="text-sm text-secondary pb-1">
                                {capitalizeWord(props.teamMember.team_role)}
                                <Show when={props.teamMember.sub_team !== SubTeam.UNASSIGNED}>
                                    <span class="text-base-content"> of </span>
                                    {capitalizeWord(props.teamMember.sub_team)}
                                </Show>
                            </div>
                        </div>
                        <div class="flex flex row gap-2">
                            <div class="text-sm">P: {props.teamMember.phone}</div>
                        </div>
                    </div>
                </td>
            </tr>
        </>
    )
}

export default DisplayTeamDataRow
