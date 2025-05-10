import { useOrder } from "../context/OrderContext";


function Checkout() {

    const { orderItems } = useOrder();

    return (
        <div>
            {orderItems.map((item, index) => (
                <li key={index} style={{ marginBottom: "0.75rem" }}>
                    {item.quantity} × {item.name} — €{item.total.toFixed(2)}
                </li>
            ))}
        </div>
    );
}

export default Checkout