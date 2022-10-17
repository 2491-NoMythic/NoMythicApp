const filterBySubTeam = (teamMembers, subTeamFilter) => {
    let filtered = []
    if (subTeamFilter === 'team') {
        filtered = teamMembers
    } else if (subTeamFilter === 'mentors') {
        filtered = teamMembers.filter((teamMember) => {
            return teamMember.teamRole === 'mentor'
        })
    } else if (subTeamFilter === 'captains') {
        filtered = teamMembers.filter((teamMember) => {
            return teamMember.teamRole === 'captain'
        })
    } else {
        filtered = teamMembers.filter((teamMember) => {
            return teamMember.subTeam === subTeamFilter
        })
    }
    return filtered
}

export { filterBySubTeam }
