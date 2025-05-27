import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { register } from '../../actions/authActions';
//import './register.css';

function RegisterPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [role, setRole] = useState(1);
    const [cafes, setCafes] = useState([]);
    const [cafeId, setCafeId] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        if (role === 2) {
            fetch("https://localhost:7281/api/cafes")
                .then(res => res.json())
                .then(data => setCafes(data))
                .catch(err => console.error("Failed to fetch cafes", err));
        }
    }, [role]);

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== repeatPassword) {
            setError("Passwords do not match.");
            return;
        }

        const success = await register(username, email, password, role, parseInt(cafeId), setError);
        if (success) navigate("/login");
    };

    return (
        <div style={{
            maxWidth: "420px",
            margin: "3rem auto",
            padding: "2rem",
            border: "1px solid #ddd",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            backgroundColor: "#fff"
        }}>
            <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Registration Form</h2>
            {error && <p style={{ color: "red", marginBottom: "1rem", textAlign: "center" }}>{error}</p>}

            <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    style={inputStyle}
                />

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

                <input
                    type="password"
                    placeholder="Repeat Password"
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    required
                    style={inputStyle}
                />

                <div style={{ display: "flex", justifyContent: "center", gap: "2rem" }}>
                    <label>
                        <input
                            type="radio"
                            name="role"
                            value={1}
                            checked={role === 1}
                            onChange={() => setRole(1)}
                        /> Customer
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="role"
                            value={2}
                            checked={role === 2}
                            onChange={() => setRole(2)}
                        /> Barista
                    </label>
                </div>

                {role === 2 && (
                    <div>
                        <label style={{ display: "block", marginBottom: "0.5rem" }}>Select Café:</label>
                        <select
                            value={cafeId}
                            onChange={(e) => setCafeId(e.target.value)}
                            required
                            style={{ ...inputStyle, paddingRight: "1rem" }}
                        >
                            <option value="">-- Select a Café --</option>
                            {cafes.map(cafe => (
                                <option key={cafe.cafeId} value={cafe.cafeId}>
                                    {cafe.name} ({cafe.address})
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <button type="submit" style={buttonStyle}>Register</button>
            </form>
        </div>
    );
}

const inputStyle = {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "16px"
};

const buttonStyle = {
    padding: "10px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s ease"
};

export default RegisterPage;
