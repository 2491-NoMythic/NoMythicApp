import { Component, createSignal, Show, Switch, Match, createEffect, For } from 'solid-js'
import { HiOutlineUser } from 'solid-icons/hi'
import { supabase } from '../api/SupabaseClient'
import { useMyUser } from '../contexts/UserContext'
import { useNavigate } from '@solidjs/router'
import { themeChange } from 'theme-change'
import { createStoredSignal } from '../utilities/StorageSignal'

const PersonMenu: Component = () => {
    const [show, setShow] = createSignal(false)
    const [showSettings, setShowSettings] = createSignal(false)
    const [theme, setTheme] = createStoredSignal<string>('theme', 'default')
    const themes = [
        { value: 'default', label: 'OS Default' },
        { value: 'light', label: 'Light' },
        { value: 'dark', label: 'Dark' },
        { value: 'retro', label: 'Retro' },
    ]
    const navigate = useNavigate()

    createEffect(() => {
        console.log('setting theme', theme())
        const newTheme = theme() === 'default' ? '' : theme()
        document.documentElement.setAttribute('data-theme', newTheme)
    })

    const handleThemeChange = (event) => {
        const value = event.target.selectedOptions[0].value
        console.log('theme change', value)
        setTheme(value)
    }

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
        themeChange()
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
                    <li onClick={signOut}>
                        <p>Logout</p>
                    </li>
                    <li onClick={openSettings}>
                        <p>Settings</p>
                    </li>
                </Show>
            </ul>
            <Show when={showSettings()}>
                <div class="modal modal-open">
                    <div class="modal-box">
                        <h3 class="font-bold text-lg">Settings</h3>
                        <div class="py-4">
                            <div class="form-control">
                                <label class="label">
                                    <span class="label-text">Select Theme</span>
                                </label>
                                <select class="select select-bordered" onChange={handleThemeChange}>
                                    <For each={themes}>
                                        {(aTheme) => {
                                            return (
                                                <option selected={aTheme.value === theme()} value={aTheme.value}>
                                                    {aTheme.label}
                                                </option>
                                            )
                                        }}
                                    </For>
                                </select>
                            </div>
                        </div>
                        <div class="modal-action">
                            <button class="btn btn-secondary" onClick={closeSettings}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </Show>
        </>
    )
}

export default PersonMenu
