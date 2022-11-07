import { getDate } from 'date-fns'
import { Component } from 'solid-js'
import { Day } from '../types'

type inputs = { day: Day; handleSelect: (aDate: Date) => void }

const MiniDayOfMonth: Component<inputs> = (props) => {
    type Data = { date: Date }
    const handleClick = (data: Data, _event) => {
        props.handleSelect(data.date)
    }

    return (
        <div
            class={`aspect-square border-t border-r ${props?.day?.inMonth ? 'bg-base-100' : 'bg-base-300'}`}
            onClick={[handleClick, { date: props?.day }]}
        >
            <div
                class={`text-center text-sm cursor-pointer hover:text-accent-content ${
                    props?.day?.isToday ? 'bg-secondary' : ''
                }`}
            >
                {getDate(props?.day?.date)}
            </div>
        </div>
    )
}

export default MiniDayOfMonth
