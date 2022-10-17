import {
    createContext,
    createSignal,
    Accessor,
    useContext,
    Setter,
} from 'solid-js'

type CounterStore = [
    Accessor<number>,
    Accessor<string>,
    Accessor<string>,
    Setter<number>,
    Setter<string>,
    Setter<string>
]

const CounterContext = createContext<CounterStore>()

export function CounterProvider(props) {
    const [count, setCount] = createSignal(1)
    const [name, setName] = createSignal('Chris')
    const [other, setOther] = createSignal('Other')

    const store: CounterStore = [
        count,
        name,
        other,
        setCount,
        setName,
        setOther,
    ]
    return (
        <CounterContext.Provider value={store}>
            {props.children}
        </CounterContext.Provider>
    )
}

export function useCounter() {
    return useContext(CounterContext)!
}

// import { createContext, createSignal, useContext } from 'solid-js'

// const CounterContext = createContext()

// export function CounterProvider(props) {
//     const [count, setCount] = createSignal(1)

//     const store = [
//         count,
//         {
//             increment() {
//                 setCount((c) => c + 1)
//             },
//             decrement() {
//                 setCount((c) => c - 1)
//             },
//         },
//     ]
//     return (
//         <CounterContext.Provider value={store}>
//             {props.children}
//         </CounterContext.Provider>
//     )
// }

// export function useCounter() {
//     return useContext(CounterContext)
// }
