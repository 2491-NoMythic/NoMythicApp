const sortByFirstName = (teamMembers) => {
    if (teamMembers === undefined) {
        return []
    }
    const sorted = teamMembers.sort((memberA, memberB) => {
        const firstNameA = memberA.first_name.toLowerCase()
        const firstNameB = memberB.first_name.toLowerCase()

        if (firstNameA < firstNameB) {
            return -1
        }
        if (firstNameA > firstNameB) {
            return 1
        }
        return 0
    })
    return sorted
}

export { sortByFirstName }
