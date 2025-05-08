import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";

function OrderDetails() {
    const { orderId } = useParams();
    const location = useLocation();
    const { totalAmount } = location.state || {};
    const [orderItems, setOrderItems] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch(`/api/orders/${orderId}/items`, { credentials: "include" })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to load order items");
                return res.json();
            })
            .then(async data => {
                setOrderItems(data);
                console.log("Order Items:", data);

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
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError("Could not load order details");
                setLoading(false);
            });
    }, [orderId]);

    if (loading) return <p>Loading order details...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Order Details</h2>
            <h3>Items:</h3>
            <ul>
                {orderItems.map(item => (
                    <li key={item.orderItemId}>
                        {menuItems[item.menuItemId]} - Quantity: {item.quantity} - Price: €{(item.price*item.quantity).toFixed(2)}
                    </li>
                ))}
            </ul>
            <h3>Total price: {totalAmount.toFixed(2) }€</h3>
        </div>
    );
}

export default OrderDetails;
