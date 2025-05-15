import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { register } from '../../actions/authActions';

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

        if (success) {
            navigate("/login");
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: "0 auto", padding: "2rem" }}>
            <p className="title">Registration Form</p>
            {error && <p style={{ color: "red" }}>{error}</p>}

            <form className="App" onSubmit={handleRegister}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <br />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <br />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <br />
                <input
                    type="password"
                    placeholder="Repeat Password"
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    required
                />
                <br />

                <div style={{ marginTop: "1rem" }}>
                    <label>
                        <input
                            type="radio"
                            name="role"
                            value={1}
                            checked={role === 1}
                            onChange={() => setRole(1)}
                        />
                        Customer
                    </label>
                    <label style={{ marginLeft: "1rem" }}>
                        <input
                            type="radio"
                            name="role"
                            value={2}
                            checked={role === 2}
                            onChange={() => setRole(2)}
                        />
                        Barista
                    </label>
                </div>

                {role === 2 && (
                    <div style={{ marginTop: "1rem" }}>
                        <label>Select Café:</label>
                        <br />
                        <select
                            value={cafeId}
                            onChange={(e) => setCafeId(e.target.value)}
                            required
                        >
                            <option value="">-- Select a Café --</option>
                            {cafes.map(cafe => (
                                <option key={cafe.id} value={cafe.id}>
                                    {cafe.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <br />
                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default RegisterPage;
