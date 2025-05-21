import { Link } from 'react-router-dom';

const CustomerHomePage = () => {
    return (
        <div style={{ padding: "2rem", textAlign: "center" }}>
            <h2 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>Welcome to <span style={{ color: "#2185d0" }}>ClickCafe</span>!</h2>
            <p style={{ fontSize: "1.1rem", color: "#555", marginBottom: "2rem" }}>
                Start a new order, view your past orders, or check your rewards.
            </p>

            <div style={{
                display: "flex",
                justifyContent: "center",
                gap: "2rem",
                flexWrap: "wrap"
            }}>
                <Link to="/cafes" style={cardStyle}>
                    <div style={iconStyle}>☕</div>
                    <h3>Start New Order</h3>
                    <p>Create a fresh order from your favorite café.</p>
                </Link>

                <Link to="/history" style={cardStyle}>
                    <div style={iconStyle}>📜</div>
                    <h3>Order History</h3>
                    <p>Look back at your past orders.</p>
                </Link>

            </div>
        </div>
    );
};

const cardStyle = {
    display: "block",
    width: "220px",
    padding: "1.5rem",
    borderRadius: "10px",
    textDecoration: "none",
    color: "#333",
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
    transition: "transform 0.2s, box-shadow 0.2s",
    textAlign: "center"
};

const iconStyle = {
    fontSize: "2.5rem",
    marginBottom: "0.5rem"
};

document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll("a");
    links.forEach(link => {
        link.addEventListener("mouseenter", () => {
            link.style.transform = "scale(1.03)";
            link.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
        });
        link.addEventListener("mouseleave", () => {
            link.style.transform = "scale(1)";
            link.style.boxShadow = "0 2px 6px rgba(0,0,0,0.08)";
        });
    });
});

export default CustomerHomePage;
