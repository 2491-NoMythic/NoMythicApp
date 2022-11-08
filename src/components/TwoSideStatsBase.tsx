import { A, useNavigate } from '@solidjs/router'
import { Component } from 'solid-js'
import { calculateDay, calculatePercent } from '../utilities/formatters'
import HiSolidUserGroup from './icons/HiSolidUserGroup'
import IoCalendarOutline from './icons/IoCalendarOutline'

const TwoSideStatsBase: Component<{
    leftText: string
    leftValue: string
    leftSubText: string
    rightText: string
    rightValue: string
    rightSubText: string
    link: string
}> = (props) => {
    const navigate = useNavigate()

    const handleClick = () => {
        if (props.link) {
            navigate(props.link)
        }
    }

    return (
        <div class={`stats shadow md:mr-4 mt-4 ${props.link ? 'cursor-pointer' : ''}`} onClick={handleClick}>
            <div class="stat">
                <div class="stat-figure text-secondary">
                    <IoCalendarOutline />
                </div>

                <div class="stat-title">{props.leftText}</div>
                <div class="stat-value text-2xl">{props.leftValue}</div>
                <div class="stat-desc">{props.leftSubText}</div>
            </div>

            <div class="stat">
                <div class="stat-figure text-secondary">
                    <HiSolidUserGroup />
                </div>
                {props.rightText ? <div class="stat-title">{props.rightText}</div> : <div>&nbsp;</div>}
                {props.rightValue ? <div class="stat-value text-2xl">{props.rightValue}</div> : <div></div>}
                {props.rightSubText ? <div class="stat-desc">{props.rightSubText}</div> : <div>&nbsp;</div>}
            </div>
        </div>
    )
}

export default TwoSideStatsBase
