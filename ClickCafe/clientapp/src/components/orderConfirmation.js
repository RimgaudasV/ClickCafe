import React from 'react';
import { useParams } from 'react-router-dom';

function OrderConfirmationPage() {
    const { orderId } = useParams();

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Order Confirmation</h2>
            <p>Thank you for your order!</p>
            <p>Your order ID is: <strong>{orderId}</strong></p>
            {/* More details can be added if needed */}
        </div>
    );
}

export default OrderConfirmationPage;