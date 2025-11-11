import { useAuth } from "../context/AuthContext";

export default function UserAccessControl() {
    const { user } = useAuth();

    return (
        <div>
            <h2>User Access Control</h2>
            <p>Welcome, {user?.fullName || user?.username}</p>
            <p>Create, terminate or edit users for the company's software.</p>
        </div>
    );
}