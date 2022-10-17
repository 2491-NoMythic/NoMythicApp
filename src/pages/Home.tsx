import { Component } from 'solid-js'
import { useNavigate } from '@solidjs/router'
import { supabase } from '../api/SupabaseClient'

const redirectUrl = import.meta.env.VITE_REDIRECT_URL

const Home: Component = () => {
    const navigate = useNavigate()

    const signInWithGoogle = async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: redirectUrl,
            },
        })
    }

    const continueAsGuest = () => {
        navigate('/guest')
    }

    return (
        <div class="flex flex-col items-center justify-center">
            <div class="card w-96 bg-base-100 shadow-xl mt-10">
                <div class="card-body">
                    <h2 class="card-title">Team Login</h2>
                    <p>
                        Team members must log in with a google account, such as
                        your school email. You will have to approve NoMythic
                        with google the first time.
                    </p>
                    <div class="card-actions justify-end">
                        <button
                            class="btn btn-primary"
                            onClick={signInWithGoogle}
                        >
                            Login
                        </button>
                    </div>
                </div>
            </div>
            <div class="card w-96 bg-base-100 shadow-xl mt-10">
                <div class="card-body">
                    <h2 class="card-title">Continue as guest</h2>
                    <p>
                        Non members can still check out the team in the guest
                        area.
                    </p>
                    <div class="card-actions justify-end">
                        <button
                            class="btn btn-primary"
                            onClick={continueAsGuest}
                        >
                            Guest
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home
