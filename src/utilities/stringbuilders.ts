const addSubTeamToUrl = (url: string, subTeam: string) => {
    if (!subTeam) {
        return url
    }
    return url + '?subteam=' + subTeam
}

export { addSubTeamToUrl }
