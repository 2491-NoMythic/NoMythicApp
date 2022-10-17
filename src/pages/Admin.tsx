import { Component, createEffect, createSignal, For, Show } from 'solid-js'
import YearPicker from '../components/YearPicker'
import SubTeamSelector from '../components/SubTeamSelector'
// static file instead of fetching from internet for now
import { teamMembers } from '../assets/teamFull'
import { filterBySubTeam } from '../utilities/filters'
import { sortByFirstName } from '../utilities/sorts'
import SelectTeamInfoMessage from '../components/SelectTeamInfoMessage'
import MasterTeamTable from '../components/MasterTeamTable'
import { TeamMember } from '../types/Api'

const Admin: Component = () => {
    // when not a static file, useResource
    const [team, setTeam] = createSignal<TeamMember[]>([])
    const [subTeam, setSubTeam] = createSignal('')
    const [filteredTeam, setFilteredTeam] = createSignal<TeamMember[]>([])
    const [year, setYear] = createSignal('2023')
    setTeam(teamMembers)

    // runs whenever team or subTeam are changed
    createEffect(() => {
        const filtered = filterBySubTeam(team(), subTeam())
        const sorted = sortByFirstName(filtered)
        setFilteredTeam(sorted)
    })

    return (
        <div class="overflow-x-auto">
            <div class="flex">
                <div class="grow mr-2">
                    <SubTeamSelector
                        subTeam={subTeam}
                        setSubTeam={setSubTeam}
                    />
                </div>
                <YearPicker year={year} setYear={setYear} />
            </div>
            <SelectTeamInfoMessage
                show={filteredTeam().length === 0}
                extraMessage="Defaults to current season."
            />
            <MasterTeamTable teamMembers={filteredTeam} />
        </div>
    )
}

export default Admin
