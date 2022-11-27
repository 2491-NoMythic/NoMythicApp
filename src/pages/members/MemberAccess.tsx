import { Outlet } from '@solidjs/router'
import { Component, Show } from 'solid-js'
import NoAccessAlert from '../../components/NoAccessAlert'
import { useNoMythicUser } from '../../contexts/UserContext'

const MemberAccess: Component = (props) => {
    const { isMember } = useNoMythicUser()
    return (
        <Show when={isMember()} fallback={<NoAccessAlert />}>
            <Outlet />
        </Show>
    )
}

export default MemberAccess
