import { Navigate } from "react-router-dom";

const BaristaRoute = ({ user, children }) => {
    if (!user) {
        return <Navigate to="/login" />;
    }

    if (user.role !== "Barista") {
        return <Navigate to="/home" />;
    }

    return children;
};

export default BaristaRoute;
