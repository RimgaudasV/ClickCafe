import { useOrder } from "../context/OrderContext";
import { useNavigate } from 'react-router-dom';

function OrderMenu() {
    const { orderItems, removeFromOrder } = useOrder();
    const navigate = useNavigate();

    if (orderItems.length === 0) return null;

    return (
        <div style={{
            position: "fixed",
            top: "80px",
            right: 0,
            height: "calc(100% - 60px)",
            width: "300px",
            padding: "1rem",
            backgroundColor: "#f9f9f9",
            borderLeft: "1px solid #ccc",
            overflowY: "auto",
            boxShadow: "-2px 0 6px rgba(0,0,0,0.1)",
            zIndex: 900
        }}>
            <h3>Your Order</h3>
            <ul>
                {orderItems.map((item, index) => (
                    <li key={index} style={{ marginBottom: "0.75rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span
                                style={{ cursor: "pointer", flexGrow: 1 }}
                                onClick={() => navigate(`/menuItem/${item.menuItemId}`, { state: { orderItemIndex: index } })}
                            >
                                {item.quantity} × {item.name} — €{item.total.toFixed(2)}
                            </span>
                            <button
                                onClick={() => removeFromOrder(index)}
                                style={{
                                    background: "transparent",
                                    border: "none",
                                    color: "#d00",
                                    fontWeight: "bold",
                                    fontSize: "1rem",
                                    marginLeft: "8px",
                                    cursor: "pointer"
                                }}
                                aria-label="Remove item"
                            >
                                ✖
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
            <div>
                <label>
                    Total price: {orderItems.reduce((sum, item) => sum + item.total, 0).toFixed(2)} €
                </label>
                <button
                    onClick={() => navigate('/checkout')}
                    style={{ marginLeft: '5px'}}
                >
                    Checkout
                </button>
            </div>
        </div>
    );
}

export default OrderMenu;
