import { useState, useEffect } from 'react';

function AdminPanel() {
    const [data, setData] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [showDeleteForm, setShowDeleteForm] = useState(false);
    const [form, setForm] = useState({
        name: '',
        address: '',
        phone: '',
        hours: '',
        image: ''
    });

    const [cafes, setCafes] = useState([]);
    const [selectedCafeId, setSelectedCafeId] = useState(null);

    useEffect(() => {
        fetch("https://localhost:7281/api/admin/overview", { credentials: "include" })
            .then(res => res.json())
            .then(setData);

        fetch("https://localhost:7281/api/cafes", { credentials: "include" })
            .then(res => res.json())
            .then(setCafes);
    }, []);

    const handleInput = (e) => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch("https://localhost:7281/api/cafes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                name: form.name,
                address: form.address,
                phoneNumber: form.phone,
                operatingHours: form.hours,
                image: form.image
            })
        });

        if (res.ok) {
            alert("Cafe created!");
            setForm({ name: '', address: '', phone: '', hours: '', image: '' });
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
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="ui form" style={{ marginTop: '1rem', width: '300px' }}>
                    <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleInput} required />
                    <input type="text" name="address" placeholder="Address" value={form.address} onChange={handleInput} required />
                    <input type="text" name="phone" placeholder="Phone Number" value={form.phone} onChange={handleInput} required />
                    <input type="text" name="hours" placeholder="Operating Hours" value={form.hours} onChange={handleInput} required />
                    <input type="text" name="image" placeholder="Image URL or path" value={form.image} onChange={handleInput} required />
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
        </div>
    );
}

export default AdminPanel;
