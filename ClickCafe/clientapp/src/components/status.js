import React, { useEffect, useState } from 'react';

const StatusPage = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    const [updatingOrderId, setUpdatingOrderId] = useState(null);

    const getStatusText = (status) => {
        switch (status) {
            case 1: return "Pending";
            case 2: return "Completed";
            case 3: return "Canceled";
            default: return "Unknown";
        }
    };

    const fetchOrders = () => {
        fetch('https://localhost:7281/api/orders', {
            credentials: 'include'
        })
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                setOrders(data);
                setUpdatingOrderId(null);
            })
            .catch(err => setError(err.message));
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const updateStatus = (orderId, newStatus) => {
        setUpdatingOrderId(orderId);
        fetch(`https://localhost:7281/api/orders/${orderId}/status`, {
            method: 'PATCH',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        })
            .then(response => {
                if (!response.ok) throw new Error('Failed to update status');
                fetchOrders();
            })
            .catch(err => {
                setError(err.message);
                setUpdatingOrderId(null);
            });
    };

    const handleCancel = (orderId) => {
        if (window.confirm("Are you sure you want to cancel this order?")) {
            updateStatus(orderId, 3);
        }
    };

    const handleComplete = (orderId) => {
        updateStatus(orderId, 2);
    };

    const deleteOrder = (orderId) => {
        if (window.confirm("Are you sure you want to permanently delete this order?")) {
            fetch(`https://localhost:7281/api/orders/${orderId}`, {
                method: 'DELETE',
                credentials: 'include'
            })
                .then(response => {
                    if (!response.ok) throw new Error('Failed to delete order');
                    fetchOrders();
                })
                .catch(err => setError(err.message));
        }
    };

    return (
        <div>
            <h2>Current Orders</h2>
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            {orders.length === 0 && !error ? (
                <p>No orders available.</p>
            ) : (
                <table border="1" cellPadding="10">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>User ID</th>
                            <th>Status</th>
                            <th>Order Time</th>
                            <th>Pickup Time</th>
                            <th>Total (€)</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.orderId}>
                                <td>{order.orderId}</td>
                                <td>{order.userId}</td>
                                <td>{getStatusText(order.status)}</td>
                                <td>{new Date(order.orderDateTime).toLocaleTimeString()}</td>
                                <td>{new Date(order.pickupDateTime).toLocaleTimeString()}</td>
                                <td>{order.totalAmount.toFixed(2)}</td>
                                <td>
                                    {order.status === 1 && order.orderId !== updatingOrderId && (
                                        <>
                                            <button
                                                onClick={() => handleComplete(order.orderId)}
                                                style={{
                                                    background: 'green',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '5px 8px',
                                                    marginRight: '8px',
                                                    cursor: 'pointer',
                                                    borderRadius: '4px'
                                                }}
                                            >
                                                ✅ Complete
                                            </button>
                                            <button
                                                onClick={() => handleCancel(order.orderId)}
                                                title="Cancel Order"
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    color: 'red',
                                                    fontSize: '18px',
                                                    cursor: 'pointer',
                                                    marginRight: '8px'
                                                }}
                                            >
                                                ❌
                                            </button>
                                        </>
                                    )}
                                    <button
                                        onClick={() => deleteOrder(order.orderId)}
                                        title="Delete Order"
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: 'gray',
                                            fontSize: '18px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default StatusPage;
