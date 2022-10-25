import { HiOutlineFire } from 'solid-icons/hi'
import { Component, createEffect, createSignal, Show } from 'solid-js'

const ErrorAlert: Component<{ error: any; reset: Function }> = (props) => {
    const [showError, setShowError] = createSignal(false)

    const toggleError = () => {
        setShowError(!showError())
    }

    const close = () => {
        setShowError(false)
        props.reset()
    }

    return (
        <div class="modal modal-open modal-bottom sm:modal-middle visible">
            <div class="modal-box bg-error text-primary-content">
                <div class="flex">
                    <HiOutlineFire fill="none" />
                    <h3 class="font-bold ml-4">Zoinks! Something unexpected happened!</h3>
                </div>
                <p class="py-4">Try closing this and try again, or refresh the page and try again.</p>
                <Show when={showError()}>
                    <div class="card bg-neutral text-neutral-content p-4">
                        <p>
                            {props.error.name} {props.error.message}
                        </p>

                        <p>{props.error.stack}</p>
                    </div>
                </Show>
                <div class="modal-action flex-none">
                    <button class="btn" onClick={toggleError}>
                        See Error
                    </button>
                    <button class="btn btn-primary" onClick={close}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ErrorAlert
