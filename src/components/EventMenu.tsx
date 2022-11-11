import { Component, createSignal, Show } from 'solid-js'
import { A, useSearchParams } from '@solidjs/router'
import { HiOutlineMenu } from 'solid-icons/hi'
import { useMyUser } from '../contexts/UserContext'
import { RouteKeys } from './AppRouting'
import { formatUrl } from '../utilities/formatters'

type inputs = { eventId: number }
const EventMenu: Component<inputs> = (props) => {
    const [show, setShow] = createSignal(false)
    const [searchParams] = useSearchParams()

    const toggle = () => {
        setShow(!show())
    }

    const close = (event) => {
        setShow(false)
    }

    const [authSession, googleUser, member, { isMember, isAdmin }] = useMyUser()

    return (
        <Show when={isMember}>
            <div class="dropdown" onClick={toggle}>
                <label tabindex="0" class="btn btn-square btn btn-ghost -mt-1">
                    <HiOutlineMenu size={24} />
                </label>
            </div>
            <ul
                tabindex="0"
                class="menu absolute top-24 z-50 dropdown-content shadow bg-base-100 rounded-box w-52 mt-4 border"
                classList={{ hidden: !show() }}
            >
                <Show when={isAdmin()}>
                    <li>
                        <A href={RouteKeys.TAKE_ATTENDANCE.nav} onClick={close}>
                            Take Attendance
                        </A>
                    </li>
                    <li>
                        <A
                            href={formatUrl(RouteKeys.ATTENDANCE_MEETING.nav, {}, { meetingDate: searchParams?.date })}
                            onClick={close}
                        >
                            Admin Attendance
                        </A>
                    </li>
                </Show>
                <li>
                    <A
                        href={formatUrl(RouteKeys.EVENT_EDIT.nav, { id: props.eventId }, { date: searchParams?.date })}
                        onClick={close}
                    >
                        Edit Event
                    </A>
                </li>
            </ul>
        </Show>
    )
}

export default EventMenu
