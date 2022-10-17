import { Accessor, Component, createSignal, For, Setter } from 'solid-js'

const subTeamList = [
    { value: 'team', display: 'Whole Team' },
    { value: 'build', display: 'Build' },
    { value: 'programming', display: 'Programming' },
    { value: 'operations', display: 'Operations' },
    { value: 'mentors', display: 'Mentors' },
    { value: 'captains', display: 'Captains' },
]

const SubTeamSelector: Component<{
    subTeam: Accessor<string>
    setSubTeam: Setter<string>
}> = (props) => {
    const [subTeams, setSubTeams] = createSignal([])

    setSubTeams(subTeamList)

    const changeHandler = (event) => {
        props.setSubTeam(event.target.selectedOptions[0].value)
    }

    return (
        <div class="form-control">
            <label class="label">
                <span class="label-text">Select sub-team</span>
            </label>
            <select class="select select-bordered" onChange={changeHandler}>
                <option disabled selected={props.subTeam() === ''}>
                    Pick one
                </option>
                <For each={subTeams()}>
                    {(subTeam) => {
                        return (
                            <option
                                value={subTeam.value}
                                selected={subTeam.value === props.subTeam}
                            >
                                {subTeam.display}
                            </option>
                        )
                    }}
                </For>
            </select>
        </div>
    )
}

export default SubTeamSelector
