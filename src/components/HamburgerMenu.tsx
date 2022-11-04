import { Component, createSignal, Show } from 'solid-js'
import { A } from '@solidjs/router'
import { HiOutlineMenu } from 'solid-icons/hi'
import { useMyUser } from '../contexts/UserContext'
import { RouteKeys } from './AppRouting'

const HamburgerMenu: Component = () => {
    const [show, setShow] = createSignal(false)

    const toggle = () => {
        setShow(!show())
    }

    const close = (event) => {
        setShow(false)
    }

    const [authSession, googleUser, member, { isLoggedIn, isMember }] = useMyUser()

    return (
        <>
            <div class="dropdown" onClick={toggle}>
                <label tabindex="0" class="btn btn-square btn-ghost">
                    <HiOutlineMenu size={24} />
                </label>
            </div>
            <ul
                tabindex="0"
                class="menu absolute top-20 z-50 dropdown-content shadow bg-base-100 rounded-box w-52 mt-4 border"
                classList={{ hidden: !show() }}
            >
                <li>
                    <A href={RouteKeys.HOME.nav} onClick={close}>
                        Home
                    </A>
                </li>
                <Show when={isMember()}>
                    <li>
                        <A href={RouteKeys.TAKE_ATTENDANCE.nav} onClick={close}>
                            Take Attendance
                        </A>
                    </li>
                </Show>
                {/* Need check for team role or something */}
                <Show when={isMember()}>
                    <li>
                        <A href={RouteKeys.TEAM_LIST.nav} onClick={close}>
                            Team List
                        </A>
                    </li>
                </Show>
                <li>
                    <A href={RouteKeys.GUEST.nav} onClick={close}>
                        Guest
                    </A>
                </li>
            </ul>
        </>
    )
}

export default HamburgerMenu
