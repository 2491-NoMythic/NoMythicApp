import { useSearchParams } from '@solidjs/router'
import { Component, createSignal, For } from 'solid-js'

const subTeamList = [
    { value: 'team', display: 'Whole Team' },
    { value: 'build', display: 'Build' },
    { value: 'programming', display: 'Programming' },
    { value: 'operations', display: 'Operations' },
    { value: 'mentors', display: 'Mentors' },
    { value: 'captains', display: 'Captains' },
]

/*
 This version only sets / reads the search params for subteam
*/
const SubTeamSelectorUrl: Component = () => {
    const [subTeams, setSubTeams] = createSignal([])
    setSubTeams(subTeamList)

    const [searchParams, setSearchParams] = useSearchParams()

    const changeHandler = (event) => {
        setSearchParams({ subteam: event.target.selectedOptions[0].value })
    }

    return (
        <div class="form-control">
            <label class="label">
                <span class="label-text">Select sub-team</span>
            </label>
            <select class="select select-bordered" onChange={changeHandler}>
                <option disabled selected={searchParams.subteam === undefined}>
                    Select one
                </option>
                <For each={subTeams()}>
                    {(subTeam) => {
                        return (
                            <option value={subTeam.value} selected={subTeam.value === searchParams.subteam}>
                                {subTeam.display}
                            </option>
                        )
                    }}
                </For>
            </select>
        </div>
    )
}

export default SubTeamSelectorUrl
