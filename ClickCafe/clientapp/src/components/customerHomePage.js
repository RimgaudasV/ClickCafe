import { Link } from 'react-router-dom';

const CustomerHomePage = () => {
    return (
        <div style={{ padding: "2rem" }}>
            <h2>Welcome to ClickCafe!</h2>
            <p>Start a new order or check your rewards and history.</p>

            <ul>
                <li><Link to="/newOrder">☕ Start New Order</Link></li>
                <li><Link to="/history">📜 Order History</Link></li>
            </ul>
        </div>
    );
};

export default CustomerHomePage;
