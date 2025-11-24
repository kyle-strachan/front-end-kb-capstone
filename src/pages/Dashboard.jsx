import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Paper from "@mui/material/Paper";
import DocTree from "../components/DocTree";
import RequestsOverview from '../components/RequestsOverview';
import DocSearch from '../components/DocSearchBox';

export default function Dashboard() {
    return (
        <div style={{ maxWidth: "1280px", height: "vh", margin: "0 auto", padding: "1rem" }}>
            <h2>Dashboard</h2>
            <div style={{ display: "flex", gap: "1rem", width: "100%" }}>
                <div>
                    <Paper style={{ width: "300px" }}>
                        <DocSearch />
                    </Paper>
                    <Paper style={{ width: "300px", marginBottom: "1rem" }}>
                        <DocTree />
                    </Paper>
                </div>
                <div style={{ width: "100%" }}>
                    <RequestsOverview />
                </div>
            </div>
        </div>
    );
}
