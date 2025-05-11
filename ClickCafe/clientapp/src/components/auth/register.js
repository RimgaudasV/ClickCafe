import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from '../../actions/authActions'

function RegisterPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [role, setRole] = useState(1);

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== repeatPassword) {
            setError("Passwords do not match.");
            return;
        }

        const success = await register(username, email, password, role, setError);

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
                <br/>
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
                <button type="submit">Register</button>

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

            </form>
        </div>
    );
}

export default RegisterPage;
