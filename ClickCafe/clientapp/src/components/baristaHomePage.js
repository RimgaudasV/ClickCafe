import { Link } from 'react-router-dom';

function BaristaHomePage({ user }) {
    return (
        <div style={{ padding: '2rem' }}>
            <h2>Welcome, {user?.name || "Barista"}</h2>
            <p>This is your dashboard. Use the buttons below to manage orders.</p>

            <div style={{ marginTop: '2rem' }}>
                <Link to="/status">
                    <button className="ui button green" style={{ marginRight: '1rem' }}>
                        View Orders
                    </button>
                </Link>

                <Link to="/settings">
                    <button className="ui button">Settings</button>
                </Link>
            </div>
        </div>
    );
}

export default BaristaHomePage;
