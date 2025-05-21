import { Link, useNavigate } from 'react-router-dom';
import Bell from './bell';
import { useOrder } from "../context/OrderContext";

function Navbar({ user, setUser }) {
    const navigate = useNavigate();
    const { clearOrder } = useOrder();

    const handleLogoutClick = async () => {
        await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
        clearOrder();
        setUser(null);
        navigate('/login');
    };

    return (
        <div
            className="ui menu"
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "80px",
                zIndex: 1000,
                display: "flex",
                alignItems: "center",
                padding: 30
            }}
        >


            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {user?.role === "Admin" ? (
                    <Link to="/admin" style={linkStyle}>Admin Panel</Link>
                ) : user?.role === "Barista" ? (
                    <>
                        <Link to="/barista" style={linkStyle}>Main</Link>
                        <Link to="/status" style={linkStyle}>Orders</Link>
                    </>
                ) : (
                    <>
                        <Link to="/home" style={linkStyle}>Home</Link>
                        <Link to="/cafes" style={linkStyle}>New Order</Link>
                        <Link to="/rewards" style={linkStyle}>Rewards</Link>
                        <Link to="/history" style={linkStyle}>History</Link>
                    </>
                )}
                <Link to="/account" style={linkStyle}>Account</Link>
                <Link to="/settings" style={linkStyle}>Settings</Link>
            </div>

            <div className="right menu">

                <Bell />
                <button
                    onClick={handleLogoutClick}
                    style={{
                        backgroundColor: '#db2828',
                        color: '#fff',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        transition: 'background-color 0.2s ease',
                    }}
                    onMouseEnter={e => e.target.style.backgroundColor = '#b91d1d'}
                    onMouseLeave={e => e.target.style.backgroundColor = '#db2828'}
                >
                    Logout
                </button>
            </div>
        </div>

    );
}

const linkStyle = {
    textDecoration: 'none',
    backgroundColor: '#2185d0',
    color: '#fff',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    transition: 'background-color 0.2s ease',
    fontWeight: '500'
};

export default Navbar;
