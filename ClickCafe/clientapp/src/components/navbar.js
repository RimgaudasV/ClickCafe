import { Link, useNavigate } from 'react-router-dom';

function Navbar({ user, setUser, onLogout }) {
    const navigate = useNavigate();
    const handleLogoutClick = async () => {
        await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
        setUser(null);
        navigate('/login');
    };

    return (
        <nav className="ui raised very padded segment">
            <div className="ui right floated header">
                <button className="ui red button" onClick={handleLogoutClick}>
                    Logout
                </button>
            </div>
            <div className="ui left floated header">
                <Link to="/"><button className="ui button">Main</button></Link>
                <Link to="/newOrder"><button className="ui button">New Order</button></Link>
                <Link to="/status"><button className="ui button">Status</button></Link>
                <Link to="/rewards"><button className="ui button">Rewards</button></Link>
                <Link to="/history"><button className="ui button">History</button></Link>
                <Link to="/account"><button className="ui button">Account</button></Link>
                <Link to="/settings"><button className="ui button">Settings</button></Link>
            </div>

        </nav>
    );
}

export default Navbar;