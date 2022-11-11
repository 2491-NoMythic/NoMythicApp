import { FormHandler } from 'solid-form-handler'
import { Component, createEffect, JSX, onMount, splitProps } from 'solid-js'
import { createStore } from 'solid-js/store'

export interface CheckboxProps extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    display?: 'switch'
    error?: boolean
    errorMessage?: string
    formHandler?: FormHandler
    label?: string
    altLabel?: string
    uncheckedValue?: string | number
    triggers?: string[]
}

export const Checkbox: Component<CheckboxProps> = (props) => {
    /**
     * Props are divided in two groups:
     * - local: newer or extended/computed props.
     * - rest: remaining inherited props applied to the original component.
     */
    const [local, rest] = splitProps(props, [
        'checked',
        'display',
        'error',
        'errorMessage',
        'formHandler',
        'id',
        'label',
        'altLabel',
        'onBlur',
        'onChange',
        'uncheckedValue',
        'classList',
        'triggers',
    ])

    /**
     * Derived/computed states from props.
     */
    const [store, setStore] = createStore({
        errorMessage: '',
        error: false,
        id: '',
        checked: false,
    })

    /**
     * Extended onInput event.
     */
    const onChange: CheckboxProps['onChange'] = (event) => {
        const value = event.currentTarget.checked
        //Form handler prop sets and validate the value onInput.
        local.formHandler?.setFieldValue?.(rest.name, value)
        setStore('checked', value)

        //onInput prop is preserved
        if (typeof local.onChange === 'function') {
            local.onChange(event)
        } else {
            local.onChange?.[0](local.onChange?.[1], event)
        }
    }

    /**
     * Extended onBlur event.
     */
    const onBlur: CheckboxProps['onBlur'] = (event) => {
        //Form handler prop validate and touch the field.
        local.formHandler?.validateField?.(rest.name)
        local.formHandler?.touchField?.(rest.name)

        //onBlur prop is preserved
        if (typeof local.onBlur === 'function') {
            local.onBlur(event)
        } else {
            local.onBlur?.[0](local.onBlur?.[1], event)
        }
    }

    createEffect(() => {
        setStore('checked', local.formHandler?.getFieldValue?.(rest.name))
    })

    /**
     * Updates error message signal according to the given prop or form handler state.
     */
    createEffect(() => {
        setStore('errorMessage', local.errorMessage || local.formHandler?.getFieldError?.(rest.name) || '')
    })

    /**
     * Updates error flag signal according to the given prop or form handler state.
     */
    createEffect(() => {
        setStore('error', local.error || local.formHandler?.fieldHasError?.(rest.name) || false)
    })

    /**
     * Initializes the form field unique id.
     */
    createEffect(() => {
        setStore('id', local.id || rest.name || '')
    })

    /**
     * Initializes the form field default value.
     */
    onMount(() => {
        local.formHandler?.setFieldDefaultValue?.(rest.name, local.checked)
    })

    return (
        <div class="form-control grow" classList={local.classList}>
            <label class="label" for={store.id}>
                {local.label && <span class="label-text">{local.label}</span>}
                {local.altLabel && <span class="label-text-alt">{local.altLabel}</span>}
            </label>
            <input
                {...rest}
                type="checkbox"
                classList={{ 'is-invalid': store.error, 'form-check-input': true }}
                class="toggle toggle-secondary"
                checked={store.checked}
                id={store.id}
                onChange={onChange}
                onBlur={onBlur}
            />
            <label class="label">
                {store.error && <span class="label-text-alt text-error">{store.errorMessage}</span>}
            </label>

            {store.error && <div class="invalid-feedback">{store.errorMessage}</div>}
        </div>
    )
}
;<div class="form-control grow">
    <input type="checkbox" class="toggle toggle-secondary" checked />
    <label class="label">
        <span class="label-text-alt text-error"></span>
    </label>
</div>
