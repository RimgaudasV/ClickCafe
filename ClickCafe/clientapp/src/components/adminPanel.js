import { useState, useEffect } from 'react';

function AdminPanel() {
    const [data, setData] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [showDeleteForm, setShowDeleteForm] = useState(false);
    const [showMenuItemForm, setShowMenuItemForm] = useState(false);

    const [form, setForm] = useState({
        name: '',
        address: '',
        phone: '',
        hours: '',
        image: ''
    });

    const [menuForm, setMenuForm] = useState({
        cafeId: '',
        name: '',
        description: '',
        basePrice: '',
        category: '',
        image: null,
        availableCustomizationIds: []
    });

    const [cafes, setCafes] = useState([]);
    const [customizations, setCustomizations] = useState([]);
    const [selectedCafeId, setSelectedCafeId] = useState(null);

    useEffect(() => {
        fetch("https://localhost:7281/api/admin/overview", { credentials: "include" })
            .then(res => res.json())
            .then(setData);

        fetch("https://localhost:7281/api/cafes", { credentials: "include" })
            .then(res => res.json())
            .then(setCafes);

        fetch("https://localhost:7281/api/customizations", { credentials: "include" })
            .then(res => res.json())
            .then(setCustomizations);
    }, []);

    const handleInput = (e) => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("address", form.address);
        formData.append("phoneNumber", form.phone);
        formData.append("operatingHours", form.hours);
        formData.append("image", form.image);

        const res = await fetch("https://localhost:7281/api/cafes", {
            method: "POST",
            credentials: "include",
            body: formData
        });

        if (res.ok) {
            alert("Cafe created!");
            setForm({ name: '', address: '', phone: '', hours: '', image: null });
            setShowForm(false);

            const cafesRes = await fetch("https://localhost:7281/api/cafes", { credentials: "include" });
            setCafes(await cafesRes.json());

            const overviewRes = await fetch("https://localhost:7281/api/admin/overview", { credentials: "include" });
            setData(await overviewRes.json());
        } else {
            alert("Error creating cafe");
        }
    };

    const handleDeleteCafe = async (e) => {
        e.preventDefault();
        if (!selectedCafeId) return;

        const confirmed = window.confirm("Are you sure you want to delete this cafe?");
        if (!confirmed) return;

        const res = await fetch(`https://localhost:7281/api/cafes/${selectedCafeId}`, {
            method: "DELETE",
            credentials: "include"
        });

        if (res.ok) {
            alert("Cafe deleted.");
            setShowDeleteForm(false);
            setSelectedCafeId(null);
            setCafes(prev => prev.filter(c => c.cafeId !== parseInt(selectedCafeId)));

            const overviewRes = await fetch("https://localhost:7281/api/admin/overview", { credentials: "include" });
            setData(await overviewRes.json());
        } else {
            alert("Failed to delete cafe.");
        }
    };

    const handleMenuInput = (e) => {
        const { name, value } = e.target;
        setMenuForm(f => ({ ...f, [name]: value }));
    };

    const handleMenuImage = (e) => {
        setMenuForm(f => ({ ...f, image: e.target.files[0] }));
    };

    const handleCustomizationChange = (e) => {
        const id = parseInt(e.target.value);
        setMenuForm(prev => {
            const selected = prev.availableCustomizationIds.includes(id);
            return {
                ...prev,
                availableCustomizationIds: selected
                    ? prev.availableCustomizationIds.filter(i => i !== id)
                    : [...prev.availableCustomizationIds, id]
            };
        });
    };

    const handleMenuSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("cafeId", menuForm.cafeId);
        formData.append("name", menuForm.name);
        formData.append("description", menuForm.description);
        formData.append("basePrice", menuForm.basePrice);
        formData.append("category", menuForm.category);
        formData.append("image", menuForm.image);

        menuForm.availableCustomizationIds.forEach(id =>
            formData.append("AvailableCustomizationIds", id)
        );

        const res = await fetch("https://localhost:7281/api/menuitems", {
            method: "POST",
            credentials: "include",
            body: formData
        });

        if (res.ok) {
            alert("Menu item created!");
            setMenuForm({
                cafeId: '',
                name: '',
                description: '',
                basePrice: '',
                category: '',
                image: null,
                availableCustomizationIds: []
            });
            setShowMenuItemForm(false);
        } else {
            alert("Error creating menu item");
        }
    };

    if (!data) return <p>Loading...</p>;

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <ul>
                <li>Total Users: {data.userCount}</li>
                <li>Total Cafes: {data.cafeCount}</li>
                <li>Total Menu Items: {data.menuItemCount}</li>
            </ul>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                <button className="ui blue button" onClick={() => setShowForm(!showForm)}>
                    {showForm ? "Cancel" : "Add a Cafe"}
                </button>

                <button className="ui red button" onClick={() => setShowDeleteForm(!showDeleteForm)}>
                    {showDeleteForm ? "Cancel" : "Remove a Cafe"}
                </button>

                <button className="ui green button" onClick={() => setShowMenuItemForm(!showMenuItemForm)}>
                    {showMenuItemForm ? "Cancel" : "Add a Menu Item"}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="ui form" style={{ marginTop: '1rem', width: '300px' }}>
                    <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleInput} required />
                    <input type="text" name="address" placeholder="Address" value={form.address} onChange={handleInput} required />
                    <input type="text" name="phone" placeholder="Phone Number" value={form.phone} onChange={handleInput} required />
                    <input type="text" name="hours" placeholder="Operating Hours" value={form.hours} onChange={handleInput} required />
                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={(e) => setForm(f => ({ ...f, image: e.target.files[0] }))}
                        required
                    />
                    <button className="ui primary button" type="submit">Add Cafe</button>
                </form>
            )}

            {showDeleteForm && (
                <form onSubmit={handleDeleteCafe} className="ui form" style={{ marginTop: '1rem' }}>
                    <select
                        className="ui dropdown"
                        style={{ width: '300px' }}
                        value={selectedCafeId || ''}
                        onChange={(e) => setSelectedCafeId(e.target.value)}
                        required
                    >
                        <option value="" disabled>Select a cafe to remove</option>
                        {cafes.map(c => (
                            <option key={c.cafeId} value={c.cafeId}>{c.name}</option>
                        ))}
                    </select>
                    <button type="submit" className="ui red button" style={{ marginTop: '0.5rem' }}>
                        Confirm Remove
                    </button>
                </form>
            )}

            {showMenuItemForm && (
                <form onSubmit={handleMenuSubmit} className="ui form" style={{ marginTop: '1rem', width: '300px' }}>
                    <select
                        name="cafeId"
                        value={menuForm.cafeId}
                        onChange={handleMenuInput}
                        className="ui dropdown"
                        required
                    >
                        <option value="" disabled>Select a Cafe</option>
                        {cafes.map(c => (
                            <option key={c.cafeId} value={c.cafeId}>{c.name}</option>
                        ))}
                    </select>

                    <input type="text" name="name" placeholder="Item Name" value={menuForm.name} onChange={handleMenuInput} required />
                    <input type="text" name="description" placeholder="Description" value={menuForm.description} onChange={handleMenuInput} />
                    <input type="number" step="0.01" name="basePrice" placeholder="Base Price" value={menuForm.basePrice} onChange={handleMenuInput} required />

                    <select
                        name="category"
                        value={menuForm.category}
                        onChange={handleMenuInput}
                        className="ui dropdown"
                        required
                    >
                        <option value="" disabled>Select a Category</option>
                        <option value="1">Coffee</option>
                        <option value="2">Tea</option>
                        <option value="3">Smoothie</option>
                    </select>

                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleMenuImage}
                        required
                    />

                    <div style={{ marginTop: '1rem' }}>
                        <label><strong>Customizations:</strong></label>
                        {customizations.map(c => (
                            <div key={c.customizationId}>
                                <label>
                                    <input
                                        type="checkbox"
                                        value={c.customizationId}
                                        checked={menuForm.availableCustomizationIds.includes(c.customizationId)}
                                        onChange={handleCustomizationChange}
                                    />
                                    {c.name}
                                </label>
                            </div>
                        ))}
                    </div>

                    <button className="ui green button" type="submit" style={{ marginTop: '1rem' }}>
                        Add Menu Item
                    </button>
                </form>
            )}
        </div>
    );
}

export default AdminPanel;
