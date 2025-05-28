import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useOrder } from "../../context/OrderContext";

function History() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { addToOrder, clearOrder } = useOrder();
    const navigate = useNavigate();
    const OrderStatus = {
        1: "Pending",
        2: "Completed",
        3: "Canceled",
        4: "Ready"
    };
    const PaymentStatus = {
        1: "Pending",
        2: "Completed",
        3: "Failed"
    };

    useEffect(() => {
        fetch("/api/userOrders", { credentials: "include" })
            .then(res => {
                if (!res.ok) throw new Error("Failed to load orders");
                return res.json();
            })
            .then(data => {
                setOrders(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError("Could not load orders");
                setLoading(false);
            });
    }, [])

    const handleRepeatOrder = (orderItemIds, orderId) => {
        clearOrder();

        Promise.all(
            orderItemIds.map(itemId =>
                fetch(`/api/orders/${orderId}/items/${itemId}`, { credentials: "include" })
                    .then(res => res.json())
                    .catch(err => {
                        console.error("Failed to fetch order item", err);
                        return null;
                    })
            )
        )

        .then(orderItems => {
            const itemFetchPromises = orderItems.map(item => {
                if (item) {
                    return fetch(`/api/MenuItems/${item.menuItemId}`, { credentials: "include" })
                        .then(res => res.json())
                        .then(menuItem => {
                            const newItem = {
                                menuItemId: item.menuItemId,
                                name: menuItem.name,
                                total: item.price * item.quantity,
                                quantity: item.quantity,
                                selectedOptionIds: item.selectedOptionIds
                            };
                            return newItem;
                        })
                        .catch(err => {
                            console.error(err);
                            return null;
                        });
                }
            });

            Promise.all(itemFetchPromises)
                .then(newItems => {
                    const validItems = newItems.filter(item => item !== null);

                    validItems.forEach(newItem => addToOrder(newItem));

                    navigate("/checkout");
                });
        })
        .catch(err => {
            console.error("Error repeating the order", err);
        });
    };

    if (loading) return <p>Loading orders...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>

    return (
        <div style={{ padding: "2rem", maxWidth: "100%", overflowX: "auto" }}>
            <h2 style={{ fontSize: "1.75rem", fontWeight: "600", marginBottom: "1.5rem" }}>
                Order History
            </h2>

            <table style={{
                width: "100%",
                borderCollapse: "collapse",
                boxShadow: "0 0 10px rgba(0,0,0,0.05)",
                borderRadius: "10px",
                overflow: "hidden"
            }}>
                <thead style={{ backgroundColor: "#f3f3f3" }}>
                    <tr>
                        {["Id", "Order Date & Time", "Pickup Date & Time", "Item Quantity", "Order Price (€)", "Order Status", "Payment Status", "View", "Repeat"].map((header, i) => (
                            <th key={i} style={{
                                padding: "0.75rem 1rem",
                                fontWeight: "600",
                                fontSize: "0.95rem",
                                borderBottom: "2px solid #ddd",
                                textAlign: "left"
                            }}>
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order, i) => (
                        <tr key={order.orderId} style={{ backgroundColor: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                            <td style={cellStyle}>{order.orderId}</td>
                            <td style={cellStyle}>{new Date(order.orderDateTime).toLocaleString()}</td>
                            <td style={cellStyle}>{new Date(order.pickupDateTime).toLocaleString()}</td>
                            <td style={cellStyle}>{order.itemQuantity}</td>
                            <td style={cellStyle}>€{order.totalAmount.toFixed(2)}</td>
                            <td style={cellStyle}>{OrderStatus[order.status]}</td>
                            <td style={cellStyle}>{PaymentStatus[order.paymentStatus]}</td>
                            <td style={cellStyle}>
                                <Link
                                    to={`/order/${order.orderId}`}
                                    state={{ totalAmount: order.totalAmount }}
                                    style={linkButtonStyle}
                                >
                                    View
                                </Link>
                            </td>
                            <td style={cellStyle}>
                                <button
                                    onClick={() => handleRepeatOrder(order.orderItemIds, order.orderId)}
                                    style={repeatButtonStyle}
                                >
                                    Repeat
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

}

const cellStyle = {
    padding: "0.75rem 1rem",
    fontSize: "0.95rem",
    borderBottom: "1px solid #ddd",
    textAlign: "left",
    verticalAlign: "middle"
};

const linkButtonStyle = {
    padding: "0.4rem 0.8rem",
    backgroundColor: "#2185d0",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    textDecoration: "none",
    fontWeight: "bold",
    cursor: "pointer",
    display: "inline-block"
};

const repeatButtonStyle = {
    ...linkButtonStyle,
    backgroundColor: "#21ba45"
};


export default History;