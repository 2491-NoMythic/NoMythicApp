import { A, useNavigate, useParams, useSearchParams } from '@solidjs/router'
import { Component, createResource, createSignal, Show, Suspense } from 'solid-js'
import { getMemberById } from '../../api/members'
import { HiOutlineTrash } from 'solid-icons/hi'
import PageLoading from '../../components/PageLoading'
import { deleteParent, getParentById } from '../../api/parents'

const ParentView: Component = () => {
    const params = useParams()
    const [member] = createResource(() => parseInt(params.mid), getMemberById)
    const [parent] = createResource(() => parseInt(params.pid), getParentById)
    const [searchParams] = useSearchParams()
    const [opened, setOpened] = createSignal(false)
    const navigate = useNavigate()

    const toggleModal = () => {
        setOpened(!opened())
    }

    const handleDelete = async () => {
        toggleModal()
        await deleteParent(parent().parent_id)
        navigate('/admin/member/' + member()?.member_id + '/parent')
    }

    return (
        <Suspense fallback={<PageLoading />}>
            <div class="card max-w-5xl bg-base-100 shadow-xl mt-4">
                <div class="card-body">
                    <div class="flex flex-auto">
                        <div class="grow">
                            <div class="card-title">Team Member</div>
                            <div class="mb-4">
                                {member()?.first_name} {member()?.last_name}
                            </div>
                        </div>
                        <div class="w-50">
                            <A class="btn btn-secondary" href={'/admin/member/' + member()?.member_id}>
                                Back to Member
                            </A>
                        </div>
                    </div>
                    <h2 class="card-title">Parent / Guardian</h2>
                    <table class="table table-compact w-full">
                        <tbody>
                            <tr>
                                <td>First Name</td>
                                <td>{parent()?.first_name}</td>
                            </tr>
                            <tr>
                                <td>Last Name</td>
                                <td>{parent()?.last_name}</td>
                            </tr>
                            <tr>
                                <td>Pronouns</td>
                                <td>{parent()?.pronouns}</td>
                            </tr>
                            <tr>
                                <td>Email</td>
                                <td>{parent()?.email}</td>
                            </tr>
                            <tr>
                                <td>Phone</td>
                                <td>{parent()?.phone}</td>
                            </tr>
                            <tr>
                                <td>Address Line 1</td>
                                <td>{parent()?.addr1}</td>
                            </tr>
                            <tr>
                                <td>Address Line 2</td>
                                <td>{parent()?.addr2}</td>
                            </tr>
                            <tr>
                                <td>City</td>
                                <td>{parent()?.city}</td>
                            </tr>
                            <tr>
                                <td>State</td>
                                <td>{parent()?.state}</td>
                            </tr>
                            <tr>
                                <td>Zip</td>
                                <td>{parent()?.zip}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="flex">
                        <div class="flex-none">
                            <button class="btn btn-error inline-flex items-center" onClick={toggleModal}>
                                <HiOutlineTrash fill="none" class="mb-3 mr-3" /> Delete
                            </button>
                        </div>
                        <div class="flex flex-auto justify-end">
                            <label class="btn btn-secondary modal-button mr-4">
                                <A href={'/admin/member/' + member()?.member_id + '/parent'}>Back</A>
                            </label>
                            <label class="btn btn-primary modal-button">
                                <A
                                    href={
                                        '/admin/member/' +
                                        member()?.member_id +
                                        '/parent/' +
                                        parent()?.parent_id +
                                        '/edit'
                                    }
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

export default ParentView
