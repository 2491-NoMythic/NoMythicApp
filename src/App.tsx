import { Component, createEffect, ErrorBoundary, onMount } from 'solid-js'
import { useNavigate } from '@solidjs/router'
import { supabase } from './api/SupabaseClient'
import { AuthChangeEvent, Session } from '@supabase/supabase-js'
import { useNoMythicUser } from './contexts/UserContext'
import { getMemberByEmail } from './api/members'
import AppRouting, { RouteKeys } from './components/AppRouting'
import ErrorAlert from './components/ErrorAlert'
import MainMenu from './components/MainMenu'
import Footer from './components/Footer'

const App: Component = () => {
    const { googleUser, member, removeUser, loadUser, loadMember, isLoggedIn } = useNoMythicUser()
    const navigate = useNavigate()

    onMount(() => {
        supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
            if (event === 'SIGNED_IN') {
                loadUser(session!)
            } else if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
                removeUser()
                navigate(RouteKeys.HOME.nav)
            }
        })
    })

    const handleLoadMember = async () => {
        // no point if not logged in
        if (isLoggedIn() && member().member_id === undefined && googleUser().email !== undefined) {
            const member = await getMemberByEmail(googleUser().email!)
            if (member !== null && member.member_id !== undefined) {
                loadMember(member)
            }
        }
    }

    createEffect(() => {
        handleLoadMember()
    })

    return (
        <MainMenu>
            <div class="overflow-x-auto">
                <ErrorBoundary fallback={(err, reset) => <ErrorAlert error={err} reset={reset} />}>
                    <AppRouting />
                </ErrorBoundary>
                <Footer />
            </div>
        </MainMenu>
    )
}

export default App
