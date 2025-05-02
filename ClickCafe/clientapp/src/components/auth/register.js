import { useState } from "react";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!username || !email || !password || !repeatPassword) {
            setError("All fields are required.");
            return;
        }

        if (password !== repeatPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const response = await fetch("https://localhost:7281/api/auth/register", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                setError(data.message || "Registration failed.");
                return;
            }

            navigate("/login");
        } catch (err) {
            console.error("Registration error:", err);
            setError("An error occurred during registration.");
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
            </form>
        </div>
    );
}

export default RegisterPage;
