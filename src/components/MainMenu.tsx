import { A } from '@solidjs/router'
import { HiOutlineMenu } from 'solid-icons/hi'
import { children, Component, createSignal, JSX, Show } from 'solid-js'
import PersonMenu from './PersonMenu'
import { useNoMythicUser } from '../contexts/UserContext'
import PageTitle from './PageTitle'
import { RouteKeys } from './AppRouting'
import FunLogo from './FunLogo'
import Config from '../config'

/**
 * Provides the menu for the app, in either mobile or desktop view.
 * Also the PersonMenu in the top right corner
 * The solidjs A tag hilights the page you are on automatically
 *
 * @param props the content for each page as children - from AppRouting
 */
const MainMenu: Component<{ children: JSX.Element }> = (props) => {
    const content = children(() => props.children)
    const { isMember, isAdmin } = useNoMythicUser()
    const [checked, setChecked] = createSignal(false)

    // the state is changed in the dom, so solid doesn't know it changed, so we need to switch it twice
    const closeMenu = () => {
        setChecked(true)
        setChecked(false)
    }

    return (
        <div class="bg-base-300 overscroll-contain">
            <div class="drawer drawer-mobile">
                <input id="my-drawer-2" type="checkbox" checked={checked()} class="drawer-toggle" />
                <div class="drawer-content flex flex-col lg:m-4 lg:ml-0">
                    <div class="navbar bg-primary rounded-lg">
                        <label for="my-drawer-2" class="btn btn-square btn-ghost drawer-button lg:hidden">
                            <HiOutlineMenu size={24} />
                        </label>
                        <PageTitle />
                        <div class="flex-none">
                            <PersonMenu />
                        </div>
                    </div>
                    {content()}
                </div>
                <div class="drawer-side lg:m-4">
                    <label for="my-drawer-2" class="drawer-overlay"></label>
                    <div class="overflow-y-auto w-80 bg-base-100 text-base-content rounded-lg">
                        <div class="mt-4 mb-8 flex justify-center">
                            <FunLogo />
                        </div>
                        <ul class="menu">
                            <li>
                                <A href={RouteKeys.HOME.nav} onClick={closeMenu}>
                                    Home
                                </A>
                            </li>
                            <Show when={isMember()}>
                                <li>
                                    <A href={RouteKeys.TEAM_LIST.nav} onClick={closeMenu}>
                                        Team List
                                    </A>
                                </li>
                                <li>
                                    <A href={RouteKeys.TAKE_ATTENDANCE.nav} onClick={closeMenu}>
                                        Take Attendance
                                    </A>
                                </li>
                                <li>
                                    <A href={RouteKeys.FULL_CALENDAR.nav} onClick={closeMenu}>
                                        Team Calendar
                                    </A>
                                </li>
                                {/* <li>
                                    <A href={RouteKeys.DULUTH.nav} onClick={closeMenu}>
                                        Duluth
                                    </A>
                                </li> */}
                            </Show>
                            <Show when={isAdmin()}>
                                <li>
                                    <A href={RouteKeys.TAKE_CHECKIN.nav} onClick={closeMenu}>
                                        Check In
                                    </A>
                                </li>
                                <li>
                                    <A href={RouteKeys.ATTENDANCE_SEASON.nav} onClick={closeMenu}>
                                        Admin Attendance
                                    </A>
                                </li>
                                <Show when={Config.hasTeamMeals}>
                                    <li>
                                        <A href={RouteKeys.MEAL_LIST.nav} onClick={closeMenu}>
                                            Admin Meals
                                        </A>
                                    </li>
                                </Show>
                            </Show>
                            <li>
                                <A href={RouteKeys.GUEST.nav} onClick={closeMenu}>
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
