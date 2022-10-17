import { Component, createSignal } from 'solid-js'
import { IoCalendarOutline } from 'solid-icons/io'

const DatePicker: Component = () => {
    const [show, setShow] = createSignal(false)
    const toggle = () => {
        setShow(!show())
    }
    const close = () => {
        setShow(false)
    }
    return (
        <>
            <div class="flex items-end">
                <div class="form-control max-w-xs">
                    <label class="label">
                        <span class="label-text">Select date</span>
                    </label>
                    <input
                        type="date"
                        placeholder="mm/dd/yyyy"
                        class="input input-bordered w-40"
                    />
                </div>
                {/* <label
                    for="my-modal-6"
                    class="btn bg-base-100 btn-outline modal-button"
                >
                    <IoCalendarOutline size={24} />
                </label> */}
            </div>
            <input type="checkbox" id="my-modal-6" class="modal-toggle" />
            <div class="modal modal-bottom sm:modal-middle">
                <div class="modal-box">
                    <h3 class="font-bold text-lg">
                        Congratulations random Internet user!
                    </h3>
                    <p class="py-4">I pity the fool that has to pick a date.</p>
                    <div class="modal-action">
                        <label for="my-modal-6" class="btn">
                            Yay!
                        </label>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DatePicker
