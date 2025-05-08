import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function OrderItems() {
    const { itemId } = useParams();
    const [item, setItem] = useState(null);
    const [customizations, setCustomizations] = useState([]);
    const [error, setError] = useState(null);

    const [selectedIds, setSelectedIds] = useState([]);


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
            })
            .catch(err => {
                console.error(err);
                setError("Failed to load customizations");
            });
    }, [item]);

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
                        <label>
                            <p>{c.name}</p>
                            {c.customizationOptions?.map(opt => (
                                <div key={opt.customizationOptionId}>

                                    <input
                                        type="checkbox"
                                        value={opt.customizationOptionId}
                                        checked={selectedIds.includes(opt.customizationOptionId)}
                                        onChange={(e) => {
                                            const id = opt.customizationOptionId;
                                            if (e.target.checked) {
                                                setSelectedIds([...selectedIds, id]);
                                            } else {
                                                setSelectedIds(selectedIds.filter(i => i !== id));
                                            }
                                        }}
                                    />

                                    <label style={{ marginLeft: "5px" }}>
                                        {opt.name}
                                        {opt.extraCost > 0 && (
                                            <span style={{ marginLeft: "10px", color: "gray" }}>
                                                (+€{opt.extraCost.toFixed(2)})
                                            </span>
                                        )}
                                    </label>
                                </div>
                            ))}
                        </label>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default OrderItems;
