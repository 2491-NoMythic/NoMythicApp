import { FormHandler } from 'solid-form-handler'
import IoCalendarOutline from '../../components/icons/IoCalendarOutline'
import { Component, createEffect, createSignal, JSX, onCleanup, onMount, Show, splitProps } from 'solid-js'
import { createStore } from 'solid-js/store'
import DatePicker from '../../calendar/components/DatePicker'
import { toDate, toYMD } from '../../calendar/utilities'

export interface DateFieldProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
    error?: boolean
    errorMessage?: string
    formHandler?: FormHandler
    label?: string
    altLabel?: string
}

export const DateField: Component<DateFieldProps> = (props) => {
    /**
     * Props are divided in two groups:
     * - local: newer or extended/computed props.
     * - rest: remaining inherited props applied to the original component.
     */
    const [local, rest] = splitProps(props, [
        'error',
        'errorMessage',
        'formHandler',
        'id',
        'label',
        'altLabel',
        'onBlur',
        'onInput',
        'value',
        'classList',
    ])

    /**
     * Derived/computed states from props.
     */
    const [store, setStore] = createStore({
        errorMessage: '',
        error: false,
        value: '',
        defaultValue: '',
        id: '',
    })

    let inputRef: HTMLInputElement

    /**
     * Show the calendar picker
     */
    const [open, setOpen] = createSignal(false)

    /**
     * Extended onInput event.
     */
    const onInput: DateFieldProps['onInput'] = (event) => {
        //Form handler prop sets and validate the value onInput.
        local.formHandler?.setFieldValue?.(rest.name, event.currentTarget.value, {
            htmlElement: event.currentTarget,
        })
        //onInput prop is preserved
        if (typeof local.onInput === 'function') {
            local.onInput(event)
        } else {
            local.onInput?.[0](local.onInput?.[1], event)
        }
    }

    /**
     * Extended onBlur event.
     */
    const onBlur: DateFieldProps['onBlur'] = (event) => {
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

    /**
     * Initializes component's default value.
     */
    createEffect(() => {
        setStore('defaultValue', local.value as any)
    })

    /**
     * Controls component's value.
     */
    createEffect(() => {
        /**
         * If formHandler is defined, value is controlled
         * by the same component, if no, by the value prop.
         */
        setStore('value', local.formHandler ? local.formHandler?.getFieldValue?.(rest.name) : local.value)
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
     * Initializes the form field default.
     */
    onMount(() => {
        local.formHandler?.setFieldDefaultValue(rest.name, store.defaultValue)
    })

    /**
     * Refresh the form field when unmounted.
     */
    onCleanup(() => {
        local.formHandler?.refreshFormField(rest.name)
    })

    const showCalendar = (event) => {
        event.preventDefault()
        if (store.error) {
            local.formHandler?.setFieldValue(rest.name, store.defaultValue)
        }
        setOpen(true)
    }

    const doSelect = (selectedDate: Date) => {
        local.formHandler?.setFieldValue(rest.name, toYMD(selectedDate))
        /* this is a bit interresting. we need the html field to register a change after the date
            was picked in the picker. so we construct an input event an call onInput */
        const inputevent = new InputEvent('input', { data: toYMD(selectedDate) })
        const bigEvent = { inputevent, currentTarget: inputRef } as unknown as InputEvent & {
            currentTarget: HTMLInputElement
            target: Element
        }
        onInput(bigEvent)
        setOpen(false)
    }

    return (
        <>
            <div classList={local.classList}>
                <div class="form-control w-full max-w-xs">
                    <label class="label" for={store.id}>
                        {local.label && <span class="label-text">{local.label}</span>}
                        {local.altLabel && <span class="label-text-alt">{local.altLabel}</span>}
                    </label>
                    <div class="flex">
                        <input
                            {...rest}
                            id={store.id}
                            onInput={onInput}
                            onBlur={onBlur}
                            value={store.value}
                            class="input input-bordered w-full max-w-xs"
                            ref={inputRef}
                        />
                        <Show when={!rest.readonly}>
                            <button onClick={showCalendar} class="-m-9">
                                <IoCalendarOutline />
                            </button>
                        </Show>
                    </div>
                    <label class="label">
                        {store.error && <span class="label-text-alt text-error">{store.errorMessage}</span>}
                    </label>
                </div>
            </div>
            <Show when={open()}>
                <div class="modal modal-open modal-middle">
                    <DatePicker aDate={toDate(store.value)} handleSelect={doSelect} />
                </div>
            </Show>
        </>
    )
}
