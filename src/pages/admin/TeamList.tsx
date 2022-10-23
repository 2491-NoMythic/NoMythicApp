import { Component, createEffect, createResource, createSignal, For, Show } from 'solid-js'
import YearPicker from '../../components/YearPicker'
import { filterBySubTeam } from '../../utilities/filters'
import { sortByFirstName } from '../../utilities/sorts'
import SelectTeamInfoMessage from '../../components/SelectTeamInfoMessage'
import MasterTeamTable from '../../components/MasterTeamTable'
import { Member } from '../../types/Api'
import { getMembers } from '../../api/members'
import { A, useSearchParams } from '@solidjs/router'
import SubTeamSelectorUrl from '../../components/SubTeamSelectorUrl'

const TeamList: Component = () => {
    const [filteredTeam, setFilteredTeam] = createSignal<Member[]>([])
    const [year, setYear] = createSignal('2023')
    const [team] = createResource(year, getMembers)
    const [searchParams] = useSearchParams()

    // runs whenever team or subTeam are changed
    createEffect(() => {
        const filtered = filterBySubTeam(team(), searchParams.subteam)
        const sorted = sortByFirstName(filtered)
        setFilteredTeam(sorted)
    })

    return (
        <div class="overflow-x-auto">
            <div class="flex">
                <div class="grow mr-2">
                    <SubTeamSelectorUrl />
                </div>
                <YearPicker year={year} setYear={setYear} />
            </div>
            <div class="flex flex row justify-end mt-4">
                <A class="btn btn-primary" href="/admin/memberEdit">
                    Add Member
                </A>
            </div>
            <SelectTeamInfoMessage show={filteredTeam().length === 0} extraMessage="Defaults to current season." />
            <MasterTeamTable teamMembers={filteredTeam} />
        </div>
    )
}

export default TeamList
