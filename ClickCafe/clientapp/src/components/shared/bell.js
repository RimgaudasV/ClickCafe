import React, { useState, useEffect } from 'react';

export default function Bell() {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

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

    const toggleOpen = () => setIsOpen(open => !open);

    return (
        <div style={{ position: 'relative' }}>
            <button onClick={toggleOpen}>
                🔔 {notifications.length}
            </button>

            {isOpen && notifications.length > 0 && (
                <ul style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    background: 'white',
                    border: '1px solid #ccc',
                    padding: '0.5rem',
                    listStyle: 'none',
                    margin: 0
                }}>
                    {notifications.map((msg, i) => (
                        <li key={i} style={{ padding: '0.25rem 0' }}>
                            {msg}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
