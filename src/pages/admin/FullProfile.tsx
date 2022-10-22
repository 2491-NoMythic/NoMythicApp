import { A, useParams, useSearchParams } from '@solidjs/router'
import { Component, createResource, Show } from 'solid-js'
import { getMemberById } from '../../api/members'

import { capitalizeWord } from '../../utilities/formatters'

const Profile: Component = () => {
    const params = useParams()
    const [member] = createResource(() => parseInt(params.id), getMemberById)
    const [searchParams] = useSearchParams()
    return (
        <>
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
                                <td>Eamil</td>
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
                                <td>{member()?.grade}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="card-actions justify-end">
                        <label class="btn btn-secondary modal-button mr-4">
                            <A href={'/admin/teamList?subteam=' + searchParams.subteam}>Back</A>
                        </label>
                        <label class="btn btn-primary modal-button">
                            <A href="">Edit</A>
                        </label>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile
