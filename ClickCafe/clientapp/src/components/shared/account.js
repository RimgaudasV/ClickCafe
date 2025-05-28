import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Account() {
    const [info, setInfo] = useState(null);
    const [newName, setNewName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetch('https://localhost:7281/api/user/me', { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                setInfo(data);
                setNewName(data.username);
            });
    }, []);

    const updateDisplayName = () => {
        fetch('https://localhost:7281/api/user/me/displayname', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(newName)
        }).then(res => {
            if (res.ok) {
                alert('Username updated!');
                setInfo(info => ({ ...info, username: newName }));
                navigate('/home');
            } else {
                alert('Update failed');
            }
        });
    };

    if (!info) return <p>Loading...</p>;

    return (
        <div className="ui segment" style={{ maxWidth: 600, margin: '2rem auto' }}>
            <h2 className="ui header">Account Info</h2>
            <p><strong>Email:</strong> {info.email}</p>
            <p><strong>Orders made:</strong> {info.orderCount}</p>

            <div className="ui form">
                <div className="field">
                    <label>Username</label>
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                    />
                </div>
                <button className="ui primary button" onClick={updateDisplayName}>
                    Update Username
                </button>
            </div>
        </div>
    );
}

export default Account;
