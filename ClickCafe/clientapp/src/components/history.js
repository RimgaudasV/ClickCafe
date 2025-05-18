import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';

function History() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { addToOrder, clearOrder } = useOrder();
    const navigate = useNavigate();
    const OrderStatus = {
        1: "Pending",
        2: "Completed",
        3: "Canceled"
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
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Order History</h2>
            <table className="min-w-full border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="px-4 py-2 border">Order Date & Time</th>
                        <th className="px-4 py-2 border">Pickup Date & Time</th>
                        <th className="px-4 py-2 border">Item Quantity</th>
                        <th className="px-4 py-2 border">Order Price (€)</th>
                        <th className="px-4 py-2 border">Order Status</th>
                        <th className="px-4 py-2 border">Payment Status</th>
                        <th className="px-4 py-2 border">View Order</th>
                        <th className="px-4 py-2 border">Repeat Order</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.orderId} className="text-center border-t">
                            <td className="px-4 py-2 border">{new Date(order.orderDateTime).toLocaleString()}</td>
                            <td className="px-4 py-2 border">{new Date(order.pickupDateTime).toLocaleString()}</td>
                            <td className="px-4 py-2 border">{order.itemQuantity}</td>
                            <td className="px-4 py-2 border">{order.totalAmount.toFixed(2)}</td>
                            <td className="px-4 py-2 border">{OrderStatus[order.status]}</td>
                            <td className="px-4 py-2 border">{PaymentStatus[order.paymentStatus]}</td>
                            <td className="px-4 py-2 border">
                                <Link to={`/order/${order.orderId}`} className="ui button" state={{ totalAmount: order.totalAmount }}>
                                    View Order
                                </Link>
                            </td>
                            <td className="px-4 py-2 border">
                                <button className="ui button" onClick={() => handleRepeatOrder(order.orderItemIds, order.orderId)}>
                                    Repeat Order
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default History;