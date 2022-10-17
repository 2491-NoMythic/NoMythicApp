/* @refresh reload */
import './index.css'
import { render } from 'solid-js/web'

import App from './App'
import { Router } from '@solidjs/router'
import { UserProvider } from './contexts/UserContext'
import { CounterProvider } from './contexts/CountContext'

render(
    () => (
        <Router>
            <CounterProvider>
                <UserProvider>
                    <App />
                </UserProvider>
            </CounterProvider>
        </Router>
    ),
    document.getElementById('root') as HTMLElement
)
