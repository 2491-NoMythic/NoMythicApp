import { Component } from 'solid-js'

const StaticAttendanceTable: Component = () => {
    return (
        <table class="table table-compact w-full mt-4">
            <tbody>
                <tr>
                    <td>
                        Cy Ganderton
                        <br />
                        Captain
                    </td>
                    <td class="text-right">
                        <div class="btn-group">
                            <input
                                type="radio"
                                name="options1"
                                data-title="Ft"
                                class="btn"
                            >
                                Y
                            </input>
                            <input
                                type="radio"
                                name="options1"
                                data-title="Pt"
                                class="btn"
                            />
                            <input
                                type="radio"
                                name="options1"
                                data-title="Ab"
                                class="btn"
                                checked
                            />
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>Hart Hagerty</td>
                    <td class="text-right">
                        <div class="btn-group">
                            <input
                                type="radio"
                                name="options2"
                                data-title="Ft"
                                class="btn"
                            />
                            <input
                                type="radio"
                                name="options2"
                                data-title="Pt"
                                class="btn"
                            />
                            <input
                                type="radio"
                                name="options2"
                                data-title="Ab"
                                class="btn"
                                checked
                            />
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>Brice Swyre</td>
                    <td class="text-right">
                        <div class="btn-group">
                            <input
                                type="radio"
                                name="options"
                                data-title="Ft"
                                class="btn"
                            />
                            <input
                                type="radio"
                                name="options"
                                data-title="Pt"
                                class="btn"
                            />
                            <input
                                type="radio"
                                name="options"
                                data-title="Ab"
                                class="btn"
                                checked
                            />
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    )
}

export default StaticAttendanceTable
