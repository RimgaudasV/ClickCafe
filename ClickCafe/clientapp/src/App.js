import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import LoginPage from './components/auth/Login';
import RegisterPage from './components/auth/Register';
import MainPage from './components/Main';
import NewOrder from './components/NewOrder';
import Status from './components/Status';
import Rewards from './components/Rewards';
import History from './components/History';
import Account from './components/Account';
import Settings from './components/Settings';
import Navbar from './components/Navbar';
import PrivateRoute from './PrivateRoute';

function App() {
    const [user, setUser] = useState(null);
    const handleLogout = () => {
        setUser(null);
    };

    return (
        <Router>
            {user && <Navbar user={user} onLogout={handleLogout} />}
            <Routes>
                <Route path="/login" element={<LoginPage setUser={setUser} />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route path="/" element={
                    <PrivateRoute user={user}>
                        <MainPage user={user} />
                    </PrivateRoute>
                } />
                <Route path="/newOrder" element={
                    <PrivateRoute user={user}>
                        <NewOrder />
                    </PrivateRoute>
                } />
                <Route path="/status" element={
                    <PrivateRoute user={user}>
                        <Status />
                    </PrivateRoute>
                } />
                <Route path="/rewards" element={
                    <PrivateRoute user={user}>
                        <Rewards />
                    </PrivateRoute>
                } />
                <Route path="/history" element={
                    <PrivateRoute user={user}>
                        <History />
                    </PrivateRoute>
                } />
                <Route path="/account" element={
                    <PrivateRoute user={user}>
                        <Account />
                    </PrivateRoute>
                } />
                <Route path="/settings" element={
                    <PrivateRoute user={user}>
                        <Settings />
                    </PrivateRoute>
                } />
            </Routes>
        </Router>
    );
}

export default App;
