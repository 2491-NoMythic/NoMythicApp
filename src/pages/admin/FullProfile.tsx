import { A } from '@solidjs/router'
import { Component } from 'solid-js'
import { useMyUser } from '../../contexts/UserContext'
import { capitalizeWord } from '../../utilities/formatters'

const Profile: Component = () => {
    const [authSession, googleUser, member] = useMyUser()

    return (
        <>
            <div class="card max-w-5xl bg-base-100 shadow-xl mt-4">
                <div class="card-body">
                    <h2 class="card-title">NoMythic</h2>
                    <table class="table w-full">
                        <tbody>
                            <tr>
                                <td>First Name</td>
                                <td>{member().first_name}</td>
                            </tr>
                            <tr>
                                <td>Last Name</td>
                                <td>{member().last_name}</td>
                            </tr>
                            <tr>
                                <td>Pronouns</td>
                                <td>{member().pronouns}</td>
                            </tr>
                            <tr>
                                <td>Sub Team</td>
                                <td>{capitalizeWord(member().sub_team)}</td>
                            </tr>
                            <tr>
                                <td>Team Role</td>
                                <td>{capitalizeWord(member().team_role)}</td>
                            </tr>
                            <tr>
                                <td>Eamil</td>
                                <td>{member().email}</td>
                            </tr>
                            <tr>
                                <td>Phone</td>
                                <td>{member().phone}</td>
                            </tr>
                            <tr>
                                <td>Food Needs</td>
                                <td>{member().food_needs}</td>
                            </tr>
                            <tr>
                                <td>School</td>
                                <td>{member().school}</td>
                            </tr>
                            <tr>
                                <td>Advisor</td>
                                <td>{member().advisor}</td>
                            </tr>
                            <tr>
                                <td>Grade</td>
                                <td>{member().grade}</td>
                            </tr>
                            <tr>
                                <td>Address</td>
                                <td>{member().address}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="card-actions justify-end">
                        <label for="my-modal" class="btn btn-primary modal-button">
                            <A href="/members/profileEdit">Edit</A>
                        </label>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile
