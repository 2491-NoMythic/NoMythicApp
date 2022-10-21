import { TeamRole } from '../types/Api'

const filterBySubTeam = (teamMembers, subTeamFilter) => {
    let filtered = []
    if (teamMembers !== undefined) {
        if (subTeamFilter === 'team') {
            filtered = teamMembers
        } else if (subTeamFilter === 'mentors') {
            filtered = teamMembers.filter((teamMember) => {
                return teamMember.team_role === TeamRole.MENTOR
            })
        } else if (subTeamFilter === 'captains') {
            filtered = teamMembers.filter((teamMember) => {
                return teamMember.team_role === TeamRole.CAPTAIN
            })
        } else {
            filtered = teamMembers.filter((teamMember) => {
                return teamMember.sub_team === subTeamFilter
            })
        }
    }
    return filtered
}

export { filterBySubTeam }
