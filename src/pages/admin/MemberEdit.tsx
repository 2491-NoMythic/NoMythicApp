import { useFormHandler, yupSchema } from 'solid-form-handler'
import { SelectableField, TextField } from '../../components/forms'
import * as yup from 'yup'
import { Component, createEffect, createResource, Show } from 'solid-js'
import { A, useNavigate, useParams, useSearchParams } from '@solidjs/router'
import { getMemberById, newMemberFromAdmin, saveMemberFromAdmin, saveMemberFromProfile } from '../../api/members'
import { SchoolType, SubTeam, SubTeamType, TeamRole, TeamRoleType } from '../../types/Api'
import { addSubTeamToUrl } from '../../utilities/stringbuilders'

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
    grade: number
}

export const userSchema: yup.SchemaOf<User> = yup.object({
    first_name: yup.string().required('Required field'),
    last_name: yup.string().required('Required field'),
    pronouns: yup.string().notRequired(),
    sub_team: yup.mixed<SubTeamType>(),
    team_role: yup.mixed<TeamRoleType>(),
    email: yup.string().email('Invalid email').required('Required field'),
    phone: yup.string().notRequired(),
    address: yup.string().notRequired(),
    food_needs: yup.string().notRequired(),
    school: yup.mixed<SchoolType>(),
    advisor: yup.string().notRequired(),
    grade: yup
        .number()
        .min(0)
        .max(13)
        .nullable(true)
        .transform((_, val) => (0 === Number(val) ? null : val)),
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
                grade: Number(formData().grade) === 0 ? null : formData().grade,
            }
            if (member()?.member_id === undefined) {
                await newMemberFromAdmin(updatedMember)
            } else {
                await saveMemberFromAdmin(updatedMember)
            }
            navigate(addSubTeamToUrl('/admin/teamList', searchParams.subteam))
        } catch (error) {
            console.error(error)
        }
    }

    return (
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
                                label="First Name"
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
                                name="team_role"
                                options={[
                                    { value: TeamRole.MEMBER, label: 'Member' },
                                    { value: TeamRole.CAPTAIN, label: 'Captain' },
                                    { value: TeamRole.MENTOR, label: 'Mentor' },
                                ]}
                                value={member()?.team_role}
                                formHandler={formHandler}
                            />
                            <SelectableField
                                label="Sub Team"
                                name="sub_team"
                                options={[
                                    { value: SubTeam.BUILD, label: 'Build' },
                                    { value: SubTeam.PROGRAMMING, label: 'Programming' },
                                    { value: SubTeam.OPERATIONS, label: 'Operations' },
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
                            <TextField
                                label="School"
                                name="school"
                                value={member()?.school}
                                formHandler={formHandler}
                            />
                            <TextField
                                label="Advisor"
                                name="advisor"
                                value={member()?.advisor}
                                formHandler={formHandler}
                            />
                            <TextField label="Grade" name="grade" value={member()?.grade} formHandler={formHandler} />
                        </div>
                        <div class="card-actions justify-end">
                            <A href={addSubTeamToUrl('/admin/teamList', searchParams.subteam)}>
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
    )
}

export default MemberEdit
