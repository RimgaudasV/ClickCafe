import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

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
import AdminPanel from './components/admin/adminPanel';
import About from './components/about';
import EditMenu from './components/admin/editMenu';
import EditMenuItem from './components/admin/editMenuItem';

function AppRoutes({ user, setUser }) {
    const location = useLocation();
    const hideOrderMenu = [
        /^\/checkout$/,
        /^\/payment\/[^/]+$/,
        /^\/payment-result$/,
        /^\/order\/[^/]+\/confirmation$/ 
    ].some(regex => regex.test(location.pathname));

    return (
        <>
            {user && <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 999,
                    backgroundColor: 'white',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}
            >
                <Navbar user={user} setUser={setUser} />
            </div>}
            {!hideOrderMenu && <OrderMenu />}

            <div style={{ paddingTop: "100px" }}>
                <Routes>
                    <Route path="/login" element={<LoginPage setUser={setUser} user={user} />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/" element={
                        user?.role === "Admin"
                            ? <Navigate to="/admin" />
                            : user?.role === "Barista"
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
                    <Route path="/cafes" element={
                        <PrivateRoute user={user}>
                            <Cafes />
                        </PrivateRoute>
                    } />
                    <Route path="/menu/:cafeId" element={
                        <PrivateRoute user={user}>
                            <Menu />
                        </PrivateRoute>
                    } />
                    <Route path="/menuItem/:itemId" element={
                        <PrivateRoute user={user}>
                            <MenuItem />
                        </PrivateRoute>
                    } />
                    <Route path="/checkout" element={
                        <PrivateRoute user={user}>
                            <Checkout />
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
                    <Route path="/about" element={
                        <PrivateRoute user={user}>
                            <About />
                        </PrivateRoute>
                    } />
                    <Route path="/order/:orderId" element={
                        <PrivateRoute user={user}>
                            <OrderDetails />
                        </PrivateRoute>
                    } />
                    <Route path="/payment/:orderId" element={<PaymentPage />} />
                    <Route path="/payment-result" element={<PaymentResultPage />} />
                    <Route path="/order/:orderId/confirmation" element={
                        <PrivateRoute user={user}>
                            <OrderConfirmationPage />
                        </PrivateRoute>
                    } />
                    <Route path="/admin" element={
                        <AdminRoute user={user}>
                            <AdminPanel />
                        </AdminRoute>
                    } />
                    <Route path="/admin/menu/:cafeId" element={
                        <AdminRoute user={user}>
                            <EditMenu />
                        </AdminRoute>
                    } />
                    <Route path="/admin/menuItem/:itemId" element={
                        <AdminRoute user={user}>
                            <EditMenuItem />
                        </AdminRoute>
                    } />
                </Routes>
            </div>
        </>
    );
}

export default AppRoutes;
