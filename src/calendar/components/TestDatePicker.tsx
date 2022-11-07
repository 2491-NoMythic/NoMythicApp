import { Component } from 'solid-js'
import { getToday } from '../utilities'
import DatePicker from './DatePicker'

const TestDatePicker: Component = () => {
    const doSelect = (aDate: Date) => {
        console.log(aDate)
    }
    return (
        <div>
            <h1>Test Date Picker</h1>
            <DatePicker aDate={getToday()} handleSelect={doSelect} />
        </div>
    )
}

export default TestDatePicker
