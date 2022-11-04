import { useFormHandler, yupSchema } from 'solid-form-handler'
import { TextField } from '../../components/forms'
import * as yup from 'yup'
import { Component, createResource, Show, Suspense } from 'solid-js'
import { A, useNavigate, useParams, useSearchParams } from '@solidjs/router'
import { getMemberById } from '../../api/members'
import PageLoading from '../../components/PageLoading'
import { getParentById, saveParent, updateParent } from '../../api/parents'
import { formatUrl } from '../../utilities/formatters'
import { RouteKeys } from '../../components/AppRouting'

// Definition of the fields we will do validatio on
type Parent = {
    first_name: string
    last_name: string
    pronouns?: string
    email: string
    phone?: string
    addr1?: string
    addr2?: string
    city?: string
    state?: string
    zip: string
}

// These are the validation rules
export const parentSchema: yup.SchemaOf<Parent> = yup.object({
    first_name: yup.string().required('Required field').max(40, 'Max 40 characters'),
    last_name: yup.string().required('Required field').max(40, 'Max 40 characters'),
    pronouns: yup.string().notRequired().max(20, 'Max 20 characters'),
    email: yup.string().email('Invalid email').required('Required field').max(60, 'Max 60 characters'),
    phone: yup.string().notRequired().max(14, 'Max 14 characters'),
    addr1: yup.string().notRequired().max(60, 'Max 60 characters'),
    addr2: yup.string().notRequired().max(60, 'Max 60 characters'),
    city: yup.string().notRequired().max(40, 'Max 40 characters'),
    state: yup.string().notRequired().max(40, 'Max 40 characters'),
    zip: yup.string().notRequired().max(5, 'Max 5 characters'),
})

const ParentEdit: Component = () => {
    const formHandler = useFormHandler(yupSchema(parentSchema))
    const { formData } = formHandler
    const params = useParams()
    const [member] = createResource(() => parseInt(params.mid), getMemberById)
    const [parent] = createResource(() => parseInt(params.pid), getParentById)
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    const submit = async (event: Event) => {
        event.preventDefault()
        try {
            await formHandler.validateForm()
            const updatedParent = {
                parent_id: parent()?.parent_id,
                member_id: member()?.member_id,
                first_name: formData().first_name,
                last_name: formData().last_name,
                pronouns: formData().pronouns,
                email: formData().email,
                phone: formData().phone,
                addr1: formData().addr1,
                addr2: formData().addr2,
                city: formData().city,
                state: formData().state,
                zip: formData().zip,
            }
            if (parent()?.parent_id === undefined) {
                await saveParent(updatedParent)
            } else {
                await updateParent(updatedParent)
            }
            navigate(formatUrl(RouteKeys.PARENT_VIEW.nav, { mid: member()?.member_id }))
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <Suspense fallback={<PageLoading />}>
            <div class="card max-w-5xl bg-base-100 shadow-xl mt-4">
                <div class="card-body">
                    <Show when={member()?.member_id === undefined} fallback={<h2 class="card-title">Edit Parent</h2>}>
                        <h2 class="card-title">New Member</h2>
                    </Show>
                    <Show when={member() !== undefined}>
                        <form onSubmit={submit}>
                            <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
                                <TextField
                                    label="First Name"
                                    altLabel="Required"
                                    name="first_name"
                                    value={parent()?.first_name}
                                    formHandler={formHandler}
                                />
                                <TextField
                                    label="Last Name"
                                    altLabel="Required"
                                    name="last_name"
                                    value={parent()?.last_name}
                                    formHandler={formHandler}
                                />
                                <TextField
                                    label="Pronouns"
                                    name="pronouns"
                                    value={parent()?.pronouns}
                                    formHandler={formHandler}
                                />
                                <TextField
                                    label="Email Address"
                                    altLabel="Required"
                                    name="email"
                                    value={parent()?.email}
                                    formHandler={formHandler}
                                />
                                <TextField
                                    label="Phone Number"
                                    name="phone"
                                    value={parent()?.phone}
                                    formHandler={formHandler}
                                />
                                <TextField
                                    label="Address Line 1"
                                    name="addr1"
                                    value={parent()?.addr1}
                                    formHandler={formHandler}
                                />
                                <TextField
                                    label="Address Line 2"
                                    name="addr2"
                                    value={parent()?.addr2}
                                    formHandler={formHandler}
                                />
                                <TextField label="City" name="city" value={parent()?.city} formHandler={formHandler} />
                                <TextField
                                    label="State"
                                    name="state"
                                    value={parent()?.state}
                                    formHandler={formHandler}
                                />
                                <TextField
                                    label="Zip Code"
                                    name="zip"
                                    value={parent()?.zip}
                                    formHandler={formHandler}
                                />
                            </div>
                            <div class="card-actions justify-end">
                                <A href={formatUrl(RouteKeys.PARENT_LIST.nav, { mid: member().member_id })}>
                                    <button class="btn btn-secondary modal-button mr-6">Cancel</button>
                                </A>
                                <button
                                    class="btn btn-primary modal-button"
                                    disabled={formHandler.isFormInvalid()}
                                    onClick={submit}
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </Show>
                </div>
            </div>
        </Suspense>
    )
}

export default ParentEdit
