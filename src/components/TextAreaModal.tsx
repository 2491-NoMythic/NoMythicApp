import { HiOutlineDocumentText } from 'solid-icons/hi'
import { Component } from 'solid-js'

const TextAreaModal: Component<{ title: string; text: string; callback: Function }> = (props) => {
    let textbox: HTMLTextAreaElement

    type data = { type: string }
    const handler = (data: data, event) => {
        event.preventDefault()
        props.callback(data.type, textbox.value)
    }

    return (
        <div class="modal modal-open modal-bottom sm:modal-middle">
            <div class="modal-box">
                <div class="flex">
                    <HiOutlineDocumentText fill="none" />
                    <h3 class="font-bold ml-4">{props.title}</h3>
                </div>
                <div class="mt-8">
                    <textarea ref={textbox} class="textarea textarea-bordered h-48 w-full text-base">
                        {props.text}
                    </textarea>
                </div>
                <div class="modal-action flex-none">
                    <button class="btn" onClick={[handler, { type: 'CANCEL' }]}>
                        Cancel
                    </button>
                    <button class="btn btn-primary" onClick={[handler, { type: 'SAVE' }]}>
                        Save
                    </button>
                </div>
            </div>
        </div>
    )
}

export default TextAreaModal
