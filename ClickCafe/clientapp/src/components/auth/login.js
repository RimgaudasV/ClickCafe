import { useNavigate } from 'react-router-dom';
import { useState } from 'react'
import { login } from '../../actions/authActions'

function LoginPage({ setUser }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        await login(email, password, setUser, setError);
        navigate("/"); 
    };

    return (
        <div style={{ maxWidth: 400, margin: "0 auto", padding: "2rem" }}>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label>Email:</label><br />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label><br />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Log In</button>
                </form>
                <p>Don't have an account? <a href="/register">Register here</a></p>
        </div>
    );
}

export default LoginPage;
