import { render } from 'solid-testing-library'
import App from './App'

const mockResponse = {}

jest.mock('./api/SupabaseClient', () => ({
    __esModule: true,
    supabase: {
        select: jest.fn(),
    },
}))

describe('<App />', () => {
    test('renders the landing page', () => {
        const { getByText, unmount } = render(() => <App />)
        expect(getByText('NoMythic')).toBeInTheDocument()
        unmount()
    })
})
