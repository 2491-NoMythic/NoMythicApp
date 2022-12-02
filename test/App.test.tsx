import { Router } from '@solidjs/router'
import { render } from 'solid-testing-library'
import App from '../src/App'
import { UserProvider } from '../src/contexts/UserContext'
import '@testing-library/jest-dom'

window.scrollTo = jest.fn()

jest.mock('../src/api/SupabaseClient', () => ({
    __esModule: true,
    supabase: {
        select: jest.fn(),
        auth: {
            onAuthStateChange: jest.fn(),
        },
    },
}))

describe('<App />', () => {
    test('renders the landing page', () => {
        const { getByText, unmount } = render(() => (
            <Router>
                <UserProvider initialState={{ authSession: {}, googleUser: {}, member: {} }}>
                    <App />
                </UserProvider>
            </Router>
        ))
        expect(getByText('NoMythic - Undefined')).toBeInTheDocument()
        expect(getByText('Guest')).toBeInTheDocument()
        unmount()
    })
})
