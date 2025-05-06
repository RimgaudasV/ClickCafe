import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function CafeItems() {
    const { cafeId } = useParams();
    const [cafe, setCafe] = useState(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

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
            <h2>{cafe.name}</h2>
            <p>{cafe.address}</p>
            <h3>Menu</h3>
            {items.length === 0
                ? <p>No items yet.</p>
                : (
                    <ul>
                        {items.map(item => (
                            <li key={item.menuItemId}>
                                {item.name} — €{item.basePrice.toFixed(2)}
                            </li>
                        ))}
                    </ul>
                )}
        </div>
    );
}

export default CafeItems;
