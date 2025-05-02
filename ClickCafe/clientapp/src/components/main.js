
function Main({ user }) {
    return (
        <div>
            <h2>Welcome, {user?.displayName}!</h2>
            <p>Email: {user?.email}</p>
        </div>
    );
}

export default Main