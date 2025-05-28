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
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "1.5rem",
                                alignItems: "center",
                                marginTop: "1rem",
                                padding: "0 1rem"
                            }}
                        >

                    {orders.map(order => {
                        const cafe = cafes[order.cafeId];

                        return (
                            <div
                                key={order.orderId}
                                style={{
                                    display: "flex",
                                    gap: "1.5rem",
                                    padding: "1rem",
                                    borderRadius: "12px",
                                    border: "2px solid #4e342e",
                                    backgroundColor: "#fff",
                                    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                                    alignItems: "flex-start",
                                    flexWrap: "wrap",
                                    maxWidth: "850px",
                                    width: "100%"
                                }}
                            >

                                {cafe?.image ? (
                                    <img
                                        src={cafe.image}
                                        alt={cafe.name}
                                        style={{
                                            width: "120px",
                                            height: "120px",
                                            objectFit: "cover",
                                            borderRadius: "12px",
                                            flexShrink: 0
                                        }}
                                    />
                                ) : (
                                        <div
                                            style={{
                                                width: "120px",
                                                height: "120px",
                                                background: "#eee",
                                                borderRadius: "12px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                color: "#999",
                                                fontSize: "0.9rem"
                                            }}
                                        >
                                            No Photo
                                        </div>
                                )}

                                <div style={{
                                    flex: 1,
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    textAlign: "left"
                                }}>

                                    <div style={{ marginBottom: "0.5rem" }}>
                                        <h4 style={{ margin: 0 }}>{cafe?.name || "Unknown Cafe"}</h4>
                                        <p style={{ margin: "0.25rem 0", color: "#666" }}>{cafe?.address || "Address not available"}</p>
                                    </div>

                                    <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", fontSize: "0.95rem", color: "#444" }}>
                                        <div>Status: <strong>{getStatusLabel(order.status)}</strong></div>
                                        <div>Pickup: <strong>{new Date(order.pickupDateTime).toLocaleString()}</strong></div>
                                        <div>Total: <strong>€{order.totalAmount.toFixed(2)}</strong></div>
                                        <div>ID: {order.orderId}</div>
                                    </div>

                                    <div style={{ marginTop: "1rem" }}>
                                        <Link
                                            to={`/order/${order.orderId}`}
                                            className="ui button"
                                            style={{
                                                padding: "0.5rem 1.2rem",
                                                backgroundColor: "#2185d0",
                                                color: "white",
                                                border: "none",
                                                borderRadius: "6px",
                                                textDecoration: "none",
                                                fontWeight: "bold"
                                            }}
                                            state={{ totalAmount: order.totalAmount }}
                                        >
                                            View Order
                                        </Link>
                                    </div>
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
    width: "240px",
    padding: "1.5rem",
    borderRadius: "10px",
    textDecoration: "none",
    color: "#333",
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
    transition: "transform 0.2s, box-shadow 0.2s",
    textAlign: "center",
    maxWidth: "600px",
    width: "100%"
};

const iconStyle = {
    fontSize: "2.5rem",
    marginBottom: "0.5rem"
};

export default CustomerHomePage;
