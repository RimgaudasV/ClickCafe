import { BrowserRouter as Router } from 'react-router-dom';
import { useState, useEffect } from 'react';

import AppRoutes from './AppRoutes';

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/auth/current", { credentials: "include" })
            .then(res => {
                if (!res.ok) throw new Error("Not authenticated");
                return res.json();
            })
            .then(data => setUser(data))
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <Router>
            <AppRoutes user={user} setUser={setUser} />
        </Router>
    );
}

export default App;
