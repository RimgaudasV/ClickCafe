import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function PaymentPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { orderId, totalAmount, selectedPaymentOption, paymentId } = location.state || {};
    const [paymentStatus, setPaymentStatus] = useState('pending');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (!orderId || totalAmount === undefined || !selectedPaymentOption || !paymentId) {
            setErrorMessage('Error: Order or payment details not found.');
            setPaymentStatus('error');
        }
    }, [orderId, totalAmount, selectedPaymentOption, paymentId]);

    const handleSimulateCardPayment = async () => {
        setPaymentStatus('processing');
        setErrorMessage('');

        try {
            const res = await fetch(`/api/payments/${paymentId}/process-card`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ paymentMethodId: 'pm_card_visa', paymentId }), // Sending a dummy paymentMethodId
            });

            console.log("PAYMENT PAGE STATE", { orderId, paymentId, selectedPaymentOption });

            if (res.ok) {
                const { success, message } = await res.json();
                if (success) {
                    setPaymentStatus('completed');
                    navigate(`/order/${orderId}/confirmation`);
                } else {
                    setPaymentStatus('failed');
                    setErrorMessage(message);
                }
            } else {
                const errorData = await res.json();
                setPaymentStatus('failed');
                setErrorMessage(errorData?.message || 'Payment failed.');
            }
        } catch (error) {
            console.error('Simulated card payment error:', error);
            setPaymentStatus('error');
            setErrorMessage('An error occurred during simulated card payment.');
        }
    };

    const handleConfirmCashPayment = async () => {
        setPaymentStatus('processing');
        setErrorMessage('');

        try {
            const res = await fetch(`/api/orders/${orderId}/pay-cash`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (res.ok) {
                setPaymentStatus('completed');
                navigate(`/order/${orderId}/confirmation`);
            } else {
                const errorData = await res.json();
                setPaymentStatus('failed');
                setErrorMessage(errorData?.message || 'Failed to confirm cash payment.');
            }
        } catch (error) {
            console.error('Cash payment confirmation error:', error);
            setPaymentStatus('error');
            setErrorMessage('An error occurred while confirming cash payment.');
        }
    };

    if (paymentStatus === 'error') {
        return <div className="p-6 text-red-500">{errorMessage}</div>;
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Payment</h2>
            <p className="mb-4">Total amount: <strong>€{totalAmount?.toFixed(2)}</strong></p>
            <p className="mb-4">Payment Option: <strong>{selectedPaymentOption}</strong></p>

            {paymentStatus === 'processing' && (
                <p className="text-yellow-500">Processing payment...</p>
            )}

            {paymentStatus === 'failed' && (
                <p className="text-red-500">Payment Failed: {errorMessage}</p>
            )}

            {selectedPaymentOption === 'card' && paymentStatus !== 'completed' && (
                <div>
                    <p className="mb-2">Simulating Credit Card Payment:</p>
                    <button
                        onClick={handleSimulateCardPayment}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        disabled={paymentStatus === 'processing'}
                    >
                        Simulate Pay with Card
                    </button>
                </div>
            )}

            {selectedPaymentOption === 'cash' && paymentStatus !== 'completed' && (
                <div>
                    <p className="mb-2">Confirm Cash Payment on Pickup:</p>
                    <button
                        onClick={handleConfirmCashPayment}
                        className="bg-gray-400 text-white px-4 py-2 rounded"
                        disabled={paymentStatus === 'processing'}
                    >
                        Confirm Cash Payment
                    </button>
                </div>
            )}

            {paymentStatus === 'completed' && (
                <p className="text-green-500">Payment Successful! Redirecting to confirmation...</p>
            )}
        </div>
    );
}

export default PaymentPage;