import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminPanel() {
    const [data, setData] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [showDeleteForm, setShowDeleteForm] = useState(false);


    const [form, setForm] = useState({ name: '', address: '', phone: '', hours: '', image: '' });


    const [cafes, setCafes] = useState([]);
    const [selectedCafeId, setSelectedCafeId] = useState(null);


    useEffect(() => {
        fetch("https://localhost:7281/api/admin/overview", { credentials: "include" })
            .then(res => res.json()).then(setData);
        fetch("https://localhost:7281/api/cafes", { credentials: "include" })
            .then(res => res.json()).then(setCafes);
    }, []);

    const handleInput = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));


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

    const navigate = useNavigate();

    const handleCafeButton = (cafeId) => {
        navigate(`/admin/menu/${cafeId}`);
    };


    if (!data) return <p>Loading...</p>;

    return (
        <div>
            <div style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
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
            </div>

            {showForm && (
                <div style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
                    <form onSubmit={handleSubmit} className="ui form" style={{ marginTop: '1rem', width: '300px' }}>
                        <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleInput} required />
                        <input type="text" name="address" placeholder="Address" value={form.address} onChange={handleInput} required />
                        <input type="text" name="phone" placeholder="Phone Number" value={form.phone} onChange={handleInput} required />
                        <input type="text" name="hours" placeholder="Operating Hours" value={form.hours} onChange={handleInput} required />
                        <input type="file" name="image" accept="image/*" onChange={(e) => setForm(f => ({ ...f, image: e.target.files[0] }))} required />
                        <button className="ui primary button" type="submit">Add Cafe</button>
                    </form>
                </div>
            )}

            {showDeleteForm && (
                <div style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
                    <form onSubmit={handleDeleteCafe} className="ui form" style={{ marginTop: '1rem' }}>
                        <select className="ui dropdown" style={{ width: '300px' }} value={selectedCafeId || ''} onChange={(e) => setSelectedCafeId(e.target.value)} required>
                            <option value="" disabled>Select a cafe to remove</option>
                            {cafes.map(c => (<option key={c.cafeId} value={c.cafeId}>{c.name}</option>))}
                        </select>
                        <button type="submit" className="ui red button" style={{ marginTop: '0.5rem' }}>
                            Confirm Remove
                        </button>
                    </form>
                 </div>
            )}

            <h2 style={{ textAlign: 'center', marginTop: '2rem' }}>Existing Cafés</h2>
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1.5rem',
                justifyContent: 'center'
            }}>
                {cafes.map(cafe => (
                    <div
                        key={cafe.cafeId}
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
                        onClick={() => handleCafeButton(cafe.cafeId)}
                    >
                        <img
                            src={cafe.image}
                            alt={cafe.name}
                            style={{
                                width: '100%',
                                height: '140px',
                                objectFit: 'cover',
                                borderTopLeftRadius: '8px',
                                borderTopRightRadius: '8px'
                            }}
                        />
                        <div style={{ padding: '0.75rem' }}>
                            <h3 style={{ margin: '0 0 0.5rem' }}>{cafe.name}</h3>
                            <p style={{ fontSize: '0.9rem', color: '#555' }}>{cafe.address}</p>
                        </div>
                    </div>
                ))}
            </div>

            
        </div>
    );
}

export default AdminPanel;