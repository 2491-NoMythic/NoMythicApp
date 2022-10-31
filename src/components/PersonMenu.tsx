import { Component, createSignal, Show, Switch, Match, createEffect, For } from 'solid-js'
import { HiOutlineUser } from 'solid-icons/hi'
import { supabase } from '../api/SupabaseClient'
import { useMyUser } from '../contexts/UserContext'
import { useNavigate } from '@solidjs/router'
import Settings from './Settings'

const PersonMenu: Component = () => {
    const [show, setShow] = createSignal(false)
    const [showSettings, setShowSettings] = createSignal(false)

    const navigate = useNavigate()

    const toggle = () => {
        setShow(!show())
    }

    const signOut = async () => {
        const { error } = await supabase.auth.signOut()
        setShow(false)
    }

    const openSettings = () => {
        setShow(false)
        setShowSettings(true)
    }

    const closeSettings = () => {
        setShowSettings(false)
    }

    const navToProfile = () => {
        setShow(false)
        navigate('/profile')
    }

    const [authSession, googleUser, member, { isLoggedIn, isMember }] = useMyUser()

    return (
        <>
            <div class="dropdown" onClick={toggle}>
                <label tabindex="0" class="btn btn-square btn-ghost">
                    <Show when={isLoggedIn()} fallback={<HiOutlineUser size={24} />}>
                        <div class="avatar">
                            <div class="w-8 rounded-full">
                                <img src={googleUser().avatarUrl} />
                            </div>
                        </div>
                    </Show>
                </label>
            </div>
            <ul
                tabindex="0"
                class="menu absolute top-20 right-6 z-50 dropdown-content shadow bg-base-100 rounded-box w-52 mt-4 border"
                classList={{ hidden: !show() }}
            >
                <Switch
                    fallback={
                        <li>
                            <p class="pointer-events-none text-purple-600">Guest</p>
                        </li>
                    }
                >
                    <Match when={isLoggedIn() && !isMember()}>
                        <li>
                            <p class="pointer-events-none text-purple-600">Non-Member</p>
                        </li>
                    </Match>
                    <Match when={isMember()}>
                        <li>
                            <p class="pointer-events-none text-purple-600">Member</p>
                        </li>
                    </Match>
                </Switch>
                <Show when={isLoggedIn()}>
                    <hr />
                    <li onClick={navToProfile}>
                        <p>Profile</p>
                    </li>
                    <li onClick={openSettings}>
                        <p>Settings</p>
                    </li>
                    <li onClick={signOut}>
                        <p>Logout</p>
                    </li>
                </Show>
            </ul>
            <Settings show={showSettings()} closeFn={closeSettings} />
        </>
    )
}

export default PersonMenu
