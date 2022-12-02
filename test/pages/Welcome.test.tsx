import { Router } from '@solidjs/router'
import { render, waitFor } from 'solid-testing-library'
import Welcome from '../../src/pages/Welcome'
import { UserProvider } from '../../src/contexts/UserContext'
import '@testing-library/jest-dom'

window.scrollTo = jest.fn()

jest.mock('../../src/api/SupabaseClient', () => ({
    __esModule: true,
    supabase: {
        select: jest.fn(),
        auth: {
            onAuthStateChange: jest.fn(),
        },
    },
}))

describe('<Welcome />', () => {
    test('renders the welcome page loading', async () => {
        const { getByText, unmount } = await render(() => (
            <Router>
                <UserProvider initialState={{ authSession: {}, googleUser: {}, member: {} }}>
                    <Welcome />
                </UserProvider>
            </Router>
        ))
        // 'Page Loading' is the first text that would show up
        expect(getByText(/Page Loading/i)).toBeInTheDocument()
        unmount()
    })

    test('renders the welcome page not logged in', async () => {
        const { getByText, unmount } = await render(() => (
            <Router>
                <UserProvider initialState={{ authSession: {}, googleUser: {}, member: {} }}>
                    <Welcome />
                </UserProvider>
            </Router>
        ))
        // if we wait, we will get the 'Sorry Friend' when the timer is done
        waitFor(() => expect(getByText(/Sorry Friend/i)).toBeInTheDocument())
        unmount()
    })

    test('renders the welcome page new team mate', async () => {
        // they have a member id, but no auth id in the member record
        const { getByText, unmount } = await render(() => (
            <Router>
                <UserProvider
                    initialState={{ authSession: { accessToken: 'xyz' }, googleUser: {}, member: { member_id: 123 } }}
                >
                    <Welcome />
                </UserProvider>
            </Router>
        ))
        // if we wait, we will get the 'new team mate' when the timer is done
        waitFor(() => expect(getByText(/Welcome new team mate/i)).toBeInTheDocument())
        unmount()
    })

    test('renders the welcome page for logged in to google', async () => {
        // they have a member id, and an auth id in the member record
        const { getByText, unmount } = await render(() => (
            <Router>
                <UserProvider initialState={{ authSession: { accessToken: 'xyz' }, googleUser: {}, member: {} }}>
                    <Welcome />
                </UserProvider>
            </Router>
        ))
        // if we wait, we will get the 'new team mate' when the timer is done
        waitFor(() => expect(getByText(/Hello Friend/i)).toBeInTheDocument())
        unmount()
    })

    test('renders the welcome page for member', async () => {
        // they have a member id, and an auth id in the member record
        const { getByText, unmount } = await render(() => (
            <Router>
                <UserProvider
                    initialState={{
                        authSession: { accessToken: 'xyz' },
                        googleUser: {},
                        member: { member_id: 123, auth_id: 'abc', first_name: 'Jon', last_name: 'Snow' },
                    }}
                >
                    <Welcome />
                </UserProvider>
            </Router>
        ))
        // if we wait, we will get the 'new team mate' when the timer is done
        waitFor(() => expect(getByText(/Welcome Jon Snow/i)).toBeInTheDocument())
        unmount()
    })
})
