import { Outlet } from '@solidjs/router'
import { Component, Show } from 'solid-js'
import NoAccessAlert from '../../components/NoAccessAlert'
import { useMyUser } from '../../contexts/UserContext'

const MemberAccess: Component = (props) => {
    const [authSession, googleUser, member, { isMember }] = useMyUser()
    return (
        <Show when={isMember()} fallback={<NoAccessAlert />}>
            <Outlet />
        </Show>
    )
}

export default MemberAccess
