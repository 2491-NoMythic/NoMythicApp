import { Component, createEffect, createResource, createSignal, For, Show } from 'solid-js'
import YearPicker from '../../components/YearPicker'
import SubTeamSelector from '../../components/SubTeamSelector'
import { filterBySubTeam } from '../../utilities/filters'
import { sortByFirstName } from '../../utilities/sorts'
import SelectTeamInfoMessage from '../../components/SelectTeamInfoMessage'
import MasterTeamTable from '../../components/MasterTeamTable'
import { TeamMember } from '../../types/Api'
import { getMembers } from '../../api/members'

const MasterTeamList: Component = () => {
    const [subTeam, setSubTeam] = createSignal('')
    const [filteredTeam, setFilteredTeam] = createSignal<TeamMember[]>([])
    const [year, setYear] = createSignal('2023')
    const [team, { mutate, refetch }] = createResource(year, getMembers)

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
                    <SubTeamSelector subTeam={subTeam} setSubTeam={setSubTeam} />
                </div>
                <YearPicker year={year} setYear={setYear} />
            </div>
            <SelectTeamInfoMessage show={filteredTeam().length === 0} extraMessage="Defaults to current season." />
            <MasterTeamTable teamMembers={filteredTeam} />
        </div>
    )
}

export default MasterTeamList
