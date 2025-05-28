import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrder } from "../../context/OrderContext";
import ConfirmModal from './confirmModal';

function Menu() {
    const { cafeId } = useParams();
    const [cafe, setCafe] = useState(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [sortOrder, setSortOrder] = useState("name");
    const [category, setCategory] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);
    const { clearOrder, orderItems } = useOrder();

    useEffect(() => {
        const params = new URLSearchParams({ cafeId, sort: sortOrder });
        if (category) params.append("category", category);

        fetch(`https://localhost:7281/api/Cafes/${cafeId}`, { credentials: "include" })
            .then(r => { if (!r.ok) throw new Error("Café not found"); return r.json(); })
            .then(setCafe)
            .catch(err => { console.error(err); setError("Could not load café"); });

        fetch(`https://localhost:7281/api/MenuItems?${params}`, { credentials: "include" })
            .then(r => { if (!r.ok) throw new Error("Failed to load menu items"); return r.json(); })
            .then(setItems)
            .catch(err => { console.error(err); setError("Could not load menu"); })
            .finally(() => setLoading(false));
    }, [cafeId, sortOrder, category]);

    const confirmNavigation = () => {
        setShowConfirm(false);
        clearOrder();
        navigate("/cafes");
    };

    const handleBackButton = () => {
        if (orderItems.length > 0) {
            setShowConfirm(true);
        } else {
            confirmNavigation();
        }
    };

    if (loading) return <p>Loading…</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!cafe) return <p>Café not found.</p>;

    return (
        <div style={{ padding: '2rem', fontFamily: 'Segoe UI, sans-serif' }}>
            <button onClick={handleBackButton} className="ui button">
                &larr; Back to cafés
            </button>
            <ConfirmModal
                show={showConfirm}
                onCancel={() => setShowConfirm(false)}
                onConfirm={confirmNavigation}
                title="Are you sure?"
                message="Do you want to go back to the cafes page? Your current order will be lost."
            />

            <div style={{ marginLeft: '0rem' }}>
                {cafe.image && (
                    <img
                        src={cafe.image}
                        alt={`${cafe.name} logo`}
                        style={{
                            width: 120,
                            height: 120,
                            objectFit: "cover",
                            borderRadius: "50%",
                            margin: "0.5rem 0"
                        }}
                    />
                )}

                <h2 style={{ marginBottom: 0 }}>{cafe.name}</h2>
                <p style={{ marginTop: 0, color: '#444' }}>{cafe.address}</p>
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <label>
                    <strong>Category:</strong>
                    <select onChange={(e) => setCategory(e.target.value)} value={category} className="ui dropdown" style={{ marginLeft: '0.5rem' }}>
                        <option value="">All</option>
                        <option value="1">Coffee</option>
                        <option value="2">Tea</option>
                        <option value="3">Smoothie</option>
                    </select>
                </label>

                <label>
                    <strong>Sort by:</strong>
                    <select onChange={(e) => setSortOrder(e.target.value)} value={sortOrder} className="ui dropdown" style={{ marginLeft: '0.5rem' }}>
                        <option value="name">Name (A–Z)</option>
                        <option value="price_asc">Price ↑</option>
                        <option value="price_desc">Price ↓</option>
                    </select>
                </label>
            </div>

            <h3
                style={{
                    marginTop: '2rem',
                    paddingBottom: '0.5rem',
                    borderBottom: '2px solid #4e342e',
                    color: '#333',
                    fontWeight: '600',
                    fontSize: '1.4rem'
                }}
            >
                Menu
            </h3>


            {items.length === 0 ? (
                <p>No items yet.</p>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                    gap: '1.5rem',
                    marginTop: '1rem'
                }}>
                    {items.map(item => (
                        <div
                            key={item.menuItemId}
                            className="ui card"
                            onClick={() => navigate(`/menuItem/${item.menuItemId}`)}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.03)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                            }}
                            style={{
                                cursor: 'pointer',
                                height: '100%',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                borderRadius: '10px',
                                backgroundColor: '#fff'
                            }}
                        >

                            {item.image && (
                                <div className="image">
                                    <img
                                        src={`https://localhost:7281/images/${item.image}`}
                                        alt={item.name}
                                        style={{
                                            height: '150px',
                                            width: '100%',
                                            objectFit: 'cover',
                                            borderTopLeftRadius: '10px',
                                            borderTopRightRadius: '10px'
                                        }}
                                    />
                                </div>
                            )}
                            <div className="content" style={{ padding: '1rem' }}>
                                <div className="header" style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{item.name}</div>
                                <div className="meta" style={{ color: '#888' }}>€{item.basePrice.toFixed(2)}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

}

export default Menu;
