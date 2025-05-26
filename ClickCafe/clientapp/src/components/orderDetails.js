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
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Order Details</h2>
            <h3>Items:</h3>
            <ul>
                {orderItems.map(item => (
                    <li key={item.orderItemId} style={{ marginBottom: "1rem" }}>
                        <strong>{menuItems[item.menuItemId]}</strong> — Quantity: {item.quantity} — Price: €{(item.price * item.quantity).toFixed(2)}
                        {customizationMap[item.orderItemId] && customizationMap[item.orderItemId].length > 0 && (
                            <ul style={{ marginLeft: "1rem", marginTop: "0.5rem" }}>
                                {customizationMap[item.orderItemId].map(opt => (
                                    <li key={opt.customizationOptionId}>{opt.name}</li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
            {isDiscounted && (
                <h3>Discount: €{(fullTotal - totalAmount).toFixed(2)}</h3>
            )}
            <h3>Total price: €{totalAmount.toFixed(2)}</h3>
        </div>
    );
}

export default OrderDetails;
