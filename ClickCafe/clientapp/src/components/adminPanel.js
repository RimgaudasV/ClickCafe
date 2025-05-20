import { useState, useEffect } from 'react';

function AdminPanel() {
    const [data, setData] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        name: '',
        address: '',
        phone: '',
        hours: '',
        image: ''
    });

    useEffect(() => {
        fetch("https://localhost:7281/api/admin/overview", { credentials: "include" })
            .then(res => res.json())
            .then(setData);
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
        } else {
            alert("Error creating cafe");
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

            <button className="ui blue button" onClick={() => setShowForm(!showForm)}>
                {showForm ? "Cancel" : "Add a Cafe"}
            </button>

            {showForm && (
                <form onSubmit={handleSubmit} className="ui form" style={{ marginTop: '1rem' }}>
                    <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleInput} required />
                    <input type="text" name="address" placeholder="Address" value={form.address} onChange={handleInput} required />
                    <input type="text" name="phone" placeholder="Phone Number" value={form.phone} onChange={handleInput} required />
                    <input type="text" name="hours" placeholder="Operating Hours" value={form.hours} onChange={handleInput} required />
                    <input type="text" name="image" placeholder="Image URL or path" value={form.image} onChange={handleInput} required />
                    <button className="ui primary button" type="submit">Add Cafe</button>
                </form>
            )}
        </div>
    );
}

export default AdminPanel;
