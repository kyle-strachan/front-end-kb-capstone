import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Paper from "@mui/material/Paper";
import DocTree from "../components/DocTree";
import RequestsOverview from '../components/RequestsOverview';
import DocSearch from '../components/DocSearchBox';
import PlaceholderAmenityRequest from '../components/PlaceholderAmenityRequest';

export default function Dashboard() {
    return (
        <div style={{ maxWidth: "1280px", height: "vh", margin: "0 auto", padding: "1rem" }}>
            {/* <h2>Dashboard</h2> */}
            <div style={{ display: "flex", flexDirection: "row", gap: "1rem", width: "100%" }}>
                <div>
                    <Paper style={{ width: "300px" }}>
                        <DocSearch />
                    </Paper>
                    <Paper style={{ width: "300px", marginBottom: "1rem" }}>
                        <DocTree />
                    </Paper>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%" }}>

                    <div style={{ width: "100%" }}>
                        <RequestsOverview />
                    </div>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                        gap: "1rem"
                    }}>
                        <PlaceholderAmenityRequest />
                        <PlaceholderAmenityRequest />
                        <PlaceholderAmenityRequest />
                        <PlaceholderAmenityRequest />
                        <PlaceholderAmenityRequest />
                        <PlaceholderAmenityRequest />
                    </div>
                </div>
            </div>
        </div>
    );
}
