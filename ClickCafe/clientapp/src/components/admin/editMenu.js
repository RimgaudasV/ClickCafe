import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';


function EditMenu(){ 

    const [showMenuItemForm, setShowMenuItemForm] = useState(false);
    const [showCustomizationForm, setShowCustomizationForm] = useState(false);
    const [showDeleteMenuItemForm, setShowDeleteMenuItemForm] = useState(false);
    const [showDeleteCustomizationForm, setShowDeleteCustomizationForm] = useState(false);
    const [customizations, setCustomizations] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [data, setData] = useState(null);
    const [cafes, setCafes] = useState([]);
    const navigate = useNavigate();
    const { cafeId } = useParams();


    const [menuForm, setMenuForm] = useState({
        cafeId: '', name: '', description: '', basePrice: '', category: '', image: null, availableCustomizationIds: []
    });
    const [customForm, setCustomForm] = useState({
        name: '', type: '', options: [{ name: '', extraCost: 0 }]
    });

    const [selectedMenuItemId, setSelectedMenuItemId] = useState('');
    const [selectedCustomizationId, setSelectedCustomizationId] = useState('');


    useEffect(() => {
        fetch("https://localhost:7281/api/customizations", { credentials: "include" })
            .then(res => res.json()).then(setCustomizations);
        fetch("https://localhost:7281/api/menuitems", { credentials: "include" })
            .then(res => res.json()).then(setMenuItems);
        fetch("https://localhost:7281/api/cafes", { credentials: "include" })
            .then(res => res.json()).then(setCafes);
    }, []);


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

    const handleItemClick = (itemId) => {
        navigate(`/admin/menuItem/${itemId}`);
    }

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



    return (
        <div>
            <button
                className="ui button"
                onClick={() => navigate('/admin')}
                style={{ marginLeft: '1rem', marginTop: '1rem' }}
            >
                ← Go Back
            </button>
            {cafeId && (
                <h2 style={{ paddingLeft: '1rem', marginBottom: '1rem' }}>
                    Editing Menu for: <strong>{cafes.find(c => c.cafeId === parseInt(cafeId))?.name || `Cafe ID: ${cafeId}`}</strong>
                </h2>
            )}

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', marginBottom: '2rem', flexWrap: 'wrap', paddingLeft: '1rem' }}>
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

            {showMenuItemForm && (
                <div style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
                    <form onSubmit={handleMenuSubmit} className="ui form" style={{ marginTop: '1rem', width: '300px', marginBottom: '2rem' }}>
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
                </div>
            )}

            {showDeleteMenuItemForm && (
                <div style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
                    <form onSubmit={handleDeleteMenuItem} className="ui form" style={{ marginTop: '1rem', marginBottom: '2rem' }}>
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
                </div>
            )}

            {showCustomizationForm && (
                <div style={{ paddingLeft: '1rem', paddingRight: '1rem', marginTop: '3rem' }}>
                    <h2>Add Customization</h2>
                    <form className="ui form" onSubmit={handleCustomSubmit} style={{ maxWidth: '400px', marginBottom: '2rem' }}>
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
                <div style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
                    <form onSubmit={handleDeleteCustomization} className="ui form" style={{ marginTop: '1rem', marginBottom: '2rem' }}>
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
                </div>
            )}



            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1.5rem',
                justifyContent: 'center'
            }}>
                {menuItems.map(item => (
                    <div
                        key={item.itemId}
                        style={{
                            width: '220px',
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                            backgroundColor: '#fff',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            cursor: 'default'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.03)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)';
                        }}
                        onClick={() => handleItemClick(item.menuItemId)}
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
                        <div style={{ padding: '0.75rem' }}>
                            <h3 style={{ margin: '0 0 0.5rem' }}>{item.name}</h3>
                            <p style={{ fontSize: '0.9rem', color: '#555' }}>{item.description}</p>
                            <p style={{ fontWeight: 'bold', marginTop: '0.5rem' }}>{item.basePrice} €</p>
                        </div>
                    </div>
                ))}
            </div>

        </div>



    );
}

export default EditMenu;

