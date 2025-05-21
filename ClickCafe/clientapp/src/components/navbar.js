import { Link, useNavigate } from 'react-router-dom';

function Navbar({ user, setUser }) {
    const navigate = useNavigate();

    const handleLogoutClick = async () => {
        await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
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


            <div className="ui container" style={{ display: 'flex', width: '100%' }}>
                <div className="left menu">
                    {user?.role === "Barista" ? (
                        <>
                            <Link to="/barista"><button className="ui button">Main</button></Link>
                            <Link to="/status"><button className="ui button">Orders</button></Link>
                        </>
                    ) : (
                        <>
                            <Link to="/home"><button className="ui button">Home</button></Link>
                            <Link to="/cafes"><button className="ui button">New Order</button></Link>
                            <Link to="/rewards"><button className="ui button">Rewards</button></Link>
                            <Link to="/history"><button className="ui button">History</button></Link>
                        </>
                    )}

                    <Link to="/account"><button className="ui button">Account</button></Link>
                    <Link to="/settings"><button className="ui button">Settings</button></Link>
                </div>
            </div>

            <div className="right menu">
                <button className="ui red button" onClick={handleLogoutClick}>
                    Logout
                </button>
            </div>
        </div>
    );
}

export default Navbar;
