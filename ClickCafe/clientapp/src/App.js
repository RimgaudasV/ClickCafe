import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import LoginPage from './components/auth/login';
import RegisterPage from './components/auth/register';
import MainPage from './components/main';
import NewOrder from './components/newOrder';
import CafeItems from './components/cafeItems'
import Status from './components/status';
import Rewards from './components/rewards';
import History from './components/history';
import Account from './components/account';
import Settings from './components/settings';
import Navbar from './components/navbar';
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
                <Route path="/newOrder/:cafeId" element={
                    <PrivateRoute user={user}>
                        <CafeItems />
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
