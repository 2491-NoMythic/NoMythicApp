import { Outlet } from '@solidjs/router'
import { Component, createEffect, Show } from 'solid-js'
import NoAccessAlert from '../../components/NoAccessAlert'
import { useNoMythicUser } from '../../contexts/UserContext'

const AdminAccess: Component = (props) => {
    const { isAdmin } = useNoMythicUser()

    return (
        <Show when={isAdmin()} fallback={<NoAccessAlert />}>
            <Outlet />
        </Show>
    )
}

export default AdminAccess
