import { Component } from 'solid-js'
import { calculateDay, calculatePercent, formatUrl } from '../utilities/formatters'
import { RouteKeys } from './AppRouting'
import TwoSideStatsBase from './TwoSideStatsBase'

const AttendanceStats: Component<{
    eventId: number
    meetingDate: string
    meetingCount: number
    meetingType: string
    teamSize: number
}> = (props) => {
    console.log('teamSize', props.teamSize);
    return (
        <TwoSideStatsBase
            leftText={calculateDay(props.meetingDate)}
            leftValue={props.meetingDate}
            leftSubText={props.meetingType}
            rightText="Attended"
            rightValue={props.meetingCount?.toString()}
            rightSubText={calculatePercent(props.meetingCount, props.teamSize) + '% of ' + props.teamSize}
            link={formatUrl(RouteKeys.ATTENDANCE_MEETING.nav, { id: props.eventId })}
        />
    )
}

export default AttendanceStats
