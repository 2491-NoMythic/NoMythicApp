import { A, useParams, useSearchParams } from '@solidjs/router'
import { Component, createEffect, createResource, createSignal, For, Show, Suspense } from 'solid-js'
import { getMemberById } from '../../api/members'
import { deleteParent, getParents } from '../../api/parents'
import { HiOutlineEye, HiOutlinePencilAlt, HiOutlinePlusCircle, HiOutlineTrash } from 'solid-icons/hi'
import PageLoading from '../../components/PageLoading'
import ViewEditDeleteMenu from '../../components/ViewEditDeleteMenu'

const Parents: Component = () => {
    const params = useParams()
    const [parents, { refetch }] = createResource(parseInt(params.mid), getParents)
    const [member] = createResource(parseInt(params.mid), getMemberById)

    const [searchParams] = useSearchParams()
    // used for are you sure dialog
    const [opened, setOpened] = createSignal(false)
    // parentId used for delete
    const [parentId, setParentId] = createSignal<number>(null)
    //const navigate = useNavigate()

    const doCancel = () => {
        setParentId(null)
        setOpened(false)
    }

    const doDelete = async () => {
        deleteParent(parentId())
        setParentId(null)
        setOpened(false)
        refetch()
    }

    // this is callback from ViewEditDeleteMenu with the correct parentId
    // but we don't delete until 'doDelete'
    // this shows the "are you sure?"
    const handleDeleteDialog = async (parentId: number) => {
        setParentId(parentId)
        setOpened(true)
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
                    <h2 class="card-title">Parent / Guardians</h2>
                    <table class="table table-compact w-full">
                        <thead>
                            <tr>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th class="text-right">
                                    <A
                                        href={'/admin/member/' + member()?.member_id + '/parent/0/edit'}
                                        class="btn btn-primary inline-flex items-center"
                                    >
                                        <HiOutlinePlusCircle fill="none" class="mb-3 mr-4" />
                                        Add Parent
                                    </A>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <For each={parents()}>
                                {(parent) => {
                                    const viewParent = '/admin/member/' + params.mid + '/parent/' + parent.parent_id
                                    const editParent = viewParent + '/edit'
                                    const deleteFn = () => {
                                        handleDeleteDialog(parent.parent_id)
                                    }
                                    return (
                                        <tr>
                                            <td>{parent?.first_name}</td>
                                            <td>{parent?.last_name}</td>
                                            <td class="md:hidden text-right">
                                                <ViewEditDeleteMenu
                                                    viewLink={viewParent}
                                                    editLink={editParent}
                                                    deleteFn={deleteFn}
                                                />
                                            </td>
                                            <td class="hidden md:block text-right">
                                                <A href={viewParent} class="btn inline-flex items-center mr-2">
                                                    <HiOutlineEye fill="none" class="mb-3 mr-2" />
                                                    <span class="hidden lg:inline ml-2">View</span>
                                                </A>
                                                <A href={editParent} class="btn inline-flex items-center mr-2">
                                                    <HiOutlinePencilAlt fill="none" class="mb-3 mr-2" />
                                                    <span class="hidden lg:inline ml-2">Edit</span>
                                                </A>
                                                <A
                                                    href="#"
                                                    onClick={() => deleteFn()}
                                                    class="btn btn-error inline-flex items-center"
                                                >
                                                    <HiOutlineTrash fill="none" class="mb-3 mr-2" />
                                                    <span class="hidden lg:inline ml-2">Delete</span>
                                                </A>
                                            </td>
                                        </tr>
                                    )
                                }}
                            </For>
                        </tbody>
                    </table>
                </div>
            </div>
            <Show when={opened()}>
                <div class="modal modal-open">
                    <div class="modal-box">
                        <h3 class="font-bold text-lg">Are you sure you want to delete?</h3>
                        <div class="modal-action">
                            <button class="btn btn-secondary" onClick={doCancel}>
                                Cancel
                            </button>
                            <button class="btn btn-error inline-flex items-center" onClick={doDelete}>
                                <HiOutlineTrash fill="none" class="mb-3 mr-3" /> Delete
                            </button>
                        </div>
                    </div>
                </div>
            </Show>
        </Suspense>
    )
}

export default Parents
