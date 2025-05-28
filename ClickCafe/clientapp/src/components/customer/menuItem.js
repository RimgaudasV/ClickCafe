import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useOrder } from "../../context/OrderContext";

function MenuItem() {
    const { itemId } = useParams();
    const [item, setItem] = useState(null);
    const [customizations, setCustomizations] = useState([]);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedOptionIds, setSelectedOptionIds] = useState([]);
    const { orderItems, orderCafeId, setOrderCafeId, addToOrder, removeFromOrder } = useOrder();
    const navigate = useNavigate();
    const location = useLocation();
    const orderItemIndex = location.state?.orderItemIndex;

    useEffect(() => {
        if (orderItemIndex != null) {
            const item = orderItems[orderItemIndex];
            if (item) {
                setQuantity(item.quantity);
                setSelectedOptionIds(item.selectedOptionIds || []);
            }
        }
    }, [orderItemIndex]);

    useEffect(() => {
        fetch(`https://localhost:7281/api/MenuItems/${itemId}`, { credentials: "include" })
            .then(r => r.ok ? r.json() : Promise.reject("Item not found"))
            .then(setItem)
            .catch(err => setError("Could not load item"));

        fetch(`https://localhost:7281/api/Customizations/menuItem/${itemId}`, { credentials: "include" })
            .then(r => r.ok ? r.json() : Promise.reject("Failed to fetch customizations"))
            .then(setCustomizations)
            .catch(() => setCustomizations([]));
    }, [itemId]);

    const handleChange = (customization, optionId) => {
        if (customization.type === 1) {
            const ids = customization.options.map(o => o.customizationOptionId);
            setSelectedOptionIds(prev => [...prev.filter(id => !ids.includes(id)), optionId]);
        } else {
            setSelectedOptionIds(prev =>
                prev.includes(optionId)
                    ? prev.filter(id => id !== optionId)
                    : [...prev, optionId]
            );
        }
    };

    const calculateExtraCost = () => {
        return customizations.flatMap(c => c.options)
            .filter(o => selectedOptionIds.includes(o.customizationOptionId))
            .reduce((acc, o) => acc + (o.extraCost || 0), 0);
    };

    const handleAddToOrder = () => {
        const newItem = {
            menuItemId: item.menuItemId,
            name: item.name,
            total: totalPrice,
            quantity,
            selectedOptionIds
        };
        if (orderItemIndex != null) removeFromOrder(orderItemIndex);
        addToOrder(newItem, item.cafeId);
        navigate(`/menu/${item.cafeId}`);
    };

    const totalPrice = item ? (item.basePrice + calculateExtraCost()) * quantity : 0;
    if (!item) return <p>Loading item...</p>;

    return (
        <div style={{ padding: '2rem', fontFamily: 'Segoe UI, sans-serif' }}>
            <h2>{item.name}</h2>
            <p style={{ color: '#666' }}>{item.description}</p>

            <h3 style={{ marginTop: '2rem' }}>Customizations</h3>
            {customizations.length === 0 ? (
                <p style={{ color: '#888' }}>No customizations available.</p>
            ) : (
                <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
                    {customizations.map(c => (
                        <li key={c.customizationId} style={{ marginBottom: '1rem' }}>
                            <p><strong>{c.name}</strong></p>
                            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                                {c.options?.map(opt => {
                                    const inputType = c.type === 1 ? "radio" : "checkbox";
                                    const inputName = `customization-${c.customizationId}`;
                                    const isChecked = selectedOptionIds.includes(opt.customizationOptionId);
                                    return (
                                        <label key={opt.customizationOptionId} style={{ cursor: 'pointer' }}>
                                            <input
                                                type={inputType}
                                                name={inputType === "radio" ? inputName : undefined}
                                                value={opt.customizationOptionId}
                                                checked={isChecked}
                                                onChange={() => handleChange(c, opt.customizationOptionId)}
                                                style={{ marginRight: '5px' }}
                                            />
                                            {opt.name}
                                            {opt.extraCost > 0 && (
                                                <span style={{ marginLeft: "4px", color: "gray" }}>
                                                    (+€{opt.extraCost.toFixed(2)})
                                                </span>
                                            )}
                                        </label>
                                    );
                                })}
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            <div style={{ marginTop: '2rem' }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity === 1}>
                        –
                    </button>
                    <span>Quantity: {quantity}</span>
                    <button onClick={() => setQuantity(q => q + 1)}>+</button>
                </div>

                <button
                    onClick={handleAddToOrder}
                    className="ui green button"
                    style={{ marginTop: "1.5rem", padding: "0.75rem 1.5rem", fontSize: "1rem" }}
                >
                    Add to order — €{totalPrice.toFixed(2)}
                </button>
            </div>
        </div>
    );
}

export default MenuItem;
