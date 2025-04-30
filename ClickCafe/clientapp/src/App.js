import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from './login';

function App() {
    const [message, setMessage] = useState('');

    return (
        <Router>
            <div style={{ padding: 20 }}>
                <h1>Welcome to ClickCafe ☕</h1>
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
