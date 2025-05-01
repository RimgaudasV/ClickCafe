import { useEffect, useState } from 'react';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from './auth/login';
import RegisterPage from './auth/register'


function App() {
    const [message, setMessage] = useState('');


    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                {/*<Route path="/mainpage" element={<MainPage />} />*/}
                <Route path="/" element={<LoginPage />} />
            </Routes>
        </Router>
    );
}

export default App;
