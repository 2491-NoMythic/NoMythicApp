import { useNavigate } from '@solidjs/router'
import { Accessor, Component, createEffect, For, Show } from 'solid-js'
import { checkCheckinForEvent, insertCheckin, updateCheckIn } from '../api/checkin'
import { CheckinStatus, CheckinStatusType, MemberCheckin, SubTeam } from '../types/Api'
import { capitalizeWord, formatUrl } from '../utilities/formatters'
import { RouteKeys } from './AppRouting'

const CheckinList: Component<{
    eventId: number
    teamMembers: Accessor<MemberCheckin[]>
    refetch: Function
    clickToMember?: boolean
}> = (props) => {
    const navigate = useNavigate()

    type memberIdType = { memberId: number }
    const handleNavToMember = (data: memberIdType, event) => {
        event.preventDefault()
        if (props.clickToMember) {
            navigate(formatUrl(RouteKeys.ATTENDANCE_MEMBER.nav, { mid: data.memberId }, { season: '2023' }))
        }
    }

    type data = { memberId: number; memberStatus: CheckinStatusType; checkinId: number; description: string }
    const handleClick = async (data: data, event) => {
        event.preventDefault()
        if (data.checkinId === undefined) {
            // we don't want to insert if the record is already there - just ignore
            const existsAlready = await checkCheckinForEvent(props.eventId, data.memberId)
            if (!existsAlready) {
                await insertCheckin(props.eventId, data.memberId, data.memberStatus, data.description)
            }
        } else {
            await updateCheckIn(data.checkinId, data.memberStatus, data.description)
        }
        // calling refresh will get any updates others might have entered too
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
                        <td class="text-right pr-10">Checkin Status</td>
                    </tr>
                </thead>
                <tbody>
                    <For each={props.teamMembers()}>
                        {(teamMember) => {
                            return (
                                <tr>
                                    <td
                                        onClick={[handleNavToMember, { memberId: teamMember.member_id }]}
                                        class={`hidden lg:table-cell ${props.clickToMember ? 'cursor-pointer' : ''}`}
                                    >
                                        {teamMember.first_name}
                                    </td>
                                    <td
                                        onClick={[handleNavToMember, { memberId: teamMember.member_id }]}
                                        class={`hidden lg:table-cell ${props.clickToMember ? 'cursor-pointer' : ''}`}
                                    >
                                        {teamMember.last_name}
                                    </td>
                                    <td class="hidden lg:table-cell">{capitalizeWord(teamMember.sub_team)}</td>
                                    <td class="hidden lg:table-cell">{capitalizeWord(teamMember.team_role)}</td>
                                    <td
                                        onClick={[handleNavToMember, { memberId: teamMember.member_id }]}
                                        class={`lg:hidden ${props.clickToMember ? 'cursor-pointer' : ''}`}
                                    >
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
                                                data-title="GOOD"
                                                class="btn"
                                                checked={teamMember?.checkin[0]?.member_status === CheckinStatus.GOOD}
                                                onClick={[
                                                    handleClick,
                                                    {
                                                        memberId: teamMember.member_id,
                                                        memberStatus: CheckinStatus.GOOD,
                                                        checkinId: teamMember?.checkin[0]?.checkin_id,
                                                        destription: null,
                                                    },
                                                ]}
                                            />
                                            <input
                                                type="radio"
                                                name={'options' + teamMember.member_id}
                                                data-title="OK"
                                                class="btn"
                                                checked={teamMember?.checkin[0]?.member_status === CheckinStatus.OK}
                                                onClick={[
                                                    handleClick,
                                                    {
                                                        memberId: teamMember.member_id,
                                                        memberStatus: CheckinStatus.OK,
                                                        checkinId: teamMember?.checkin[0]?.checkin_id,
                                                        description: null,
                                                    },
                                                ]}
                                            />
                                            <input
                                                type="radio"
                                                name={'options' + teamMember.member_id}
                                                data-title="BAD"
                                                class="btn"
                                                checked={teamMember?.checkin[0]?.member_status === CheckinStatus.BAD}
                                                onClick={[
                                                    handleClick,
                                                    {
                                                        memberId: teamMember.member_id,
                                                        memberStatus: CheckinStatus.BAD,
                                                        checkinId: teamMember?.checkin[0]?.checkin_id,
                                                        description: null,
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

export default CheckinList
