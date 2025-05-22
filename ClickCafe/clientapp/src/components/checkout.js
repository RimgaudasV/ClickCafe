import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useOrder } from "../context/OrderContext";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const getRoundedTime = () => {
    const now = new Date();
    now.setSeconds(0);
    now.setMilliseconds(0);

    const minutes = now.getMinutes();
    const remainder = 15 - (minutes % 15);
    now.setMinutes(minutes + remainder);

    return now;
};

function Checkout() {
    const { orderItems } = useOrder();
    const navigate = useNavigate();
    const [pickupTime, setPickupTime] = useState(getRoundedTime());
    const [paymentOption, setPaymentOption] = useState(null);
    const [error, setError] = useState("");
    const [userId, setUserId] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);

    const totalAmount = orderItems.reduce((sum, item) => sum + (item.total ?? 0), 0);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            setLoadingUser(true);
            try {
                const response = await fetch("/api/auth/current", {
                    credentials: "include",
                });

                if (response.ok) {
                    const userData = await response.json();
                    setUserId(userData?.id);
                } else {
                    console.error("Failed to fetch current user:", response.status);
                    setError("Failed to fetch user information. Please try again.");
                }
            } catch (error) {
                console.error("Error fetching current user:", error);
                setError("An error occurred while fetching user information.");
            } finally {
                setLoadingUser(false);
            }
        };

        fetchCurrentUser();
    }, []);

    const handlePaymentOptionChange = (event) => {
        const value = event.target.value;
        setPaymentOption(value === "CreditCard" ? "CreditCard" : (value === "Cash" ? "Cash" : null));
    };

    const handleConfirmCheckout = async () => {
        console.log("Order Items before processing:", orderItems);
        if (!pickupTime) {
            setError("Please select a pickup time.");
            return;
        }
        if (!paymentOption) {
            setError("Please select a payment option.");
            return;
        }
        if (!userId) {
            setError("User information not available. Please try again.");
            return;
        }

        try {
            const orderData = {
                userId: userId,
                orderDateTime: new Date().toISOString(),
                status: 1,
                totalAmount: totalAmount,
                pickupDateTime: pickupTime,
                items: orderItems.map(item => ({
                    menuItemId: item.menuItemId ?? item.MenuItemId,
                    quantity: item.quantity ?? item.Quantity,
                    price: item.total ?? item.price / item.quantity ?? 0,
                    selectedOptionIds: item.selectedOptionIds ?? []
                })),
                paymentMethod: paymentOption,
            };

            console.log("Order Data being sent:", JSON.stringify(orderData, null, 2));

            const res = await fetch("/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(orderData),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData?.message || "Failed to create order.");
            }

            const responseData = await res.json();
            navigate(`/payment/${responseData.orderId}`, {
                state: {
                    orderId: responseData.orderId,
                    paymentId: responseData.paymentId,
                    totalAmount,
                    selectedPaymentOption: paymentOption === "CreditCard" ? "card" : "cash",
                }
            });

        } catch (err) {
            console.error(err);
            setError("Something went wrong during order creation.");
        }
    };

    const getMinTime = () => {
        const now = new Date();
        const rounded = new Date(Math.ceil(now.getTime() / (15 * 60 * 1000)) * (15 * 60 * 1000));
        return rounded;
    };

    const getMaxTime = () => {
        const endOfDay = new Date();
        endOfDay.setHours(23, 45, 0, 0); // last slot at 23:45
        return endOfDay;
    };

    if (loadingUser) {
        return <div>Loading user information...</div>;
    }
    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Checkout</h2>

            <h3 className="text-lg font-semibold mb-2">Your Order:</h3>
            {orderItems.length > 0 ? (
                <ul>
                    {orderItems.map((item, index) => (
                        <li key={index} style={{ marginBottom: "0.75rem" }}>
                            {item.quantity} × {item.name} — €{(item.total ?? 0).toFixed(2)}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Your order is empty.</p>
            )}

            <p className="mb-4">Total: <strong>€{totalAmount.toFixed(2)}</strong></p>

            <div className="mb-4">
                <label htmlFor="pickupTime" className="block text-gray-700 text-sm font-bold mb-2">
                    Select Pickup Time:
                </label>

                <ReactDatePicker
                    selected={pickupTime}
                    onChange={(date) => setPickupTime(date)}
                    showTimeSelect
                    timeIntervals={15}
                    minDate={new Date()}
                    minTime={getMinTime()}
                    maxTime={getMaxTime()}
                    dateFormat="Pp"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholderText="Select pickup time"
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    Select Payment Option:
                </label>
                <div className="flex items-center mb-2">
                    <input
                        type="radio"
                        id="card"
                        value="CreditCard"
                        checked={paymentOption === "CreditCard"}
                        onChange={handlePaymentOptionChange}
                        className="mr-2"
                    />
                    <label htmlFor="card" className="text-gray-700 text-sm">Credit Card</label>
                </div>
                <div className="flex items-center">
                    <input
                        type="radio"
                        id="cash"
                        value="Cash"
                        checked={paymentOption === "Cash"}
                        onChange={handlePaymentOptionChange}
                        className="mr-2"
                    />
                    <label htmlFor="cash" className="text-gray-700 text-sm">Cash on Pickup</label>
                </div>
            </div>

            {error && <p className="text-red-500">{error}</p>}

            <button
                onClick={handleConfirmCheckout}
                className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
                disabled={!pickupTime || !paymentOption || orderItems.length === 0 || !userId}
            >
                Proceed to Payment
            </button>
        </div>
    );
}

export default Checkout;