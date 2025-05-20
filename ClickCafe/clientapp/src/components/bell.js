import React, { useState, useEffect } from 'react';

export default function Bell() {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchAlerts = () =>
            fetch('/api/alerts', { credentials: 'include' })
                .then(r => (r.ok ? r.json() : []))
                .then(alerts => {
                    if (alerts.length) setNotifications(n => [...n, ...alerts]);
                })
                .catch(() => { });

        fetchAlerts();                         
        const timer = setInterval(fetchAlerts, 10000); 
        return () => clearInterval(timer);
    }, []);

    return (
        <div style={{ position: 'relative' }}>
            <button>🔔 {notifications.length}</button>
            {notifications.length > 0 && (
                <ul style={{
                    position: 'absolute', top: '100%', right: 0,
                    background: '#fff', border: '1px solid #ccc',
                    padding: '0.5rem', margin: 0, listStyle: 'none'
                }}>
                    {notifications.map((msg, i) => (
                        <li key={i} style={{ padding: '0.25rem 0' }}>{msg}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}
