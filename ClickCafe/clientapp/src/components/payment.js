import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useOrder } from "../context/OrderContext";

const stripePromise = loadStripe('pk_test_51RNGQL7m4RMaRF2E54EWWpBPU4F83zkiqyX1XRwAgNpHNEhARGsNgGhb0FumOhU1nzs7tBYDuabqOz3O27uIR70E00oXFQR1Fj');

function CheckoutForm({ paymentId, onSuccess }) {
    const stripe = useStripe();
    const elements = useElements();
    const [paymentStatus, setPaymentStatus] = useState('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const { clearOrder } = useOrder();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) return;

        setPaymentStatus('processing');
        setErrorMessage('');

        try {
            const res = await fetch(`/api/payments/${paymentId}/create-payment-intent`, {
                method: 'POST'
            });

            if (!res.ok) throw new Error('Failed to fetch payment intent');

            const { clientSecret } = await res.json();

            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement)
                }
            });

            if (result.error) {
                setPaymentStatus('failed');
                setErrorMessage(result.error.message || 'Payment failed.');
            } else if (result.paymentIntent?.status === 'succeeded') {
                await fetch(`/api/payments/${paymentId}/mark-paid`, { method: 'POST' });
                setPaymentStatus('succeeded');
                onSuccess(); // redirect handled in parent
            }
        } catch (err) {
            console.error(err);
            setPaymentStatus('failed');
            setErrorMessage('An unexpected error occurred.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <CardElement options={{ hidePostalCode: true }} />
            <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                disabled={paymentStatus === 'processing' || !stripe}
            >
                {paymentStatus === 'processing' ? 'Processing…' : 'Pay Now'}
            </button>
            {paymentStatus === 'failed' && <p className="text-red-500">{errorMessage}</p>}
        </form>
    );
}

function PaymentPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { orderId, totalAmount, selectedPaymentOption, paymentId } = location.state || {};
    const [errorMessage, setErrorMessage] = useState('');
    const [processingCash, setProcessingCash] = useState(false);
    const { clearOrder } = useOrder();

    useEffect(() => {
        if (!orderId || totalAmount === undefined || !selectedPaymentOption || !paymentId) {
            setErrorMessage('Error: Order or payment details not found.');
        }
    }, [orderId, totalAmount, selectedPaymentOption, paymentId]);

    const handlePaymentSuccess = () => {
        clearOrder();
        navigate(`/order/${orderId}/confirmation`);
    };

    const handleConfirmCashPayment = async () => {
        setProcessingCash(true);
        try {
            const res = await fetch(`/api/orders/${orderId}/pay-cash`, { method: 'POST' });
            if (res.ok) {
                clearOrder();
                navigate(`/order/${orderId}/confirmation`);
            } else {
                const errorData = await res.json();
                setErrorMessage(errorData.message || 'Failed to confirm cash payment.');
            }
        } catch (err) {
            setErrorMessage('An error occurred while confirming cash payment.');
        } finally {
            setProcessingCash(false);
        }
    };

    if (errorMessage) {
        return <div className="p-6 text-red-500">{errorMessage}</div>;
    }

    return (
        <div className="p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Payment</h2>
            <p className="mb-2">Total amount: <strong>€{totalAmount?.toFixed(2)}</strong></p>
            <p className="mb-4">Payment Option: <strong>{selectedPaymentOption}</strong></p>

            {selectedPaymentOption === 'card' && (
                <Elements stripe={stripePromise}>
                    <CheckoutForm paymentId={paymentId} onSuccess={handlePaymentSuccess} />
                </Elements>
            )}

            {selectedPaymentOption === 'cash' && (
                <div className="space-y-2">
                    <p>Confirm Cash Payment on Pickup:</p>
                    <button
                        onClick={handleConfirmCashPayment}
                        className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
                        disabled={processingCash}
                    >
                        {processingCash ? 'Processing…' : 'Confirm Cash Payment'}
                    </button>
                </div>
            )}
        </div>
    );
}

export default PaymentPage;
//function PaymentPage() {
//    const location = useLocation();
//    const navigate = useNavigate();
//    const { orderId, totalAmount, selectedPaymentOption, paymentId } = location.state || {};
//    const [paymentStatus, setPaymentStatus] = useState('pending');
//    const [errorMessage, setErrorMessage] = useState('');

//    useEffect(() => {
//        if (!orderId || totalAmount === undefined || !selectedPaymentOption || !paymentId) {
//            setErrorMessage('Error: Order or payment details not found.');
//            setPaymentStatus('error');
//        }
//    }, [orderId, totalAmount, selectedPaymentOption, paymentId]);

//    const handleSimulateCardPayment = async () => {
//        setPaymentStatus('processing');
//        setErrorMessage('');

//        try {
//            const res = await fetch(`/api/payments/${paymentId}/process-card`, {
//                method: 'POST',
//                headers: {
//                    'Content-Type': 'application/json',
//                },
//                body: JSON.stringify({ paymentMethodId: 'pm_card_visa', paymentId }), // Sending a dummy paymentMethodId
//            });

//            console.log("PAYMENT PAGE STATE", { orderId, paymentId, selectedPaymentOption });

//            if (res.ok) {
//                const { success, message } = await res.json();
//                if (success) {
//                    setPaymentStatus('completed');
//                    navigate(`/order/${orderId}/confirmation`);
//                } else {
//                    setPaymentStatus('failed');
//                    setErrorMessage(message);
//                }
//            } else {
//                const errorData = await res.json();
//                setPaymentStatus('failed');
//                setErrorMessage(errorData?.message || 'Payment failed.');
//            }
//        } catch (error) {
//            console.error('Simulated card payment error:', error);
//            setPaymentStatus('error');
//            setErrorMessage('An error occurred during simulated card payment.');
//        }
//    };

//    const handleConfirmCashPayment = async () => {
//        setPaymentStatus('processing');
//        setErrorMessage('');

//        try {
//            const res = await fetch(`/api/orders/${orderId}/pay-cash`, {
//                method: 'POST',
//                headers: {
//                    'Content-Type': 'application/json',
//                },
//            });

//            if (res.ok) {
//                setPaymentStatus('completed');
//                navigate(`/order/${orderId}/confirmation`);
//            } else {
//                const errorData = await res.json();
//                setPaymentStatus('failed');
//                setErrorMessage(errorData?.message || 'Failed to confirm cash payment.');
//            }
//        } catch (error) {
//            console.error('Cash payment confirmation error:', error);
//            setPaymentStatus('error');
//            setErrorMessage('An error occurred while confirming cash payment.');
//        }
//    };

//    if (paymentStatus === 'error') {
//        return <div className="p-6 text-red-500">{errorMessage}</div>;
//    }

//    return (
//        <div className="p-6">
//            <h2 className="text-2xl font-semibold mb-4">Payment</h2>
//            <p className="mb-4">Total amount: <strong>€{totalAmount?.toFixed(2)}</strong></p>
//            <p className="mb-4">Payment Option: <strong>{selectedPaymentOption}</strong></p>

//            {paymentStatus === 'processing' && (
//                <p className="text-yellow-500">Processing payment...</p>
//            )}

//            {paymentStatus === 'failed' && (
//                <p className="text-red-500">Payment Failed: {errorMessage}</p>
//            )}

//            {selectedPaymentOption === 'card' && paymentStatus !== 'completed' && (
//                <div>
//                    <p className="mb-2">Simulating Credit Card Payment:</p>
//                    <button
//                        onClick={handleSimulateCardPayment}
//                        className="bg-blue-500 text-white px-4 py-2 rounded"
//                        disabled={paymentStatus === 'processing'}
//                    >
//                        Simulate Pay with Card
//                    </button>
//                </div>
//            )}

//            {selectedPaymentOption === 'cash' && paymentStatus !== 'completed' && (
//                <div>
//                    <p className="mb-2">Confirm Cash Payment on Pickup:</p>
//                    <button
//                        onClick={handleConfirmCashPayment}
//                        className="bg-gray-400 text-white px-4 py-2 rounded"
//                        disabled={paymentStatus === 'processing'}
//                    >
//                        Confirm Cash Payment
//                    </button>
//                </div>
//            )}

//            {paymentStatus === 'completed' && (
//                <p className="text-green-500">Payment Successful! Redirecting to confirmation...</p>
//            )}
//        </div>
//    );
//}

//export default PaymentPage;