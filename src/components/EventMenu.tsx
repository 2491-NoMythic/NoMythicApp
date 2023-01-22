import { Component, createSignal, Show } from 'solid-js'
import { A, useSearchParams } from '@solidjs/router'
import { HiOutlineMenu } from 'solid-icons/hi'
import { RouteKeys } from './AppRouting'
import { formatUrl } from '../utilities/formatters'
import { RobotEvent } from '../types/Api'

type inputs = { robotEvent: RobotEvent; takeAttendance: boolean; dropdownDirection?: string }
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
        <div class="">
            <div
                class={`dropdown ${
                    props.dropdownDirection ? props.dropdownDirection : 'dropdown-bottom'
                } dropdown-left`}
                onClick={toggle}
            >
                <label tabindex="0" class="btn btn-square btn btn-ghost -mt-1">
                    <HiOutlineMenu size={24} />
                </label>

                <ul
                    tabindex="0"
                    class="menu dropdown-content z-50 shadow bg-base-100 rounded-box w-52 border"
                    classList={{ hidden: !show() }}
                >
                    <Show when={props.takeAttendance === true}>
                        <li>
                            <A
                                href={formatUrl(RouteKeys.TAKE_ATTENDANCE_ID.nav, { id: props.robotEvent.event_id })}
                                onClick={close}
                            >
                                Take Attendance
                            </A>
                        </li>
                        <li>
                            <A
                                href={formatUrl(RouteKeys.ATTENDANCE_MEETING.nav, { id: props.robotEvent.event_id })}
                                onClick={close}
                            >
                                Admin Attendance
                            </A>
                        </li>
                    </Show>
                    <Show when={props.takeAttendance === false}>
                        <li class="p-4">Attendance NA</li>
                    </Show>
                    <li>
                        <A
                            href={formatUrl(
                                RouteKeys.EVENT_EDIT.nav,
                                { id: props.robotEvent.event_id },
                                { date: searchParams?.date }
                            )}
                            onClick={close}
                        >
                            Edit Event
                        </A>
                    </li>
                    <li>
                        <A
                            href={formatUrl(RouteKeys.TAKE_CHECKIN_ID.nav, { id: props.robotEvent.event_id })}
                            onClick={close}
                        >
                            Checkin
                        </A>
                    </li>
                    <Show when={props.robotEvent.has_meal === true}>
                        <li>
                            <A
                                href={formatUrl(
                                    RouteKeys.MEAL_VIEW.nav,
                                    { id: props.robotEvent.event_id },
                                    { date: searchParams?.date }
                                )}
                                onClick={close}
                            >
                                Meal
                            </A>
                        </li>
                    </Show>
                </ul>
            </div>
        </div>
    )
}

export default EventMenu
