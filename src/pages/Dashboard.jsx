import { useAuth } from "../context/AuthContext";
import Button from '@mui/material/Button';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


export default function Dashboard() {
    const { user } = useAuth();
    return (
        <div>
            <h2>Dashboard</h2>
            <p>Welcome {user?.fullName || user?.username}</p>
            <Button variant="contained">Hello world</Button>
        </div>
    );
}
