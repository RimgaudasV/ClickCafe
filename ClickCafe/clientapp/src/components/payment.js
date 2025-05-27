import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import { useOrder } from "../context/OrderContext";

const stripePromise = loadStripe('pk_test_51RNGQL7m4RMaRF2E54EWWpBPU4F83zkiqyX1XRwAgNpHNEhARGsNgGhb0FumOhU1nzs7tBYDuabqOz3O27uIR70E00oXFQR1Fj');

const cardStyleOptions = {
    style: {
        base: {
            fontSize: '16px',
            color: '#1a202c',
            '::placeholder': {
                color: '#a0aec0',
            },
        },
        invalid: {
            color: '#e53e3e',
        },
    },
};

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
                    card: elements.getElement(CardNumberElement),
                }
            });

            if (result.error) {
                setPaymentStatus('failed');
                setErrorMessage(result.error.message || 'Payment failed.');
            } else if (result.paymentIntent?.status === 'succeeded') {
                await fetch(`/api/payments/${paymentId}/mark-paid`, { method: 'POST' });
                setPaymentStatus('succeeded');
                onSuccess();
            }
        } catch (err) {
            console.error(err);
            setPaymentStatus('failed');
            setErrorMessage('An unexpected error occurred.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                <div className="p-3 border border-gray-300 rounded-md bg-white shadow-sm">
                    <CardNumberElement options={cardStyleOptions} />
                </div>
            </div>
            <div className="flex gap-4">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry</label>
                    <div className="p-3 border border-gray-300 rounded-md bg-white shadow-sm">
                        <CardExpiryElement options={cardStyleOptions} />
                    </div>
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                    <div className="p-3 border border-gray-300 rounded-md bg-white shadow-sm">
                        <CardCvcElement options={cardStyleOptions} />
                    </div>
                </div>
            </div>
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
    const { clearOrder, orderItems } = useOrder();

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

    const fullPrice = orderItems.reduce((sum, item) => sum + Number(item.total || 0), 0);
    const isDiscounted = totalAmount < fullPrice;

    return (
        <div className="p-6 max-w-md mx-auto bg-gray-50 min-h-screen">
            <div className="bg-white shadow-lg rounded-xl p-6 space-y-4">
                <h2 className="text-2xl font-semibold mb-4">Payment</h2>
                <p className="mb-2 text-lg">
                    Total amount: {" "}
                    {isDiscounted ? (
                        <>
                            <span style={{ textDecoration: 'line-through', color: 'grey', marginRight: '0.5rem' }}>
                                €{fullPrice.toFixed(2)}
                            </span>
                            <strong style={{ color: 'green' }}>€{totalAmount.toFixed(2)}</strong>
                        </>
                    ) : (
                        <strong>€{totalAmount.toFixed(2)}</strong>
                    )}
                </p>
                <p className="mb-4">Payment Option: <strong>{selectedPaymentOption}</strong></p>

                {selectedPaymentOption === 'card' && (
                    <Elements stripe={stripePromise}>
                        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                            <h3 className="text-xl font-semibold mb-4">Card Details</h3>
                            <CheckoutForm paymentId={paymentId} onSuccess={handlePaymentSuccess} />
                        </div>
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
        </div>
    );
}

export default PaymentPage;
