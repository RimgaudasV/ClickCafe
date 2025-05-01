import { useEffect, useState } from 'react';

function App() {
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch('/api/hello')  // Call the backend API
            .then(response => response.text())
            .then(data => setMessage(data))
            .catch(error => console.error('Error fetching backend:', error));
    }, []);

    return (
        <div style={{ padding: 20 }}>
            <h1>Welcome to ClickCafe ☕</h1>
            <p>Backend says: {message}</p>
        </div>
    );
}

export default App;
