import { createSignal, Signal } from 'solid-js'

// Commented code will store json instead of just strings
function createStoredSignal<T>(key: string, defaultValue: T, storage = localStorage): Signal<T> {
    //const initialValue = storage.getItem(key) ? (JSON.parse(storage.getItem(key)) as T) : defaultValue
    const initialValue = storage.getItem(key) ? (storage.getItem(key) as T) : defaultValue

    const [value, setValue] = createSignal<T>(initialValue)

    const setValueAndStore = ((arg) => {
        const v = setValue(arg)
        //storage.setItem(key, JSON.stringify(v))
        storage.setItem(key, v)
        return v
    }) as typeof setValue

    return [value, setValueAndStore]
}

export { createStoredSignal }
