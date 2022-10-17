import { Outlet } from '@solidjs/router'
import { Component, Show } from 'solid-js'
import NoAccessAlert from '../../components/NoAccessAlert'
import { useMyUser } from '../../contexts/UserContext'

const AdminAccess: Component = (props) => {
    const [authSession, googleUser, member, { isAdmin }] = useMyUser()
    return (
        <Show when={isAdmin()} fallback={<NoAccessAlert />}>
            <Outlet />
        </Show>
    )
}

export default AdminAccess
