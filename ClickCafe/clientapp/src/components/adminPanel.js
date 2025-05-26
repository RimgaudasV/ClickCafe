import { useState, useEffect } from 'react';

function AdminPanel() {
    const [data, setData] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [showDeleteForm, setShowDeleteForm] = useState(false);
    const [showMenuItemForm, setShowMenuItemForm] = useState(false);
    const [showCustomizationForm, setShowCustomizationForm] = useState(false);
    const [showDeleteMenuItemForm, setShowDeleteMenuItemForm] = useState(false);
    const [showDeleteCustomizationForm, setShowDeleteCustomizationForm] = useState(false);

    const [form, setForm] = useState({ name: '', address: '', phone: '', hours: '', image: '' });
    const [menuForm, setMenuForm] = useState({
        cafeId: '', name: '', description: '', basePrice: '', category: '', image: null, availableCustomizationIds: []
    });
    const [customForm, setCustomForm] = useState({
        name: '', type: '', options: [{ name: '', extraCost: 0 }]
    });

    const [cafes, setCafes] = useState([]);
    const [customizations, setCustomizations] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [selectedCafeId, setSelectedCafeId] = useState(null);
    const [selectedMenuItemId, setSelectedMenuItemId] = useState('');
    const [selectedCustomizationId, setSelectedCustomizationId] = useState('');

    useEffect(() => {
        fetch("https://localhost:7281/api/admin/overview", { credentials: "include" })
            .then(res => res.json()).then(setData);
        fetch("https://localhost:7281/api/cafes", { credentials: "include" })
            .then(res => res.json()).then(setCafes);
        fetch("https://localhost:7281/api/customizations", { credentials: "include" })
            .then(res => res.json()).then(setCustomizations);
        fetch("https://localhost:7281/api/menuitems", { credentials: "include" })
            .then(res => res.json()).then(setMenuItems);
    }, []);

    const handleInput = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
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
        formData.append("name", form.name);
        formData.append("address", form.address);
        formData.append("phoneNumber", form.phone);
        formData.append("operatingHours", form.hours);
        formData.append("image", form.image);

        const res = await fetch("https://localhost:7281/api/cafes", {
            method: "POST", credentials: "include", body: formData
        });
        if (res.ok) {
            alert("Cafe created!");
            setForm({ name: '', address: '', phone: '', hours: '', image: null });
            setShowForm(false);
            setCafes(await (await fetch("https://localhost:7281/api/cafes", { credentials: "include" })).json());
            setData(await (await fetch("https://localhost:7281/api/admin/overview", { credentials: "include" })).json());
        } else alert("Error creating cafe");
    };

    const handleDeleteCafe = async (e) => {
        e.preventDefault();
        if (!selectedCafeId) return;
        if (!window.confirm("Are you sure you want to delete this cafe?")) return;

        const res = await fetch(`https://localhost:7281/api/cafes/${selectedCafeId}`, {
            method: "DELETE", credentials: "include"
        });
        if (res.ok) {
            alert("Cafe deleted.");
            setShowDeleteForm(false);
            setSelectedCafeId(null);
            setCafes(prev => prev.filter(c => c.cafeId !== parseInt(selectedCafeId)));
            setData(await (await fetch("https://localhost:7281/api/admin/overview", { credentials: "include" })).json());
        } else alert("Failed to delete cafe.");
    };

    const handleDeleteMenuItem = async (e) => {
        e.preventDefault();
        if (!selectedMenuItemId) return;
        if (!window.confirm("Are you sure you want to delete this menu item?")) return;

        const res = await fetch(`https://localhost:7281/api/menuitems/${selectedMenuItemId}`, {
            method: "DELETE", credentials: "include"
        });
        if (res.ok) {
            alert("Menu item deleted.");
            setSelectedMenuItemId('');
            setMenuItems(prev => prev.filter(mi => mi.menuItemId !== parseInt(selectedMenuItemId)));
            setData(await (await fetch("https://localhost:7281/api/admin/overview", { credentials: "include" })).json());
        } else alert("Failed to delete menu item.");
    };

    const handleDeleteCustomization = async (e) => {
        e.preventDefault();
        if (!selectedCustomizationId) return;
        if (!window.confirm("Are you sure you want to delete this customization?")) return;

        const res = await fetch(`https://localhost:7281/api/customizations/${selectedCustomizationId}`, {
            method: "DELETE", credentials: "include"
        });
        if (res.ok) {
            alert("Customization deleted.");
            setSelectedCustomizationId('');
            setCustomizations(prev => prev.filter(c => c.customizationId !== parseInt(selectedCustomizationId)));
            setData(await (await fetch("https://localhost:7281/api/admin/overview", { credentials: "include" })).json());
        } else alert("Failed to delete customization.");
    };

    const getCafeNameById = (id) => {
        const cafe = cafes.find(c => c.cafeId === id);
        return cafe ? cafe.name : `Cafe ID: ${id}`;
    };

    const handleMenuSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.entries(menuForm).forEach(([key, val]) => {
            if (key !== 'availableCustomizationIds') formData.append(key, val);
        });
        menuForm.availableCustomizationIds.forEach(id => formData.append("AvailableCustomizationIds", id));

        const res = await fetch("https://localhost:7281/api/menuitems", {
            method: "POST", credentials: "include", body: formData
        });
        if (res.ok) {
            alert("Menu item created!");
            setMenuForm({ cafeId: '', name: '', description: '', basePrice: '', category: '', image: null, availableCustomizationIds: [] });
            setShowMenuItemForm(false);
        } else alert("Error creating menu item");
    };

    const handleCustomInput = (e) => {
        const { name, value } = e.target;
        setCustomForm(f => ({ ...f, [name]: value }));
    };

    const handleOptionChange = (index, field, value) => {
        const updated = [...customForm.options];
        updated[index][field] = field === 'extraCost' ? parseFloat(value) : value;
        setCustomForm(f => ({ ...f, options: updated }));
    };

    const addOption = () => {
        setCustomForm(f => ({ ...f, options: [...f.options, { name: '', extraCost: 0 }] }));
    };

    const removeOption = (index) => {
        const updated = customForm.options.filter((_, i) => i !== index);
        setCustomForm(f => ({ ...f, options: updated }));
    };

    const handleCustomSubmit = async (e) => {
        e.preventDefault();
        const dto = {
            name: customForm.name,
            type: parseInt(customForm.type),
            options: customForm.options
        };
        const res = await fetch("https://localhost:7281/api/customizations", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dto),
            credentials: "include"
        });
        if (res.ok) {
            alert("Customization created!");
            setCustomForm({ name: '', type: '', options: [{ name: '', extraCost: 0 }] });
            setCustomizations(await (await fetch("https://localhost:7281/api/customizations", { credentials: "include" })).json());
            setShowCustomizationForm(false);
        } else alert("Error creating customization");
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
                <button className="ui red button" onClick={() => setShowDeleteMenuItemForm(!showDeleteMenuItemForm)}>
                    {showDeleteMenuItemForm ? "Cancel" : "Remove a Menu Item"}
                </button>
                <button className="ui orange button" onClick={() => setShowCustomizationForm(!showCustomizationForm)}>
                    {showCustomizationForm ? "Cancel" : "Add a Customization"}
                </button>
                <button className="ui red button" onClick={() => setShowDeleteCustomizationForm(!showDeleteCustomizationForm)}>
                    {showDeleteCustomizationForm ? "Cancel" : "Remove a Customization"}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="ui form" style={{ marginTop: '1rem', width: '300px' }}>
                    <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleInput} required />
                    <input type="text" name="address" placeholder="Address" value={form.address} onChange={handleInput} required />
                    <input type="text" name="phone" placeholder="Phone Number" value={form.phone} onChange={handleInput} required />
                    <input type="text" name="hours" placeholder="Operating Hours" value={form.hours} onChange={handleInput} required />
                    <input type="file" name="image" accept="image/*" onChange={(e) => setForm(f => ({ ...f, image: e.target.files[0] }))} required />
                    <button className="ui primary button" type="submit">Add Cafe</button>
                </form>
            )}

            {showDeleteForm && (
                <form onSubmit={handleDeleteCafe} className="ui form" style={{ marginTop: '1rem' }}>
                    <select className="ui dropdown" style={{ width: '300px' }} value={selectedCafeId || ''} onChange={(e) => setSelectedCafeId(e.target.value)} required>
                        <option value="" disabled>Select a cafe to remove</option>
                        {cafes.map(c => (<option key={c.cafeId} value={c.cafeId}>{c.name}</option>))}
                    </select>
                    <button type="submit" className="ui red button" style={{ marginTop: '0.5rem' }}>
                        Confirm Remove
                    </button>
                </form>
            )}

            {showMenuItemForm && (
                <form onSubmit={handleMenuSubmit} className="ui form" style={{ marginTop: '1rem', width: '300px' }}>
                    <select name="cafeId" value={menuForm.cafeId} onChange={handleMenuInput} className="ui dropdown" required>
                        <option value="" disabled>Select a Cafe</option>
                        {cafes.map(c => (<option key={c.cafeId} value={c.cafeId}>{c.name}</option>))}
                    </select>
                    <input type="text" name="name" placeholder="Item Name" value={menuForm.name} onChange={handleMenuInput} required />
                    <input type="text" name="description" placeholder="Description" value={menuForm.description} onChange={handleMenuInput} />
                    <input type="number" step="0.01" name="basePrice" placeholder="Base Price" value={menuForm.basePrice} onChange={handleMenuInput} required />
                    <select name="category" value={menuForm.category} onChange={handleMenuInput} className="ui dropdown" required>
                        <option value="" disabled>Select a Category</option>
                        <option value="1">Coffee</option>
                        <option value="2">Tea</option>
                        <option value="3">Smoothie</option>
                    </select>
                    <input type="file" name="image" accept="image/*" onChange={handleMenuImage} required />
                    <div style={{ marginTop: '1rem' }}>
                        <label><strong>Customizations:</strong></label>
                        {customizations.map(c => (
                            <div key={c.customizationId}>
                                <label>
                                    <input type="checkbox" value={c.customizationId} checked={menuForm.availableCustomizationIds.includes(c.customizationId)} onChange={handleCustomizationChange} />
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

            {showDeleteMenuItemForm && (
                <form onSubmit={handleDeleteMenuItem} className="ui form" style={{ marginTop: '1rem' }}>
                    <select
                        className="ui dropdown"
                        style={{ width: '300px' }}
                        value={selectedMenuItemId || ''}
                        onChange={(e) => setSelectedMenuItemId(e.target.value)}
                        required
                    >
                        <option value="" disabled>Select a menu item to remove</option>
                        {menuItems.map(mi => (
                            <option key={mi.menuItemId} value={mi.menuItemId}>{mi.name} ({getCafeNameById(mi.cafeId)})</option>
                        ))}
                    </select>
                    <button type="submit" className="ui red button" style={{ marginTop: '0.5rem' }}>
                        Confirm Remove Menu Item
                    </button>
                </form>
            )}

            {showCustomizationForm && (
                <div style={{ marginTop: '3rem' }}>
                    <h2>Add Customization</h2>
                    <form className="ui form" onSubmit={handleCustomSubmit} style={{ maxWidth: '400px' }}>
                        <input type="text" name="name" placeholder="Customization Name" value={customForm.name} onChange={handleCustomInput} required />
                        <select name="type" value={customForm.type} onChange={handleCustomInput} className="ui dropdown" required>
                            <option value="" disabled>Select Type</option>
                            <option value="1">Single</option>
                            <option value="2">Multiple</option>
                        </select>
                        <div>
                            <strong>Options:</strong>
                            {customForm.options.map((opt, i) => (
                                <div key={i} style={{ marginBottom: '0.5rem' }}>
                                    <input type="text" placeholder="Option Name" value={opt.name} onChange={(e) => handleOptionChange(i, 'name', e.target.value)} required />
                                    <input type="number" step="0.01" placeholder="Extra Cost" value={opt.extraCost} onChange={(e) => handleOptionChange(i, 'extraCost', e.target.value)} required />
                                    <button type="button" onClick={() => removeOption(i)} style={{ marginLeft: '0.5rem' }}>✖</button>
                                </div>
                            ))}
                            <button type="button" onClick={addOption}>Add Option</button>
                        </div>
                        <button className="ui primary button" type="submit" style={{ marginTop: '1rem' }}>
                            Create Customization
                        </button>
                    </form>
                </div>
            )}
            {showDeleteCustomizationForm && (
                <form onSubmit={handleDeleteCustomization} className="ui form" style={{ marginTop: '1rem' }}>
                    <select
                        className="ui dropdown"
                        style={{ width: '300px' }}
                        value={selectedCustomizationId || ''}
                        onChange={(e) => setSelectedCustomizationId(e.target.value)}
                        required
                    >
                        <option value="" disabled>Select a customization to remove</option>
                        {customizations.map(c => (
                            <option key={c.customizationId} value={c.customizationId}>{c.name}</option>
                        ))}
                    </select>
                    <button type="submit" className="ui red button" style={{ marginTop: '0.5rem' }}>
                        Confirm Remove Customization
                    </button>
                </form>
            )}
        </div>
    );
}

export default AdminPanel;