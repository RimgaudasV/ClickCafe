import { useEffect, useState } from 'react';

export default function AdminPanel() {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch("https://localhost:7281/api/admin/overview", {
            credentials: "include"
        })
            .then(res => {
                if (!res.ok) throw new Error("Access denied");
                return res.json();
            })
            .then(setData)
            .catch(err => alert(err.message));
    }, []);

    if (!data) return <p>Loading...</p>;

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <ul>
                <li>Total Users: {data.userCount}</li>
                <li>Total Cafes: {data.cafeCount}</li>
                <li>Total Menu Items: {data.menuItemCount}</li>
            </ul>
        </div>
    );
}
