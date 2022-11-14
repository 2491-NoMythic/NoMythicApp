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

    return (
        <div class="relative">
            <div class="dropdown" onClick={toggle}>
                <label tabindex="0" class="btn btn-square btn btn-ghost -mt-1">
                    <HiOutlineMenu size={24} />
                </label>
            </div>
            <ul
                tabindex="0"
                class="menu absolute top-10 right-2 z-50 dropdown-content shadow bg-base-100 rounded-box w-52 mt-4 border"
                classList={{ hidden: !show() }}
            >
                <li>
                    <A href={formatUrl(RouteKeys.TAKE_ATTENDANCE_ID.nav, { id: props.eventId })} onClick={close}>
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

                <li>
                    <A
                        href={formatUrl(RouteKeys.EVENT_EDIT.nav, { id: props.eventId }, { date: searchParams?.date })}
                        onClick={close}
                    >
                        Edit Event
                    </A>
                </li>
            </ul>
        </div>
    )
}

export default EventMenu
