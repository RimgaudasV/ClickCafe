import { useNavigate } from 'react-router-dom';
import { useState } from 'react'

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [user, setUser] = useState(null);
    const navigate = useNavigate(); // <-- useNavigate hook

    const handleLogin = async (e) => {
        e.preventDefault();  // Prevent default form submission behavior

        if (!email || !password) {
            setError("Both fields are required!");
            return;
        }

        try {
            const response = await fetch("https://localhost:7281/api/auth/login", {
                method: "POST",
                credentials: "include", // This ensures cookies are sent along with the request
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Login successful!");
                // Use navigate for redirect
                navigate("/MainPage"); // Redirect to MainPage
            } else {
                setError("Invalid username or password. Please try again.");
            }
        } catch (error) {
            console.error("Error during login: ", error);
            setError("An error occurred during login. Please try again later.");
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: "0 auto" }}>
            <h2>Login</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {user ? (
                <div>
                    <p>Welcome, {user.email}!</p>
                </div>
            ) : (
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
            )}
        </div>
    );
}

export default LoginPage;
