import { Fragment } from 'react';

import { withErrorHandler } from '@/error-handling';
import AppErrorBoundaryFallback from '@/error-handling/fallbacks/App';

import BottomNav from './components/bottom-nav';
import { ThemeProvider } from './components/theme-provider';
import Pages from './routes/Pages';
import ProtectedRoute from './routes/ProtectedRoute';
import Header from './sections/Header';
import HotKeys from './sections/HotKeys';
import Sidebar from './sections/Sidebar';

function App() {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <Fragment>
                <ProtectedRoute>
                    <HotKeys />
                    <Header />
                    <Sidebar />
                    <Pages />

                    <BottomNav />
                </ProtectedRoute>
            </Fragment>
        </ThemeProvider>
    );
}

const AppWithErrorHandler = withErrorHandler(App, AppErrorBoundaryFallback);
export default AppWithErrorHandler;
