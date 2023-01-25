import { A, useNavigate, useParams, useSearchParams } from '@solidjs/router'
import { Component, createEffect, createResource, createSignal, For, Show, Suspense } from 'solid-js'
import { deleteMember, getMemberById } from '../../api/members'
import { HiOutlineEye, HiOutlineTrash } from 'solid-icons/hi'

import { calculateGrade, capitalizeWord, formatEnumValue, formatUrl } from '../../utilities/formatters'
import PageLoading from '../../components/PageLoading'
import { School } from '../../types/Api'
import { getParents } from '../../api/parents'
import { RouteKeys } from '../../components/AppRouting'

const MemberView: Component = () => {
    const params = useParams()
    const [searchParams] = useSearchParams()
    const [member] = createResource(() => parseInt(params.mid), getMemberById)
    const [parents] = createResource(() => parseInt(params.mid), getParents)
    const [opened, setOpened] = createSignal(false)
    const [parentNames, setParentNames] = createSignal([] as string[])

    const navigate = useNavigate()

    const toggleModal = () => {
        setOpened(!opened())
    }

    const handleDelete = async () => {
        toggleModal()
        await deleteMember(member().member_id)
        navigate(RouteKeys.TEAM_LIST.nav)
    }

    createEffect(() => {
        if (member()?.member_id && parents()?.length > 0) {
            let names = [] as string[]
            parents().forEach((parent, index) => {
                names.push(parent.first_name + ' ' + parent.last_name)
            })
            setParentNames(names)
        } else {
            setParentNames(['Not entered'])
        }
    })

    /**
     * Url for returning to the calling page
     *
     * @returns string
     */
    const navUrl = () => {
        if (searchParams.back === 'MEAL_LIST') {
            return formatUrl(RouteKeys.MEAL_LIST.nav)
        }
        return formatUrl(RouteKeys.TEAM_LIST.nav)
    }

    return (
        <Suspense fallback={<PageLoading />}>
            <div class="card max-w-5xl bg-base-100 shadow-xl mt-4">
                <div class="card-body">
                    <h2 class="card-title">Team Member</h2>
                    <table class="table w-full">
                        <tbody>
                            <tr>
                                <td class="w-3 md:w-auto">First Name</td>
                                <td>{member()?.first_name}</td>
                            </tr>
                            <tr>
                                <td>Last Name</td>
                                <td>{member()?.last_name}</td>
                            </tr>
                            <tr>
                                <td>Pronouns</td>
                                <td>{member()?.pronouns}</td>
                            </tr>
                            <tr>
                                <td>Sub Team</td>
                                <td>{capitalizeWord(member()?.sub_team)}</td>
                            </tr>
                            <tr>
                                <td>Team Role</td>
                                <td>{capitalizeWord(member()?.team_role)}</td>
                            </tr>
                            <tr>
                                <td>Email</td>
                                <td>{member()?.email}</td>
                            </tr>
                            <tr>
                                <td>Phone</td>
                                <td>{member()?.phone}</td>
                            </tr>
                            <tr>
                                <td>Food Needs</td>
                                <td>{member()?.food_needs}</td>
                            </tr>
                            <tr>
                                <td>School</td>
                                <td>{formatEnumValue(member()?.school)}</td>
                            </tr>
                            <Show when={member()?.school !== School.NON_STUDENT}>
                                <tr>
                                    <td>Advisor</td>
                                    <td>{member()?.advisor}</td>
                                </tr>
                                <tr>
                                    <td>Grade</td>
                                    <td>{calculateGrade(member()?.grad_year)}</td>
                                </tr>
                                <tr>
                                    <td class="align-top">Parent(s)</td>
                                    <td class="flex flex-wrap">
                                        <For each={parentNames()}>
                                            {(parentName) => {
                                                return <div class="mr-8">{parentName}</div>
                                            }}
                                        </For>

                                        <A
                                            href={formatUrl(RouteKeys.PARENT_LIST.nav, { mid: member()?.member_id })}
                                            class="inline-flex items-center mr-2 text-secondary"
                                        >
                                            <HiOutlineEye fill="none" class="mb-3 mr-2" />
                                            <span class="hidden lg:inline ml-2 mb-1">View / Edit</span>
                                        </A>
                                    </td>
                                </tr>
                            </Show>
                            <Show when={member()?.school === School.NON_STUDENT}>
                                <tr>
                                    <td>Address</td>
                                    <td>{member()?.address}</td>
                                </tr>
                            </Show>
                        </tbody>
                    </table>
                    <div class="flex">
                        <div class="flex-none">
                            <button class="btn btn-error inline-flex items-center" onClick={toggleModal}>
                                <HiOutlineTrash fill="none" class="mr-3 mb-3" />
                                Delete
                            </button>
                        </div>
                        <div class="flex flex-auto justify-end">
                            <label class="btn btn-secondary modal-button mr-4">
                                <A href={navUrl()}>Back</A>
                            </label>
                            <label class="btn btn-primary modal-button">
                                <A href={formatUrl(RouteKeys.MEMBER_EDIT.nav, { mid: member()?.member_id })}>Edit</A>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <Show when={opened()}>
                <div class="modal modal-open">
                    <div class="modal-box">
                        <h3 class="font-bold text-lg">Are you sure you want to delete?</h3>
                        <p class="py-4">
                            You should only delete if the member was created in error, or didn't join the team.
                        </p>
                        <div class="modal-action">
                            <button class="btn btn-secondary" onClick={toggleModal}>
                                Cancel
                            </button>
                            <button class="btn btn-error inline-flex items-center" onClick={handleDelete}>
                                <HiOutlineTrash fill="none" class="mb-3 mr-3" /> Delete
                            </button>
                        </div>
                    </div>
                </div>
            </Show>
        </Suspense>
    )
}

export default MemberView
