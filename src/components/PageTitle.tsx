import { useLocation } from '@solidjs/router'
import { Component } from 'solid-js'
import { RouteKeys } from '../components/AppRouting'
import Config from '../config'
/**
 * Displays the page title in the navigation bar
 * The specific page comes from the AppRouting definitions
 */
const PageTitle: Component = () => {
    const location = useLocation()

    const findTitle = (path: string) => {
        for (const [key, value] of Object.entries(RouteKeys)) {
            const match = value.regex.test(path)
            if (match) {
                return value.display
            }
        }
        return 'Undefined'
    }

    return (
        <div class="flex-1 text-xl text-white font-semibold">
            {Config.teamName} - {findTitle(location.pathname)}
        </div>
    )
}

export default PageTitle
