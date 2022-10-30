import { A, useNavigate, useParams, useSearchParams } from '@solidjs/router'
import { Component, createResource, createSignal, Show, Suspense } from 'solid-js'
import { deleteMember, getMemberById } from '../../api/members'
import { HiOutlineTrash } from 'solid-icons/hi'

import { calculateGrade, capitalizeWord } from '../../utilities/formatters'
import { addSubTeamToUrl } from '../../utilities/stringbuilders'
import PageLoading from '../../components/PageLoading'

const MemberView: Component = () => {
    const params = useParams()
    const [member] = createResource(() => parseInt(params.id), getMemberById)
    const [searchParams] = useSearchParams()
    const [opened, setOpened] = createSignal(false)
    const navigate = useNavigate()

    const toggleModal = () => {
        setOpened(!opened())
    }

    const handleDelete = async () => {
        toggleModal()
        await deleteMember(member().member_id)
        navigate(addSubTeamToUrl('/admin/teamList', searchParams.subteam))
    }

    return (
        <Suspense fallback={<PageLoading />}>
            <div class="card max-w-5xl bg-base-100 shadow-xl mt-4">
                <div class="card-body">
                    <h2 class="card-title">Team Member</h2>
                    <table class="table w-full">
                        <tbody>
                            <tr>
                                <td>First Name</td>
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
                                <td>Address</td>
                                <td>{member()?.address}</td>
                            </tr>
                            <tr>
                                <td>Food Needs</td>
                                <td>{member()?.food_needs}</td>
                            </tr>
                            <tr>
                                <td>School</td>
                                <td>{member()?.school}</td>
                            </tr>
                            <tr>
                                <td>Advisor</td>
                                <td>{member()?.advisor}</td>
                            </tr>
                            <tr>
                                <td>Grade</td>
                                <td>{calculateGrade(member()?.grad_year)}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="flex">
                        <div class="flex-none">
                            <button class="btn btn-warning inline-flex items-center" onClick={toggleModal}>
                                <HiOutlineTrash fill="none" class="mb-3 mr-3" /> Delete
                            </button>
                        </div>
                        <div class="flex flex-auto justify-end">
                            <label class="btn btn-secondary modal-button mr-4">
                                <A href={addSubTeamToUrl('/admin/teamList', searchParams.subteam)}>Back</A>
                            </label>
                            <label class="btn btn-primary modal-button">
                                <A
                                    href={addSubTeamToUrl(
                                        '/admin/memberEdit/' + member()?.member_id,
                                        searchParams.subteam
                                    )}
                                >
                                    Edit
                                </A>
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
                            <button class="btn btn-warning inline-flex items-center" onClick={handleDelete}>
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
