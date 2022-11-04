import { A } from '@solidjs/router'
import { Component, Show } from 'solid-js'
import { RouteKeys } from '../components/AppRouting'
import { useMyUser } from '../contexts/UserContext'
import { capitalizeWord } from '../utilities/formatters'

const Profile: Component = () => {
    const [authSession, googleUser, member, { isLoggedIn, isMember }] = useMyUser()

    return (
        <>
            <Show
                when={isLoggedIn()}
                fallback={
                    <div class="alert alert-error shadow-lg mt-20">
                        <div>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="stroke-current flex-shrink-0 h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <span>What are you doing here? There is no profile to see if you are not logged in.</span>
                        </div>
                    </div>
                }
            >
                <div class="card max-w-5xl bg-base-100 shadow-xl mt-4">
                    <div class="card-body pb-6 lg:pb-4">
                        <h2 class="card-title">Google</h2>
                        <table class="table w-full">
                            <tbody>
                                <tr>
                                    <td>Full Name</td>
                                    <td>{googleUser().fullName}</td>
                                </tr>
                                <tr>
                                    <td>Email</td>
                                    <td>{googleUser().email}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </Show>
            <Show when={isMember()}>
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
                                    <td>Email</td>
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
                            </tbody>
                        </table>
                        <div class="card-actions justify-end">
                            <label for="my-modal" class="btn btn-primary modal-button">
                                <A href={RouteKeys.PROFILE_EDIT.nav}>Edit</A>
                            </label>
                        </div>
                    </div>
                </div>
            </Show>
        </>
    )
}

export default Profile
