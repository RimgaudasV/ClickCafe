import { useOrder } from "../context/OrderContext";
import { useNavigate } from 'react-router-dom';

function OrderReview() {
    const { orderItems, removeFromOrder } = useOrder();
    const navigate = useNavigate();

    if (orderItems.length === 0) return null;

    return (
        <div style={{
            position: "fixed",
            top: "0",
            right: "0",
            height: "100%",
            width: "300px",
            padding: "1rem",
            backgroundColor: "#f9f9f9",
            borderLeft: "1px solid #ccc",
            overflowY: "auto",
            boxShadow: "-2px 0 6px rgba(0,0,0,0.1)",
            zIndex: 1000
        }}>
            <h3>Your Order</h3>
            <ul>
                {orderItems.map((item, index) => (
                    <li key={index}
                        style={{ marginBottom: "0.75rem", cursor: "pointer" }}
                        onClick={() => navigate(`/menuItem/${item.menuItemId}`, { state: { orderItemIndex: index } })}
                    >
                        {item.quantity} × {item.name} — €{item.total.toFixed(2)}
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

export default OrderReview;
