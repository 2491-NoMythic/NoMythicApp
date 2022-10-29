import { Component } from 'solid-js'
import { calculateDay, calculatePercent } from '../utilities/formatters'
import TwoSideStatsBase from './TwoSideStatsBase'

const AttendanceStats: Component<{
    meetingDate: string
    meetingCount: number
    meetingType: string
    teamSize: number
}> = (props) => {
    return (
        <TwoSideStatsBase
            leftText={calculateDay(props.meetingDate)}
            leftValue={props.meetingDate}
            leftSubText={props.meetingType}
            rightText="Attended"
            rightValue={props.meetingCount?.toString()}
            rightSubText={calculatePercent(props.meetingCount, props.teamSize) + '%'}
            link={'/admin/attendance/meeting?subTeam=team&meetingDate=' + props.meetingDate}
        />
    )
}

export default AttendanceStats
