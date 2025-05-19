import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useOrder } from "../context/OrderContext";
import { useLocation } from "react-router-dom";


function MenuItem() {
    const { itemId } = useParams();
    const [item, setItem] = useState(null);
    const [customizations, setCustomizations] = useState([]);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedOptionIds, setSelectedOptionIds] = useState([]);

    const { orderItems, addToOrder, removeFromOrder } = useOrder();
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
            .then(r => {
                if (!r.ok) throw new Error("Item not found");
                return r.json();
            })
            .then(setItem)
            .catch(err => {
                console.error(err);
                setError("Could not load item");
            });

        fetch(`https://localhost:7281/api/Customizations/menuItem/${itemId}`, { credentials: "include" })
            .then(r => {
                if (!r.ok) throw new Error("Failed to fetch customizations");
                return r.json();
            })
            .then(setCustomizations)
            .catch(err => {
                console.error(err);
                setCustomizations([]);
            });
    }, [itemId]);

    const handleChange = (customization, optionId) => {
        if (customization.type === 1) {
            const otherOptionIds = customization.options.map(o => o.customizationOptionId);
            setSelectedOptionIds([
                ...selectedOptionIds.filter(id => !otherOptionIds.includes(id)),
                optionId,
            ]);
        } else {
            if (selectedOptionIds.includes(optionId)) {
                setSelectedOptionIds(selectedOptionIds.filter(id => id !== optionId));
            } else {
                setSelectedOptionIds([...selectedOptionIds, optionId]);
            }
        }
    };

    const calculateExtraCost = () => {
        let total = 0;
        for (const c of customizations) {
            for (const opt of c.options) {
                if (selectedOptionIds.includes(opt.customizationOptionId)) {
                    total += opt.extraCost || 0;
                }
            }
        }
        return total;
    };

    const handleAddToOrder = () => {
        //const selectedOptions = customizations
        //    .flatMap(c => c.options) 
        //    .filter(opt => selectedOptionIds.includes(opt.customizationOptionId));

        const newItem = {
            menuItemId: item.menuItemId,
            name: item.name,
            total: totalPrice,
            quantity,
            selectedOptionIds
            //selectedOptions
        };
        if (orderItemIndex != null) {
            removeFromOrder(orderItemIndex)
        }
        addToOrder(newItem);
        navigate(`/menu/${item.cafeId}`);
    };

    const totalPrice = item ? (item.basePrice + calculateExtraCost()) * quantity : 0;


    if (!item) return <p>Loading item...</p>;


    return (
        <div>
            <h2>{item.name}</h2>
            <p>{item.description}</p>
            <h3>Customizations:</h3>
            {customizations.length === 0 && <p>No customizations available.</p>}
            <ul>
                {customizations.map(c => (
                    <li key={c.customizationId}>
                        <p>{c.name}</p>
                        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "10px" }}>
                            {c.options?.map(opt => {
                                const inputType = c.type === 1 ? "radio" : "checkbox";
                                const inputName = `customization-${c.customizationId}`;
                                const isChecked = selectedOptionIds.includes(opt.customizationOptionId);

                                return (
                                    <label
                                        key={opt.customizationOptionId}
                                    >
                                        <input
                                            type={inputType}
                                            name={inputType === "radio" ? inputName : undefined}
                                            value={opt.customizationOptionId}
                                            checked={isChecked}
                                            onChange={() => handleChange(c, opt.customizationOptionId)}
                                        />
                                        <span>
                                            {opt.name}
                                            {opt.extraCost > 0 && (
                                                <span style={{ marginLeft: "6px", color: "gray" }}>
                                                    (+€{opt.extraCost.toFixed(2)})
                                                </span>
                                            )}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    </li>
                ))}
            </ul>

            <div style={{ marginTop: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <button
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        disabled={quantity === 1}
                    >–</button>
                    <span>Quantity: {quantity}</span>
                    <button onClick={() => setQuantity(q => q + 1)}>+</button>
                </div>

                <button
                    style={{ marginTop: "10px", padding: "8px 16px", fontSize: "16px" }}
                    onClick={handleAddToOrder}
                >
                    Add to order — €{totalPrice.toFixed(2)}
                </button>
            </div>
        </div>
    );
}

export default MenuItem;
