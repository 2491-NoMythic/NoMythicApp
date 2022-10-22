import { useFormHandler, yupSchema } from 'solid-form-handler'
import { SelectableField, TextField } from '../../components/forms'
import * as yup from 'yup'
import { Component } from 'solid-js'
import { useMyUser } from '../../contexts/UserContext'
import { A } from '@solidjs/router'
import { saveMemberFromProfile } from '../../api/members'
import { SubTeam, SubTeamType, TeamRole, TeamRoleType } from '../../types/Api'

type User = {
    first_name: string
    last_name: string
    pronouns?: string
    team_role: TeamRoleType
    sub_team: SubTeamType
    email: string
    phone?: string
    food_needs?: string
}

export const userSchema: yup.SchemaOf<User> = yup.object({
    first_name: yup.string().required('Required field'),
    last_name: yup.string().required('Required field'),
    pronouns: yup.string().notRequired(),
    sub_team: yup.mixed<SubTeamType>(),
    team_role: yup.mixed<TeamRoleType>(),
    email: yup.string().email('Invalid email').required('Required field'),
    phone: yup.string().notRequired(),
    food_needs: yup.string().notRequired(),
})

const ProfileEdit: Component = () => {
    const formHandler = useFormHandler(yupSchema(userSchema))
    const { formData } = formHandler

    const [authSession, googleUser, member] = useMyUser()

    const submit = async (event: Event) => {
        event.preventDefault()
        try {
            await formHandler.validateForm()
            const updatedMember = {
                first_name: formData().first_name,
                last_name: formData().last_name,
                pronouns: formData().pronouns,
                team_role: formData().team_role,
                sub_team: formData().sub_team,
                email: formData().email,
                phone: formData().phone,
            }
            saveMemberFromProfile(updatedMember)
            alert('Data sent with success: ' + JSON.stringify(formData()))
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div class="card max-w-5xl bg-base-100 shadow-xl mt-4">
            <div class="card-body">
                <h2 class="card-title">Edit Profile</h2>

                <form onSubmit={submit}>
                    <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <TextField
                            label="First Name"
                            altLabel="Required"
                            name="first_name"
                            value={member().first_name}
                            formHandler={formHandler}
                        />
                        <TextField
                            label="First Name"
                            altLabel="Required"
                            name="last_name"
                            value={member().last_name}
                            formHandler={formHandler}
                        />
                        <TextField
                            label="Pronouns"
                            name="pronouns"
                            value={member().pronouns}
                            formHandler={formHandler}
                        />
                        <SelectableField
                            label="Team Role"
                            altLabel="Readonly"
                            name="team_role"
                            options={[
                                { value: TeamRole.MEMBER, label: 'Member' },
                                { value: TeamRole.CAPTAIN, label: 'Captain' },
                                { value: TeamRole.MENTOR, label: 'Mentor' },
                            ]}
                            value={member().team_role}
                            formHandler={formHandler}
                            disabled
                        />
                        <SelectableField
                            label="Sub Team"
                            name="sub_team"
                            options={[
                                { value: SubTeam.BUILD, label: 'Build' },
                                { value: SubTeam.PROGRAMMING, label: 'Programming' },
                                { value: SubTeam.OPERATIONS, label: 'Operations' },
                            ]}
                            value={member().sub_team}
                            formHandler={formHandler}
                        />
                        <TextField
                            label="Email Address"
                            altLabel="Readonly"
                            name="email"
                            value={member().email}
                            readonly
                            formHandler={formHandler}
                        />
                        <TextField label="Phone Number" name="phone" value={member().phone} formHandler={formHandler} />
                        <TextField
                            label="Food needs"
                            altLabel="vegan/gluten free"
                            name="food_needs"
                            value={member().food_needs}
                            formHandler={formHandler}
                        />
                    </div>
                    <div class="card-actions justify-end">
                        <A href="/profile">
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
            </div>
        </div>
    )
}

export default ProfileEdit
