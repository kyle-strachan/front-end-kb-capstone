import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../api";

export default function DepartmentCategories() {
    const { user } = useAuth();
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchDepartments() {
            try {
                const res = await api.get("/config/department-categories");
                console.log("Response payload", res.data);
                if (Array.isArray(res.data.categories)) {
                    setDepartments(res.data.categories);
                } else {
                    setDepartments([]);
                    setError(res.data.message || "No categories found.");
                }
            } catch (err) {
                console.error("Failed to fetch departments:", err.message);
                setError("Could not load department categories.");
            } finally {
                setLoading(false);
            }
        }


        fetchDepartments();
    }, []);

    if (loading) return <p>Loading department categories...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>Department Categories</h2>
            <p>Welcome, {user?.fullName || user?.username}</p>

            <ul>
                {(departments ?? []).map((dept) => (
                    <li key={dept._id}>{dept.categoryName}</li>
                ))}
            </ul>

        </div>
    );
}
