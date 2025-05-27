import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const CustomerHomePage = () => {
    const [orders, setOrders] = useState([]);
    const [cafes, setCafes] = useState({});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/userOrders", { credentials: "include" })
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch orders");
                return res.json();
            })
            .then(async ordersData => {
                const filtered = ordersData.filter(order => order.status === 1 || order.status === 4);
                setOrders(filtered);

                const cafeIds = [...new Set(filtered.map(order => order.cafeId))];

                const cafeFetches = await Promise.all(
                    cafeIds.map(id =>
                        fetch(`/api/cafes/${id}`, { credentials: "include" })
                            .then(res => res.json())
                            .then(data => ({ id, data }))
                            .catch(() => ({ id, data: null }))
                    )
                );

                const cafeMap = {};
                cafeFetches.forEach(({ id, data }) => {
                    if (data) cafeMap[id] = data;
                });

                setCafes(cafeMap);
            })
            .catch(err => {
                console.error(err);
                setError("Could not load your orders.");
            })
            .finally(() => setLoading(false));
    }, []);

    const getStatusLabel = (status) => {
        switch (status) {
            case 1: return "Pending";
            case 4: return "Ready";
            default: return "Unknown";
        }
    };

    return (
        <div style={{ padding: "2rem", textAlign: "center" }}>
            <h2 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
                Welcome to <span style={{ color: "#2185d0" }}>ClickCafe</span>!
            </h2>
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

            <h3 style={{ marginTop: "3rem" }}>Active Orders</h3>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {loading ? (
                <p>Loading orders...</p>
            ) : orders.length === 0 ? (
                <p>No active orders yet.</p>
            ) : (
                <div style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
                    {orders.map(order => {
                        const cafe = cafes[order.cafeId];

                        return (
                            <div key={order.orderId} style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "1rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                                {cafe?.image ? (
                                    <img src={cafe.image} alt={cafe.name} style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px" }} />
                                ) : (
                                    <div style={{ width: "100px", height: "100px", background: "#eee", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>No Photo</div>
                                )}

                                <div style={{ flex: 1 }}>
                                    <h4>{cafe?.name || "Unknown Cafe"}</h4>
                                    <p>{cafe?.address || "Address not available"}</p>
                                    <p>Status: <strong>{getStatusLabel(order.status)}</strong></p>
                                    <p>Pickup time: {new Date(order.pickupDateTime).toLocaleString()}</p>
                                    <p>Total: €{order.totalAmount.toFixed(2)}</p>
                                    <Link to={`/order/${order.orderId}`} className="ui button" state={{ totalAmount: order.totalAmount }}>
                                        View Order
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
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

export default CustomerHomePage;
