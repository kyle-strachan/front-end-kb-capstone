import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
    const { user } = useAuth();
    return (
        <div>
            <h2>Account</h2>
            <p>Welcome {user?.fullName || user?.username}</p>
            <p>{user?.department}</p>
            <p>{user?.passwordHash}</p>

        </div>
    );
}
