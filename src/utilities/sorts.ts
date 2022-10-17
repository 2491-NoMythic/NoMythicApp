const sortByFirstName = (teamMembers) => {
    const sorted = teamMembers.sort((memberA, memberB) => {
        const firstNameA = memberA.firstName.toLowerCase()
        const firstNameB = memberB.firstName.toLowerCase()

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
