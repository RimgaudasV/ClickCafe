export const login = async (email, password, setUser, setError) => {
    try {
        if (!email || !password) {
            setError("Both fields are required!");
            return;
        }

        const response = await fetch("https://localhost:7281/api/auth/login", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            const data = await response.json();
            setUser(data);
            console.log("Login successful!");
        } else {
            setError("Invalid username or password. Please try again.");
        }
    } catch (error) {
        console.error("Error during login: ", error);
        setError("An error occurred during login. Please try again later.");
    }
};


export const register = async (username, email, password, setError) => {
    try {
        if (!username || !email || !password) {
            setError("All fields are required.");
            return;
        }

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

        return true;
    } catch (err) {
        console.error("Registration error:", err);
        setError("An error occurred during registration.");
    }
};
