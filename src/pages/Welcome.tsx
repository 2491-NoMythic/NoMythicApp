import { Component, Switch, Match, createSignal, Show, onMount, createResource, Suspense } from 'solid-js'
import { useMyUser } from '../contexts/UserContext'
import logo from '../assets/logo.png'
import { useNavigate } from '@solidjs/router'
import PageLoading from '../components/PageLoading'
import { RouteKeys } from '../components/AppRouting'
import NextEvents from '../components/NextEvents'
import Config from '../config'

const Welcome: Component = () => {
    const [authSession, googleUser, member, { isLoggedIn, isMember }] = useMyUser()
    const navigate = useNavigate()

    // this is a little weird, but it is to prevent flashing on the screen as the 'is' methods resolve.
    const createDelay = () => {
        return new Promise((resolve) => setTimeout(() => resolve(Date.now()), 700))
    }
    const [time] = createResource('time', createDelay)

    const continueAsGuest = () => {
        navigate(RouteKeys.GUEST.nav)
    }

    // note: switch will pick the first Match found. if none found, then fallback
    return (
        <Suspense fallback={<PageLoading />}>
            <Show when={time()}>
                <div class="flex flex-col items-center justify-center">
                    <Switch
                        fallback={
                            <div class="card lg:card-side bg-base-100 shadow-xl mt-10 max-w-4xl">
                                <figure class="p-6">
                                    <img src={logo} alt="Team Logo" />
                                </figure>
                                <div class="card-body">
                                    <h2 class="card-title">Sorry Friend!</h2>
                                    <p>
                                        It looks like google didn't log you in. You must first have a working Google
                                        Email account to login. A school account will work. You can still continue into
                                        the guest area if you would like.
                                    </p>
                                    <div class="card-actions justify-end">
                                        <button class="btn btn-primary" onClick={continueAsGuest}>
                                            Guest Area
                                        </button>
                                    </div>
                                </div>
                            </div>
                        }
                    >
                        <Match when={isMember()}>
                            <div class="m-4 max-w-4xl">
                                <div class="card lg:card-side bg-base-100 shadow-xl">
                                    <figure class="p-6">
                                        <img src={logo} alt="Team Logo" class="w-60 h-60" />
                                    </figure>
                                    <div class="card-body w-200px">
                                        <h2 class="card-title">
                                            Welcome {member().first_name + ' ' + member().last_name}
                                        </h2>
                                        <p>
                                            Today is a good day for robotics. <br />
                                            We see you. We hear you. You matter.
                                        </p>
                                    </div>
                                </div>
                                <NextEvents />
                            </div>
                        </Match>
                        <Match when={isLoggedIn()}>
                            <div class="card lg:card-side bg-base-100 shadow-xl mt-10 max-w-4xl">
                                <figure class="p-6">
                                    <img src={logo} alt="Team logo" class="w-60 h-60" />
                                </figure>
                                <div class="card-body">
                                    <h2 class="card-title">Hello Friend!</h2>
                                    <p>
                                        It looks like google logged you in, but you are not a member of{' '}
                                        {Config.teamName}. {googleUser().fullName}, if there has been an error, contact
                                        a mentor. You can check you google email by checking your profile by clicking on
                                        the icon at the top right of the app. This email may not be the same the team
                                        has, but needs to be to log in.
                                    </p>
                                    <p>In the future we will have more collaboration options for logged in users.</p>
                                    <div class="card-actions justify-end">
                                        <button class="btn btn-primary" onClick={continueAsGuest}>
                                            Guest Area
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Match>
                    </Switch>
                </div>
            </Show>
        </Suspense>
    )
}

export default Welcome
