import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const PaymentResultPage = () => {
    const [searchParams] = useSearchParams();
    const [paymentStatus, setPaymentStatus] = useState('Processing...');
    const navigate = useNavigate();

    useEffect(() => {
        const clientSecret = searchParams.get('payment_intent_client_secret');

        if (clientSecret) {
            fetch('/api/payments/status', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ clientSecret }),
            })
                .then(response => response.json())
                .then(data => {
                    setPaymentStatus(data.status);
                    if (data.status === 'succeeded') {
                        navigate('/order-confirmation');
                    } else if (data.status === 'failed' || data.status === 'canceled') {}
                })
                .catch(error => {
                    console.error('Error checking payment status:', error);
                    setPaymentStatus('Error checking payment status.');
                });
        } else {
            setPaymentStatus('No payment information received.');
        }
    }, [searchParams, navigate]);

    return (
        <div>
            <h1>Payment Status</h1>
            <p>{paymentStatus}</p>
            {paymentStatus === 'succeeded' && <p>Your payment was successful!</p>}
            {paymentStatus === 'failed' && <p>Your payment failed. Please try again.</p>}
            {paymentStatus === 'canceled' && <p>Your payment was canceled.</p>}
        </div>
    );
};

export default PaymentResultPage;