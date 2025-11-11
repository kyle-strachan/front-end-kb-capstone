import { useAuth } from "../context/AuthContext";

export default function DepartmentCategories() {
    const { user } = useAuth();

    return (
        <div>
            <h2>Department Categories</h2>
            <p>Welcome, {user?.fullName || user?.username}</p>
            <p>This is a protected page — you can fetch and display department data here later.</p>
            <p>{user?.passwordHash}</p>
        </div>
    );
}