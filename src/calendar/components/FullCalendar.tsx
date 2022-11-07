import { Component, createEffect, createSignal, For, onMount, Show } from 'solid-js'
import { add, format, parse, sub } from 'date-fns'
import DayOfMonth from './DayOfMonth'
import { Month, MonthValues, Week } from '../types'
import { getCalendar, getMonthValues, getToday, toDate, toYMD } from '../utilities'
import { useSearchParams } from '@solidjs/router'

const FullCalendar: Component = () => {
    const [month, setMonth] = createSignal<MonthValues>()
    const [calendar, setCalendar] = createSignal<Month>()
    const [searchParams, setSearchParams] = useSearchParams()

    onMount(() => {
        if (searchParams.date === undefined) {
            const today = toYMD(getToday())
            setSearchParams({ date: today })
        }
    })

    createEffect(() => {
        if (searchParams.date !== undefined) {
            const aDate = toDate(searchParams.date)
            const monthValues = getMonthValues(aDate)
            setMonth(monthValues)
            console.log(monthValues)
            const aCalendar = getCalendar(monthValues)
            setCalendar(aCalendar)
        }
    })

    const prevMonth = () => {
        const newMonth = sub(month().beginOfMonthDate, { months: 1 })
        const formatted = toYMD(newMonth)
        setSearchParams({ date: formatted })
    }

    const nextMonth = () => {
        const newMonth = add(month().beginOfMonthDate, { months: 1 })
        const formatted = toYMD(newMonth)
        setSearchParams({ date: formatted })
    }

    return (
        <>
            <Show when={calendar() && month()}>
                <div class="mt-8">
                    <div class="flex mb-4">
                        <div onClick={prevMonth} class="cursor-pointer">
                            {format(sub(month().beginOfMonthDate, { months: 1 }), 'LLLL')}
                        </div>
                        <div class="grow text-center text-2xl">{format(month().beginOfMonthDate, 'LLLL')}</div>
                        <div onClick={nextMonth} class="cursor-pointer">
                            {format(add(month().beginOfMonthDate, { months: 1 }), 'LLLL')}
                        </div>
                    </div>
                    <div class="grid grid-cols-7">
                        <For each={calendar()[0]}>
                            {(day) => <div class="text-center">{format(day.date, 'EEE')}</div>}
                        </For>
                    </div>
                    <div class="grid grid-cols-7 border-l border-b">
                        <For each={calendar()}>
                            {(week) => {
                                return (
                                    <>
                                        <DayOfMonth day={week[0]} />
                                        <DayOfMonth day={week[1]} />
                                        <DayOfMonth day={week[2]} />
                                        <DayOfMonth day={week[3]} />
                                        <DayOfMonth day={week[4]} />
                                        <DayOfMonth day={week[5]} />
                                        <DayOfMonth day={week[6]} />
                                    </>
                                )
                            }}
                        </For>
                    </div>
                </div>
            </Show>
        </>
    )
}

export default FullCalendar
