enum SubTeamSelection {
    PROGRAMMING = 'Programming',
    BUILD = 'Build',
    OPERATIONS = 'Operations',
    MENTORS = 'Mentors',
    CAPTAINS = 'Captains',
    TEAM = 'Whole Team',
}

const eventColors = {
    meeting: 'text-info',
    regular_practice: 'text-accent',
    extra_practice: 'text-warning',
    competition: 'text-success',
    event: 'text-error',
}

export { SubTeamSelection, eventColors }
