import { A, useNavigate } from '@solidjs/router'
import { Component } from 'solid-js'
import { calculateDay, calculatePercent } from '../utilities/formatters'

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
                    <svg
                        fill="currentColor"
                        stroke-width="0"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        height="1.5em"
                        width="1.5em"
                        style="overflow: visible;"
                    >
                        <rect
                            width="416"
                            height="384"
                            x="48"
                            y="80"
                            fill="none"
                            stroke="currentColor"
                            stroke-linejoin="round"
                            stroke-width="32"
                            rx="48"
                        ></rect>
                        <circle cx="296" cy="232" r="24"></circle>
                        <circle cx="376" cy="232" r="24"></circle>
                        <circle cx="296" cy="312" r="24"></circle>
                        <circle cx="376" cy="312" r="24"></circle>
                        <circle cx="136" cy="312" r="24"></circle>
                        <circle cx="216" cy="312" r="24"></circle>
                        <circle cx="136" cy="392" r="24"></circle>
                        <circle cx="216" cy="392" r="24"></circle>
                        <circle cx="296" cy="392" r="24"></circle>
                        <path
                            fill="none"
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="32"
                            d="M128 48v32M384 48v32"
                        ></path>
                        <path
                            fill="none"
                            stroke="currentColor"
                            stroke-linejoin="round"
                            stroke-width="32"
                            d="M464 160H48"
                        ></path>
                    </svg>
                </div>

                <div class="stat-title">{props.leftText}</div>
                <div class="stat-value text-2xl">{props.leftValue}</div>
                <div class="stat-desc">{props.leftSubText}</div>
            </div>

            <div class="stat">
                <div class="stat-figure text-secondary">
                    <svg
                        fill="none"
                        stroke-width="0"
                        xmlns="http://www.w3.org/2000/svg"
                        stroke="currentColor"
                        viewBox="0 0 20 20"
                        height="1.5em"
                        width="1.5em"
                        style="overflow: visible;"
                    >
                        <path
                            fill="currentColor"
                            d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"
                        ></path>
                    </svg>
                </div>
                {props.rightText ? <div class="stat-title">{props.rightText}</div> : <div>&nbsp;</div>}
                {props.rightValue ? <div class="stat-value text-2xl">{props.rightValue}</div> : <div></div>}
                {props.rightSubText ? <div class="stat-desc">{props.rightSubText}</div> : <div>&nbsp;</div>}
            </div>
        </div>
    )
}

export default TwoSideStatsBase
