import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useOrder } from "../context/OrderContext";

function OrderItems() {
    const { itemId } = useParams();
    const [item, setItem] = useState(null);
    const [customizations, setCustomizations] = useState([]);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedIds, setSelectedIds] = useState([]);

    const { addToOrder } = useOrder();
    const navigate = useNavigate();


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
    }, [itemId]);

    useEffect(() => {
        if (!item?.availableCustomizationIds?.length) return;

        Promise.all(
            item.availableCustomizationIds.map(id =>
                fetch(`https://localhost:7281/api/Customizations/${id}`, { credentials: "include" })
                    .then(r => {
                        if (!r.ok) throw new Error(`Customization ${id} not found`);
                        return r.json();
                    })
            )
        )
            .then(async customizations => {
                const withOptions = await Promise.all(
                    customizations.map(async c => {
                        const optionDetails = await Promise.all(
                            c.optionIds.map(optId =>
                                fetch(`https://localhost:7281/api/CustomizationOption/${optId}`, {
                                    credentials: "include",
                                }).then(r => {
                                    if (!r.ok) throw new Error(`Option ${optId} not found`);
                                    return r.json();
                                })
                            )
                        );
                        return {
                            ...c,
                            customizationOptions: optionDetails,
                        };
                    })
                );
                setCustomizations(withOptions);
                const defaultRadioSelections = withOptions
                    .filter(c => c.type === 1 && c.customizationOptions.length > 0)
                    .map(c => c.customizationOptions[0].customizationOptionId);

                setSelectedIds(prev =>
                    Array.from(new Set([...prev, ...defaultRadioSelections]))
                );
            })
            .catch(err => {
                console.error(err);
                setError("Failed to load customizations");
            });
    }, [item]);

    const handleChange = (customization, optionId) => {
        if (customization.type === 1) {
            const otherOptionIds = customization.customizationOptions.map(o => o.customizationOptionId);
            setSelectedIds([
                ...selectedIds.filter(id => !otherOptionIds.includes(id)),
                optionId,
            ]);
        } else {
            if (selectedIds.includes(optionId)) {
                setSelectedIds(selectedIds.filter(id => id !== optionId));
            } else {
                setSelectedIds([...selectedIds, optionId]);
            }
        }
    };

    const calculateExtraCost = () => {
        let total = 0;
        for (const c of customizations) {
            for (const opt of c.customizationOptions) {
                if (selectedIds.includes(opt.customizationOptionId)) {
                    total += opt.extraCost || 0;
                }
            }
        }
        return total;
    };

    const handleAddToOrder = () => {
        const selectedOptions = customizations
            .flatMap(c => c.customizationOptions)
            .filter(opt => selectedIds.includes(opt.customizationOptionId));

        const newItem = {
            menuItemId: item.menuItemId,
            name: item.name,
            basePrice: item.basePrice,
            quantity,
            customizations: selectedOptions,
            total: totalPrice
        };

        addToOrder(newItem);
        navigate(`/newOrder/${item.cafeId}`);
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
                            {c.customizationOptions?.map(opt => {
                                const inputType = c.type === 1 ? "radio" : "checkbox";
                                const inputName = `customization-${c.customizationId}`;
                                const isChecked = selectedIds.includes(opt.customizationOptionId);

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

export default OrderItems;
