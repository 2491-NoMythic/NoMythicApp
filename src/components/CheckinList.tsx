import { useNavigate } from '@solidjs/router'
import { HiOutlineDocumentText } from 'solid-icons/hi'
import { Accessor, Component, createSignal, For, Show } from 'solid-js'
import { checkCheckinForEvent, insertCheckin, updateCheckinDescription, updateCheckinStatus } from '../api/checkin'
import { Checkin, CheckinStatus, CheckinStatusType, MemberCheckin, SubTeam } from '../types/Api'
import { capitalizeWord, formatUrl } from '../utilities/formatters'
import { RouteKeys } from './AppRouting'
import TextAreaModal from './TextAreaModal'

const CheckinList: Component<{
    eventId: number
    teamMembers: Accessor<MemberCheckin[]>
    refetch: Function
    clickToMember?: boolean
}> = (props) => {
    const navigate = useNavigate()

    const [showTextarea, setShowTextarea] = createSignal(false)
    const [checkin, setCheckin] = createSignal<Checkin>({} as Checkin)

    type memberIdType = { memberId: number }
    const handleNavToMember = (data: memberIdType, event) => {
        event.preventDefault()
        if (props.clickToMember) {
            //TODO: hard coded to current year ???
            navigate(formatUrl(RouteKeys.ATTENDANCE_MEMBER.nav, { mid: data.memberId }, { season: '2025' }))
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
            await updateCheckinStatus(data.checkinId, data.memberStatus)
        }
        // calling refresh will get any updates others might have entered too
        props.refetch()
    }

    const handleEyeClick = (checkinData: Checkin, event) => {
        event.preventDefault()
        if (checkinData?.description !== undefined) {
            setCheckin(checkinData)
            setShowTextarea(true)
        }
    }

    const handleTextAreaCallback = async (type: string, text: string) => {
        if (type === 'SAVE') {
            await updateCheckinDescription(checkin().checkin_id, text)
        }
        setShowTextarea(false)
        setCheckin({} as Checkin)
        // calling refresh will get any updates others might have entered too
        props.refetch()
    }

    /**
     * Color the icon color depending on the value of the description
     * - undefined = record not there
     * - null = record is there
     * - other = record is there with text
     * @param description text from the member
     * @returns text color
     */
    const getIconColor = (description: string) => {
        if (description === undefined) {
            return 'text-neutral'
        }
        if (description === null || description.length === 0) {
            return 'text-info'
        }
        return 'text-success'
    }

    return (
        <>
            <Show when={props.teamMembers() !== undefined && props.teamMembers().length !== 0}>
                <table class="table table-compact lg:table-zebra w-full mt-4">
                    <thead class="hidden lg:table-header-group">
                        <tr>
                            <td>First Name</td>
                            <td>Last Name</td>
                            <td>Sub Team</td>
                            <td>Team Role</td>
                            <td>Checkin Text</td>
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
                                            class={`hidden lg:table-cell ${
                                                props.clickToMember ? 'cursor-pointer' : ''
                                            }`}
                                        >
                                            {teamMember.first_name}
                                        </td>
                                        <td
                                            onClick={[handleNavToMember, { memberId: teamMember.member_id }]}
                                            class={`hidden lg:table-cell ${
                                                props.clickToMember ? 'cursor-pointer' : ''
                                            }`}
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
                                        <td>
                                            <div
                                                class={`inline-flex items-center mr-2 ${getIconColor(
                                                    teamMember?.checkin[0]?.description
                                                )} ${
                                                    teamMember.checkin[0]?.description !== undefined
                                                        ? 'cursor-pointer'
                                                        : ''
                                                }`}
                                                onClick={[handleEyeClick, teamMember.checkin[0]]}
                                            >
                                                <HiOutlineDocumentText fill="none" class="mb-3 mr-2" />
                                                <span class="hidden lg:inline ml-2 mb-1">View / Edit</span>
                                            </div>
                                        </td>
                                        <td class="text-right">
                                            <div class="btn-group">
                                                <input
                                                    type="radio"
                                                    name={'options' + teamMember.member_id}
                                                    data-title="GOOD"
                                                    class="btn min-w-[58px]"
                                                    checked={
                                                        teamMember?.checkin[0]?.member_status === CheckinStatus.GOOD
                                                    }
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
                                                    class="btn min-w-[40px]"
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
                                                    class="btn min-w-[50px]"
                                                    checked={
                                                        teamMember?.checkin[0]?.member_status === CheckinStatus.BAD
                                                    }
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
            <Show when={showTextarea()}>
                <TextAreaModal title="Checkin Text" text={checkin().description} callback={handleTextAreaCallback} />
            </Show>
        </>
    )
}

export default CheckinList
