import { useFormHandler, yupSchema } from 'solid-form-handler'
import { SelectableField, TextField } from '../../components/forms'
import * as yup from 'yup'
import { Component, createEffect, createResource, Show, Suspense } from 'solid-js'
import { A, useNavigate, useParams, useSearchParams } from '@solidjs/router'
import { getMemberById, newMemberFromAdmin, saveMemberFromAdmin, saveMemberFromProfile } from '../../api/members'
import { School, SchoolType, SubTeam, SubTeamType, TeamRole, TeamRoleType } from '../../types/Api'
import PageLoading from '../../components/PageLoading'

// Definition of the fields we will do validatio on
type User = {
    first_name: string
    last_name: string
    pronouns?: string
    team_role: TeamRoleType
    sub_team: SubTeamType
    email: string
    phone?: string
    address?: string
    food_needs?: string
    school?: string
    advisor?: string
    grad_year: number
}

// helper for yup transform function
const emptyStringToNull = (value, originalValue) => {
    if (typeof originalValue === 'string' && originalValue === '') {
        return null
    }
    return value
}

// These are the validation rules
export const userSchema: yup.SchemaOf<User> = yup.object({
    first_name: yup.string().required('Required field').max(40, 'Max 40 characters'),
    last_name: yup.string().required('Required field').max(40, 'Max 40 characters'),
    pronouns: yup.string().notRequired().max(20, 'Max 20 characters'),
    sub_team: yup.mixed<SubTeamType>().oneOf(['build', 'unassigned', 'operations', 'programming']),
    team_role: yup.mixed<TeamRoleType>().oneOf(['member', 'captain', 'coach', 'mentor']),
    email: yup.string().email('Invalid email').required('Required field').max(60, 'Max 60 characters'),
    phone: yup.string().notRequired().max(14, 'Max 14 characters'),
    address: yup.string().notRequired().max(100, 'Max 100 characters'),
    food_needs: yup.string().notRequired().max(60, 'Max 60 characters'),
    school: yup.mixed<SchoolType>().oneOf(['non_student', 'avalon', 'grs', 'other']),
    advisor: yup.string().notRequired().max(40, 'Max 40 characters'),
    grad_year: yup
        .number()
        .typeError('Only numbers accepted')
        .min(2000, 'Min value of 2000')
        .max(2050, 'Max value of 2050')
        .transform(emptyStringToNull)
        .nullable(),
    //.transform((_, val) => (NaN === Number(val) || null === Number(val) ? null : Number(val))),
})

const MemberEdit: Component = () => {
    const formHandler = useFormHandler(yupSchema(userSchema))
    const { formData } = formHandler
    const params = useParams()
    const [member] = createResource(() => parseInt(params.id), getMemberById)
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    const submit = async (event: Event) => {
        event.preventDefault()
        try {
            await formHandler.validateForm()
            const updatedMember = {
                member_id: member()?.member_id,
                first_name: formData().first_name,
                last_name: formData().last_name,
                pronouns: formData().pronouns,
                team_role: formData().team_role,
                sub_team: formData().sub_team,
                email: formData().email,
                phone: formData().phone,
                address: formData().address,
                food_needs: formData().food_needs,
                school: formData().school,
                advisor: formData().advisor,
                grad_year: Number(formData().grad_year) === 0 ? null : formData().grad_year,
            }
            if (member()?.member_id === undefined) {
                await newMemberFromAdmin(updatedMember)
            } else {
                await saveMemberFromAdmin(updatedMember)
            }
            navigate('/admin/teamList')
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <Suspense fallback={<PageLoading />}>
            <div class="card max-w-5xl bg-base-100 shadow-xl mt-4">
                <div class="card-body">
                    <Show when={member()?.member_id === undefined} fallback={<h2 class="card-title">Edit Member</h2>}>
                        <h2 class="card-title">New Member</h2>
                    </Show>
                    <Show when={member() !== undefined}>
                        <form onSubmit={submit}>
                            <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
                                <TextField
                                    label="First Name"
                                    altLabel="Required"
                                    name="first_name"
                                    value={member()?.first_name}
                                    formHandler={formHandler}
                                />
                                <TextField
                                    label="Last Name"
                                    altLabel="Required"
                                    name="last_name"
                                    value={member()?.last_name}
                                    formHandler={formHandler}
                                />
                                <TextField
                                    label="Pronouns"
                                    name="pronouns"
                                    value={member()?.pronouns}
                                    formHandler={formHandler}
                                />
                                <SelectableField
                                    label="Team Role"
                                    altLabel="Required"
                                    name="team_role"
                                    options={[
                                        { value: TeamRole.MEMBER, label: 'Member' },
                                        { value: TeamRole.CAPTAIN, label: 'Captain' },
                                        { value: TeamRole.MENTOR, label: 'Mentor' },
                                        { value: TeamRole.COACH, label: 'Coach' },
                                    ]}
                                    value={member()?.team_role}
                                    formHandler={formHandler}
                                />
                                <SelectableField
                                    label="Sub Team"
                                    altLabel="Required"
                                    name="sub_team"
                                    options={[
                                        { value: SubTeam.BUILD, label: 'Build' },
                                        { value: SubTeam.PROGRAMMING, label: 'Programming' },
                                        { value: SubTeam.OPERATIONS, label: 'Operations' },
                                        { value: SubTeam.UNASSIGNED, label: 'Unnassigned' },
                                    ]}
                                    value={member()?.sub_team}
                                    formHandler={formHandler}
                                />
                                <TextField
                                    label="Email Address"
                                    altLabel="Google Email Required"
                                    name="email"
                                    value={member()?.email}
                                    formHandler={formHandler}
                                />

                                <TextField
                                    label="Phone Number"
                                    name="phone"
                                    value={member()?.phone}
                                    formHandler={formHandler}
                                />
                                <TextField
                                    label="Home Address"
                                    name="address"
                                    value={member()?.address}
                                    formHandler={formHandler}
                                />
                                <TextField
                                    label="Food needs"
                                    altLabel="vegan/gluten free"
                                    name="food_needs"
                                    value={member()?.food_needs}
                                    formHandler={formHandler}
                                />
                                <SelectableField
                                    label="School"
                                    altLabel="Required"
                                    name="school"
                                    options={[
                                        { value: School.NON_STUDENT, label: 'Non Student' },
                                        { value: School.AVALON, label: 'Avalon' },
                                        { value: School.GRS, label: 'GRS' },
                                        { value: School.OTHER, label: 'Other' },
                                    ]}
                                    value={member()?.school}
                                    formHandler={formHandler}
                                />
                                <Show
                                    when={
                                        formData().school === School.AVALON ||
                                        formData().school === School.GRS ||
                                        formData().school === School.OTHER
                                    }
                                >
                                    <TextField
                                        label="Advisor"
                                        name="advisor"
                                        value={member()?.advisor}
                                        formHandler={formHandler}
                                    />
                                    <TextField
                                        label="Graduation Year"
                                        name="grad_year"
                                        value={member()?.grad_year}
                                        formHandler={formHandler}
                                    />
                                </Show>
                            </div>
                            <div class="card-actions justify-end">
                                <A href="/admin/teamList">
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

export default MemberEdit
