import { Component } from 'solid-js'
import { calculateDay, calculatePercent, formatUrl } from '../utilities/formatters'
import { RouteKeys } from './AppRouting'
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
            link={formatUrl(RouteKeys.ATTENDANCE_MEETING.nav, null, { meetingDate: props.meetingDate })}
        />
    )
}

export default AttendanceStats
