import { Component, createSignal, For } from 'solid-js'
import { SessionValueKeys, useSessionContext } from '../contexts/SessionContext'

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

    const [sessionValues, { updateSessionValue }] = useSessionContext()

    const changeHandler = (event) => {
        updateSessionValue(SessionValueKeys.SUBTEAM, event.target.selectedOptions[0].value)
    }

    return (
        <div class="form-control">
            <label class="label">
                <span class="label-text">Select sub-team</span>
            </label>
            <select class="select select-bordered" onChange={changeHandler}>
                <option disabled selected={sessionValues.subTeam === null}>
                    Select one
                </option>
                <For each={subTeams()}>
                    {(subTeam) => {
                        return (
                            <option value={subTeam.value} selected={subTeam.value === sessionValues.subTeam}>
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
