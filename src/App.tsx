import { Component, createEffect, ErrorBoundary, onMount } from 'solid-js'
import { useNavigate } from '@solidjs/router'
import { supabase } from './api/SupabaseClient'
import { AuthChangeEvent, Session } from '@supabase/supabase-js'
import { useMyUser } from './contexts/UserContext'
import { getMemberByEamil } from './api/members'
import AppRouting, { RouteKeys } from './components/AppRouting'
import ErrorAlert from './components/ErrorAlert'
import MainMenu from './components/MainMenu'

const App: Component = () => {
    const [authSession, googleUser, member, { removeUser, loadUser, loadMember, isLoggedIn, isMember }] = useMyUser()
    const navigate = useNavigate()

    onMount(() => {
        supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session) => {
            if (event === 'SIGNED_IN') {
                loadUser(session)
            } else if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
                removeUser()
                navigate(RouteKeys.HOME.nav)
            }
        })
    })

    const handleLoadMember = async () => {
        // no point if not logged in
        if (isLoggedIn() && !isMember()) {
            const member = await getMemberByEamil(googleUser().email)
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
                <div class="text-center m-6 mt-20">Brought to you by the numbers 2, 4, 9, and 1</div>
            </div>
        </MainMenu>
    )
}

export default App
