// import { useAuth } from "../context/AuthContext";
import Button from '@mui/material/Button';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Paper from "@mui/material/Paper";
import { ToastContainer, toast } from 'react-toastify';
import DocTree from "../components/DocTree";

export default function Dashboard() {
    const notify = () => toast("This is a notification");
    return (
        <div style={{ maxWidth: "1280px", height: "vh", margin: "0 auto", padding: "1rem" }}>
            <h2>Dashboard</h2>
            <div style={{ display: "flex", gap: "1rem", width: "100%" }}>
                <div>
                    <Paper style={{ width: "300px" }}>
                        <DocTree />
                    </Paper>
                    <Paper>
                        This another box
                    </Paper>
                </div>
                <div>
                    <Paper sx={{ width: "100%", overflow: "hidden", padding: "20px" }}>
                        <h3>Departments</h3>
                        <button onClick={notify}>Notify!</button>
                        <h4>Add New</h4>
                    </Paper>
                    <Paper sx={{ mt: 4, p: 2 }}>
                        Body text
                    </Paper>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}
