import { Accessor, Component, createSignal, For, Setter } from 'solid-js'

const validYears = ['2023']

const YearPicker: Component<{
    year: Accessor<string>
    setYear: Setter<string>
    labelLocation?: string
}> = (props) => {
    const [years, setYears] = createSignal([])

    setYears(validYears)

    const changeHandler = (event) => {
        props.setYear(event.target.selectedOptions[0].value)
    }

    return (
        <div class={`form-control ${props.labelLocation === 'SIDE' ? 'flex-row' : ''}`}>
            <label class="label">
                <span class="label-text">
                    Select {props.labelLocation === 'SIDE' && <br />}
                    Season
                </span>
            </label>
            <select class="select select-bordered" onChange={changeHandler}>
                <option disabled selected={props.year() === ''}>
                    Pick one
                </option>
                <For each={years()}>
                    {(validYear) => {
                        return <option selected={validYear === props.year()}>{validYear}</option>
                    }}
                </For>
            </select>
        </div>
    )
}

export default YearPicker
