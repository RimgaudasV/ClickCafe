import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from "../context/OrderContext";

function Cafes() {
    const [cafes, setCafes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { orderItems, orderCafeId } = useOrder();

    useEffect(() => {
        console.log(orderItems);
        console.log(orderCafeId)
        if (orderItems.length > 0 && orderCafeId) {
            navigate(`/menu/${orderCafeId}`);
        }
    }, [orderItems, orderCafeId, navigate]);

    useEffect(() => {
        fetch("https://localhost:7281/api/Cafes", { credentials: "include" })
            .then(res => {
                if (!res.ok) throw new Error("Failed to load cafés");
                return res.json();
            })
            .then(data => {
                setCafes(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError("Could not load cafés");
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading cafés…</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div>
            <h2>Select a Café</h2>
            <ul>
                {cafes.map(cafe => (
                    <li
                        key={cafe.cafeId}
                        style={{ cursor: "pointer", margin: "0.5rem 0" }}
                        onClick={() => navigate(`/menu/${cafe.cafeId}`)}
                    >
                        {cafe.image && (
                            <img src={cafe.image}
                                alt={cafe.name}
                                style={{
                                    width: 100,
                                    height: 100,
                                    objectFit: 'cover',
                                    marginRight: 8,
                                }}
                            />
                        )}

                        <strong>{cafe.name}</strong><br />
                        {cafe.address}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Cafes;
