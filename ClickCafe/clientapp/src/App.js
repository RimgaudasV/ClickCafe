import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
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
import OrderItems from './components/orderItems';
import Checkout from './components/checkout'
import OrderDetails from './components/orderDetails';
import BaristaRoute from './BaristaRoute';
import CustomerHomePage from './components/customerHomePage';
import BaristaHomePage from './components/baristaHomePage';


import { OrderProvider } from './context/OrderContext';
import { Navigate } from 'react-router-dom';




function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/auth/current", { credentials: "include" })
            .then(res => {
                if (!res.ok) throw new Error("Not authenticated");
                return res.json();
            })
            .then(data => {
                setUser(data);
            })
            .catch(() => {
                setUser(null);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <Router>
            {user && <Navbar user={user} setUser={setUser} />}
            <Routes>
                <Route path="/login" element={<LoginPage setUser={setUser} user={user} />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route path="/" element={
                    user?.role === "Barista"
                        ? <Navigate to="/barista" />
                        : <Navigate to="/home" />
                } />
                <Route path="/barista" element={
                    <BaristaRoute user={user}>
                        <BaristaHomePage user={user} />
                    </BaristaRoute>
                } />
                <Route path="/home" element={
                    <PrivateRoute user={user}>
                        <CustomerHomePage />
                    </PrivateRoute>
                } />
                <Route path="/newOrder" element={
                    <PrivateRoute user={user}>
                        <NewOrder />
                    </PrivateRoute>
                } />
                <Route path="/newOrder/:cafeId" element={
                    <PrivateRoute user={user}>
                        <OrderProvider>
                            <CafeItems />
                        </OrderProvider>
                    </PrivateRoute>
                } />
                <Route path="/orderItem/:itemId" element={
                    <PrivateRoute user={user}>
                        <OrderProvider>
                            <OrderItems />
                        </OrderProvider>
                    </PrivateRoute>
                } />
                <Route path="/checkout" element={
                    <PrivateRoute user={user}>
                        <OrderProvider>
                            <Checkout />
                        </OrderProvider>
                    </PrivateRoute>
                } />
                <Route path="/status" element={
                    <BaristaRoute user={user}>
                        <Status />
                    </BaristaRoute>
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
                <Route path="/order/:orderId" element={
                    <PrivateRoute user={user}>
                        <OrderDetails />
                    </PrivateRoute>
                } />
            </Routes>
        </Router>
    );
}

export default App;
