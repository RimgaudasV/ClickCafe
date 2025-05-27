import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";

function OrderDetails() {
    const { orderId } = useParams();
    const location = useLocation();
    const { totalAmount } = location.state || {};
    const [orderItems, setOrderItems] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [customizationMap, setCustomizationMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const res = await fetch(`/api/orders/${orderId}/items`, { credentials: "include" });
                if (!res.ok) throw new Error("Failed to load order items");
                const data = await res.json();
                setOrderItems(data);

                const menuItemIds = [...new Set(data.map(item => item.menuItemId))];
                const menuItemResponses = await Promise.all(
                    menuItemIds.map(menuItemId =>
                        fetch(`/api/MenuItems/${menuItemId}`, { credentials: "include" })
                            .then(res => res.json())
                            .catch(err => {
                                console.error(err);
                                return null;
                            })
                    )
                );

                const menuItems = menuItemResponses.reduce((acc, menuItem) => {
                    if (menuItem && menuItem.menuItemId) acc[menuItem.menuItemId] = menuItem.name;
                    return acc;
                }, {});
                setMenuItems(menuItems);

                const customizationFetches = await Promise.all(
                    data.map(item =>
                        fetch(`/api/customizations/orderItem/${item.orderItemId}/options`, { credentials: "include" })
                            .then(res => res.ok ? res.json() : [])
                            .catch(() => [])
                    )
                );

                const customizationMap = {};
                data.forEach((item, i) => {
                    customizationMap[item.orderItemId] = customizationFetches[i];
                });

                setCustomizationMap(customizationMap);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError("Could not load order details");
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId]);

    const fullTotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const isDiscounted = totalAmount < fullTotal;

    if (loading) return <p>Loading order details...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
            <h2 style={{ fontSize: "1.75rem", fontWeight: "600", marginBottom: "1.5rem" }}>
                Order Details
            </h2>

            <h3 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>Items:</h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {orderItems.map(item => (
                    <div
                        key={item.orderItemId}
                        style={{
                            padding: "1rem",
                            border: "1px solid #ccc",
                            borderRadius: "10px",
                            backgroundColor: "#fff",
                            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)"
                        }}
                    >
                        <div style={{ fontWeight: "600", fontSize: "1.1rem" }}>
                            {menuItems[item.menuItemId]}
                        </div>
                        <div style={{ margin: "0.5rem 0", color: "#555" }}>
                            Quantity: <strong>{item.quantity}</strong> &nbsp;|&nbsp; Price: <strong>€{(item.price * item.quantity).toFixed(2)}</strong>
                        </div>

                        {customizationMap[item.orderItemId] &&
                            customizationMap[item.orderItemId].length > 0 && (
                                <div style={{ marginTop: "0.5rem", fontSize: "0.95rem" }}>
                                    <div style={{ fontWeight: "500", marginBottom: "0.25rem" }}>Customizations:</div>
                                    <ul style={{ marginLeft: "1rem", color: "#444" }}>
                                        {customizationMap[item.orderItemId].map(opt => (
                                            <li key={opt.customizationOptionId}>{opt.name}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                    </div>
                ))}
            </div>

            <div style={{ marginTop: "2rem", fontSize: "1.1rem" }}>
                {isDiscounted && (
                    <div style={{ color: "#d9534f", marginBottom: "0.5rem" }}>
                        <strong>Discount:</strong> €{(fullTotal - totalAmount).toFixed(2)}
                    </div>
                )}
                <div style={{ fontWeight: "bold", fontSize: "1.3rem" }}>
                    Total Price: €{totalAmount.toFixed(2)}
                </div>
            </div>
        </div>
    );

}

export default OrderDetails;
