import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { login } from '../../actions/authActions';

function LoginPage({ setUser, user }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (user) navigate("/", { replace: true });
    }, [user, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        const data = await login(email, password, setUser, setError);
        if (data) setUser(data);
    };

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <h2 style={titleStyle}>Welcome Back</h2>
                {error && <p style={errorStyle}>{error}</p>}
                <form onSubmit={handleLogin} style={formStyle}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={inputStyle}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={inputStyle}
                    />
                    <button type="submit" style={buttonStyle}>Log In</button>
                </form>
                <p style={{ marginTop: "1rem" }}>
                    Don’t have an account? <a href="/register" style={linkStyle}>Register</a>
                </p>
            </div>
        </div>
    );
}

const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",    
    paddingTop: "140px",        
    minHeight: "calc(100vh - 80px)",
    background: "#EFC88E"
};

const cardStyle = {
    background: "#fff",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "400px",
    textAlign: "center"
};

const titleStyle = {
    marginBottom: "1.5rem",
    fontSize: "1.75rem"
};

const formStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "1rem"
};

const inputStyle = {
    padding: "0.75rem",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "1px solid #ccc"
};

const buttonStyle = {
    padding: "0.75rem",
    backgroundColor: "#2185d0",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer"
};

const errorStyle = {
    color: "red",
    marginBottom: "1rem"
};

const linkStyle = {
    color: "#2185d0",
    textDecoration: "none",
    fontWeight: "bold"
};

export default LoginPage;
