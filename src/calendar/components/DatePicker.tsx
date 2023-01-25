import { Component, createEffect, createSignal, For, Show } from 'solid-js'
import { add, format, sub } from 'date-fns'
import { Month, MonthValues } from '../types'
import { getCalendar, getMonthValues } from '../utilities'
import MiniDayOfMonth from './MiniDayOfMonth'

type inputs = { aDate: Date; handleSelect: (aDate: Date) => void }
const DatePicker: Component<inputs> = (props) => {
    const [month, setMonth] = createSignal<MonthValues>()
    const [calendar, setCalendar] = createSignal<Month>()
    const [monthDate, setMonthDate] = createSignal<Date>(props.aDate)

    createEffect(() => {
        const monthValues = getMonthValues(monthDate())
        setMonth(monthValues)
        const aCalendar = getCalendar(monthValues)
        setCalendar(aCalendar)
    })

    const prevMonth = () => {
        const newMonth = sub(month().beginOfMonthDate, { months: 1 })
        setMonthDate(newMonth)
    }

    const nextMonth = () => {
        const newMonth = add(month().beginOfMonthDate, { months: 1 })
        setMonthDate(newMonth)
    }

    type Data = { date: Date }
    const handleClose = (data: Data, event: Event) => {
        event.preventDefault()
        props.handleSelect(data.date)
    }

    return (
        <>
            <Show when={calendar() && month()}>
                <div class="w-72 lg:w-1/4 border-2 rounded-xl p-2 bg-base-300 relative">
                    <div
                        class="btn btn-md btn-circle bg-secondary text-accent-content absolute -right-6 -top-6"
                        onClick={[handleClose, { date: monthDate() }]}
                    >
                        ✕
                    </div>
                    <div class="flex">
                        <div onClick={prevMonth} class="cursor-pointer ml-5 hover:text-accent-content">
                            {format(sub(month().beginOfMonthDate, { months: 1 }), 'LLL')}
                        </div>
                        <div class="grow text-center font-bold text-accent-content">
                            {format(month().beginOfMonthDate, 'LLLL')}
                        </div>
                        <div onClick={nextMonth} class="cursor-pointer mr-5 hover:text-accent-content">
                            {format(add(month().beginOfMonthDate, { months: 1 }), 'LLL')}
                        </div>
                    </div>
                    <div class="grid grid-cols-7">
                        <For each={calendar()[0]}>
                            {(day) => <div class="text-center">{format(day.date, 'EEEEEE')}</div>}
                        </For>
                    </div>
                    <div class="grid grid-cols-7 border-l border-b">
                        <For each={calendar()}>
                            {(week) => {
                                return (
                                    <>
                                        <MiniDayOfMonth day={week[0]} handleSelect={props.handleSelect} />
                                        <MiniDayOfMonth day={week[1]} handleSelect={props.handleSelect} />
                                        <MiniDayOfMonth day={week[2]} handleSelect={props.handleSelect} />
                                        <MiniDayOfMonth day={week[3]} handleSelect={props.handleSelect} />
                                        <MiniDayOfMonth day={week[4]} handleSelect={props.handleSelect} />
                                        <MiniDayOfMonth day={week[5]} handleSelect={props.handleSelect} />
                                        <MiniDayOfMonth day={week[6]} handleSelect={props.handleSelect} />
                                    </>
                                )
                            }}
                        </For>
                    </div>
                    <div class="flex mt-2">
                        <div class="bg-secondary text-accent-content mr-4 rounded-full pl-4 pr-4">Today</div>
                        <div class="bg-primary text-accent-content rounded-full pl-4 pr-4">Selected</div>
                    </div>
                </div>
            </Show>
        </>
    )
}

export default DatePicker
