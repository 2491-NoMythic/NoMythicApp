import { Component, createEffect, createResource, createSignal, Show, Suspense } from 'solid-js'
import YearPicker from '../../components/YearPicker'
import { filterBySubTeam } from '../../utilities/filters'
import { sortByFirstName } from '../../utilities/sorts'
import SelectTeamInfoMessage from '../../components/SelectTeamInfoMessage'
import TeamTable from '../../components/TeamTable'
import { Member } from '../../types/Api'
import { getMembers } from '../../api/members'
import { A } from '@solidjs/router'
import PageLoading from '../../components/PageLoading'
import SubTeamSelector from '../../components/SubTeamSelector'
import { useSessionContext } from '../../contexts/SessionContext'

const TeamList: Component = () => {
    const [filteredTeam, setFilteredTeam] = createSignal<Member[]>([])
    const [year, setYear] = createSignal('2023')
    const [team] = createResource(year, getMembers)
    const [sessionValues] = useSessionContext()

    // runs whenever team or subTeam are changed
    createEffect(() => {
        const filtered = filterBySubTeam(team(), sessionValues.subTeam)
        const sorted = sortByFirstName(filtered)
        setFilteredTeam(sorted)
    })

    return (
        <Suspense fallback={<PageLoading />}>
            <div class="overflow-x-auto">
                <div class="flex">
                    <div class="grow mr-2">
                        <SubTeamSelector />
                    </div>
                    <YearPicker year={year} setYear={setYear} />
                </div>
                <div class="flex mt-4 items-end inlign-flex">
                    <Show when={filteredTeam().length !== 0}>
                        <div class="flex-none ml-4">Click a row to view</div>
                    </Show>
                    <div class="flex flex-auto justify-end">
                        <A class="btn btn-primary" href="/admin/member/0/edit">
                            Add Member
                        </A>
                    </div>
                </div>
                <SelectTeamInfoMessage show={filteredTeam().length === 0} extraMessage="Defaults to current season." />
                <TeamTable teamMembers={filteredTeam} />
            </div>
        </Suspense>
    )
}

export default TeamList
