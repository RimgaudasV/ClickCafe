import { BrowserRouter as Router } from 'react-router-dom';
import { useState, useEffect } from 'react';

import LoginPage from './components/auth/login';
import RegisterPage from './components/auth/register';
import MainPage from './components/main';
import Cafes from './components/cafes';
import Menu from './components/menu';
import Status from './components/status';
import Rewards from './components/rewards';
import History from './components/history';
import Account from './components/account';
import Settings from './components/settings';
import Navbar from './components/navbar';
import PrivateRoute from './PrivateRoute';
import MenuItem from './components/menuItem';
import Checkout from './components/checkout';
import OrderDetails from './components/orderDetails';
import PaymentPage from './components/payment';
import PaymentResultPage from './components/paymentResult';
import OrderConfirmationPage from './components/orderConfirmation';
import BaristaRoute from './BaristaRoute';
import CustomerHomePage from './components/customerHomePage';
import BaristaHomePage from './components/baristaHomePage';
import OrderMenu from './components/orderMenu';
import AdminRoute from './AdminRoute';
import AdminPanel from './components/adminPanel';
import AppRoutes from './AppRoutes';

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/auth/current", { credentials: "include" })
            .then(res => {
                if (!res.ok) throw new Error("Not authenticated");
                return res.json();
            })
            .then(data => setUser(data))
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <Router>
            <AppRoutes user={user} setUser={setUser} />
        </Router>
    );
}

export default App;
