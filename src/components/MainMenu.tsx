import { A, useLocation } from '@solidjs/router'
import { HiOutlineMenu } from 'solid-icons/hi'
import { children, Component, createEffect, createSignal, ErrorBoundary, JSX, Show } from 'solid-js'
import PersonMenu from './PersonMenu'
import unicorn from '../assets/2491_logo_disc_outline.png'
import { useMyUser } from '../contexts/UserContext'
import { capitalizeWord } from '../utilities/formatters'

const MainMenu: Component<{ children: JSX.Element }> = (props) => {
    const content = children(() => props.children)
    const [authSession, googleUser, member, { isMember, isAdmin }] = useMyUser()
    const [checked, setChecked] = createSignal(false)
    const location = useLocation()
    const [path, setpath] = createSignal('')

    const setPageNameFromPath = () => {
        const position = location.pathname.lastIndexOf('/') + 1
        const page = location.pathname.substring(position, location.pathname.length)
        setpath(capitalizeWord(page))
    }

    createEffect(() => {
        setPageNameFromPath()
    })

    // the state is changed in the dom, so solid doesn't know it changed, so we need to switch it twice
    const closeMenu = () => {
        setChecked(true)
        setChecked(false)
    }

    return (
        <div class="bg-base-300 overscroll-contain">
            <div class="drawer drawer-mobile">
                <input id="my-drawer-2" type="checkbox" checked={checked()} class="drawer-toggle" />
                <div class="drawer-content flex flex-col m-4 lg:ml-0">
                    <div class="navbar bg-primary rounded-lg">
                        <label for="my-drawer-2" class="btn btn-square btn-ghost drawer-button lg:hidden">
                            <HiOutlineMenu size={24} />
                        </label>
                        <div class="flex-1 text-xl text-white font-semibold">NoMythic - {path()}</div>
                        <div class="flex-none">
                            <PersonMenu />
                        </div>
                    </div>
                    {content()}
                </div>
                <div class="drawer-side lg:m-4">
                    <label for="my-drawer-2" class="drawer-overlay"></label>
                    <div class="menu overflow-y-auto w-80 bg-base-100 text-base-content rounded-lg">
                        <div class="mt-4 mb-8 flex justify-center">
                            <img src={unicorn} class="w-60 h-60"></img>
                        </div>
                        <ul>
                            <li>
                                <A href="/home" onClick={closeMenu}>
                                    Home
                                </A>
                            </li>
                            <Show when={isMember()}>
                                <li>
                                    <A href="/members/attendance" onClick={closeMenu}>
                                        Attendance
                                    </A>
                                </li>
                            </Show>
                            <Show when={isAdmin()}>
                                <li>
                                    <A href="/admin/teamlist" onClick={closeMenu}>
                                        Team List
                                    </A>
                                </li>
                                <li>
                                    <A href="/admin/attendance" onClick={closeMenu}>
                                        Admin Attendance
                                    </A>
                                </li>
                            </Show>
                            <li>
                                <A href="/guest" onClick={closeMenu}>
                                    Guest Area
                                </A>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MainMenu
