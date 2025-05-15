import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import OrderReview from './orderReview';
function CafeItems() {
    const { cafeId } = useParams();
    const [cafe, setCafe] = useState(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [sortOrder, setSortOrder] = useState("name");
    const [category, setCategory] = useState("");



    useEffect(() => {
        const params = new URLSearchParams({
            cafeId,
            sort: sortOrder,
        });
        if (category) params.append("category", category);

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

        fetch(`https://localhost:7281/api/MenuItems?${params}`, { credentials: "include" })
            .then(r => {
                if (!r.ok) throw new Error("Failed to load menu items");
                return r.json();
            })
            .then(setItems)
            .catch(err => {
                console.error(err);
                setError("Could not load menu");
            })
            .finally(() => setLoading(false));
    }, [cafeId, sortOrder, category]);

    if (loading) return <p>Loading…</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!cafe) return <p>Café not found.</p>;

    return (
        <div>
            <OrderReview/>
            <button onClick={() => navigate("/newOrder")}>
                &larr; Back to cafés
            </button>
            <div style={{margin: "10px"}}>
                <label>
                    Category:
                    <select onChange={(e) => setCategory(e.target.value)} value={category}>
                        <option value="">All</option>
                        <option value="1">Coffee</option>
                        <option value="2">Tea</option>
                        <option value="2">Smoothie</option>
                    </select>
                </label>

                <label>
                    Sort by:
                    <select onChange={(e) => setSortOrder(e.target.value)} value={sortOrder}>
                        <option value="name">Name (A–Z)</option>
                        <option value="price_asc">Price ↑</option>
                        <option value="price_desc">Price ↓</option>
                    </select>
                </label>
            </div>
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
        </div>
    );
}

export default CafeItems;
