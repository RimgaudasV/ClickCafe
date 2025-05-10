import React, { createContext, useContext, useState } from "react";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
    const [orderItems, setOrderItems] = useState([]);

    const addToOrder = (item) => {
        setOrderItems(prev => [...prev, item]);
    };

    const clearOrder = () => setOrderItems([]);

    return (
        <OrderContext.Provider value={{ orderItems, addToOrder, clearOrder }}>
            {children}
        </OrderContext.Provider>
    );
};

export const useOrder = () => useContext(OrderContext);
