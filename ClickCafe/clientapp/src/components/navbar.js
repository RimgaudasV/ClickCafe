import { Link, useNavigate } from 'react-router-dom';

function Navbar({ user, setUser }) {
    const navigate = useNavigate();

    const handleLogoutClick = async () => {
        await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
        setUser(null);
        navigate('/login');
    };

    return (
        <nav
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1.2rem 2.5rem',
                fontSize: '1.05rem',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                borderBottom: '1px solid #ddd',
                position: 'relative',
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
        </nav>
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
