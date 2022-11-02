import { Component, createSignal } from 'solid-js'
import { A } from '@solidjs/router'
import { HiOutlineEye, HiOutlineMenu, HiOutlinePencilAlt, HiOutlineTrash } from 'solid-icons/hi'

const ViewEditDeleteMenu: Component<{ viewLink: string; editLink: string; deleteFn: Function }> = (props) => {
    const [show, setShow] = createSignal(false)

    const toggle = () => {
        setShow(!show())
    }

    const close = () => {
        setShow(false)
    }

    const handleDelete = (event) => {
        event.preventDefault()
        close()
        props.deleteFn()
    }
    return (
        <div class="relative">
            <div class="dropdown " onClick={toggle}>
                <label tabindex="0" class="btn btn-square btn-ghost">
                    <HiOutlineMenu size={24} />
                </label>
            </div>
            <ul
                tabindex="0"
                class="menu absolute right-14 bottom-0 z-50 dropdown-content shadow bg-base-100 rounded-box w-52 mt-4 border"
                classList={{ hidden: !show() }}
            >
                <li>
                    <A href={props.viewLink} onClick={close}>
                        <HiOutlineEye fill="none" class="mb-3 mr-2" />
                        View
                    </A>
                </li>
                <li>
                    <A href={props.editLink} onClick={close}>
                        <HiOutlinePencilAlt fill="none" class="mb-3 mr-2" />
                        Edit
                    </A>
                </li>
                <li>
                    <a href="#" onClick={handleDelete}>
                        <HiOutlineTrash fill="none" class="mb-3 mr-2" />
                        Delete
                    </a>
                </li>
            </ul>
        </div>
    )
}

export default ViewEditDeleteMenu
