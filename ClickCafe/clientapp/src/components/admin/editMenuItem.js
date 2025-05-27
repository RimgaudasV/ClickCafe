import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EditMenuItem() {
    const { itemId } = useParams();
    const navigate = useNavigate();

    const [menuForm, setMenuForm] = useState({
        cafeId: '', name: '', description: '', basePrice: '', category: '', image: null, availableCustomizationIds: []
    });

    const [cafes, setCafes] = useState([]);
    const [customizations, setCustomizations] = useState([]);
    const [existingImageUrl, setExistingImageUrl] = useState(null);

    useEffect(() => {
        fetch("https://localhost:7281/api/cafes", { credentials: "include" })
            .then(res => res.json()).then(setCafes);

        fetch("https://localhost:7281/api/customizations", { credentials: "include" })
            .then(res => res.json())
            .then(data => {
                setCustomizations(data);
            });

        fetch(`https://localhost:7281/api/menuitems/${itemId}`, { credentials: "include" })
            .then(res => res.json())
            .then(data => {
                setMenuForm({
                    cafeId: data.cafeId,
                    name: data.name,
                    description: data.description,
                    basePrice: data.basePrice,
                    category: data.category,
                    image: null,
                    availableCustomizationIds: data.availableCustomizationIds || []
                });

                setExistingImageUrl(`https://localhost:7281/images/${data.image}`);
            });

    }, [itemId]);

    const handleMenuInput = (e) => setMenuForm(f => ({ ...f, [e.target.name]: e.target.value }));
    const handleMenuImage = (e) => setMenuForm(f => ({ ...f, image: e.target.files[0] }));
    const handleCustomizationChange = (e) => {
        const id = parseInt(e.target.value);
        setMenuForm(prev => ({
            ...prev,
            availableCustomizationIds: prev.availableCustomizationIds.includes(id)
                ? prev.availableCustomizationIds.filter(i => i !== id)
                : [...prev.availableCustomizationIds, id]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", menuForm.name);
        formData.append("cafeId", menuForm.cafeId);
        formData.append("description", menuForm.description);
        formData.append("basePrice", menuForm.basePrice);
        formData.append("category", menuForm.category);

        if (menuForm.image) {
            formData.append("image", menuForm.image);
        }
        console.log("Selected customizations:", menuForm.availableCustomizationIds);

        menuForm.availableCustomizationIds.forEach(id =>
            formData.append("AvailableCustomizationIds", id)
        );
        console.log("Selected customizations:", menuForm.availableCustomizationIds);

        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }
        try {
            const res = await fetch(`https://localhost:7281/api/menuitems/${itemId}`, {
                method: "PUT",
                body: formData,
                credentials: "include"
            });

            if (res.ok) {
                alert("Menu item updated!");
                navigate(`/admin/menu/${menuForm.cafeId}`);
            } else {
                const err = await res.text();
                console.error("Update failed:", err);
                alert("Failed to update menu item.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while updating.");
        }
    };


    return (
        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', position: 'relative' }}>
            <button
                className="ui icon button"
                style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '-1rem',
                    zIndex: 1
                }}
                onClick={() => window.history.back()}
            >
                <i className="arrow left icon"></i>
                Go Back
            </button>
            <div className="ui segment" style={{ width: '100%', maxWidth: '500px', padding: '2rem', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                <h2 className="ui header" style={{ textAlign: 'center' }}>Edit Menu Item</h2>
                <form onSubmit={handleSubmit} className="ui form">
                    <div className="field">
                        <label>Cafe</label>
                        <select name="cafeId" value={menuForm.cafeId} onChange={handleMenuInput} className="ui dropdown" required>
                            <option value="" disabled>Select a Cafe</option>
                            {cafes.map(c => (<option key={c.cafeId} value={c.cafeId}>{c.name}</option>))}
                        </select>
                    </div>

                    <div className="field">
                        <label>Name</label>
                        <input type="text" name="name" placeholder="Item Name" value={menuForm.name} onChange={handleMenuInput} required />
                    </div>

                    <div className="field">
                        <label>Description</label>
                        <input type="text" name="description" placeholder="Description" value={menuForm.description} onChange={handleMenuInput} />
                    </div>

                    <div className="field">
                        <label>Base Price</label>
                        <input type="number" step="0.01" name="basePrice" placeholder="Base Price" value={menuForm.basePrice} onChange={handleMenuInput} required />
                    </div>

                    <div className="field">
                        <label>Category</label>
                        <select name="category" value={menuForm.category} onChange={handleMenuInput} className="ui dropdown" required>
                            <option value="" disabled>Select a Category</option>
                            <option value="1">Coffee</option>
                            <option value="2">Tea</option>
                            <option value="3">Smoothie</option>
                        </select>
                    </div>

                    {existingImageUrl && (
                        <div className="field">
                            <label>Current Image</label>
                            <img src={existingImageUrl} alt="Current" style={{ width: '100px', borderRadius: '5px', marginBottom: '1rem' }} />
                        </div>
                    )}

                    <div className="field">
                        <label>Change Image</label>
                        <input type="file" name="image" accept="image/*" onChange={handleMenuImage} />
                    </div>

                    <div className="field">
                        <label><strong>Customizations:</strong></label>
                        {customizations.map(c => (
                            <div key={c.customizationId} style={{ marginBottom: '0.3rem' }}>
                                <label>
                                    <input
                                        type="checkbox"
                                        value={c.customizationId}
                                        checked={menuForm.availableCustomizationIds.includes(Number(c.customizationId))}
                                        onChange={handleCustomizationChange}
                                        style={{ marginRight: '0.5rem' }}
                                    />
                                    {c.name}
                                </label>
                            </div>
                        ))}
                    </div>

                    <button className="ui primary button" type="submit" style={{ marginTop: '1rem', width: '100%' }}>
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );

}

export default EditMenuItem;
