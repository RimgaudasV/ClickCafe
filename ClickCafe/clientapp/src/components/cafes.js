import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Cafes() {
    const [cafes, setCafes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

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
        <div style={{ padding: '1rem' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Available Cafés</h2>
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1.5rem',
                justifyContent: 'center'
            }}>
                {cafes.map(cafe => (
                    <div
                        key={cafe.cafeId}
                        onClick={() => navigate(`/menu/${cafe.cafeId}`)}
                        style={{
                            cursor: "pointer",
                            width: '220px',
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            backgroundColor: '#fff',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.03)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)';
                        }}
                    >
                        <img
                            src={cafe.image}
                            alt={cafe.name}
                            style={{
                                width: '100%',
                                height: '140px',
                                objectFit: 'cover',
                                borderTopLeftRadius: '8px',
                                borderTopRightRadius: '8px'
                            }}
                        />
                        <div style={{ padding: '0.75rem' }}>
                            <h3 style={{ margin: '0 0 0.5rem' }}>{cafe.name}</h3>
                            <p style={{ fontSize: '0.9rem', color: '#555' }}>{cafe.address}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Cafes;
