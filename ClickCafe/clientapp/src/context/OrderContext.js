import React, { createContext, useContext, useState, useEffect } from "react";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {

    const [orderItems, setOrderItems] = useState(() => {
        const stored = localStorage.getItem("orderItems");
        return stored ? JSON.parse(stored) : [];
    });

    useEffect(() => {
        localStorage.setItem("orderItems", JSON.stringify(orderItems));
    }, [orderItems]);

    const [orderCafeId, setOrderCafeId] = useState([]);
    const [orderItems, setOrderItems] = useState([]);


    const addToOrder = (item, cafeId) => {
        if (orderItems.length === 0) {
            setOrderCafeId(cafeId);
        }
        setOrderItems(prev => [...prev, item]);
    };

    const clearOrder = () => setOrderItems([]);

    const removeFromOrder = (indexToRemove) => {
        setOrderItems(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    return (
        <OrderContext.Provider value={{ orderItems, addToOrder, clearOrder, removeFromOrder, orderCafeId, setOrderCafeId }}>
            {children}
        </OrderContext.Provider>
    );
};

export const useOrder = () => useContext(OrderContext);
