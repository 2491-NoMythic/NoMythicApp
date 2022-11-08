import { getDate } from 'date-fns'
import { Component, createEffect, createSignal } from 'solid-js'
import { Day } from '../types'

type inputs = { day: Day; handleSelect: (aDate: Date) => void }

const MiniDayOfMonth: Component<inputs> = (props) => {
    const [color, setColor] = createSignal('bg-base-100')

    createEffect(() => {
        if (props?.day?.isSelected) {
            setColor('bg-primary')
        } else if (!props?.day?.inMonth) {
            setColor('bg-base-300')
        }
    })

    type Data = { date: Date }
    const handleClick = (data: Data, event) => {
        event.preventDefault()
        props.handleSelect(data.date)
    }

    return (
        <div
            class={`aspect-square border-t border-r cursor-pointer hover:text-accent-content ${color()}`}
            onClick={[handleClick, { date: props?.day?.date }]}
        >
            <div class={`text-center text-sm  ${props?.day?.isToday ? 'bg-secondary' : ''}`}>
                {getDate(props?.day?.date)}
            </div>
        </div>
    )
}

export default MiniDayOfMonth
