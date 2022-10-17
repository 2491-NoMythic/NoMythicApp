import { Component } from 'solid-js'
import HamburgerMenu from './HamburgerMenu'
import PersonMenu from './PersonMenu'
import { useLocation } from '@solidjs/router'
const AppToolBar: Component = () => {
    const location = useLocation()
    return (
        <div class="navbar bg-base-100 rounded-lg">
            <div class="flex-none">
                <HamburgerMenu />
            </div>
            <div class="flex-1 text-xl text-purple-600 font-semibold">
                NoMythic {location.pathname}
            </div>
            <div class="flex-none">
                <PersonMenu />
            </div>
        </div>
    )
}

export default AppToolBar
