import { Accessor, Component, Setter } from 'solid-js'

// relys on html5 date input field for popup
const DatePicker: Component<{
    selectedDate: Accessor<string>
    setSelectedDate: Setter<string>
    readonly?: boolean
}> = (props) => {
    const changeHandler = (event) => {
        props.setSelectedDate(event.target.value)
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
                        value={props.selectedDate()}
                        class="input input-bordered w-40"
                        onChange={changeHandler}
                        readonly={props.readonly}
                    />
                </div>
            </div>
        </>
    )
}

export default DatePicker
