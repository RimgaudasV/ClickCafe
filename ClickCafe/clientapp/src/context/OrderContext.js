import React, { createContext, useContext, useState } from "react";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
    const [orderItems, setOrderItems] = useState([]);

    const addToOrder = (item) => {
        setOrderItems(prev => [...prev, item]);
    };

    const clearOrder = () => setOrderItems([]);

    const removeFromOrder = (indexToRemove) => {
        setOrderItems(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    return (
        <OrderContext.Provider value={{ orderItems, addToOrder, clearOrder, removeFromOrder }}>
            {children}
        </OrderContext.Provider>
    );
};

export const useOrder = () => useContext(OrderContext);
