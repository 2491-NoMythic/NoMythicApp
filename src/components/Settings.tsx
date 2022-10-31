import { Component, createEffect, For, Show } from 'solid-js'
import { createStoredSignal } from '../utilities/StorageSignal'

const Settings: Component<{ show: boolean; closeFn: Function }> = (props) => {
    const [theme, setTheme] = createStoredSignal<string>('theme', 'default')
    const themes = [
        { value: 'default', label: 'OS Default' },
        { value: 'light', label: 'Light' },
        { value: 'dark', label: 'Dark' },
        { value: 'retro', label: 'Retro' },
        { value: 'synthwave', label: 'Synthwave' },
        { value: 'aqua', label: 'Aqua' },
        { value: 'cyberpunk', label: 'Cyberpunk' },
        { value: 'coffee', label: 'Coffee' },
        { value: 'halloween', label: 'Halloween' },
    ]

    createEffect(() => {
        const newTheme = theme() === 'default' ? '' : theme()
        document.documentElement.setAttribute('data-theme', newTheme)
    })

    const handleThemeChange = (event) => {
        const value = event.target.selectedOptions[0].value
        setTheme(value)
    }

    const handleClose = () => {
        props.closeFn()
    }

    return (
        <Show when={props.show}>
            <div class="modal modal-open">
                <div class="modal-box">
                    <h3 class="font-bold text-lg">Settings</h3>
                    <div class="py-4">
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Select Theme</span>
                            </label>
                            <select class="select select-bordered" onChange={handleThemeChange}>
                                <For each={themes}>
                                    {(aTheme) => {
                                        return (
                                            <option selected={aTheme.value === theme()} value={aTheme.value}>
                                                {aTheme.label}
                                            </option>
                                        )
                                    }}
                                </For>
                            </select>
                        </div>
                    </div>
                    <div class="modal-action">
                        <button class="btn btn-secondary" onClick={handleClose}>
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </Show>
    )
}

export default Settings
