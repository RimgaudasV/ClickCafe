import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrder } from "../context/OrderContext";

function CafeItems() {
    const { cafeId } = useParams();
    const [cafe, setCafe] = useState(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const { orderItems } = useOrder();


    useEffect(() => {
        fetch(`https://localhost:7281/api/Cafes/${cafeId}`, { credentials: "include" })
            .then(r => {
                if (!r.ok) throw new Error("Café not found");
                return r.json();
            })
            .then(setCafe)
            .catch(err => {
                console.error(err);
                setError("Could not load café");
            });

        fetch("https://localhost:7281/api/MenuItems", { credentials: "include" })
            .then(r => {
                if (!r.ok) throw new Error("Failed to load menu items");
                return r.json();
            })
            .then(data => {
                setItems(data.filter(i => i.cafeId === +cafeId));
            })
            .catch(err => {
                console.error(err);
                setError("Could not load menu");
            })
            .finally(() => setLoading(false));
    }, [cafeId]);

    if (loading) return <p>Loading…</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!cafe) return <p>Café not found.</p>;

    return (
        <div>
            <button onClick={() => navigate("/newOrder")}>
                &larr; Back to cafés
            </button>
            {cafe.image && (
                <img src={cafe.image}                  
                    alt={`${cafe.name} logo`}
                    style={{
                        width: 120,
                        height: 120,
                        objectFit: "cover",
                        borderRadius: "50%",               
                        marginBottom: "1rem"
                    }}
                />
            )}
            <h2>{cafe.name}</h2>
            <p>{cafe.address}</p>
            <h3>Menu</h3>
            {items.length === 0
                ? <p>No items yet.</p>
                : (
                    <ul>
                        {items.map(item => (
                            <li key={item.menuItemId}
                                style={{ cursor: "pointer", margin: "0.5rem 0" }}
                                onClick={() => navigate(`/orderItem/${item.menuItemId}`)}
                            >
                                {item.name} — €{item.basePrice.toFixed(2)}
                            </li>
                        ))}
                    </ul>
                )}

            {orderItems.length > 0 && (
                <div style={{
                    position: "fixed",
                    top: "0",
                    right: "0",
                    height: "100vh",
                    width: "300px",
                    padding: "1rem",
                    backgroundColor: "#f9f9f9",
                    borderLeft: "1px solid #ccc",
                    overflowY: "auto",
                    boxShadow: "-2px 0 6px rgba(0,0,0,0.1)"
                }}>
                    <h3>Your Order</h3>
                    <ul>
                        {orderItems.map((item, index) => (
                            <li key={index} style={{ marginBottom: "0.75rem" }}>
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
                            style={{ marginLeft: '5px' }}
                        >Checkout
                        </button>
                    </div>
                </div>
            )}


        </div>
    );
}

export default CafeItems;
